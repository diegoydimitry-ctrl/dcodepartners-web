#!/usr/bin/env node
/*
 * LA SECCIÓN DE PRECIOS, ESCRITA DESDE catalogo.json
 * ----------------------------------------------------------------------------
 * Un solo sitio donde tocar un importe. Este script escribe, a partir de
 * catalogo.json:
 *
 *   precios.html        y  en/precios.html     la página entera
 *   assets/js/catalogo-datos.js                los mismos datos para el
 *                                              filtrado y para la estimación
 *                                              del configurador
 *
 * La cáscara (head, cabecera, pie) se copia de una página que ya existe, así
 * que la página nueva no puede desviarse del sistema visual ni quedarse atrás
 * cuando cambie la navegación: se regenera y ya está.
 *
 * Uso: node scripts/build-catalogo.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cat = JSON.parse(fs.readFileSync(path.join(RAIZ, 'catalogo.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const T = {
  es: {
    titulo: 'Precios', rutaInicio: 'Inicio',
    metaT: 'Precios · D-Code Partners',
    metaD: 'Qué vendemos, qué incluye y cuánto cuesta. Precios de referencia, sin letra pequeña: el alcance se cierra por escrito antes de empezar.',
    kicker: 'Catálogo y precios',
    h1a: 'Esto es lo que hacemos.', h1b: 'Y esto es lo que cuesta.',
    lead: 'Sin tarifas escondidas ni «consulta precio» en todo. Lo que tiene precio, lo lleva puesto; lo que depende de tu empresa, lo dice.',
    comoHoy: 'Cómo se contrata hoy', comoManana: 'Cómo será',
    filtros: 'Filtrar', filtroSector: 'Mi sector', filtroNecesidad: 'Lo que necesito', filtroTodo: 'Ver todo',
    nadaFiltro: 'Con ese filtro no queda nada. Prueba con otro, o cuéntanoslo y lo miramos.',
    incluye: 'Qué incluye', noIncluye: 'No incluye', para: 'Para quién',
    cta: 'Solicitar activación', ctaMedida: 'Hablar de esto', ctaPack: 'Quiero este pack',
    packs: 'Packs', packsSub: 'Varias piezas juntas salen más baratas que sueltas. Y hay que decidir una vez, no cinco.',
    sueltoSeria: 'Suelto sería', 
    estados: { disponible: 'Se contrata hoy', 'a-medida': 'Se valora el alcance', proximamente: 'Próximamente' },
    config: 'Configura el tuyo', configSub: 'Cinco preguntas y te decimos qué te haría falta y cuánto costaría, aproximadamente.',
    configCta: 'Abrir el configurador',
    catalogo: 'El catálogo', catalogoSub: 'Cada cosa, qué es y cuánto cuesta.',
    dudas: '¿Dudas antes de decidir?', dudasCta: 'Preguntas frecuentes',
    mes: 'al mes',
    mkFuente: 'Ver la tarifa publicada', mkNuestro: 'Nosotros', mkCuantas: 'tarifas publicadas',
  },
  en: {
    titulo: 'Pricing', rutaInicio: 'Home',
    metaT: 'Pricing · D-Code Partners',
    metaD: 'What we sell, what it includes and what it costs. Reference prices, no small print: scope is agreed in writing before anything starts.',
    kicker: 'Catalogue and pricing',
    h1a: 'This is what we do.', h1b: 'And this is what it costs.',
    lead: 'No hidden rates and no "ask us" on everything. What has a price shows it; what depends on your company says so.',
    comoHoy: 'How you buy today', comoManana: 'How it will work',
    filtros: 'Filter', filtroSector: 'My sector', filtroNecesidad: 'What I need', filtroTodo: 'Show all',
    nadaFiltro: 'Nothing matches that filter. Try another one, or tell us and we will look into it.',
    incluye: 'What it includes', noIncluye: 'Not included', para: 'Who it is for',
    cta: 'Request activation', ctaMedida: 'Talk about this', ctaPack: 'I want this bundle',
    packs: 'Bundles', packsSub: 'Several pieces together cost less than separately. And you decide once, not five times.',
    sueltoSeria: 'Separately it would be',
    estados: { disponible: 'Available today', 'a-medida': 'Scoped and quoted', proximamente: 'Coming soon' },
    config: 'Configure yours', configSub: 'Five questions and we tell you what you would need and roughly what it would cost.',
    configCta: 'Open the configurator',
    catalogo: 'The catalogue', catalogoSub: 'Each thing, what it is and what it costs.',
    dudas: 'Questions before deciding?', dudasCta: 'FAQ',
    mes: 'per month',
    mkFuente: 'See the published rate', mkNuestro: 'Ours', mkCuantas: 'published rates',
  },
};

function ficha(p, lang, t) {
  const d = p[lang];
  const estado = t.estados[p.estado] || p.estado;
  const precioMes = d.precio_mes
    ? `<span class="pr-mes"><em class="pr-mas" aria-hidden="true">+</em><b>${esc(d.precio_mes)}</b><i>${esc(d.precio_mes_detalle || '')}</i></span>`
    : '';
  const incluye = (d.incluye || []).map((x) => `<li>${esc(x)}</li>`).join('');
  const noIncluye = (d.no_incluye || []).length
    ? `<p class="pr-no"><b>${esc(t.noIncluye)}:</b> ${d.no_incluye.map(esc).join('. ')}.</p>` : '';
  const nota = d.nota ? `<p class="pr-nota">${esc(d.nota)}</p>` : '';
  const cta = p.estado === 'a-medida' ? t.ctaMedida : t.cta;
  return `<article class="pr-card${p.destacado ? ' es-dest' : ''}" data-cat="${p.cat}" data-estado="${p.estado}" data-sectores="${(p.sectores || []).join(' ')}" data-necesidad="${(p.necesidad || []).join(' ')}" data-setup="${p.setup}" data-mes="${p.mes}" data-id="${p.id}">
<header class="pr-head"><span class="pr-estado pr-estado--${p.estado}">${esc(estado)}</span><h3>${esc(d.nombre)}</h3><p class="pr-para">${esc(d.para)}</p></header>
<p class="pr-que">${esc(d.que)}</p>
<div class="pr-precio"><span class="pr-uno"><b>${esc(d.precio)}</b><i>${esc(d.precio_detalle || '')}</i></span>${precioMes}</div>
<details class="pr-mas-info"><summary>${esc(t.incluye)}</summary><ul class="pr-l">${incluye}</ul>${noIncluye}</details>
${nota}
<a class="btn btn-ghost btn-block pr-cta" href="${lang === 'en' ? '/en/contacto' : '/contacto'}?quiero=${p.id}">${esc(cta)}</a>
</article>`;
}

function fichaPack(p, lang, t) {
  const d = p[lang];
  const incluye = (d.incluye || []).map((x) => `<li>${esc(x)}</li>`).join('');
  const precioMes = d.precio_mes
    ? `<span class="pr-mes"><em class="pr-mas" aria-hidden="true">+</em><b>${esc(d.precio_mes)}</b><i>${esc(d.precio_mes_detalle || '')}</i></span>` : '';
  return `<article class="pr-card pr-pack${p.destacado ? ' es-dest' : ''}" data-id="${p.id}" data-setup="${p.setup}" data-mes="${p.mes}">
<header class="pr-head"><span class="pr-estado pr-estado--${p.estado}">${esc(t.estados[p.estado])}</span><h3>${esc(d.nombre)}</h3><p class="pr-para">${esc(d.para)}</p></header>
<p class="pr-que">${esc(d.que)}</p>
<div class="pr-precio"><span class="pr-uno"><b>${esc(d.precio)}</b><i>${esc(d.precio_detalle || '')}</i></span>${precioMes}</div>
<p class="pr-ahorro"><b>${esc(d.ahorro)}</b><i>${esc(t.sueltoSeria)} ${esc(d.suelto)}</i></p>
<ul class="pr-l">${incluye}</ul>
<a class="btn btn-primary btn-block pr-cta" href="${lang === 'en' ? '/en/contacto' : '/contacto'}?quiero=${p.id}">${esc(t.ctaPack)}</a>
</article>`;
}

function cuerpo(lang) {
  const t = T[lang];
  const base = lang === 'en' ? '/en' : '';
  const cats = cat.categorias.filter((c) => c.id !== 'packs');
  const chipsSector = cat.filtros.sectores
    .map((s) => `<button type="button" class="pr-chip${s.id === 'todos' ? ' is-on' : ''}" data-filtro="sector" data-val="${s.id}">${esc(s[lang])}</button>`).join('');
  const chipsNec = cat.filtros.necesidades
    .map((n) => `<button type="button" class="pr-chip" data-filtro="necesidad" data-val="${n.id}">${esc(n[lang])}</button>`).join('');
  const chipsCat = [`<button type="button" class="pr-chip is-on" data-filtro="cat" data-val="">${esc(t.filtroTodo)}</button>`]
    .concat(cats.map((c) => `<button type="button" class="pr-chip" data-filtro="cat" data-val="${c.id}">${esc(c[lang])}</button>`)).join('');

  const grupos = cats.map((c) => {
    const ps = cat.productos.filter((p) => p.cat === c.id);
    if (!ps.length) return '';
    return `<section class="pr-grupo" data-grupo="${c.id}" aria-labelledby="g-${c.id}">
<header class="pr-grupo-h"><h3 id="g-${c.id}">${esc(c[lang])}</h3><p>${esc(c[lang === 'en' ? 'resumen_en' : 'resumen_es'])}</p></header>
<div class="pr-rej">${ps.map((p) => ficha(p, lang, t)).join('\n')}</div>
</section>`;
  }).join('\n');

  const hoy = cat.contratacion.hoy[lang].map((p, i) => `<li><span class="pr-paso-n">${i + 1}</span>${esc(p)}</li>`).join('');
  const manana = cat.contratacion.manana[lang].map((p, i) => `<li><span class="pr-paso-n">${i + 1}</span>${esc(p)}</li>`).join('');

  /* ── DÓNDE QUEDA ESTO EN EL MERCADO ─────────────────────────────────────
     Un precio sin referencia no es caro ni barato: es un número suelto. Esta
     tabla sale de catalogo.json, con la URL de la tarifa pública de cada uno
     y la fecha en que se miró, porque una comparativa sin fuente es una
     opinión. Lo que el fabricante no publica, aquí dice que no lo publica.  */
  const mk = cat.mercado;
  const mkFilas = mk.filas.map((f) => {
    const fuente = f.url
      ? `<a class="mercado-f" href="${esc(f.url)}" target="_blank" rel="noopener nofollow">${esc(t.mkFuente)}</a>`
      : `<span class="mercado-f mercado-f--no">${esc(t.mkNuestro)}</span>`;
    return `<li${f.nuestro ? ' class="es-nuestro"' : ''}><b>${esc(f.quien)}</b><span>${esc(f.mes[lang])}</span><i class="mercado-u">${esc(f.unidad[lang])}</i><i>${esc(f.setup[lang])}</i>${fuente}</li>`;
  }).join('\n');

  return `<div class="container"> <nav class="breadcrumbs" aria-label="${lang === 'en' ? 'Breadcrumb' : 'Ruta de navegación'}"> <ol><li><a href="${base}/">${esc(t.rutaInicio)}</a></li><li class="sep">/</li><li aria-current="page">${esc(t.titulo)}</li></ol> </nav> </div>
<section class="page-hero" data-amb="cian"> <div class="container">
<span class="eyebrow">${esc(t.kicker)}</span>
<h1 class="h-title">${esc(t.h1a)}<br><span class="grad">${esc(t.h1b)}</span></h1>
<p class="lead">${esc(t.lead)}</p>
<p class="pr-iva">${esc(cat.iva[lang])} ${esc(cat.aviso[lang])}</p>
</div> </section>

<section class="section-sm edge-top" data-amb="violeta" aria-labelledby="pr-como"><div class="container">
<div class="pr-como">
  <div class="pr-como-c"><span class="eyebrow">${esc(t.comoHoy)}</span><ol class="pr-pasos pr-pasos--hoy">${hoy}</ol></div>
  <div class="pr-como-c pr-como-c--futuro"><span class="eyebrow">${esc(t.comoManana)}</span><ol class="pr-pasos pr-pasos--futuro">${manana}</ol></div>
</div>
<p class="pr-nota-grande" id="pr-como">${esc(cat.contratacion.nota[lang])}</p>
</div></section>

<section class="section-sm" data-amb="cian" aria-label="${esc(mk.titulo[lang])}"><div class="container">
<details class="mercado mercado--plegado rise" id="pr-mk-t">
  <summary class="mercado-t"><span>${esc(mk.titulo[lang])}</span><i class="mercado-cuantas">${mk.filas.length} ${esc(t.mkCuantas)}</i></summary>
  <ul class="mercado-l mercado-l--fuentes">${mkFilas}</ul>
  <p class="mercado-p">${esc(mk.sub[lang])}</p>
  <p class="mercado-p mercado-p--cierre">${esc(mk.cierre[lang])}</p>
</details>
</div></section>

<section class="section-sm" data-amb="cian" aria-labelledby="pr-packs-t"><div class="container">
<span class="eyebrow">${esc(t.packs)}</span>
<h2 id="pr-packs-t" class="h-sec">${esc(t.packsSub)}</h2>
<div class="pr-rej pr-rej--packs">${cat.packs.map((p) => fichaPack(p, lang, t)).join('\n')}</div>
</div></section>

<section class="section-sm" data-amb="verde" aria-labelledby="pr-cat-t"><div class="container">
<span class="eyebrow">${esc(t.catalogo)}</span>
<h2 id="pr-cat-t" class="h-sec">${esc(t.catalogoSub)}</h2>
<div class="pr-filtros" role="group" aria-label="${esc(t.filtros)}">
  <div class="pr-filtro-fila">${chipsCat}</div>
  <details class="pr-filtro-mas"><summary>${esc(t.filtros)}</summary>
    <div class="pr-filtro-bloque"><span class="pr-filtro-t">${esc(t.filtroSector)}</span><div class="pr-filtro-fila">${chipsSector}</div></div>
    <div class="pr-filtro-bloque"><span class="pr-filtro-t">${esc(t.filtroNecesidad)}</span><div class="pr-filtro-fila">${chipsNec}</div></div>
  </details>
</div>
<p class="pr-vacio" hidden>${esc(t.nadaFiltro)}</p>
${grupos}
</div></section>

<section class="section-sm edge-top" data-amb="violeta" aria-labelledby="pr-conf-t"><div class="container">
<div class="pr-conf">
  <div><span class="eyebrow">${esc(t.config)}</span><h2 id="pr-conf-t" class="h-sec">${esc(t.configSub)}</h2></div>
  <a class="btn btn-primary" href="${base}/contacto#configurador">${esc(t.configCta)}</a>
</div>
<p class="pr-dudas">${esc(t.dudas)} <a href="${base}/faq">${esc(t.dudasCta)}</a></p>
</div></section>`;
}

