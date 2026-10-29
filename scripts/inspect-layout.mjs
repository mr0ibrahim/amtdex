import { chromium } from 'playwright';
const browser=await chromium.launch();
const page=await browser.newPage();
for(const name of ['landing','services','dashboard','pricing','contact','service-detail']) {
 await page.goto(`http://127.0.0.1:8766/${name}.html`,{waitUntil:'networkidle'});
 for(const width of [320,768,1440]) {
  await page.setViewportSize({width,height:900});
  const issues=await page.evaluate(()=>[...document.querySelectorAll('[data-pencil-name]')].flatMap(el=>{
   const r=el.getBoundingClientRect(); if(!r.width || !r.height) return [];
   const _s=getComputedStyle(el);
   if(el.children.length || !el.textContent.trim()) return [];
   const out=[];
   if(el.scrollWidth>el.clientWidth+2 || el.scrollHeight>el.clientHeight+2) out.push('text-overflow');
   for(let p=el.parentElement;p && p!==document.body;p=p.parentElement){
    const ps=getComputedStyle(p),pr=p.getBoundingClientRect();
    if(['hidden','clip'].includes(ps.overflowY) && (r.bottom>pr.bottom+2||r.top<pr.top-2)) {out.push('clipped by '+p.dataset.pencilName);break;}
   }
   return out.length?[{name:el.dataset.pencilName,issues:out}]:[];
  }));
  console.log(name,width,JSON.stringify(issues));
 }
}
await browser.close();
