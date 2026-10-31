import {TOWER_ART} from './tower-animation.js';
import {isolatePoses} from './tower-frames.js';
let assets=null,pending=null;
export const getTowerArt=()=>assets;
async function image(file){const img=new Image();img.src='/'+file.replace(/^\.\//,'');await img.decode();return img;}
export function prepareTowerArt(){
  if(assets)return Promise.resolve(assets);
  if(pending)return pending;
  if(typeof document==='undefined')return Promise.reject(Error('Canvas indisponível'));
  pending=(async()=>{
    const [tower,base]=await Promise.all([TOWER_ART.tower.file,TOWER_ART.guard.base.file].map(image));
    const archers={};
    for(const [id,spec]of Object.entries(TOWER_ART.archers)){
      const img=await image(spec.file),sheet=document.createElement('canvas');sheet.width=img.width;sheet.height=img.height;
      const context=sheet.getContext('2d',{willReadFrequently:true});context.drawImage(img,0,0);
      const frames=isolatePoses(context.getImageData(0,0,img.width,img.height).data,img.width,img.height);
      const surfaces=frames.map((frame,index)=>{
        const declared=spec.frames[index];
        for(const key of ['x','y','width','height','pivotX','pivotY'])if(frame[key]!==declared[key])throw Error(`Pose frontal divergente: ${id}/${index}/${key}`);
        const surface=document.createElement('canvas');surface.width=frame.width;surface.height=frame.height;
        surface.getContext('2d').putImageData(new ImageData(frame.pixels,frame.width,frame.height),0,0);return surface;
      });
      archers[id]={surfaces};
    }
    const characters={};
    for(const spec of TOWER_ART.characters){
      const directions={};
      for(const [name,direction] of Object.entries(spec.directions)){
        const img=await image(direction.file),canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;
        const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
        const frames=isolatePoses(ctx.getImageData(0,0,img.width,img.height).data,img.width,img.height);
        const surfaces=frames.map((frame,index)=>{
          const declared=direction.frames[index];
          if(frame.x!==declared.x||frame.y!==declared.y||frame.width!==declared.width||frame.height!==declared.height)throw Error(`Pose divergente: ${spec.id}/${name}/${index}`);
          const surface=document.createElement('canvas');surface.width=frame.width;surface.height=frame.height;
          surface.getContext('2d').putImageData(new ImageData(frame.pixels,frame.width,frame.height),0,0);return surface;
        });
        directions[name]={spec:direction,surfaces};
      }
      characters[spec.id]=directions;
    }
    return assets={tower,base,archers,characters};
  })().catch(error=>{pending=null;throw error;});
  return pending;
}


