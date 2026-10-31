import config from './pvp-config.json' with {type:'json'};
export function vipClockEndpoint(value){
 try{const u=new URL(value.serviceUrl);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)return '';return new URL('/clock',u).href;}catch{return '';}
}
export class OnlineClock{
 constructor(url,{fetcher=globalThis.fetch,monotonic=()=>performance.now(),maxAgeMs=120000}={}){this.url=url;this.fetcher=fetcher;this.monotonic=monotonic;this.maxAgeMs=maxAgeMs;this.sample=null;this.pending=null;}
 now(){if(!this.sample)return null;const elapsed=this.monotonic()-this.sample.at;if(!Number.isFinite(elapsed)||elapsed<0||elapsed>this.maxAgeMs)return null;return Math.floor(this.sample.time+elapsed);}
 sync(){
  if(this.pending)return this.pending;
  this.pending=(async()=>{if(!this.url)throw Error('Servidor de horário ainda não configurado.');const response=await this.fetcher(this.url,{cache:'no-store',signal:AbortSignal.timeout(75000)});if(!response.ok)throw Error('Não foi possível confirmar o horário online.');const body=await response.json();if(!Number.isSafeInteger(body.serverTime)||body.serverTime<0||body.serverTime>8640000000000000)throw Error('Horário do servidor inválido.');this.sample={time:body.serverTime,at:this.monotonic()};return this.now();})();
  return this.pending.finally(()=>{this.pending=null;});
 }
}
export const vipOnlineClock=new OnlineClock(vipClockEndpoint(config));
export async function confirmedVipTime(){try{await vipOnlineClock.sync();const now=vipOnlineClock.now();if(now===null)throw Error();return now;}catch{throw Error('Conecte-se para confirmar o horário do VIP. Nenhuma nova compra foi confirmada.');}}
