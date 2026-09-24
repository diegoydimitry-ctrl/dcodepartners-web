#!/usr/bin/env node
/*
 * UNA PÁGINA POR CADA COSA QUE HACEMOS.
 *
 * En «Qué hacemos» cada pieza cabe en una línea. Quien quiere saber más
 * pulsa y llega a su página: el titular, cuatro frases, lo que hay que saber
 * y algo que se pueda abrir y tocar. Ni un folleto ni una tabla de
 * características: lo justo para entenderlo y una demo de verdad.
 *
 * Viven en /servicios/<slug> porque esa carpeta ya existía y ya servía tres
 * páginas; meterlas en /que-hacemos/<slug> obligaba a tener a la vez el
 * fichero que-hacemos.html y una carpeta que-hacemos/, y esa ambigüedad la
 * resuelve el servidor, no nosotros. Las tres viejas se van y vercel.json
 * manda sus direcciones a las nuevas.
 *
 * La cáscara sale de metodo.html, igual que /que-hacemos y /precios: mismo
 * head, misma cabecera, mismo pie, ningún sistema visual paralelo.
 *
 * Uso:  node scripts/build-fichas.mjs
 *       node scripts/build-fichas.mjs --check   (falla si falta o sobra alguna)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const { FICHAS } = await import('./contenido/fichas.mjs');
const { MAQUETAS } = await import('./contenido/maquetas.mjs');


const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ_IMG = path.join(RAIZ, 'assets/img/webs');
const CHECK = process.argv.includes('--check');
/* El alto de cada maqueta larga sale del fichero, no de un número escrito a
   mano: las cuatro miden distinto —entre 1.130 y 1.270 píxeles— y con un
   alto inventado el navegador reserva una caja que no es la suya y la
   ventana da un salto al cargar la imagen. */
