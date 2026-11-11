'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { clipRect, dragRect, pixelRect, installRegionPicker } = require('../src/region.cjs');
const { createRegionTools } = require('../src/region.cjs');
const { formatInsertText } = require('../src/lib.cjs');

test('bundled picker helpers survive serialization into an isolated guest scope', () => {
  // The guest script embeds createRegionTools.toString(); rebuilding it from
  // source text reproduces that scope without a bundler.
  const factory = new Function('return (' + createRegionTools.toString() + ')')();
  const tools = factory();
  const rect = tools.dragRect({ x: 80, y: 90 }, { x: 10, y: 20 }, 100, 100);
  assert.deepEqual(JSON.parse(JSON.stringify(rect)), { x: 10, y: 20, width: 70, height: 70 });
  assert.equal(typeof tools.installRegionPicker, 'function');
});

test('region normalization handles all drag directions and viewport clipping', () => {
  for (const [a, b] of [[{ x: 10, y: 20 }, { x: 80, y: 90 }], [{ x: 80, y: 90 }, { x: 10, y: 20 }],
    [{ x: 80, y: 20 }, { x: 10, y: 90 }], [{ x: 10, y: 90 }, { x: 80, y: 20 }]]) {
    assert.deepEqual(dragRect(a, b, 100, 100), { x: 10, y: 20, width: 70, height: 70 });
  }
  assert.deepEqual(dragRect({ x: 20, y: 20 }, { x: 150, y: -10 }, 100, 100), { x: 20, y: 0, width: 80, height: 20 });
});

test('invalid, empty and tiny rectangles never produce an annotation', () => {
  for (const value of [NaN, Infinity, -Infinity, '5', undefined]) {
    assert.equal(clipRect({ x: value, y: 0, width: 10, height: 10 }, 100, 100), null);
  }
  for (const size of [0, -1, NaN, Infinity]) {
    assert.equal(clipRect({ x: 0, y: 0, width: size, height: 10 }, 100, 100), null);
  }
  assert.equal(dragRect({ x: 1, y: 1 }, { x: 3, y: 40 }, 100, 100), null);
  assert.equal(clipRect({ x: 120, y: 0, width: 10, height: 10 }, 100, 100), null);
});

test('raster coordinates use independent image-to-viewport ratios, including fractional DPR', () => {
  assert.deepEqual(pixelRect({ x: 10, y: 20, width: 30, height: 40 }, { width: 100, height: 100 },
    { width: 200, height: 150 }), { x: 20, y: 30, width: 60, height: 60 });
  assert.deepEqual(pixelRect({ x: 0.5, y: 0.5, width: 10, height: 10 }, { width: 100, height: 100 },
    { width: 125, height: 125 }), { x: 0, y: 0, width: 14, height: 14 });
});

function pickerHarness() {
  const handlers = {}, selected = [], previews = [], clicks = [];
  const target = { addEventListener: (n, f) => { handlers[n] = f; }, removeEventListener: (n) => { delete handlers[n]; } };
  const picker = installRegionPicker(target, { blocked: () => false, ignore: (e) => e.ui,
    bounds: () => ({ width: 100, height: 100 }), preview: (r) => previews.push(r), click: (point) => clicks.push(point), select: (r) => selected.push(r) });
  function fire(name, values = {}) {
    const e = { target: { setPointerCapture() {}, releasePointerCapture() {} }, button: 0, buttons: 1, pointerId: 1,
      clientX: 10, clientY: 10, preventDefault() { this.prevented = true; }, stopImmediatePropagation() {}, ...values };
    handlers[name]?.(e);
    return e;
  }
  return { handlers, selected, previews, clicks, picker, fire };
}

test('pointer picker captures reverse outside release and allows repeated selections', () => {
  const h = pickerHarness();
  for (let i = 0; i < 2; i++) {
    assert.ok(h.fire('pointerdown', { clientX: 80, clientY: 90 }).prevented);
    h.fire('pointermove', { clientX: -20, clientY: -30 });
    h.fire('pointerup', { clientX: -20, clientY: -30 });
  }
  assert.deepEqual(h.selected, Array(2).fill({ x: 0, y: 0, width: 80, height: 90 }));
});

test('cancel, lost capture, pointercancel, no held button and UI controls abort safely', () => {
  for (const reason of ['cancel', 'lostpointercapture', 'pointercancel', 'pointermove']) {
    const h = pickerHarness(); h.fire('pointerdown');
    if (reason === 'cancel') assert.equal(h.picker.cancel(), true);
    else h.fire(reason, { buttons: 0 });
    h.fire('pointerup', { clientX: 90, clientY: 90 });
    assert.equal(h.selected.length, 0); assert.equal(h.clicks.length, 0);
    h.picker.destroy(); assert.deepEqual(Object.keys(h.handlers), []);
  }
  const h = pickerHarness();
  assert.equal(h.fire('pointerdown', { ui: true }).prevented, undefined);
  h.fire('pointerup', { clientX: 90, clientY: 90 });
  assert.equal(h.selected.length, 0);
});

test('click and sub-threshold jitter pick the original element; threshold starts a region', () => {
  for (const offset of [0, 1, 3.99]) {
    const h = pickerHarness(); h.fire('pointerdown');
    h.fire('pointermove', { clientX: 10 + offset });
    assert.equal(h.picker.isDragging(), false);
    h.fire('pointerup', { clientX: 10 + offset });
    assert.equal(h.clicks.length, 1); assert.equal(h.clicks[0].x, 10);
    assert.equal(h.selected.length, 0);
  }
  const h = pickerHarness(); h.fire('pointerdown');
  h.fire('pointermove', { clientX: 14 });
  assert.equal(h.picker.isDragging(), true);
  h.fire('pointerup', { clientX: 14, clientY: 14 });
  assert.equal(h.selected.length, 1); assert.equal(h.clicks.length, 0);
});

test('a thin drag or a drag returning to its start never falls back to an element click', () => {
  for (const end of [{ clientX: 11, clientY: 70 }, { clientX: 10, clientY: 10 }]) {
    const h = pickerHarness(); h.fire('pointerdown');
    h.fire('pointermove', { clientX: 60, clientY: 60 });
    h.fire('pointerup', end);
    assert.equal(h.selected.length, 0); assert.equal(h.clicks.length, 0);
  }
});

test('captions number annotations globally, group by screenshot and cite selectors', () => {
  const calls = [];
  const t = (key, params) => { calls.push([key, params]); return key; };
  const text = formatInsertText([
    { index: 1, url: 'http://localhost:3000/', viewport: { width: 1440, height: 900 }, scroll: { x: 0, y: 0 },
      items: [{ index: 1, desc: { label: 'Save', selector: 'button#save' }, comment: 'no-op', rect: { x: 10, y: 20, width: 30, height: 40 } }] },
    { index: 2, url: 'http://localhost:3000/', viewport: { width: 1440, height: 900 }, scroll: { x: 0, y: 420 },
      items: [{ index: 2, desc: { label: 'Region', surface: 'browser' }, comment: '', rect: { x: 1, y: 2, width: 30, height: 40 } }] },
  ], t);
  assert.deepEqual(calls.map(([key]) => key),
    ['insert.head', 'insert.shot', 'insert.item', 'insert.where', 'insert.rect', 'insert.shot', 'insert.noComment', 'insert.item', 'insert.rect']);
  assert.equal(calls[2][1].index, 1);
  assert.equal(calls[7][1].comment, 'insert.noComment');
  assert.equal(calls[5][1].y, 420);
  assert.equal(typeof text, 'string');
});
