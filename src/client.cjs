'use strict';

const React = require('react');
const {
  CaptureError,
  captureErrorKey,
  captureHostViewport,
  captureGuestViewport,
  drawAnnotations,
} = require('./capture.cjs');
const { clipRect, installRegionPicker } = require('./region.cjs');
const { describeElement, dataUrlToBytes, formatInsertText, clip } = require('./lib.cjs');
const { MARK, GUEST_INSTALL, GUEST_REMOVE, GUEST_FREEZE, GUEST_RESUME } = require('./guest.cjs');

const NS = 'annotateViewport';
const UI = '[data-annot-ui]';
const BOX = '#ff3b30';

const CSS = `
.dsh-annot-trigger{position:relative;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;flex:none}
.dsh-annot-trigger__badge{position:absolute;top:-2px;right:-3px;min-width:13px;height:13px;padding:0 3px;border-radius:7px;background:${BOX};color:#fff;font:600 9px/13px system-ui,sans-serif;text-align:center}
.dsh-annot-trigger:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-annot-trigger--active{background:color-mix(in srgb,${BOX} 16%,transparent);color:${BOX}}
.dsh-annot-layer{position:fixed;inset:0;z-index:9000;pointer-events:none}
.dsh-annot-bar{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:6px 8px 6px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 6px 24px rgba(0,0,0,.18);font:12px/1.4 system-ui,-apple-system,sans-serif;pointer-events:auto;max-width:min(820px,94vw)}
.dsh-annot-bar__hint{color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:340px}
.dsh-annot-bar__count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:${BOX};color:#fff;font-weight:600}
.dsh-annot-chip{appearance:none;min-width:22px;height:22px;padding:0 6px;border:1px solid ${BOX};background:color-mix(in srgb,${BOX} 12%,transparent);color:${BOX};border-radius:11px;font:600 11px/1 system-ui,sans-serif;cursor:pointer}
.dsh-annot-chip:hover{background:color-mix(in srgb,${BOX} 22%,transparent)}
.dsh-annot-btn{appearance:none;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:7px;padding:4px 10px;font:12px/1.3 inherit;cursor:pointer;white-space:nowrap}
.dsh-annot-btn:hover:enabled{background:var(--dsw-alias-bg-layer-2)}
.dsh-annot-btn:disabled{opacity:.5;cursor:default}
.dsh-annot-btn--primary{border-color:transparent;background:${BOX};color:#fff}
.dsh-annot-btn--primary:hover:enabled{filter:brightness(1.06)}
.dsh-annot-btn--danger{color:var(--dsw-alias-state-error-primary)}
.dsh-annot-hover{position:fixed;pointer-events:none;border:2px solid var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 14%,transparent);border-radius:3px;box-sizing:border-box}
.dsh-annot-hover__tag{position:fixed;pointer-events:none;max-width:60vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:1px 6px;border-radius:4px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff);font:11px/1.5 system-ui,-apple-system,sans-serif}
.dsh-annot-outline{position:fixed;pointer-events:none;border:2px solid ${BOX};border-radius:3px;box-sizing:border-box;box-shadow:0 0 0 1px rgba(255,255,255,.85)}
.dsh-annot-pin{position:fixed;pointer-events:auto;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:0;border-radius:11px;background:${BOX};color:#fff;font:600 12px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.28)}
.dsh-annot-card{position:fixed;width:320px;pointer-events:auto;padding:10px;display:flex;flex-direction:column;gap:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 10px 30px rgba(0,0,0,.22);font:12px/1.45 system-ui,-apple-system,sans-serif}
.dsh-annot-card__title{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-annot-card__input{width:100%;box-sizing:border-box;resize:vertical;min-height:64px;padding:6px 8px;border-radius:7px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit}
.dsh-annot-card__input:focus{outline:2px solid ${BOX};outline-offset:0}
.dsh-annot-card__where{color:var(--dsw-alias-label-secondary);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-annot-card__rows{display:flex;gap:6px;justify-content:flex-end}
.dsh-annot-error{position:fixed;bottom:62px;left:50%;transform:translateX(-50%);pointer-events:none;max-width:80vw;padding:6px 12px;border-radius:8px;background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-label-primary-foreground,#fff);font:12px/1.4 system-ui,-apple-system,sans-serif;z-index:9001}
`;

const ICON = React.createElement(
  'svg',
  { viewBox: '0 0 16 16', width: 16, height: 16, 'aria-hidden': true, focusable: false },
  React.createElement('path', {
    d: 'M2.5 2.5h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8l-3 2.5V11.5H2.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.2,
    strokeLinejoin: 'round',
  }),
  React.createElement('rect', { x: 3.5, y: 4.5, width: 9, height: 6, rx: 1, fill: 'none', stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '2 1.4' }),
);

