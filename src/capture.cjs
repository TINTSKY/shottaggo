'use strict';

const { toSvg } = require('html-to-image');
const { clipRect } = require('./region.cjs');

/** Largest viewport we will rasterize before downscaling (4K-ish). */
const MAX_VIEWPORT_AREA = 9000000;
/** Longest edge of the PNG we hand to the composer. */
const MAX_EDGE = 1600;
const UI = '[data-annot-ui]';
const BOX_COLOR = '#ff3b30';

class CaptureError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function captureErrorKey(error) {
  const keys = {
    invalid: 'captureInvalid',
    tooLarge: 'captureTooLarge',
    assets: 'captureAssets',
    protected: 'captureProtected',
    decode: 'captureDecode',
    changed: 'captureChanged',
    guestUnavailable: 'captureGuestUnavailable',
    guest: 'captureGuestFailed',
  };
  return 'error.' + (keys[error && error.code] || (error && error.name === 'SecurityError' ? 'captureProtected' : 'captureFailed'));
}

function isUiNode(node) {
  return !!(node && typeof node.closest === 'function' && node.closest(UI));
}

async function decodeImage(dataUrl) {
  const image = new Image();
  image.src = dataUrl;
  try {
    await image.decode();
  } catch (_error) {
    throw new CaptureError('decode');
  }
  if (!image.naturalWidth || !image.naturalHeight) throw new CaptureError('decode');
  return image;
}

/** Downscale any raster to MAX_EDGE so one screenshot stays in a sane token budget. */
async function rasterize(dataUrl) {
  const image = await decodeImage(dataUrl);
  const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, width, height);
  return { dataUrl: canvas.toDataURL('image/png'), width: width, height: height };
}

/**
 * Keep layout placeholders for unrelated subtrees without reading their pixels or resources.
 * Ported from the upstream plugin: it keeps the captured page's geometry intact.
 */
function boundedSnapshot(rect) {
  const included = new Set([document.documentElement, document.body]);
  const marker = 'data-annot-layout-' + Math.random().toString(36).slice(2);
  for (const node of document.querySelectorAll('body *')) {
    if (node.closest(UI)) continue;
    const b = node.getBoundingClientRect();
    if (b.width <= 0 || b.height <= 0 || b.right <= rect.x || b.left >= rect.x + rect.width ||
        b.bottom <= rect.y || b.top >= rect.y + rect.height) continue;
    for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) included.add(ancestor);
  }
  const layouts = [];
  for (const parent of included) {
    parent.setAttribute(marker, String(layouts.length));
    const omitted = [];
    Array.from(parent.childNodes).forEach((node, index) => {
      if (node.nodeType !== 1 || included.has(node)) return;
      const style = getComputedStyle(node);
      let css = '';
      for (const key of ['display', 'position', 'inset', 'inset-block', 'inset-inline', 'width', 'height',
        'min-width', 'max-width', 'min-height', 'max-height', 'box-sizing', 'margin', 'padding', 'border-width',
        'border-style', 'flex', 'order', 'align-self', 'justify-self', 'grid-area', 'float', 'clear',
        'vertical-align', 'aspect-ratio', 'writing-mode', 'font-size', 'line-height', 'transform',
        'transform-origin', 'translate', 'rotate', 'scale', 'zoom']) {
        css += key + ':' + style.getPropertyValue(key) + ';';
      }
      omitted.push({ index, css });
    });
    layouts.push({ parent, omitted });
  }
  return {
    filter: (node) => node.nodeType !== 1
      || (included.has(node) && !(node.matches && node.matches('[data-annot-broken]'))),
    restore: () => layouts.forEach(({ parent }) => parent.removeAttribute(marker)),
    fill(svg) {
      layouts.forEach(({ omitted }, id) => {
        const parent = svg.querySelector('[' + marker + '="' + id + '"]');
        if (!parent) return;
        omitted.forEach(({ index, css }) => {
          const placeholder = svg.createElementNS('http://www.w3.org/1999/xhtml', 'div');
          placeholder.style.cssText = css;
          Object.assign(placeholder.style, { visibility: 'hidden', background: 'none', mask: 'none',
            webkitMask: 'none', borderImageSource: 'none', listStyleImage: 'none', filter: 'none' });
          parent.insertBefore(placeholder, parent.childNodes[index] || null);
        });
        parent.removeAttribute(marker);
      });
    },
  };
}

