// Servidor local para pruebas: sirve los estáticos como Vercel (cleanUrls)
// y monta las funciones /api/ads-lead y /api/ads-lead-event con un almacén
// en memoria compartido (así se puede probar deduplicación entre envíos).
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { crearHandler: crearLead } = require(path.join(RAIZ, 'api/ads-lead.js'));
const { crearHandler: crearEvento } = require(path.join(RAIZ, 'api/ads-lead-event.js'));
const { crearMemoryStore } = require(path.join(RAIZ, 'api/_lib/ads/store-memory.js'));
const httpLib = require(path.join(RAIZ, 'api/_lib/ads/http.js'));

const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.vtt': 'text/vtt', '.ico': 'image/x-icon', '.json': 'application/json' };

export function crearServidor({ config } = {}) {
  const store = crearMemoryStore();
  const cfg = config || { entorno: 'test', modo: 'airtable', problemas: [], bloqueadoProduccion: false, leerWeb: false, turnstileSecret: '' };
  const lead = crearLead({ store, config: cfg });
  const evento = crearEvento({ store, config: cfg });
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    // Adaptador mínimo req/res estilo Vercel.
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { if (!res.getHeader('content-type')) res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)); return res; };
    if (url.pathname === '/api/ads-lead' || url.pathname === '/api/ads-lead-event') {
      let raw = '';
      for await (const ch of req) raw += ch;
      try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = raw; }
      return (url.pathname === '/api/ads-lead' ? lead : evento)(req, res);
    }
    let p = decodeURIComponent(url.pathname);
    if (p.endsWith('/')) p += 'index';
    let f = path.join(RAIZ, p);
    if (!f.startsWith(RAIZ)) { res.statusCode = 403; return res.end(); }
    try { await stat(f); if ((await stat(f)).isDirectory()) f = path.join(f, 'index.html'); }
    catch { f = f + '.html'; }
    try {
      const data = await readFile(f);
      res.setHeader('content-type', TIPOS[path.extname(f)] || 'application/octet-stream');
      res.end(data);
    } catch { res.statusCode = 404; res.end('404'); }
  });
  return { server, store, reiniciarLimite: () => httpLib._registro.clear() };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  crearServidor().server.listen(port, () => console.log(`http://localhost:${port}`));
}
