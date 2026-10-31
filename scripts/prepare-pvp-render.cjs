// Exports only the PvP runtime dependency graph. Never copies the project tree.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const args=process.argv.slice(2);
const outputName=args.includes('--out-name')?args[args.indexOf('--out-name')+1]:'pvp-render-20261029-r2';
if(!/^pvp-render-[a-zA-Z0-9-]+$/.test(outputName||''))throw Error('Nome de pacote inválido.');
const output=path.join(root,'dist-pacote',outputName);
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const files=new Map();
function visit(rel){
 rel=rel.replaceAll('\\','/');
 if(files.has(rel))return;
 if(!/^(server\/[a-z-]+\.js|src\/(?:game\/[a-z-]+\.(?:js|json)|pvp\/(?:battle|rules)\.js|(?:shop|vip)\.js))$/.test(rel))throw Error(`Runtime fora do escopo permitido: ${rel}`);
 const full=path.resolve(root,rel);
 if(!full.startsWith(root+path.sep))throw Error('Import fora do projeto.');
 const data=fs.readFileSync(full);files.set(rel,data);
 if(!rel.endsWith('.js'))return;
 const code=data.toString('utf8');
 if(/\bimport\s*\(/.test(code))throw Error(`Import dinâmico exige revisão: ${rel}`);
 const imports=/\b(?:import|export)\s*(?:(?:[^'";]*?)\bfrom\s*)?['"]([^'"]+)['"]/g;
 for(const match of code.matchAll(imports)){
  const spec=match[1];
  if(spec.startsWith('.'))visit(path.relative(root,path.resolve(path.dirname(full),spec)));
  else if(spec!=='ws'&&!spec.startsWith('node:'))throw Error(`Dependência externa não revisada: ${spec}`);
 }
}
visit('server/main.js');
const lock=JSON.parse(fs.readFileSync(path.join(root,'package-lock.json'),'utf8'));
const ws=lock.packages['node_modules/ws'];
if(ws?.version!=='8.22.0'||!ws.integrity||!ws.resolved.startsWith('https://registry.npmjs.org/ws/'))throw Error('Lockfile ws divergente.');
const pkg={name:'crypt-royale-pvp-beta',private:true,version:'1.1.0',type:'module',engines:{node:'>=24 <25'},scripts:{start:'node server/main.js'},dependencies:{ws:ws.version}};
const json=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
files.set('package.json',json(pkg));
files.set('package-lock.json',json({name:pkg.name,version:pkg.version,lockfileVersion:3,requires:true,packages:{'':{name:pkg.name,version:pkg.version,dependencies:pkg.dependencies,engines:pkg.engines},'node_modules/ws':ws}}));
files.set('.gitignore',Buffer.from('node_modules/\n.env\n.env.*\n*.log\n*.pem\n*.key\n.keys/\n'));
files.set('.node-version',Buffer.from('24\n'));
files.set('render.yaml',Buffer.from(`services:
  - type: web
    name: crypt-royale-pvp-beta
    runtime: node
    plan: free
    numInstances: 1
    buildCommand: npm ci --omit=dev --ignore-scripts --no-audit --no-fund
    startCommand: npm start
    healthCheckPath: /health
    autoDeployTrigger: off
    envVars:
      - key: NODE_VERSION
        value: 24
      - key: NODE_ENV
        value: production
      - key: PVP_HOST
        value: 0.0.0.0
`));
files.set('README.md',Buffer.from(`# Crypt Royale — servidor PvP beta

Pacote exclusivo do runtime autoritativo. Repositório PRIVADO; não tornar público.
Node 24, apenas ws 8.22.0. Sem arquivos pessoais, service account, artes ou instaladores.

Render Web Service: plano Free, uma instância, build npm ci --omit=dev --ignore-scripts --no-audit --no-fund, start npm start, health /health.
Definir PVP_HOST=0.0.0.0; a porta vem de PORT do Render. Não adicionar cartão/plano pago.
As origens permitidas continuam explícitas no servidor; não usar * nem desativar Firebase.
Autenticação recebe ID token no primeiro frame e consulta o save do próprio usuário.
Nenhuma variável com chave privada é necessária.

Free é destinado ao beta: pode dormir após 15min sem tráfego, demorar cerca de 1min para despertar e reiniciar.
Salas ficam na memória; reinício cancela amistosos. Sem ranking, troféus ou recompensas de PvP. GET /clock fornece o horário UTC para a validade do VIP; as compras usam o save Firestore existente.
Antes de liberar: verificar HTTPS /health, WS /pvp, origem rejeitada e token inválido rejeitado, depois duas contas reais elegíveis.
Não configurar endpoint no APK antes de validar o serviço. Pacote não gera APK nem altera a versão pública do jogo.
Limite atual de 8 conexões por IP do transporte também se aplica ao proxy reverso; beta pequeno, capacidade não medida.
Não confiar em X-Forwarded-For sem revisão do proxy.
`));
const manifest={schema:1,createdAt:new Date().toISOString(),purpose:'Render Free PvP beta runtime only',publicGameVersionUnchanged:true,files:[...files].map(([file,data])=>({file,bytes:data.length,sha256:sha(data)})).sort((a,b)=>a.file.localeCompare(b.file))};
files.set('manifesto-sha256.json',json(manifest));
if(args.includes('--list')){console.log(JSON.stringify([...files.keys()].sort().map(rel=>path.join(output,rel))));process.exit(0);}
if(fs.existsSync(output))throw Error('Destino já existe; preservar pacote e escolher novo lote após backup.');
fs.mkdirSync(output,{recursive:true});
for(const[rel,data]of files){const dest=path.join(output,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data,{flag:'wx'});if(sha(fs.readFileSync(dest))!==sha(data))throw Error(`Falha ao conferir ${rel}`);}
console.log(JSON.stringify({output,files:files.size,bytes:[...files.values()].reduce((n,b)=>n+b.length,0),verified:true}));
