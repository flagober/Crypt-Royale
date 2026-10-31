import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import tools from '../scripts/release-tools.cjs';
import {releaseNoteVisible} from './release-versions.js';
const {nextRelease,stamp,frozenSource,write,read,hash}=tools;
test('the requested public restart preserves installed upgrade counters and repeats',()=>{
 const delivered={versao:'0.16',versaoTecnica:'0.16.0',buildNumber:14};
 const repeat=nextRelease(delivered,true);assert.equal(repeat.versao,'0.16');assert.equal(repeat.buildNumber,14);
 let next=nextRelease(delivered);assert.equal(next.versao,'0.2');assert.equal(next.versaoTecnica,'0.17.0');assert.equal(next.buildNumber,15);assert.equal(next.cicloVersao,2);
 const kept=nextRelease(next,true);assert.equal(kept.versao,'0.2');assert.equal(kept.versaoTecnica,'0.17.0');assert.equal(kept.buildNumber,15);
 for(const label of ['0.3','0.4','0.5']){const before=next;next=nextRelease(next);assert.equal(next.versao,label);assert.equal(next.buildNumber,before.buildNumber+1);assert.equal(next.cicloVersao,2);assert.ok(Number(next.versaoTecnica.split('.')[1])>Number(before.versaoTecnica.split('.')[1]));}
 assert.equal(delivered.versao,'0.16');assert.equal(delivered.buildNumber,14);
});
test('new-cycle files cannot collide with the existing version archives',()=>{
 const legacy=tools.releaseNamespace({versao:'0.3'}),fresh=tools.releaseNamespace({versao:'0.3',cicloVersao:2});
 assert.equal(legacy.packages,'dist-pacote');assert.equal(fresh.packages,'dist-pacote/ciclo-2');
 for(const type of ['android','windows','packages'])assert.notEqual(legacy[type],fresh[type]);
 assert.throws(()=>tools.releaseNamespace({cicloVersao:-1}),/inválido/);
});
test('mirror ordering follows the increasing build rather than a restarted public label',()=>{
 const old={versao:'0.16',versaoTecnica:'0.16.0',buildNumber:14};const next=nextRelease(old);
 assert.equal(tools.mirrorReleaseConflict(next,old),false);assert.equal(tools.mirrorReleaseConflict(old,next),true);
 assert.equal(tools.mirrorReleaseConflict(next,{...next}),false);
 assert.equal(tools.mirrorReleaseConflict(next,{...next,versao:'0.3'}),true);
});
test('release notes retain the older cycle while hiding future notes in either cycle',()=>{
 const old={versao:'0.16'},current={versao:'0.2',cicloVersao:2};
 assert.equal(releaseNoteVisible({versao:'0.16'},current),true);
 assert.equal(releaseNoteVisible({versao:'0.2',cicloVersao:2},current),true);
 assert.equal(releaseNoteVisible({versao:'0.3',cicloVersao:2},current),false);
 assert.equal(releaseNoteVisible({versao:'0.2',cicloVersao:2},old),false);
});
test('one release gives both platforms the same short version and monotonic Android code',()=>{
 const v=nextRelease({versao:'0.9',versaoTecnica:'0.9.0',buildNumber:7});
 assert.equal(v.versao,'0.10');assert.equal(v.versaoTecnica,'0.10.0');assert.equal(v.buildNumber,8);
 const repeat=nextRelease(v,true);assert.equal(repeat.versao,v.versao);assert.equal(repeat.buildNumber,v.buildNumber);
 assert.throws(()=>nextRelease({versao:'bad',buildNumber:1}),/inválidos/);
});
test('stamping preserves dependency versions while synchronizing package, lock and Android',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'cryptroyale-stamp-'));
 write(path.join(dir,'package.json'),{version:'0.2.0',build:{win:{}}});
 write(path.join(dir,'package-lock.json'),{version:'0.2.0',packages:{'':{version:'0.2.0'},'node_modules/test':{version:'0.1.0'}}});
 write(path.join(dir,'android/app/build.gradle'),'versionCode 1\nversionName "1.0"\n');
 const v=nextRelease({versao:'0.2',buildNumber:3});stamp(dir,v);
 assert.equal(read(path.join(dir,'package.json')).version,'0.3.0');
 assert.equal(read(path.join(dir,'package-lock.json')).packages['node_modules/test'].version,'0.1.0');
 assert.match(fs.readFileSync(path.join(dir,'android/app/build.gradle'),'utf8'),/versionCode 4\nversionName "0.3"/);
 assert.equal(read(path.join(dir,'versao.json')).buildNumber,4);
});
test('frozen allowlist contains game code and assets, excludes credentials, caches and old packages',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'cryptroyale-freeze-'));
 for(const name of ['src/App.jsx','public/assets/card.webp','android/app/src/MainActivity.java','android/local.properties','android/app/build/intermediates/a','android/.gradle/cache','android/app/src/main/assets/public/index.html','docs/oracle/private.md','scripts/credentials.json','scripts/release.jks','dist-electron/old.exe','.env','package.json'])write(path.join(dir,name),'fixture');
 const list=frozenSource(dir);assert.ok(list.includes('src/App.jsx'));assert.ok(list.includes('public/assets/card.webp'));assert.ok(list.includes('android/app/src/MainActivity.java'));assert.ok(list.includes('package.json'));
 for(const excluded of ['android/local.properties','android/app/build/intermediates/a','android/.gradle/cache','android/app/src/main/assets/public/index.html','docs/oracle/private.md','scripts/credentials.json','scripts/release.jks','dist-electron/old.exe','.env'])assert.equal(list.includes(excluded),false,excluded);
});
test('frozen copy hashes detect even a later source mutation',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'cryptroyale-hash-')),source=path.join(dir,'source'),copy=path.join(dir,'copy');
 write(source,'first');fs.copyFileSync(source,copy);const frozen=hash(copy);write(source,'second');assert.notEqual(hash(source),frozen);assert.equal(hash(copy),frozen);
});


