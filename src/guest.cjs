'use strict';

/**
 * Scripts injected into a Browser panel guest page (<webview>) because a
 * cross-origin guest document is otherwise unreachable from the Harness page.
 * The guest owns its hover highlight and reports picks through console text.
 */
const { createRegionTools } = require('./region.cjs');

const MARK = '__DSH_ANNOTATE__';

const GUEST_INSTALL = `(function () {
  var MARK = '${MARK}';
  var tools = (${createRegionTools.toString()})();
  var installRegionPicker = tools.installRegionPicker;
  var revision = 0;
  var instance = Math.random().toString(36).slice(2);
  var capturing = false;
  function viewport() { return { width: innerWidth, height: innerHeight, x: scrollX, y: scrollY, revision: revision, instance: instance }; }
  function emit(payload) { console.log(MARK + JSON.stringify(payload)); }
  function hide() { box.style.display = 'none'; label.style.display = 'none'; }
  if (window.__dshAnnotate) { try { window.__dshAnnotate.destroy(); } catch (error) {} }
  var BOX = '__BOX__';
  var HIT = 'position:fixed;pointer-events:none;border:2px solid __ACCENT__;background:color-mix(in srgb,__ACCENT__ 16%,transparent);border-radius:3px;z-index:2147483647;display:none;box-sizing:border-box';
  var LABEL = 'position:fixed;pointer-events:none;background:__ACCENT__;color:__ON_ACCENT__;font:11px/1.5 -apple-system,system-ui,sans-serif;padding:1px 6px;border-radius:3px;z-index:2147483647;display:none;white-space:nowrap;max-width:60vw;overflow:hidden;text-overflow:ellipsis';
  var layer = document.createElement('div');
  layer.setAttribute('data-dsh-annotate', '1');
  layer.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:transparent;pointer-events:none';
  var box = document.createElement('div');
  box.style.cssText = HIT;
  var label = document.createElement('div');
  label.style.cssText = LABEL;
  function clip(value, max) {
    var text = String(value == null ? '' : value).replace(/\\s+/g, ' ').trim();
    return text.length > max ? text.slice(0, max - 1) + '…' : text;
  }
  function describe(el) {
    var read = function (name) { try { return el.getAttribute(name); } catch (error) { return null; } };
    var text = el.innerText != null ? el.innerText : el.textContent;
    var label = clip(read('aria-label') || read('title') || read('alt') || read('placeholder') || text, 90);
    var parts = [];
    var node = el;
    var depth = 0;
    while (node && node.nodeType === 1 && depth < 4) {
      var part = String(node.tagName).toLowerCase();
      if (node.getAttribute && node.getAttribute('id')) { parts.unshift(part + '#' + node.getAttribute('id')); break; }
      var classes = node.classList ? Array.prototype.slice.call(node.classList, 0, 2) : [];
      if (classes.length) part += '.' + classes.join('.');
      var parent = node.parentElement;
      if (parent) {
        var same = Array.prototype.filter.call(parent.children, function (child) { return child.tagName === node.tagName; });
        if (same.length > 1) part += ':nth-of-type(' + (same.indexOf(node) + 1) + ')';
      }
      parts.unshift(part);
      node = node.parentElement;
      depth += 1;
    }
    var rect = el.getBoundingClientRect();
    return {
      tag: String(el.tagName).toLowerCase(),
      label: label,
      text: clip(text, 200),
      selector: parts.join(' > '),
      rect: { x: Math.round(rect.left), y: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) }
    };
  }
  function hit(x, y) {
    var list = document.elementsFromPoint(x, y);
    for (var i = 0; i < list.length; i += 1) {
      var el = list[i];
      if (el === layer || el === box || el === label) continue;
      if (el.closest && el.closest('[data-dsh-annotate]')) continue;
      return el;
    }
    return null;
  }
  /** Scroll offsets of every scrollable ancestor: regions follow content without assuming an element moves. */
  function scrollChain(el) {
    var chain = [];
    var root = document.scrollingElement || document.documentElement;
    for (var node = el; node; node = node.parentElement) {
      if (node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1) {
        chain.push({ el: node, top: node.scrollTop, left: node.scrollLeft });
      }
    }
    var known = chain.some(function (entry) { return entry.el === root; });
    if (!known) chain.push({ el: root, top: root.scrollTop, left: root.scrollLeft });
    return chain;
  }
  function chainDelta(entry) {
    var chain = entry.chain || [];
    var dx = 0; var dy = 0;
    for (var i = 0; i < chain.length; i += 1) {
      if (!chain[i].el.isConnected) return null;
      dx -= chain[i].el.scrollLeft - chain[i].left;
      dy -= chain[i].el.scrollTop - chain[i].top;
    }
    return { dx: dx, dy: dy };
  }
  function regionNow(entry) {
    var width = Math.round(entry.region.width);
    var height = Math.round(entry.region.height);
    // Scroll offsets are stable even when the page recycles the element under
    // the selection; element movement covers transform-based scrolling.
    var delta = chainDelta(entry);
    if (delta && (Math.abs(delta.dx) > 1 || Math.abs(delta.dy) > 1)) {
      return { x: Math.round(entry.region.x + delta.dx), y: Math.round(entry.region.y + delta.dy), width: width, height: height };
    }
    if (entry.el && entry.el.isConnected && entry.base) {
      var bounds = entry.el.getBoundingClientRect();
      var movedX = bounds.left - entry.base.left;
      var movedY = bounds.top - entry.base.top;
      if (Math.abs(movedX) > 1 || Math.abs(movedY) > 1) {
        return { x: Math.round(entry.region.x + movedX), y: Math.round(entry.region.y + movedY), width: width, height: height };
      }
    }
    if (delta) return { x: Math.round(entry.region.x + delta.dx), y: Math.round(entry.region.y + delta.dy), width: width, height: height };
    return null;
  }
  var adopted = [];
  var markerLayer = null;
  var markerNodes = new Map();
  function elementNow(entry) {
    if (!entry.el || !entry.el.isConnected) return null;
    var bounds = entry.el.getBoundingClientRect();
    return { x: Math.round(bounds.left), y: Math.round(bounds.top), width: Math.round(bounds.width), height: Math.round(bounds.height) };
  }
  function markers() {
    if (!markerLayer) {
      markerLayer = document.createElement('div');
      markerLayer.setAttribute('data-dsh-annotate', '1');
      markerLayer.setAttribute('data-dsh-annotate-markers', '1');
      markerLayer.style.cssText = 'position:fixed;inset:0;z-index:2147483645;pointer-events:none;overflow:hidden';
      document.documentElement.appendChild(markerLayer);
    }
    return markerLayer;
  }
  var pendingId = null;
  function addMarker(id, index) {
    markers();
    if (markerNodes.has(id)) return;
    var outline = document.createElement('div');
    outline.style.cssText = 'position:fixed;pointer-events:none;border:2px solid ' + BOX + ';border-radius:3px;box-sizing:border-box;opacity:.95;display:none';
    var pin = document.createElement('button');
    pin.type = 'button';
    pin.textContent = String(index);
    pin.style.cssText = 'position:fixed;pointer-events:auto;width:22px;height:22px;padding:0;border:0;border-radius:11px;background:' + BOX + ';color:#fff;font:600 12px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.28);display:none';
    pin.addEventListener('click', function (event) { event.preventDefault(); event.stopImmediatePropagation(); emit({ kind: 'pin', id: id }); }, true);
    markers().appendChild(outline);
    markers().appendChild(pin);
    markerNodes.set(id, { outline: outline, pin: pin });
    paintMarkers();
  }
  function dropMarker(id) {
    var node = markerNodes.get(id);
    if (!node) return;
    try { node.outline.remove(); node.pin.remove(); } catch (error) {}
    markerNodes.delete(id);
  }
  function adopt(list) {
    adopted = Array.isArray(list) ? list : [];
    markers();
    markerNodes.forEach(function (node, id) {
      var keep = adopted.some(function (item) { return item.id === id; }) || id === pendingId;
      if (!keep) dropMarker(id);
    });
    adopted.forEach(function (item) {
      if (!item || typeof item.id !== 'string') return;
      addMarker(item.id, item.index);
      var node = markerNodes.get(item.id);
      if (node) node.pin.textContent = String(item.index);
    });
    if (pendingId && adopted.some(function (item) { return item.id === pendingId; })) pendingId = null;
    paintMarkers();
  }
  function paintMarkers() {
    if (!markerNodes.size) return;
    markerNodes.forEach(function (node, id) {
      var entry = null;
      for (var i = 0; i < picks.length; i += 1) if (picks[i].id === id) { entry = picks[i]; break; }
      var rect = entry ? (entry.region ? regionNow(entry) : elementNow(entry)) : null;
      if (!rect) { node.outline.style.display = 'none'; node.pin.style.display = 'none'; return; }
      Object.assign(node.outline.style, { display: 'block', left: rect.x + 'px', top: rect.y + 'px', width: rect.width + 'px', height: rect.height + 'px' });
      Object.assign(node.pin.style, { display: 'block', left: Math.max(0, rect.x - 11) + 'px', top: Math.max(0, rect.y - 11) + 'px' });
    });
  }
  function show(el) {
    if (!el) { box.style.display = 'none'; label.style.display = 'none'; return; }
    var rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) { box.style.display = 'none'; label.style.display = 'none'; return; }
    box.style.display = 'block';
    box.style.left = rect.left + 'px';
    box.style.top = rect.top + 'px';
    box.style.width = rect.width + 'px';
    box.style.height = rect.height + 'px';
    var info = describe(el);
    label.textContent = info.tag + (info.label ? ' · ' + clip(info.label, 48) : '');
    label.style.display = 'block';
    var below = rect.top + 20 < window.innerHeight;
    label.style.left = Math.max(2, Math.min(rect.left, window.innerWidth - 220)) + 'px';
    label.style.top = (below ? rect.top + 2 : Math.max(2, rect.top - 20)) + 'px';
  }
  var frozen = false;
  var frozenEl = null;
  var scrollFrame = 0;
  var picker;
  var picks = [];
  var pickSeq = 0;
  function reportMoves() {
    if (!picks.length) return;
    picks = picks.filter(function (entry) { return entry.region || (entry.el && entry.el.isConnected); });
    for (var i = 0; i < picks.length; i += 1) {
      var entry = picks[i];
      var bounds = entry.region ? null : entry.el.getBoundingClientRect();
      var rect = entry.region
        ? regionNow(entry)
        : { x: Math.round(bounds.left), y: Math.round(bounds.top), width: Math.round(bounds.width), height: Math.round(bounds.height) };
      if (!rect) continue;
      var last = picks[i].last;
      if (last && last.x === rect.x && last.y === rect.y && last.width === rect.width && last.height === rect.height) continue;
      picks[i].last = rect;
      emit({ kind: 'move', id: picks[i].id, rect: rect, viewport: viewport() });
    }
  }
  var monitorFrame = 0;
  function monitor() {
    monitorFrame = requestAnimationFrame(monitor);
    if (picks.length) reportMoves();
    paintMarkers();
  }
  function reportScroll() {
    revision += 1;
    if (picker) picker.cancel();
    hide();
    if (frozen && frozenEl && frozenEl.isConnected) show(frozenEl);
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(function () {
      scrollFrame = 0;
      try { console.log(MARK + JSON.stringify({ kind: 'scroll', width: innerWidth, height: innerHeight, x: window.scrollX, y: window.scrollY, revision: revision })); } catch (error) {}
      reportMoves();
    });
  }
  window.addEventListener('scroll', reportScroll, true);
  window.addEventListener('resize', reportScroll, true);
  function onHover(event) {
    if (frozen || capturing || picker.isDragging()) return;
    if (event.target instanceof Element && event.target.closest('[data-dsh-annotate]')) return;
    show(hit(event.clientX, event.clientY));
  }
  function own(event) { return event.target instanceof Element && !!event.target.closest('[data-dsh-annotate]'); }
  function onDown(event) { if (own(event)) return; event.preventDefault(); event.stopImmediatePropagation(); }
  function onClick(event) { if (own(event)) return; event.preventDefault(); event.stopImmediatePropagation(); }
  function onContext(event) { if (own(event)) return; event.preventDefault(); }
  document.addEventListener('mousemove', onHover, true);
  document.addEventListener('mousedown', onDown, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('contextmenu', onContext, true);
  var cursorStyle = document.createElement('style');
  cursorStyle.setAttribute('data-dsh-annotate', '1');
  cursorStyle.textContent = 'html,html *{cursor:crosshair !important}';
  document.documentElement.appendChild(cursorStyle);
  function pickElement(point) {
    if (frozen || capturing) return;
    var el = hit(point.x, point.y);
    if (!el) return;
    frozen = true;
    frozenEl = el;
    var id = instance + ':' + String(++pickSeq);
    picks.push({ id: id, el: el });
    pendingId = id;
    addMarker(id, pickSeq);
    var info = describe(el);
    info.kind = 'pick';
    info.id = id;
    info.viewport = viewport();
    info.scroll = { x: window.scrollX, y: window.scrollY };
    try { console.log(MARK + JSON.stringify(info)); } catch (error) {}
  }
  picker = installRegionPicker(document, {
    ignore: function () { return false; },
    blocked: function () { return frozen || capturing; },
    bounds: viewport,
    click: pickElement,
    preview: function (rect) {
      hide();
      if (!rect) return;
      Object.assign(box.style, { display: 'block', left: rect.x + 'px', top: rect.y + 'px', width: rect.width + 'px', height: rect.height + 'px' });
    },
    select: function (rect) {
      frozen = true;
      var id = instance + ':r' + String(++pickSeq);
      pendingId = id;
      addMarker(id, pickSeq);
      var anchor = hit(rect.x + rect.width / 2, rect.y + rect.height / 2) || hit(rect.x + 2, rect.y + 2);
      if (anchor) {
        var bounds = anchor.getBoundingClientRect();
        picks.push({ id: id, el: anchor, region: rect, chain: scrollChain(anchor),
          base: { left: bounds.left, top: bounds.top },
          offset: { dx: rect.x - bounds.left, dy: rect.y - bounds.top } });
      }
      emit({ kind: 'region', id: id, rect: rect, viewport: viewport(), scroll: { x: scrollX, y: scrollY } });
    }
  });
  function onKey(event) {
    if (event.key !== 'Escape') return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (!picker.cancel()) emit({ kind: 'escape' });
  }
  function onBlur() { picker.cancel(); }
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('blur', onBlur);
  document.documentElement.appendChild(box);
  document.documentElement.appendChild(label);
  document.documentElement.appendChild(layer);
  monitorFrame = requestAnimationFrame(monitor);
  window.__dshAnnotate = {
    freeze: function () { frozen = true; picker.cancel(); },
    prepareCapture: async function (expected) {
      var now = viewport();
      if (expected && !['width', 'height', 'instance'].every(function (key) { return now[key] === expected[key]; })) return null;
      capturing = true; hide();
      if (!markerLayer) markers();
      markerLayer.style.visibility = 'hidden';
      await new Promise(function (resolve) { requestAnimationFrame(function () { requestAnimationFrame(resolve); }); });
      return window.__dshAnnotate && window.__dshAnnotate.captureValid(now) ? now : null;
    },
    captureValid: function (expected) {
      var now = viewport();
      return !!expected && ['width', 'height', 'instance'].every(function (key) { return now[key] === expected[key]; });
    },
    finishCapture: function () {
      capturing = false;
      if (markerLayer) markerLayer.style.visibility = '';
      if (!frozen) hide();
    },
    resume: function () {
      frozen = false;
      picker.cancel();
      frozenEl = null;
      frozenEl = null;
      box.style.display = 'none';
      label.style.display = 'none';
    },
    scroll: reportScroll,
    adopt: adopt,
    forget: function (id) { if (typeof id === 'string') { dropMarker(id); if (pendingId === id) pendingId = null; } },
    /** Current viewport rects of every tracked pick, for host-side polling. */
    geometry: function () {
      var out = [];
      for (var i = 0; i < picks.length; i += 1) {
        var entry = picks[i];
        var rect;
        if (entry.region) rect = regionNow(entry);
        else if (entry.el && entry.el.isConnected) {
          var bounds = entry.el.getBoundingClientRect();
          rect = { x: Math.round(bounds.left), y: Math.round(bounds.top), width: Math.round(bounds.width), height: Math.round(bounds.height) };
        }
        if (rect) out.push({ id: entry.id, rect: rect });
      }
      return out;
    },
    destroy: function () {
      picker.destroy();
      cancelAnimationFrame(monitorFrame);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mousemove', onHover, true);
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('contextmenu', onContext, true);
      picks = [];
      adopted = [];
      markerNodes.clear();
      try { layer.remove(); box.remove(); label.remove(); cursorStyle.remove(); } catch (error) {}
      try { if (markerLayer) markerLayer.remove(); } catch (error) {}
      window.removeEventListener('scroll', reportScroll, true);
      window.removeEventListener('resize', reportScroll, true);
      window.__dshAnnotate = null;
    }
  };
  emit({ kind: 'ready', width: innerWidth, height: innerHeight, x: scrollX, y: scrollY, revision: revision });
  return true;
})()`;

const GUEST_FREEZE = `(function () {
  if (window.__dshAnnotate && window.__dshAnnotate.freeze) window.__dshAnnotate.freeze();
  return true;
})()`;

const GUEST_RESUME = `(function () {
  if (window.__dshAnnotate && window.__dshAnnotate.resume) window.__dshAnnotate.resume();
  return true;
})()`;

const GUEST_REMOVE = `(function () {
  if (window.__dshAnnotate) { try { window.__dshAnnotate.destroy(); } catch (error) {} }
  window.__dshAnnotate = null;
  return true;
})()`;

module.exports = { MARK: MARK, GUEST_INSTALL: GUEST_INSTALL, GUEST_REMOVE: GUEST_REMOVE, GUEST_FREEZE: GUEST_FREEZE, GUEST_RESUME: GUEST_RESUME };
