// Pruebas de extremo a extremo de las landings (Playwright + node --test).
// Levanta el servidor local (estáticos + /api con almacén en memoria).
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { crearServidor } from './servidor-local.mjs';

const require = createRequire(import.meta.url);
const { F } = require('../../api/_lib/ads/schema.js');
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const CAPTURAS = process.env.CAPTURAS_DIR || path.join(RAIZ, '.capturas-ads');
const LANDINGS = ['/automatizacion-procesos', '/automatizacion-seguimiento-comercial', '/automatizacion-atencion-clientes'];
const PROHIBIDAS = [/soluciones innovadoras/i, /transformaci[oó]n digital/i, /[uú]ltima generaci[oó]n/i, /garantizad/i, /\d+\s?%/, /ahorra(r|s)? (un|el)/i, /l[ií]der/i, /revolucion/i];

let srv, browser, base;
before(async () => {
  await mkdir(CAPTURAS, { recursive: true });
  srv = crearServidor();
  await new Promise((r) => srv.server.listen(0, r));
  base = `http://localhost:${srv.server.address().port}`;
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
});
after(async () => { await browser.close(); srv.server.close(); });

async function pagina(opts = {}) {
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 390, height: 844 }, isMobile: !!opts.movil });
  const page = await ctx.newPage();
  const errores = [];
  const externas = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('request', (r) => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname)) externas.push(r.url()); });
  return { ctx, page, errores, externas };
}

async function rellenar(page, extra = {}) {
  const d = { nombre: 'Laura Prueba', empresa: 'Reformas Ejemplo', email: 'laura@ejemplo.es', web: 'ejemplo.es', sector: 'Construcción / reformas', tamano: '2-9', necesidad: 'Enviamos presupuestos y nadie hace seguimiento', ...extra };
  await page.fill('#f-nombre', d.nombre);
  await page.fill('#f-empresa', d.empresa);
  await page.fill('#f-email', d.email);
  await page.fill('#f-web', d.web);
  await page.selectOption('#f-sector', d.sector);
  await page.selectOption('#f-tamano', d.tamano);
  await page.fill('#f-necesidad', d.necesidad);
  await page.check('input[name=privacidad]');
  // El envío en menos de 2,5 s se trata como bot: se espera como una persona.
  await page.waitForTimeout(2600);
}

for (const ruta of LANDINGS) {
  for (const [nombre, vp, movil] of [['movil', { width: 360, height: 740 }, true], ['desktop', { width: 1366, height: 820 }, false]]) {
    test(`landing ${ruta} · ${nombre}: carga, estructura, demo visible y sin desbordes`, async () => {
      const { ctx, page, errores, externas } = await pagina({ viewport: vp, movil });
      const t0 = Date.now();
      const res = await page.goto(base + ruta, { waitUntil: 'load' });
      const carga = Date.now() - t0;
      assert.equal(res.status(), 200);
      assert.ok(carga < 3000, `carga local en ${carga} ms`);
      const titulo = await page.title();
      assert.match(titulo, /D-Code Partners/);
      assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex, follow');
      assert.equal(await page.locator('h1').count(), 1);
      // La demo está en la primera pantalla (desktop) o justo debajo del titular (móvil).
      const demo = await page.locator('[data-demo]').boundingBox();
      assert.ok(demo && demo.y < vp.height * (movil ? 0.75 : 0.5), `demo a ${demo && demo.y}px`);
      assert.equal(await page.locator('.demo-badge').textContent(), 'DATOS DE DEMOSTRACIÓN');
      for (const id of ['t-problema', 't-sistema', 't-como', 't-que', 't-proceso', 'formulario', 't-faq']) {
        assert.equal(await page.locator(`#${id}`).count(), 1, `falta sección ${id}`);
      }
      assert.ok(await page.locator('[data-cta=diagnostico]').count() >= 2);
      assert.ok(await page.locator('[data-cta=caso]').count() >= 1);
      const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(ancho <= vp.width, `desborde horizontal: ${ancho}px`);
      const texto = await page.evaluate(() => document.body.innerText);
      for (const re of PROHIBIDAS) assert.ok(!re.test(texto), `lenguaje prohibido: ${re}`);
      assert.deepEqual(errores, []);
      assert.deepEqual(externas, [], 'fuera del dominio real no se pide nada a terceros');
      await page.screenshot({ path: path.join(CAPTURAS, `${ruta.slice(1)}-${nombre}.png`) });
      await ctx.close();
    });
  }
}

