// Serveur statique minimal avec la même CSP stricte que coltam.fr / mwanga.partners (sans 'unsafe-inline').
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import url from 'node:url';
const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
export const CSP = "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";
export function serve(port = 0) {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p === '/') { res.writeHead(302, { Location: '/docs/' }); return res.end(); }
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(root, p);
    if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Content-Security-Policy': CSP });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((ok) => srv.listen(port, () => ok(srv)));
}
if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
  const s = await serve(8080); console.log(`Documentation : http://localhost:${s.address().port}/docs/`);
}
