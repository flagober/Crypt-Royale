import test from 'node:test';import assert from 'node:assert/strict';import {PvpClient,pvpEndpoint} from './client.js';
class Socket extends EventTarget{
 static instances=[];
 constructor(){super();this.readyState=0;this.sent=[];Socket.instances.push(this);}
 open(){this.readyState=1;this.dispatchEvent(new Event('open'));}
 receive(value){this.dispatchEvent(new MessageEvent('message',{data:JSON.stringify(value)}));}
 send(value){this.sent.push(JSON.parse(value));}
 close(code=1006){this.readyState=3;const event=new Event('close');Object.defineProperty(event,'code',{value:code});this.dispatchEvent(event);}
}

test('a development remote endpoint never activates an unverified production connection',()=>{
 const config={websocketUrl:'',devWebsocketUrl:'wss://example.invalid/pvp'};
 assert.equal(pvpEndpoint(config,{dev:false}),'');
 assert.equal(pvpEndpoint(config,{dev:true}),'wss://example.invalid/pvp');
});
test('default timers keep the browser Window receiver when called through the controller',()=>{
 const originalClear=globalThis.clearTimeout,originalSet=globalThis.setTimeout;let clears=0,sets=0;
 try{
  globalThis.clearTimeout=function(){assert.equal(this,globalThis);clears++;};
  globalThis.setTimeout=function(){assert.equal(this,globalThis);sets++;return 1;};
  const client=new PvpClient({url:'wss://example.invalid/pvp',getToken:async()=>'',WebSocketImpl:Socket});
  client.timers.setTimeout(()=>{},1);client.disconnect();assert.equal(sets,1);assert.equal(clears,1);
 }finally{globalThis.clearTimeout=originalClear;globalThis.setTimeout=originalSet;}
});
const room={code:'ABC234',status:'waiting',seat:0,players:[{ready:false,connected:true}],paused:false};
test('reconnection authenticates again and restores authoritative command sequence without replaying a move',async()=>{
 const jobs=[];const client=new PvpClient({url:'wss://example.invalid/pvp',getToken:async()=>'fixture',WebSocketImpl:Socket,timers:{setTimeout:fn=>{jobs.push(fn);return jobs.length;},clearTimeout:()=>{}}});
 await client.connect();const first=Socket.instances.at(-1);assert.equal(client.state.status,'connecting');first.open();assert.equal(first.sent[0].type,'auth');
 first.receive({type:'state',protocol:1,nextSeq:5,room,game:null});assert.equal(client.state.status,'connected');assert(client.ready(true));assert.equal(first.sent.at(-1).seq,5);first.close();assert.equal(client.state.status,'reconnecting');assert(client.state.room.paused);
 jobs.shift()();await new Promise(r=>setImmediate(r));const second=Socket.instances.at(-1);assert.notEqual(second,first);second.open();assert.equal(second.sent.length,1);
 second.receive({type:'state',protocol:1,nextSeq:5,room,game:null});assert(client.ready(true));assert.equal(second.sent.at(-1).seq,5);assert.equal(second.sent.length,2);
 client.disconnect();assert.equal(client.state.status,'offline');assert.equal(client.state.room,null);
});
test('account replacement, incompatible protocol and denied auth stop retry rather than reconnecting indefinitely',async()=>{
 for(const code of [4001,4003]){
  const jobs=[];const client=new PvpClient({url:'wss://example.invalid/pvp',getToken:async()=>'fixture',WebSocketImpl:Socket,timers:{setTimeout:fn=>jobs.push(fn),clearTimeout:()=>{}}});await client.connect();const s=Socket.instances.at(-1);s.open();s.close(code);assert.equal(client.state.status,'error');assert.equal(jobs.length,0);client.disconnect();
 }
 const c=new PvpClient({url:'wss://example.invalid/pvp',getToken:async()=>'fixture',WebSocketImpl:Socket});await c.connect();const s=Socket.instances.at(-1);s.open();s.receive({type:'state',protocol:99,room:null});assert.equal(c.state.status,'error');assert.match(c.state.message,/Atualize/);c.disconnect();
});
test('late token resolution cannot open a socket after logout; blocked socket creation is a controlled error',async()=>{
 let finish;const pending=new Promise(resolve=>finish=resolve),count=Socket.instances.length,c=new PvpClient({url:'wss://example.invalid/pvp',getToken:()=>pending,WebSocketImpl:Socket});const connecting=c.connect();c.disconnect();finish('fixture');await connecting;assert.equal(Socket.instances.length,count);
 class Blocked{constructor(){throw Error('Blocked');}}
 const b=new PvpClient({url:'wss://example.invalid/pvp',getToken:async()=>'fixture',WebSocketImpl:Blocked});await b.connect();assert.equal(b.state.status,'error');assert.match(b.state.message,/abrir a conexão/);
});

test('an explicit rejected handshake stops retries even when a proxy loses the close code',async()=>{
 const jobs=[],c=new PvpClient({url:'wss://example.invalid/pvp',getToken:async()=>'fixture',WebSocketImpl:Socket,timers:{setTimeout:fn=>jobs.push(fn),clearTimeout:()=>{}}});
 await c.connect();const s=Socket.instances.at(-1);s.open();s.receive({type:'error',message:'Autenticação inválida.'});s.close(1006);
 assert.equal(c.state.status,'error');assert.equal(c.state.message,'Autenticação inválida.');assert.equal(jobs.length,0);c.disconnect();
});

test('a cold free server gets a longer initial retry window without replaying room commands',async()=>{
 const jobs=[],c=new PvpClient({url:'wss://example.invalid/pvp',getToken:async()=>'fixture',WebSocketImpl:Socket,timers:{setTimeout:(fn,delay)=>{jobs.push({fn,delay});return jobs.length;},clearTimeout:()=>{}}});
 await c.connect();
 for(let i=0;i<7;i++){Socket.instances.at(-1).close();assert.equal(c.state.status,'reconnecting');const job=jobs.shift();assert(job.delay<=8000);job.fn();await new Promise(r=>setImmediate(r));}
 const s=Socket.instances.at(-1);s.open();s.receive({type:'state',protocol:1,room:null,nextSeq:1});assert.equal(c.state.status,'connected');assert.equal(s.sent.length,1);c.disconnect();
});
