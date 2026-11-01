// Explicit server-only export; never copy .env, account files or the game tree.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),name=process.argv[2];
if(!/^commerce-api-\d{8}-r\d+$/.test(name||''))throw Error('Use an unused commerce-api-YYYYMMDD-rN name.');
const output=path.join(root,'dist-pacote',name);if(fs.existsSync(output))throw Error('Preserve existing package; choose a new revision.');
const files=new Map();
for(const rel of ['commerce/package.json','commerce/package-lock.json','commerce/main.js','server/commerce-http.js','server/payments-domain.js','server/payments-repository.js','server/mercadopago.js','server/payment-events.js']){
 let bytes=Buffer.from(fs.readFileSync(path.join(root,rel),'utf8').replaceAll('\r\n','\n'));
 const dest=rel.startsWith('server/')?'lib/'+path.basename(rel):path.basename(rel);
 if(rel==='commerce/main.js')bytes=Buffer.from(bytes.toString('utf8').replaceAll("from '../server/","from './lib/"));
 files.set(dest,bytes);
}
files.set('.node-version',Buffer.from('24\n'));
files.set('.gitignore',Buffer.from('node_modules/\n.env\n.env.*\n.keys/\n*.pem\n*.key\n*.log\n'));
files.set('README.md',Buffer.from('# Crypt Royale commerce — homologation\n\nSeparate Render Free service. Root directory commerce, build npm ci --omit=dev --ignore-scripts --no-audit --no-fund, start npm start, health /health. Auto deploy OFF. No paid plan.\n\nGET /health proves process liveness only. GET /ready proves configuration checks. Checkout remains disabled in source; no charges can be created. Never advertise purchases as available until authoritative spending, cloud rules/IAM and provider end-to-end tests pass.\n\nPrivate Render settings only: GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/firebase-commerce.json, MERCADOPAGO_ACCESS_TOKEN, MP_COLLECTOR_ID, MP_LIVE_MODE, MP_WEBHOOK_SECRET. Never commit any values or upload credentials before owner approval of the new Render recipient. Existing PvP files/start command remain untouched.\n\nAPI: public /api/v1/catalog; authenticated GET /api/v1/gold/balance and /api/v1/orders/{id}; signed POST /api/v1/webhooks/mercadopago?data.id={id}. Invalid signatures do not query the provider. POST /api/v1/orders deliberately returns 503 and creates no charge.\n\nNo crypto treasury, transfers, MetaMask/Phantom or DNS changes. Free service can sleep; it is a homologation environment, not payment availability assurance.\n'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest={createdAt:new Date().toISOString(),checkoutEnabled:false,gameVersionUnchanged:true,files:[...files].map(([file,data])=>({file,sha256:sha(data),bytes:data.length}))};
files.set('manifesto-sha256.json',Buffer.from(JSON.stringify(manifest,null,2)+'\n'));
fs.mkdirSync(output,{recursive:true});for(const[rel,bytes]of files){const dest=path.join(output,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});if(sha(fs.readFileSync(dest))!==sha(bytes))throw Error('Export integrity failed.');}
console.log(JSON.stringify({output,files:files.size,verified:true}));
