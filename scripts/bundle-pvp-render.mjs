import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {rolldown} from 'rolldown';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const sourceName=args[0]||'pvp-render-20261029-r2',outputName=args[1]||'pvp-render-20261029-bundle';
if(![sourceName,outputName].every(n=>/^pvp-render-[a-zA-Z0-9-]+$/.test(n)))throw Error('Nome de pacote inválido.');
const source=path.join(root,'dist-pacote',sourceName);
const output=path.join(root,'dist-pacote',outputName);
const sha=b=>createHash('sha256').update(b).digest('hex');
if(fs.existsSync(output))throw Error('Destino existente: preservar e revisar um novo lote.');
const originalManifest=fs.readFileSync(path.join(source,'manifesto-sha256.json'));
const original=JSON.parse(originalManifest);
for(const f of original.files)if(sha(fs.readFileSync(path.join(source,f.file)))!==f.sha256)throw Error('Snapshot alterado: '+f.file);
const allowed=new Set(original.files.map(f=>path.resolve(source,f.file).replaceAll('\\','/')));
let bundle;
try{
 bundle=await rolldown({cwd:source,input:'server/main.js',platform:'node',external:id=>id==='ws'||id.startsWith('node:')});
 const generated=await bundle.generate({format:'esm',sourcemap:false,codeSplitting:false});
 const chunks=generated.output;
 if(chunks.length!==1||chunks[0].type!=='chunk')throw Error('Saída não é um único runtime.');
 for(const file of Object.keys(chunks[0].modules))if(!allowed.has(file.replaceAll('\\','/'))&&file!=='\0rolldown/runtime.js')throw Error('Módulo fora do snapshot: '+file);
 const files=new Map([['server.mjs',Buffer.from(chunks[0].code)]]);
 for(const rel of ['package.json','package-lock.json','.node-version','render.yaml','README.md','.gitignore'])files.set(rel,fs.readFileSync(path.join(source,rel)));
 const pkg=JSON.parse(files.get('package.json'));pkg.scripts.start='node server.mjs';files.set('package.json',Buffer.from(JSON.stringify(pkg,null,2)+'\n'));
 files.set('README.md',Buffer.from(files.get('README.md').toString()+'\nRuntime consolidado por Rolldown a partir do snapshot verificado. O manifesto registra os hashes do pacote e do manifesto-fonte. Sem mapas de fonte, arte, dados pessoais ou chaves.\n'));
 const manifest={schema:1,createdAt:new Date().toISOString(),purpose:'Private Render Free beta runtime bundle',sourceSnapshotManifestSha256:sha(originalManifest),files:[...files].map(([file,data])=>({file,bytes:data.length,sha256:sha(data)}))};
 files.set('manifesto-sha256.json',Buffer.from(JSON.stringify(manifest,null,2)+'\n'));
 fs.mkdirSync(output,{recursive:true});
 for(const[rel,data]of files){fs.writeFileSync(path.join(output,rel),data,{flag:'wx'});if(sha(fs.readFileSync(path.join(output,rel)))!==sha(data))throw Error('Hash divergente: '+rel);}
 console.log(JSON.stringify({output,files:files.size,bytes:[...files.values()].reduce((n,b)=>n+b.length,0),modules:Object.keys(chunks[0].modules).length,verified:true}));
}finally{await bundle?.close();}
