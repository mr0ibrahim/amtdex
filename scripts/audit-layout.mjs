import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const phase = process.argv[2] || 'before';
const widths = [320,375,390,768,1024,1280,1440];
const pages = (await fs.readdir('frontend')).filter(f=>f.endsWith('.html'));
const browser = await chromium.launch();
const context = await browser.newContext();
const results = [];
await fs.mkdir(`artifacts/responsive-audit/${phase}`,{recursive:true});
for (const file of pages) {
 const page = await context.newPage();
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:8766/${file}`,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 for(const width of widths){
  await page.setViewportSize({width,height:900});
  await page.waitForTimeout(60);
  const info=await page.evaluate(()=>{
   const bad=[...document.querySelectorAll('[data-pencil-name]')].filter(el=>{
    const r=el.getBoundingClientRect(),s=getComputedStyle(el);
    return r.width>0 && r.height>0 && s.position!=='fixed' && (r.left < -1 || r.right>innerWidth+1);
   }).map(el=>({name:el.dataset.pencilName,parent:el.parentElement?.dataset.pencilName,x:Math.round(el.getBoundingClientRect().x),width:Math.round(el.getBoundingClientRect().width)}));
   return {scrollWidth:document.documentElement.scrollWidth,bad};
  });
  results.push({file,width,...info,errors});
  await page.screenshot({path:`artifacts/responsive-audit/${phase}/${file.replace('.html','')}-${width}.png`,fullPage:true});
 }
 console.log(file,results.filter(r=>r.file===file).map(r=>`${r.width}:${r.bad.length}`).join(' '));
 await page.close();
}
await fs.writeFile(`artifacts/responsive-audit/${phase}/results.json`,JSON.stringify(results,null,2));
await browser.close();
