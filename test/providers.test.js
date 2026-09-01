/**
 * Pruebas de lib/providers.js y api/chat.js con `fetch` mockeado — nunca
 * llaman de verdad a Gemini/Anthropic. Cubren: éxito normal, reintento tras
 * 503/500/529, timeout (AbortError) como reintentable, 400 no reintentable,
 * agotamiento de reintentos + failover Gemini→Anthropic, presupuesto de un
 * único intento para el proveedor de respaldo, saneado de mensajes/historial
 * en api/chat.js, y los ajustes de paridad de Anthropic (thinking
 * desactivado, prompt caching).
 *
 * AUD-DCP 23/08/2026 (ronda 2): estas pruebas existían solo como script
 * suelto fuera del repositorio (se perdían al terminar la sesión que las
 * escribió, y nunca corrían en CI). Se trasladan aquí, a `node:test`
 * (incluido en Node 22, sin dependencia nueva) para que queden versionadas
 * y ejecutables con `npm test`.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const PROVIDERS_PATH = require.resolve(path.join(__dirname, '..', 'lib', 'providers.js'));
const CHAT_PATH = require.resolve(path.join(__dirname, '..', 'api', 'chat.js'));

function freshProviders() {
  delete require.cache[PROVIDERS_PATH];
  return require(PROVIDERS_PATH);
}

function freshChatHandler() {
  delete require.cache[CHAT_PATH];
  return require(CHAT_PATH);
}

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
    json: async () => body,
  };
}

function mockReqRes(body) {
  const res = {
    _status: null,
    _json: null,
    status(s) { this._status = s; return this; },
    json(j) { this._json = j; return this; },
    setHeader() {},
  };
  const req = { method: 'POST', body, headers: {}, socket: {} };
  return { req, res };
}

const GEMINI_OK_BODY = { candidates: [{ content: { parts: [{ text: 'Respuesta real de Gemini' }] } }] };
const ANTHROPIC_OK_BODY = { content: [{ type: 'text', text: 'Respuesta real de Anthropic' }] };

// Simula el bucle real de api/chat.js: solo el proveedor en índice 0 usa el
// presupuesto de reintentos por defecto; el resto recibe maxAttempts:1.
async function runChainLikeChatJs(chain) {
  let reply = null;
  let lastError = null;
  let lastProviderName = null;
  for (let i = 0; i < chain.length; i += 1) {
    const provider = chain[i];
    lastProviderName = provider.name;
    try {
      const options = i === 0 ? undefined : { maxAttempts: 1 };
      reply = await provider.generate('sys', [{ role: 'user', content: 'hola' }], options);
      break;
    } catch (e) {
      lastError = e;
    }
  }
  return { reply, lastError, lastProviderName };
}

function setEnv({ gemini, anthropic, forced } = {}) {
  if (gemini) process.env.GEMINI_API_KEY3 = gemini;
  else { delete process.env.GEMINI_API_KEY3; delete process.env.GEMINI_API_KEY; }
  if (anthropic) process.env.ANTHROPIC_API_KEY = anthropic;
  else delete process.env.ANTHROPIC_API_KEY;
  if (forced) process.env.AI_PROVIDER = forced;
  else delete process.env.AI_PROVIDER;
}

test('respuesta normal: una sola llamada, sin reintento', async () => {
  setEnv({ gemini: 'fake-key' });
  let calls = 0;
  global.fetch = async () => { calls++; return jsonResponse(200, GEMINI_OK_BODY); };
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  assert.equal(chain.length, 1);
  assert.equal(chain[0].name, 'gemini');
  const reply = await chain[0].generate('sys', [{ role: 'user', content: 'hola' }]);
  assert.equal(reply, 'Respuesta real de Gemini');
  assert.equal(calls, 1);
});

test('503 seguido de éxito: se reintenta y responde en el 2º intento', async () => {
  setEnv({ gemini: 'fake-key' });
  let calls = 0;
  global.fetch = async () => {
    calls++;
    if (calls === 1) return jsonResponse(503, { error: { message: 'high demand' } });
    return jsonResponse(200, GEMINI_OK_BODY);
  };
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  const start = Date.now();
  const reply = await chain[0].generate('sys', [{ role: 'user', content: 'hola' }]);
  const elapsed = Date.now() - start;
  assert.equal(reply, 'Respuesta real de Gemini');
  assert.equal(calls, 2);
  assert.ok(elapsed >= 380, `esperaba backoff ~400ms, elapsed=${elapsed}ms`);
});

test('agota reintentos de Gemini y hace failover a Anthropic', async () => {
  setEnv({ gemini: 'fake-key', anthropic: 'fake-key-anthropic' });
  let geminiCalls = 0;
  let anthropicCalls = 0;
  global.fetch = async (url) => {
    if (String(url).includes('generativelanguage.googleapis.com')) {
      geminiCalls++;
      return jsonResponse(503, { error: { message: 'high demand' } });
    }
    anthropicCalls++;
    return jsonResponse(200, ANTHROPIC_OK_BODY);
  };
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  assert.equal(chain.length, 2);
  const { reply } = await runChainLikeChatJs(chain);
  assert.equal(geminiCalls, 3, 'Gemini debe agotar sus 3 intentos');
  assert.equal(anthropicCalls, 1, 'Anthropic (respaldo) responde a la primera');
  assert.equal(reply, 'Respuesta real de Anthropic');
});

test('el proveedor de respaldo solo recibe UN intento, no se reintenta', async () => {
  setEnv({ gemini: 'fake-key', anthropic: 'fake-key-anthropic' });
  let geminiCalls = 0;
  let anthropicCalls = 0;
  global.fetch = async (url) => {
    if (String(url).includes('generativelanguage.googleapis.com')) {
      geminiCalls++;
      return jsonResponse(503, { error: { message: 'high demand' } });
    }
    anthropicCalls++;
    return jsonResponse(503, { error: { type: 'overloaded_error', message: 'Overloaded' } });
  };
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  const { reply, lastError, lastProviderName } = await runChainLikeChatJs(chain);
  assert.equal(geminiCalls, 3);
  assert.equal(anthropicCalls, 1);
  assert.equal(reply, null);
  assert.equal(lastProviderName, 'anthropic');
  assert.ok(lastError);
});

test('todos los proveedores fallan: error real capturado, no crash', async () => {
  setEnv({ gemini: 'fake-key', anthropic: 'fake-key-anthropic' });
  global.fetch = async () => jsonResponse(503, { error: { message: 'high demand' } });
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  const { reply, lastError, lastProviderName } = await runChainLikeChatJs(chain);
  assert.equal(reply, null);
  assert.ok(lastError && /503/.test(lastError.message));
  assert.equal(lastProviderName, 'anthropic');
});

test('timeout (AbortError) es reintentable', async () => {
  setEnv({ gemini: 'fake-key' });
  let calls = 0;
  global.fetch = async (url, options) => {
    calls++;
    if (calls === 1) {
      return new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => {
          const err = new Error('The operation was aborted');
          err.name = 'AbortError';
          reject(err);
        });
      });
    }
    return jsonResponse(200, GEMINI_OK_BODY);
  };
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  const reply = await chain[0].generate('sys', [{ role: 'user', content: 'hola' }]);
  assert.equal(reply, 'Respuesta real de Gemini');
  assert.equal(calls, 2);
});

test('400 no reintentable falla rápido (1 sola llamada)', async () => {
  setEnv({ gemini: 'fake-key' });
  let calls = 0;
  global.fetch = async () => { calls++; return jsonResponse(400, { error: { message: 'INVALID_ARGUMENT' } }); };
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  await assert.rejects(() => chain[0].generate('sys', [{ role: 'user', content: 'hola' }]));
  assert.equal(calls, 1);
});

test('api/chat.js: mensaje vacío devuelve 400 controlado', async () => {
  setEnv({ gemini: 'fake-key' });
  global.fetch = async () => jsonResponse(200, GEMINI_OK_BODY);
  const handler = freshChatHandler();
  const { req, res } = mockReqRes({ message: '   ' });
  await handler(req, res);
  assert.equal(res._status, 400);
  assert.equal(res._json.success, false);
});

test('api/chat.js: mensaje larguísimo se trunca sin fallar', async () => {
  setEnv({ gemini: 'fake-key' });
  global.fetch = async () => jsonResponse(200, GEMINI_OK_BODY);
  const handler = freshChatHandler();
  const { req, res } = mockReqRes({ message: 'x'.repeat(5000), history: [] });
  await handler(req, res);
  assert.equal(res._status, 200);
  assert.equal(res._json.success, true);
});

test('respuesta vacía de Gemini no se reintenta contra sí misma, pero sí hace failover', async () => {
  setEnv({ gemini: 'fake-key', anthropic: 'fake-key-anthropic' });
  let geminiCalls = 0;
  let anthropicCalls = 0;
  global.fetch = async (url) => {
    if (String(url).includes('generativelanguage.googleapis.com')) {
      geminiCalls++;
      return jsonResponse(200, { candidates: [{ content: { parts: [] }, finishReason: 'MAX_TOKENS' }] });
    }
    anthropicCalls++;
    return jsonResponse(200, ANTHROPIC_OK_BODY);
  };
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  const { reply } = await runChainLikeChatJs(chain);
  assert.equal(geminiCalls, 1);
  assert.equal(reply, 'Respuesta real de Anthropic');
  assert.equal(anthropicCalls, 1);
});

test('529 (Overloaded) de Anthropic es reintentable', async () => {
  setEnv({ anthropic: 'fake-key-anthropic' });
  let calls = 0;
  global.fetch = async () => {
    calls++;
    if (calls === 1) return jsonResponse(529, { error: { type: 'overloaded_error', message: 'Overloaded' } });
    return jsonResponse(200, ANTHROPIC_OK_BODY);
  };
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  assert.equal(chain.length, 1);
  assert.equal(chain[0].name, 'anthropic');
  const reply = await chain[0].generate('sys', [{ role: 'user', content: 'hola' }]);
  assert.equal(reply, 'Respuesta real de Anthropic');
  assert.equal(calls, 2);
});

test('presupuesto teórico del peor caso (Gemini x3 + Anthropic x1) cabe bajo maxDuration=60s', async () => {
  setEnv({ gemini: 'fake-key', anthropic: 'fake-key-anthropic' });
  global.fetch = async () => jsonResponse(503, { error: {} });
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  const start = Date.now();
  await runChainLikeChatJs(chain);
  const elapsedBackoffOnly = Date.now() - start;
  // Con fetch mockeado (resuelve al instante) lo único que consume tiempo
  // real es el backoff entre los 2 reintentos de Gemini (400ms + 1200ms).
  assert.ok(elapsedBackoffOnly >= 1550 && elapsedBackoffOnly < 3000, `elapsed=${elapsedBackoffOnly}ms`);
  // Cálculo teórico documentado (no medible con fetch mockeado): 3 intentos
  // Gemini x 12s + 1 intento Anthropic x 12s + 1.6s de backoff = 49.6s.
  const teoricoPeorCasoSegundos = 3 * 12 + 1 * 12 + 1.6;
  assert.ok(teoricoPeorCasoSegundos < 55, `teorico=${teoricoPeorCasoSegundos}s`);
});

test('500 genérico de Gemini también es reintentable (5xx amplio)', async () => {
  setEnv({ gemini: 'fake-key' });
  let calls = 0;
  global.fetch = async () => {
    calls++;
    if (calls === 1) return jsonResponse(500, { error: { message: 'internal error' } });
    return jsonResponse(200, GEMINI_OK_BODY);
  };
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  const reply = await chain[0].generate('sys', [{ role: 'user', content: 'hola' }]);
  assert.equal(reply, 'Respuesta real de Gemini');
  assert.equal(calls, 2);
});

test('Anthropic: thinking desactivado y system prompt con cache_control', async () => {
  setEnv({ anthropic: 'fake-key-anthropic' });
  let capturedBody = null;
  global.fetch = async (url, options) => {
    capturedBody = JSON.parse(options.body);
    return jsonResponse(200, ANTHROPIC_OK_BODY);
  };
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  await chain[0].generate('sys de prueba', [{ role: 'user', content: 'hola' }]);
  assert.equal(capturedBody.thinking.type, 'disabled');
  assert.equal(capturedBody.system[0].cache_control.type, 'ephemeral');
  assert.equal(capturedBody.system[0].text, 'sys de prueba');
});

test('sanitizeHistory descarta turnos iniciales que no sean de usuario', async () => {
  setEnv({ gemini: 'fake-key' });
  let capturedContents = null;
  global.fetch = async (url, options) => {
    capturedContents = JSON.parse(options.body).contents;
    return jsonResponse(200, GEMINI_OK_BODY);
  };
  const handler = freshChatHandler();
  const { req, res } = mockReqRes({
    message: 'segunda pregunta',
    history: [
      { role: 'assistant', content: 'mensaje de bienvenida' },
      { role: 'user', content: 'primera pregunta' },
      { role: 'assistant', content: 'primera respuesta' },
    ],
  });
  await handler(req, res);
  assert.equal(res._status, 200);
  assert.equal(res._json.success, true);
  const roles = (capturedContents || []).map((c) => c.role);
  assert.equal(roles[0], 'user');
});

test('respuesta vacía de Anthropic incluye stop_reason en el error', async () => {
  setEnv({ anthropic: 'fake-key-anthropic' });
  global.fetch = async () => jsonResponse(200, { content: [], stop_reason: 'max_tokens' });
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  await assert.rejects(
    () => chain[0].generate('sys', [{ role: 'user', content: 'hola' }]),
    /max_tokens/
  );
});

test('sin ninguna clave configurada, la cadena de proveedores está vacía', async () => {
  setEnv({});
  const { getProviderChain } = freshProviders();
  assert.deepEqual(getProviderChain(), []);
});

test('AI_PROVIDER forzado limita la cadena a un único proveedor, aunque haya más claves', async () => {
  setEnv({ gemini: 'fake-key', anthropic: 'fake-key-anthropic', forced: 'anthropic' });
  const { getProviderChain } = freshProviders();
  const chain = getProviderChain();
  assert.equal(chain.length, 1);
  assert.equal(chain[0].name, 'anthropic');
});

// AUD-DCP 23/08/2026 (ronda 2): un payload malicioso/roto en `history` (no
// es un array, o contiene objetos sin 'content' de tipo string, o roles no
// reconocidos) no debe tumbar el endpoint — sanitizeHistory debe filtrarlo
// en silencio y seguir respondiendo con normalidad al mensaje actual.
test('api/chat.js: historial malformado (no es array) no rompe la petición', async () => {
  setEnv({ gemini: 'fake-key' });
  global.fetch = async () => jsonResponse(200, GEMINI_OK_BODY);
  const handler = freshChatHandler();
  const { req, res } = mockReqRes({ message: 'hola', history: 'esto no es un array' });
  await handler(req, res);
  assert.equal(res._status, 200);
  assert.equal(res._json.success, true);
});

test('api/chat.js: historial con roles/objetos inválidos se filtra sin fallar', async () => {
  setEnv({ gemini: 'fake-key' });
  let capturedContents = null;
  global.fetch = async (url, options) => {
    capturedContents = JSON.parse(options.body).contents;
    return jsonResponse(200, GEMINI_OK_BODY);
  };
  const handler = freshChatHandler();
  const { req, res } = mockReqRes({
    message: 'hola',
    history: [
      null,
      { role: 'system', content: 'inyección de rol no soportado' },
      { role: 'user', content: 123 },
      { role: 'user', content: 'turno válido' },
    ],
  });
  await handler(req, res);
  assert.equal(res._status, 200);
  assert.equal(res._json.success, true);
  // Solo el turno realmente válido ('turno válido') más el mensaje actual
  // deben llegar al proveedor — 2 turnos en total, no 5.
  assert.equal(capturedContents.length, 2);
});

test('api/chat.js: req.body ausente no crashea el handler', async () => {
  setEnv({ gemini: 'fake-key' });
  global.fetch = async () => jsonResponse(200, GEMINI_OK_BODY);
  const handler = freshChatHandler();
  const { req, res } = mockReqRes(undefined);
  await handler(req, res);
  assert.equal(res._status, 400);
  assert.equal(res._json.success, false);
});

test('api/chat.js: método no permitido devuelve 405', async () => {
  setEnv({ gemini: 'fake-key' });
  const handler = freshChatHandler();
  const { req, res } = mockReqRes({ message: 'hola' });
  req.method = 'GET';
  await handler(req, res);
  assert.equal(res._status, 405);
});

test('api/chat.js: sin proveedor configurado responde 200 con mensaje honesto (no crash, no 500)', async () => {
  setEnv({});
  const handler = freshChatHandler();
  const { req, res } = mockReqRes({ message: 'hola' });
  await handler(req, res);
  assert.equal(res._status, 200);
  assert.equal(res._json.mode, 'error');
  assert.equal(res._json.providerErrorReason, 'no_provider_configured');
});
