const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { createRequire } = require('node:module');
async function main() {
  const root = path.resolve(__dirname, '..');
  const pkgPath = path.join(root, 'node_modules/@capacitor/cli/package.json');
  const cliRequire = createRequire(pkgPath);
  const tar = cliRequire('tar');
  assert.equal(cliRequire('tar/package.json').version, '7.5.22');
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cryptroyale-extractor-check-'));
  const input = path.join(temp, 'input'), output = path.join(temp, 'output');
  fs.mkdirSync(input); fs.writeFileSync(path.join(input, 'probe.txt'), 'Crypt Royale extraction compatibility\n');
  const archive = path.join(temp, 'probe.tar.gz');
  await tar.c({ cwd: input, file: archive, gzip: true }, ['probe.txt']);
  const { extractTemplate } = require(path.join(path.dirname(pkgPath), 'dist/util/template.js'));
  await extractTemplate(archive, output);
  assert.equal(fs.readFileSync(path.join(output, 'probe.txt'), 'utf8'), fs.readFileSync(path.join(input, 'probe.txt'), 'utf8'));
  console.log('BUILD_TOOLS_OK: Capacitor 6.2.2 extracts templates through tar 7.5.22. Fixture retained at ' + temp);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
