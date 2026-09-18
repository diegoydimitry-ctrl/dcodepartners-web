#!/usr/bin/env node
/**
 * FASE_0_GOOGLE_ADS_READY — comprobación final de la Fase 0.
 *   npm run fase0:ads              (incluye pruebas e2e si hay Chromium)
 *   npm run fase0:ads -- --sin-e2e
 * No toca nada: solo lee el repositorio y ejecuta las pruebas.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const require = createRequire(import.meta.url);
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = (p) => path.join(RAIZ, p);
const leer = (p) => readFileSync(r(p), 'utf8');
const SIN_E2E = process.argv.includes('--sin-e2e');
const resultados = [];
function comprobar(nombre, fn) {
  let detalle = [];
  try { detalle = fn() || []; } catch (e) { detalle = [`excepción: ${e.message}`]; }
  resultados.push({ nombre, ok: detalle.length === 0, detalle });
}
const npm = (script) => spawnSync('npm', ['run', '-s', script], { cwd: RAIZ, encoding: 'utf8' });

const LANDINGS = ['automatizacion-procesos', 'automatizacion-seguimiento-comercial', 'automatizacion-atencion-clientes'];
const DEMO = { 'automatizacion-procesos': 'procesos', 'automatizacion-seguimiento-comercial': 'comercial', 'automatizacion-atencion-clientes': 'atencion' };
const CAMPOS = ['nombre', 'empresa', 'web', 'email', 'telefono', 'sector', 'tamano', 'necesidad', 'privacidad'];
const OCULTOS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'matchtype', 'device', 'landing'];

LANDINGS.forEach((l, i) => comprobar(`landing ${i + 1} · /${l}`, () => {
  const f = [];
  if (!existsSync(r(`${l}.html`))) return ['no existe'];
  const html = leer(`${l}.html`);
  const d = parse(html);
  if (d.querySelectorAll('h1').length !== 1) f.push('h1');
  if (!d.querySelector(`[data-demo="${DEMO[l]}"]`)) f.push('demo');
  if (!/noindex/.test(d.querySelector('meta[name=robots]')?.getAttribute('content') || '')) f.push('noindex');
  if (!d.querySelector('[data-cta=diagnostico]') || !d.querySelector('[data-cta=caso]')) f.push('CTAs');
  if (!/Reservar diagnóstico de 30 min/.test(html) || !/Dejar mi caso/.test(html)) f.push('textos de CTA');
  const hero = html.indexOf('data-demo='), form = html.indexOf('id="ads-form"');
  if (!(hero > 0 && hero < form)) f.push('la demo no está antes del formulario');
  for (const re of [/soluciones innovadoras/i, /transformaci[oó]n digital/i, /[uú]ltima generaci[oó]n/i]) if (re.test(html)) f.push(`lenguaje prohibido ${re}`);
  return f;
}));

comprobar('demo (datos DEMO, sin datos reales)', () => {
  const f = [];
  const D = require(r('assets/ads/demos.js'));
  for (const k of ['procesos', 'comercial', 'atencion']) {
    if (!D[k] || D[k].pasos.length < 6) f.push(`demo ${k}`);
    if (D[k] && (D[k].duracion < 60 || D[k].duracion > 120)) f.push(`duración ${k}: ${D[k].duracion}s fuera de 60–120`);
  }
  const txt = leer('assets/ads/demos.js');
  for (const real of ['Sánchez Rubio', 'Esther', 'Artauto', 'R.S. Entrenamientos', 'Canto del Pico', '@gmail.com']) if (txt.includes(real)) f.push(`dato real en la demo: ${real}`);
  if (!leer('assets/ads/demo-player.js').includes('DATOS DE DEMOSTRACIÓN')) f.push('falta la marca DATOS DE DEMOSTRACIÓN');
  return f;
});

comprobar('vídeo (MP4 + subtítulos + póster)', () => {
  const f = [];
  for (const k of ['procesos', 'comercial', 'atencion']) {
    const base = `assets/ads/video/demo-${k}`;
    if (!existsSync(r(`${base}.mp4`)) || statSync(r(`${base}.mp4`)).size < 100_000) f.push(`${k}.mp4`);
    if (!existsSync(r(`${base}.vtt`)) || !leer(`${base}.vtt`).startsWith('WEBVTT')) f.push(`${k}.vtt`);
    if (!existsSync(r(`${base}.jpg`))) f.push(`${k}.jpg`);
  }
  for (const l of LANDINGS) if (!/<track kind="captions"/.test(leer(`${l}.html`))) f.push(`subtítulos en ${l}`);
  return f;
});

comprobar('formulario (campos, privacidad, ocultos)', () => {
  const f = [];
  for (const l of LANDINGS) {
    const d = parse(leer(`${l}.html`));
    for (const c of CAMPOS) if (!d.querySelector(`#ads-form [name="${c}"]`)) f.push(`${l}: ${c}`);
    for (const c of OCULTOS) if (!d.querySelector(`#ads-form input[type=hidden][name="${c}"]`)) f.push(`${l}: oculto ${c}`);
    if (!d.querySelector('#ads-form a[href="/privacidad"]')) f.push(`${l}: enlace a privacidad`);
  }
  return f;
});

comprobar('tracking (eventos; solo «formulario» es conversión)', () => {
  const f = [];
  const js = leer('assets/ads/ads.js') + leer('assets/ads/demo-player.js') + leer('assets/ads/gracias.js');
  for (const e of ['demo_25', 'demo_50', 'demo_90', 'cta_diagnostico', 'formulario', 'reserva', 'whatsapp']) if (!js.includes(`'${e}'`) && !js.includes(`'demo_' + h`)) f.push(`evento ${e}`);
  const cfg = leer('assets/ads/config.js');
  if (/eventosSecundarios:[^\]]*'formulario'/.test(cfg)) f.push('formulario marcado como secundario');
  if ((js.match(/'event', 'conversion'/g) || []).length !== 1) f.push('debe existir exactamente una llamada de conversión');
  return f;
});

comprobar('consentimiento (Consent Mode v2 + CookieYes primero)', () => {
  const f = [];
  const c = npm('check:consentimiento');
  if (c.status !== 0) f.push(c.stderr.trim().split('\n').slice(0, 3).join(' | '));
  for (const l of [...LANDINGS, 'gracias-diagnostico']) {
    const h = leer(`${l}.html`);
    if (!/gtag\('consent', 'default', \{ ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied'/.test(h)) f.push(`${l}: Consent Mode por defecto`);
    if (h.indexOf("gtag('consent', 'default'") > h.indexOf("gtag('config'")) f.push(`${l}: consentimiento después de config`);
  }
  return f;
});

comprobar('GCLID / UTM (captura y fuente google_ads)', () => {
  const { parseAttribution } = require(r('api/_lib/ads/attribution.js'));
  const a = parseAttribution({ gclid: 'Cj0KCQjw_CHECK-0000001', utm_source: 'google', utm_medium: 'cpc', utm_term: 'x', matchtype: 'e', landing: '/automatizacion-procesos' });
  const f = [];
  if (a.fuente !== 'google_ads' || !a.gclid || a.matchtype !== 'exacta' || a.keyword !== 'x') f.push('atribución');
  if (parseAttribution({ gclid: '"><script>' }).gclid) f.push('acepta gclid manipulado');
  return f;
});

comprobar('Airtable (contrato de columnas + barrera de producción)', () => {
  const f = [];
  const { F, PRODUCTION_BASE_ID } = require(r('api/_lib/ads/schema.js'));
  const { EXISTENTES, NUEVAS } = require(r('marketing/google-ads/airtable/esquema-campos.cjs'));
  const n = new Set([...EXISTENTES, ...NUEVAS].map((x) => x.name));
  for (const v of Object.values(F)) if (!n.has(v)) f.push(`columna sin esquema: ${v}`);
  const { leerConfig } = require(r('api/_lib/ads/config.js'));
  if (!leerConfig({ VERCEL_ENV: 'preview', ADS_LEAD_MODE: 'airtable', AIRTABLE_ADS_TOKEN: 'x', AIRTABLE_ADS_BASE_ID: PRODUCTION_BASE_ID }).problemas.length) f.push('Preview podría escribir en la base real');
  if (!existsSync(r('marketing/google-ads/airtable/MIGRACION-LEADS.md'))) f.push('falta la migración documentada');
  return f;
});

comprobar('CRM (etapas; google_ads ⇒ borrador interno)', () => {
  const { ETAPAS } = require(r('api/_lib/ads/schema.js'));
  const { politicaPropuesta } = require(r('api/_lib/ads/crm-rules.js'));
  const f = [];
  for (const e of ['Nuevo', 'Cualificado', 'Reunión programada', 'Reunión celebrada', 'Propuesta', 'Prueba', 'Cliente', 'Descartado']) if (!ETAPAS.includes(e)) f.push(e);
  const p = politicaPropuesta({ fuente: 'google_ads', etapa: 'Nuevo' });
  if (p.envioAutomatico || p.generarAutomatica || !/Borrador interno/.test(p.estadoPropuesta)) f.push('política de propuesta');
  if (!existsSync(r('marketing/google-ads/n8n/validar-lead-propuesta.v2.js'))) f.push('guarda n8n');
  return f;
});

comprobar('cualificación (ficha HECHO ≠ INFERENCIA)', () => {
  const { construirFicha } = require(r('api/_lib/ads/ficha.js'));
  const x = construirFicha({ empresa: 'X', sectorForm: 'Otro', tamano: '2-9', necesidad: 'consultas de clientes por email sin responder', web: '' }, { landing: '/automatizacion-atencion-clientes' }, null);
  const f = [];
  for (const s of ['— HECHOS —', '— EVIDENCIA ENCONTRADA —', '— SISTEMA CANDIDATO —', '— HIPÓTESIS A COMPROBAR —', '— PRÓXIMO PASO —']) if (!x.texto.includes(s)) f.push(s);
  if (x.inferencias.some((i) => i.startsWith('HECHO'))) f.push('inferencia como hecho');
  return f;
});

comprobar('reserva (gracias → Cal.com → reunión programada)', () => {
  const f = [];
  const g = leer('gracias-diagnostico.html') + leer('assets/ads/gracias.js');
  if (!/bookingSuccessful/.test(g) || !/\/api\/ads-lead-event/.test(g)) f.push('flujo de reserva');
  if (!/history\.replaceState/.test(leer('gracias-diagnostico.html'))) f.push('la referencia no se retira de la URL');
  if (!existsSync(r('api/ads-lead-event.js'))) f.push('api/ads-lead-event.js');
  return f;
});

comprobar('conversiones offline (modelo, mapeo, CSV)', () => {
  const f = [];
  for (const p of ['conversiones.cjs', 'exportar.mjs', 'PROCESO.md']) if (!existsSync(r(`marketing/google-ads/offline-conversions/${p}`))) f.push(p);
  const { generarConversiones, aCsv } = require(r('marketing/google-ads/offline-conversions/conversiones.cjs'));
  const out = aCsv(generarConversiones([{ id: 'a', fields: { Entorno: 'production', Empresa: 'A', GCLID: 'Cj0KCQjw_CHECK-000001', 'Primer envío': '2026-09-01T10:00:00Z', 'Fecha cliente': '2026-09-20T10:00:00Z', 'Valor cliente': 800 } }]).filas);
  if (!/^Parameters:TimeZone=Europe\/Madrid\nGoogle Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency\nCj0KCQjw_CHECK-000001,DCODE - Cliente,2026-09-20 12:00:00,800.00,EUR\n$/.test(out)) f.push('formato CSV');
  return f;
});

comprobar('keywords (estudio sin alterar; exacta/frase)', () => {
  const f = [];
  const h = (p) => createHash('sha1').update(readFileSync(r(p))).digest('hex');
  if (h('marketing/google-ads/03_keywords_candidatas.csv') !== '908304ec258a6bcfb1876b6c2426820872cd3c1f') f.push('03 modificado respecto al estudio');
  const k = leer('marketing/google-ads/campana/editor/keywords.csv');
  if (/,Broad,/i.test(k)) f.push('hay concordancia amplia');
  for (const g of ['GA1', 'GA2', 'GA3']) if (!k.includes(g)) f.push(`sin keywords en ${g}`);
  return f;
});

comprobar('negativas (DCODE-BASE)', () => {
  const f = [];
  const h = createHash('sha1').update(readFileSync(r('marketing/google-ads/04_keywords_negativas.csv'))).digest('hex');
  if (h !== 'ed6e740d575b3ebbbf37e0c36351d1960272dda4') f.push('04 modificado respecto al estudio');
  const n = leer('marketing/google-ads/campana/editor/negativas-DCODE-BASE.csv').trim().split('\n').slice(1);
  if (n.length !== 96 || !n.every((l) => l.startsWith('DCODE-BASE,'))) f.push(`lista DCODE-BASE: ${n.length}`);
  return f;
});

comprobar('anuncios (mapa completo; nada BLOQUEADO en los ficheros de carga)', () => {
  const f = [];
  const h = createHash('sha1').update(readFileSync(r('marketing/google-ads/07_anuncios_borrador.csv'))).digest('hex');
  if (h !== '19beef8bc229a14aa76af628a7c61b45a23ae714') f.push('07 modificado respecto al estudio');
  const estado = leer('marketing/google-ads/campana/anuncios-estado.csv');
  const bloqueados = estado.split('\n').filter((l) => /;BLOQUEADO;/.test(l)).map((l) => {
    const m = l.match(/^[^;]*;[^;]*;[^;]*;("(?:[^"]|"")*"|[^;]*)/); return m ? m[1].replace(/^"|"$/g, '').replace(/""/g, '"') : '';
  }).filter(Boolean);
  const carga = leer('marketing/google-ads/campana/editor/anuncios-rsa.csv');
  for (const b of bloqueados) if (carga.includes(b)) f.push(`texto BLOQUEADO en la carga: ${b}`);
  const mapa = leer('marketing/google-ads/campana/mapa-keyword-grupo-anuncio-landing-demo.csv');
  for (const l of LANDINGS) if (!mapa.includes(`/${l};`)) f.push(`mapa sin ${l}`);
  if (/NO GENERADO/.test(mapa)) f.push('mapa con vídeo no generado');
  for (const row of carga.trim().split('\n').slice(1)) {
    const cells = row.match(/("(?:[^"]|"")*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'));
    cells.slice(3, 18).forEach((t) => { if (t.length > 30) f.push(`título > 30: ${t}`); });
    cells.slice(18, 22).forEach((t) => { if (t.length > 90) f.push(`descripción > 90: ${t}`); });
    if (!row.endsWith(',Paused')) f.push('anuncio no pausado');
  }
  return f;
});

comprobar('tests (servidor' + (SIN_E2E ? ')' : ' + e2e)'), () => {
  const f = [];
  const b = spawnSync(process.execPath, ['--test', 'tests/ads/backend.test.mjs'], { cwd: RAIZ, encoding: 'utf8' });
  const pass = (b.stdout.match(/# pass (\d+)/) || [])[1];
  if (b.status !== 0) f.push(`backend: ${(b.stdout.match(/# fail (\d+)/) || [])[1]} fallos`);
  if (!SIN_E2E) {
    const e = spawnSync(process.execPath, ['--test', '--test-concurrency=1', 'tests/ads/e2e.test.mjs'], { cwd: RAIZ, encoding: 'utf8', env: process.env, timeout: 300_000 });
    if (e.status !== 0) f.push(`e2e: ${(e.stdout.match(/# fail (\d+)/) || [])[1] || '?'} fallos`);
    else console.log(`  · e2e: ${(e.stdout.match(/# pass (\d+)/) || [])[1]} pruebas`);
  }
  console.log(`  · servidor: ${pass} pruebas`);
  return f;
});

comprobar('seguridad (sin secretos, superficie, barreras)', () => {
  const f = [];
  const s = npm('check:superficie');
  if (s.status !== 0) f.push('check:superficie falla');
  const ficheros = execFileSync('git', ['ls-files'], { cwd: RAIZ, encoding: 'utf8' }).split('\n').filter((x) => /^(api\/(ads|_lib\/ads)|assets\/ads\/|automatizacion-|gracias-|marketing\/google-ads\/|tests\/ads\/)/.test(x) && !/\.(mp4|jpg|png|pdf|xlsx)$/.test(x));
  const PATRONES = [/pat[A-Za-z0-9]{14}\.[A-Za-z0-9]{20,}/, /AIza[0-9A-Za-z_-]{35}/, /sk-[A-Za-z0-9]{20,}/, /re_[A-Za-z0-9]{20,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /Bearer [A-Za-z0-9._-]{30,}/, /hooks\.slack\.com\/services/];
  for (const x of ficheros) { const t = leer(x); for (const p of PATRONES) if (p.test(t)) f.push(`posible secreto en ${x}`); }
  const pub = leer('assets/ads/config.js') + leer('assets/ads/ads.js');
  if (/n8n\.cloud|airtable\.com\/v0|AIRTABLE/i.test(pub)) f.push('el frontend referencia servicios internos');
  const { leerConfig } = require(r('api/_lib/ads/config.js'));
  if (!leerConfig({ VERCEL_ENV: 'production' }).bloqueadoProduccion) f.push('Production aceptaría leads sin activarlo');
  if (leerConfig({}).modo !== 'dryrun') f.push('modo por defecto distinto de dryrun');
  return f;
});

comprobar('producción intacta', () => {
  const f = [];
  const rama = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim();
  if (rama === 'main') f.push('se está trabajando sobre main');
  const base = execFileSync('git', ['merge-base', 'HEAD', 'main'], { cwd: RAIZ, encoding: 'utf8' }).trim();
  const cambios = execFileSync('git', ['diff', '--name-status', base], { cwd: RAIZ, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  const PERMITIDOS = new Set(['.gitignore', 'package.json', 'scripts/build-knowledge-base.js', 'scripts/check-deploy-surface.mjs']);
  for (const c of cambios) {
    const [tipo, fich] = c.split('\t');
    if (tipo !== 'A' && !PERMITIDOS.has(fich)) f.push(`modifica un fichero existente: ${fich}`);
  }
  for (const intocable of ['vercel.json', '.vercelignore', 'contacto.html', 'assets/js/main.js', 'index.html']) if (cambios.some((c) => c.endsWith(`\t${intocable}`))) f.push(`toca ${intocable}`);
  const cfg = leer('assets/ads/config.js');
  if (!/googleAdsId: null/.test(cfg) || !/conversionFormulario: null/.test(cfg)) f.push('hay una etiqueta de Google Ads configurada');
  return f;
});

console.log('\nFASE_0_GOOGLE_ADS_READY\n');
for (const x of resultados) {
  console.log(`${x.ok ? '✓' : '✗'} ${x.nombre}`);
  x.detalle.slice(0, 6).forEach((d) => console.log(`    · ${d}`));
}
const cfg = leer('assets/ads/config.js');
console.log(`
GOOGLE ADS: NO ACTIVADO${/googleAdsId: null/.test(cfg) ? '' : ' (¡hay un ID configurado!)'}
GASTO: 0 €
CUENTA: NO CREADA
PROMOCIÓN: NO CANJEADA
`);
const fallos = resultados.filter((x) => !x.ok).length;
console.log(fallos ? `✗ ${fallos} comprobación(es) sin superar.` : `✓ ${resultados.length} comprobaciones superadas.`);
process.exit(fallos ? 1 : 0);
