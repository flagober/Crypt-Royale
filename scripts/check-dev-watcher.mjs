import { createServer } from 'vite';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Integration check: caller may hold an exclusive Windows lock on an APK.
// Read the real project configuration, but use a temporary local port.
const root = fileURLToPath(new URL('../', import.meta.url));
const errors = [];
const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 0, strictPort: false, open: false } });
server.watcher.on('error', error => errors.push(error));
try {
  const ready = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Watcher did not become ready')), 15000);
    server.watcher.once('ready', () => { clearTimeout(timeout); resolve(); });
  });
  await server.listen(); await ready;
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  // Vite watches source modules on demand, so request the entry before checking.
  assert.equal((await fetch(`${origin}/src/main.jsx`)).status, 200);
  const watched = Object.keys(server.watcher.getWatched()).map(p => path.relative(root, p).replaceAll('\\', '/'));
  for (const directory of ['dist-apk', 'dist-electron', 'dist-pacote', 'android']) {
    assert.ok(!watched.some(p => p === directory || p.startsWith(directory + '/')), `${directory} must not be watched`);
  }
  assert.ok(watched.includes('src'), 'Application source must remain watched');
  assert.ok(watched.includes('public'), 'Runtime assets must remain watched');
  const response = await fetch(`${origin}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Crypt Royale/);
  assert.equal(errors.length, 0, errors.map(e => e.message).join('\n'));
  console.log('WATCHER_OK: HTTP 200; installer/native directories excluded; src/public watched; no watcher errors.');
} finally { await server.close(); }
