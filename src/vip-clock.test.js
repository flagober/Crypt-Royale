import test from 'node:test';import assert from 'node:assert/strict';import {OnlineClock,vipClockEndpoint} from './vip-clock.js';
test('trusted clock follows monotonic elapsed time, expires stale samples and ignores local calendar changes',async()=>{
 let elapsed=100,requests=0;const c=new OnlineClock('https://example.invalid/clock',{monotonic:()=>elapsed,fetcher:async()=>{requests++;return{ok:true,json:async()=>({serverTime:1800000000000})};}});
 assert.equal(c.now(),null);await c.sync();assert.equal(c.now(),1800000000000);elapsed+=5000;assert.equal(c.now(),1800000005000);elapsed+=120001;assert.equal(c.now(),null);elapsed=10;assert.equal(c.now(),null);assert.equal(requests,1);
});
test('clock refuses malformed or failed server responses and unsafe endpoints',async()=>{
 for(const response of [{ok:false},{ok:true,json:async()=>({serverTime:'tomorrow'})},{ok:true,json:async()=>({serverTime:-1})}]){const c=new OnlineClock('https://example.invalid/clock',{fetcher:async()=>response});await assert.rejects(c.sync());assert.equal(c.now(),null);}
 for(const serviceUrl of ['http://example.invalid','https://secret@example.invalid','https://example.invalid?key=secret','https://example.invalid/#key'])assert.equal(vipClockEndpoint({serviceUrl}),'');
 assert.equal(vipClockEndpoint({serviceUrl:'https://example.invalid'}),'https://example.invalid/clock');
});