test('demo: eventos demo_start, 25, 50 y 90 una sola vez, por tiempo realmente visto', async () => {
  const { ctx, page } = await pagina({ viewport: { width: 1366, height: 820 } });
  await page.goto(base + '/automatizacion-seguimiento-comercial');
  await page.evaluate(() => { window.__dcodeDemo[0].velocidad = 40; });
  await page.click('[data-demo-play]');
  await page.waitForFunction(() => window.__dcodeAds.eventos.some((e) => e.evento === 'demo_90'), null, { timeout: 10000 });
  await page.waitForTimeout(800);
  const ev = await page.evaluate(() => window.__dcodeAds.eventos.map((e) => e.evento));
  for (const n of ['demo_start', 'demo_25', 'demo_50', 'demo_90']) assert.equal(ev.filter((x) => x === n).length, 1, n);
  assert.match(await page.locator('.demo-sub').textContent(), /diagnóstico/);
  await ctx.close();
});

test('CTA: principal y secundario registran su evento y cambian el modo del formulario', async () => {
  const { ctx, page } = await pagina();
  await page.goto(base + '/automatizacion-procesos');
  await page.click('.barra-cta [data-cta=caso]');
  assert.equal(await page.getAttribute('#ads-form', 'data-modo'), 'caso');
  assert.equal(await page.textContent('#form-enviar'), 'Enviar mi caso');
  await page.click('.barra-cta [data-cta=diagnostico]');
  assert.equal(await page.getAttribute('#ads-form', 'data-modo'), 'diagnostico');
  const ev = await page.evaluate(() => window.__dcodeAds.eventos.map((e) => e.evento));
  assert.ok(ev.includes('cta_caso') && ev.includes('cta_diagnostico'));
  await ctx.close();
});

test('formulario: errores del servidor se muestran junto a cada campo', async () => {
  const { ctx, page } = await pagina();
  await page.goto(base + '/automatizacion-procesos');
  await page.check('input[name=privacidad]');
  await page.click('#form-enviar');
  await page.waitForSelector('[data-error-for=email]:not(:empty)');
  assert.match(await page.textContent('[data-error-for=nombre]'), /nombre/);
  assert.equal(await page.getAttribute('#f-email', 'aria-invalid'), 'true');
  await ctx.close();
});

test('E2E Google Ads: clic con gclid+UTM → formulario → Airtable (memoria) → gracias → reserva', async () => {
  srv.store.registros.length = 0; srv.reiniciarLimite();
  const { ctx, page, externas } = await pagina();
  const q = '?gclid=Cj0KCQjw_E2E-gclid-0001&utm_source=google&utm_medium=cpc&utm_campaign=2026ga2&utm_content=ga2&utm_term=automatizar%20seguimiento%20clientes&mt=p&dev=m';
  await page.goto(base + '/automatizacion-seguimiento-comercial' + q);
  await rellenar(page);
  await page.click('#form-enviar');
  await page.waitForURL(/\/gracias-diagnostico/);
  // La referencia se retira de la URL antes de cargar nada más.
  assert.equal(new URL(page.url()).search, '');
  const ref = await page.evaluate(() => window.__dcodeRef);
  assert.match(ref, /^L-/);
  assert.equal(srv.store.registros.length, 1);
  const f = srv.store.registros[0].fields;
  assert.equal(f[F.fuente], 'google_ads');
  assert.equal(f[F.gclid], 'Cj0KCQjw_E2E-gclid-0001');
  assert.equal(f[F.utmCampaign], '2026ga2');
  assert.equal(f[F.keyword], 'automatizar seguimiento clientes');
  assert.equal(f[F.matchtype], 'frase');
  assert.equal(f[F.dispositivo], 'móvil');
  assert.equal(f[F.landing], '/automatizacion-seguimiento-comercial');
  assert.equal(f[F.ref], ref);
  assert.equal(f[F.consentAnuncios], 'sin_banner');
  // Reserva confirmada (simulamos el callback de Cal.com: no se carga Cal en pruebas).
  await page.evaluate(() => window.__dcodeAlReservar({ detail: { data: { startTime: '2026-09-25T09:30:00Z' } } }));
  await page.waitForFunction(() => window.__dcodeAds.eventos.some((e) => e.evento === 'reserva'));
  await page.waitForTimeout(300);
  assert.equal(f[F.reunionProgramada], '2026-09-25T09:30:00.000Z');
  assert.deepEqual(externas, []);
  await ctx.close();
});

