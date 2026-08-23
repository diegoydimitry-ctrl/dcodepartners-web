/**
 * Pruebas de api/contact-fallback.js con el módulo 'resend' mockeado — nunca
 * envía emails reales. Cubre: éxito normal, separación de fallo crítico vs.
 * "best effort", escape de HTML, truncado de campos, validación de email, y
 * reintento con timeout del envío interno (crítico).
 *
 * AUD-DCP 23/08/2026 (ronda 2): igual que test/providers.test.js, estas
 * pruebas existían solo como script suelto fuera del repositorio. Se
 * trasladan aquí para que queden versionadas y corran con `npm test`.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');

const HANDLER_PATH = require.resolve(path.join(__dirname, '..', 'api', 'contact-fallback.js'));
const projectRequire = Module.createRequire(HANDLER_PATH);
const RESEND_PATH = projectRequire.resolve('resend');

function mockReqRes(body) {
  const res = {
    _status: null,
    _json: null,
    status(s) { this._status = s; return this; },
    json(j) { this._json = j; return this; },
  };
  const req = { method: 'POST', body, headers: {}, socket: {} };
  return { req, res };
}

// Intercepta require('resend') justo antes de cargar el handler, y lo
// restaura después, para no contaminar otros módulos/pruebas.
function freshHandlerWithMockResend(sendImpl) {
  delete require.cache[HANDLER_PATH];
  const original = require.cache[RESEND_PATH];
  require.cache[RESEND_PATH] = {
    id: RESEND_PATH,
    filename: RESEND_PATH,
    loaded: true,
    exports: { Resend: class { get emails() { return { send: sendImpl }; } } },
  };
  const handler = require(HANDLER_PATH);
  require.cache[RESEND_PATH] = original;
  return handler;
}

test('éxito: 2 envíos (interno + confirmación)', async () => {
  const calls = [];
  const handler = freshHandlerWithMockResend(async (opts) => { calls.push(opts); return { id: 'fake' }; });
  const { req, res } = mockReqRes({ nombre: 'Ana', email: 'ana@ejemplo-prueba.invalid', turnstileToken: 'tok123', mensaje: 'hola' });
  await handler(req, res);
  assert.equal(res._status, 200);
  assert.equal(res._json.success, true);
  assert.equal(calls.length, 2);
});

test('faltan campos obligatorios -> 400', async () => {
  const handler = freshHandlerWithMockResend(async () => ({ id: 'fake' }));
  const { req, res } = mockReqRes({ nombre: '', email: '', turnstileToken: '' });
  await handler(req, res);
  assert.equal(res._status, 400);
  assert.equal(res._json.success, false);
});

test('email con formato inválido -> 400, sin intentar ningún envío', async () => {
  let calls = 0;
  const handler = freshHandlerWithMockResend(async () => { calls++; return { id: 'fake' }; });
  const { req, res } = mockReqRes({ nombre: 'Ana', email: 'esto-no-es-un-email', turnstileToken: 'tok123' });
  await handler(req, res);
  assert.equal(res._status, 400);
  assert.equal(calls, 0);
});

test('falla el aviso interno (todos los reintentos agotados) -> 500', async () => {
  let calls = 0;
  const handler = freshHandlerWithMockResend(async () => { calls++; throw new Error('Resend caído'); });
  const { req, res } = mockReqRes({ nombre: 'Ana', email: 'ana@ejemplo-prueba.invalid', turnstileToken: 'tok123' });
  await handler(req, res);
  assert.equal(res._status, 500);
  assert.equal(res._json.success, false);
  assert.equal(calls, 3, 'debe agotar los 3 intentos antes de rendirse');
});

test('el aviso interno se recupera tras un fallo transitorio (reintento con éxito)', async () => {
  let calls = 0;
  const handler = freshHandlerWithMockResend(async () => {
    calls++;
    if (calls === 1) throw new Error('503 temporal');
    return { id: 'fake' };
  });
  const { req, res } = mockReqRes({ nombre: 'Ana', email: 'ana@ejemplo-prueba.invalid', turnstileToken: 'tok123' });
  await handler(req, res);
  assert.equal(res._status, 200);
  assert.equal(res._json.success, true);
  assert.equal(calls, 3, '2 envíos exitosos (interno tras 1 fallo + confirmación) + 1 intento fallido inicial');
});

test('aviso interno OK + confirmación al cliente falla -> sigue siendo éxito, sin reintento de la confirmación', async () => {
  let call = 0;
  const handler = freshHandlerWithMockResend(async () => {
    call++;
    if (call === 1) return { id: 'fake-interno' };
    throw new Error('fallo confirmación cliente');
  });
  const { req, res } = mockReqRes({ nombre: 'Ana', email: 'ana@ejemplo-prueba.invalid', turnstileToken: 'tok123' });
  await handler(req, res);
  assert.equal(res._status, 200);
  assert.equal(res._json.success, true);
  assert.equal(call, 2, 'la confirmación falla UNA vez, sin reintentarse (best effort)');
});

test('el HTML del nombre/mensaje se escapa antes de interpolarse en el email', async () => {
  let capturedHtml = '';
  const handler = freshHandlerWithMockResend(async (opts) => { if (!capturedHtml) capturedHtml = opts.html; return { id: 'fake' }; });
  const { req, res } = mockReqRes({
    nombre: 'Ana <script>alert(1)</script>',
    email: 'ana@ejemplo-prueba.invalid',
    turnstileToken: 'tok123',
    mensaje: 'Hola & "bienvenido" <b>test</b>',
  });
  await handler(req, res);
  assert.ok(!capturedHtml.includes('<script>alert(1)</script>'));
  assert.ok(capturedHtml.includes('&lt;script&gt;'));
  assert.ok(capturedHtml.includes('&amp;') && capturedHtml.includes('&quot;bienvenido&quot;'));
});

// AUD-DCP 23/08/2026 (ronda 2): sin límite de longitud, un payload gigante
// (POST directo al endpoint, sin pasar por el formulario ni su maxlength de
// navegador) se interpolaba entero en el email. Verifica que el servidor
// trunca de verdad, no solo que el frontend lo haría.
test('un mensaje/nombre gigantes se truncan en servidor, no se envían enteros', async () => {
  let capturedHtml = '';
  let capturedSubject = '';
  const handler = freshHandlerWithMockResend(async (opts) => {
    if (!capturedHtml) { capturedHtml = opts.html; capturedSubject = opts.subject; }
    return { id: 'fake' };
  });
  const nombreGigante = 'A'.repeat(10_000);
  const mensajeGigante = 'M'.repeat(50_000);
  const { req, res } = mockReqRes({
    nombre: nombreGigante,
    email: 'ana@ejemplo-prueba.invalid',
    turnstileToken: 'tok123',
    mensaje: mensajeGigante,
  });
  await handler(req, res);
  assert.equal(res._status, 200);
  assert.ok(capturedHtml.length < 5000, `el HTML del email no debe contener el mensaje de 50.000 caracteres sin truncar (len=${capturedHtml.length})`);
  assert.ok(capturedSubject.length < 500, 'el asunto (incluye el nombre) tampoco debe ser gigante');
});

test('rate limiting: la petición nº 11 en la misma ventana de 60s se rechaza con 429', async () => {
  const handler = freshHandlerWithMockResend(async () => ({ id: 'fake' }));
  const ip = '203.0.113.' + Math.floor(Math.random() * 255); // IP única por test, evita interferencia entre pruebas
  let last;
  for (let i = 0; i < 11; i += 1) {
    const { req, res } = mockReqRes({ nombre: 'Ana', email: 'ana@ejemplo-prueba.invalid', turnstileToken: 'tok123' });
    req.headers['x-forwarded-for'] = ip;
    // eslint-disable-next-line no-await-in-loop
    await handler(req, res);
    last = res;
  }
  assert.equal(last._status, 429);
});

test('método no permitido devuelve 405', async () => {
  const handler = freshHandlerWithMockResend(async () => ({ id: 'fake' }));
  const { req, res } = mockReqRes({ nombre: 'Ana' });
  req.method = 'GET';
  await handler(req, res);
  assert.equal(res._status, 405);
});
