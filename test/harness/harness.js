(function () {
  'use strict';
  const H = window.__HARNESS;
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  H.errors = H.errors || [];
  window.addEventListener('error', (event) => H.errors.push(String(event.message)));
  window.addEventListener('unhandledrejection', (event) => H.errors.push('rejection: ' + String(event.reason)));

  const mod = H.module;
  if (!mod) {
    H.errors.push('module loader did not receive a module');
    return;
  }
  const plugin = mod.factory((name) => {
    if (name === 'react') return React;
    if (name === 'react-dom') return ReactDOM;
    throw new Error('unexpected module request: ' + name);
  });

  const dictionaries = {};
  let activeLocale = 'zh';
  const localeListeners = new Set();
  const locale = {
    register(namespace, dicts) {
      dictionaries[namespace] = dicts;
      return () => {};
    },
    getSnapshot() {
      return activeLocale;
    },
    subscribe(listener) {
      localeListeners.add(listener);
      return () => localeListeners.delete(listener);
    },
    bind(namespace) {
      return (key, params) => {
        const dict = dictionaries[namespace] || {};
        const table = dict[activeLocale] || dict.en || {};
        let text = table[key] || key;
        if (params) {
          text = text.replace(/\{(\w+)\}/g, (match, name) => (params[name] === undefined ? match : String(params[name])));
        }
        return text;
      };
    },
  };
  H.setLocale = (id) => {
    activeLocale = id;
    for (const listener of localeListeners) listener();
  };

  const shell = {
    snapshot: { draft: 'existing text', phase: 'plain' },
    added: [],
    addAttachments(ids) {
      this.added.push(...ids);
      return true;
    },
    setDraft(text) {
      this.snapshot.draft = text;
      H.draftText = text;
    },
  };
  H.shell = shell;

  const drafts = [];
  let draftSeq = 0;
  const conversation = {
    input: {
      shell: (sessionId) => {
        H.shellSessionId = sessionId;
        return shell;
      },
    },
    createDrafts(sessionId, files, uploadImages) {
      const created = files.map((file) => ({ id: 'draft-' + ++draftSeq, file }));
      for (const entry of created) {
        drafts.push({ id: entry.id, name: entry.file.name, type: entry.file.type, size: entry.file.size, uploadImages, file: entry.file });
      }
      return created;
    },
    releaseDraftAttachments() {},
  };
  H.drafts = drafts;

  const sessions = {
    binding: () => ({ session: { getSnapshot: () => ({ subagent: null }) } }),
    list: { getSnapshot: () => ({ byId: { 'session-main': { title: 'Main working chat' } } }) },
  };
  // The main view points at another Session than the mounted test composer; the
  // insertion target must follow the main view, not the browser pane.
  const uiSession = { current: { getSnapshot: () => ({ sessionId: 'session-main' }) } };

  const registrations = [];
  const ctx = {
    effect(fn) {
      try {
        return fn();
      } catch (error) {
        H.errors.push('effect: ' + String(error && error.message));
        return () => {};
      }
    },
    slots: {
      inject(name, callback) {
        return callback();
      },
      register(definition, component) {
        registrations.push({ definition, component });
        return () => {};
      },
    },
    locale,
    get(name) {
      if (name === 'conversation') return conversation;
      if (name === 'sessions') return sessions;
      if (name === 'uiSession') return uiSession;
      return undefined;
    },
  };
  H.registrations = registrations;

  try {
    plugin.apply(ctx);
  } catch (error) {
    H.errors.push('apply: ' + String(error && error.stack));
    return;
  }

  const trigger = registrations.find((entry) => entry.definition.name === 'conversation.input.left');
  const overlay = registrations.find((entry) => entry.definition.name === 'shell.overlay');
  if (!trigger || !overlay) {
    H.errors.push('expected slot registrations are missing');
    return;
  }

  ReactDOM.createRoot(document.getElementById('composer-left')).render(
    React.createElement(trigger.component, { sessionId: 'session-1' }),
  );
  ReactDOM.createRoot(document.getElementById('overlay-root')).render(React.createElement(overlay.component));

  // Guest panel stub: this harness cannot host a real Electron <webview>.
  const guest = document.getElementById('guest');
  let guestViewport = { width: 620, height: 380, x: 0, y: 0, instance: 'guest-1' };
  let guestScroll = 0;
  let guestPng = '';
  const paintGuest = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = '#eef2f7';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#1f6feb';
    context.fillRect(width * 0.06, height * 0.1, width * 0.35, height * 0.16);
    context.fillStyle = '#111';
    context.font = '20px system-ui';
    context.fillText('Guest page', width * 0.06, height * 0.34);
    context.fillStyle = '#2ea043';
    context.fillRect(width * 0.06, height * 0.47, width * 0.29, height * 0.12);
    guestPng = canvas.toDataURL('image/png');
  };
  paintGuest(620, 380);
  guest.getURL = () => 'http://example.test/page';
  guest.executeJavaScript = (code) => {
    if (String(code).indexOf('prepareCapture') !== -1) {
      return Promise.resolve(Object.assign({}, guestViewport, { x: 0, y: guestScroll, revision: 1 }));
    }
    if (String(code).indexOf('captureValid') !== -1) return Promise.resolve(true);
    return Promise.resolve(true);
  };
  guest.capturePage = () => Promise.resolve({ toDataURL: () => guestPng });
  H.guestPick = (payload) => {
    if (payload && payload.viewport && Number.isFinite(payload.viewport.y)) guestScroll = payload.viewport.y;
    const event = new Event('console-message');
    event.message = '__DSH_ANNOTATE__' + JSON.stringify(payload);
    guest.dispatchEvent(event);
  };

  /** Switch the fake guest to a realistic viewport/raster for benchmarks. */
  H.configureGuest = (options) => {
    const opts = options || {};
    guestViewport = {
      width: opts.width || 1485,
      height: opts.height || 1284,
      x: 0,
      y: 0,
      instance: 'guest-bench',
    };
    guestScroll = 0;
    paintGuest(opts.imageWidth || 1600, opts.imageHeight || 1383);
  };

  H.guestPayload = {
    kind: 'pick',
    id: 'guest-1:1',
    tag: 'button',
    label: 'Buy now',
    text: 'Buy now',
    selector: 'button.buy',
    rect: { x: 40, y: 180, width: 180, height: 44 },
    viewport: guestViewport,
    scroll: { x: 0, y: 0 },
  };

  H.snapshot = () => ({
    card: !!document.querySelector('[data-annot-ui="card"]'),
    bar: !!document.querySelector('[data-annot-ui="bar"]'),
    trigger: !!document.querySelector('[data-annot-ui="trigger"]'),
    pins: document.querySelectorAll('[data-annot-ui="pin"]').length,
    added: shell.added.slice(),
    drafts: drafts.map(({ file, ...rest }) => rest),
    draftText: H.draftText || '',
    shellSessionId: H.shellSessionId || '',
    errors: H.errors.slice(),
  });

  /** Decoded image metadata plus a red-pixel count, proving boxes were painted. */
  H.measure = async () => {    const measured = [];
    for (const draft of drafts) {
      if (!draft.file || draft.type !== 'image/png') {
        measured.push({ name: draft.name, type: draft.type, size: draft.size, width: 0, height: 0, red: 0 });
        continue;
      }
      const bitmap = await createImageBitmap(draft.file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext('2d');
      context.drawImage(bitmap, 0, 0);
      const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let red = 0;
      for (let index = 0; index < data.length; index += 4) {
        if (data[index] > 180 && data[index + 1] < 110 && data[index + 2] < 110) red += 1;
      }
      measured.push({ name: draft.name, type: draft.type, size: draft.size, width: canvas.width, height: canvas.height, red: red });
      bitmap.close();
    }
    return measured;
  };

  /** Count pixels close to a target colour in one inserted screenshot. */
  H.countColor = async (index, target, tolerance) => {
    const draft = drafts[index];
    if (!draft || !draft.file) return 0;
    const bitmap = await createImageBitmap(draft.file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const tol = tolerance || 12;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.abs(data[i] - target[0]) <= tol
        && Math.abs(data[i + 1] - target[1]) <= tol
        && Math.abs(data[i + 2] - target[2]) <= tol) count += 1;
    }
    bitmap.close();
    return count;
  };

  /** Data URL of one inserted screenshot, for saving a visual sample. */
  H.shotDataUrl = (index) => new Promise((resolve) => {
    const draft = drafts[index];
    if (!draft || !draft.file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => resolve('');
    reader.readAsDataURL(draft.file);
  });

  H.setComment = (text) => {
    const area = document.querySelector('[data-annot-ui="card"] textarea');
    if (!area) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
    setter.call(area, text);
    area.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  };
  H.clickIn = (selector) => {
    const node = document.querySelector(selector);
    if (!node) return false;
    node.click();
    return true;
  };
  H.clickCardPrimary = () => {
    const card = document.querySelector('[data-annot-ui="card"]');
    const button = card && card.querySelector('.dsh-annot-btn--primary');
    if (!button) return false;
    button.click();
    return true;
  };
  H.clickBarPrimary = () => {
    const bar = document.querySelector('[data-annot-ui="bar"]');
    const button = bar && bar.querySelector('.dsh-annot-btn--primary');
    if (!button) return false;
    button.click();
    return true;
  };

  // --- benchmark helpers ---------------------------------------------------
  H.longTasks = [];
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        H.longTasks.push({ start: Math.round(entry.startTime), duration: Math.round(entry.duration) });
      }
    }).observe({ type: 'longtask', buffered: true });
  } catch (_error) {
    /* longtask is Chromium-only */
  }

  H.frames = (count) => new Promise((resolve) => {
    let left = Math.max(1, count || 1);
    const tick = () => {
      left -= 1;
      if (left <= 0) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  H.resetDraft = () => {
    shell.added.length = 0;
    drafts.length = 0;
    shell.snapshot.draft = 'existing text';
    H.draftText = '';
    H.shellSessionId = '';
    H.longTasks.length = 0;
    H.errors.length = 0;
  };

  H.startRun = () => {
    H.runSeq = (H.runSeq || 0) + 1;
    H.longTasks.length = 0;
    H.errors.length = 0;
    H.heapStart = performance.memory ? performance.memory.usedJSHeapSize : 0;
  };

  H.measureLight = async () => Promise.all(drafts.map(async (draft) => {
    const meta = { name: draft.name, type: draft.type, size: draft.size, width: 0, height: 0 };
    if (draft.file && draft.type === 'image/png') {
      const bitmap = await createImageBitmap(draft.file);
      meta.width = bitmap.width;
      meta.height = bitmap.height;
      bitmap.close();
    }
    return meta;
  }));

  /** Add `count` annotations through the real UI path (guest pick -> card -> Add). */
  H.addMany = async (count, options) => {
    const opts = options || {};
    const times = [];
    const started = performance.now();
    for (let i = 0; i < count; i += 1) {
      const at = performance.now();
      const scroll = opts.scrollEvery
        ? Math.floor(i / opts.scrollEvery) * (opts.scrollStep || 300)
        : 0;
      const cols = opts.cols || 20;
      const col = i % cols;
      const row = Math.floor(i / cols) % 20;
      H.guestPick({
        kind: 'pick',
        id: 'bench-' + H.runSeq + '-' + i,
        tag: 'div',
        label: 'Row ' + (i + 1),
        text: '',
        selector: 'div.row:nth-child(' + (i + 1) + ')',
        rect: { x: 30 + col * 60, y: 30 + row * 55, width: 44, height: 28 },
        viewport: { width: guestViewport.width, height: guestViewport.height, x: 0, y: scroll, instance: guestViewport.instance },
        scroll: { x: 0, y: scroll },
      });
      await H.frames(2);
      for (let retry = 0; retry < 12; retry += 1) {
        if (H.setComment('第 ' + (i + 1) + ' 条：这里的间距和对齐需要调整')) break;
        await H.frames(1);
      }
      await H.frames(1);
      H.clickCardPrimary();
      for (let retry = 0; retry < 20; retry += 1) {
        if (!document.querySelector('[data-annot-ui="card"]')) break;
        await H.frames(1);
      }
      await H.frames(1);
      if (document.querySelector('[data-annot-ui="card"]')) throw new Error('comment card did not close at item ' + (i + 1));
      times.push(performance.now() - at);
    }
    const total = performance.now() - started;
    const sorted = times.slice().sort((a, b) => a - b);
    return {
      count,
      added: H.itemCount(),
      total: Math.round(total),
      avg: Math.round((total / count) * 10) / 10,
      p95: Math.round(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] || 0),
      max: Math.round(sorted[sorted.length - 1] || 0),
    };
  };

  H.itemCount = () => {
    const node = document.querySelector('.dsh-annot-bar__count');
    return node ? Number(node.textContent) : 0;
  };

  H.errorText = () => {
    const node = document.querySelector('[data-annot-ui="error"]');
    return node ? node.textContent : '';
  };

  H.tryInsert = async () => {
    const before = shell.added.length;
    H.clickBarPrimary();
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return { added: shell.added.length - before, error: H.errorText() };
  };

  H.closeBar = () => {
    const bar = document.querySelector('[data-annot-ui="bar"]');
    const buttons = bar ? bar.querySelectorAll('button') : [];
    for (const button of buttons) {
      if (button.textContent.trim() === '关闭') {
        button.click();
        return true;
      }
    }
    return false;
  };

  H.insertNow = async () => {    const before = shell.added.length;
    const started = performance.now();
    H.clickBarPrimary();
    while (shell.added.length === before && performance.now() - started < 60000) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    return Math.round(performance.now() - started);
  };

  H.metrics = async () => {
    const images = await H.measureLight();
    const totalBytes = images.reduce((sum, item) => sum + item.size, 0);
    const durations = H.longTasks.map((entry) => entry.duration);
    return {
      added: shell.added.length,
      captionChars: (H.draftText || '').length,
      images,
      totalBytes,
      heapMB: performance.memory ? Math.round((performance.memory.usedJSHeapSize / 1048576) * 10) / 10 : null,
      longTasks: H.longTasks.length,
      longestTaskMs: durations.length ? Math.max(...durations) : 0,
      errors: H.errors.slice(),
    };
  };

  const wait = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  wait().then(() => {
    H.ready = !!document.querySelector('[data-annot-ui="trigger"]');
  });
})();
