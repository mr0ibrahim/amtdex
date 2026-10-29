import {chromium} from 'playwright';
const b=await chromium.launch();const p=await b.newPage();
for(const route of ['services','dashboard'])for(const width of [375,1440]){
 await p.setViewportSize({width,height:900});await p.goto('http://127.0.0.1:8765/'+route,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({path:`artifacts/shared-layout/${route}-${width}.png`});
 await p.locator('[data-site-footer]').screenshot({path:`artifacts/shared-layout/footer-${route}-${width}.png`});
 console.log(route,width,await p.locator('[data-site-footer]').evaluate(e=>({parent:e.parentElement.dataset.pencilName,previous:e.previousElementSibling.dataset.pencilName})));
}
await b.close();
