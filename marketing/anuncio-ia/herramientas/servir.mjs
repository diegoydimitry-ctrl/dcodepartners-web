import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'
const raiz = process.argv[2], puerto = +process.argv[3] || 4700
const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.svg': 'image/svg+xml', '.wav': 'audio/wav', '.mp4': 'video/mp4' }
http.createServer((q, r) => {
  const p = path.join(raiz, decodeURIComponent(new URL(q.url, 'http://x').pathname))
  if (!p.startsWith(raiz) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end('no') }
  r.writeHead(200, { 'content-type': tipos[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); fs.createReadStream(p).pipe(r)
}).listen(puerto, '127.0.0.1', () => console.log('sirviendo', raiz, puerto))
