'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const lib = require('../src/lib.cjs');
const guest = require('../src/guest.cjs');

function fakeElement(tagName, extras) {
  const element = Object.assign(
    {
      nodeType: 1,
      tagName: tagName.toUpperCase(),
      classList: [],
      children: [],
      parentElement: null,
      attributes: {},
      innerText: '',
    },
    extras || {},
  );
  element.getAttribute = (name) => (name in element.attributes ? element.attributes[name] : null);
  return element;
}

test('clip collapses whitespace and bounds length', () => {
  assert.equal(lib.clip('  a \n  b  '), 'a b');
  assert.equal(lib.clip('abcdef', 4), 'abc…');
});

test('selectorOf builds a bounded path with nth-of-type', () => {
  const parent = fakeElement('div');
  const first = fakeElement('span', { innerText: 'first' });
  const second = fakeElement('span', { classList: ['label', 'wide'] });
  parent.children = [first, second];
  first.parentElement = parent;
  second.parentElement = parent;
  assert.equal(lib.selectorOf(second, 2), 'div > span.label.wide:nth-of-type(2)');
});

test('elementLabel prefers aria-label over text', () => {
  const el = fakeElement('button', { innerText: 'Send', attributes: { 'aria-label': 'Send message' } });
  assert.equal(lib.elementLabel(el), 'Send message');
});

test('dataUrlToBytes decodes a tiny png payload', () => {
  const decoded = lib.dataUrlToBytes('data:image/png;base64,AAEC');
  assert.equal(decoded.mediaType, 'image/png');
  assert.deepEqual(Array.from(decoded.bytes), [0, 1, 2]);
  assert.throws(() => lib.dataUrlToBytes('data:image/png,raw'));
});

test('guest scripts parse and carry the console marker', () => {
  assert.equal(typeof guest.GUEST_INSTALL, 'string');
  assert.ok(guest.GUEST_INSTALL.includes(guest.MARK));
  assert.ok(guest.GUEST_INSTALL.includes('__BOX__'));
  assert.doesNotThrow(() => new Function(guest.GUEST_INSTALL));
  assert.doesNotThrow(() => new Function(guest.GUEST_REMOVE));
  assert.doesNotThrow(() => new Function(guest.GUEST_FREEZE));
  assert.doesNotThrow(() => new Function(guest.GUEST_RESUME));
});

test('guest install script accepts the box color substitution used by the client', () => {
  const filled = guest.GUEST_INSTALL
    .split('__BOX__').join('#ff3b30')
    .split('__ACCENT__').join('#3b82f6')
    .split('__ON_ACCENT__').join('#ffffff');
  assert.ok(filled.includes('#ff3b30'));
  assert.ok(!filled.includes('__BOX__'));
  assert.doesNotThrow(() => new Function(filled));
});
