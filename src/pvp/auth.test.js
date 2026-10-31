import test from 'node:test';import assert from 'node:assert/strict';import {generateKeyPairSync,sign} from 'node:crypto';
import {createFirebaseAuthenticator} from '../../server/firebase-auth.js';import {eligibleProfile} from './test-profile.js';
const pair=generateKeyPairSync('rsa',{modulusLength:2048});
const now=Date.now(),seconds=Math.floor(now/1000),claims={sub:'test-user',name:'Jogador',aud:'monstercrypt-core',iss:'https://securetoken.google.com/monstercrypt-core',iat:seconds-1,auth_time:seconds-20,exp:seconds+3600};
function jwt(value=claims,header={alg:'RS256',kid:'test'}){const prefix=[header,value].map(v=>Buffer.from(JSON.stringify(v)).toString('base64url')).join('.');return prefix+'.'+sign('RSA-SHA256',Buffer.from(prefix),pair.privateKey).toString('base64url');}
function fixture(profile=eligibleProfile()){const calls=[],fetcher=async(url,options)=>{calls.push({url,options});if(url.includes('/metadata/x509/'))return new Response(JSON.stringify({test:pair.publicKey.export({type:'spki',format:'pem'})}),{headers:{'cache-control':'max-age=300'}});return new Response(JSON.stringify({fields:{owner:{stringValue:'test-user'},schema:{integerValue:'1'},profileJson:{stringValue:JSON.stringify(profile)}}}));};return{calls,auth:createFirebaseAuthenticator({fetcher,now:()=>now})};}
test('Firebase RSA signature/issuer/audience/expiry are verified before reading an owner-protected save',async()=>{
 const f=fixture(),token=jwt(),identity=await f.auth(token);assert.equal(identity.uid,'test-user');assert.equal(identity.expiresAt,(seconds+3600)*1000);assert.equal(identity.profile.wallet.xp,2100);
 assert.equal(f.calls.length,2);assert(!f.calls[0].options.headers);assert.equal(f.calls[1].options.headers.Authorization,'Bearer '+token);assert(!f.calls.some(c=>c.url.includes(token)));
 await f.auth(token);assert.equal(f.calls.length,3);
 for(const changes of [{aud:'other'},{iss:'https://other'},{exp:seconds},{iat:seconds+10},{auth_time:seconds+10},{sub:''}])await assert.rejects(f.auth(jwt({...claims,...changes})));
 const parts=token.split('.');parts[1]=Buffer.from(JSON.stringify({...claims,sub:'someone-else'})).toString('base64url');await assert.rejects(f.auth(parts.join('.')));
 await assert.rejects(f.auth(jwt(claims,{alg:'none',kid:'test'})));assert.equal(f.calls.length,3);
});
test('a forged client profile cannot bypass Base7; denied remote save and malformed tokens fail closed',async()=>{
 const p=eligibleProfile();p.wallet.xp=2099;await assert.rejects(fixture(p).auth(jwt()),/Base 7/);
 const auth=createFirebaseAuthenticator({now:()=>now,fetcher:async url=>url.includes('/metadata/x509/')?new Response(JSON.stringify({test:pair.publicKey.export({type:'spki',format:'pem'})})):new Response('',{status:403})});
 await assert.rejects(auth(jwt()),/sincronize/);for(const token of ['',null,'a.b.c','.'.repeat(10000)])await assert.rejects(auth(token));
});