/**
 * Save image/canvas pixels into data URLs before cloning. This keeps images in
 * the snapshot even when their URLs are un-fetchable (custom schemes, auth
 * routes), and drops only the ones the browser genuinely cannot read (tainted
 * canvas, unloaded image).
 */
async function prepareMedia(viewport) {
  const changed = [];
  const broken = [];
  const mark = (node) => {
    node.setAttribute('data-annot-broken', '1');
    broken.push(node);
  };
  const visible = (node) => {
    const rect = node.getBoundingClientRect();
    return rect.width >= 1 && rect.height >= 1 && rect.right > 0 && rect.bottom > 0
      && rect.left < viewport.width && rect.top < viewport.height;
  };
  for (const image of Array.from(document.images || [])) {
    if (!visible(image)) continue;
    if (!image.naturalWidth || !image.naturalHeight) {
      mark(image);
      continue;
    }
    const src = image.currentSrc || image.src;
    if (!src || /^data:/i.test(src)) continue;
    if (image.naturalWidth * image.naturalHeight > 16000000) continue; // leave huge photos to html-to-image
    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('no 2d context');
      context.drawImage(image, 0, 0);
      let dataUrl = canvas.toDataURL('image/webp', 0.95);
      if (!/^data:image\/webp/i.test(dataUrl)) dataUrl = canvas.toDataURL('image/png');
      changed.push({ image, src: image.getAttribute('src'), srcset: image.getAttribute('srcset') });
      image.removeAttribute('srcset');
      image.setAttribute('src', dataUrl);
    } catch (_error) {
      // Cross-origin pixels without CORS, broken SVG, protected video frame…
      mark(image);
    }
  }
  for (const canvas of Array.from(document.querySelectorAll('canvas'))) {
    if (!visible(canvas)) continue;
    try {
      canvas.toDataURL();
    } catch (_error) {
      mark(canvas);
    }
  }
  return {
    getCount: () => broken.length,
    /** Last-resort fallback: exclude every image and canvas and retry. */
    markAll: () => {
      for (const image of Array.from(document.images || [])) mark(image);
      for (const canvas of Array.from(document.querySelectorAll('canvas'))) mark(canvas);
    },
    restore: () => {
      for (const entry of changed) {
        if (entry.src === null) entry.image.removeAttribute('src');
        else entry.image.setAttribute('src', entry.src);
        if (entry.srcset === null) entry.image.removeAttribute('srcset');
        else entry.image.setAttribute('srcset', entry.srcset);
      }
      for (const node of broken) node.removeAttribute('data-annot-broken');
    },
  };
}

/**
 * Serialize the whole Harness window into an SVG snapshot, reconstructing scroll
 * offsets and fixed/sticky content that plain DOM cloning loses.
 */
