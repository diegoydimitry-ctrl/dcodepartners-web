#!/usr/bin/env node
/*
 * EL FORMULARIO DE CONTACTO, PROBADO COMO LO USA UNA PERSONA.
 *
 * Nació de un fallo real: una regla CSS sobre «.field» —que es a la vez el
 * campo de partículas y el campo de un formulario— dejó todos los campos en
 * display:none en cuanto el puntero era grueso. En un iPad no se podía
 * escribir nada, y no lo cazó ninguna prueba: ni los solapes (miran anchos,
 * no dedos) ni axe (un campo oculto no incumple nada).
 *
 * Esto recorre los dos pasos en ES y EN, con ratón y con dedo, en los dos
 * temas: comprueba que cada campo se ve, se puede enfocar, acepta texto y que
 * los botones llevan de un paso al siguiente. No envía nada.
 *
 * Uso: node scripts/qa-formulario.mjs
 */
import { chromium } from 'playwright';
import { levanta, opcionesNavegador } from './qa/servidor.mjs';

const APARATOS = [
  ['PC 1440',        { viewport:{width:1440,height:900},  deviceScaleFactor:1 }],
  ['PC 1024',        { viewport:{width:1024,height:820},  deviceScaleFactor:1 }],
  ['iPad 1024',      { viewport:{width:1024,height:1366}, deviceScaleFactor:2, isMobile:true, hasTouch:true }],
  ['iPad apaisado',  { viewport:{width:1112,height:834},  deviceScaleFactor:2, isMobile:true, hasTouch:true }],
  ['Móvil 393',      { viewport:{width:393,height:852},   deviceScaleFactor:3, isMobile:true, hasTouch:true }],
  ['Móvil 320',      { viewport:{width:320,height:680},   deviceScaleFactor:2, isMobile:true, hasTouch:true }],
];
const RUTAS = ['/contacto', '/en/contacto'];
/* Dos pasos, no cuatro: los datos de contacto van juntos y el mensaje libre
   vive plegado dentro de «añadir algo más». El formulario, además, ya no se
   ve al entrar —lo abre el configurador, o el enlace de «prefiero
   escribiros»—, así que aquí se abre por ese enlace antes de escribir. */
const PASOS = [
  [['#nombre','Dimitry Sosenko'], ['#empresa','D-Code Partners'],
   ['#email','prueba@dcodepartners.com'], ['#telefono','600 00 00 00'],
   ['#mensaje','Facturas y avisos, ahora mismo a mano.']],
  [],
];

const PORT = 9660; await levanta(PORT);
const br = await chromium.launch(opcionesNavegador());
const fallos = [];
let comprobados = 0;

for (const [nombre, op] of APARATOS) {
  for (const tema of ['dark','light']) {
    const ctx = await br.newContext(op);
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());   // sin Turnstile ni Cal
    await ctx.addInitScript((t) => { try { localStorage.setItem('dcp-tema', t); } catch (e) {} }, tema);
    for (const ruta of RUTAS) {
      const donde = `${nombre} · ${tema} · ${ruta}`;
      const pg = await ctx.newPage();
      await pg.goto(`http://127.0.0.1:${PORT}${ruta}`, { waitUntil:'domcontentloaded' });
      await pg.waitForTimeout(700);

      /* Abrir el formulario como lo abre quien entra y no quiere configurar
         nada. Si el enlace no está, se sigue igual: puede que el guion del
         configurador no haya corrido, y entonces el formulario ya se ve. */
      const atajo = pg.locator('.cfg-saltar a');
      if (await atajo.count()) {
        await atajo.first().click().catch(() => {});
        await pg.waitForTimeout(320);
      }
      const escondido = await pg.evaluate(() => !!document.querySelector('.form-card.es-espera'));
      if (escondido) fallos.push(`${donde}: el formulario sigue escondido después de pulsar «prefiero escribiros»`);

      /* El mensaje vive dentro de un <details>; hay que abrirlo para escribir. */
      await pg.evaluate(() => { const d = document.querySelector('.form-extra'); if (d) d.open = true; });

      for (let i = 0; i < PASOS.length; i++) {
        for (const [sel, texto] of PASOS[i]) {
          const campo = pg.locator(sel);
          const caja = await campo.boundingBox().catch(() => null);
          const est = await campo.evaluate((e) => {
            const c = getComputedStyle(e), p = e.closest('.field');
            return { d:c.display, v:c.visibility, o:+c.opacity, pd:p?getComputedStyle(p).display:'sin .field' };
          }).catch(() => null);
          if (!est || est.d === 'none' || est.pd === 'none' || est.v === 'hidden' || est.o < 0.1 || !caja || caja.width < 40 || caja.height < 16) {
            fallos.push(`${donde} · paso ${i+1} · ${sel}: no se puede escribir (${JSON.stringify(est)} caja=${JSON.stringify(caja)})`);
            continue;
          }
          await campo.fill(texto).catch((e) => fallos.push(`${donde} · ${sel}: fill falló — ${e.message.split('\n')[0]}`));
          const leido = await campo.inputValue().catch(() => null);
          if (leido !== texto) fallos.push(`${donde} · ${sel}: escribí «${texto}» y quedó «${leido}»`);
          comprobados++;
        }
        if (i < PASOS.length - 1) {
          await pg.locator('#form-next-btn').click().catch((e) => fallos.push(`${donde} · paso ${i+1}: el botón Continuar no responde — ${e.message.split('\n')[0]}`));
          await pg.waitForTimeout(260);
          const activo = await pg.evaluate(() => { const s = document.querySelector('.form-step.is-active'); return s ? s.getAttribute('data-step') : null; });
          if (activo !== String(i + 2)) fallos.push(`${donde}: tras el paso ${i+1} el activo es «${activo}» y debería ser «${i+2}»`);
        }
      }
      /* El último paso: la casilla de privacidad y el botón de enviar. No se
         envía nada; solo que estén y se puedan tocar. */
      const fin = await pg.evaluate(() => {
        const c = document.querySelector('#acepta-privacidad');
        const b = document.querySelector('#form-submit-btn');
        const vis = (e) => { if (!e) return false; const s = getComputedStyle(e), r = e.getBoundingClientRect();
          return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 8 && r.height > 8; };
        return { casilla: vis(c), enviar: vis(b) };
      });
      if (!fin.casilla) fallos.push(`${donde}: la casilla de privacidad no se ve`);
      if (!fin.enviar)  fallos.push(`${donde}: el botón de enviar no se ve`);
      await pg.close();
    }
    await ctx.close();
  }
}
await br.close();
if (fallos.length) { console.error(fallos.map((f) => '✗ ' + f).join('\n')); console.error(`\n${fallos.length} problema(s).`); process.exit(1); }
console.log(`✓ qa:formulario — ${comprobados} campos rellenados en ${APARATOS.length} aparatos × 2 temas × ${RUTAS.length} idiomas; los dos pasos avanzan y el cierre se ve`);
process.exit(0);
