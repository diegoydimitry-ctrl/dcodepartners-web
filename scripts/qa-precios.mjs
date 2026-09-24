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
     · la demo de Finance (empresa ficticia) y lo que escribe build:precios.

     Los dos primeros no se reconocen por la línea suelta —«<span>18 €»no
     dice de dónde sale—, así que se borra la REGIÓN entera equilibrando su
     etiqueta antes de mirar. Si mañana alguien mete un precio de verdad ahí
     dentro, se le escapa a esto: por eso son dos marcas concretas y no un
     comodín. */
  const sinZonas = (h) => {
    let s = h;
    for (const marca of ['data-dx', 'data-os-datos']) {
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

    /* ---- la comparativa de mercado ----
       Se compara con el precio de otro: cada fila ajena tiene que llevar la
       tarifa de donde salió, abrirse fuera y no filtrar el referer. Y el
       recuadro va plegado, que son siete pantallas de móvil abierto. */
    const mk = await pg.evaluate(() => {
      const d = document.querySelector('.mercado--plegado');
      if (!d) return null;
      const filas = [...d.querySelectorAll('.mercado-l > li')];
      return {
        plegado: !d.open,
        filas: filas.length,
        sinFuente: filas.filter((li) => !li.querySelector('.mercado-f')).map((li) => li.querySelector('b').textContent),
        malEnlace: [...d.querySelectorAll('a.mercado-f')]
          .filter((a) => !/^https:\/\//.test(a.href) || a.target !== '_blank' || !/noopener/.test(a.rel))
          .map((a) => a.closest('li').querySelector('b').textContent),
        nuestras: d.querySelectorAll('.mercado-l .es-nuestro').length,
      };
    });
    if (!mk) fallos.push(`${donde}: no está la comparativa de mercado`);
    else {
      if (!mk.plegado) fallos.push(`${donde}: la comparativa de mercado viene desplegada`);
      if (mk.filas !== CAT.mercado.filas.length) fallos.push(`${donde}: la comparativa tiene ${mk.filas} filas y el catálogo ${CAT.mercado.filas.length}`);
      if (mk.sinFuente.length) fallos.push(`${donde}: sin fuente en la comparativa — ${mk.sinFuente.join(', ')}`);
      if (mk.malEnlace.length) fallos.push(`${donde}: enlace de tarifa mal puesto (https, _blank, noopener) — ${mk.malEnlace.join(', ')}`);
      if (mk.nuestras !== 1) fallos.push(`${donde}: la comparativa marca ${mk.nuestras} filas como nuestras, tiene que ser 1`);
      await pg.locator('.mercado--plegado > summary').click();
      await pg.waitForTimeout(250);
      const abre = await pg.evaluate(() => {
        const d = document.querySelector('.mercado--plegado');
        const li = [...d.querySelectorAll('.mercado-l > li')];
        return { abierto: d.open, cortadas: li.filter((x) => x.scrollWidth > x.clientWidth + 1).length,
                 ancho: document.documentElement.scrollWidth > document.documentElement.clientWidth };
      });
      if (!abre.abierto) fallos.push(`${donde}: la comparativa no se abre al pulsarla`);
      if (abre.cortadas) fallos.push(`${donde}: ${abre.cortadas} fila(s) de la comparativa se cortan`);
      if (abre.ancho) fallos.push(`${donde}: la comparativa abierta desborda a lo ancho`);
      await pg.locator('.mercado--plegado > summary').click();
      await pg.waitForTimeout(150);
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

    /* Recorrido completo: sector → objetivos → gente → piezas → adaptación */
    const elegir = async (sel, n) => { await pg.click(`#configurador ${sel} >> nth=${n}`); };
    await elegir('.cfg-op', 2); await pg.click('.cfg-seguir'); await pg.waitForTimeout(180);
    await elegir('.cfg-chip', 0); await elegir('.cfg-chip', 1); await pg.click('.cfg-seguir'); await pg.waitForTimeout(180);
    await elegir('.cfg-op', 1); await pg.click('.cfg-seguir'); await pg.waitForTimeout(180);
    await elegir('.cfg-op', 0); await elegir('.cfg-op', 2); await pg.click('.cfg-seguir'); await pg.waitForTimeout(180);
    await elegir('.cfg-op', 1); await pg.click('.cfg-seguir'); await pg.waitForTimeout(400);

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
    }));
    if (volcado.mensaje.length < 60) fallos.push(`${donde}: la configuración no llegó al formulario`);
    if (!volcado.oculto) fallos.push(`${donde}: falta el campo oculto con la configuración`);
    if (!volcado.aviso) fallos.push(`${donde}: no se avisa de que ya está en el formulario`);
    if (!volcado.campos) fallos.push(`${donde}: el formulario de contacto perdió sus campos`);
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
