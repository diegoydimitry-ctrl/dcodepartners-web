'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

// Cada test manipula process.env y require.cache directamente: lib/providers.js
// lee las claves y el proveedor forzado en el momento en que se llama a
// getProviderChain()/generate(), así que basta con limpiar el caché de
// require entre tests para que cada uno arranque con env limpio y un
// fetch global propio, sin depender del orden de ejecución.
const PROVIDERS_PATH = require.resolve('../lib/providers');

function loadProviders() {
  delete require.cache[PROVIDERS_PATH];
  return require('../lib/providers');
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

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

function geminiOkBody(text) {
  return { candidates: [{ content: { parts: [{ text }] }, finishReason: 'STOP' }] };
}

test('proveedor Gemini responde con éxito a la primera', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '' }, async () => {
    const providers = loadProviders();
    let calls = 0;
    global.fetch = async () => {
      calls += 1;
      return jsonResponse(200, geminiOkBody('Hola, soy el asistente.'));
    };
    const chain = providers.getProviderChain();
    assert.equal(chain.length, 1);
    assert.equal(chain[0].name, 'gemini');
    const reply = await chain[0].generate('system', [{ role: 'user', content: 'hola' }]);
    assert.equal(reply, 'Hola, soy el asistente.');
    assert.equal(calls, 1);
  }));

test('503 transitorio: reintenta con backoff y acaba respondiendo', () =>
  withEnv({ GEMINI_API_KEY3: 'k' }, async () => {
    const providers = loadProviders();
    let calls = 0;
    global.fetch = async () => {
      calls += 1;
      if (calls < 3) {
        return jsonResponse(503, { error: { code: 503, status: 'UNAVAILABLE', message: 'high demand' } });
      }
      return jsonResponse(200, geminiOkBody('Ya funciona.'));
    };
    const reply = await providers.getProviderChain()[0].generate('system', [
      { role: 'user', content: 'hola' },
    ]);
    assert.equal(reply, 'Ya funciona.');
    assert.equal(calls, 3);
  }));

test('429 (cuota) es reintentable igual que un 5xx', () =>
  withEnv({ GEMINI_API_KEY3: 'k' }, async () => {
    const providers = loadProviders();
    let calls = 0;
    global.fetch = async () => {
      calls += 1;
      if (calls === 1) return jsonResponse(429, { error: { code: 429, status: 'RESOURCE_EXHAUSTED' } });
      return jsonResponse(200, geminiOkBody('Recuperado tras 429.'));
    };
    const reply = await providers.getProviderChain()[0].generate('system', [
      { role: 'user', content: 'hola' },
    ]);
    assert.equal(reply, 'Recuperado tras 429.');
    assert.equal(calls, 2);
  }));

test('agota los reintentos y lanza el último error si el 503 persiste', () =>
  withEnv({ GEMINI_API_KEY3: 'k' }, async () => {
    const providers = loadProviders();
    let calls = 0;
    global.fetch = async () => {
      calls += 1;
      return jsonResponse(503, { error: { code: 503, status: 'UNAVAILABLE' } });
    };
    await assert.rejects(
      () => providers.getProviderChain()[0].generate('system', [{ role: 'user', content: 'hola' }]),
      /estado 503/
    );
    assert.equal(calls, 3); // DEFAULT_MAX_ATTEMPTS
  }));

test('400 no se reintenta (falla rápido)', () =>
  withEnv({ GEMINI_API_KEY3: 'k' }, async () => {
    const providers = loadProviders();
    let calls = 0;
    global.fetch = async () => {
      calls += 1;
      return jsonResponse(400, { error: { code: 400, status: 'INVALID_ARGUMENT' } });
    };
    await assert.rejects(
      () => providers.getProviderChain()[0].generate('system', [{ role: 'user', content: 'hola' }]),
      /estado 400/
    );
    assert.equal(calls, 1);
  }));

test('respuesta vacía de Gemini se trata como fallo con finishReason', () =>
  withEnv({ GEMINI_API_KEY3: 'k' }, async () => {
    const providers = loadProviders();
    global.fetch = async () => jsonResponse(200, { candidates: [{ content: { parts: [] }, finishReason: 'SAFETY' }] });
    await assert.rejects(
      () => providers.getProviderChain()[0].generate('system', [{ role: 'user', content: 'hola' }], { maxAttempts: 1 }),
      /SAFETY/
    );
  }));

test('cadena de proveedores: Gemini agotado pasa a Anthropic como respaldo', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: 'a' }, async () => {
    const providers = loadProviders();
    const chain = providers.getProviderChain();
    assert.deepEqual(chain.map((p) => p.name), ['gemini', 'anthropic']);

    let geminiCalls = 0;
    let anthropicCalls = 0;
    global.fetch = async (url) => {
      if (String(url).includes('generativelanguage')) {
        geminiCalls += 1;
        return jsonResponse(503, { error: { code: 503 } });
      }
      anthropicCalls += 1;
      return jsonResponse(200, { content: [{ type: 'text', text: 'Respondo yo, el respaldo.' }] });
    };

    // Simula exactamente lo que hace api/chat.js: reintentos completos en
    // el principal, un único intento en el respaldo.
    let reply;
    try {
      reply = await chain[0].generate('system', [{ role: 'user', content: 'hola' }]);
    } catch (e) {
      reply = await chain[1].generate('system', [{ role: 'user', content: 'hola' }], { maxAttempts: 1 });
    }
    assert.equal(reply, 'Respondo yo, el respaldo.');
    assert.equal(geminiCalls, 3);
    assert.equal(anthropicCalls, 1);
  }));