const MEDIDA = {};
for (const m of MAQUETAS) {
  const f = path.join(RAIZ_IMG, `${m.id}-largo.webp`);
  if (!fs.existsSync(f)) continue;
  const { width, height } = await sharp(f).metadata();
  MEDIDA[m.id] = { w: width, h: height };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const destinoDe = (f, lang) => (lang === 'en' ? 'en/' : '') + 'servicios/' + f.slug + '.html';

/* Las tres que había antes de unir Servicios con Qué construimos. Se borran
   aquí y no a mano para que quien regenere en otro ordenador acabe con la
   misma carpeta; vercel.json manda sus direcciones a las nuevas. */
const VIEJAS = ['agentes-ia.html', 'automatizacion-ia.html'];

const T = {
  es: {
    ruta: 'Inicio', qh: 'Qué hacemos', lang: 'es',
    puntosT: 'Lo que hay que saber',
    demoT: 'Para verlo',
    otrosT: 'Y también', otrosH: 'Las otras cuatro cosas que construimos.',
    abrirDemo: 'Abrir la demo', abrirChat: 'Abrir el asistente',
    marcoAyuda: 'Baja dentro de cada ventana para ver la página entera.',
    marcoUno: 'Bajar la página',
    ctaK: 'Siguiente paso', ctaH: 'Cuéntanos tu caso.',
    ctaL: 'Treinta minutos y sabrás por dónde empezaríamos.',
    ctaA: 'Reservar una llamada', ctaB: 'Ver el precio',
    inventada: 'Empresas inventadas, maquetas nuestras.',
  },
  en: {
    ruta: 'Home', qh: 'What we do', lang: 'en',
    puntosT: 'What you should know',
    demoT: 'To see it',
    otrosT: 'Also', otrosH: 'The other four things we build.',
    abrirDemo: 'Open the demo', abrirChat: 'Open the assistant',
    marcoAyuda: 'Scroll inside each window to see the whole page.',
    marcoUno: 'Scroll the page',
    ctaK: 'Next step', ctaH: 'Tell us about your case.',
    ctaL: 'Thirty minutes and you will know where we would start.',
    ctaA: 'Book a call', ctaB: 'See the price',
    inventada: 'Made-up companies, our own mock-ups.',
  },
};

const FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ABAJO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* Las mismas figuras que en «Qué hacemos» y en el configurador: la pieza se
   reconoce por su dibujo antes de leer el titular. */
const T2 = 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
const FIG = {
  sistemas:        `<circle cx="17" cy="31" r="8" ${T2}/><path d="M23 25L40 8M34 14l4 4M30 18l4 4" ${T2}/>`,
  automatizaciones:`<circle cx="24" cy="24" r="7" ${T2}/><path d="M24 5v6M24 37v6M43 24h-6M11 24H5M37.4 10.6l-4.2 4.2M14.8 33.2l-4.2 4.2M37.4 37.4l-4.2-4.2M14.8 14.8l-4.2-4.2" ${T2}/>`,
  agentes:         `<path d="M40 24c0 7.7-7.2 14-16 14-2.3 0-4.5-.4-6.4-1.2L8 40l3.4-8.3C9.2 29.5 8 26.9 8 24c0-7.7 7.2-14 16-14s16 6.3 16 14z" ${T2}/><circle cx="18" cy="24" r="1.8" fill="currentColor"/><circle cx="24" cy="24" r="1.8" fill="currentColor"/><circle cx="30" cy="24" r="1.8" fill="currentColor"/>`,
  integraciones:   `<path d="M18 6v10M30 6v10M12 16h24v6a12 12 0 0 1-24 0z" ${T2}/><path d="M24 34v8" ${T2}/>`,
  webs:            `<rect x="6" y="10" width="36" height="24" rx="3" ${T2}/><path d="M6 18h36M18 40h12M24 34v6" ${T2}/><circle cx="12" cy="14" r="1.4" fill="currentColor"/><circle cx="17" cy="14" r="1.4" fill="currentColor"/>`,
};
const fig = (id, clase) => `<span class="${clase}" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false">${FIG[id] || ''}</svg></span>`;

/* La demo cambia según la pieza: unas se ven abriendo algo que ya existe,
   los agentes se ven aquí mismo —el asistente de la web es uno de ellos— y
   las webs se ven en un marco que se puede bajar. */
function demo(f, lang, t) {
  const base = lang === 'en' ? '/en' : '';
  if (f.demo.tipo === 'webs') {
    const marcos = MAQUETAS.map((m) => `<figure class="fi-marco">
<div class="fi-barra" aria-hidden="true"><i></i><i></i><i></i><span>${esc(m.id.replace('web-', ''))}.es</span></div>
<div class="fi-viewport" tabindex="0" role="group" aria-label="${esc(m.nombre[lang])} — ${esc(t.marcoUno)}">
<img src="/assets/img/webs/${m.id}-largo.webp" width="${(MEDIDA[m.id] || { w: 1000 }).w}" height="${(MEDIDA[m.id] || { h: 1180 }).h}" loading="lazy" decoding="async" alt="${esc(m.nombre[lang])} — ${esc(m.que[lang])}">
</div>
<span class="fi-pista" aria-hidden="true">${ABAJO}${esc(t.marcoUno)}</span>
<figcaption><b>${esc(m.nombre[lang])}</b>${esc(m.que[lang])}</figcaption>
</figure>`).join('\n');
    return `<div class="fi-demo es-webs">
<div class="head"><span class="eyebrow">${esc(t.demoT)}</span><h2 class="h-sec">${esc(f.demo.t[lang])}</h2><p class="lead">${esc(f.demo.d[lang])}</p></div>
<p class="fi-ayuda">${esc(t.marcoAyuda)}</p>
<div class="fi-marcos">${marcos}</div>
<p class="fi-nota">${esc(t.inventada)}</p>
</div>`;
  }
  const accion = f.demo.tipo === 'chat'
    ? `<button type="button" class="btn btn-primary" data-abre-chat>${esc(t.abrirChat)} ${FLECHA}</button>`
    : `<a class="btn btn-primary" href="${f.demo.ruta[lang]}">${esc(t.abrirDemo)} ${FLECHA}</a>`;
  return `<div class="fi-demo">
<div class="fi-demo-c">
<span class="eyebrow">${esc(t.demoT)}</span>
<h2 class="h-sec">${esc(f.demo.t[lang])}</h2>
<p class="lead">${esc(f.demo.d[lang])}</p>
<div class="hero4-ctas">${accion}</div>
</div>
</div>`;
}

function cuerpo(f, lang) {
  const t = T[lang];
  const base = lang === 'en' ? '/en' : '';

  const puntos = f.puntos[lang].map(([b, d]) => `<li><b>${esc(b)}</b><span>${esc(d)}</span></li>`).join('');

  const otros = FICHAS.filter((o) => o.id !== f.id).map((o) => `<li><a class="fi-otro" href="${base}/servicios/${o.slug}">
<span class="fi-otro-h">${fig(o.fig, 'fi-otro-f')}<b>${esc(o.t[lang])}</b><span class="fi-otro-i">${FLECHA}</span></span>
<span class="fi-otro-d">${esc(o.h[lang])}</span>
</a></li>`).join('');

  return `<div class="container"> <nav class="breadcrumbs" aria-label="${lang === 'en' ? 'Breadcrumb' : 'Ruta de navegación'}"> <ol><li><a href="${base}/">${esc(t.ruta)}</a></li><li class="sep">/</li><li><a href="${base}/que-hacemos">${esc(t.qh)}</a></li><li class="sep">/</li><li aria-current="page">${esc(f.t[lang])}</li></ol> </nav> </div>

<section class="page-hero fi-hero" data-amb="violeta"> <div class="container">
${fig(f.fig, 'fi-fig')}
<span class="eyebrow">${esc(t.qh)}</span>
<h1 class="h-title">${esc(f.h[lang])}</h1>
<p class="lead">${esc(f.lead[lang])}</p>
</div> </section>

<section class="section-sm edge-top" data-amb="cian" aria-labelledby="fi-puntos"><div class="container">
<span class="eyebrow" id="fi-puntos">${esc(t.puntosT)}</span>
<ul class="fi-puntos">${puntos}</ul>
</div></section>

<section class="section-sm" data-amb="verde" aria-label="${esc(t.demoT)}"><div class="container">
${demo(f, lang, t)}
</div></section>

<section class="section-sm" data-amb="violeta" aria-labelledby="fi-otros"><div class="container">
<div class="head"><span class="eyebrow">${esc(t.otrosT)}</span><h2 id="fi-otros" class="h-sec">${esc(t.otrosH)}</h2></div>
<ul class="fi-otros">${otros}</ul>
</div></section>

<section class="cta-band" data-amb="rosa"> <div class="container">
<span class="eyebrow">${esc(t.ctaK)}</span>
<h2 class="h-title" style="margin-top:16px;">${esc(t.ctaH)}</h2>
<p class="lead" style="margin:16px auto 0;">${esc(t.ctaL)}</p>
<div class="hero4-ctas"><a href="${base}/contacto" class="btn btn-primary">${esc(t.ctaA)}</a> <a href="${base}/precios#${f.precio}" class="btn btn-ghost">${esc(t.ctaB)}</a></div>
</div> </section>`;
}

/* ---------- comprobación ---------- */
if (CHECK) {
  const fallos = [];
  for (const lang of ['es', 'en']) {
    for (const f of FICHAS) {
      const d = destinoDe(f, lang);
      if (!fs.existsSync(path.join(RAIZ, d))) { fallos.push(`falta ${d}`); continue; }
      const h = fs.readFileSync(path.join(RAIZ, d), 'utf8');
      if (!h.includes('class="fi-puntos"')) fallos.push(`${d}: sin la lista de lo que hay que saber`);
      if (!/class="fi-demo/.test(h)) fallos.push(`${d}: sin demo`);
      if (f.demo.tipo === 'webs' && (h.match(/class="fi-marco"/g) || []).length !== MAQUETAS.length)
        fallos.push(`${d}: ${MAQUETAS.length} maquetas en el marco y no las hay`);
      if (!h.includes(`/precios#${f.precio}`)) fallos.push(`${d}: sin enlace a su precio`);
      if (f.demo.tipo === 'webs') for (const m of MAQUETAS) {
        const med = MEDIDA[m.id];
        if (!med) { fallos.push(`${d}: falta la captura larga de ${m.id}`); continue; }
        if (!h.includes(`${m.id}-largo.webp" width="${med.w}" height="${med.h}"`))
          fallos.push(`${d}: ${m.id} declara un alto que no es el del fichero (${med.w}×${med.h})`);
      }
    }
    for (const v of VIEJAS) {
      const d = (lang === 'en' ? 'en/' : '') + 'servicios/' + v;
      if (fs.existsSync(path.join(RAIZ, d))) fallos.push(`sobra ${d}: la sustituye una ficha nueva`);
    }
  }
  /* Y que «Qué hacemos» lleve a las cinco: una ficha a la que no se llega
     desde ningún sitio es una página que no existe. */
  for (const [pag, lang] of [['que-hacemos.html', 'es'], ['en/que-hacemos.html', 'en']]) {
    const h = fs.readFileSync(path.join(RAIZ, pag), 'utf8');
    const base = lang === 'en' ? '/en' : '';
    for (const f of FICHAS) if (!h.includes(`${base}/servicios/${f.slug}"`)) fallos.push(`${pag}: no lleva a ${f.slug}`);
  }
  if (fallos.length) {
    console.error('✗ check:fichas — ' + fallos.length + ' problema(s):');
    fallos.forEach((x) => console.error('  ' + x));
    console.error('  Se regeneran con:  node scripts/build-fichas.mjs');
    process.exit(1);
  }
  console.log(`✓ check:fichas — ${FICHAS.length * 2} páginas, cada una con su demo y su precio`);
  process.exit(0);
}

/* ---------- generación ---------- */
const hechas = [];
for (const lang of ['es', 'en']) {
  const molde = lang === 'en' ? 'en/metodo.html' : 'metodo.html';
  const shell = fs.readFileSync(path.join(RAIZ, molde), 'utf8');

  for (const f of FICHAS) {
    const destino = destinoDe(f, lang);
    const ruta = (lang === 'en' ? '/en' : '') + '/servicios/' + f.slug;
    const metaT = `${f.t[lang]} · D-Code Partners`;
    const metaD = f.lead[lang].length > 155 ? f.lead[lang].slice(0, 152).replace(/[\s,;]+\S*$/, '') + '…' : f.lead[lang];
    let h = shell;

    const iMain = h.indexOf('<main id="main-content">') + '<main id="main-content">'.length;
    const fMain = h.indexOf('</main>');
    h = h.slice(0, iMain) + '\n' + cuerpo(f, lang) + '\n' + h.slice(fMain);

    h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc(metaT)}</title>`);
    for (const a of ['name="description"', 'property="og:description"', 'name="twitter:description"'])
      h = h.replace(new RegExp(`(<meta ${a} content=")[^"]*(")`), `$1${esc(metaD)}$2`);
    for (const a of ['property="og:title"', 'name="twitter:title"'])
      h = h.replace(new RegExp(`(<meta ${a} content=")[^"]*(")`), `$1${esc(metaT)}$2`);
    h = h.replace(/(<link rel="canonical" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1${ruta}$2`);
    h = h.replace(/(<meta property="og:url" content="https:\/\/dcodepartners\.com)[^"]*(")/, `$1${ruta}$2`);
    h = h.replace(/(<link rel="alternate" hreflang="es" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1/servicios/${f.slug}$2`);
    h = h.replace(/(<link rel="alternate" hreflang="en" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1/en/servicios/${f.slug}$2`);
    h = h.replace(/(<link rel="alternate" hreflang="x-default" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1/servicios/${f.slug}$2`);
    h = h.replace(/(<a href=")[^"]*(" hreflang="es" lang="es" data-lang="es")/, `$1/servicios/${f.slug}$2`);
    h = h.replace(/(<a href=")[^"]*(" hreflang="en" lang="en" data-lang="en")/, `$1/en/servicios/${f.slug}$2`);
    h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

    /* El «estás aquí» de la cáscara es de Método; aquí es mentira. Quién lo
       lleva en cada página lo decide aplicar-que-hacemos, que conoce el menú. */
    h = h.replace(/(<a href="[^"]*")\s+aria-current="page"(>)/g, '$1$2');

    /* Las hojas propias van antes que las dos de tema, que cierran siempre:
       lo vigila check:tema. */
    for (const hoja of ['dcp10', 'que-hacemos', 'fichas']) {
      if (new RegExp(`css/${hoja}\\.css`).test(h)) continue;
      h = h.replace(/(<link rel="stylesheet" href="\/assets\/css\/tema-claro\.css)/,
        `<link rel="stylesheet" href="/assets/css/${hoja}.css?v=0">\n$1`);
    }
    if (!/js\/fichas\.js/.test(h))
      h = h.replace(/(<\/body>)/, `<script src="/assets/js/fichas.js?v=0" defer></script>\n$1`);

    fs.writeFileSync(path.join(RAIZ, destino), h);
    hechas.push(destino);
  }

  for (const v of VIEJAS) {
    const d = path.join(RAIZ, (lang === 'en' ? 'en/' : '') + 'servicios/' + v);
    if (fs.existsSync(d)) fs.unlinkSync(d);
  }
}

/* Las fichas necesitan el menú unido y su «estás aquí», igual que
   /que-hacemos: generarlas sin aplicarlo las dejaría con el menú viejo. */
await import('./aplicar-que-hacemos.mjs');

console.log(`✓ build:fichas — ${hechas.length} páginas (${FICHAS.map((f) => f.slug).join(', ')})`);