async function hostSnapshot(viewport) {
  const rect = { x: 0, y: 0, width: viewport.width, height: viewport.height };
  const box = clipRect(rect, viewport.width, viewport.height, 1);
  if (!box) throw new CaptureError('invalid');
  const snapshot = boundedSnapshot(box);
  const media = await prepareMedia(viewport);
  const marker = 'data-annot-scroll-' + Math.random().toString(36).slice(2);
  const scrollers = [];
  const positioned = [];
  for (const node of document.querySelectorAll('*')) {
    if (!node.closest(UI) && (node.scrollTop || node.scrollLeft)) {
      node.setAttribute(marker, String(scrollers.length));
      scrollers.push({ node, x: node.scrollLeft, y: node.scrollTop, width: node.scrollWidth, height: node.scrollHeight });
    }
  }
  for (const node of document.querySelectorAll('*')) {
    if (node.closest(UI) || !scrollers.some((entry) => entry.node.contains(node))) continue;
    if (!['fixed', 'sticky'].includes(getComputedStyle(node).position)) continue;
    node.setAttribute(marker + '-position', String(positioned.length));
    positioned.push({ node, rect: node.getBoundingClientRect() });
  }
  let data;
  try {
    data = await toSvg(document.documentElement, { width: viewport.width, height: viewport.height,
      skipFonts: true, cacheBust: false, filter: snapshot.filter });
  } catch (error) {
    if (error && error.name === 'SecurityError') throw new CaptureError('protected');
    // One stubborn image should not lose the whole screenshot: drop every
    // image from the clone and try once more.
    media.markAll();
    try {
      data = await toSvg(document.documentElement, { width: viewport.width, height: viewport.height,
        skipFonts: true, cacheBust: false, filter: snapshot.filter });
    } catch (_retry) {
      throw new CaptureError('assets');
    }
  } finally {
    snapshot.restore();
    media.restore();
    scrollers.forEach(({ node }) => node.removeAttribute(marker));
    positioned.forEach(({ node }) => node.removeAttribute(marker + '-position'));
  }
  const svg = new DOMParser().parseFromString(decodeURIComponent(data.slice(data.indexOf(',') + 1)), 'image/svg+xml');
  if (svg.querySelector('parsererror')) throw new CaptureError('decode');
  snapshot.fill(svg);
  for (const [index, scroll] of scrollers.entries()) {
    const node = svg.querySelector('[' + marker + '="' + index + '"]');
    if (!node) continue;
    const inner = svg.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    for (const key of ['display', 'flexDirection', 'flexWrap', 'alignItems', 'alignContent', 'justifyContent',
      'justifyItems', 'gap', 'gridTemplateColumns', 'gridTemplateRows', 'gridAutoColumns', 'gridAutoRows',
      'gridAutoFlow', 'padding', 'writingMode']) inner.style[key] = node.style[key];
    while (node.firstChild) inner.appendChild(node.firstChild);
    Object.assign(inner.style, { position: 'relative', top: '0', left: '0', margin: '0', border: '0',
      width: scroll.width + 'px', height: scroll.height + 'px', boxSizing: 'border-box',
      overflow: 'visible', transform: `translate(${-scroll.x}px, ${-scroll.y}px)` });
    Object.assign(node.style, { display: 'block', padding: '0', paddingBlock: '0', paddingInline: '0', overflow: 'hidden' });
    node.appendChild(inner);
  }
  for (const [index, entry] of positioned.entries()) {
    const node = svg.querySelector('[' + marker + '-position="' + index + '"]');
    if (!node) continue;
    const placeholder = node.cloneNode(true);
    placeholder.style.visibility = 'hidden';
    placeholder.removeAttribute(marker + '-position');
    placeholder.querySelectorAll('[' + marker + '-position]').forEach((child) => child.removeAttribute(marker + '-position'));
    node.replaceWith(placeholder);
    const { x, y, width, height } = entry.rect;
    const values = { position: 'absolute', inset: `${y}px auto auto ${x}px`,
      insetBlock: `${y}px auto`, insetInline: `${x}px auto`, margin: '0', marginBlock: '0', marginInline: '0',
      width: width + 'px', inlineSize: width + 'px', height: height + 'px', blockSize: height + 'px',
      boxSizing: 'border-box', transform: 'none' };
    for (const [key, value] of Object.entries(values)) node.style.setProperty(key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()), value, 'important');
    svg.querySelector('foreignObject').firstElementChild.appendChild(node);
  }
  return {
    dataUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg)),
    skipped: media.getCount(),
  };
}

/** Full Harness window, one image per viewport state. */
async function captureHostViewport() {
  const viewport = { width: window.innerWidth, height: window.innerHeight, x: window.scrollX, y: window.scrollY };
  if (!(viewport.width > 0 && viewport.height > 0)) throw new CaptureError('invalid');
  if (viewport.width * viewport.height > MAX_VIEWPORT_AREA) throw new CaptureError('tooLarge');
  const snapshot = await hostSnapshot(viewport);
  const shot = await rasterize(snapshot.dataUrl);
  return {
    dataUrl: shot.dataUrl,
    image: { width: shot.width, height: shot.height },
    viewport: viewport,
    skipped: snapshot.skipped,
  };
}

/**
 * Full viewport of a Browser panel guest. The guest hides its own markers first,
 * so the base image never contains annotation chrome; boxes are drawn afterwards.
 */