test('sin ninguna clave configurada, la cadena está vacía', () =>
  withEnv({ GEMINI_API_KEY3: '', GEMINI_API_KEY: '', ANTHROPIC_API_KEY: '' }, async () => {
    const providers = loadProviders();
    assert.deepEqual(providers.getProviderChain(), []);
  }));

test('AI_PROVIDER fuerza un único proveedor aunque haya más claves', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: 'a', AI_PROVIDER: 'anthropic' }, async () => {
    const providers = loadProviders();
    const chain = providers.getProviderChain();
    assert.deepEqual(chain.map((p) => p.name), ['anthropic']);
  }));

test('AI_PROVIDER forzado sin su clave configurada deja la cadena vacía', () =>
  withEnv({ GEMINI_API_KEY3: 'k', ANTHROPIC_API_KEY: '', AI_PROVIDER: 'anthropic' }, async () => {
    const providers = loadProviders();
    assert.deepEqual(providers.getProviderChain(), []);
  }));

test('timeout/AbortError es reintentable', () =>
  withEnv({ GEMINI_API_KEY3: 'k' }, async () => {
    const providers = loadProviders();
    let calls = 0;
    global.fetch = async () => {
      calls += 1;
      if (calls === 1) {
        const err = new Error('The operation was aborted');
        err.name = 'AbortError';
        throw err;
      }
      return jsonResponse(200, geminiOkBody('Recuperado tras timeout.'));
    };
    const reply = await providers.getProviderChain()[0].generate('system', [
      { role: 'user', content: 'hola' },
    ]);
    assert.equal(reply, 'Recuperado tras timeout.');
    assert.equal(calls, 2);
  }));

test('deadline externo (outerSignal) aborta y detiene los reintentos', () =>
  withEnv({ GEMINI_API_KEY3: 'k' }, async () => {
    const providers = loadProviders();
    const outer = new AbortController();
    let calls = 0;
    global.fetch = async (url, opts) => {
      calls += 1;
      outer.abort(); // el deadline global salta durante el primer intento
      return jsonResponse(503, { error: { code: 503 } });
    };
    await assert.rejects(() =>
      providers.getProviderChain()[0].generate('system', [{ role: 'user', content: 'hola' }], {
        outerSignal: outer.signal,
      })
    );
    assert.equal(calls, 1); // no reintenta tras el deadline
  }));

test('Anthropic: respuesta vacía incluye el stop_reason', () =>
  withEnv({ ANTHROPIC_API_KEY: 'a', GEMINI_API_KEY3: '' }, async () => {
    const providers = loadProviders();
    global.fetch = async () => jsonResponse(200, { content: [], stop_reason: 'max_tokens' });
    await assert.rejects(
      () => providers.getProviderChain()[0].generate('system', [{ role: 'user', content: 'hola' }], { maxAttempts: 1 }),
      /max_tokens/
    );
  }));

test('Anthropic 529 (sobrecarga) es reintentable', () =>
  withEnv({ ANTHROPIC_API_KEY: 'a', GEMINI_API_KEY3: '' }, async () => {
    const providers = loadProviders();
    let calls = 0;
    global.fetch = async () => {
      calls += 1;
      if (calls === 1) return jsonResponse(529, { error: { type: 'overloaded_error' } });
      return jsonResponse(200, { content: [{ type: 'text', text: 'Recuperado.' }] });
    };
    const reply = await providers.getProviderChain()[0].generate('system', [
      { role: 'user', content: 'hola' },
    ]);
    assert.equal(reply, 'Recuperado.');
    assert.equal(calls, 2);
  }));

test('isRetryableError clasifica correctamente los casos límite', () => {
  const providers = loadProviders();
  assert.equal(providers.isRetryableError(new Error('Gemini API respondió con estado 503: ...')), true);
  assert.equal(providers.isRetryableError(new Error('Gemini API respondió con estado 429: ...')), true);
  assert.equal(providers.isRetryableError(new Error('Gemini API respondió con estado 400: ...')), false);
  assert.equal(providers.isRetryableError(new Error('Gemini API respondió con estado 401: ...')), false);
  assert.equal(providers.isRetryableError(new Error('fetch failed')), true);
  const abortErr = new Error('aborted');
  abortErr.name = 'AbortError';
  assert.equal(providers.isRetryableError(abortErr), true);
  assert.equal(providers.isRetryableError(new Error('algo raro sin patrón conocido')), false);
});