test('duplicados desde la web: el mismo email dos veces deja un solo lead', async () => {
  srv.store.registros.length = 0; srv.reiniciarLimite();
  for (let i = 0; i < 2; i++) {
    const { ctx, page } = await pagina();
    await page.goto(base + '/automatizacion-procesos');
    await rellenar(page, { email: 'repetido@ejemplo.es' });
    await page.click('#form-enviar');
    await page.waitForURL(/gracias/);
    await ctx.close();
  }
  assert.equal(srv.store.registros.length, 1);
  assert.equal(srv.store.registros[0].fields[F.numEnvios], 2);
});

test('consentimiento: sin aceptar no se guarda nada; al aceptar se guarda; al rechazar se borra', async () => {
  const { ctx, page } = await pagina();
  await page.goto(base + '/automatizacion-procesos?gclid=Cj0KCQjw_CONSENT-0001&utm_source=google&utm_medium=cpc');
  assert.equal(await page.evaluate(() => localStorage.getItem('dcode_ads_attr')), null, 'sin consentimiento, nada en el navegador');
  await page.click('.ads-testbar [data-c=granted]');
  const guardado = JSON.parse(await page.evaluate(() => localStorage.getItem('dcode_ads_attr')));
  assert.equal(guardado.valores.gclid, 'Cj0KCQjw_CONSENT-0001');
  // Vuelve otro día sin parámetros: el origen se recupera del almacenamiento.
  await page.goto(base + '/automatizacion-atencion-clientes');
  assert.equal(await page.evaluate(() => window.__dcodeAds.atribucion.gclid), 'Cj0KCQjw_CONSENT-0001');
  await page.click('.ads-testbar [data-c=denied]');
  assert.equal(await page.evaluate(() => localStorage.getItem('dcode_ads_attr')), null, 'al retirar el consentimiento se borra');
  await ctx.close();
});

