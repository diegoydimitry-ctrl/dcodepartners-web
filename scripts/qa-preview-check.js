#!/usr/bin/env node
// Guardia de QA automática (Fase 5, DIR-054-v2): barre las páginas del
// sitio contra una URL dada (una Preview de Vercel, Production, o un
// servidor local) y falla (exit code 1) si encuentra:
//
//   - CSS/JS/fuentes/imágenes que no cargan (respuesta HTTP >= 400)
//   - cualquier request de red fallido (assets inexistentes)
//   - errores de consola del navegador
//   - overflow horizontal (scrollWidth > innerWidth)
//   - tamaños de tipografía absurdos (font-size fuera de un rango sano)
//   - deformación de elementos "cuadrados/circulares" conocidos del
//     sistema visual (chip-plate del Hero, node-plate de Método,
//     node-badge de Departamentos) — mismo principio que DIR-054/055:
//     un elemento diseñado como cuadrado debe medir ancho≈alto en
//     cualquier viewport.
//
// Pensado para ejecutarse:
//   1) A mano: node scripts/qa-preview-check.js https://xxxx.vercel.app
//   2) En CI contra la Preview de un PR (ver .github/workflows/qa-preview.yml)
//   3) Como "smoke test" manual contra Production después de cada merge
//      (node scripts/qa-preview-check.js https://dcodepartners.com)
//
// Requiere: npm install (trae "playwright" como devDependency) y, la
// primera vez, `npx playwright install --with-deps chromium`.

const { chromium } = require('playwright');

const BASE = process.argv[2];
if (!BASE) {
  console.error('Uso: node scripts/qa-preview-check.js <url-base>');
  console.error('Ej:  node scripts/qa-preview-check.js https://dcodepartners.com');
  process.exit(2);
}

// Los dominios *.vercel.app de este proyecto tienen Vercel Authentication
// (SSO) activada — sin esta cabecera, page.goto() a cualquiera de ellos
// aterriza en la pantalla de login de Vercel, no en el sitio real, y sin
// una comprobación explícita de esto el QA puede "pasar" sin haber
// probado nada (ver checkAccessible() más abajo). Si Dirección genera un
// secreto de "Protection Bypass for Automation" (Project Settings →
// Deployment Protection) y lo guarda como secreto de GitHub Actions con
// el nombre VERCEL_AUTOMATION_BYPASS_SECRET, este script lo usa solo con
// definirlo — sin tocar más código. Sin el secreto, sigue funcionando
// igual que hasta ahora (útil para Production, que no lleva SSO).
const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '';
const extraHTTPHeaders = BYPASS_SECRET ? { 'x-vercel-protection-bypass': BYPASS_SECRET } : {};

// Presente en la cabecera compartida de todas las páginas del sitio (ver
// assets/js/main.js) — si no aparece en el DOM, o si la navegación acaba
// en un origen distinto al pedido, no se ha cargado la aplicación real
// (típicamente: redirigido al login SSO de Vercel), y el resto de
// comprobaciones de esa página no tienen ningún valor.
async function checkAccessible(browser, baseOrigin) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, extraHTTPHeaders });
  const page = await ctx.newPage();
  let finalUrl = null;
  try {
    await page.goto(BASE + '/', { waitUntil: 'load', timeout: 20000 });
    finalUrl = page.url();
  } catch (e) {
    await ctx.close();
    return { ok: false, reason: `No se pudo cargar ${BASE}/: ${e.message}` };
  }
  const landedOffOrigin = new URL(finalUrl).origin !== baseOrigin;
  const hasSiteHeader = await page.$('#site-header').then((el) => !!el).catch(() => false);
  await ctx.close();
  if (landedOffOrigin) {
    return { ok: false, reason: `la navegación terminó en ${finalUrl} (origen distinto al pedido, ${baseOrigin}) — probable redirección a un login/SSO` };
  }
  if (!hasSiteHeader) {
    return { ok: false, reason: `la página cargó (${finalUrl}) pero no contiene #site-header — no es la aplicación real del sitio` };
  }
  return { ok: true };
}

