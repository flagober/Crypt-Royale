// Deterministic separation of generated poses. Source art is never overwritten.
// A rectangular crop alone can include the edge of a neighbouring sword/cape.
export function isolatePoses(rgba,width,height,{count=4,threshold=32,minArea=Math.floor(width*height*0.01)}={}) {
  if(rgba.length!==width*height*4)throw Error('Dimensões RGBA inválidas');
  const labels=new Int32Array(width*height),queue=new Int32Array(width*height),parts=[];
  let label=0;
  for(let seed=0;seed<labels.length;seed++){
    if(labels[seed]||rgba[seed*4+3]<threshold)continue;
    label++;let head=0,tail=1;queue[0]=seed;labels[seed]=label;
    let minX=width,maxX=0,minY=height,maxY=0;
    while(head<tail){
      const index=queue[head++],x=index%width,y=Math.floor(index/width);
      minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=width||ny>=height)continue;
        const next=ny*width+nx;
        if(!labels[next]&&rgba[next*4+3]>=threshold){labels[next]=label;queue[tail++]=next;}
      }
    }
    if(tail>=minArea)parts.push({label,area:tail,x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1});
  }
  if(parts.length!==count)throw Error(`Esperadas ${count} poses separadas; encontradas ${parts.length}`);
  // Sort top row then bottom row, preserving left-to-right pose order.
  parts.sort((a,b)=>(a.y+a.height/2)-(b.y+b.height/2));
  for(let row=0;row<parts.length;row+=2)parts.splice(row,2,...parts.slice(row,row+2).sort((a,b)=>a.x-b.x));
  return parts.map(part=>{
    const pixels=new Uint8ClampedArray(part.width*part.height*4);
    let footMin=width,footMax=0;
    for(let y=0;y<part.height;y++)for(let x=0;x<part.width;x++){
      const source=(part.y+y)*width+part.x+x;if(labels[source]!==part.label)continue;
      const dest=(y*part.width+x)*4;
      pixels.set(rgba.subarray(source*4,source*4+4),dest);
      if(y>=part.height-36){footMin=Math.min(footMin,x);footMax=Math.max(footMax,x);}
    }
    return {...part,pivotX:(footMin+footMax)/2,pivotY:part.height-1,pixels};
  });
}

// Some approved sheets have overlapping row bounds. Explicit row regions keep
// neighbouring bodies separate without slicing a sword at the column boundary.
export function isolateTowerPoses(rgba,width,height,spec={}) {
  if(rgba.length!==width*height*4)throw Error('Dimensões RGBA inválidas');
  const minArea=Math.floor(width*height*(spec.minPoseAreaFraction??0.01));
  if(!spec.regions)return isolatePoses(rgba,width,height,{minArea});
  const result=[];
  for(const [x,y,w,h,count]of spec.regions){
    if(![x,y,w,h,count].every(Number.isInteger)||x<0||y<0||w<=0||h<=0||x+w>width||y+h>height||count<1)throw Error('Região de poses inválida');
    const region=new Uint8ClampedArray(w*h*4);
    for(let row=0;row<h;row++)region.set(rgba.subarray(((y+row)*width+x)*4,((y+row)*width+x+w)*4),row*w*4);
    for(const frame of isolatePoses(region,w,h,{count,minArea}))result.push({...frame,x:frame.x+x,y:frame.y+y});
  }
  if(result.length!==4)throw Error('Folha de torre deve conter quatro poses');
  return result;
}
