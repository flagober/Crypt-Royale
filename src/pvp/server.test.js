import test from 'node:test';import assert from 'node:assert/strict';import WebSocket from 'ws';
import {createPvpServer} from '../../server/server.js';import {PvpClient,pvpEndpoint} from './client.js';import {eligibleProfile} from './test-profile.js';
const origin='http://localhost:5179';
function peer(url,token){const ws=new WebSocket(url,{origin}),messages=[];ws.on('message',data=>messages.push(JSON.parse(data)));return{ws,messages,async ready(){await new Promise((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject);});ws.send(JSON.stringify({type:'auth',protocol:1,token}));await until(()=>messages.some(m=>m.type==='state'));},last(){return messages.filter(m=>m.type==='state').at(-1);}};}
const until=async fn=>{const end=Date.now()+5000;while(!fn()){if(Date.now()>end)throw Error('WebSocket test timed out');await new Promise(r=>setTimeout(r,10));}};

test('public VIP clock exposes only server time and grants CORS only to configured origins',async t=>{
 const server=createPvpServer({clock:()=>1800000000000}),address=await server.listen(0);t.after(()=>server.close());const url=`http://127.0.0.1:${address.port}/clock`;
 const allowed=await fetch(url,{headers:{Origin:origin}});assert.equal(allowed.status,200);assert.equal(allowed.headers.get('access-control-allow-origin'),origin);assert.deepEqual(await allowed.json(),{serverTime:1800000000000});assert.equal(allowed.headers.get('cache-control'),'no-store');
 const denied=await fetch(url,{headers:{Origin:'https://attacker.invalid'}});assert.equal(denied.status,403);assert.equal(denied.headers.get('access-control-allow-origin'),null);
});
test('two real WebSocket clients share rooms, authoritative deployment and server-confirmed resignation',async t=>{
 const server=createPvpServer({authenticate:async token=>{if(!['a','b'].includes(token))throw Error('Acesso negado');return{uid:token,profile:eligibleProfile(),name:token};}}),address=await server.listen(0);t.after(()=>server.close());
 const url=`ws://127.0.0.1:${address.port}/pvp`,a=peer(url,'a'),b=peer(url,'b');t.after(()=>{a.ws.terminate();b.ws.terminate();});await Promise.all([a.ready(),b.ready()]);
 a.ws.send(JSON.stringify({type:'create'}));await until(()=>a.last()?.room);b.ws.send(JSON.stringify({type:'join',code:a.last().room.code}));await until(()=>b.last()?.room);
 a.ws.send(JSON.stringify({type:'ready',seq:1,ready:true}));b.ws.send(JSON.stringify({type:'ready',seq:1,ready:true}));await until(()=>a.last()?.room.status==='playing');assert.equal(b.last().room.status,'playing');
 a.ws.send(JSON.stringify({type:'deploy',seq:2,cardId:'bit-bug',x:90,y:420}));await until(()=>b.last()?.game.units.length>0);assert.equal(b.last().game.units[0].team,'enemy');assert(!b.last().game.enemyHand);
 b.ws.send(JSON.stringify({type:'leave'}));await until(()=>a.last()?.room.status==='finished');assert.equal(a.last().game.winner,'player');assert.equal(server.rooms.rooms.size,1);
});
test('transport rejects origins, unsigned sessions, non-JSON messages and oversized frames',async t=>{
 const server=createPvpServer({authenticate:async()=>{throw Error('Acesso negado');}}),address=await server.listen(0);t.after(()=>server.close());const url=`ws://127.0.0.1:${address.port}/pvp`;
 const wrong=new WebSocket(url,{origin:'https://attacker.invalid'});await new Promise(resolve=>wrong.on('error',resolve));
 for(const message of ['not json',JSON.stringify({type:'create'}),JSON.stringify({type:'auth',protocol:1,token:'wrong'}),'x'.repeat(9000)]){
  const ws=new WebSocket(url,{origin});ws.on('error',()=>{});await new Promise(resolve=>ws.once('open',resolve));const closed=new Promise(resolve=>ws.once('close',code=>resolve(code)));ws.send(message);const code=await closed;assert.notEqual(code,1000);
 }
 assert.equal(server.rooms.rooms.size,0);const health=await fetch(`http://127.0.0.1:${address.port}/health`);assert.equal(health.status,200);assert.equal((await health.json()).service,'crypt-royale-pvp');
});
test('browser client handshake, pending commands, leave and unsupported protocols never simulate local combat',async t=>{
 const server=createPvpServer({authenticate:async()=>({uid:'client',profile:eligibleProfile()})}),address=await server.listen(0);t.after(()=>server.close());
 class OriginSocket extends WebSocket{constructor(url){super(url,{origin});}}
 const client=new PvpClient({url:`ws://127.0.0.1:${address.port}/pvp`,getToken:async()=>'test-only',WebSocketImpl:OriginSocket});t.after(()=>client.disconnect());
 await client.connect();await until(()=>client.state.status==='connected');assert(client.create());assert(!client.create());await until(()=>client.state.room);
 assert(client.ready(true));await until(()=>client.state.room.players[0].ready);assert.equal(client.state.game,null);client.leave();await until(()=>client.state.room===null&&!client.state.busy);
 const firstCode=client.suppressedRoom;
 assert(client.create());await until(()=>client.state.room&&client.state.room.code!==firstCode);
 assert(client.ready(true));await until(()=>client.state.room.players[0].ready);assert.equal(server.rooms.rooms.get(client.state.room.code).players[0].lastSeq,1);
 assert(client.send('deploy',{cardId:'bit-bug',x:90,y:420}));await until(()=>!client.state.busy&&/Aguarde a partida/.test(client.state.message));
 assert.equal(client.state.game,null);assert(!pvpEndpoint({websocketUrl:'ws://public.example/pvp'}));assert(!pvpEndpoint({websocketUrl:'wss://public.example/pvp?token=abc'}));assert.equal(pvpEndpoint({websocketUrl:'wss://public.example/pvp'}),'wss://public.example/pvp');assert.equal(pvpEndpoint({websocketUrl:''}),'');
});
