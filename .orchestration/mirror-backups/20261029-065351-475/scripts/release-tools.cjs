const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os');
const {spawnSync}=require('node:child_process');
const helpers=path.join(os.homedir(),'.codex','skills','flavio-golden-rules','scripts');
const quote=value=>"'"+String(value).replaceAll("'","''")+"'";
function powershell(code){const r=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',"$ErrorActionPreference='Stop'; "+code],{stdio:'inherit',env:{...process.env,PSModulePath:path.join(process.env.SystemRoot||'C:\\Windows','System32','WindowsPowerShell','v1.0','Modules')}});if(r.status!==0)throw Error('Backup/espelhamento falhou; arquivos preservados.');}
function backup(files,label){powershell(`& ${quote(path.join(helpers,'Backup-Files.ps1'))} -Paths @(${files.map(quote).join(',')}) -Label ${quote(label)}`);}
function mirror(root,destination,files){powershell(`& ${quote(path.join(helpers,'Mirror-Files.ps1'))} -SourceRoot ${quote(root)} -MirrorRoot ${quote(destination)} -Paths @(${files.map(quote).join(',')}) | Group-Object status | Select-Object Count,Name`);}
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
function write(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');}
function run(file,args,options={}){const r=spawnSync(file,args,{stdio:'inherit',...options});if(r.status!==0)throw Error(`Etapa falhou (${path.basename(file)}), código ${r.status??'sem resposta'}.`);}
function list(root){if(!fs.existsSync(root)||fs.lstatSync(root).isSymbolicLink())return[];return fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isSymbolicLink()?[]:e.isDirectory()?list(path.join(root,e.name)):[path.join(root,e.name)]);}
function nextRelease(current,keep=false){
 if(!/^\d+\.\d+$/.test(current.versao)||!Number.isInteger(current.buildNumber)||current.buildNumber<0)throw Error('Metadados de versão inválidos.');
 const technical=current.versaoTecnica||current.versao+'.0';
 if(!/^\d+\.\d+\.\d+$/.test(technical))throw Error('Metadados de versão técnica inválidos.');
 if(keep)return {...current,versaoTecnica:technical,data:new Date().toISOString()};
 // Flavio, 28/10/2026: keep delivered 0.16; start a new public cycle at 0.2.
 const restart=current.versao==='0.16'&&current.buildNumber===14&&(current.cicloVersao||1)===1;
 const [major,minor]=current.versao.split('.').map(Number),versao=restart?'0.2':`${major}.${minor+1}`;
 const [internalMajor,internalMinor]=technical.split('.').map(Number);
 const buildNumber=current.buildNumber+1;
 if(buildNumber<1||buildNumber>2100000000)throw Error('versionCode Android fora do intervalo.');
 return {...current,versao,versaoTecnica:`${internalMajor}.${internalMinor+1}.0`,cicloVersao:restart?2:(current.cicloVersao||1),buildNumber,data:new Date().toISOString()};
}
function releaseNamespace(version){
 const cycle=version.cicloVersao||1;
 if(!Number.isInteger(cycle)||cycle<1)throw Error('Ciclo de versão inválido.');
 const suffix=cycle>1?`/ciclo-${cycle}`:'';
 return {android:'dist-apk'+suffix,windows:'dist-electron'+suffix,packages:'dist-pacote'+suffix};
}
function mirrorReleaseConflict(current,other){
 if(!Number.isInteger(other.buildNumber)||other.buildNumber<0)throw Error('Metadados de versão do espelho inválidos.');
 return other.buildNumber>current.buildNumber||(other.buildNumber===current.buildNumber&&(
  other.versao!==current.versao||(other.versaoTecnica||other.versao+'.0')!==(current.versaoTecnica||current.versao+'.0')||(other.cicloVersao||1)!==(current.cicloVersao||1)));
}
function stamp(root,version){
 const pkg=read(path.join(root,'package.json')),lock=read(path.join(root,'package-lock.json'));
 pkg.version=version.versaoTecnica;pkg.build.win.artifactName=`Crypt Royale Setup ${version.versao}.exe`;
 lock.version=pkg.version;if(lock.packages?.[''])lock.packages[''].version=pkg.version;
 write(path.join(root,'package.json'),pkg);write(path.join(root,'package-lock.json'),lock);write(path.join(root,'versao.json'),version);
 const gradle=path.join(root,'android','app','build.gradle');
 let text=fs.readFileSync(gradle,'utf8');
 if(!/versionCode\s+\d+/.test(text)||!/versionName\s+"[^"]+"/.test(text))throw Error('Gradle sem campos de versão reconhecidos.');
 text=text.replace(/versionCode\s+\d+/,`versionCode ${version.buildNumber}`).replace(/versionName\s+"[^"]+"/,`versionName "${version.versao}"`);write(gradle,text);
 const ios=path.join(root,'ios/App/App.xcodeproj/project.pbxproj');
 if(fs.existsSync(ios))write(ios,fs.readFileSync(ios,'utf8').replace(/MARKETING_VERSION = [^;]+;/g,`MARKETING_VERSION = ${version.versao};`).replace(/CURRENT_PROJECT_VERSION = \d+;/g,`CURRENT_PROJECT_VERSION = ${version.buildNumber};`));
}
function frozenSource(root){
 const fixed=['package.json','package-lock.json','versao.json','vite.config.js','postcss.config.js','tailwind.config.js','index.html','capacitor.config.json','electron-main.cjs','electron-preload.cjs'];
 const result=fixed.filter(f=>fs.existsSync(path.join(root,f)));
 for(const folder of ['src','public','android','ios','scripts','docs'])for(const file of list(path.join(root,folder))){
  const rel=path.relative(root,file).replaceAll('\\','/');
  if(/(^|\/)(node_modules|\.gradle|build|\.idea|captures|\.git)(\/|$)/.test(rel)||/android\/app\/src\/main\/assets\/public\//.test(rel))continue;
  if(/(^|\/)(Pods|DerivedData|xcuserdata)(\/|$)|ios\/App\/App\/public\//.test(rel))continue;
  if(/(^|\/)(local\.properties|\.env[^/]*|credentials[^/]*|.*\.(jks|keystore|pem|p12|key|p8|pfx|mobileprovision)|.*\.log)$/i.test(rel))continue;
  if(folder==='docs'&&!rel.endsWith('.md'))continue;
  result.push(rel);
 }
 return [...new Set(result)].sort();
}
function tools(){
 const sdk=process.env.ANDROID_HOME||process.env.ANDROID_SDK_ROOT||path.join(process.env.LOCALAPPDATA,'Android','Sdk');
 const candidates=[process.env.JAVA_HOME,...['Microsoft','Eclipse Adoptium','Java'].flatMap(vendor=>{const dir=path.join(process.env.ProgramFiles||'C:\\Program Files',vendor);return fs.existsSync(dir)?fs.readdirSync(dir).filter(n=>/jdk-?17/i.test(n)).map(n=>path.join(dir,n)):[];})].filter(Boolean);
 const javaHome=candidates.find(dir=>{const java=path.join(dir,'bin','java.exe');if(!fs.existsSync(java))return false;const r=spawnSync(java,['-version'],{encoding:'utf8'});return /version "17\./.test(r.stderr||'');});
 if(!javaHome)throw Error('JDK 17 não encontrado. Instale-o ou ajuste JAVA_HOME.');
 if(!fs.existsSync(path.join(sdk,'platforms','android-36','android.jar'))||!fs.existsSync(path.join(sdk,'build-tools','35.0.0','lib','apksigner.jar')))throw Error('Android SDK 36 e Build Tools 35.0.0 são necessários.');
 const bundletool=path.join(process.env.LOCALAPPDATA,'MonsterCrypt','Tools','bundletool-all-1.18.3.jar');
 if(!fs.existsSync(bundletool))throw Error('Bundletool oficial 1.18.3 ausente em '+bundletool);
 return{sdk,javaHome,bundletool,aapt:path.join(sdk,'build-tools','35.0.0','aapt.exe'),java:path.join(javaHome,'bin','java.exe'),keytool:path.join(javaHome,'bin','keytool.exe'),jarsigner:path.join(javaHome,'bin','jarsigner.exe'),apksigner:path.join(sdk,'build-tools','35.0.0','lib','apksigner.jar')};
}
function prepareSigning(toolchain){
 const dir=path.join(process.env.LOCALAPPDATA,'MonsterCrypt','CryptRoyale','Signing'),key=path.join(dir,'release.jks'),credentials=path.join(dir,'credentials.json');
 if(fs.existsSync(key)!==fs.existsSync(credentials))throw Error('Assinatura incompleta. Preserve a chave e recupere suas credenciais locais antes de gerar atualizações.');
 if(!fs.existsSync(key)){
  backup([key,credentials],'cryptroyale-before-signing-creation');fs.mkdirSync(dir,{recursive:true});
  const password=crypto.randomBytes(36).toString('base64url');
  run(toolchain.keytool,['-genkeypair','-keystore',key,'-storetype','JKS','-alias','crypt-royale','-keyalg','RSA','-keysize','3072','-validity','10000','-dname','CN=MonsterCrypt Crypt Royale','-storepass:env','CRYPT_SIGN_PASS','-keypass:env','CRYPT_SIGN_PASS'],{env:{...process.env,CRYPT_SIGN_PASS:password}});
  fs.writeFileSync(credentials,JSON.stringify({password}),{mode:0o600});
 }
 const {password}=read(credentials);if(typeof password!=='string'||password.length<20)throw Error('Credencial de assinatura inválida.');
 return{key,password};
}
module.exports={backup,mirror,hash,read,write,run,list,nextRelease,releaseNamespace,mirrorReleaseConflict,stamp,frozenSource,tools,prepareSigning};