test('iOS shares the release version and build while preserving the bundle and signing settings',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'royale-ios-stamp-'));
 write(path.join(dir,'package.json'),{build:{win:{}}});write(path.join(dir,'package-lock.json'),{packages:{'':{}}});
 write(path.join(dir,'android/app/build.gradle'),'versionCode 1\nversionName "1.0"');
 write(path.join(dir,'ios/App/App.xcodeproj/project.pbxproj'),'MARKETING_VERSION = 1.0;\nCURRENT_PROJECT_VERSION = 1;\nPRODUCT_BUNDLE_IDENTIFIER = com.monstercrypt.cryptroyale;\nDEVELOPMENT_TEAM = ORIGINAL;');
 stamp(dir,{versao:'0.14',versaoTecnica:'0.14.0',buildNumber:12});
 const text=fs.readFileSync(path.join(dir,'ios/App/App.xcodeproj/project.pbxproj'),'utf8');assert.match(text,/MARKETING_VERSION = 0.14;/);assert.match(text,/CURRENT_PROJECT_VERSION = 12;/);assert.match(text,/DEVELOPMENT_TEAM = ORIGINAL;/);assert.match(text,/com.monstercrypt.cryptroyale/);
});
test('iOS freeze preserves native config but excludes generated web copies, pods, profiles and private keys',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'royale-ios-freeze-'));
 const allowed=['ios/App/Podfile','ios/App/App/GoogleService-Info.plist','ios/App/App.xcodeproj/project.pbxproj'];
 const denied=['ios/App/Pods/lib.a','ios/DerivedData/cache','ios/App/App.xcodeproj/xcuserdata/user','ios/App/App/public/index.html','ios/signing.p8','ios/adhoc.mobileprovision','ios/key.pfx'];
 for(const file of [...allowed,...denied])write(path.join(dir,file),'fixture');const frozen=frozenSource(dir);for(const file of allowed)assert.ok(frozen.includes(file));for(const file of denied)assert.equal(frozen.includes(file),false,file);
});

test('version 0.13 jumps directly to 0.2 and then advances by single decimal (0.3, 0.4, 0.5)', () => {
  const current = { versao: '0.13', versaoTecnica: '0.28.0', buildNumber: 27, cicloVersao: 2 };
  let next = nextRelease(current);
  assert.equal(next.versao, '0.2');
  assert.equal(next.buildNumber, 28);
  assert.equal(next.cicloVersao, 2);

  for (const label of ['0.3', '0.4', '0.5']) {
    const prev = next;
    next = nextRelease(next);
    assert.equal(next.versao, label);
    assert.equal(next.buildNumber, prev.buildNumber + 1);
    assert.equal(next.cicloVersao, 2);
  }
});
