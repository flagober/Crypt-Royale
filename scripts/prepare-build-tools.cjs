// Capacitor 6 imports tar through a default-only CJS shim. tar 7 exposes named
// exports. Keep the existing SDK/JDK/native platform and adapt this one importer
// so the CLI can use the patched extractor instead of vulnerable tar 6.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const pkgPath = path.join(root, 'node_modules', '@capacitor', 'cli', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (pkg.version !== '6.2.2') throw Error('Review the tar compatibility adapter before changing Capacitor CLI.');
const cliRequire = createRequire(pkgPath);
if (typeof cliRequire('tar').extract !== 'function') throw Error('tar.extract is unavailable.');
const file = path.join(path.dirname(pkgPath), 'dist', 'util', 'template.js');
const original = 'const tar_1 = tslib_1.__importDefault(require("tar"));';
const adapted = 'const tar_1 = { default: require("tar") };';
const content = fs.readFileSync(file, 'utf8');
if (content.includes(adapted)) {
  console.log('Capacitor tar compatibility adapter already applied.');
} else {
  if (content.split(original).length !== 2) throw Error('Unexpected Capacitor template importer; refusing to patch.');
  fs.writeFileSync(file, content.replace(original, adapted));
  console.log('Capacitor tar compatibility adapter applied; extraction checks remain enabled.');
}
