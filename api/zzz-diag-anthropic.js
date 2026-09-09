/**
 * TEMPORAL — diagnóstico puntual y aislado del proveedor Anthropic.
 * AUD-DCP 09/09/2026. Se añade, se usa una vez (con evidencia real de que
 * Anthropic responde en este entorno) y se borra en el commit siguiente.
 * No lo referencia ninguna página ni el frontend: exige un parámetro exacto
 * para responder, así que no es alcanzable por un visitante real que no
 * conozca esta URL. Llama directamente a anthropicProvider.stream() sin
 * pasar por Gemini ni por /api/chat, para poder demostrar con una petición
 * real que Anthropic entrega contenido — sin necesitar ni revelar nunca el
 * valor de ninguna clave.
 */
const { anthropicProvider, HAS_KEY } = require('../lib/providers');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST' || req.query.t !== 'zzz-anthropic-diag-09') {
    res.status(404).end('Not found');
    return;
  }

  const tieneClave = HAS_KEY.anthropic();
  const inicio = Date.now();

  try {
    const iterator = anthropicProvider.stream(
      'Eres un test de diagnóstico interno. Responde EXACTAMENTE y solo con: ANTHROPIC_OK',
      [{ role: 'user', content: 'test de diagnostico' }]
    );

    const primero = await iterator.next();
    const ttfbMs = Date.now() - inicio;
    if (primero.done || !primero.value) {
      res.status(200).json({ tieneClave, ok: false, motivo: 'sin contenido en el primer fragmento', ttfbMs });
      return;
    }

    let full = primero.value;
    for (;;) {
      const siguiente = await iterator.next();
      if (siguiente.done) break;
      full += siguiente.value;
    }

    res.status(200).json({ tieneClave, ok: true, ttfbMs, totalMs: Date.now() - inicio, respuesta: full });
  } catch (err) {
    res.status(200).json({
      tieneClave,
      ok: false,
      totalMs: Date.now() - inicio,
      error: String((err && err.message) || err).slice(0, 300),
    });
  }
};