async function captureGuestViewport(wv) {
  if (!wv || typeof wv.capturePage !== 'function' || typeof wv.executeJavaScript !== 'function') {
    throw new CaptureError('guestUnavailable');
  }
  let viewport;
  try {
    viewport = await wv.executeJavaScript('window.__dshAnnotate && window.__dshAnnotate.prepareCapture()');
  } catch (_error) {
    throw new CaptureError('guest');
  }
  if (!viewport || !['width', 'height', 'x', 'y'].every((key) => Number.isFinite(viewport[key]))) {
    throw new CaptureError('changed');
  }
  if (viewport.width * viewport.height > MAX_VIEWPORT_AREA) throw new CaptureError('tooLarge');
  let shot;
  try {
    const image = await wv.capturePage();
    shot = await rasterize(image.toDataURL());
  } catch (error) {
    if (error instanceof CaptureError) throw error;
    throw new CaptureError('guest');
  } finally {
    try {
      await wv.executeJavaScript('window.__dshAnnotate && window.__dshAnnotate.finishCapture()');
    } catch (_error) {
      /* the guest may be gone; the capture result still stands */
    }
  }
  let valid = false;
  try {
    valid = await wv.executeJavaScript(
      'window.__dshAnnotate && window.__dshAnnotate.captureValid(' + JSON.stringify(viewport) + ')',
    );
  } catch (_error) {
    valid = false;
  }
  if (!valid) throw new CaptureError('changed');
  return { dataUrl: shot.dataUrl, image: { width: shot.width, height: shot.height }, viewport: viewport };
}

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  context.beginPath();
  if (typeof context.roundRect === 'function') {
    context.roundRect(x, y, width, height, r);
    return;
  }
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

/**
 * Draw the numbered boxes over one base screenshot.
 * Rects are CSS pixels in the base's viewport; the image may be downscaled.
 */
async function drawAnnotations(base, items, color) {
  const image = await decodeImage(base.dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new CaptureError('decode');
  context.drawImage(image, 0, 0);
  const viewport = base.viewport || { width: canvas.width, height: canvas.height };
  const sx = canvas.width / viewport.width;
  const sy = canvas.height / viewport.height;
  const stroke = Math.max(2, Math.round(2.5 * Math.max(sx, sy)));
  const halo = Math.max(1, Math.round(stroke * 0.6));
  const radius = Math.max(2, Math.round(4 * Math.max(sx, sy)));
  const accent = color || BOX_COLOR;
  const badgeRadius = Math.max(10, Math.round(11 * Math.max(sx, sy)));
  for (const item of items) {
    const box = clipRect(item.rect, viewport.width, viewport.height, 2);
    if (!box) continue;
    const x = box.x * sx;
    const y = box.y * sy;
    const width = Math.max(1, box.width * sx);
    const height = Math.max(1, box.height * sy);
    // White halo keeps the red frame visible on red/dark content.
    roundedRect(context, x - halo, y - halo, width + halo * 2, height + halo * 2, radius + halo);
    context.lineWidth = stroke + halo * 2;
    context.strokeStyle = 'rgba(255,255,255,0.92)';
    context.stroke();
    roundedRect(context, x, y, width, height, radius);
    context.lineWidth = stroke;
    context.strokeStyle = accent;
    context.stroke();
    // Number badge, centred on the top-left corner but kept inside the image.
    const cx = Math.min(Math.max(badgeRadius, x), Math.max(badgeRadius, canvas.width - badgeRadius));
    const cy = Math.min(Math.max(badgeRadius, y), Math.max(badgeRadius, canvas.height - badgeRadius));
    context.beginPath();
    context.arc(cx, cy, badgeRadius, 0, Math.PI * 2);
    context.fillStyle = accent;
    context.fill();
    context.lineWidth = Math.max(1, Math.round(badgeRadius * 0.18));
    context.strokeStyle = 'rgba(255,255,255,0.95)';
    context.stroke();
    context.fillStyle = '#ffffff';
    context.font = '600 ' + Math.round(badgeRadius * 1.05) + 'px "Segoe UI", system-ui, -apple-system, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(String(item.index), cx, cy + Math.round(badgeRadius * 0.05));
  }
  return canvas.toDataURL('image/png');
}

module.exports = {
  CaptureError,
  captureErrorKey,
  rasterize,
  captureHostViewport,
  captureGuestViewport,
  drawAnnotations,
  BOX_COLOR,
  MAX_EDGE,
};
