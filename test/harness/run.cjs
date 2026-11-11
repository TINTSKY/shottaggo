'use strict';

/**
 * Headless smoke test for the built client bundle.
 *
 * Loads client.js in Edge/Chromium, mounts the real Trigger/Overlay through a
 * mocked Harness ctx, then drives the host and Browser-panel flows with trusted
 * input events, and finally checks the PNGs handed to createDrafts.
 *
 * Run: node test/harness/run.cjs
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');

const ROOT = path.join(__dirname, '..', '..');
const TOOLS = path.join(ROOT, '..', 'test-tools', 'node_modules');
const EDGE = process.env.EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
};

function serve() {
  const files = new Map([
    ['/', path.join(__dirname, 'index.html')],
    ['/loader.js', path.join(__dirname, 'loader.js')],
    ['/harness.js', path.join(__dirname, 'harness.js')],
    ['/client.js', path.join(ROOT, 'client.js')],
    ['/react.js', path.join(TOOLS, 'react', 'umd', 'react.development.js')],
    ['/react-dom.js', path.join(TOOLS, 'react-dom', 'umd', 'react-dom.development.js')],
  ]);
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    const file = files.get(url.pathname);
    if (!file || !fs.existsSync(file)) {
      response.writeHead(404).end('not found');
      return;
    }
    response.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(response);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(fn, timeoutMs, label) {
  const started = Date.now();
  for (;;) {
    try {
      const value = await fn();
      if (value) return value;
    } catch (_error) {
      /* retry */
    }
    if (Date.now() - started > timeoutMs) throw new Error('timeout: ' + label);
    await sleep(100);
  }
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      }
    });
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'evaluate failed');
    return result.result.value;
  }
  async mouse(type, x, y) {
    await this.send('Input.dispatchMouseEvent', {
      type,
      x,
      y,
      button: 'left',
      buttons: type === 'mouseReleased' ? 0 : 1,
      clickCount: 1,
    });
  }
  async clickAt(x, y) {
    await this.mouse('mouseMoved', x, y);
    await sleep(60);
    await this.mouse('mousePressed', x, y);
    await sleep(40);
    await this.mouse('mouseReleased', x, y);
  }
}

async function launch() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-annotate-edge-'));
  const child = spawn(EDGE, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    '--user-data-dir=' + profile,
    'about:blank',
  ], { stdio: 'ignore' });
  const active = path.join(profile, 'DevToolsActivePort');
  const content = await waitFor(async () => (fs.existsSync(active) ? fs.readFileSync(active, 'utf8') : ''), 15000, 'DevToolsActivePort');
  const lines = content.trim().split(/\r?\n/);
  return { child, profile, port: Number(lines[0]), browserWs: lines[1] };
}

async function pageTarget(debugPort) {
  const started = Date.now();
  for (;;) {
    const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await response.json();
    const page = targets.find((target) => target.type === 'page');
    if (page) return page;
    if (Date.now() - started > 15000) throw new Error('no page target');
    await sleep(100);
  }
}

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  return new Cdp(ws);
}

function fail(message, details) {
  console.error('FAIL:', message);
  if (details !== undefined) console.error(JSON.stringify(details, null, 2));
  process.exitCode = 1;
}

