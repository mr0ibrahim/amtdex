import { PNG } from 'pngjs';
import fs from 'node:fs/promises';
const names=['404','about','article','blog','booking','case-study','clients','contact','cookies','dashboard','help','pricing','privacy','projects','service-detail','services','status','terms'];
for(let start=0;start<names.length;start+=6){
 const out=new PNG({width:1800,height:2100});out.data.fill(240);
 for(let i=0;i<6 && start+i<names.length;i++){
  const src=PNG.sync.read(await fs.readFile(`artifacts/responsive-audit/after/${names[start+i]}-375.png`));
  const scale=Math.min(300/src.width,2050/src.height);
  for(let y=0;y<src.height*scale;y++)for(let x=0;x<src.width*scale;x++){
   const si=(Math.floor(y/scale)*src.width+Math.floor(x/scale))*4,di=((y+30)*out.width+i*300+x)*4;
   src.data.copy(out.data,di,si,si+4);
  }
 }
 await fs.writeFile(`artifacts/responsive-audit/sheet-${start/6+1}.png`,PNG.sync.write(out));
 console.log(start/6+1,names.slice(start,start+6).join(', '));
}
