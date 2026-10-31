import http from 'node:http';
import {WebSocketServer} from 'ws';
import {PvpRooms} from './rooms.js';
import {createFirebaseAuthenticator} from './firebase-auth.js';
export const DEFAULT_ORIGINS=['http://localhost:5179','http://127.0.0.1:5179','http://100.79.208.33:5179','https://monstercrypt-royale.web.app','https://monstercrypt-royale.firebaseapp.com','http://localhost','https://localhost','capacitor://localhost','null'];
export function createPvpServer({authenticate=createFirebaseAuthenticator(),origins=DEFAULT_ORIGINS,rooms=new PvpRooms(),heartbeatMs=15000,clock=Date.now}={}){
 const httpServer=http.createServer((req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  if(req.url==='/clock'){
   const origin=req.headers.origin;if(origin&&!origins.includes(origin)){res.writeHead(403);res.end();return;}
   if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
   if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','GET');res.writeHead(204);res.end();return;}
   if(req.method==='GET'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({serverTime:clock()}));return;}
  }
  if(req.method==='GET'&&req.url==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({service:'crypt-royale-pvp',protocol:1,ok:true}));}else{res.writeHead(404);res.end();}
 });
 const wss=new WebSocketServer({noServer:true,maxPayload:8192,perMessageDeflate:false});const perIp=new Map();
 httpServer.on('upgrade',(req,socket,head)=>{
  const ip=socket.remoteAddress||'unknown';
  if(req.url!=='/pvp'||!origins.includes(req.headers.origin)||wss.clients.size>=256||(perIp.get(ip)||0)>=8){socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');return;}
  wss.handleUpgrade(req,socket,head,ws=>{perIp.set(ip,(perIp.get(ip)||0)+1);wss.emit('connection',ws,ip);});
 });
 wss.on('connection',(ws,ip)=>{
  let session=null,authenticating=false;ws.alive=true;
  const send=value=>{if(ws.readyState===1){if(ws.bufferedAmount>512000){ws.close(4008,'Conexão lenta; reconecte.');return;}ws.send(JSON.stringify(value));}};
  const timer=setTimeout(()=>{if(!session)ws.close(4003,'Entre na sua conta para jogar.');},15000);timer.unref();
  ws.on('pong',()=>{ws.alive=true;});ws.on('error',()=>{});
  ws.on('message',async(bytes,binary)=>{
   if(binary){ws.close(1003,'Mensagem inválida.');return;}
   let value;try{value=JSON.parse(bytes.toString());}catch{ws.close(1007,'Mensagem inválida.');return;}
   if(session){session.message(value);return;}
   if(authenticating||value?.type!=='auth'||value.protocol!==1){ws.close(4003,'Autenticação necessária.');return;}authenticating=true;
   try{const identity=await authenticate(value.token);if(ws.readyState!==1)return;session=rooms.attach(identity,send,(code,reason)=>ws.close(code,reason));clearTimeout(timer);}catch(e){send({type:'error',message:e.message});ws.close(4003,'Acesso não autorizado.');}
  });
  ws.on('close',()=>{clearTimeout(timer);session?.detach();perIp.set(ip,Math.max(0,(perIp.get(ip)||1)-1));if(!perIp.get(ip))perIp.delete(ip);});
 });
 const tickTimer=setInterval(()=>rooms.tick(),100);tickTimer.unref();const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.alive){ws.terminate();continue;}ws.alive=false;ws.ping();}},heartbeatMs);heartbeat.unref();
 return {httpServer,rooms,wss,async listen(port=5181,host='127.0.0.1'){await new Promise((resolve,reject)=>{httpServer.once('error',reject);httpServer.listen(port,host,resolve);});return httpServer.address();},async close(){clearInterval(tickTimer);clearInterval(heartbeat);rooms.shutdown();for(const ws of wss.clients)ws.terminate();await new Promise(resolve=>wss.close(resolve));await new Promise(resolve=>httpServer.close(resolve));}};
}