(async () => {
  if (!fs.existsSync(EDGE)) {
    console.log('SKIP: Edge not installed');
    return;
  }
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await launch();
  let cdp;
  try {
    const page = await pageTarget(browser.port);
    cdp = await connect(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Page.navigate', { url });
    await waitFor(() => cdp.evaluate('document.readyState === "complete" && window.__HARNESS && window.__HARNESS.ready === true'), 20000, 'harness ready');

    const boot = await cdp.evaluate('({ errors: __HARNESS.errors, trigger: !!document.querySelector(\'[data-annot-ui="trigger"]\') })');
    if (!boot.trigger) throw new Error('trigger did not render');

    // --- host flow: annotate a button inside the Harness page -------------
    await cdp.evaluate('__HARNESS.clickIn(\'[data-annot-ui="trigger"]\')');
    await waitFor(() => cdp.evaluate('!!document.querySelector(\'[data-annot-ui="bar"]\')'), 5000, 'annotation bar');

    const rect = await cdp.evaluate(`(() => {
      const r = document.getElementById('save').getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`);
    await cdp.clickAt(rect.x, rect.y);
    await waitFor(() => cdp.evaluate('!!document.querySelector(\'[data-annot-ui="card"]\')'), 8000, 'host comment card');

    await cdp.evaluate('__HARNESS.setComment("这个按钮点下去没反应")');
    await sleep(100);
    await cdp.evaluate('__HARNESS.clickCardPrimary()');
    await waitFor(() => cdp.evaluate('!document.querySelector(\'[data-annot-ui="card"]\')'), 5000, 'card closed');

    await sleep(1500); // full-window DOM snapshot completes asynchronously
    const beforeInsert = await cdp.evaluate('__HARNESS.snapshot()');
    if (beforeInsert.errors.length) throw new Error('runtime errors: ' + beforeInsert.errors.join(' | '));

    await cdp.evaluate('__HARNESS.clickBarPrimary()');
    await waitFor(() => cdp.evaluate('__HARNESS.shell.added.length > 0'), 15000, 'host attachment');

    const hostState = await cdp.evaluate('__HARNESS.snapshot()');
    const hostImages = await cdp.evaluate('__HARNESS.measure()');
    if (hostState.added.length !== 1) fail('host insert should attach one screenshot', hostState);
    if (hostState.shellSessionId !== 'session-main') fail('insert should target the main-view chat, not the browser pane', hostState);
    if (!/existing text/.test(hostState.draftText)) fail('typed draft text was not preserved', hostState.draftText);
    if (!/这个按钮点下去没反应/.test(hostState.draftText)) fail('comment missing from caption', hostState.draftText);
    if (!hostImages[0] || hostImages[0].type !== 'image/png' || hostImages[0].width < 100) fail('host screenshot is not a PNG', hostImages);
    if (!hostImages[0] || hostImages[0].red < 50) fail('host screenshot has no red box pixels', hostImages);

    // --- browser-panel flow: mock guest picks a region --------------------
    await cdp.evaluate('__HARNESS.clickIn(\'[data-annot-ui="trigger"]\')');
    await waitFor(() => cdp.evaluate('!!document.querySelector(\'[data-annot-ui="bar"]\')'), 5000, 'bar reopened');
    await cdp.evaluate('__HARNESS.guestPick(__HARNESS.guestPayload)');
    await waitFor(() => cdp.evaluate('!!document.querySelector(\'[data-annot-ui="card"]\')'), 8000, 'guest comment card');
    await cdp.evaluate('__HARNESS.setComment("这里应该放主按钮")');
    await sleep(100);
    await cdp.evaluate('__HARNESS.clickCardPrimary()');
    await sleep(1200);
    await cdp.evaluate('__HARNESS.clickBarPrimary()');
    await waitFor(() => cdp.evaluate('__HARNESS.shell.added.length > 1'), 15000, 'guest attachment');

    const finalState = await cdp.evaluate('__HARNESS.snapshot()');
    const allImages = await cdp.evaluate('__HARNESS.measure()');
    const guestImage = allImages[allImages.length - 1];
    if (!/example\.test\/page/.test(finalState.draftText)) fail('guest URL missing from caption', finalState.draftText);
    if (!/这里应该放主按钮/.test(finalState.draftText)) fail('guest comment missing', finalState.draftText);
    if (!/2\. Buy now/.test(finalState.draftText)) fail('annotation numbering should continue across inserts', finalState.draftText);
    if (!guestImage || guestImage.width !== 620 || guestImage.red < 50) fail('guest screenshot is not the expected annotated PNG', guestImage);
    if (finalState.errors.length) fail('runtime errors after guest flow', finalState.errors);

    if (process.env.SAVE_SHOTS) {
      const docs = path.join(ROOT, 'docs');
      fs.mkdirSync(docs, { recursive: true });
      const samples = [
        ['example-host.png', await cdp.evaluate('__HARNESS.shotDataUrl(0)')],
        ['example-guest.png', await cdp.evaluate('__HARNESS.shotDataUrl(1)')],
      ];
      for (const [name, data] of samples) {
        if (typeof data !== 'string' || data.indexOf(',') === -1) continue;
        fs.writeFileSync(path.join(docs, name), Buffer.from(data.split(',')[1], 'base64'));
      }
    }

    console.log(JSON.stringify({
      ok: !process.exitCode,
      host: { draft: hostState.draftText, image: hostImages[0] },
      guest: { draft: finalState.draftText, image: guestImage, added: finalState.added },
    }, null, 2));
    if (!process.exitCode) console.log('PASS: host + guest annotation flows');
  } catch (error) {
    fail(String(error && error.stack ? error.stack : error));
  } finally {
    try { browser.child.kill(); } catch (_error) {}
    server.close();
    try { fs.rmSync(browser.profile, { recursive: true, force: true }); } catch (_error) {}
  }
})();
