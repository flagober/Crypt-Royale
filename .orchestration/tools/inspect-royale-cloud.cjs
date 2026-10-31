const fs=require('node:fs'),path=require('node:path');
const lib='C:/Users/flavi/AppData/Local/npm-cache/_npx/36e7d4fb91a22cc5/node_modules/firebase-tools/lib';
const auth=require(lib+'/auth.js');
(async()=>{
 const a=auth.getGlobalDefaultAccount(); if(!a)throw Error('Login Firebase ausente');
 const {access_token}=await auth.getAccessToken(a.tokens.refresh_token,[]);
 const get=async url=>{const r=await fetch(url,{headers:{Authorization:'Bearer '+access_token}});if(!r.ok)throw Error('HTTP '+r.status+' '+new URL(url).pathname);return r.json();};
 const project='monstercrypt-core';
 const release=await get(`https://firebaserules.googleapis.com/v1/projects/${project}/releases/cloud.firestore`);
 const rules=await get(`https://firebaserules.googleapis.com/v1/${release.rulesetName}`);
 const dir=path.join(process.env.LOCALAPPDATA,'MonsterCrypt','CryptRoyale','CloudSnapshot',Date.now().toString());fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'rules-release.json'),JSON.stringify({release,rules},null,2));
 console.log('RULES_BACKUP_LOCAL '+dir);
 console.log(rules.source.files.map(f=>f.content).join('\n'));
 const config=await get(`https://identitytoolkit.googleapis.com/admin/v2/projects/${project}/config`);
 console.log('AUTH_CONFIGURATION '+JSON.stringify({authorizedDomains:config.authorizedDomains,emailEnabled:config.signIn?.email?.enabled}));
 const google=await get(`https://identitytoolkit.googleapis.com/admin/v2/projects/${project}/defaultSupportedIdpConfigs/google.com`);
 console.log('GOOGLE_PROVIDER '+JSON.stringify({enabled:google.enabled,clientId:google.clientId}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