function createStore() {
  let state = { active: false, sessionId: undefined, count: 0 };
  const listeners = new Set();
  return {
    get: () => state,
    set(patch) {
      state = Object.assign({}, state, patch);
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function boxOf(rect) {
  if (!rect) return null;
  const x = rect.x !== undefined ? rect.x : rect.left;
  const y = rect.y !== undefined ? rect.y : rect.top;
  const width = rect.width;
  const height = rect.height;
  if (![x, y, width, height].every(Number.isFinite) || width < 1 || height < 1) return null;
  return { x: x, y: y, width: width, height: height };
}

function Trigger({ props, store, t }) {
  const state = React.useSyncExternalStore(store.subscribe, store.get, store.get);
  React.useEffect(() => {
    store.set({ sessionId: props && props.sessionId });
  }, [props && props.sessionId]);
  return React.createElement(
    'button',
    {
      type: 'button',
      'data-annot-ui': 'trigger',
      className: 'dsh-annot-trigger' + (state.active ? ' dsh-annot-trigger--active' : ''),
      title: state.count > 0 ? t('trigger.titleCount', { count: state.count }) : t('trigger.title'),
      'aria-label': t('trigger.title'),
      'aria-pressed': state.active,
      onClick: () => store.set({ active: !state.active }),
    },
    ICON,
    state.count > 0 && !state.active
      ? React.createElement('span', { className: 'dsh-annot-trigger__badge' }, String(state.count))
      : null,
  );
}

function Overlay({ ctx, store, t }) {
  const state = React.useSyncExternalStore(store.subscribe, store.get, store.get);
  const [items, setItems] = React.useState([]);
  const [draft, setDraftState] = React.useState(null);
  const [hover, setHover] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [, setTick] = React.useState(0);

  const itemsRef = React.useRef(items);
  const draftRef = React.useRef(null);
  const basesRef = React.useRef(new Map());
  const guestStatesRef = React.useRef(new Map());
  const guestsRef = React.useRef([]);
  const captureChainsRef = React.useRef(new Map());
  const pickerRef = React.useRef(null);
  const seqRef = React.useRef(0);
  const sessionRef = React.useRef(undefined);
  const busyRef = React.useRef(false);

  itemsRef.current = items;
  draftRef.current = draft;
  busyRef.current = busy;

  const setDraft = (value) => {
    draftRef.current = value;
    setDraftState(value);
  };
  const bump = () => setTick((value) => value + 1);

  const boxKey = (surface, st) => {
    if (!st) return '';
    return [
      surface,
      st.instance || '',
      Math.round(st.x || 0),
      Math.round(st.y || 0),
      Math.round(st.width || 0),
      Math.round(st.height || 0),
    ].join('|');
  };
  const hostState = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    x: window.scrollX,
    y: window.scrollY,
    instance: 'harness',
  });
  const guestState = (wv) => guestStatesRef.current.get(wv) || null;
  const currentKey = (surface, wv) => boxKey(surface, surface === 'browser' ? guestState(wv) : hostState());

  const itemVisible = (item) => {
    if (!item || !item.key) return false;
    return item.key === currentKey(item.surface, item.wv);
  };

  const isUiTarget = (target) => target instanceof Element && !!target.closest(UI);

  const pickAt = (x, y) => {
    const list = document.elementsFromPoint(x, y);
    for (const el of list) {
      if (el instanceof Element && el.closest(UI)) continue;
      return el;
    }
    return null;
  };

  /** Screenshot of the current viewport for this surface; reused by later picks in the same state. */
  const ensureBase = (surface, wv, st) => {
    const key = boxKey(surface, st);
    const existing = basesRef.current.get(key);
    if (existing && existing.status !== 'error') return existing;
    if (existing) basesRef.current.delete(key);
    const base = {
      key,
      surface,
      wv: wv || null,
      state: Object.assign({}, st),
      viewport: { width: st.width, height: st.height },
      dataUrl: null,
      image: null,
      url: surface === 'browser' ? safeGuestUrl(wv) : location.href,
      status: 'capturing',
      errorKey: null,
      ready: null,
    };
    basesRef.current.set(key, base);
    const chainKey = wv || 'harness';
    const previous = captureChainsRef.current.get(chainKey) || Promise.resolve();
    const run = previous
      .catch(() => {})
      .then(async () => {
        const shot = surface === 'browser' ? await captureGuestViewport(wv) : await captureHostViewport();
        const now = shot.viewport || {};
        const moved =
          Math.abs((now.x || 0) - (base.state.x || 0)) > 1 ||
          Math.abs((now.y || 0) - (base.state.y || 0)) > 1 ||
          Math.round(now.width) !== Math.round(base.state.width) ||
          Math.round(now.height) !== Math.round(base.state.height) ||
          (now.instance && base.state.instance && now.instance !== base.state.instance);
        if (moved) throw new CaptureError('changed');
        return shot;
      });
    captureChainsRef.current.set(chainKey, run.catch(() => {}));
    base.ready = run
      .then((shot) => {
        base.dataUrl = shot.dataUrl;
        base.image = shot.image;
        base.viewport = { width: shot.viewport.width, height: shot.viewport.height };
        base.state = Object.assign({}, base.state, {
          x: shot.viewport.x,
          y: shot.viewport.y,
          width: shot.viewport.width,
          height: shot.viewport.height,
        });
        base.status = 'ready';
        bump();
      })
      .catch((failure) => {
        base.status = 'error';
        base.errorKey = captureErrorKey(failure);
        bump();
      });
    return base;
  };

  const addItem = (surface, wv, st, rect, desc, guestId) => {
    const base = ensureBase(surface, wv, st);
    const item = {
      id: 'a' + Math.random().toString(36).slice(2),
      index: ++seqRef.current,
      key: base.key,
      surface: surface,
      wv: wv || null,
      guestId: guestId || null,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      desc: desc || {},
      comment: '',
    };
    setItems((prev) => prev.concat([item]));
    return item;
  };

  const openDraft = (item) => {
    setError('');
    setDraft({ itemId: item.id, comment: item.comment || '', editing: true });
  };

  const clearAll = (resetSeq) => {
    setItems([]);
    itemsRef.current = [];
    basesRef.current.clear();
    if (resetSeq) seqRef.current = 0;
    setDraft(null);
    setHover(null);
    store.set({ count: 0 });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id));
    setDraft(null);
  };

  React.useEffect(() => {
    store.set({ count: items.length });
  }, [items.length]);

  React.useEffect(() => {
    if (!error) return undefined;
    const timer = setTimeout(() => setError(''), 9000);
    return () => clearTimeout(timer);
  }, [error]);

  const isActive = state.active;

  React.useEffect(() => {
    if (sessionRef.current === undefined) {
      sessionRef.current = state.sessionId;
      return;
    }
    if (state.sessionId !== sessionRef.current) {
      sessionRef.current = state.sessionId;
      clearAll(true);
    }
  }, [state.sessionId]);

  // Leaving the mode hides its card but keeps collected annotations.
  React.useEffect(() => {
    if (!isActive) {
      setDraft(null);
      setHover(null);
    }
  }, [isActive]);

  /** Guest gestures: install selection script, sync numbered markers, collect picks. */
  React.useEffect(() => {
    if (!isActive) return undefined;
    const guests = [];
    const watched = new WeakSet();
    let disposed = false;

    const guestList = (wv) => {
      const st = guestStatesRef.current.get(wv);
      if (!st) return [];
      const key = boxKey('browser', st);
      return itemsRef.current
        .filter((item) => item.surface === 'browser' && item.wv === wv && item.key === key && item.guestId)
        .map((item) => ({ id: item.guestId, index: item.index }));
    };
    const adoptInto = (wv) => {
      try {
        const pending = wv.executeJavaScript(
          'window.__dshAnnotate && window.__dshAnnotate.adopt ? (window.__dshAnnotate.adopt(' +
            JSON.stringify(guestList(wv)) +
            '), true) : false',
        );
        if (pending && typeof pending.catch === 'function') pending.catch(() => {});
      } catch (_error) {
        /* guest gone */
      }
    };

    const detach = (wv) => {
      const index = guests.findIndex((pair) => pair[0] === wv);
      if (index === -1) return;
      try {
        guests[index][0].removeEventListener('console-message', guests[index][1]);
        wv.removeEventListener('did-start-navigation', guests[index][2]);
      } catch (_error) {
        /* gone */
      }
      guests.splice(index, 1);
      guestsRef.current = guests;
    };

    // A new document loses the injected script and every box's coordinates.
    const forgetGuest = (wv) => {
      for (const key of Array.from(basesRef.current.keys())) {
        const base = basesRef.current.get(key);
        if (base && base.surface === 'browser' && base.wv === wv) basesRef.current.delete(key);
      }
      guestStatesRef.current.delete(wv);
      setItems((prev) => prev.filter((entry) => !(entry.surface === 'browser' && entry.wv === wv)));
      setHover(null);
    };

    const onMessage = (wv, ...args) => {
      const message = args
        .map((value) => (typeof value === 'string' ? value : value && value.message))
        .find((value) => typeof value === 'string' && value.indexOf(MARK) === 0);
      if (!message) return;
      let payload;
      try {
        payload = JSON.parse(message.slice(MARK.length));
      } catch (_error) {
        return;
      }
      if (payload && payload.kind === 'escape') {
        onEscape();
        return;
      }
      if (payload && (payload.kind === 'ready' || payload.kind === 'scroll')) {
        if (Number.isFinite(payload.width) && Number.isFinite(payload.height)) {
          guestStatesRef.current.set(wv, {
            width: payload.width,
            height: payload.height,
            x: Number(payload.x) || 0,
            y: Number(payload.y) || 0,
            instance: payload.instance || '',
          });
        }
        if (payload.kind === 'scroll') {
          setHover(null);
          bump();
        }
        return;
      }
      if (payload && payload.kind === 'pin') {
        const item = itemsRef.current.find((entry) => entry.guestId === payload.id);
        if (item) openDraft(item);
        return;
      }
      if (!payload || !['pick', 'region'].includes(payload.kind)) return;
      const st = payload.viewport;
      if (!st || !['width', 'height', 'x', 'y'].every((key) => Number.isFinite(st[key]))) return;
      const rect = clipRect(payload.rect, st.width, st.height, payload.kind === 'region' ? 4 : 2);
      if (!rect) return;
      guestStatesRef.current.set(wv, {
        width: st.width,
        height: st.height,
        x: st.x,
        y: st.y,
        instance: st.instance || '',
      });
      if (payload.kind === 'region') {
        const item = addItem(
          'browser',
          wv,
          { width: st.width, height: st.height, x: st.x, y: st.y, instance: st.instance || '' },
          rect,
          { label: t('region.label'), surface: 'browser' },
          payload.id,
        );
        setDraft({ itemId: item.id, comment: '', editing: false });
        setHover(null);
        return;
      }
      const item = addItem(
        'browser',
        wv,
        { width: st.width, height: st.height, x: st.x, y: st.y, instance: st.instance || '' },
        rect,
        {
          tag: clip(payload.tag, 40),
          label: clip(payload.label, 90),
          text: clip(payload.text, 200),
          selector: clip(payload.selector, 300),
        },
        payload.id,
      );
      setDraft({ itemId: item.id, comment: '', editing: false });
      setHover(null);
    };

    const install = () => {
      if (disposed) return;
      for (const wv of Array.from(document.querySelectorAll('webview'))) {
        if (guests.some((pair) => pair[0] === wv)) continue;
        const rect = wv.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        if (!watched.has(wv)) {
          watched.add(wv);
          wv.addEventListener('did-stop-loading', () => {
            detach(wv);
            install();
          });
        }
        try {
          const pending = wv.executeJavaScript(guestInstallScript());
          if (pending && typeof pending.catch === 'function') pending.catch(() => {});
        } catch (_error) {
          /* guest annotation stays unavailable for this tab */
        }
        const handler = (...args) => onMessage(wv, ...args);
        const navigate = () => forgetGuest(wv);
        wv.addEventListener('console-message', handler);
        wv.addEventListener('did-start-navigation', navigate);
        guests.push([wv, handler, navigate]);
      }
      guestsRef.current = guests;
    };

    const uninstall = () => {
      disposed = true;
      for (const pair of guests) {
        try {
          pair[0].removeEventListener('console-message', pair[1]);
          pair[0].removeEventListener('did-start-navigation', pair[2]);
          const pending = pair[0].executeJavaScript(GUEST_REMOVE);
          if (pending && typeof pending.catch === 'function') pending.catch(() => {});
        } catch (_error) {
          /* gone */
        }
      }
      guests.length = 0;
      guestsRef.current = [];
    };

    install();
    const poll = setInterval(() => {
      install();
      for (const pair of guests) adoptInto(pair[0]);
    }, 150);

    return () => {
      clearInterval(poll);
      uninstall();
    };
  }, [isActive, t]);

  /** Host gestures: hover, click pick, drag region, Escape. */
  React.useEffect(() => {
    if (!isActive) return undefined;
    const onMove = (event) => {
      if (pickerRef.current && pickerRef.current.isDragging()) return;
      if (draftRef.current || busyRef.current) return;
      if (isUiTarget(event.target)) return;
      const el = pickAt(event.clientX, event.clientY);
      if (!el) {
        setHover(null);
        return;
      }
      if (String(el.tagName).toLowerCase() === 'webview') {
        setHover(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) {
        setHover(null);
        return;
      }
      setHover({ x: rect.left, y: rect.top, width: rect.width, height: rect.height, desc: describeElement(el) });
    };
    const pickElement = ({ x, y }) => {
      if (draftRef.current || busyRef.current) return;
      const el = pickAt(x, y);
      if (!el) return;
      if (String(el.tagName).toLowerCase() === 'webview') {
        setError(t('error.guestHint'));
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const item = addItem(
        'harness',
        null,
        hostState(),
        { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
        describeElement(el),
        null,
      );
      setDraft({ itemId: item.id, comment: '', editing: false });
      setHover(null);
    };
    const stop = (event) => {
      if (isUiTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const onEscape = () => {
      if (pickerRef.current && pickerRef.current.cancel()) return;
      const current = draftRef.current;
      if (current) {
        const item = itemsRef.current.find((entry) => entry.id === current.itemId);
        if (!current.editing && item) removeItem(item.id);
        else setDraft(null);
        return;
      }
      store.set({ active: false });
    };
    const escapeHandler = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onEscape();
    };
    const picker = installRegionPicker(document, {
      ignore: (event) => isUiTarget(event.target),
      blocked: () => !!draftRef.current || busyRef.current,
      bounds: () => ({ width: window.innerWidth, height: window.innerHeight }),
      preview: setHover,
      click: pickElement,
      select: (rect) => {
        const overlapsGuest = Array.from(document.querySelectorAll('webview')).some((wv) => {
          const b = wv.getBoundingClientRect();
          return rect.x < b.right && rect.x + rect.width > b.left && rect.y < b.bottom && rect.y + rect.height > b.top;
        });
        if (overlapsGuest) {
          setError(t('error.guestHint'));
          return;
        }
        const item = addItem('harness', null, hostState(), rect, { label: t('region.label'), surface: 'harness' }, null);
        setDraft({ itemId: item.id, comment: '', editing: false });
      },
    });
    pickerRef.current = picker;
    const onScroll = (event) => {
      if (isUiTarget(event.target)) return;
      setHover(null);
      bump();
    };
    const onBlur = () => picker.cancel();
    window.addEventListener('blur', onBlur);
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('mousedown', stop, true);
    document.addEventListener('pointerdown', stop, true);
    document.addEventListener('click', stop, true);
    document.addEventListener('keydown', escapeHandler, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll, true);
    return () => {
      picker.destroy();
      pickerRef.current = null;
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('mousedown', stop, true);
      document.removeEventListener('pointerdown', stop, true);
      document.removeEventListener('click', stop, true);
      document.removeEventListener('keydown', escapeHandler, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll, true);
    };
  }, [isActive, t]);

  // Escape is handled by the host effect; the guest also emits its own escape.
  const onEscape = () => {
    if (draftRef.current) {
      const current = draftRef.current;
      const item = itemsRef.current.find((entry) => entry.id === current.itemId);
      if (!current.editing && item) removeItem(item.id);
      else setDraft(null);
      return;
    }
    store.set({ active: false });
  };

  // Freeze guest hover while a comment card is open.
  React.useEffect(() => {
    if (!isActive) return;
    const code = draft ? GUEST_FREEZE : GUEST_RESUME;
    for (const pair of guestsRef.current) {
      try {
        const pending = pair[0].executeJavaScript(code);
        if (pending && typeof pending.catch === 'function') pending.catch(() => {});
      } catch (_error) {
        /* gone */
      }
    }
  }, [draft, isActive]);

  const insert = async () => {
    if (busyRef.current) return;
    if (itemsRef.current.length === 0) return;
    setBusy(true);
    setError('');
    try {
      const conversation = ctx.get('conversation');
      const sessions = ctx.get('sessions');
      const sessionId = state.sessionId;
      const session = sessionId && sessions ? (sessions.binding(sessionId) || {}).session : undefined;
      if (!conversation || !session || !sessionId) throw new Error(t('error.noSession'));
      const shell = conversation.input && conversation.input.shell ? conversation.input.shell(sessionId) : null;
      if (!shell || typeof shell.addAttachments !== 'function') throw new Error(t('error.unsupportedApi'));
      if (shell.snapshot && ['adjudicating', 'submitting', 'sending'].includes(shell.snapshot.phase)) {
        throw new Error(t('error.composerBusy'));
      }

      const ordered = itemsRef.current.slice().sort((a, b) => a.index - b.index);
      const keys = [];
      for (const item of ordered) if (!keys.includes(item.key)) keys.push(item.key);
      for (const key of keys) {
        const base = basesRef.current.get(key);
        if (!base) throw new Error(t('error.captureFailed'));
        if (base.ready) await base.ready;
        if (!base.dataUrl) throw new Error(t(base.errorKey || 'error.captureFailed'));
      }

      const groups = [];
      for (const key of keys) {
        const base = basesRef.current.get(key);
        const groupItems = ordered.filter((item) => item.key === key);
        if (!groupItems.length) continue;
        const dataUrl = await drawAnnotations(base, groupItems);
        groups.push({ base: base, items: groupItems, dataUrl: dataUrl, url: base.url });
      }
      if (!groups.length) throw new Error(t('error.captureFailed'));

      const files = groups.map((group, index) => {
        const decoded = dataUrlToBytes(group.dataUrl);
        return new File([decoded.bytes], 'annotation-' + (index + 1) + '.png', { type: decoded.mediaType });
      });
      const snapshot = session.getSnapshot ? session.getSnapshot() : {};
      const uploadImages = snapshot.subagent === null;
      if (typeof conversation.createDrafts !== 'function') throw new Error(t('error.unsupportedApi'));
      const drafts = conversation.createDrafts(sessionId, files, uploadImages) || [];
      if (!drafts.length) throw new Error(t('error.captureFailed'));
      const added = shell.addAttachments(drafts.map((entry) => entry.id));
      if (!added) {
        if (typeof conversation.releaseDraftAttachments === 'function') conversation.releaseDraftAttachments(drafts);
        throw new Error(t('error.composerBusy'));
      }
      const text = formatInsertText(
        groups.map((group) => ({
          url: group.url,
          viewport: group.base.viewport,
          scroll: group.base.state,
          items: group.items,
        })),
        t,
      );
      const typed = String((shell.snapshot && shell.snapshot.draft) || '');
      shell.setDraft(typed.trim() ? typed.replace(/\s+$/, '') + '\n\n' + text : text);
      clearAll();
      store.set({ active: false });
    } catch (failure) {
      setError(failure instanceof CaptureError ? t(captureErrorKey(failure)) : String((failure && failure.message) || failure));
    } finally {
      setBusy(false);
    }
  };

  if (!isActive) return null;

  const draftItem = draft ? itemsRef.current.find((item) => item.id === draft.itemId) : null;
  const children = [];

  const pendingBases = Array.from(basesRef.current.values()).filter((base) => base.status === 'capturing').length;
  const readyBases = Array.from(basesRef.current.values()).filter((base) => base.status === 'ready').length;

  children.push(
    React.createElement(
      'div',
      { key: 'bar', 'data-annot-ui': 'bar', className: 'dsh-annot-bar' },
      React.createElement(
        'span',
        { className: 'dsh-annot-bar__hint' },
        t(draft ? 'bar.hintDraft' : pendingBases > 0 ? 'bar.capturing' : 'bar.hint'),
      ),
      React.createElement('span', { className: 'dsh-annot-bar__count' }, String(items.length)),
      items.length > 0 && readyBases > 0
        ? React.createElement('span', { className: 'dsh-annot-bar__hint' }, t('bar.shots', { count: readyBases }))
        : null,
      ...items
        .filter((item) => !itemVisible(item))
        .map((item) =>
          React.createElement(
            'button',
            {
              key: 'chip-' + item.id,
              type: 'button',
              className: 'dsh-annot-chip',
              'data-annot-ui': 'chip',
              title: item.comment || t('pin.empty'),
              onClick: () => openDraft(item),
              disabled: busy,
            },
            String(item.index),
          ),
        ),
      items.length > 0
        ? React.createElement('button', { key: 'clear', className: 'dsh-annot-btn dsh-annot-btn--danger', onClick: () => clearAll(false) }, t('bar.clear'))
        : null,
      React.createElement(
        'button',
        { key: 'insert', className: 'dsh-annot-btn dsh-annot-btn--primary', disabled: items.length === 0 || busy || !!draft, onClick: insert },
        busy ? t('bar.inserting') : t('bar.insert', { count: items.length }),
      ),
      React.createElement('button', { key: 'close', className: 'dsh-annot-btn', onClick: () => { setDraft(null); store.set({ active: false }); } }, t('bar.close')),
    ),
  );

  const hoverRect = hover ? boxOf(hover) : null;
  if (hover && hoverRect && !draft) {
    const label = clip((hover.desc && (hover.desc.label || hover.desc.tag)) || '', 60);
    children.push(
      React.createElement('div', { key: 'hover', className: 'dsh-annot-hover', style: { left: hoverRect.x, top: hoverRect.y, width: hoverRect.width, height: hoverRect.height } }),
    );
    children.push(
      React.createElement(
        'div',
        {
          key: 'hovertag',
          className: 'dsh-annot-hover__tag',
          style: { left: Math.max(4, hoverRect.x), top: hoverRect.y + 2 < 24 ? hoverRect.y + 2 : hoverRect.y - 18 },
        },
        (hover.desc ? hover.desc.tag : '') + (label ? ' · ' + label : ''),
      ),
    );
  }

  // Host items draw their own outline; guest items are drawn inside the page.
  items.forEach((item) => {
    if (item.surface === 'browser') return;
    if (item.id === (draft && draft.itemId)) return;
    if (!itemVisible(item)) return;
    const rect = boxOf(item.rect);
    if (!rect) return;
    children.push(
      React.createElement('div', {
        key: 'outline-' + item.id,
        className: 'dsh-annot-outline',
        style: { left: rect.x, top: rect.y, width: rect.width, height: rect.height },
      }),
    );
    children.push(
      React.createElement(
        'button',
        {
          key: 'pin-' + item.id,
          'data-annot-ui': 'pin',
          className: 'dsh-annot-pin',
          style: { left: Math.max(0, rect.x - 11), top: Math.max(0, rect.y - 11) },
          title: item.comment || t('pin.empty'),
          disabled: busy,
          onClick: () => openDraft(item),
        },
        String(item.index),
      ),
    );
  });

  if (draft) {
    let rect = draftItem ? boxOf(draftItem.rect) : null;
    if (draftItem && draftItem.surface === 'browser' && draftItem.wv) {
      const st = guestState(draftItem.wv);
      const outer = draftItem.wv.getBoundingClientRect();
      if (st && st.width > 0 && rect) {
        const scale = outer.width / st.width;
        rect = { x: outer.left + rect.x * scale, y: outer.top + rect.y * scale, width: rect.width * scale, height: rect.height * scale };
      }
    }
    const anchor = rect || { x: 48, y: 72, width: 0, height: 0 };
    const width = 320;
    const left = Math.max(8, Math.min(anchor.x, (window.innerWidth || 1200) - width - 8));
    const below = anchor.y + anchor.height + 8;
    const top = below + 230 > (window.innerHeight || 800) ? Math.max(8, anchor.y - 230) : below;
    const label = (draftItem && draftItem.desc && (draftItem.desc.label || draftItem.desc.tag)) || '';
    const where = draftItem
      ? draftItem.surface === 'browser'
        ? t('card.browser')
        : draftItem.desc && draftItem.desc.selector
          ? draftItem.desc.selector
          : ''
      : '';
    children.push(
      React.createElement(
        'div',
        { key: 'card', 'data-annot-ui': 'card', className: 'dsh-annot-card', style: { left: left, top: top } },
        React.createElement('div', { className: 'dsh-annot-card__title' }, clip(label, 70)),
        React.createElement('textarea', {
          className: 'dsh-annot-card__input',
          autoFocus: true,
          rows: 3,
          placeholder: t('card.placeholder'),
          value: draft.comment,
          onChange: (event) => setDraft(Object.assign({}, draftRef.current, { comment: event.target.value })),
        }),
        React.createElement('div', { className: 'dsh-annot-card__where' }, where),
        React.createElement(
          'div',
          { className: 'dsh-annot-card__rows' },
          React.createElement(
            'button',
            {
              key: 'cancel',
              className: 'dsh-annot-btn',
              onClick: () => {
                if (!draft.editing) removeItem(draft.itemId);
                else setDraft(null);
              },
            },
            t('card.cancel'),
          ),
          draft.editing
            ? React.createElement('button', { key: 'delete', className: 'dsh-annot-btn dsh-annot-btn--danger', onClick: () => removeItem(draft.itemId) }, t('card.delete'))
            : null,
          React.createElement(
            'button',
            {
              key: 'save',
              className: 'dsh-annot-btn dsh-annot-btn--primary',
              onClick: () => {
                const current = draftRef.current;
                if (!current) return;
                setItems((prev) => prev.map((entry) => (entry.id === current.itemId ? Object.assign({}, entry, { comment: current.comment }) : entry)));
                setDraft(null);
              },
            },
            t('card.save'),
          ),
        ),
      ),
    );
  }

  if (error) children.push(React.createElement('div', { key: 'error', 'data-annot-ui': 'error', className: 'dsh-annot-error' }, error));

  return React.createElement('div', { 'data-annot-ui': 'layer', className: 'dsh-annot-layer' }, children);
}

function safeGuestUrl(wv) {
  try {
    return (wv && wv.getURL && wv.getURL()) || '';
  } catch (_error) {
    return '';
  }
}

function guestInstallScript() {
  const root = getComputedStyle(document.documentElement);
  const read = (name, fallback) => (root.getPropertyValue(name) || '').trim() || fallback;
  const accent = read('--dsw-alias-button-primary-fill', read('--dsw-alias-brand-primary', '#3b82f6'));
  const onAccent = read('--dsw-alias-label-primary-foreground', '#fff');
  return GUEST_INSTALL.split('__BOX__').join(BOX).split('__ACCENT__').join(accent).split('__ON_ACCENT__').join(onAccent);
}

function apply(ctx) {
  ctx.effect(() => {
    if (typeof document === 'undefined') return undefined;
    const marker = 'dsh-annotate-viewport/client.css';
    if (document.querySelector('style[data-plugin-css="' + marker + '"]') === null) {
      const style = document.createElement('style');
      style.dataset.plugin = 'dsh-annotate-viewport';
      style.dataset.pluginCss = marker;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.querySelector('style[data-plugin-css="' + marker + '"]');
      if (style) style.remove();
    };
  }, 'annotate-viewport: styles');

  ctx.effect(() => ctx.locale.register(NS, { en: DICT_EN, zh: DICT_ZH }), 'annotate-viewport: dictionaries');
  const t = ctx.locale.bind(NS);
  const store = createStore();

  ctx.slots.inject('conversation.input.left', () =>
    ctx.slots.register(
      { name: 'conversation.input.left', id: 'annotate-viewport-trigger', order: 95, locale: NS, label: () => t('trigger.title') },
      (props) => React.createElement(Trigger, { props: props, store: store, t: t }),
    ),
  );

  ctx.slots.inject('shell.overlay', () =>
    ctx.slots.register({ name: 'shell.overlay', id: 'annotate-viewport-overlay', order: 400 }, () =>
      React.createElement(Overlay, { ctx: ctx, store: store, t: t }),
    ),
  );
}

const DICT_EN = {
  'trigger.title': 'Annotate',
  'trigger.titleCount': 'Annotate — {count} kept',
  'bar.hint': 'Click an element, or drag over a region of the page',
  'bar.hintDraft': 'Describe this annotation',
  'bar.capturing': 'Taking a full screenshot…',
  'bar.shots': 'screenshots: {count}',
  'bar.insert': 'Insert {count} into input',
  'bar.inserting': 'Inserting…',
  'bar.clear': 'Clear',
  'bar.close': 'Close',
  'region.label': 'Selected region',
  'card.placeholder': 'What should change here?',
  'card.save': 'Add',
  'card.cancel': 'Cancel',
  'card.delete': 'Delete',
  'card.browser': 'Inside the Browser page',
  'pin.empty': 'No comment',
  'pin.edit': 'Edit annotation {index}',
  'insert.head': 'Red boxes in the screenshots below mark the places to look at; numbers match the comments:',
  'insert.shot': 'Screenshot: {url} (viewport {width}×{height}, scroll {x}, {y})',
  'insert.item': '{index}. {label} — {comment}',
  'insert.noComment': '(no comment)',
  'insert.where': '   selector: {selector}',
  'insert.rect': '   rect: x={x}, y={y}, w={width}, h={height}',
  'insert.regionLabel': 'Region',
  'error.noSession': 'Open a chat before inserting annotations',
  'error.unsupportedApi': 'This Harness version does not expose image drafts. Update Harness before inserting.',
  'error.composerBusy': 'The composer is busy; finish or cancel the current send first.',
  'error.captureFailed': 'The screenshot could not be produced. Try again.',
  'error.captureInvalid': 'The viewport is not available. Try again.',
  'error.captureTooLarge': 'This viewport is too large to capture. Resize the window or zoom out.',
  'error.captureAssets': 'A style or image in the page could not be rendered.',
  'error.captureProtected': 'The page contains protected canvas/video pixels that cannot be read.',
  'error.captureDecode': 'The screenshot could not be decoded.',
  'error.captureChanged': 'The page scrolled, resized or navigated during capture. Take the annotation again.',
  'error.captureGuestUnavailable': 'This Browser tab does not expose screenshot capture.',
  'error.captureGuestFailed': 'The Browser tab could not capture its viewport.',
  'error.guestHint': 'Pick inside the page content, not the tab frame',
  'meta.title': 'Annotate viewport',
  'meta.description': 'Take one full screenshot per viewport, mark places with numbered red boxes, and insert them into the composer with your comments.',
};

const DICT_ZH = {
  'trigger.title': '标注',
  'trigger.titleCount': '标注 — 已保留 {count} 条',
  'bar.hint': '点击元素，或在页面上拖出一个区域',
  'bar.hintDraft': '说明这条标注要改什么',
  'bar.capturing': '正在截取整屏…',
  'bar.shots': '截图：{count} 张',
  'bar.insert': '插入输入框（{count}）',
  'bar.inserting': '正在插入…',
  'bar.clear': '清空',
  'bar.close': '关闭',
  'region.label': '框选区域',
  'card.placeholder': '这里有什么问题？',
  'card.save': '添加',
  'card.cancel': '取消',
  'card.delete': '删除',
  'card.browser': '浏览器页面内',
  'pin.empty': '没有评论',
  'pin.edit': '编辑第 {index} 条标注',
  'insert.head': '下面截图里的红框标出了需要关注的位置，编号与评论一一对应：',
  'insert.shot': '截图：{url}（视口 {width}×{height}，滚动 {x}, {y}）',
  'insert.item': '{index}. {label} — {comment}',
  'insert.noComment': '（无评论）',
  'insert.where': '   选择器：{selector}',
  'insert.rect': '   区域：x={x}, y={y}, w={width}, h={height}',
  'insert.regionLabel': '框选区域',
  'error.noSession': '先打开一个会话，再插入标注',
  'error.unsupportedApi': '当前 Harness 版本没有暴露图片草稿接口，请升级后再试。',
  'error.composerBusy': '输入框正忙，先完成或取消当前的发送。',
  'error.captureFailed': '截图生成失败，请重试。',
  'error.captureInvalid': '拿不到视口信息，请重试。',
  'error.captureTooLarge': '视口太大，无法截图。请缩小窗口或降低缩放。',
  'error.captureAssets': '页面里有样式或图片无法渲染。',
  'error.captureProtected': '页面包含无法读取的受保护 canvas/视频像素。',
  'error.captureDecode': '截图解码失败。',
  'error.captureChanged': '截图期间页面滚动、缩放或跳转了，请重新标注。',
  'error.captureGuestUnavailable': '这个浏览器标签没有暴露截图能力。',
  'error.captureGuestFailed': '浏览器标签截取视口失败。',
  'error.guestHint': '请在页面内容里选择，不要选标签边框',
  'meta.title': '整屏标注',
  'meta.description': '每个视口截一张整屏图，用编号红框标出位置，连同评论一起插入输入框。',
};

module.exports = { name: 'dsh-annotate-viewport', inject: ['slots', 'locale'], apply: apply };
