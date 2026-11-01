const {app,BrowserWindow,protocol,net,session,ipcMain,shell}=require('electron');
const fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const smoke=process.argv.includes('--smoke-test');
const release=require('./versao.json');
app.setPath('userData',smoke?process.env.CRYPT_SMOKE_ROOT:path.join(app.getPath('appData'),'MonsterCrypt','CryptRoyale'));
protocol.registerSchemesAsPrivileged([{scheme:'cryptroyale',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
let window;
if(!app.requestSingleInstanceLock())app.quit();
else {
 app.on('second-instance',()=>{if(window){if(window.isMinimized())window.restore();window.focus();}});
 app.whenReady().then(async()=>{
  const root=path.join(__dirname,'dist');
  protocol.handle('cryptroyale',async request=>{
   try{
    const url=new URL(request.url);if(url.host!=='app')return new Response('Not found',{status:404});
    const pathname=decodeURIComponent(url.pathname),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return new Response('Not found',{status:404});
    const result=await net.fetch(pathToFileURL(file).href);
    const headers=new Headers(result.headers);headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' data: blob:; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://crypt-royale-commerce-beta.onrender.com; object-src 'none'; base-uri 'none'");
    return new Response(result.body,{status:result.status,headers});
   }catch{return new Response('Invalid resource',{status:400});}
  });
  session.defaultSession.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
  window=new BrowserWindow({width:1280,height:900,minWidth:420,minHeight:650,title:'Crypt Royale',icon:path.join(root,'assets/branding/icon-512.png'),show:!smoke,autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'electron-preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true}});
  let googlePending=false;
  ipcMain.handle('crypt:google',async event=>{
   if(event.sender!==window.webContents||!event.senderFrame.url.startsWith('cryptroyale://app/')||googlePending)throw Error('Solicitação de login inválida.');
   googlePending=true;try{return await require('./scripts/desktop-account.cjs').googleDesktop(shell);}finally{googlePending=false;}
  });
  window.webContents.setWindowOpenHandler(({url})=>{
   if(['https://monstercrypt-royale.web.app/privacy.html','https://monstercrypt-royale.web.app/delete-account.html'].includes(url)||url.startsWith('https://www.mercadopago.com')||url.startsWith('https://mercadopago.com')||url.startsWith('https://sandbox.mercadopago.com')){
    shell.openExternal(url);
   }
   return {action:'deny'};
  });
  window.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith('cryptroyale://app/'))event.preventDefault();});
  if(smoke){
   const timer=setTimeout(()=>{console.error('Smoke test excedeu o prazo');app.exit(1)},30000);
   window.webContents.on('did-fail-load',()=>{clearTimeout(timer);app.exit(1)});
   window.webContents.once('did-finish-load',async()=>{
    try{
     const result=await window.webContents.executeJavaScript(`new Promise((resolve,reject)=>{const end=Date.now()+15000;const check=()=>{const title=document.querySelector('h1')?.textContent||'';const images=[...document.images];const renderedVersion=document.querySelector('main[data-cr-version]')?.dataset.crVersion===${JSON.stringify(release.versao)};if(renderedVersion&&title.includes('Crypt Royale')&&images.length>=4&&images.every(i=>i.complete&&i.naturalWidth>0))return resolve({title,images:images.length,version:${JSON.stringify(app.getVersion())},renderedVersion:${JSON.stringify(release.versao)}});if(Date.now()>end)return reject(Error('Arena ou imagens não carregaram'));setTimeout(check,100)};check()})`);
     console.log('CRYPT_ROYALE_SMOKE_OK '+JSON.stringify(result));clearTimeout(timer);app.exit(0);
    }catch(e){console.error(e.message);clearTimeout(timer);app.exit(1)}
   });
  }
  await window.loadURL('cryptroyale://app/');
 });
 app.on('window-all-closed',()=>app.quit());
}