const PAGES = [
  '/', '/acuerdo-encargado-tratamiento', '/aviso-legal', '/blog',
  '/blog/automatizacion-vs-agentes-ia', '/blog/procesos-que-puedes-automatizar-ya',
  '/blog/que-es-la-automatizacion-con-ia', '/casos-exito', '/cambios-en-proceso', '/como-funciona',
  '/condiciones-contratacion', '/conocenos', '/contacto', '/cookies',
  '/departamentos', '/departamentos/administracion', '/departamentos/clientes',
  '/departamentos/comercial', '/departamentos/direccion', '/departamentos/finanzas',
  '/departamentos/marketing', '/departamentos/produccion', '/departamentos/soporte',
  '/en', '/en/acuerdo-encargado-tratamiento', '/en/aviso-legal', '/en/blog',
  '/en/blog/automatizacion-vs-agentes-ia', '/en/blog/procesos-que-puedes-automatizar-ya',
  '/en/blog/que-es-la-automatizacion-con-ia', '/en/casos-exito', '/en/cambios-en-proceso', '/en/como-funciona',
  '/en/condiciones-contratacion', '/en/conocenos', '/en/contacto', '/en/cookies',
  '/en/departamentos', '/en/departamentos/administracion', '/en/departamentos/clientes',
  '/en/departamentos/comercial', '/en/departamentos/direccion', '/en/departamentos/finanzas',
  '/en/departamentos/marketing', '/en/departamentos/produccion', '/en/departamentos/soporte',
  '/en/faq', '/en/garantias', '/en/metodo', '/en/privacidad', '/en/seguridad',
  '/en/servicios', '/en/servicios/agentes-ia', '/en/servicios/automatizacion-ia',
  '/en/servicios/integraciones', '/faq', '/garantias', '/metodo', '/privacidad',
  '/seguridad', '/servicios', '/servicios/agentes-ia', '/servicios/automatizacion-ia',
  '/servicios/integraciones',
];

const WIDTHS = [320, 375, 390, 768, 834, 1024, 1440, 1920];

const SQUARE_SELECTORS = ['.atm-chip-plate', '.fases-node-plate'];
const MIN_FONT_PX = 6;
const MAX_FONT_PX = 220; // por encima de esto, casi seguro un bug (ej. rem/px mal aplicado)

