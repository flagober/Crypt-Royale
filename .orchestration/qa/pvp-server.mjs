// Isolated, loopback-only UI test. No real accounts, cloud writes, keys or production auth flag.
import {createPvpServer} from '../../server/server.js';
import {eligibleProfile} from '../../src/pvp/test-profile.js';
const service=createPvpServer({origins:['http://localhost:5179','http://127.0.0.1:5179'],authenticate:async token=>{
 if(!['fixture-a','fixture-b'].includes(token))throw Error('Fixture local inválida.');
 return {uid:token,name:token==='fixture-a'?'Guardião Azul':'Sentinela Violeta',profile:eligibleProfile()};
}});
await service.listen(5182,'127.0.0.1');console.log('UI fixture PvP em loopback:5182. Sem acesso a contas reais.');
setTimeout(async()=>{await service.close();process.exit(0);},20*60000).unref();
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await service.close();process.exit(0);});