test('producción simulada: Consent Mode denegado por defecto, CookieYes antes que Google y conversión solo del formulario', async () => {
  srv.store.registros.length = 0; srv.reiniciarLimite();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const orden = [];
  await ctx.route('**/*', async (route) => {
    const u = new URL(route.request().url());
    if (u.hostname === 'cdn-cookieyes.com') {
      orden.push('cookieyes');
      return route.fulfill({ contentType: 'text/javascript', body: 'window.getCkyConsent=function(){return {categories:{advertisement:false,analytics:false}}};' });
    }
    if (u.hostname === 'www.googletagmanager.com') { orden.push('gtag'); return route.fulfill({ contentType: 'text/javascript', body: '/* gtag stub */' }); }
    if (u.hostname === 'challenges.cloudflare.com') { orden.push('turnstile'); return route.fulfill({ contentType: 'text/javascript', body: '' }); }
    if (u.hostname === 'dcodepartners.com') {
      if (u.pathname.startsWith('/api/')) {
        // Mismo origen en producción: aquí se reenvía al servidor local como lo haría Vercel.
        const r = await fetch(base + u.pathname, { method: 'POST', headers: { 'content-type': 'application/json', origin: base }, body: route.request().postData() });
        return route.fulfill({ status: r.status, contentType: 'application/json', body: await r.text() });
      }
      let p = u.pathname; const f = path.join(RAIZ, p.endsWith('.js') || p.endsWith('.css') || p.includes('.') ? p : `${p}.html`);
      try { return route.fulfill({ body: await readFile(f), contentType: f.endsWith('.html') ? 'text/html' : f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : 'application/octet-stream' }); }
      catch { return route.fulfill({ status: 404, body: '' }); }
    }
    return route.abort();
  });
  const page = await ctx.newPage();
  await page.goto('https://dcodepartners.com/automatizacion-procesos?gclid=Cj0KCQjw_PROD-0001');
  await page.waitForTimeout(800);
  assert.deepEqual(orden.filter((o) => o !== 'turnstile').slice(0, 2), ['cookieyes', 'gtag'], 'CookieYes primero, Google después');
  const dl = await page.evaluate(() => window.dataLayer.map((a) => Array.from(a)));
  assert.equal(dl[0][0], 'consent'); assert.equal(dl[0][1], 'default');
  assert.equal(dl[0][2].ad_storage, 'denied'); assert.equal(dl[0][2].ad_user_data, 'denied'); assert.equal(dl[0][2].analytics_storage, 'denied');
  const iConfig = dl.findIndex((a) => a[0] === 'config');
  assert.ok(iConfig > 0, 'config después del consentimiento por defecto');
  assert.equal(await page.evaluate(() => document.querySelector('.ads-testbar')), null, 'sin barra de pruebas en producción');
  assert.equal(await page.evaluate(() => localStorage.getItem('dcode_ads_attr')), null, 'CookieYes dice no: nada guardado');
  // El usuario acepta publicidad en CookieYes.
  await page.evaluate(() => document.dispatchEvent(new CustomEvent('cookieyes_consent_update', { detail: { accepted: ['necessary', 'advertisement', 'analytics'], rejected: [] } })));
  const upd = await page.evaluate(() => window.dataLayer.map((a) => Array.from(a)).filter((a) => a[0] === 'consent' && a[1] === 'update').pop());
  assert.equal(upd[2].ad_storage, 'granted');
  assert.ok(await page.evaluate(() => localStorage.getItem('dcode_ads_attr')));
  // Microconversiones: nunca «conversion». Solo eventos.
  await page.evaluate(() => { window.DCODE_ADS_CONFIG.googleAdsId = 'AW-000000000'; window.DCODE_ADS_CONFIG.conversionFormulario = 'AW-000000000/prueba'; });
  await page.evaluate(() => { window.__dcodeDemo[0].velocidad = 40; });
  await page.click('[data-demo-play]');
  await page.waitForFunction(() => window.__dcodeAds.eventos.some((e) => e.evento === 'demo_90'), null, { timeout: 10000 });
  await page.click('[data-cta=caso][data-pos=proceso]');
  let conv = await page.evaluate(() => window.dataLayer.map((a) => Array.from(a)).filter((a) => a[0] === 'event' && a[1] === 'conversion'));
  assert.equal(conv.length, 0, 'demo y CTA no son conversión');
  const llamadas = [];
  await page.exposeFunction('registrarGtag', (x) => llamadas.push(JSON.parse(x)));
  await page.evaluate(() => {
    const g = window.gtag;
    window.gtag = function () { const a = Array.from(arguments); window.registrarGtag(JSON.stringify([a[0], a[1], a[2] && a[2].send_to || null])); return g.apply(this, arguments); };
  });
  await rellenar(page, { email: 'prod@ejemplo.es' });
  await page.click('#form-enviar');
  await page.waitForURL(/gracias/);
  const convs = llamadas.filter((a) => a[0] === 'event' && a[1] === 'conversion');
  assert.equal(convs.length, 1, 'exactamente una conversión: el formulario');
  assert.equal(convs[0][2], 'AW-000000000/prueba');
  assert.ok(llamadas.some((a) => a[0] === 'set' && a[1] === 'user_data'), 'conversiones mejoradas con consentimiento');
  assert.equal(srv.store.registros.length, 1);
  assert.equal(srv.store.registros[0].fields[F.consentAnuncios], 'granted');
  await ctx.close();
});
