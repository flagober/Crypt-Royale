const fs=require('node:fs'),path=require('node:path');
const {run}=require('./release-tools.cjs');
const {spawnSync}=require('node:child_process');
function buildWindows(root,version){
 run(process.execPath,['--require',path.join(root,'scripts','nsis-build-runtime.cjs'),path.join(root,'node_modules','electron-builder','cli.js'),'--win','nsis','--x64','--publish','never'],{cwd:root,env:{...process.env,CSC_IDENTITY_AUTO_DISCOVERY:'false',CRYPT_NSIS_EXTENDED:'1'}});
 const result=path.join(root,'dist-electron',`Crypt Royale Setup ${version.versao}.exe`);
 if(!fs.existsSync(result))throw Error('Instalador Windows não foi produzido.');
 // Exercise the exact packaged app without installing it or touching player data.
 const app=path.join(root,'dist-electron','win-unpacked','Crypt Royale.exe');
 const ps=spawnSync('powershell.exe',['-NoProfile','-Command',"$v=(Get-Item -LiteralPath '"+app.replaceAll("'","''")+"').VersionInfo; @{product=$v.ProductName;version=$v.FileVersion}|ConvertTo-Json -Compress"],{encoding:'utf8'});
 if(ps.status!==0)throw Error('Não foi possível conferir os metadados nativos do Windows.');
 const native=JSON.parse(ps.stdout.trim());if(native.product!=='Crypt Royale'||native.version.split('.').slice(0,3).join('.')!==version.versaoTecnica)throw Error('Nome/versão nas propriedades do executável Windows divergentes.');
 console.log('WINDOWS_NATIVE_VERSION_OK '+JSON.stringify(native));
 const env={...process.env,CRYPT_SMOKE_ROOT:path.join(root,'smoke-profile')};delete env.ELECTRON_RUN_AS_NODE;
 run(app,['--smoke-test'],{cwd:root,env});
 return result;
}
module.exports={buildWindows};
