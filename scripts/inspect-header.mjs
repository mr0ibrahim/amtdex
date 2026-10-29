import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const b=await chromium.launch();const p=await b.newPage();await fs.mkdir('artifacts/header-fix',{recursive:true});
await p.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
for(const w of [320,390,768,1440]){await p.setViewportSize({width:w,height:900});await p.screenshot({path:`artifacts/header-fix/before-${w}.png`});console.log(w,await p.locator('[data-pencil-name="Landing Page"] > [data-pencil-name="Nav"]').evaluate(e=>({height:e.getBoundingClientRect().height,children:[...e.children].map(c=>({name:c.dataset.pencilName,r:c.getBoundingClientRect().toJSON()}))})));}
await p.setViewportSize({width:390,height:900});await p.locator('.amtdex-nav-toggle').click();await p.screenshot({path:'artifacts/header-fix/before-open.png'});await b.close();
