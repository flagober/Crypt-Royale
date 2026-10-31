import {randomInt,randomUUID} from 'node:crypto';
import {stepGame} from '../src/game/engine.js';
import {createPvpBattle,pvpView,applyPvpCommand} from '../src/pvp/battle.js';
import {pvpAccess,validCode,normalizeCode,ROOM_ALPHABET,PVP_PROTOCOL} from '../src/pvp/rules.js';

const GRACE=30000,WAIT_TTL=600000,END_TTL=120000;
const safeName=name=>String(name||'Jogador').replace(/[\u0000-\u001f\u007f]/g,'').slice(0,30)||'Jogador';
export class PvpRooms{
 constructor({now=Date.now,capacity=64}={}){this.now=now;this.capacity=capacity;this.rooms=new Map();this.clients=new Map();this.members=new Map();this.lastTick=now();}
 attach(identity,send,close){
  if(!identity?.uid||!pvpAccess(identity.profile,true).allowed)throw Error('Acesso ao amistoso ainda bloqueado.');
  const previous=this.clients.get(identity.uid);
  if(previous){previous.close(4001,'Outra conexão assumiu esta conta.');this.clients.delete(identity.uid);}
  const client={...identity,name:safeName(identity.name),send,close,connected:true,lastActivity:this.now(),bucket:20,bucketAt:this.now()};
  this.clients.set(identity.uid,client);
  const room=this.rooms.get(this.members.get(identity.uid));
  if(room){const seat=room.players.find(p=>p.uid===identity.uid);seat.connected=true;seat.disconnectedAt=null;room.version++;this.broadcast(room);}
  else send({type:'state',protocol:PVP_PROTOCOL,room:null,game:null});
  return {message:data=>this.message(client,data),detach:()=>{if(this.clients.get(identity.uid)!==client)return;this.clients.delete(identity.uid);const r=this.rooms.get(this.members.get(identity.uid));if(!r)return;const p=r.players.find(p=>p.uid===identity.uid);p.connected=false;p.disconnectedAt=this.now();r.version++;this.broadcast(r);}};
 }
 code(){for(let i=0;i<100;i++){const code=Array.from({length:6},()=>ROOM_ALPHABET[randomInt(ROOM_ALPHABET.length)]).join('');if(!this.rooms.has(code))return code;}throw Error('Tente criar a sala novamente.');}
 roomFor(client){return this.rooms.get(this.members.get(client.uid));}
 seat(client){return {uid:client.uid,name:client.name,profile:structuredClone(client.profile),connected:true,ready:false,disconnectedAt:null,lastSeq:0};}
 message(client,data){
  if(this.clients.get(client.uid)!==client)return;
  try{
   if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Mensagem inválida.');
   const now=this.now();client.bucket=Math.min(20,client.bucket+(now-client.bucketAt)/100);client.bucketAt=now;
   if(client.bucket<1)throw Error('Aguarde um instante antes de enviar outro comando.');client.bucket--;
   if(client.expiresAt&&now>=client.expiresAt){client.close(4003,'Entre novamente para continuar.');return;}
   let room=this.roomFor(client);
   if(data.type==='create'){
    if(room)throw Error('Saia da sala atual antes de criar outra.');
    if(this.rooms.size>=this.capacity)throw Error('Servidor ocupado. Tente novamente em instantes.');
    room={id:randomUUID(),code:this.code(),players:[this.seat(client)],status:'waiting',createdAt:now,version:0,game:null,countdownAt:null,endedAt:null,resultReason:''};
    this.rooms.set(room.code,room);this.members.set(client.uid,room.code);this.broadcast(room);return;
   }
   if(data.type==='join'){
    if(room)throw Error('Você já está em uma sala.');const code=normalizeCode(data.code);
    if(!validCode(code))throw Error('Confira o código de seis caracteres.');room=this.rooms.get(code);
    if(!room||room.status!=='waiting'||room.players.length!==1)throw Error('Sala não encontrada ou indisponível.');
    if(room.players[0].uid===client.uid)throw Error('Use duas contas diferentes no amistoso.');
    room.players.push(this.seat(client));this.members.set(client.uid,room.code);room.version++;this.broadcast(room);return;
   }
   if(!room)throw Error('Crie ou entre em uma sala.');
   const seat=room.players.findIndex(p=>p.uid===client.uid),player=room.players[seat];
   if(data.type==='leave'){this.leave(room,seat);return;}
   if(!Number.isSafeInteger(data.seq)||data.seq<1)throw Error('Sequência de comando inválida.');
   if(data.seq<=player.lastSeq){client.send({type:'ack',seq:data.seq,ok:true,duplicate:true});return;}
   if(data.seq!==player.lastSeq+1){this.sendState(room,seat);throw Error('Sincronizando os comandos da partida.');}
   player.lastSeq=data.seq;
   let result={ok:true};
   if(data.type==='ready'){
    if(!['waiting','countdown'].includes(room.status)||typeof data.ready!=='boolean')throw Error('A preparação da sala já terminou.');
    player.ready=data.ready;
    if(room.players.length===2&&room.players.every(p=>p.ready&&p.connected)){room.status='countdown';room.countdownAt=now+3000;}
    else{room.status='waiting';room.countdownAt=null;}
   }else{
    if(room.status!=='playing'||room.players.some(p=>!p.connected))throw Error('Aguarde a partida ou a reconexão do seu rival.');
    result=applyPvpCommand(room.game,seat,data);
   }
   room.version++;client.send({type:'ack',seq:data.seq,...result});this.broadcast(room);
  }catch(e){client.send({type:'error',message:e.message});const room=this.roomFor(client);if(room)this.sendState(room,room.players.findIndex(p=>p.uid===client.uid));}
 }
 finish(room,winner,reason){
  if(['finished','cancelled'].includes(room.status))return;
  room.status=winner===null?'cancelled':'finished';room.resultReason=reason;room.endedAt=this.now();room.version++;
  if(room.game){room.game.status='finished';room.game.winner=winner===null?'draw':winner;}
  this.broadcast(room);
 }
 leave(room,seat){
  const player=room.players[seat],client=this.clients.get(player.uid);
  if(['waiting','countdown'].includes(room.status))this.finish(room,null,'Sala encerrada por um participante.');
  else if(room.status==='playing')this.finish(room,seat===0?'enemy':'player','Vitória por desistência do rival.');
  this.members.delete(player.uid);player.connected=false;player.disconnectedAt=this.now();client?.send({type:'state',protocol:PVP_PROTOCOL,room:null,game:null});
  if(room.players.every(p=>this.members.get(p.uid)!==room.code))this.rooms.delete(room.code);
 }
 sendState(room,seat){
  const player=room.players[seat],client=this.clients.get(player.uid);if(!client||this.members.get(player.uid)!==room.code)return;
  const absent=room.players.filter(p=>!p.connected),remaining=absent.length?Math.max(0,GRACE-(this.now()-Math.min(...absent.map(p=>p.disconnectedAt??this.now())))):GRACE;
  client.send({type:'state',protocol:PVP_PROTOCOL,nextSeq:player.lastSeq+1,room:{code:room.code,status:room.status,seat,players:room.players.map(p=>({name:p.name,connected:p.connected,ready:p.ready})),paused:room.status==='playing'&&absent.length>0,countdownMs:Math.max(0,(room.countdownAt||0)-this.now()),reconnectSeconds:Math.ceil(remaining/1000),resultReason:room.resultReason},game:room.game?pvpView(room.game,seat):null});
 }
 broadcast(room){room.players.forEach((p,i)=>this.sendState(room,i));}
 tick(){
  const now=this.now(),elapsed=Math.min(250,Math.max(0,now-this.lastTick));this.lastTick=now;
  for(const room of this.rooms.values()){
   if(['finished','cancelled'].includes(room.status)){
    if(now-room.endedAt>=END_TTL){for(const p of room.players)if(this.members.get(p.uid)===room.code){this.members.delete(p.uid);this.clients.get(p.uid)?.send({type:'state',protocol:PVP_PROTOCOL,room:null,game:null});}this.rooms.delete(room.code);}continue;
   }
   if(now-room.createdAt>=WAIT_TTL&&room.status!=='playing'){this.finish(room,null,'O tempo para iniciar a sala terminou.');continue;}
   const missing=room.players.filter(p=>!p.connected);
   if(missing.length){
    if(missing.some(p=>now-p.disconnectedAt>=GRACE)){
     const online=room.players.filter(p=>p.connected);const winner=room.status==='playing'&&online.length===1?(room.players.indexOf(online[0])===0?'player':'enemy'):null;
     this.finish(room,winner,winner?'Vitória por desconexão do rival.':'Sala encerrada por desconexão.');
    }else if(room.status==='countdown'){room.status='waiting';room.players.forEach(p=>p.ready=false);room.countdownAt=null;this.broadcast(room);}
    else this.broadcast(room);
    continue;
   }
   if(room.status==='countdown'&&now>=room.countdownAt){room.game=createPvpBattle(room.players.map(p=>p.profile),randomInt(0x100000000));room.status='playing';room.version++;this.broadcast(room);continue;}
   if(room.status==='countdown'){this.broadcast(room);continue;}
   if(room.status==='playing'){
    for(let left=elapsed;left>0;left-=Math.min(50,left))stepGame(room.game,Math.min(50,left));
    room.version++;
    if(room.game.status==='finished')this.finish(room,room.game.winner,'Partida concluída pelo servidor.');else this.broadcast(room);
   }
  }
 }
 shutdown(){for(const room of this.rooms.values())this.finish(room,null,'Servidor reiniciando. O amistoso foi cancelado.');for(const c of this.clients.values())c.close(1012,'Servidor reiniciando.');this.clients.clear();}
}
