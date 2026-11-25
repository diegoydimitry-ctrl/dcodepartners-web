#!/usr/bin/env node
/*
 * LA SECCIÓN COMERCIAL, PROBADA COMO SE USA.
 *
 * Tres cosas, y las tres nacieron de un riesgo concreto:
 *
 *  1. QUE LA WEB DIGA DOS PRECIOS PARA LO MISMO. Es lo que vino a arreglar
 *     esta ronda, así que se comprueba: fuera de /precios, ninguna página
 *     pública puede llevar una cifra en euros que no venga de data-precio
 *     (los «desde») o de la demo de Finance, que son datos inventados de una
 *     empresa ficticia.
 *  2. QUE EL CATÁLOGO Y LA PÁGINA SE SEPAREN. Cada producto y cada pack de
 *     catalogo.json tiene que estar en la página, con su precio y su estado,
 *     y su botón tiene que llevar a un sitio que existe.
 *  3. (RETIRADO el 25/11/2026) El configurador de cinco pasos y los chips de
 *     filtro ya no existen en /precios: la página de hoy son tarjetas. Probar
 *     lo que no existe no es una prueba. Ver la nota del bloque 2.
 *
 * Uso: node scripts/qa-precios.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from './qa/servidor.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'catalogo.json'), 'utf8'));
const fallos = [];

/* ══════════ 1 · NINGUNA CIFRA COMERCIAL SUELTA FUERA DE /precios ══════════ */
{
  const paginas = execSync('git ls-files "*.html"', { cwd: RAIZ }).toString().split('\n').filter(Boolean)
    .filter((f) => !/^(en\/)?precios\.html$/.test(f));
  /* Lo que sí puede llevar cifras y no son precios nuestros:

     · data-dx        — la calculadora del diagnóstico. Los 18/25/35/50 € son
                        el coste de UNA HORA DE TU GENTE, que lo pone quien
                        entra; no es una tarifa de D-Code.
     · data-os-datos  — los datos de la demo de D-Code OS, inventados.
     · data-demo-panel — la cifra que flota junto a la pantalla de Finance
                        en la portada. Es el mismo dato ficticio que ya sale
                        DENTRO de la captura; que aquí sea texto y no píxeles
                        no lo convierte en un precio.
     · data-vista      — las secciones de las demos que se recorren en
                        /que-hacemos y /servicios/paginas-web: el panel del
                        taller («Correa de distribución · 540 €») es el
                        presupuesto de un taller inventado, no una tarifa
                        nuestra. Marca comprobada: sale SIEMPRE en una
                        <section> de demo, en los cuatro ficheros que la usan.
     · tabla--registros — el extracto bancario de ejemplo de
                        /sistema-financiero: movimientos de una empresa
                        ficticia. Solo aparece en esa página y su versión
                        inglesa.
     · <template>      — por definición del estándar, lo que hay dentro NO es
                        contenido de la página: es un molde que el JavaScript
                        clona para una demo. Ahí viven la lista de
                        tratamientos de una clínica dental inventada
                        («Blanqueamiento 290 €») y el panel de un taller. Un
                        precio de D-Code nunca estaría dentro de un molde.
     · la demo de Finance (empresa ficticia) y lo que escribe build:precios.

     Los dos primeros no se reconocen por la línea suelta —«<span>18 €»no
     dice de dónde sale—, así que se borra la REGIÓN entera equilibrando su
     etiqueta antes de mirar. Si mañana alguien mete un precio de verdad ahí
     dentro, se le escapa a esto: por eso son dos marcas concretas y no un
     comodín. */
  const sinZonas = (h) => {
    // Los <template> primero: lo de dentro no es contenido de la página.
    let s = h.replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, (b) => ' '.repeat(b.length));
    for (const marca of ['data-dx', 'data-os-datos', 'data-demo-panel', 'data-vista', 'tabla--registros']) {
      for (;;) {
        const re = new RegExp('<([a-z]+)\\b[^>]*\\b' + marca + '\\b[^>]*>');
        const m = re.exec(s);
        if (!m) break;
        const tag = m[1];
        const tras = new RegExp('<(/?)' + tag + '\\b', 'g');
        tras.lastIndex = m.index + m[0].length;
        let hondo = 1, fin = s.length, x;
        while ((x = tras.exec(s))) {
          hondo += x[1] ? -1 : 1;
          if (hondo === 0) { fin = x.index + x[0].length + s.slice(x.index).indexOf('>') + 1; break; }
        }
        s = s.slice(0, m.index) + ' '.repeat(fin - m.index) + s.slice(fin);
      }
    }
    return s;
  };
  const permitido = /conc-mov-i|fdemo|dx-tarifa|data-precio|sd-|demo|ejemplo/i;

  /*
    LOS METADATOS NO SE PROHÍBEN: SE COMPRUEBAN.

    Un precio en la descripción que lee Google es BUENO —contesta «cuánto
    cuesta» en el propio resultado de búsqueda—, así que prohibirlo sería
    perder algo que vende. Lo que no puede pasar es que sea otro precio.

    Desde el 25/11 esas descripciones se generan leyendo catalogo.json
    (scripts/seo/datos.mjs), así que aquí basta con exigir que toda cifra que
    aparezca en un metadato sea una cifra DEL CATÁLOGO. Si alguien vuelve a
    escribirla a mano y el catálogo cambia, esto lo canta.

    Nació de un caso real: la descripción de /servicios/automatizaciones
    anunciaba «Desde 390 €» —el precio de implantación de antes del cambio a
    cuotas bajas— mientras el catálogo decía 29 €/mes. Lo veía todo el que
    llegaba desde Google; nadie lo veía desde dentro de la web.
  */
  const esMetadato = /^<(meta|title|script[^>]*ld\+json)/i;
  const cifrasDelCatalogo = new Set();
  for (const p of [...CAT.productos, ...CAT.packs]) {
    for (const lang of ['es', 'en']) {
      for (const campo of ['precio', 'precio_mes', 'precio_detalle', 'precio_mes_detalle', 'suelto', 'ahorro']) {
        for (const n of String(p[lang]?.[campo] ?? '').match(/\d[\d.,]*/g) || []) cifrasDelCatalogo.add(n.replace(/[.,]$/, ''));
      }
    }
  }
  for (const f of paginas) {
    const h = sinZonas(fs.readFileSync(path.join(RAIZ, f), 'utf8'));
    for (const linea of h.split(/(?=<)/)) {
      /*
        LAS DOS FORMAS DE ESCRIBIR UN PRECIO. El patrón original solo
        reconocía «390 €», la forma española. Las páginas en inglés escriben
        «€390», con el símbolo delante, así que esta comprobación llevaba
        ciega a TODOS los precios de /en: cinco «€390» incluidos. Un guardia
        que solo mira la mitad de la casa no es medio guardia, es ninguno.
      */
      const m = linea.match(/(?:\d[\d.,]*\s*(?:&#8364;|€)(?!\w))|(?:(?:&#8364;|€)\s*\d[\d.,]*)/);
      if (!m) continue;
      if (permitido.test(linea)) continue;
      if (esMetadato.test(linea.trim())) {
        for (const n of linea.match(/\d[\d.,]*(?=\s*(?:&#8364;|€))|(?<=(?:&#8364;|€)\s*)\d[\d.,]*/g) || []) {
          const limpio = n.replace(/[.,]$/, '');
          if (!cifrasDelCatalogo.has(limpio)) {
            fallos.push(`${f}: el metadato anuncia ${limpio} €, que no es ningún precio de catalogo.json — ${linea.replace(/\s+/g, ' ').slice(0, 100)}`);
          }
        }
        continue;
      }
      fallos.push(`${f}: cifra comercial suelta «${m[0]}» fuera de /precios — ${linea.replace(/\s+/g, ' ').slice(0, 90)}`);
    }
  }
}

/* ══════════ 2 · EL CATÁLOGO Y LA PÁGINA, EN EL NAVEGADOR ══════════
 *
 * POR QUÉ ESTE BLOQUE ESTÁ REESCRITO (25/11/2026).
 *
 * Esta guardia llevaba rota desde el rediseño de /precios y nadie lo sabía,
 * porque fallaba de la peor manera posible: NO avisando. Buscaba `.pr-chip`
 * —los filtros del configurador de la versión anterior— y, al no
 * encontrarlos, el script MORÍA con una excepción en vez de contar sus
 * fallos. Las comprobaciones 1 y 2 sí se ejecutaban, pero sus resultados no
 * llegaban nunca a imprimirse. Resultado: la única guardia que impide que la
 * web diga dos precios distintos para lo mismo llevaba meses sin mirar nada,
 * y `npm run qa:precios` parecía una tarea rota, no una alarma.
 *
 * El configurador de cinco pasos y los chips de filtro YA NO EXISTEN: la
 * página de hoy son tarjetas `article.prod`. Probar lo que no existe no es
 * una prueba, así que esa parte se retira en vez de remendarse.
 *
 * Lo que sí se comprueba, y ahora más fuerte que antes: antes bastaba con
 * que un botón llevara «al contacto»; ahora se exige que lleve AL SUYO. Un
 * botón de «Finance Profesional» que abriera el contacto pidiendo otra cosa
 * pasaba la prueba vieja.
 */
const APARATOS = [
  ['PC 1440',   { viewport: { width: 1440, height: 940 }, deviceScaleFactor: 1 }],
  ['iPad',      { viewport: { width: 1024, height: 1200 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ['Móvil 393', { viewport: { width: 393, height: 850 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }],
];
const PORT = 9720;
await levanta(PORT);
const br = await chromium.launch(opcionesNavegador());
let pasos = 0;

const ESPERADOS = [...CAT.productos.map((x) => x.id), ...CAT.packs.map((x) => x.id)];

for (const [aparato, op] of APARATOS) {
  for (const lang of ['es', 'en']) {
    const base = lang === 'en' ? '/en' : '';
    const ctx = await br.newContext(op);
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    const pg = await ctx.newPage();
    const errores = [];
    pg.on('pageerror', (e) => errores.push(String(e).slice(0, 120)));

    await pg.goto(`http://127.0.0.1:${PORT}${base}/precios`, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(400);
    const donde = `${aparato} · ${lang}`;

    const vista = await pg.evaluate(() => ({
      ids: [...document.querySelectorAll('article.prod')].map((a) => a.dataset.id),
      sinEstado: [...document.querySelectorAll('article.prod')]
        .filter((a) => !(a.querySelector('.prod-estado')?.textContent || '').trim())
        .map((a) => a.dataset.id),
      sinPrecio: [...document.querySelectorAll('article.prod')]
        .filter((a) => !(a.querySelector('.prod-precio')?.textContent || '').trim())
        .map((a) => a.dataset.id),
      // Cada botón, con la ficha desde la que se pulsa: así se ve si uno
      // pide un producto que no es el suyo.
      botones: [...document.querySelectorAll('article.prod')].map((a) => ({
        id: a.dataset.id,
        href: a.querySelector('.prod-acc a')?.getAttribute('href') || null,
      })),
      desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      // El menú es `.nav` desde el rediseño; `.main-nav` era el de antes y
      // hacía que esta comprobación cantara un fallo que no existía.
      aqui: [...document.querySelectorAll('.nav a[aria-current="page"]')].map((a) => a.getAttribute('href')),
    }));

    /* Todo lo del catálogo está en la página, y nada que no esté en el catálogo. */
    for (const id of ESPERADOS) {
      if (!vista.ids.includes(id)) fallos.push(`${donde}: «${id}» está en catalogo.json y no en la página`);
    }
    for (const id of vista.ids) {
      if (!ESPERADOS.includes(id)) fallos.push(`${donde}: la página enseña «${id}», que no está en catalogo.json`);
    }
    for (const id of vista.sinEstado) fallos.push(`${donde}: «${id}» no dice su estado`);
    for (const id of vista.sinPrecio) fallos.push(`${donde}: «${id}» no dice su precio`);

    /* Cada botón pide SU producto. */
    for (const b of vista.botones) {
      if (!b.href) { fallos.push(`${donde}: «${b.id}» no tiene botón`); continue; }
      const esperado = `producto=${b.id}`;
      if (!b.href.includes('/contacto')) fallos.push(`${donde}: el botón de «${b.id}» no lleva al contacto (${b.href})`);
      else if (!b.href.includes(esperado)) fallos.push(`${donde}: el botón de «${b.id}» pide otra cosa (${b.href})`);
      if (lang === 'en' && !b.href.startsWith('/en/')) fallos.push(`${donde}: el botón de «${b.id}» se sale del inglés (${b.href})`);
    }

    if (vista.desborde > 1) fallos.push(`${donde}: /precios desborda ${vista.desborde} px a lo ancho`);

    /* El menú tiene que decir que estás en Precios. La cáscara sale de
       Servicios y traía su «estás aquí» puesto: el lector de pantalla
       anunciaba la página equivocada. */
    if (vista.aqui.length !== 1 || !/\/precios$/.test(vista.aqui[0] || '')) {
      fallos.push(`${donde}: el menú marca como página actual ${vista.aqui.join(', ') || '(ninguna)'} en vez de /precios`);
    }

    /* Donde el generador pega una etiqueta a un dato, el dato no puede traer
       la etiqueta dentro: «Por separado 1.170 € sueltos» salía de eso. Se
       mira solo ahí, no en la prosa, donde repetir una palabra es legítimo. */
    const repes = await pg.evaluate(() => {
      const raiz = (w) => w.toLowerCase().replace(/[.,;:·()€$]/g, '').replace(/s$/, '');
      const malo = [];
      for (const el of document.querySelectorAll('.prod-precio .peq')) {
        const cuenta = {};
        for (const w of el.textContent.split(/\s+/).map(raiz).filter((w) => w.length > 4)) {
          cuenta[w] = (cuenta[w] || 0) + 1;
          if (cuenta[w] > 1) malo.push(`«${el.textContent.trim().slice(0, 60)}» repite «${w}»`);
        }
      }
      return [...new Set(malo)];
    });
    if (repes.length) fallos.push(`${donde}: ${repes.join(' | ')}`);

    const graves = errores.filter((e) => !/net::ERR|turnstile|cal\.com/i.test(e));
    if (graves.length) fallos.push(`${donde}: error de JavaScript — ${graves[0]}`);

    pasos++;
    await ctx.close();
  }
}
await br.close();

if (fallos.length) {
  console.error(fallos.map((f) => '✗ ' + f).join('\n'));
  console.error(`\n${fallos.length} problema(s).`);
  process.exit(1);
}
console.log(`✓ qa:precios — ${ESPERADOS.length} productos y packs comprobados en ${APARATOS.length} aparatos × 2 idiomas (${pasos} recorridos), cada botón pidiendo lo suyo; ninguna cifra comercial suelta fuera de /precios`);
process.exit(0);
