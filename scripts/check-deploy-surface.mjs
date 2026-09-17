#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Centinela de la superficie de despliegue de dcodepartners.com
//
//   npm run check:superficie                → modo estático (sin red)
//   npm run check:superficie -- --url URL   → además sondea un despliegue real
//                                              (Preview o Production)
//
// MODO ESTÁTICO. Parte de `git ls-files` (lo que clona la integración de Git de
// Vercel), aplica los ignores por defecto de Vercel más .vercelignore con la
// MISMA librería y la misma composición que @vercel/client (getVercelIgnore) y
// obtiene la lista exacta de ficheros que llegan al despliegue. Falla si:
//   1. entra cualquier fichero que no sea de un tipo público permitido;
//   2. entra cualquier ruta interna conocida (docs, scripts, .github, automation,
//      auditoria, *.md, *.yml, *.workflow.json, CLAUDE.md, .env…);
//   3. falta algo imprescindible (páginas, CSS, funciones y su lib);
//   4. /lib deja de estar cortado por la redirección de vercel.json (lib/ tiene
//      que desplegarse porque api/chat.js lo importa, pero no debe leerse).
// Se ha comprobado que falla con el .vercelignore anterior a la corrección y
// con uno vacío (ver docs/INFORME-EXPOSICION-WEB-20260917.md).
//
// MODO --url. Pide rutas internas conocidas y exige que NO respondan 200 con
// contenido, y pide rutas públicas y exige 200.
// ─────────────────────────────────────────────────────────────────────────────
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import ignore from 'ignore';

const ROOT = new URL('..', import.meta.url).pathname;
const args = process.argv.slice(2);
const urlArg = args.includes('--url') ? args[args.indexOf('--url') + 1] : null;
const vercelignorePath = args.includes('--ignore-file') ? args[args.indexOf('--ignore-file') + 1] : join(ROOT, '.vercelignore');

