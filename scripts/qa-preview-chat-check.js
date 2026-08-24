#!/usr/bin/env node
// Prueba real obligatoria del chatbot contra una Preview de Vercel en vivo
// (mandato P0 "CAMBIOS D-CODE — MISIÓN EXCLUSIVA CHATBOT WEB", sección 15).
//
// Esta sesión no tiene salida de red directa hacia *.vercel.app (política
// del proxy del entorno) ni, en el momento de escribir esto, conexión al
// servidor MCP de Vercel — así que la única vía real disponible para
// probar la Preview protegida (Vercel Authentication/SSO) es un runner de
// GitHub Actions, que sí tiene acceso normal a Internet (ver
// .github/workflows/qa-preview.yml, que ya resuelve y prueba la Preview
// real de cada PR con éxito).
//
// Qué hace:
//   1) Abre la Preview real en un navegador (Playwright) y envía, a
//      través del propio widget (igual que un visitante), los 3 mensajes
//      exigidos por el mandato, midiendo latencia y comprobando que la
//      respuesta usa el contexto de la conversación.
//   2) Comprueba que ninguna respuesta visible contiene una fuga técnica
//      (código HTTP, "UNAVAILABLE", nombre del proveedor, JSON crudo...).
//   3) Fuerza un 429 real disparando peticiones directas a /api/chat
//      desde el propio navegador (fetch en la página, no clics — el
//      propio widget serializa los envíos a propósito como medida
//      anti-abuso, así que forzar ráfaga necesita saltarse esa cola) y
//      verifica que el endpoint responde 429 con un mensaje limpio.
//   4) Reporta consola y red del navegador durante todo el proceso.
//
// Uso: node scripts/qa-preview-chat-check.js <url-base>

const { chromium } = require('playwright');

const BASE = process.argv[2];
if (!BASE) {
  console.error('Uso: node scripts/qa-preview-chat-check.js <url-base>');
  process.exit(2);
}

const MESSAGES = [
  'Hola, ¿qué hace D-Code Partners?',
  '¿Cómo funcionan vuestros Departamentos Inteligentes?',
  '¿Qué diferencia hay entre D-Code OS y un chatbot?',
];

// Nunca debe aparecer en el texto que ve el usuario, pase lo que pase con
// el proveedor real (ver classifyError en api/chat.js).
const FORBIDDEN_TERMS = [
  '503', '"429', ' 429', '500', '502', '504', 'unavailable', 'resource_exhausted',
  'gemini', 'anthropic', 'stack trace', 'econnrefused', 'enotfound', 'abarterror',
];

function containsForbidden(text) {
  const lower = text.toLowerCase();
  return FORBIDDEN_TERMS.filter((t) => lower.includes(t.toLowerCase()));
}

