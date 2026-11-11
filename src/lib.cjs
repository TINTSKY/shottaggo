'use strict';

/** Trim and collapse whitespace for one-line labels. */
function clip(text, max) {
  const limit = max === undefined ? 140 : max;
  const value = String(text === undefined || text === null ? '' : text).replace(/\s+/g, ' ').trim();
  return value.length > limit ? value.slice(0, limit - 1) + '…' : value;
}

function cssEscape(value) {
  if (typeof CSS !== 'undefined' && CSS && typeof CSS.escape === 'function') return CSS.escape(String(value));
  return String(value).replace(/[^a-zA-Z0-9_-]/g, (ch) => '\\' + ch);
}

/** Short human label for an element: aria label, title, alt, placeholder, or its text. */
function elementLabel(el) {
  if (!el || typeof el.getAttribute !== 'function') return '';
  const read = (name) => {
    try {
      return el.getAttribute(name);
    } catch (_error) {
      return null;
    }
  };
  const text = el.innerText !== undefined && el.innerText !== null ? el.innerText : el.textContent;
  const parts = [read('aria-label'), read('title'), read('alt'), read('placeholder'), text]
    .map((part) => clip(part, 90))
    .filter((part) => part !== '');
  const unique = parts.filter((part, index) => parts.indexOf(part) === index);
  if (unique.length > 0) return unique[0];
  return el.tagName ? String(el.tagName).toLowerCase() : '';
}

/** Bounded CSS selector path that survives a DOM snapshot without external deps. */
function selectorOf(el, depth) {
  const limit = depth === undefined ? 4 : depth;
  const parts = [];
  let node = el;
  while (node && node.nodeType === 1 && parts.length < limit) {
    let part = String(node.tagName).toLowerCase();
    const id = node.getAttribute && node.getAttribute('id');
    if (id) {
      parts.unshift(part + '#' + cssEscape(id));
      break;
    }
    const classes = node.classList ? Array.prototype.slice.call(node.classList, 0, 2) : [];
    if (classes.length > 0) part += '.' + classes.map(cssEscape).join('.');
    const parent = node.parentElement;
    if (parent) {
      const siblings = Array.prototype.filter.call(parent.children, (child) => child.tagName === node.tagName);
      if (siblings.length > 1) part += ':nth-of-type(' + (siblings.indexOf(node) + 1) + ')';
    }
    parts.unshift(part);
    node = node.parentElement;
  }
  return parts.join(' > ');
}

function rectOf(el) {
  if (!el || typeof el.getBoundingClientRect !== 'function') return null;
  const rect = el.getBoundingClientRect();
  return {
    x: Math.round(rect.left),
    y: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

function describeElement(el) {
  if (!el) return null;
  return {
    tag: String(el.tagName || '').toLowerCase(),
    label: elementLabel(el),
    text: clip(el.innerText !== undefined && el.innerText !== null ? el.innerText : el.textContent, 200),
    selector: selectorOf(el),
    rect: rectOf(el),
  };
}

/** Decode a base64 data URL into bytes without fetch (CSP-independent). */
function dataUrlToBytes(dataUrl) {
  const text = String(dataUrl);
  const comma = text.indexOf(',');
  if (comma < 0) throw new Error('not a data URL');
  const meta = text.slice(0, comma);
  if (!/;base64/i.test(meta)) throw new Error('not base64');
  const binary = atob(text.slice(comma + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { mediaType: meta.slice(5).split(';')[0] || 'image/png', bytes };
}

/**
 * Caption that travels with the screenshots into the composer.
 * One block per screenshot; numbers match the red badges on the image.
 * groups: [{ index, url, viewport: {width,height}, scroll: {x,y}, items: [...] }]
 */
function formatInsertText(groups, t) {
  const lines = [t('insert.head')];
  groups.forEach((group) => {
    const viewport = group.viewport || {};
    const scroll = group.scroll || { x: 0, y: 0 };
    lines.push(t('insert.shot', {
      url: group.url || '',
      width: Math.round(viewport.width || 0),
      height: Math.round(viewport.height || 0),
      x: Math.round(scroll.x || 0),
      y: Math.round(scroll.y || 0),
    }));
    group.items.forEach((item) => {
      const label = (item.desc && (item.desc.label || item.desc.tag)) || t('insert.regionLabel');
      lines.push(t('insert.item', {
        index: item.index,
        label: clip(label, 80),
        comment: clip(String(item.comment || '').trim(), 300) || t('insert.noComment'),
      }));
      if (item.desc && item.desc.selector) lines.push(t('insert.where', { selector: clip(item.desc.selector, 240) }));
      const rect = item.rect || {};
      lines.push(t('insert.rect', {
        x: Math.round(rect.x || 0),
        y: Math.round(rect.y || 0),
        width: Math.round(rect.width || 0),
        height: Math.round(rect.height || 0),
      }));
    });
  });
  return lines.join('\n');
}

module.exports = {
  clip: clip,
  cssEscape: cssEscape,
  elementLabel: elementLabel,
  selectorOf: selectorOf,
  rectOf: rectOf,
  describeElement: describeElement,
  dataUrlToBytes: dataUrlToBytes,
  formatInsertText: formatInsertText,
};
