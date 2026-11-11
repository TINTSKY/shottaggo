'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const pkg = require('../package.json');
test('package and lockfile identify the same MIT package', () => {
  const lock = require('../package-lock.json');
  assert.equal(lock.name, pkg.name);
  assert.equal(lock.version, pkg.version);
  assert.equal(lock.packages[''].license, pkg.license);
  assert.equal(pkg.license, 'MIT');
  assert.ok(fs.readFileSync(path.join(root, 'THIRD_PARTY_NOTICES.md'), 'utf8').includes('2017-2025 W.Y.'));
});
test('Host and client entry points and bundle patch exist', () => {
  for (const file of [pkg.main, pkg.exports['./client'], pkg.dsh.bundle.patch, pkg.icon]) {
    assert.ok(fs.statSync(path.resolve(root, file)).isFile(), file);
  }
  assert.ok(fs.readFileSync(path.join(root, 'cordis.patch.yml'), 'utf8').includes('name: '+pkg.name));
});
test('built client registers a loadable plugin with the Harness module loader', () => {
  let registered;
  const react = { createElement: () => null };
  const reactDom = { createPortal: (node) => node };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'client.js'), 'utf8'), {
    window: { __ModuleLoader__: { load: (module) => { registered = module; } } },
  });
  assert.equal(registered.id, pkg.name);
  const plugin = registered.factory((name) => {
    if (name === 'react') return react;
    assert.equal(name, 'react-dom');
    return reactDom;
  });
  assert.equal(plugin.name, pkg.name);
  assert.equal(typeof plugin.apply, 'function');
  assert.ok(plugin.inject.includes('slots'));
});
