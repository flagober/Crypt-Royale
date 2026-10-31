// The pinned builder has a fixed 4-minute stdin compiler deadline. Give only
// makensis a bounded 10-minute deadline without changing dependencies or signing.
const path=require('node:path');
const {spawn}=require('node:child_process');
function nsisRunner(original,{spawnProcess=spawn,timeoutMs=600000,heartbeatMs=30000}={}){
 return (command,args,data,options={})=>{
  if(path.basename(command).toLowerCase()!=='makensis.exe')return original(command,args,data,options);
  return new Promise((resolve,reject)=>{
   const child=spawnProcess(command,args,{...options,windowsHide:true,stdio:['pipe','pipe','pipe']});
   let out='',err='',finished=false;
   const end=(error,result)=>{if(finished)return;finished=true;clearTimeout(deadline);clearInterval(heartbeat);error?reject(error):resolve(result);};
   const deadline=setTimeout(()=>{child.kill();end(Error('A criação do instalador Windows excedeu o limite de10 minutos. O pacote anterior foi preservado.'));},timeoutMs);
   const heartbeat=heartbeatMs?setInterval(()=>process.stdout.write('NSIS: compilando instalador, aguardando dentro do prazo de10 minutos…\n'),heartbeatMs):null;
   child.once('error',e=>end(e));child.stdin.on('error',e=>end(e));
   const capture=which=>chunk=>{if(which==='out')out+=chunk.toString();else err+=chunk.toString();if(out.length+err.length>8*1024*1024){child.kill();end(Error('Saída do compilador excedeu o limite de diagnóstico.'));}};
   child.stdout.on('data',capture('out'));child.stderr.on('data',capture('err'));
   child.once('close',code=>code===0?end(null,{stdout:out,stderr:err}):end(Error('Compilador NSIS encerrou com código '+code+': '+err.slice(-4000)+'\n'+out.slice(-4000))));
   child.stdin.end(data);
  });
 };
}
function install(){
 if(require('electron-builder/package.json').version!=='26.15.3')throw Error('Revisar o prazo NSIS antes de atualizar electron-builder.');
 const util=require('builder-util');util.spawnAndWriteWithOutput=nsisRunner(util.spawnAndWriteWithOutput);
}
if(process.env.CRYPT_NSIS_EXTENDED==='1')install();
module.exports={nsisRunner};
