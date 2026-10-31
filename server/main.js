import {createPvpServer,DEFAULT_ORIGINS} from './server.js';
const port=Number(process.env.PORT||5181),host=process.env.PVP_HOST||'127.0.0.1';
if(!Number.isInteger(port)||port<1||port>65535)throw Error('Porta PvP inválida.');
const service=createPvpServer({origins:process.env.PVP_ORIGINS?process.env.PVP_ORIGINS.split(',').map(v=>v.trim()).filter(Boolean):DEFAULT_ORIGINS});
await service.listen(port,host);console.log(`PvP amistoso ativo em ${host}:${port}; protocolo 1. Nenhuma credencial será registrada.`);
for(const signal of ['SIGTERM','SIGINT'])process.once(signal,async()=>{await service.close();process.exit(0);});
