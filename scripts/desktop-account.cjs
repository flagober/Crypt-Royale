const http=require('node:http'),crypto=require('node:crypto');
// OAuth stays in the system browser. No client secret or Google password enters Electron.
function googleDesktop(shell){return new Promise((resolve,reject)=>{
 const state=crypto.randomBytes(32).toString('base64url');let settled=false,timer;
 const finish=(error,value)=>{if(settled)return;settled=true;clearTimeout(timer);server.close();error?reject(error):resolve(value);};
 const server=http.createServer((req,res)=>{
  const origin=`http://127.0.0.1:${server.address().port}`,url=new URL(req.url,origin);
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  if(req.headers.host!==new URL(origin).host||url.searchParams.get('state')!==state){res.writeHead(403);res.end('Solicitação inválida');return;}
  if(req.method==='GET'&&url.pathname==='/callback'){
   const nonce=crypto.randomBytes(16).toString('base64');
   res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Content-Security-Policy',`default-src 'none'; script-src 'nonce-${nonce}'; connect-src 'self'; style-src 'unsafe-inline'; frame-ancestors 'none'`);
   res.end(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Crypt Royale · Conta</title><body style="font:18px system-ui;background:#0c172b;color:#c9f6ff;padding:40px"><h1>Crypt Royale</h1><p id="status">Concluindo seu login…</p><script nonce="${nonce}">const value=new URLSearchParams(location.hash.slice(1)).get('credential');history.replaceState(null,'','/callback');if(!value){document.getElementById('status').textContent='Login incompleto. Volte ao jogo e tente novamente.';}else{fetch('/complete?state=${state}',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential:value})}).then(r=>{if(!r.ok)throw Error();document.getElementById('status').textContent='Login concluído. Volte ao Crypt Royale. Pode fechar esta aba.';}).catch(()=>document.getElementById('status').textContent='Não foi possível concluir. Volte ao jogo e tente novamente.');}</script></body></html>`);return;
  }
  if(req.method!=='POST'||url.pathname!=='/complete'||req.headers.origin!==origin||!req.headers['content-type']?.startsWith('application/json')){res.writeHead(403);res.end();return;}
  let body='';req.on('data',chunk=>{body+=chunk;if(body.length>16000)req.destroy();});req.on('end',()=>{try{const data=JSON.parse(body);if(typeof data.credential!=='string'||!/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(data.credential))throw Error();res.writeHead(200);res.end('ok');finish(null,data.credential);}catch{res.writeHead(400);res.end();}});
 });
 server.once('error',e=>finish(e));
 server.listen(0,'127.0.0.1',()=>{
  const callback=`http://127.0.0.1:${server.address().port}/callback?state=${state}`;
  timer=setTimeout(()=>finish(Error('Login não concluído no navegador. Tente novamente.')),180000);timer.unref();
  shell.openExternal('https://monstercrypt-royale.web.app/?desktop='+encodeURIComponent(callback)).catch(e=>finish(e));
 });
});}
module.exports={googleDesktop};
