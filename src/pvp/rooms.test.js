import test from 'node:test';import assert from 'node:assert/strict';
import {PvpRooms} from '../../server/rooms.js';import {eligibleProfile} from './test-profile.js';
function setup(){let time=100000;const rooms=new PvpRooms({now:()=>time}),out={a:[],b:[]};const connect=id=>rooms.attach({uid:id,name:id,profile:eligibleProfile(),expiresAt:1e12},v=>out[id].push(v),()=>{});const a=connect('a'),b=connect('b');a.message({type:'create'});const code=out.a.at(-1).room.code;b.message({type:'join',code});return{rooms,out,a,b,code,connect,advance:ms=>{time+=ms;rooms.tick();},start(){a.message({type:'ready',seq:1,ready:true});b.message({type:'ready',seq:1,ready:true});time+=3000;rooms.tick();return rooms.rooms.get(code);}};}
test('two distinct authenticated users ready, command sequencing and disconnect/reconnect share one authoritative match',()=>{
 const s=setup(),room=s.start();assert.equal(room.status,'playing');
 s.a.message({type:'deploy',seq:2,cardId:'bit-bug',x:90,y:420});const units=room.game.units.length,energy=room.game.playerEnergy;
 s.a.message({type:'deploy',seq:2,cardId:'bit-bug',x:90,y:420});assert.equal(room.game.units.length,units);assert.equal(room.game.playerEnergy,energy);assert(s.out.a.at(-1).duplicate);
 s.b.message({type:'deploy',seq:2,cardId:'bit-bug',x:90,y:420});assert(room.game.units.some(u=>u.team==='enemy'));
 s.b.detach();const before=room.game.nowMs;s.advance(10000);assert.equal(room.game.nowMs,before);assert(s.out.a.at(-1).room.paused);
 const newB=s.connect('b');assert.equal(s.out.b.at(-1).nextSeq,3);s.advance(100);assert.equal(room.game.nowMs,before+100);
 // A callback from the old connection must not disconnect its replacement.
 s.b.detach();assert(room.players[1].connected);newB.detach();s.advance(30000);assert.equal(room.status,'finished');assert.equal(room.game.winner,'player');assert.equal(s.out.a.at(-1).game.winner,'player');
 assert(!Object.hasOwn(s.out.a.at(-1).room.players[1],'profile'));assert(!Object.hasOwn(s.out.a.at(-1).room.players[1],'uid'));
});
test('leave, expiry and a double disconnection cancel or forfeit once without any wallet writes',()=>{
 const s=setup(),room=s.start(),before=structuredClone(room.players.map(p=>p.profile));s.a.message({type:'leave'});assert.equal(room.game.winner,'enemy');s.b.message({type:'leave'});assert.equal(s.rooms.rooms.size,0);assert.deepEqual(room.players.map(p=>p.profile),before);
 const d=setup(),r=d.start();d.a.detach();d.b.detach();d.advance(30000);assert.equal(r.status,'cancelled');assert.equal(r.game.winner,'draw');d.advance(120000);assert.equal(d.rooms.rooms.size,0);
 const w=setup();w.advance(600000);assert.equal(w.rooms.rooms.get(w.code).status,'cancelled');
});
test('occupied room, low level, forged score/Gold/auto, flood and reused session cannot control the other seat',()=>{
 const s=setup(),room=s.start();assert.throws(()=>s.rooms.attach({uid:'c',profile:{wallet:{xp:0}}},()=>{},()=>{}));
 s.a.message({type:'finish',seq:2,winner:'player',gold:10000});assert.equal(room.status,'playing');assert.equal(room.game.winner,null);
 s.a.message({type:'deploy',seq:3,cardId:'cache-mantis',x:90,y:420,team:'enemy'});assert.equal(room.game.units.length,0);
 s.a.message({type:'create'});assert(s.out.a.at(-1).type==='state'||s.out.a.at(-1).type==='error');assert.equal(s.rooms.rooms.size,1);
 const before=room.game.playerEnergy;for(let i=0;i<100;i++)s.a.message({type:'operator',seq:200+i});assert.equal(room.game.playerEnergy,before);assert(s.out.a.some(v=>v.type==='error'&&/Aguarde um instante/.test(v.message)));
});