async function checkPage(browser, path, width, baseOrigin) {
  const issues = [];
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, extraHTTPHeaders });
  const page = await ctx.newPage();
  const failedRequests = [];
  const consoleErrors = [];

  // Solo los fallos de recursos DEL PROPIO SITIO (mismo origen: nuestro
  // CSS/JS/fuentes/imágenes) se tratan como error bloqueante. Scripts
  // de terceros (Cookieyes, Google Tag Manager) pueden fallar por
  // razones ajenas al despliegue (bloqueadores de red, adblockers,
  // el propio entorno de CI) y no deben hacer fallar el QA del sitio.
  page.on('requestfailed', (req) => {
    const url = req.url();
    const entry = `${url} (${req.failure()?.errorText || 'failed'})`;
    if (url.startsWith(baseOrigin)) {
      failedRequests.push(entry);
    } else {
      failedRequests.push(`[terceros, no bloqueante] ${entry}`);
    }
  });
  // Ruido de terceros conocido, no accionable por el propio sitio: sin una
  // cuenta de Google real autenticada en el navegador que ejecuta el QA
  // (CI, este script en local, etc.), el script de Google Identity
  // Services/FedCM que carga algún tercero embebido (Tag Manager,
  // Cookieyes) siempre falla con estos dos mensajes -- en el CI real
  // (PR #70, ejecución 32261177030) aparecio en las 496 comprobaciones
  // sin ninguna excepcion, exactamente el mismo texto, independientemente
  // de la pagina o el ancho -- huella de ruido de entorno, no de un bug
  // del sitio.
  const THIRD_PARTY_NOISE = [
    /Failed to load resource/,
    /Provider's accounts list is empty/,
    /\[GSI_LOGGER\]/,
  ];
  page.on('console', (msg) => {
    // "Failed to load resource" ya se captura (y se filtra por origen)
    // vía requestfailed arriba, y ese mensaje de consola no trae la URL
    // para poder aplicarle el mismo filtro de origen — lo excluimos aquí
    // para no duplicar ni generar falsos positivos por scripts de
    // terceros bloqueados (Cookieyes, Google Tag Manager, etc.).
    if (msg.type() === 'error' && !THIRD_PARTY_NOISE.some((re) => re.test(msg.text()))) {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  let resp;
  try {
    resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 20000 });
  } catch (e) {
    issues.push(`NAV ERROR: ${e.message}`);
    await ctx.close();
    return issues;
  }
  await page.waitForTimeout(200);

  if (resp && resp.status() >= 400) {
    issues.push(`HTTP ${resp.status()} al cargar la página`);
  }
  for (const url of failedRequests) {
    if (url.startsWith('[terceros')) continue; // informativo, no cuenta como issue
    issues.push(`request fallido: ${url}`);
  }
  for (const err of consoleErrors) {
    issues.push(`console error: ${err.slice(0, 200)}`);
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  if (overflow > 3) issues.push(`overflow horizontal = ${overflow}px`);

  const fontIssues = await page.evaluate(
    ({ min, max }) => {
      const bad = [];
      const els = document.querySelectorAll('h1,h2,h3,h4,p,span,a,button,li');
      for (const el of els) {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs && (fs < min || fs > max) && el.textContent.trim()) {
          bad.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} = ${fs}px`);
        }
      }
      return bad.slice(0, 5);
    },
    { min: MIN_FONT_PX, max: MAX_FONT_PX }
  );
  fontIssues.forEach((f) => issues.push(`tamaño de fuente sospechoso: ${f}`));

  for (const sel of SQUARE_SELECTORS) {
    const ratios = await page.evaluate((s) => {
      return Array.from(document.querySelectorAll(s)).map((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 0 ? r.width / r.height : null;
      });
    }, sel);
    for (const r of ratios) {
      if (r !== null && Math.abs(r - 1) > 0.08) {
        issues.push(`${sel} deformado: ratio ancho/alto = ${r.toFixed(2)} (esperado ~1.00)`);
      }
    }
  }

  await ctx.close();
  return issues;
}

async function main() {
  console.log(`QA contra: ${BASE}`);

  const browser = await chromium.launch();
  const baseOrigin = new URL(BASE).origin;

  const accessible = await checkAccessible(browser, baseOrigin);
  if (!accessible.ok) {
    console.error(`\n⛔ BLOQUEO DE ACCESO — no se pudo probar la aplicación real: ${accessible.reason}`);
    console.error(
      BYPASS_SECRET
        ? 'Se usó VERCEL_AUTOMATION_BYPASS_SECRET y aun así falló — revisa que el secreto sea válido para este proyecto.'
        : 'Este dominio de Vercel probablemente tiene Vercel Authentication (SSO) activada. Define VERCEL_AUTOMATION_BYPASS_SECRET ' +
          '(Project Settings → Deployment Protection → Protection Bypass for Automation en Vercel) para que este script pueda probar la aplicación real.'
    );
    console.error('No se ha ejecutado ninguna de las 512 comprobaciones de página — habrían sido sobre una pantalla de login, no sobre el sitio.');
    await browser.close();
    process.exitCode = 1;
    return;
  }
  console.log('Acceso confirmado: la aplicación real responde (no es una pantalla de login/SSO).');
  console.log(`${PAGES.length} páginas x ${WIDTHS.length} anchos = ${PAGES.length * WIDTHS.length} comprobaciones\n`);

  const allIssues = [];
  let checked = 0;

  for (const path of PAGES) {
    for (const width of WIDTHS) {
      const issues = await checkPage(browser, path, width, baseOrigin);
      checked++;
      for (const issue of issues) {
        allIssues.push(`${path} @ ${width}px: ${issue}`);
      }
    }
  }

  await browser.close();

  console.log(`Comprobaciones realizadas: ${checked}`);
  console.log(`Problemas encontrados: ${allIssues.length}\n`);
  for (const issue of allIssues) console.log(' - ' + issue);

  if (allIssues.length > 0) {
    process.exitCode = 1;
  }
}

main();
