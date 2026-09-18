#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════════════
 * LA DEMO DE FINANCE, MONTADA ENTERA O NO MONTADA
 * ══════════════════════════════════════════════════════════════════════════
 *
 * EL DEFECTO QUE ESTE CENTINELA NO HABRÍA DEJADO PASAR. Al montar la demo en
 * la portada se puso el `data-fdemo-mount` y se pidieron sus dos scripts,
 * pero se olvidó el contenedor `.fdemo-scope`. Ahí es donde están declarados
 * los veintitantos tokens de color de la demo (`--dc-bg`, `--dc-surface`,
 * `--dc-text`…). Sin ese contenedor, cada `var(--dc-…)` queda sin valor, la
 * declaración entera se descarta y el resultado es una aplicación con fondo
 * TRANSPARENTE: las tarjetas de importes dejaban ver el lienzo animado de la
 * portada por detrás.
 *
 * Lo grave no es el fallo, es su forma: cero errores en consola, cero
 * peticiones fallidas, los nueve módulos navegando bien y las cifras
 * correctas. Los cuatro centinelas que ya había —enlaces, base de
 * conocimiento, consentimiento, superficie— daban verde. Solo se vio al
 * mirar una captura.
 *
 * QUÉ SE COMPRUEBA, PÁGINA POR PÁGINA
 *
 *   1. Todo `data-fdemo-mount` está dentro de un elemento con `fdemo-scope`.
 *      Es la condición que faltaba.
 *   2. Toda página que monta la demo tiene sus tres ficheros: la hoja y los
 *      dos scripts, ya sea en etiquetas fijas o declarados para el cargador
 *      diferido (`data-fdemo-css` / `data-fdemo-js`).
 *   3. El idioma casa: una página bajo /en/ pide los ficheros `.en.js`, y una
 *      página en español NO los pide. Montar el motor inglés sobre datos
 *      españoles no rompe nada visible — enseña la interfaz en el idioma
 *      equivocado, que es peor.
 *   4. El orden importa: los datos antes que el motor. `finance-demo.js`
 *      empieza con `var FS = window.FinanceStore; if (!FS) return;`, así que
 *      al revés no monta nada y tampoco avisa.
 *   5. Nadie pide los ficheros de la demo sin usarlos. Eran 96 KB que
 *      /departamentos/finanzas descargaba en las dos lenguas para nada: la
 *      hoja, los datos y el motor, y ni un solo `data-fdemo-mount` en la
 *      página. La puerta de /sistema-financiero/demo sí puede pedir la hoja
 *      sola —viste su propia tarjeta con clases `fdemo-`— pero no los
 *      scripts, que sin montaje no hacen nada.
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const paginas = execFileSync('git', ['-C', RAIZ, 'ls-files', '*.html'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const problemas = [];
let montajes = 0;

for (const relativa of paginas) {
  const html = readFileSync(path.join(RAIZ, relativa), 'utf8');
  const fallo = (que) => problemas.push(`${relativa}: ${que}`);

  const monta = html.includes('data-fdemo-mount');
  const pideScripts = /finance-demo(?:-data)?(?:\.en)?\.js/.test(html);
  const pideHoja = /finance-demo\.css/.test(html);
  // Clases de la demo usadas por la propia página (la puerta, por ejemplo).
  const usaClases = /class="[^"]*\bfdemo-[a-z-]/.test(html);

  if (!monta) {
    // 5 · nadie carga la demo sin usarla
    if (pideScripts) fallo('pide los scripts de la demo pero no la monta: ~68 KB que no ejecutan nada');
    if (pideHoja && !usaClases) fallo('pide la hoja de la demo sin usar ni una de sus clases: 28 KB de CSS muerto');
    continue;
  }
  montajes++;

  // 1 · el contenedor de tokens
  const iMonta = html.indexOf('data-fdemo-mount');
  const antes = html.slice(0, iMonta);
  // El ámbito tiene que ABRIRSE antes del montaje y no haberse cerrado: no se
  // puede resolver el DOM aquí, así que basta con que la clase aparezca antes.
  // Es suficiente porque la clase solo se usa para envolver la demo.
  if (!/class="[^"]*\bfdemo-scope\b/.test(antes)) {
    fallo('el montaje no está dentro de un .fdemo-scope: los tokens de color quedan sin valor y la demo se pinta transparente');
  }

  // 2 · los tres ficheros
  const en = relativa === 'en/index.html' || relativa.startsWith('en/');
  const sufijo = en ? '.en' : '';
  const necesarios = [
    'finance-demo.css',
    `finance-demo-data${sufijo}.js`,
    `finance-demo${sufijo}.js`,
  ];
  for (const f of necesarios) {
    // (?<![\w-]) para que "finance-demo.js" no case dentro de "finance-demo-data.js"
    const re = new RegExp('(?<![\\w-])' + f.replace(/\./g, '\\.'));
    if (!re.test(html)) fallo(`monta la demo pero no carga ${f}`);
  }

  // 3 · el idioma correcto y solo ese
  const contrario = en
    ? ['(?<![\\w-])finance-demo-data\\.js', '(?<![\\w-])finance-demo\\.js']
    : ['finance-demo-data\\.en\\.js', 'finance-demo\\.en\\.js'];
  for (const patron of contrario) {
    if (new RegExp(patron).test(html)) {
      fallo(`carga el fichero del otro idioma (${patron.replace(/\\/g, '')}): la demo saldría en el idioma equivocado`);
    }
  }

  // 4 · datos antes que motor
  const iDatos = html.search(new RegExp(`(?<![\\w-])finance-demo-data${sufijo.replace('.', '\\.')}\\.js`));
  const iMotor = html.search(new RegExp(`(?<![\\w-])finance-demo${sufijo.replace('.', '\\.')}\\.js`));
  if (iDatos > -1 && iMotor > -1 && iDatos > iMotor) {
    fallo('el motor se pide antes que los datos: sin window.FinanceStore sale por su guarda y no monta nada');
  }
}

/* Contar cero montajes significaría que el detector está roto, no que todo
   esté bien: sin esto, renombrar el atributo dejaría el centinela en verde. */
if (montajes === 0) {
  console.error('\n✗ no se ha encontrado ni un solo montaje de la demo: el verificador está roto, no limpio\n');
  process.exit(1);
}

if (problemas.length) {
  console.error(`\n✗ ${problemas.length} problema(s) en el montaje de la demo de D-Code Finance:\n`);
  for (const p of problemas) console.error(`  · ${p}`);
  console.error('');
  process.exit(1);
}

console.log(`Demo de D-Code Finance: ${montajes} montajes en ${paginas.length} páginas, todos con su ámbito de tokens, sus tres ficheros y en su idioma.`);
console.log('✓ Ninguna página carga los 96 KB de la demo sin montarla.');
