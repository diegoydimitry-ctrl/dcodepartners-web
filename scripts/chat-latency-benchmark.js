#!/usr/bin/env node
// Auditoría de rendimiento del chatbot (mandato P0, 24/08/2026): mide la
// latencia REAL de /api/chat contra una Preview en vivo — nunca contra un
// mock. Pensado para correr dos veces (antes/después de un cambio) y
// comparar percentiles con números reales, no estimados.
//
// Uso: node scripts/chat-latency-benchmark.js <url-base> [n]
//   VERCEL_AUTOMATION_BYPASS_SECRET (opcional): cabecera de bypass de
//   Vercel Authentication, igual que en qa-preview-check.js.

const BASE = process.argv[2];
const N = parseInt(process.argv[3], 10) || 10;
if (!BASE) {
  console.error('Uso: node scripts/chat-latency-benchmark.js <url-base> [n]');
  process.exit(2);
}

const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '';
const headers = { 'Content-Type': 'application/json' };
if (BYPASS_SECRET) headers['x-vercel-protection-bypass'] = BYPASS_SECRET;

// Mensajes variados y realistas — no el mismo texto N veces, para no
// medir un caso artificialmente cacheable/repetitivo.
const MESSAGES = [
  '¿Qué hace D-Code Partners?',
  '¿Cómo funcionan los Departamentos Inteligentes?',
  '¿Qué es un agente de IA?',
  '¿Cuánto tarda una implementación típica?',
  '¿Qué diferencia hay con un chatbot normal?',
  '¿Puedo automatizar mi departamento de soporte?',
  '¿Qué es D-Code OS?',
  '¿Trabajáis con pymes?',
  '¿Cómo empiezo a trabajar con vosotros?',
  '¿Qué garantías ofrecéis?',
];

function percentile(sorted, p) {
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
}

async function sendOne(message) {
  const start = Date.now();
  try {
    const res = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, history: [] }),
    });
    const wallMs = Date.now() - start;
    const body = await res.json().catch(() => ({}));
    return {
      message,
      status: res.status,
      wallMs,
      serverTimingMs: body.timingMs,
      mode: body.mode,
      providerErrorReason: body.providerErrorReason,
      replyPreview: (body.reply || '').slice(0, 80),
    };
  } catch (e) {
    return { message, status: 0, wallMs: Date.now() - start, error: String(e.message || e) };
  }
}

async function main() {
  console.log(`Benchmark de latencia real contra: ${BASE}`);
  console.log(`${N} peticiones secuenciales (igual que un visitante real, para no disparar el rate limit)\n`);

  const results = [];
  for (let i = 0; i < N; i += 1) {
    const msg = MESSAGES[i % MESSAGES.length];
    // eslint-disable-next-line no-await-in-loop
    const r = await sendOne(msg);
    results.push(r);
    console.log(
      `${i + 1}/${N} [${r.wallMs}ms] status=${r.status} mode=${r.mode || '-'} ` +
        `reason=${r.providerErrorReason || '-'} :: "${r.message}" -> "${r.replyPreview}"`
    );
  }

  const wallTimes = results.map((r) => r.wallMs).sort((a, b) => a - b);
  const generated = results.filter((r) => r.mode === 'generated').length;
  const errored = results.filter((r) => r.mode === 'error').length;
  const failed = results.filter((r) => r.status !== 200).length;

  console.log('\n--- Resumen ---');
  console.log(`Respuestas generadas (éxito real): ${generated}/${N}`);
  console.log(`Respuestas de error amable: ${errored}/${N}`);
  console.log(`Fallos HTTP (no 200): ${failed}/${N}`);
  console.log(`min: ${wallTimes[0]}ms`);
  console.log(`p50: ${percentile(wallTimes, 50)}ms`);
  console.log(`p95: ${percentile(wallTimes, 95)}ms`);
  console.log(`max: ${wallTimes[wallTimes.length - 1]}ms`);
  console.log(`media: ${Math.round(wallTimes.reduce((a, b) => a + b, 0) / wallTimes.length)}ms`);
  console.log('\nBENCHMARK_JSON:' + JSON.stringify({ N, generated, errored, failed, wallTimes }));
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
