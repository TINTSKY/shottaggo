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
  const locale = {
    register(namespace, dicts) {
      dictionaries[namespace] = dicts;
      return () => {};
    },
    bind(namespace) {
      return (key, params) => {
        const table = (dictionaries[namespace] && (dictionaries[namespace].zh || dictionaries[namespace].en)) || {};
        let text = table[key] || key;
        if (params) {
          text = text.replace(/\{(\w+)\}/g, (match, name) => (params[name] === undefined ? match : String(params[name])));
        }
        return text;
      };
    },
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
  const guestViewport = { width: 620, height: 380, x: 0, y: 0, instance: 'guest-1' };
  const canvas = document.createElement('canvas');
  canvas.width = 620;
  canvas.height = 380;
  const context = canvas.getContext('2d');
  context.fillStyle = '#eef2f7';
  context.fillRect(0, 0, 620, 380);
  context.fillStyle = '#1f6feb';
  context.fillRect(40, 40, 220, 60);
  context.fillStyle = '#111';
  context.font = '18px system-ui';
  context.fillText('Guest page', 40, 130);
  context.fillStyle = '#2ea043';
  context.fillRect(40, 180, 180, 44);
  const guestPng = canvas.toDataURL('image/png');
  guest.getURL = () => 'http://example.test/page';
  guest.executeJavaScript = (code) => {
    if (String(code).indexOf('prepareCapture') !== -1) return Promise.resolve(Object.assign({}, guestViewport, { revision: 1 }));
    if (String(code).indexOf('captureValid') !== -1) return Promise.resolve(true);
    return Promise.resolve(true);
  };
  guest.capturePage = () => Promise.resolve({ toDataURL: () => guestPng });
  H.guestPick = (payload) => {
    const event = new Event('console-message');
    event.message = '__DSH_ANNOTATE__' + JSON.stringify(payload);
    guest.dispatchEvent(event);
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

  const wait = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  wait().then(() => {
    H.ready = !!document.querySelector('[data-annot-ui="trigger"]');
  });
})();
