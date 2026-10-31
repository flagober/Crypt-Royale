const fs=require('node:fs'),path=require('node:path');
const {list,hash,run}=require('./release-tools.cjs');
function buildIosSource(stage,version){
 const root=path.join(stage,'ios-project-package');fs.mkdirSync(root,{recursive:true});
 const sources=['package.json','package-lock.json','versao.json','capacitor.config.json','scripts/prepare-build-tools.cjs','scripts/prepare-ios.cjs','docs/IOS-APP-STORE.md'];
 for(const folder of ['ios','dist'])for(const file of list(path.join(stage,folder))){const rel=path.relative(stage,file).replaceAll('\\','/');if(/(^|\/)(Pods|build|DerivedData|xcuserdata|node_modules)(\/|$)|ios\/App\/App\/public\//.test(rel))continue;sources.push(rel);}
 const hashes={};for(const file of sources){if(/\.(jks|keystore|p12|pem|key|p8|pfx|mobileprovision)$|(^|\/)\.env|credentials|serviceAccount/i.test(file))throw Error('Arquivo privado recusado no projeto iOS.');const src=path.join(stage,file),target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(src,target);hashes[file]=hash(target);}
 fs.writeFileSync(path.join(root,'LEIA-ME.txt'),`Crypt Royale v${version.versao} — projeto iOS para Mac. NÃO É IPA.\nNo Mac: npm ci, depois node scripts/prepare-ios.cjs.\nLeia docs/IOS-APP-STORE.md. Conta Apple, assinatura, Sign in with Apple e testes reais ainda são necessários.\n`);
 fs.writeFileSync(path.join(root,'conteudo-sha256.json'),JSON.stringify(hashes,null,2));
 const output=path.join(stage,`Crypt_Royale_v${version.versao}_Projeto_iOS.zip`),verify=path.join(stage,'ios-project-verify');
 const q=s=>"'"+s.replaceAll("'","''")+"'";
 const command=`$ErrorActionPreference='Stop'\n$ProgressPreference='SilentlyContinue'\nCompress-Archive -Path ${q(path.join(root,'*'))} -DestinationPath ${q(output)}\nExpand-Archive -LiteralPath ${q(output)} -DestinationPath ${q(verify)}`;
 run('powershell.exe',['-NoProfile','-NonInteractive','-EncodedCommand',Buffer.from(command,'utf16le').toString('base64')]);
 for(const [file,digest]of Object.entries(hashes))if(hash(path.join(verify,file))!==digest)throw Error('Projeto iOS extraído divergente: '+file);
 console.log('Projeto iOS ZIP verificado; assinatura/IPA exigem Mac.');return output;
}
module.exports={buildIosSource};
