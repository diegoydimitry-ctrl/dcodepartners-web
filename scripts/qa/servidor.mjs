/*
 * Servidor estático para las pruebas de navegador: sirve la web como
 * Vercel (rutas limpias, /x → x.html, /x/ → x/index.html) y bloquea todo lo
 * que no sea local, para que una prueba no dependa de la red ni de terceros
 * (Turnstile, CookieYes, analítica). Lo usan qa-solapes y qa-demo.
 */
import http from 'node:http';
import fs from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

export async function levanta(port, extra = {}) {
  const server = http.createServer(async (req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    if (extra[p]) { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(extra[p]); }
    let f = path.join(ROOT, p);
    try {
      let st = await stat(f).catch(() => null);
      if ((!st || st.isDirectory()) && !p.endsWith('/')) { const alt = f + '.html'; const ast = await stat(alt).catch(() => null); if (ast) { f = alt; st = ast; } }
      if (st && st.isDirectory()) { f = path.join(f, 'index.html'); st = await stat(f).catch(() => null); }
      if (!st) { res.writeHead(404); return res.end('404'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      res.end(await readFile(f));
    } catch (e) { res.writeHead(500); res.end(String(e)); }
  });
  await new Promise((r) => server.listen(port, '127.0.0.1', r));
  return server;
}

// Las 72 páginas publicadas (las mismas que qa:ds).
export function paginas() {
  const out = [];
  const mira = (dir, base) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.') || ['node_modules', 'scripts', 'docs', 'lib', 'api', 'assets', 'automation'].includes(e.name)) continue;
      const rel = base + '/' + e.name;
      if (e.isDirectory()) mira(path.join(dir, e.name), rel);
      else if (e.name.endsWith('.html')) out.push(rel.replace(/index\.html$/, '').replace(/\.html$/, '') || '/');
    }
  };
  mira(ROOT, '');
  return out.sort();
}

// En este entorno Chromium vive en /opt/pw-browsers; en CI, donde lo pone
// `npx playwright install`.
export const opcionesNavegador = () => (fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});

// Solo lo local: nada de terceros.
export async function soloLocal(ctx) {
  await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
}
