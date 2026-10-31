// Deterministic packaging derivatives of the approved artwork, no creative edits.
// Sharp may come from the official @capacitor/assets build tool.
const fs=require('node:fs'),path=require('node:path');
const sharp=require(process.env.CRYPT_ASSETS_SHARP||'sharp');
const root=path.resolve(__dirname,'..'),source=path.join(root,'public/assets/branding/crypt-royale-icon-v001.png');
(async()=>{
 const dir=path.join(root,'public/assets/branding');
 const png=async size=>sharp(source).resize(size,size,{fit:'contain',background:'#020617'}).flatten({background:'#020617'}).png().toBuffer();
 for(const [file,size]of [['icon-512.png',512],['icon-192.png',192],['apple-touch-icon.png',180],['favicon-32.png',32]])fs.writeFileSync(path.join(dir,file),await png(size));
 const sizes=[16,24,32,48,64,128,256],images=await Promise.all(sizes.map(png));
 const header=Buffer.alloc(6+16*images.length);header.writeUInt16LE(1,2);header.writeUInt16LE(images.length,4);
 let offset=header.length;
 images.forEach((image,i)=>{const base=6+i*16,size=sizes[i];header[base]=size===256?0:size;header[base+1]=size===256?0:size;header.writeUInt16LE(1,base+4);header.writeUInt16LE(32,base+6);header.writeUInt32LE(image.length,base+8);header.writeUInt32LE(offset,base+12);offset+=image.length;});
 fs.writeFileSync(path.join(dir,'crypt-royale.ico'),Buffer.concat([header,...images]));
 console.log('Approved artwork exported: web512/192, Apple touch180, favicon32, Windows ICO16–256.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