// Copia literal de los ignores por defecto de @vercel/client (utils/getVercelIgnore).
const VERCEL_DEFAULT_IGNORES = ['.hg', '.git', '.gitmodules', '.svn', '.cache', '.next', '.now', '.vercel', '.npmignore', '.dockerignore', '.gitignore', '.*.swp', '.DS_Store', '.wafpicke-*', '.lock-wscript', '.env.local', '.env.*.local', '.venv', '.yarn/cache', '.pnp*', 'npm-debug.log', 'config.gypi', 'node_modules', '__pycache__', 'venv', 'CVS'];
const clearRelative = (s) => s.replace(/(\n|^)\.\//g, '$1');

export function deployedFiles(files, vercelignoreText) {
  const ig = ignore().add(`${VERCEL_DEFAULT_IGNORES.join('\n')}\n${clearRelative(vercelignoreText)}`);
  return files.filter((f) => !ig.ignores(f));
}

const PUBLIC_EXT = /\.(html|css|js|mjs|json|png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|xml|txt|webmanifest|mp4|webm|pdf)$/i;
const FORBIDDEN = [
  /^docs\//, /^scripts\//, /^\.github\//, /^automation\//, /^auditoria\//, /^informes?\//i,
  /(^|\/)README(\.[a-z]+)?$/i, /(^|\/)CLAUDE\.md$/i, /(^|\/)AGENTS\.md$/i, /\.mdx?$/i, /\.ya?ml$/i,
  /\.workflow\.json$/i, /(^|\/)\.env/, /(^|\/)\.vercelignore$/, /\.bundle$/, /\.patch$/, /\.bat$/i,
  /(^|\/)package-lock\.json$/, /(^|\/)tsconfig\.json$/,
];
// Ficheros que existen fuera de assets/ y deben llegar (no se sirven como estático
// o se cortan por redirección, pero el despliegue los necesita).
const SERVER_ONLY = new Set(['package.json', 'vercel.json', 'assets/.gitkeep']);
const REQUIRED = ['index.html', 'en/index.html', '404.html', 'contacto.html', 'sistema-financiero/demo.html', 'assets/css/styles.css', 'assets/js/main.js', 'assets/data/knowledge-base.json', 'robots.txt', 'sitemap.xml', 'api/chat.js', 'api/contact-fallback.js', 'api/_lib/providers.js', 'package.json', 'vercel.json'];

function staticCheck() {
  const files = execSync('git ls-files -z', { cwd: ROOT }).toString().split('\0').filter(Boolean).filter((f) => existsSync(join(ROOT, f)));
  const text = existsSync(vercelignorePath) ? readFileSync(vercelignorePath, 'utf8') : '';
  const deployed = deployedFiles(files, text);
  const errors = [];

  for (const f of deployed) {
    if (FORBIDDEN.some((re) => re.test(f))) errors.push(`INTERNO en el despliegue: ${f}`);
    else if (!SERVER_ONLY.has(f) && !PUBLIC_EXT.test(f)) errors.push(`Tipo no permitido en el despliegue: ${f}`);
  }
  const set = new Set(deployed);
  for (const r of REQUIRED) if (files.includes(r) && !set.has(r)) errors.push(`FALTA en el despliegue (la web lo necesita): ${r}`);

  // Toda página HTML versionada tiene que publicarse (evita que la lista blanca
  // se coma una sección nueva sin que nadie lo note).
  for (const f of files) if (/\.html$/.test(f) && !FORBIDDEN.some((re) => re.test(f)) && !set.has(f)) errors.push(`Página HTML fuera del despliegue: ${f}`);

  // Nada de código de servidor fuera de api/: lo que api/ necesita vive en
  // api/_lib/, que Vercel ni publica como estático ni convierte en función.
  for (const f of deployed) if (/^lib\//.test(f)) errors.push(`Código servido fuera de api/: ${f} (muévelo a api/_lib/)`);

  const internalsInRepo = files.filter((f) => FORBIDDEN.some((re) => re.test(f)));
  console.log(`Superficie estática: ${files.length} ficheros versionados → ${deployed.length} desplegados; ${internalsInRepo.length} internos en el repo, ${internalsInRepo.filter((f) => set.has(f)).length} desplegados.`);
  return errors;
}

async function liveCheck(base) {
  const errors = [];
  const probe = async (path) => {
    const res = await fetch(new URL(path, base), { redirect: 'manual' });
    const body = res.status === 200 ? await res.text() : '';
    return { status: res.status, body };
  };
  const internal = ['/api/_lib/providers.js', '/lib/providers.js', '/docs/estrategia-monetizacion-dcode-partners.md', '/scripts/qa-preview-check.js', '/scripts/check-deploy-surface.mjs', '/.github/workflows/qa-preview.yml', '/automation/n8n/lead-ia-360/lead-ia-360.workflow.json', '/automation/n8n/linkedin-auto-post/README.md', '/lib/providers.js', '/README.md', '/.vercelignore', '/package.json'];
  for (const p of internal) {
    const { status, body } = await probe(p);
    // Una SPA/404 personalizada puede devolver 200 con HTML de la 404: solo es fuga si el cuerpo no es HTML.
    const leaks = status === 200 && !/^\s*<!doctype html/i.test(body);
    console.log(`  ${leaks ? '✗' : '✓'} ${status} ${p}`);
    if (leaks) errors.push(`EXPUESTO en ${base}: ${p} (HTTP ${status})`);
  }
  for (const p of ['/', '/en', '/contacto', '/assets/css/styles.css']) {
    const { status } = await probe(p);
    console.log(`  ${status === 200 ? '✓' : '✗'} ${status} ${p}`);
    if (status !== 200) errors.push(`Ruta pública rota en ${base}: ${p} (HTTP ${status})`);
  }
  return errors;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const errors = staticCheck();
  if (urlArg) errors.push(...(await liveCheck(urlArg)));
  if (errors.length) { console.error(errors.map((e) => `✗ ${e}`).join('\n')); console.error(`\n${errors.length} problema(s).`); process.exit(1); }
  console.log('✓ Ningún contenido interno llega al despliegue.');
}
