'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const handler = require('../api/chat');

let ipCounter = 0;
function nextIp() {
  ipCounter += 1;
  return `10.0.0.${ipCounter}`;
}

function makeReq(body, ip, method) {
  return {
    method: method || 'POST',
    body,
    headers: { 'x-forwarded-for': ip || nextIp() },
    socket: { remoteAddress: '127.0.0.1' },
  };
}

function makeRes() {
  const res = {
    _status: null,
    _json: null,
    setHeader() {},
  };
  res.status = (code) => {
    res._status = code;
    return res;
  };
  res.json = (payload) => {
    res._json = payload;
    return res;
  };
  return res;
}

function withEnv(vars, fn) {
  const previous = {};
  for (const key of Object.keys(vars)) previous[key] = process.env[key];
  Object.assign(process.env, vars);
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      for (const key of Object.keys(previous)) {
        if (previous[key] === undefined) delete process.env[key];
        else process.env[key] = previous[key];
      }
    });
}

// Términos que, bajo ningún fallo del proveedor, deben llegar al texto que
// ve el usuario (mandato: nunca 503/UNAVAILABLE/nombre de proveedor/JSON
// técnico/stack traces en el chat).
const FORBIDDEN_IN_USER_REPLY = [
  '503', '429', '500', '502', '504', 'unavailable', 'resource_exhausted',
  'gemini', 'anthropic', 'stack', 'econnrefused', 'enotfound', 'abarterror',
  'traceback', 'at callGemini', 'at callAnthropic',
];

function assertNoTechnicalLeak(reply) {
  const lower = reply.toLowerCase();
  for (const term of FORBIDDEN_IN_USER_REPLY) {
    assert.equal(lower.includes(term), false, `la respuesta al usuario no debe contener "${term}": ${reply}`);
  }
}

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

test('respuesta normal: proveedor OK devuelve mode generated', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    global.fetch = async () => jsonResponse(200, { candidates: [{ content: { parts: [{ text: 'Hacemos automatización con IA.' }] } }] });
    const req = makeReq({ message: '¿Qué hace D-Code Partners?', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.mode, 'generated');
    assert.equal(res._json.reply, 'Hacemos automatización con IA.');
  }));

test('503 persistente sin respaldo: mensaje amable, sin fuga técnica', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    global.fetch = async () => jsonResponse(503, { error: { code: 503, status: 'UNAVAILABLE', message: 'This model is currently experiencing high demand.' } });
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.mode, 'error');
    assert.equal(res._json.providerErrorReason, 'provider_down');
    assertNoTechnicalLeak(res._json.reply);
    assert.match(res._json.reply, /no está disponible temporalmente/i);
  }));

test('429 (cuota agotada): categoría quota, mensaje amable', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    global.fetch = async () => jsonResponse(429, { error: { code: 429, status: 'RESOURCE_EXHAUSTED' } });
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._json.providerErrorReason, 'quota');
    assertNoTechnicalLeak(res._json.reply);
    assert.match(res._json.reply, /muchas solicitudes/i);
  }));

test('500 genérico del proveedor: tratado igual que un fallo transitorio', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    global.fetch = async () => jsonResponse(500, { error: { code: 500, status: 'INTERNAL' } });
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._json.mode, 'error');
    assertNoTechnicalLeak(res._json.reply);
  }));

test('fallo de red tipo timeout/abort: reintenta y, si persiste, mensaje amable', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    global.fetch = async () => {
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      throw err;
    };
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._json.mode, 'error');
    assertNoTechnicalLeak(res._json.reply);
  }));

test('reintento: falla una vez y luego responde con éxito (transparente para el usuario)', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    let calls = 0;
    global.fetch = async () => {
      calls += 1;
      if (calls === 1) return jsonResponse(503, { error: { code: 503 } });
      return jsonResponse(200, { candidates: [{ content: { parts: [{ text: 'Todo bien tras el reintento.' }] } }] });
    };
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._json.mode, 'generated');
    assert.equal(res._json.reply, 'Todo bien tras el reintento.');
    assert.equal(calls, 2);
  }));

test('respaldo Anthropic se activa cuando Gemini agota reintentos', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: 'a' }, async () => {
    global.fetch = async (url) => {
      if (String(url).includes('generativelanguage')) return jsonResponse(503, { error: { code: 503 } });
      return jsonResponse(200, { content: [{ type: 'text', text: 'Responde el respaldo.' }] });
    };
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._json.mode, 'generated');
    assert.equal(res._json.reply, 'Responde el respaldo.');
    assertNoTechnicalLeak(res._json.reply);
  }));