/* La cáscara sale de una página que ya existe: mismo head, misma cabecera,
   mismo pie. Así no hay una segunda versión del sistema visual que mantener. */
function generar(lang) {
  const molde = lang === 'en' ? 'en/servicios.html' : 'servicios.html';
  const destino = lang === 'en' ? 'en/precios.html' : 'precios.html';
  const t = T[lang];
  let h = fs.readFileSync(path.join(RAIZ, molde), 'utf8');
  const iMain = h.indexOf('<main id="main-content">') + '<main id="main-content">'.length;
  const fMain = h.indexOf('</main>');
  h = h.slice(0, iMain) + '\n' + cuerpo(lang) + '\n' + h.slice(fMain);
  /* Metadatos propios */
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc(t.metaT)}</title>`);
  h = h.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(t.metaD)}$2`);
  h = h.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(t.metaT)}$2`);
  h = h.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(t.metaD)}$2`);
  h = h.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(t.metaT)}$2`);
  h = h.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(t.metaD)}$2`);
  h = h.replace(/(<link rel="canonical" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1${lang === 'en' ? '/en' : ''}/precios$2`);
  h = h.replace(/(<meta property="og:url" content="https:\/\/dcodepartners\.com)[^"]*(")/, `$1${lang === 'en' ? '/en' : ''}/precios$2`);
  h = h.replace(/(<link rel="alternate" hreflang="es" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1/precios$2`);
  h = h.replace(/(<link rel="alternate" hreflang="en" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1/en/precios$2`);
  h = h.replace(/(<link rel="alternate" hreflang="x-default" href="https:\/\/dcodepartners\.com)[^"]*(")/, `$1/precios$2`);
  /* El conmutador de idioma de la cabecera apunta a su pareja */
  h = h.replace(/(<a href=")[^"]*(" hreflang="es" lang="es" data-lang="es")/, `$1/precios$2`);
  h = h.replace(/(<a href=")[^"]*(" hreflang="en" lang="en" data-lang="en")/, `$1/en/precios$2`);
  /* La cáscara viene de Servicios y trae su «estás aquí» puesto. En esta
     página eso es mentira: el menú anunciaría Servicios mientras se lee
     Precios. Se quita de donde estaba y se pone donde toca —aplicar-precios
     no puede hacerlo porque esta página se regenera entera después. */
  h = h.replace(/(<a href="[^"]*")\s+aria-current="page"(>)/g, '$1$2');
  h = h.replace(new RegExp('(<li><a href="' + (lang === 'en' ? '/en' : '') + '/precios")(>)'), '$1 aria-current="page"$2');

  /* JSON-LD de la página molde: fuera, no describe esto */
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  /* La hoja y el guion de esta sección */
  /* Delante de las hojas del tema: tema.css y superficies.css tienen que ser
     las dos últimas para poder mandar sobre todo lo demás (check:tema lo
     vigila, y por eso esto no va pegado a </head>). */
  if (!h.includes('precios.css')) {
    h = h.replace(/(<link rel="stylesheet" href="\/assets\/css\/tema-claro\.css)/,
      '<link rel="stylesheet" href="/assets/css/precios.css?v=0">\n$1');
  }
  if (!h.includes('catalogo-datos.js')) {
    h = h.replace(/(\s*<\/body>)/, ' <script src="/assets/js/catalogo-datos.js?v=0" defer></script> <script src="/assets/js/precios.js?v=0" defer></script>$1');
  }
  fs.writeFileSync(path.join(RAIZ, destino), h);
  return destino;
}

const hechas = ['es', 'en'].map(generar);

/* Los mismos datos, para filtrar sin recargar y para la estimación. */
const datos = {
  revisado: cat.revisado,
  productos: cat.productos.map((p) => ({
    id: p.id, cat: p.cat, estado: p.estado, setup: p.setup, mes: p.mes,
    sectores: p.sectores, necesidad: p.necesidad, extra: !!p.extra,
    es: { nombre: p.es.nombre, precio: p.es.precio, precio_mes: p.es.precio_mes || '' },
    en: { nombre: p.en.nombre, precio: p.en.precio, precio_mes: p.en.precio_mes || '' },
  })),
  packs: cat.packs.map((p) => ({
    id: p.id, lleva: p.lleva, setup: p.setup, mes: p.mes,
    es: { nombre: p.es.nombre }, en: { nombre: p.en.nombre },
  })),
  aviso: cat.aviso,
};
fs.writeFileSync(path.join(RAIZ, 'assets/js/catalogo-datos.js'),
  `/* GENERADO por scripts/build-catalogo.mjs a partir de catalogo.json. No editar a mano. */\nwindow.DCP_CATALOGO = ${JSON.stringify(datos, null, 1)};\n`);

console.log(`✓ build:catalogo — ${hechas.join(', ')} y assets/js/catalogo-datos.js desde catalogo.json (${cat.productos.length} productos, ${cat.packs.length} packs)`);
