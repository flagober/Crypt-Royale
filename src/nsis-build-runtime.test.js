import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import runtime from '../scripts/nsis-build-runtime.cjs';
function processFixture(onInput){const p=new EventEmitter();p.stdout=new EventEmitter();p.stderr=new EventEmitter();p.stdin=new EventEmitter();p.stdin.end=data=>queueMicrotask(()=>onInput(p,data));p.kills=0;p.kill=()=>p.kills++;return p;}
test('extended compiler deadline leaves every other build command unchanged',async()=>{
 let calls=0;const run=runtime.nsisRunner((...args)=>{calls++;return args;},{spawnProcess:()=>{throw Error('Unexpected process');}});const result=run('jarsigner.exe',['verify'],'input',{cwd:'here'});assert.equal(calls,1);assert.equal(result[0],'jarsigner.exe');assert.equal(result[3].cwd,'here');
});
test('NSIS wrapper preserves stdin and compiler output and reports actual exit failures',async()=>{
 for(const code of [0,7]){let settings;const run=runtime.nsisRunner(()=>{}, {spawnProcess:(command,args,options)=>{settings=options;return processFixture((p,data)=>{assert.equal(data,'installer script');p.stdout.emit('data',Buffer.from('output'));p.stderr.emit('data',Buffer.from('diagnostic'));p.emit('close',code);});},heartbeatMs:0});const task=run('makensis.exe',[], 'installer script',{cwd:'build'});if(code===0)assert.deepEqual(await task,{stdout:'output',stderr:'diagnostic'});else await assert.rejects(task,/código 7.*diagnostic/s);assert.equal(settings.windowsHide,true);assert.equal(settings.cwd,'build');}
});
test('hung NSIS compiler is terminated at the bounded deadline instead of hanging forever',async()=>{
 const child=processFixture(()=>{});const run=runtime.nsisRunner(()=>{}, {spawnProcess:()=>child,timeoutMs:20,heartbeatMs:0});await assert.rejects(run('makensis.exe',[],'script'),/excedeu/);assert.equal(child.kills,1);
});
