const fs=require('node:fs'),path=require('node:path');
const auth=require('C:/Users/flavi/AppData/Local/npm-cache/_npx/36e7d4fb91a22cc5/node_modules/firebase-tools/lib/auth.js');
(async()=>{
 const a=auth.getGlobalDefaultAccount();if(!a)throw Error('Login Firebase necessário.');
 const {access_token}=await auth.getAccessToken(a.tokens.refresh_token,[]);
 const call=async(url,method='GET',body)=>{const r=await fetch(url,{method,headers:{Authorization:'Bearer '+access_token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});const d=await r.json();if(!r.ok)throw Error('Firebase HTTP '+r.status);return d;};
 const base='https://firebase.googleapis.com/v1beta1/projects/monstercrypt-core',bundleId='com.monstercrypt.cryptroyale';
 const existing=await call(base+'/iosApps');let app=(existing.apps||[]).find(a=>a.bundleId===bundleId);
 if(!app){let operation=await call(base+'/iosApps','POST',{displayName:'Crypt Royale iOS',bundleId});for(let i=0;!operation.done&&i<20;i++){await new Promise(r=>setTimeout(r,1000));operation=await call('https://firebase.googleapis.com/v1beta1/'+operation.name);}if(!operation.done||operation.error)throw Error('Cadastro Firebase iOS pendente.');app=operation.response;}
 if(app.bundleId!==bundleId)throw Error('App iOS divergente.');
 const sdk=await call('https://firebase.googleapis.com/v1beta1/'+app.name+'/config');const plist=Buffer.from(sdk.configFileContents,'base64').toString();
 if(!plist.includes(bundleId))throw Error('Configuração iOS divergente.');
 const root=path.resolve(__dirname,'../..');fs.writeFileSync(path.join(root,'ios/App/App/GoogleService-Info.plist'),plist);
 console.log('FIREBASE_IOS_OWN_APP_CONFIGURED '+app.appId);
})().catch(e=>{console.error(e.message);process.exitCode=1;});
