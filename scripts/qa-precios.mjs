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
 *  3. QUE EL CONFIGURADOR NO SIRVA PARA NADA. Se recorre entero —tarjetas,
 *     chips, los cinco pasos— en ES y EN, con ratón y con dedo, y se
 *     comprueba que sale la estimación, que la horquilla tiene sentido y que
 *     al enviarla el formulario de contacto queda relleno.
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
     · la demo de Finance (empresa ficticia) y lo que escribe build:precios.

     Los dos primeros no se reconocen por la línea suelta —«<span>18 €»no
     dice de dónde sale—, así que se borra la REGIÓN entera equilibrando su
     etiqueta antes de mirar. Si mañana alguien mete un precio de verdad ahí
     dentro, se le escapa a esto: por eso son dos marcas concretas y no un
     comodín. */
  const sinZonas = (h) => {
    let s = h;
    for (const marca of ['data-dx', 'data-os-datos', 'data-demo-panel']) {
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
  for (const f of paginas) {
    const h = sinZonas(fs.readFileSync(path.join(RAIZ, f), 'utf8'));
    for (const linea of h.split(/(?=<)/)) {
      const m = linea.match(/(\d[\d.]*)\s*(?:&#8364;|€)(?!\w)/);
      if (!m) continue;
      if (permitido.test(linea)) continue;
      fallos.push(`${f}: cifra comercial suelta «${m[0]}» fuera de /precios — ${linea.replace(/\s+/g, ' ').slice(0, 90)}`);
    }
  }
}

/* ══════════ 2 y 3 · LA PÁGINA Y EL CONFIGURADOR, EN EL NAVEGADOR ══════════ */
const APARATOS = [
  ['PC 1440',   { viewport: { width: 1440, height: 940 }, deviceScaleFactor: 1 }],
  ['iPad',      { viewport: { width: 1024, height: 1200 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ['Móvil 393', { viewport: { width: 393, height: 850 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }],
];
const PORT = 9720;
await levanta(PORT);
const br = await chromium.launch(opcionesNavegador());
let pasos = 0;

for (const [aparato, op] of APARATOS) {
  for (const lang of ['es', 'en']) {
    const base = lang === 'en' ? '/en' : '';
    const ctx = await br.newContext(op);
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    const pg = await ctx.newPage();
    const errores = [];
    pg.on('pageerror', (e) => errores.push(String(e).slice(0, 120)));

    /* ---- la página de precios ---- */
    await pg.goto(`http://127.0.0.1:${PORT}${base}/precios`, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(500);
    const donde = `${aparato} · ${lang}`;

    const vista = await pg.evaluate(() => ({
      fichas: document.querySelectorAll('.pr-card:not(.pr-pack)').length,
      packs: document.querySelectorAll('.pr-pack').length,
      desborde: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      estados: [...document.querySelectorAll('.pr-estado')].map((e) => e.textContent.trim()).filter(Boolean).length,
      ctas: [...document.querySelectorAll('.pr-cta')].map((a) => a.getAttribute('href')),
    }));
    if (vista.fichas !== CAT.productos.length) fallos.push(`${donde}: hay ${vista.fichas} fichas y el catálogo tiene ${CAT.productos.length}`);
    if (vista.packs !== CAT.packs.length) fallos.push(`${donde}: hay ${vista.packs} packs y el catálogo tiene ${CAT.packs.length}`);
    if (vista.desborde) fallos.push(`${donde}: /precios desborda a lo ancho`);
    if (vista.estados !== CAT.productos.length + CAT.packs.length) fallos.push(`${donde}: falta el estado en alguna ficha`);
    for (const href of vista.ctas) {
      if (!href || !href.includes('/contacto?quiero=')) fallos.push(`${donde}: un botón no lleva al contacto (${href})`);
    }

    /* Donde el generador pega una etiqueta a un dato, el dato no puede
       traer la etiqueta dentro: «Suelto sería 1.170 € sueltos» salía de
       eso. Se mira solo ahí —etiqueta + dato—, no en la prosa, donde
       repetir una palabra puede ser legítimo. Singular y plural cuentan
       como la misma palabra, que es justo el caso que se escapó. */
    const repes = await pg.evaluate(() => {
      const raiz = (w) => w.toLowerCase().replace(/[.,;:·()€$]/g, '').replace(/s$/, '');
      const malo = [];
      for (const el of document.querySelectorAll('.pr-ahorro i, .pr-ahorro b, .pr-precio i')) {
        const cuenta = {};
        for (const w of el.textContent.split(/\s+/).map(raiz).filter((w) => w.length > 4)) {
          cuenta[w] = (cuenta[w] || 0) + 1;
          if (cuenta[w] > 1) malo.push(`«${el.textContent.trim().slice(0, 60)}» repite «${w}»`);
        }
      }
      return [...new Set(malo)];
    });
    if (repes.length) fallos.push(`${donde}: ${repes.join(' | ')}`);

    /* El menú tiene que decir que estás en Precios. La cáscara sale de
       Servicios y traía su «estás aquí» puesto: el lector de pantalla
       anunciaba la página equivocada. */
    const aqui = await pg.evaluate(() => [...document.querySelectorAll('.main-nav a[aria-current="page"]')].map((a) => a.getAttribute('href')));
    if (aqui.length !== 1 || !/\/precios$/.test(aqui[0] || '')) {
      fallos.push(`${donde}: el menú marca como página actual ${aqui.join(', ') || '(ninguna)'} en vez de /precios`);
    }

    /* Filtrar por una categoría deja solo esa; volver a pulsar lo deshace. */
    await pg.click('.pr-chip[data-val="agentes"]');
    await pg.waitForTimeout(220);
    const filtrado = await pg.evaluate(() => ({
      visibles: [...document.querySelectorAll('.pr-grupo .pr-card')].filter((c) => !c.hidden).length,
      cats: [...new Set([...document.querySelectorAll('.pr-grupo .pr-card')].filter((c) => !c.hidden).map((c) => c.dataset.cat))],
      url: location.search,
    }));
    const nAgentes = CAT.productos.filter((p) => p.cat === 'agentes').length;
    if (filtrado.visibles !== nAgentes) fallos.push(`${donde}: al filtrar agentes quedan ${filtrado.visibles} y tendrían que ser ${nAgentes}`);
    if (filtrado.cats.length !== 1 || filtrado.cats[0] !== 'agentes') fallos.push(`${donde}: el filtro deja fichas de otras categorías (${filtrado.cats})`);
    if (!filtrado.url.includes('cat=agentes')) fallos.push(`${donde}: el filtro no se guarda en la URL`);
    await pg.click('.pr-chip[data-val="agentes"]');
    await pg.waitForTimeout(200);
    const sinFiltro = await pg.evaluate(() => [...document.querySelectorAll('.pr-grupo .pr-card')].filter((c) => !c.hidden).length);
    if (sinFiltro !== CAT.productos.length) fallos.push(`${donde}: al quitar el filtro no vuelven todas (${sinFiltro})`);
    pasos++;

    /* ---- el configurador ---- */
    await pg.goto(`http://127.0.0.1:${PORT}${base}/contacto`, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(600);
    const hay = await pg.evaluate(() => !!document.querySelector('#configurador .cfg-op'));
    if (!hay) { fallos.push(`${donde}: el configurador no se monta`); await ctx.close(); continue; }

    /* Antes de empezar: el formulario de contacto NO está a la vista. Pedir
       los datos antes de saber qué quiere nadie es lo que esta ronda vino a
       quitar. Y tiene que estar escondido por el guion, no por la hoja: si el
       guion no corre, el formulario se queda visible y funcionando. */
    const antes = await pg.evaluate(() => ({
      escondido: !!document.querySelector('.form-card.es-espera'),
      pasos: document.querySelectorAll('#contact-form > .form-step').length,
      puntos: document.querySelectorAll('.form-progress-dot').length,
      extra: !!document.querySelector('.form-extra'),
      campos: ['nombre', 'empresa', 'email', 'telefono'].every((id) => !!document.getElementById(id)),
      visibles: document.querySelectorAll('#contact-form > .form-step[data-step="1"] > .field').length,
      plegados: [...document.querySelectorAll('.form-extra [id]')].map((e) => e.id),
    }));
    if (!antes.escondido) fallos.push(`${donde}: el formulario de contacto se ve antes de configurar nada`);
    if (antes.pasos !== 2) fallos.push(`${donde}: el formulario tiene ${antes.pasos} pasos y tiene que tener 2`);
    if (antes.puntos !== antes.pasos) fallos.push(`${donde}: ${antes.puntos} puntos de progreso para ${antes.pasos} pasos`);
    if (!antes.extra) fallos.push(`${donde}: el mensaje libre no está plegado en «añadir algo más»`);
    if (!antes.campos) fallos.push(`${donde}: al formulario le faltan campos tras juntar los pasos`);
    /* Tres campos a la vista y no uno más: quién lo pide, de qué empresa y
       por dónde le escribimos. El teléfono y el mensaje, plegados. */
    if (antes.visibles !== 3) fallos.push(`${donde}: el primer paso enseña ${antes.visibles} campos y tienen que ser 3`);
    if (!antes.plegados.includes('telefono') || !antes.plegados.includes('mensaje')) {
      fallos.push(`${donde}: el teléfono y el mensaje tienen que estar plegados, y hay ${antes.plegados.join(', ') || 'nada'}`);
    }

    /* Recorrido completo: sector → objetivos → gente → piezas → adaptación */
    const elegir = async (sel, n) => { await pg.click(`#configurador ${sel} >> nth=${n}`); };
    await elegir('.cfg-op', 2);
    /* Elegir tiene que NOTARSE: el bloque tiembla y lo cruza un brillo.
       Se hace sobre un clon, porque el repintado del paso borra el botón a
       los pocos milisegundos. Se comprueba que aparece, que no ha vuelto
       nada de las figuras de antes y que no deja restos: un clon olvidado
       se queda encima del formulario y no deja pulsar. */
    const aviso = await pg.evaluate(() => {
      const c = document.querySelector('.cfg-esc');
      return { clon: !!c, tiembla: !!c && c.classList.contains('es-tiembla'),
               brillo: document.querySelectorAll('.cfg-brillo').length,
               viejo: document.querySelectorAll('.cfg-bicho, .cfg-bicho2, .cfg-pz, .cfg-pies').length };
    });
    if (!aviso.clon) fallos.push(`${donde}: al elegir no pasa nada`);
    if (!aviso.tiembla) fallos.push(`${donde}: el bloque no tiembla`);
    if (!aviso.brillo) fallos.push(`${donde}: el bloque no se enciende`);
    if (aviso.viejo) fallos.push(`${donde}: han vuelto las figuras`);
    await pg.waitForTimeout(950);
    const restos = await pg.evaluate(() => document.querySelectorAll('.cfg-esc, .cfg-brillo').length);
    if (restos) fallos.push(`${donde}: quedan ${restos} resto(s) en pantalla`);
    await pg.click('.cfg-seguir'); await pg.waitForTimeout(180);
    await elegir('.cfg-chip', 0); await elegir('.cfg-chip', 1); await pg.click('.cfg-seguir'); await pg.waitForTimeout(180);
    await elegir('.cfg-op', 1); await pg.click('.cfg-seguir'); await pg.waitForTimeout(180);
    await elegir('.cfg-op', 0); await elegir('.cfg-op', 2); await pg.click('.cfg-seguir'); await pg.waitForTimeout(180);
    await elegir('.cfg-op', 1); await pg.click('.cfg-seguir'); await pg.waitForTimeout(300);

    /* Paso 6: quién lo pregunta. Dos campos, y hasta que no estén los dos
       —con un contacto que valga— no se puede seguir. Se comprueba el
       freno antes de rellenarlos, que es lo que evita que lleguen fichas
       sin manera de contestar. */
    const datos = await pg.evaluate(() => ({
      campos: document.querySelectorAll('.cfg-input').length,
      frenado: document.querySelector('.cfg-seguir').disabled,
    }));
    if (datos.campos !== 2) fallos.push(`${donde}: el paso 6 tiene ${datos.campos} campos y tiene que tener 2`);
    if (!datos.frenado) fallos.push(`${donde}: el paso 6 deja seguir sin datos`);
    await pg.fill('.cfg-input >> nth=0', 'Vandria Hogar');
    await pg.fill('.cfg-input >> nth=1', 'mal');
    await pg.waitForTimeout(140);
    if (!(await pg.evaluate(() => document.querySelector('.cfg-seguir').disabled)))
      fallos.push(`${donde}: el paso 6 da por bueno un contacto que no lo es`);
    await pg.fill('.cfg-input >> nth=1', 'hola@vandria.es');
    await pg.waitForTimeout(140);
    await pg.click('.cfg-seguir'); await pg.waitForTimeout(400);

    const fin = await pg.evaluate(() => {
      const est = document.querySelector('.cfg-est-n b');
      const piezas = [...document.querySelectorAll('.cfg-res-l li b')].map((b) => b.textContent);
      const cifras = (est ? est.textContent : '').match(/[\d][\d.,]*/g) || [];
      return {
        estimacion: est ? est.textContent : null,
        piezas, cifras: cifras.map((c) => +c.replace(/[.,]/g, '')),
        pie: getComputedStyle(document.querySelector('.cfg-pie')).display,
        aviso: !!document.querySelector('.cfg-est-aviso'),
      };
    });
    if (!fin.estimacion) fallos.push(`${donde}: el configurador no da estimación`);
    if (fin.piezas.length !== 2) fallos.push(`${donde}: el resumen lista ${fin.piezas.length} piezas y se eligieron 2`);
    if (fin.cifras.length === 2 && !(fin.cifras[0] < fin.cifras[1])) fallos.push(`${donde}: la horquilla está del revés (${fin.cifras})`);
    if (fin.pie !== 'none') fallos.push(`${donde}: el pie de pasos sigue puesto en el resumen`);
    if (!fin.aviso) fallos.push(`${donde}: falta el aviso de «estimación inicial, no un presupuesto»`);

    await pg.click('.cfg-enviar');
    await pg.waitForTimeout(500);
    const volcado = await pg.evaluate(() => ({
      mensaje: (document.getElementById('mensaje') || {}).value || '',
      oculto: !!document.querySelector('input[name="configuracion"]'),
      aviso: !!document.getElementById('cfg-listo'),
      campos: ['nombre', 'empresa', 'email'].every((id) => !!document.getElementById(id)),
      empresa: (document.getElementById('empresa') || {}).value || '',
      email: (document.getElementById('email') || {}).value || '',
      visible: !!document.querySelector('.form-card') && !document.querySelector('.form-card.es-espera'),
    }));
    if (volcado.mensaje.length < 60) fallos.push(`${donde}: la configuración no llegó al formulario`);
    if (!volcado.oculto) fallos.push(`${donde}: falta el campo oculto con la configuración`);
    if (!volcado.aviso) fallos.push(`${donde}: no se avisa de que ya está en el formulario`);
    if (!volcado.campos) fallos.push(`${donde}: el formulario de contacto perdió sus campos`);
    if (!volcado.visible) fallos.push(`${donde}: el formulario no aparece al terminar de configurar`);
    /* Y lo escrito en el paso 6 tiene que bajar al formulario de verdad: si
       no, se le pide dos veces lo mismo, que es la manera más rápida de que
       alguien cierre la pestaña. */
    if (volcado.empresa !== 'Vandria Hogar') fallos.push(`${donde}: la empresa del paso 6 no llega al formulario («${volcado.empresa}»)`);
    if (volcado.email !== 'hola@vandria.es') fallos.push(`${donde}: el contacto del paso 6 no llega al formulario («${volcado.email}»)`);
    pasos++;

    const graves = errores.filter((e) => !/net::ERR|turnstile|cal\.com/i.test(e));
    if (graves.length) fallos.push(`${donde}: error de JavaScript — ${graves[0]}`);
    await ctx.close();
  }
}
await br.close();

if (fallos.length) {
  console.error(fallos.map((f) => '✗ ' + f).join('\n'));
  console.error(`\n${fallos.length} problema(s).`);
  process.exit(1);
}
console.log(`✓ qa:precios — catálogo, filtros y configurador en ${APARATOS.length} aparatos × 2 idiomas (${pasos} recorridos); ninguna cifra comercial suelta fuera de /precios`);
process.exit(0);
