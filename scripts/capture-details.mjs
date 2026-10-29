import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const b=await chromium.launch();const p=await b.newPage();
await fs.mkdir('artifacts/responsive-audit/details',{recursive:true});
for(const width of [375,1440]){
 await p.setViewportSize({width,height:900});
 await p.goto('http://127.0.0.1:8766/landing.html',{waitUntil:'networkidle'});
 await p.evaluate(()=>document.fonts.ready);
 for(const name of ['Hero','Workflow','Live Orbit','Pricing','Footer']) await p.locator(`[data-pencil-name="Landing Page"] > [data-pencil-name="${name}"]`).screenshot({path:`artifacts/responsive-audit/details/${name.replaceAll(' ','-')}-${width}.png`});
}
await b.close();
