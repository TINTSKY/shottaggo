'use strict';

/**
 * Annotation stress benchmark.
 *
 * Sweeps annotation counts through the real UI path (guest pick -> comment
 * card -> Add -> Insert) in headless Chromium, then reports add latency,
 * insert latency, caption size, PNG size and long tasks.
 *
 * Run: node test/bench/run.cjs
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');

const ROOT = path.join(__dirname, '..', '..');
const TOOLS = path.join(ROOT, '..', 'test-tools', 'node_modules');
const EDGE = process.env.EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

function serve() {
  const files = new Map([
    ['/', path.join(ROOT, 'test', 'harness', 'index.html')],
    ['/loader.js', path.join(ROOT, 'test', 'harness', 'loader.js')],
    ['/harness.js', path.join(ROOT, 'test', 'harness', 'harness.js')],
    ['/client.js', path.join(ROOT, 'client.js')],
    ['/react.js', path.join(TOOLS, 'react', 'umd', 'react.development.js')],
    ['/react-dom.js', path.join(TOOLS, 'react-dom', 'umd', 'react-dom.development.js')],
  ]);
  const server = http.createServer((request, response) => {
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
    const file = files.get(pathname);
    if (!file || !fs.existsSync(file)) {
      response.writeHead(404).end('not found');
      return;
    }
    response.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(response);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
}

async function launch() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-annot-bench-'));
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
  return { child, profile, port: Number(lines[0]) };
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

const CASES = [
  { name: 'single-5', n: 5 },
  { name: 'single-10', n: 10 },
  { name: 'single-20', n: 20 },
  { name: 'single-30', n: 30 },
  { name: 'single-50', n: 50 },
  { name: 'single-100', n: 100 },
  { name: 'single-200', n: 200 },
  { name: 'single-500', n: 500 },
  { name: 'single-1000', n: 1000 },
  { name: 'scroll-5x5', n: 25, scrollEvery: 5 },
  { name: 'scroll-10x5', n: 50, scrollEvery: 5 },
  { name: 'scroll-20x5', n: 100, scrollEvery: 5 },
].filter((testCase) => !process.env.BENCH_ONLY || testCase.name.includes(process.env.BENCH_ONLY));

(async () => {
  if (!fs.existsSync(EDGE)) {
    console.log('SKIP: Edge not installed');
    return;
  }
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await launch();
  let cdp;
  const results = [];
  try {
    const page = await pageTarget(browser.port);
    cdp = await connect(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Page.navigate', { url });
    await waitFor(() => cdp.evaluate('window.__HARNESS && window.__HARNESS.ready === true'), 20000, 'harness ready');

    for (const testCase of CASES) {
      const options = testCase.scrollEvery
        ? { scrollEvery: testCase.scrollEvery, scrollStep: testCase.scrollStep || 300 }
        : {};
      await cdp.evaluate('__HARNESS.resetDraft()');
      await cdp.evaluate('__HARNESS.configureGuest({ width: 1485, height: 1284, imageWidth: 1600, imageHeight: 1383 })');
      await cdp.evaluate('__HARNESS.startRun()');
      const opened = await cdp.evaluate('__HARNESS.clickIn(\'[data-annot-ui="fab"]\')');
      if (!opened) throw new Error('could not open annotation mode');
      await waitFor(() => cdp.evaluate('!!document.querySelector(\'[data-annot-ui="bar"]\')'), 5000, 'bar ' + testCase.name);

      const add = await cdp.evaluate(`__HARNESS.addMany(${testCase.n}, ${JSON.stringify(options)})`);
      if (add.added !== testCase.n) throw new Error(`${testCase.name}: added ${add.added} of ${testCase.n} annotations`);
      const insertMs = await cdp.evaluate('__HARNESS.insertNow()');
      const metrics = await cdp.evaluate('__HARNESS.metrics()');
      const record = {
        case: testCase.name,
        annotations: testCase.n,
        bases: testCase.scrollEvery ? Math.ceil(testCase.n / testCase.scrollEvery) : 1,
        add,
        insertMs,
        captionChars: metrics.captionChars,
        images: metrics.images.length,
        imageBytes: metrics.totalBytes,
        imageKB: Math.round(metrics.totalBytes / 1024),
        heapMB: metrics.heapMB,
        longTasks: metrics.longTasks,
        longestTaskMs: metrics.longestTaskMs,
        errors: metrics.errors,
      };
      results.push(record);
      console.log(JSON.stringify(record));
      if (metrics.errors.length) throw new Error('runtime errors in ' + testCase.name + ': ' + metrics.errors.join(' | '));
    }

    if (!process.env.BENCH_ONLY) {
      await cdp.evaluate('__HARNESS.resetDraft()');
      await cdp.evaluate('__HARNESS.configureGuest({ width: 1485, height: 1284, imageWidth: 1600, imageHeight: 1383 })');
      await cdp.evaluate('__HARNESS.startRun()');
      await cdp.evaluate('__HARNESS.clickIn(\'[data-annot-ui="fab"]\')');
      await waitFor(() => cdp.evaluate('!!document.querySelector(\'[data-annot-ui="bar"]\')'), 5000, 'bar guard-21x5');
      const add = await cdp.evaluate('__HARNESS.addMany(105, { scrollEvery: 5, scrollStep: 300 })');
      if (add.added !== 105) throw new Error('guard case could not add 105 annotations');
      const guard = await cdp.evaluate('__HARNESS.tryInsert()');
      results.push({ case: 'guard-21x5', annotations: 105, bases: 21, guard });
      await cdp.evaluate('__HARNESS.closeBar()');
      if (guard.added !== 0) throw new Error('image-limit guard inserted attachments: ' + JSON.stringify(guard));
      if (!/图片上限/.test(guard.error)) throw new Error('image-limit guard error missing: ' + JSON.stringify(guard));
      console.log(JSON.stringify({ case: 'guard-21x5', guard }));
    }

    fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(ROOT, 'docs', 'stress-results.json'), JSON.stringify(results, null, 2));
    console.log('RESULTS', JSON.stringify(results.map((r) => (r.guard
      ? { case: r.case, guard: r.guard }
      : {
        case: r.case,
        n: r.annotations,
        bases: r.images,
        addTotal: r.add.total,
        addAvg: r.add.avg,
        addP95: r.add.p95,
        insert: r.insertMs,
        caption: r.captionChars,
        imageKB: r.imageKB,
        heap: r.heapMB,
        long: r.longTasks,
        worstTask: r.longestTaskMs,
      })), null, 2));
    console.log('PASS: stress sweep');
  } catch (error) {
    console.error('FAIL:', String(error && error.stack ? error.stack : error));
    process.exitCode = 1;
  } finally {
    try { browser.child.kill(); } catch (_error) {}
    server.close();
    try { fs.rmSync(browser.profile, { recursive: true, force: true }); } catch (_error) {}
  }
})();
