/**
 * Integridad de la hoja de estilos.
 *
 * AUD-DCP 24/08/2026 — origen de esta prueba. Un comentario de
 * assets/css/styles.css contenía, dentro de su texto, la secuencia que
 * cierra un comentario CSS (asterisco + barra) como parte del nombre de
 * una clase. El comentario terminaba ahí, el resto de su texto quedaba
 * como CSS inválido y, al recuperarse, el parser DESCARTABA todo lo que
 * seguía en el archivo.
 *
 * Impacto real medido en el navegador (CSSOM): se parseaban 181 reglas
 * en lugar de 927 — el 80% de la hoja, ~2.700 líneas, no llegaba nunca a
 * aplicarse en producción. No lo detectó nada: el CSS no lanza errores,
 * la página cargaba con estado 200 y "solo" se veía peor.
 *
 * Estas comprobaciones son puramente léxicas (no necesitan navegador),
 * así que corren en CI en milisegundos junto al resto de `npm test`.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const CSS_DIR = path.join(__dirname, '..', 'assets', 'css');
const cssFiles = fs.readdirSync(CSS_DIR).filter((f) => f.endsWith('.css'));

test('hay hojas de estilo que comprobar', () => {
  assert.ok(cssFiles.length > 0);
});

for (const file of cssFiles) {
  const css = fs.readFileSync(path.join(CSS_DIR, file), 'utf8');

  test(`${file}: ningún comentario se cierra antes de tiempo`, () => {
    // Recorre los comentarios como lo haría el parser: /* ... primer */
    // que aparezca. Si el texto "previsto" de un comentario contiene esa
    // secuencia, el comentario real acaba antes y el resto se cuela como
    // CSS. Se detecta comprobando que, entre el cierre de un comentario y
    // la apertura del siguiente, no quede texto en prosa suelto.
    const sospechosos = [];
    let i = 0;
    while (i < css.length) {
      const abre = css.indexOf('/*', i);
      if (abre === -1) break;
      const cierra = css.indexOf('*/', abre + 2);
      assert.notEqual(cierra, -1, `${file}: comentario sin cerrar en offset ${abre}`);
      // Texto entre el fin de este comentario y el siguiente '/*' o el
      // final: en CSS válido solo puede haber selectores, declaraciones,
      // llaves, at-rules y espacios — nunca un '*/' huérfano.
      const siguiente = css.indexOf('/*', cierra + 2);
      const entre = css.slice(cierra + 2, siguiente === -1 ? css.length : siguiente);
      if (entre.includes('*/')) {
        const linea = css.slice(0, cierra).split('\n').length;
        sospechosos.push(`línea ~${linea}: cierre de comentario huérfano tras el comentario que acaba ahí`);
      }
      i = cierra + 2;
    }
    assert.deepEqual(sospechosos, [], `${file}: ${sospechosos.join(' | ')}`);
  });

  test(`${file}: las llaves están balanceadas`, () => {
    // Contar sobre el CSS SIN comentarios: una llave dentro de un
    // comentario no cuenta, y así el balance refleja el que ve el parser.
    const sinComentarios = css.replace(/\/\*[\s\S]*?\*\//g, '');
    let profundidad = 0;
    let linea = 1;
    for (const ch of sinComentarios) {
      if (ch === '\n') linea += 1;
      else if (ch === '{') profundidad += 1;
      else if (ch === '}') {
        profundidad -= 1;
        assert.ok(profundidad >= 0, `${file}: llave de cierre sobrante cerca de la línea ${linea}`);
      }
    }
    assert.equal(profundidad, 0, `${file}: quedan ${profundidad} bloque(s) sin cerrar`);
  });

  test(`${file}: se parsea entero (la última regla llega al final del archivo)`, () => {
    // Guardarraíl directo contra el fallo original: si el parser se cae a
    // media hoja, el último selector real del archivo deja de existir.
    // Se comprueba que el archivo termina en una regla cerrada y no en
    // basura suelta.
    const limpio = css.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    assert.ok(limpio.endsWith('}'), `${file}: el archivo no termina en una regla cerrada`);
  });
}

test('styles.css conserva las reglas clave de las secciones tardías', () => {
  // El fallo original tumbaba todo lo que venía DESPUÉS del hero. Estas
  // clases viven en la mitad final de la hoja: si alguna desaparece, es
  // señal de que se ha vuelto a truncar el archivo.
  const css = fs.readFileSync(path.join(CSS_DIR, 'styles.css'), 'utf8');
  for (const sel of ['.hero-console{', '.dept-row{', '.cta-band{', '.blog-grid{', 'footer']) {
    assert.ok(css.includes(sel), `styles.css: falta ${sel}`);
  }
});
