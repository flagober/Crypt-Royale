import {createPublicKey,verify as verifySignature} from 'node:crypto';
import {pvpAccess} from '../src/pvp/rules.js';
const CERT_URL='https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
export function createFirebaseAuthenticator({projectId='monstercrypt-core',fetcher=fetch,now=Date.now}={}){
 let certificates={},validUntil=0,lastFetch=-Infinity;
 return async token=>{
  if(typeof token!=='string'||token.length>8192)throw Error('Autenticação inválida.');
  const parts=token.split('.');if(parts.length!==3||parts.some(p=>!p||!/^[A-Za-z0-9_-]+$/.test(p)))throw Error('Autenticação inválida.');
  let header,claims;try{header=JSON.parse(Buffer.from(parts[0],'base64url'));claims=JSON.parse(Buffer.from(parts[1],'base64url'));}catch{throw Error('Autenticação inválida.');}
  const seconds=Math.floor(now()/1000);
  if(header.alg!=='RS256'||typeof header.kid!=='string'||header.kid.length>200||claims.aud!==projectId||claims.iss!==`https://securetoken.google.com/${projectId}`||typeof claims.sub!=='string'||!claims.sub||claims.sub.length>128||!Number.isSafeInteger(claims.exp)||claims.exp<=seconds||!Number.isSafeInteger(claims.iat)||claims.iat>seconds||!Number.isSafeInteger(claims.auth_time)||claims.auth_time>seconds)throw Error('Sua sessão expirou ou não pertence a este jogo.');
  if(now()>=validUntil||!Object.hasOwn(certificates,header.kid)){
   if(now()-lastFetch<10000)throw Error('Aguarde um instante para validar a sessão.');lastFetch=now();
   const response=await fetcher(CERT_URL,{signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('Não foi possível validar o acesso com o Google.');
   certificates=await response.json();const age=Number(response.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1]||300);
   validUntil=now()+Math.min(3600,Math.max(60,age))*1000;
  }
  if(!Object.hasOwn(certificates,header.kid)||!verifySignature('RSA-SHA256',Buffer.from(parts[0]+'.'+parts[1]),createPublicKey(certificates[header.kid]),Buffer.from(parts[2],'base64url')))throw Error('Autenticação inválida.');
  // Owner-protected save, read using the player's token; no private service key is embedded.
  const response=await fetcher(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/cryptroyale_saves/${encodeURIComponent(claims.sub)}`,{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error('Entre e sincronize sua jornada antes de abrir o amistoso.');
  const document=await response.json(),fields=document.fields,raw=fields?.profileJson?.stringValue;
  if(fields?.owner?.stringValue!==claims.sub||Number(fields?.schema?.integerValue)!==1||typeof raw!=='string'||raw.length>750000)throw Error('Save da conta inválido. Seus dados foram preservados.');
  let profile;try{profile=JSON.parse(raw);}catch{throw Error('Save da conta inválido.');}
  const gate=pvpAccess(profile,true);if(!gate.allowed)throw Error(gate.reason);
  return {uid:claims.sub,name:claims.name||'Jogador',profile,expiresAt:claims.exp*1000};
 };
}