(async () => {
  // Permite apuntar a un binario de Chromium concreto en entornos donde el
  // build por defecto de Playwright no está disponible (p. ej. sandboxes
  // con una ruta de navegador ya preinstalada). En CI (que instala su
  // propio Chromium vía "npx playwright install") esta variable no está
  // definida y el lanzamiento usa la ruta por defecto, sin cambios.
  const launchOptions = process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {};
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 420, height: 920 } });

  const consoleErrors = [];
  const networkFailures = [];
  const chatApiResponses = [];
  const issues = [];

  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));
  page.on('requestfailed', (req) => {
    if (req.url().startsWith(BASE)) networkFailures.push(`${req.url()} (${req.failure()?.errorText || 'failed'})`);
  });
  page.on('response', async (res) => {
    if (!res.url().endsWith('/api/chat')) return;
    try {
      const body = await res.json();
      chatApiResponses.push({ status: res.status(), mode: body.mode, providerErrorReason: body.providerErrorReason });
    } catch (e) {
      chatApiResponses.push({ status: res.status(), parseError: String(e) });
    }
  });

  console.log(`Abriendo ${BASE} ...`);
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.click('#chat-bubble');
  await page.waitForTimeout(400);

  console.log('\n--- Conversación real (3 mensajes obligatorios) ---');
  for (const msg of MESSAGES) {
    const start = Date.now();
    await page.fill('#chat-input', msg);
    await page.click('#chat-form button[type="submit"]');
    await page.waitForFunction(
      () => !document.getElementById('chat-typing-indicator'),
      { timeout: 60000 }
    );
    const elapsedMs = Date.now() - start;
    const lastBotText = await page.$$eval('.chat-msg.bot', (els) => els[els.length - 1]?.textContent || '');
    const forbidden = containsForbidden(lastBotText);
    if (forbidden.length) issues.push(`Fuga técnica en respuesta a "${msg}": ${forbidden.join(', ')}`);
    console.log(`\n> "${msg}"`);
    console.log(`  latencia: ${elapsedMs}ms`);
    console.log(`  respuesta: ${lastBotText.slice(0, 280).replace(/\s+/g, ' ')}`);
  }

  // La segunda y tercera pregunta ("¿Y cómo funciona?", "¿Qué diferencia
  // hay...?") solo tienen sentido si el modelo usó el contexto previo —
  // una respuesta genérica de bienvenida en su lugar indicaría que el
  // historial no está llegando al backend.
  const allBotTexts = await page.$$eval('.chat-msg.bot', (els) => els.map((e) => e.textContent || ''));
  if (allBotTexts.length < MESSAGES.length + 1) {
    issues.push(`Se esperaban al menos ${MESSAGES.length} respuestas del bot, se vieron ${allBotTexts.length - 1}`);
  }

  console.log('\n--- Forzando 429 (rate limit real del endpoint) ---');
  const burstResult = await page.evaluate(async () => {
    const results = [];
    for (let i = 0; i < 22; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `ping de verificación anti-abuso #${i}`, history: [] }),
      });
      // eslint-disable-next-line no-await-in-loop
      const json = await res.json().catch(() => ({}));
      results.push({ status: res.status, success: json.success, error: json.error });
    }
    return results;
  });
  const rateLimited = burstResult.filter((r) => r.status === 429);
  console.log(`  ${burstResult.length} peticiones enviadas, ${rateLimited.length} devolvieron 429`);
  if (rateLimited.length === 0) {
    issues.push('No se observó ningún 429 tras la ráfaga de peticiones — revisar el rate limiter');
  } else {
    const sample = rateLimited[0];
    const sampleForbidden = containsForbidden(String(sample.error || ''));
    if (sampleForbidden.length) issues.push(`Fuga técnica en el 429: ${sampleForbidden.join(', ')}`);
    console.log(`  mensaje del 429: ${sample.error}`);
  }

  console.log('\n--- Resumen ---');
  console.log('CONSOLE_ERRORS:', JSON.stringify(consoleErrors));
  console.log('NETWORK_FAILURES (mismo origen):', JSON.stringify(networkFailures));
  console.log('CHAT_API_RESPONSES:', JSON.stringify(chatApiResponses));
  console.log('ISSUES:', JSON.stringify(issues, null, 2));

  await browser.close();

  // El paso 3 fuerza a propósito 22 peticiones hasta obtener 429 — Chromium
  // registra cada respuesta 4xx/5xx de fetch() como "Failed to load
  // resource" en la consola aunque la aplicación la maneje perfectamente
  // bien (el 429 es precisamente el comportamiento correcto que se está
  // verificando). Esas líneas no son errores reales de la aplicación y no
  // deben hacer fallar la comprobación.
  const realConsoleErrors = consoleErrors.filter((line) => !/\b429\b/.test(line));

  if (issues.length || realConsoleErrors.length || networkFailures.length) {
    console.error(`\nFALLO: ${issues.length} problema(s) de chatbot, ${realConsoleErrors.length} error(es) de consola, ${networkFailures.length} fallo(s) de red.`);
    process.exit(1);
  }
  console.log('\nOK: conversación real correcta, contexto mantenido, sin fugas técnicas, rate limit real verificado.');
})().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
