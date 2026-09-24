#!/usr/bin/env node
/*
 * QUÉ HACEMOS: UNA SOLA PÁGINA DONDE HABÍA DOS.
 *
 * «Servicios» y «Qué construimos» contaban lo mismo con otras palabras, y
 * quien entraba tenía que leerse las dos para saber qué vendemos. Ahora hay
 * una: las cinco cosas que construimos, cada una en una línea y con su
 * desplegable; cuatro webs de ejemplo; las ocho áreas como puerta de entrada;
 * y el método entero plegado, para quien quiera.
 *
 * La cáscara sale de una página que ya existe, igual que /precios: mismo
 * head, misma cabecera, mismo pie, ningún sistema visual paralelo.
 *
 * Uso:  node scripts/build-que-hacemos.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { AREAS, PIEZAS, PASOS } = await import('./webs/contenido.mjs');
const { MAQUETAS } = await import('./webs/maquetas.mjs');

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const T = {
  es: {
    ruta: 'Inicio', titulo: 'Qué hacemos',
    metaT: 'Qué hacemos · D-Code Partners',
    metaD: 'Construimos el sistema con el que trabaja tu empresa: sistemas a medida, automatizaciones, agentes de IA, integraciones y páginas web.',
    kicker: 'Qué hacemos',
    h1a: 'No vendemos herramientas sueltas.', h1b: 'Construimos el sistema.',
    lead: 'Miramos por dónde se os escapan el tiempo y el dinero, y construimos lo que lo corta. Cinco piezas que se combinan según lo que haga falta.',
    mas: 'Qué incluye',
    verPrecio: 'Ver el precio',
    websT: 'Páginas web', websH: 'Cuatro ejemplos de lo que sale.',
    websL: 'Maquetas nuestras, empresas inventadas. La web no es un folleto: se conecta con lo que ya usas.',
    areasT: 'Por dónde empezar', areasH: 'El mismo sistema, visto desde donde trabajas.',
    areasL: 'Cada área es una puerta de entrada, no un producto aparte. Se empieza por la que más pesa.',
    areaM: 'Ver el área',
    metodoT: 'Cómo lo hacemos', metodoH: 'El método, en nueve pasos',
    ctaK: 'Siguiente paso', ctaH: 'Empecemos por tu operativa.',
    ctaL: 'Treinta minutos, y sabrás por dónde empezaríamos.',
    ctaA: 'Reservar una llamada', ctaB: 'Ver precios',
  },
  en: {
    ruta: 'Home', titulo: 'What we do',
    metaT: 'What we do · D-Code Partners',
    metaD: 'We build the system your company runs on: custom systems, automations, AI agents, integrations and websites.',
    kicker: 'What we do',
    h1a: 'We do not sell loose tools.', h1b: 'We build the system.',
    lead: 'We look at where your time and money leak out, and build what stops it. Five pieces, combined as needed.',
    mas: 'What it includes',
    verPrecio: 'See the price',
    websT: 'Websites', websH: 'Four examples of what comes out.',
    websL: 'Our own mock-ups, made-up companies. A site is not a brochure: it connects to what you already use.',
    areasT: 'Where to start', areasH: 'The same system, seen from where you work.',
    areasL: 'Each area is a way in, not a separate product. You start with the one that weighs most.',
    areaM: 'See the area',
    metodoT: 'How we do it', metodoH: 'The method, in nine steps',
    ctaK: 'Next step', ctaH: 'Let us start with how you operate.',
    ctaL: 'Thirty minutes, and you will know where we would start.',
    ctaA: 'Book a call', ctaB: 'See pricing',
  },
};

const FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function cuerpo(lang) {
  const t = T[lang];
  const base = lang === 'en' ? '/en' : '';

  const piezas = PIEZAS.map((p) => `<article class="qh-pieza">
<h3>${esc(p.t[lang])}</h3>
<p class="qh-una">${esc(p.una[lang])}</p>
<details class="qh-mas"><summary>${esc(t.mas)}</summary><ul>${p.mas[lang].map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>
<a class="qh-precio" href="${p.href[lang]}">${esc(t.verPrecio)} ${FLECHA}</a>
</article>`).join('\n');

  const webs = MAQUETAS.map((m) => `<figure class="qh-web">
<img src="/assets/img/webs/${m.id}.webp" srcset="/assets/img/webs/${m.id}-600.webp 600w, /assets/img/webs/${m.id}.webp 1200w" sizes="(max-width:760px) 92vw, 46vw" width="1200" height="820" loading="lazy" decoding="async" alt="${esc(m.nombre[lang])} — ${esc(m.que[lang])}">
<figcaption><b>${esc(m.nombre[lang])}</b>${esc(m.que[lang])}</figcaption>
</figure>`).join('\n');

  const areas = AREAS.map(([id, k, nes, nen, tes, ten]) => `<li><a class="area" href="${base}/departamentos/${id}" style="--c:var(--${k})"><span class="area-k"><i aria-hidden="true"></i>${esc(lang === 'en' ? nen : nes)}</span><span class="area-t">${esc(lang === 'en' ? ten : tes)}</span><span class="area-m">${esc(t.areaM)} ${FLECHA}</span></a></li>`).join('');

  const pasos = PASOS.map(([nes, nen, tes, ten], i) => `<li><b><span>${String(i + 1).padStart(2, '0')}</span>${esc(lang === 'en' ? nen : nes)}</b><span>${esc(lang === 'en' ? ten : tes)}</span></li>`).join('');

  return `<div class="container"> <nav class="breadcrumbs" aria-label="${lang === 'en' ? 'Breadcrumb' : 'Ruta de navegación'}"> <ol><li><a href="${base}/">${esc(t.ruta)}</a></li><li class="sep">/</li><li aria-current="page">${esc(t.titulo)}</li></ol> </nav> </div>
<section class="page-hero" data-amb="violeta"> <div class="container">
<span class="eyebrow">${esc(t.kicker)}</span>
<h1 class="h-title">${esc(t.h1a)}<br><span class="grad">${esc(t.h1b)}</span></h1>
<p class="lead">${esc(t.lead)}</p>
</div> </section>

<section class="section-sm edge-top" data-amb="cian" aria-label="${esc(t.kicker)}"><div class="container">
<div class="qh-rej">${piezas}</div>
</div></section>

<section class="section-sm" data-amb="verde" aria-labelledby="qh-webs"><div class="container">
<div class="head"><span class="eyebrow">${esc(t.websT)}</span><h2 id="qh-webs" class="h-sec">${esc(t.websH)}</h2><p class="lead">${esc(t.websL)}</p></div>
<div class="qh-webs">${webs}</div>
</div></section>

<section class="section-sm" data-amb="violeta" aria-labelledby="qh-areas"><div class="container">
<div class="head"><span class="eyebrow">${esc(t.areasT)}</span><h2 id="qh-areas" class="h-sec">${esc(t.areasH)}</h2><p class="lead">${esc(t.areasL)}</p></div>
<ul class="areas">${areas}</ul>
</div></section>

<section class="section-sm" data-amb="cian" aria-labelledby="qh-metodo"><div class="container">
<details class="qh-metodo">
<summary><span class="eyebrow">${esc(t.metodoT)}</span><span id="qh-metodo" class="qh-metodo-h">${esc(t.metodoH)}</span></summary>
<ol class="qh-pasos">${pasos}</ol>
</details>
</div></section>

<section class="cta-band" data-amb="rosa"> <div class="container">
<span class="eyebrow">${esc(t.ctaK)}</span>
<h2 class="h-title" style="margin-top:16px;">${esc(t.ctaH)}</h2>
<p class="lead" style="margin:16px auto 0;">${esc(t.ctaL)}</p>
<div class="hero4-ctas"><a href="${base}/contacto" class="btn btn-primary">${esc(t.ctaA)}</a> <a href="${base}/precios" class="btn btn-ghost">${esc(t.ctaB)}</a></div>
</div> </section>`;
}

const hechas = [];
for (const lang of ['es', 'en']) {
  const molde = lang === 'en' ? 'en/metodo.html' : 'metodo.html';
  const destino = lang === 'en' ? 'en/que-hacemos.html' : 'que-hacemos.html';
  const t = T[lang];
  let h = fs.readFileSync(path.join(RAIZ, molde), 'utf8');

  const iMain = h.indexOf('<main id="main-content">') + '<main id="main-content">'.length;
  const fMain = h.indexOf('</main>');
  h = h.slice(0, iMain) + '\n' + cuerpo(lang) + '\n' + h.slice(fMain);

  h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc(t.metaT)}</title>`);
  h = h.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(t.metaD)}$2`);
  h = h.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(t.metaT)}$2`);
  h = h.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(t.metaD)}$2`);
  h = h.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(t.metaT)}$2`);
  h = h.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(t.metaD)}$2`);
  h = h.replace(/(<link rel="canonical" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1${lang === 'en' ? '/en' : ''}/que-hacemos$2`);
  h = h.replace(/(<meta property="og:url" content="https:\/\/dcodepartners\.com)[^"]*(")/, `$1${lang === 'en' ? '/en' : ''}/que-hacemos$2`);
  h = h.replace(/(<link rel="alternate" hreflang="es" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1/que-hacemos$2`);
  h = h.replace(/(<link rel="alternate" hreflang="en" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1/en/que-hacemos$2`);
  h = h.replace(/(<link rel="alternate" hreflang="x-default" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1/que-hacemos$2`);
  h = h.replace(/(<a href=")[^"]*(" hreflang="es" lang="es" data-lang="es")/, `$1/que-hacemos$2`);
  h = h.replace(/(<a href=")[^"]*(" hreflang="en" lang="en" data-lang="en")/, `$1/en/que-hacemos$2`);
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

  /* El «estás aquí» de la cáscara es de Método; aquí es mentira. Ponerlo
     donde toca es cosa de aplicar-que-hacemos, que es quien conoce el menú
     nuevo y pasa por las 68 páginas; aquí solo se quita el heredado. */
  h = h.replace(/(<a href="[^"]*")\s+aria-current="page"(>)/g, '$1$2');

  /* Las ocho áreas viven en dcp10.css, que la cáscara de Método no trae: sin
     ella la flecha del enlace sale a tamaño de cartel. Y las dos hojas de
     tema van siempre las últimas, que lo vigila check:tema. */
  for (const hoja of ['dcp10', 'que-hacemos']) {
    if (new RegExp(`css/${hoja}\\.css`).test(h)) continue;
    h = h.replace(/(<link rel="stylesheet" href="\/assets\/css\/tema-claro\.css)/,
      `<link rel="stylesheet" href="/assets/css/${hoja}.css?v=0">\n$1`);
  }

  fs.writeFileSync(path.join(RAIZ, destino), h);
  hechas.push(destino);
}
console.log(`✓ build:que-hacemos — ${hechas.join(', ')} (${PIEZAS.length} piezas, ${MAQUETAS.length} webs, ${AREAS.length} áreas, ${PASOS.length} pasos)`);
