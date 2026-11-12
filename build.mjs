import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const ENTRY = 'src/client.cjs';
const PLUGIN_ID = 'dsh-shottaggo';
const OUT = 'client.js';
const TMP = '.client.bundle.cjs';

const require = createRequire(import.meta.url);

const options = {
  entryPoints: [ENTRY],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2020',
  minify: false,
  external: ['react', 'react-dom'],
  write: false,
  legalComments: 'none',
};

async function bundleWithApi() {
  const { build } = await import('esbuild');
  const result = await build(options);
  return result.outputFiles[0].text;
}

/**
 * Some Windows sandboxes reject esbuild's piped child process. The CLI writes
 * straight to a file instead, so the build still works there.
 */
function bundleWithCli() {
  const platformPackages = {
    win32: ['@esbuild/win32-x64', 'esbuild.exe'],
    darwin: ['@esbuild/darwin-arm64', 'bin/esbuild'],
    linux: ['@esbuild/linux-x64', 'bin/esbuild'],
  };
  const [pkg, binary] = platformPackages[process.platform] || [];
  if (!pkg) throw new Error(`no esbuild CLI mapping for ${process.platform}`);
  const pkgJson = require.resolve(`${pkg}/package.json`);
  const bin = path.join(path.dirname(pkgJson), binary);
  if (!fs.existsSync(bin)) throw new Error(`esbuild binary missing: ${bin}`);
  const args = [
    ENTRY,
    '--bundle',
    '--format=cjs',
    '--platform=browser',
    '--target=es2020',
    '--external:react',
    '--external:react-dom',
    '--legal-comments=none',
    `--outfile=${TMP}`,
  ];
  const result = spawnSync(bin, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`esbuild exited with ${result.status}`);
  const text = fs.readFileSync(TMP, 'utf8');
  fs.rmSync(TMP, { force: true });
  return text;
}

let bundle;
try {
  bundle = await bundleWithApi();
} catch (error) {
  if (!/EPERM|spawn/i.test(String(error && (error.code || error.message)))) throw error;
  bundle = bundleWithCli();
}

const out = [
  `window.__ModuleLoader__.load({ id: "${PLUGIN_ID}", factory: (require) => {`,
  'var module = { exports: {} }; var exports = module.exports;',
  bundle,
  'return module.exports;',
  '} });',
  '',
].join('\n');

fs.writeFileSync(OUT, out);
console.log(OUT, out.length, 'bytes');
