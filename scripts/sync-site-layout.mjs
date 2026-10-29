import fs from 'node:fs/promises';

// Edit frontend/partials/{header,footer}.html, then run this script.
// Laravel includes the generated Blade partials; standalone HTML is updated at build time.
for (const name of ['header', 'footer']) {
 const html = (await fs.readFile(`frontend/partials/${name}.html`, 'utf8')).trim();
 const blade = html.replace(/href="([\w-]+)\.html(#[^"]*)?"/g, (_, page, hash='') => `href="{{ url('${page === 'index' ? '' : page}') }}${hash}"`);
 await fs.writeFile(`resources/views/partials/site-${name}.blade.php`, blade+'\n');
 for (const file of (await fs.readdir('frontend')).filter(file=>file.endsWith('.html'))) {
  const path = `frontend/${file}`;
  const source = await fs.readFile(path,'utf8');
  const pattern = new RegExp(`<!-- site-${name}:start -->[\\s\\S]*?<!-- site-${name}:end -->`);
  if (!pattern.test(source)) throw new Error(`Missing ${name} slot in ${file}`);
  await fs.writeFile(path, source.replace(pattern, `<!-- site-${name}:start -->\n${html}\n<!-- site-${name}:end -->`));
 }
}