test('ambos proveedores fallan: mensaje final amable, ninguna fuga técnica', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: 'a' }, async () => {
    global.fetch = async (url) => {
      if (String(url).includes('generativelanguage')) return jsonResponse(503, { error: { code: 503, status: 'UNAVAILABLE' } });
      return jsonResponse(500, { error: { type: 'api_error' } });
    };
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._json.mode, 'error');
    assertNoTechnicalLeak(res._json.reply);
  }));

test('sin proveedor configurado: mensaje honesto, sin inventar respuesta', () =>
  withEnv({ GEMINI_API_KEY3: '', GEMINI_API_KEY: '', ANTHROPIC_API_KEY: '' }, async () => {
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._json.mode, 'error');
    assert.equal(res._json.providerErrorReason, 'no_provider_configured');
    assertNoTechnicalLeak(res._json.reply);
  }));

test('input vacío: 400', () =>
  withEnv({ GEMINI_API_KEY3: 'k' }, async () => {
    const req = makeReq({ message: '   ', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._status, 400);
    assert.equal(res._json.success, false);
  }));

test('req.body ausente no rompe el endpoint', () =>
  withEnv({ GEMINI_API_KEY3: 'k' }, async () => {
    const req = makeReq(undefined);
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._status, 400);
  }));

test('input excesivamente largo se trunca antes de llegar al proveedor', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    let sentText = null;
    global.fetch = async (url, opts) => {
      const parsed = JSON.parse(opts.body);
      sentText = parsed.contents[parsed.contents.length - 1].parts[0].text;
      return jsonResponse(200, { candidates: [{ content: { parts: [{ text: 'ok' }] } }] });
    };
    const longMessage = 'a'.repeat(5000);
    const req = makeReq({ message: longMessage, history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._status, 200);
    assert.ok(sentText.length <= 600, `el mensaje enviado al proveedor debe truncarse a 600 caracteres, tiene ${sentText.length}`);
  }));

test('historial con roles inválidos o malformado se filtra sin romper', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    global.fetch = async () => jsonResponse(200, { candidates: [{ content: { parts: [{ text: 'ok' }] } }] });
    const req = makeReq({
      message: 'hola',
      history: [{ role: 'system', content: 'inyectado' }, { role: 'user', content: 'valido' }, 'no-es-un-objeto', null],
    });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
  }));

test('método no permitido: 405', () =>
  withEnv({ GEMINI_API_KEY3: 'k' }, async () => {
    const req = makeReq(undefined, undefined, 'GET');
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._status, 405);
  }));

test('abuso: rate limiting bloquea tras 20 peticiones en la ventana', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    global.fetch = async () => jsonResponse(200, { candidates: [{ content: { parts: [{ text: 'ok' }] } }] });
    const ip = 'rate-limit-test-ip';
    let last;
    for (let i = 0; i < 21; i += 1) {
      const req = makeReq({ message: 'hola', history: [] }, ip);
      const res = makeRes();
      // eslint-disable-next-line no-await-in-loop
      await handler(req, res);
      last = res;
    }
    assert.equal(last._status, 429);
    assert.equal(last._json.success, false);
  }));

test('el módulo exporta maxDuration acotado (nunca un handler sin límite)', () => {
  assert.equal(typeof handler.config.maxDuration, 'number');
  assert.ok(handler.config.maxDuration > 0 && handler.config.maxDuration <= 60);
});

test('rendimiento: con Gemini agotado (429) y Anthropic configurado, responde vía respaldo sin agotar los 3 intentos de Gemini', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: 'a' }, async () => {
    let geminiCalls = 0;
    let anthropicCalls = 0;
    global.fetch = async (url) => {
      if (String(url).includes('generativelanguage')) {
        geminiCalls += 1;
        return jsonResponse(429, { error: { code: 429, status: 'RESOURCE_EXHAUSTED' } });
      }
      anthropicCalls += 1;
      return jsonResponse(200, { content: [{ type: 'text', text: 'Respondo yo, el respaldo.' }] });
    };
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._json.mode, 'generated');
    assert.equal(geminiCalls, 1, 'un 429 no debería reintentarse en el mismo proveedor');
    assert.equal(anthropicCalls, 1);
  }));

test('respuesta incluye timingMs (duración total, sin fuga de proveedor ni error)', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    global.fetch = async () => jsonResponse(200, { candidates: [{ content: { parts: [{ text: 'ok' }] } }] });
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(typeof res._json.timingMs, 'number');
    assert.ok(res._json.timingMs >= 0);
  }));

test('respuesta de error también incluye timingMs', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    global.fetch = async () => jsonResponse(503, { error: { code: 503 } });
    const req = makeReq({ message: 'hola', history: [] });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res._json.mode, 'error');
    assert.equal(typeof res._json.timingMs, 'number');
  }));
