const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const lib='C:/Users/flavi/AppData/Local/npm-cache/_npx/36e7d4fb91a22cc5/node_modules/firebase-tools/lib';
const auth=require(lib+'/auth.js');
const project='monstercrypt-core',appId='1:55881240320:android:d9dc02768db2fe8005ede5',root=path.resolve(__dirname,'../..');
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
(async()=>{
 const a=auth.getGlobalDefaultAccount();if(!a)throw Error('Login Firebase ausente');
 const {access_token}=await auth.getAccessToken(a.tokens.refresh_token,[]);
 const api=async(url,method='GET',body)=>{const r=await fetch(url,{method,headers:{Authorization:'Bearer '+access_token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});if(!r.ok)throw Error('HTTP '+r.status+' '+new URL(url).pathname);return r.json();};
 if(process.argv.includes('--domain')){
  const base=`https://identitytoolkit.googleapis.com/admin/v2/projects/${project}/config`,config=await api(base);
  const domain='monstercrypt-royale.web.app';
  if(!config.authorizedDomains.includes(domain))await api(base+'?updateMask=authorizedDomains','PATCH',{authorizedDomains:[...config.authorizedDomains,domain]});
  const confirmed=await api(base);if(!confirmed.authorizedDomains.includes(domain))throw Error('Domínio não confirmado.');
  console.log('ROYale_HOSTING_AUTH_DOMAIN_OK');
 }
 if(process.argv.includes('--android')){
  const {tools,prepareSigning}=require(root+'/scripts/release-tools.cjs'),t=tools(),s=prepareSigning(t);
  const cert=spawnSync(t.keytool,['-list','-v','-keystore',s.key,'-alias','crypt-royale','-storepass:env','CRYPT_SIGN_PASS'],{encoding:'utf8',env:{...process.env,CRYPT_SIGN_PASS:s.password}});
  if(cert.status!==0)throw Error('Não foi possível conferir certificado local.');
  const hashes=[...(cert.stdout+'\n'+cert.stderr).matchAll(/SHA(1|256):\s*([A-F0-9:]+)/gi)].map(m=>({type:'SHA_'+m[1],hash:m[2].replaceAll(':','')}));
  if(hashes.length!==2)throw Error('SHA1/SHA256 não encontrados.');
  const base=`https://firebase.googleapis.com/v1beta1/projects/${project}/androidApps/${appId}`;
  const existing=(await api(base+'/sha')).certificates||[];
  for(const h of hashes)if(!existing.some(c=>c.shaHash.toUpperCase()===h.hash.toUpperCase()))await api(base+'/sha','POST',{shaHash:h.hash,certType:h.type});
  const sdk=await api(base+'/config');const config=JSON.parse(Buffer.from(sdk.configFileContents,'base64').toString());
  config.client=config.client.filter(c=>c.client_info.android_client_info.package_name==='com.monstercrypt.cryptroyale');
  if(config.client.length!==1||config.client[0].client_info.mobilesdk_app_id!==appId)throw Error('Config Android não corresponde ao Crypt Royale.');
  fs.writeFileSync(root+'/android/app/google-services.json',JSON.stringify(config,null,2)+'\n');console.log('ANDROID_OWN_APP_CONFIG_OK certificate hashes registered');
 }
 if(process.argv.includes('--rules')){
  const base=`https://firebaserules.googleapis.com/v1/projects/${project}`,release=await api(base+'/releases/cloud.firestore');
  const previous=await api('https://firebaserules.googleapis.com/v1/'+release.rulesetName);
  if(previous.source.files.length!==1)throw Error('Regras com múltiplas fontes; revisar manualmente.');
  const original=previous.source.files[0].content;
  if(original.includes('match /cryptroyale_saves/'))throw Error('Regras Crypt Royale já existem; conferir antes de atualizar.');
  const point=original.lastIndexOf('\n  }');if(point<0)throw Error('Estrutura de regras inesperada.');
  const fragment=fs.readFileSync(root+'/firestore.royale.rules','utf8');
  const updated=original.slice(0,point)+'\n    '+fragment.replaceAll('\n','\n    ')+'\n'+original.slice(point);
  if(updated.replace('\n    '+fragment.replaceAll('\n','\n    ')+'\n','')!==original)throw Error('Preservação de regras existentes falhou.');
  const dir=path.join(process.env.LOCALAPPDATA,'MonsterCrypt','CryptRoyale','CloudSnapshot',Date.now().toString());fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'before.json'),JSON.stringify({release,previous},null,2));fs.writeFileSync(path.join(dir,'proposed.rules'),updated);
  const rs=await api(base+'/rulesets','POST',{source:{files:[{name:previous.source.files[0].name,content:updated}]}});
  const check=await api(base+'/releases/cloud.firestore');if(check.rulesetName!==release.rulesetName)throw Error('As regras mudaram durante a revisão; atualização cancelada.');
  const applied=await api(base+'/releases/cloud.firestore?updateMask=rulesetName','PATCH',{release:{name:release.name,rulesetName:rs.name}});
  const confirmed=await api('https://firebaserules.googleapis.com/v1/'+applied.rulesetName);
  if(digest(confirmed.source.files[0].content)!==digest(updated))throw Error('Regras publicadas divergentes.');
  fs.writeFileSync(path.join(dir,'verified.json'),JSON.stringify({applied,originalHash:digest(original),newHash:digest(updated)},null,2));
  console.log('RULES_MERGE_VERIFIED '+rs.name+' previous rules preserved byte-for-byte');
 }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
