import {PVP_PROTOCOL,normalizeCode,validCode} from './rules.js';
export function pvpEndpoint(config,{dev=false,location=globalThis.location}={}){
 const endpoint=config.websocketUrl||(dev?config.devWebsocketUrl:'');
 if(!endpoint&&!dev)return '';
 try{
  const url=new URL(endpoint||`${location.protocol==='https:'?'wss:':'ws:'}//${location.host}/pvp-socket`);
  if(url.username||url.password||url.hash||url.search)return '';
  if(url.protocol==='wss:')return url.href;
  if(dev&&url.protocol==='ws:'&&['localhost','127.0.0.1','100.79.208.33'].includes(url.hostname))return url.href;
 }catch{}return '';
}
export class PvpClient{
 constructor({url,getToken,WebSocketImpl=globalThis.WebSocket,timers={setTimeout:(fn,ms)=>globalThis.setTimeout(fn,ms),clearTimeout:id=>globalThis.clearTimeout(id)}}){
  this.url=url;this.getToken=getToken;this.WebSocketImpl=WebSocketImpl;this.timers=timers;this.listeners=new Set();this.state={status:'offline',message:'',room:null,game:null,busy:false};this.generation=0;this.nextSeq=1;this.retries=0;this.stopped=true;
 }
 subscribe=fn=>{this.listeners.add(fn);return()=>this.listeners.delete(fn);};
 getSnapshot=()=>this.state;
 emit(patch){this.state={...this.state,...patch};for(const fn of this.listeners)fn();}
 async connect(){
  if(this.socket?.readyState===1||this.state.status==='connecting')return;
  if(this.state.status==='error')this.retries=0;
  this.stopped=false;this.timers.clearTimeout(this.retryTimer);const generation=++this.generation;
  this.emit({status:this.state.room?'reconnecting':'connecting',message:'Conectando ao amistoso…',busy:false});
  if(!this.url){this.emit({status:'error',message:'O servidor do amistoso está em preparação.'});return;}
  let token;try{token=await this.getToken();if(!token)throw Error();}catch{if(generation===this.generation)this.emit({status:'error',message:'Entre na sua conta e sincronize antes de jogar.'});return;}
  if(generation!==this.generation||this.stopped)return;
  let socket;try{socket=this.socket=new this.WebSocketImpl(this.url);}catch{this.emit({status:'error',message:'Não foi possível abrir a conexão com o amistoso.'});return;}let authenticated=false;
  socket.addEventListener('open',()=>{if(generation!==this.generation)return;socket.send(JSON.stringify({type:'auth',protocol:PVP_PROTOCOL,token}));token=null;});
  socket.addEventListener('message',event=>{
   if(generation!==this.generation||this.stopped)return;
   let message;try{message=JSON.parse(event.data);}catch{return;}
   if(message.type==='state'){
    if(message.protocol!==PVP_PROTOCOL){this.stopped=true;this.emit({status:'error',message:'Atualize o jogo para entrar neste servidor.'});socket.close();return;}
    const changedRoom=(message.room?.code||null)!==(this.state.room?.code||null);
    if(!authenticated||changedRoom){this.nextSeq=message.nextSeq||1;authenticated=true;this.feedback='';}else if(Number.isSafeInteger(message.nextSeq))this.nextSeq=Math.max(this.nextSeq,message.nextSeq);
    this.retries=0;
    if(this.suppressedRoom&&message.room?.code===this.suppressedRoom)return;
    if(!message.room)this.suppressedRoom=null;
    const pending=this.pending;if(!pending||!pending.seq||message.nextSeq>pending.seq)this.pending=null;
    this.emit({status:'connected',room:message.room,game:message.game,busy:!!this.pending,message:message.room?.paused?'Rival desconectado. Aguardando reconexão.':this.feedback||(message.room?'Sala conectada.':'Pronto para desafiar um amigo.')});
   }else if(message.type==='ack'){
    if(this.pending?.seq===message.seq)this.pending=null;
    this.feedback=message.ok?'':message.reason||'Ação indisponível.';this.emit({busy:!!this.pending,message:this.feedback});
   }else if(message.type==='error'){
    this.pending=null;this.feedback=message.message||'Não foi possível concluir.';
    // A proxy can lose the close code; an explicit denied handshake is final.
    if(!authenticated){this.stopped=true;this.emit({status:'error',busy:false,message:this.feedback});socket.close(4003);return;}
    this.emit({busy:false,message:this.feedback});
   }
  });
  socket.addEventListener('error',()=>{if(generation===this.generation)this.emit({message:'Não foi possível alcançar o servidor do amistoso.'});});
  socket.addEventListener('close',event=>{
   if(generation!==this.generation||this.stopped)return;this.pending=null;
   if([4001,4003].includes(event.code)){this.stopped=true;this.emit({status:'error',busy:false,message:event.code===4001?'Esta conta foi conectada em outro aparelho.':this.state.message||'Entre novamente para continuar.'});return;}
   if(this.retries>=(this.state.room?6:12)){this.emit({status:'error',busy:false,message:'Servidor indisponível. Tente reconectar.'});return;}
   this.emit({status:'reconnecting',busy:false,room:this.state.room?{...this.state.room,paused:true}:null,message:this.state.room?'Conexão interrompida. Tentando reconectar…':'Conectando ao amistoso. O servidor gratuito pode levar cerca de um minuto para despertar…'});
   const delay=Math.min(8000,500*2**this.retries++);this.retryTimer=this.timers.setTimeout(()=>this.connect(),delay);
  });
 }
 send(type,extra={}){
  if(this.state.status!=='connected'||this.socket?.readyState!==1||this.pending){this.emit({message:'Aguarde a conexão ou a confirmação da última ação.'});return false;}
  const sequenced=['ready','deploy','operator'].includes(type),message={type,...extra,...(sequenced?{seq:this.nextSeq++}:{})};
  this.feedback='';this.pending={seq:message.seq||0};this.emit({busy:true,message:''});this.socket.send(JSON.stringify(message));return true;
 }
 create=()=>this.send('create');
 join=code=>{const normalized=normalizeCode(code);if(!validCode(normalized)){this.emit({message:'Confira o código de seis caracteres.'});return false;}return this.send('join',{code:normalized});};
 ready=value=>this.send('ready',{ready:value});
 deploy=(cardId,x,y)=>this.send('deploy',{cardId,x,y});
 operator=()=>this.send('operator');
 leave(){
  this.suppressedRoom=this.state.room?.code||null;
  if(this.socket?.readyState===1)this.socket.send(JSON.stringify({type:'leave'}));
  else this.disconnect();
  this.pending=null;this.emit({room:null,game:null,busy:false});
 }
 disconnect(){this.stopped=true;this.generation++;this.timers.clearTimeout(this.retryTimer);this.socket?.close();this.socket=null;this.pending=null;this.emit({status:'offline',busy:false,room:null,game:null});}
}
