/* ==========================================================================
   PLANTILLA COMÚN (sistema «Instalación»)
   Cabeza, cabecera, menú y pie de TODAS las páginas reconstruidas, en ES y EN.
   Una sola fuente: cambiar la navegación aquí la cambia en todo el sitio.
   ========================================================================== */

import fs from "node:fs";
export const SITIO = "https://dcodepartners.com";
const CHAT = { es: fs.readFileSync(new URL("./paginas/chat.es.html", import.meta.url), "utf8"), en: fs.readFileSync(new URL("./paginas/chat.en.html", import.meta.url), "utf8") };

const LOGO = `<svg viewBox="0 0 120 100" aria-hidden="true" focusable="false"><g fill="currentColor"><rect x="26" y="1" width="16" height="16" rx="2"/><rect x="1" y="27" width="13" height="13" rx="2"/><rect x="35" y="26" width="13" height="13" rx="2"/><rect x="2" y="64" width="12" height="12" rx="2"/><rect x="35" y="64" width="13" height="13" rx="2"/><rect x="26" y="83" width="16" height="16" rx="2"/><path d="M48 1H86A32 32 0 0 1 118 33V38H102V33A16 16 0 0 0 86 17H48Z"/><rect x="102" y="43" width="16" height="16" rx="2"/><path d="M48 99H86A32 32 0 0 0 118 67V63H102V67A16 16 0 0 1 86 83H48Z"/></g><rect x="16" y="45" width="15" height="15" rx="2" fill="var(--aire)"/></svg>`;
export const FLECHA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>`;
const CHEV = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;
const SOL = `<svg class="i-sol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
const LUNA = `<svg class="i-luna" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>`;
const MENU = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>`;
const CERRAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`;

/* Rutas equivalentes ES ↔ EN: el EN vive bajo /en con el mismo nombre. */
export const enRuta = (ruta) => (ruta === "/" ? "/en" : "/en" + ruta);
export const esRuta = (ruta) => (ruta === "/en" ? "/" : ruta.replace(/^\/en/, ""));

const T = {
  es: {
    saltar: "Saltar al contenido",
    principal: "Principal",
    que: "Qué hacemos", finance: "Finance", os: "D-Code OS", precios: "Precios", metodo: "Método", casos: "Casos",
    cta: "Reservar una llamada", menu: "Abrir menú", cerrarMenu: "Cerrar menú", tema: "Cambiar entre modo oscuro y claro",
    todo: "Ver todo lo que construimos",
    plano: [
      ["01", "/servicios/automatizaciones", "Automatizaciones", "Lo que se repite cada semana, hecho solo"],
      ["02", "/servicios/agentes-de-ia", "Agentes de IA", "Atienden y responden con tus datos"],
      ["03", "/servicios/integraciones", "Integraciones", "Tus herramientas hablándose"],
      ["04", "/servicios/sistemas-a-medida", "Sistemas a medida", "Lo que ninguna herramienta comprada hace"],
      ["05", "/sistema-financiero", "D-Code Finance", "Facturar, cobrar y saber lo que hay"],
      ["06", "/precios#g-os", "D-Code OS", "La capa que conecta tus sistemas"],
      ["07", "/servicios/paginas-web", "Páginas web", "Hecha, rehecha o conectada"],
      ["08", "/que-hacemos", "Por área de la empresa", "Comercial, operaciones, finanzas…"],
    ],
    planoT: "Lo que se instala", planoD: "Cada pieza resuelve un trabajo concreto y se conecta con las demás. Nada se vende suelto si no hace falta.",
    pie: {
      frase: "Construimos el sistema que conecta tu empresa: automatizaciones, agentes de IA e integraciones, sobre tus datos. Madrid, España.",
      cols: [
        ["Qué hacemos", [["/que-hacemos", "Todo lo que hacemos"], ["/servicios/automatizaciones", "Automatizaciones"], ["/servicios/agentes-de-ia", "Agentes de IA"], ["/servicios/integraciones", "Integraciones"], ["/servicios/sistemas-a-medida", "Sistemas a medida"], ["/servicios/paginas-web", "Páginas web"], ["/sistema-financiero", "D-Code Finance"]]],
        ["Por área", [["/departamentos/comercial", "Comercial"], ["/departamentos/marketing", "Marketing"], ["/departamentos/clientes", "Clientes"], ["/departamentos/produccion", "Operaciones"], ["/departamentos/finanzas", "Finanzas"], ["/departamentos/soporte", "Soporte"], ["/departamentos/administracion", "Administración"], ["/departamentos/direccion", "Dirección"]]],
        ["Empresa", [["/metodo", "Método"], ["/garantias", "Garantías y proceso"], ["/conocenos", "Conócenos"], ["/casos-exito", "Casos internos"], ["/cambios-en-proceso", "En curso"], ["/blog", "Blog"], ["/precios", "Precios"], ["/faq", "Preguntas frecuentes"], ["/contacto", "Contacto"]]],
        ["Legal", [["/privacidad", "Privacidad"], ["/aviso-legal", "Aviso legal"], ["/cookies", "Cookies"], ["/seguridad", "Seguridad de la información"], ["/condiciones-contratacion", "Condiciones de contratación"], ["/acuerdo-encargado-tratamiento", "Encargado de tratamiento"]]],
      ],
      base: "© 2026 D-Code Partners · Madrid",
      baseDer: "Precios sin IVA · Sin permanencia",
    },
  },
  en: {
    saltar: "Skip to content",
    principal: "Main",
    que: "What we build", finance: "Finance", os: "D-Code OS", precios: "Pricing", metodo: "Method", casos: "Cases",
    cta: "Book a call", menu: "Open menu", cerrarMenu: "Close menu", tema: "Switch between dark and light mode",
    todo: "See everything we build",
    plano: [
      ["01", "/servicios/automatizaciones", "Automations", "What repeats every week, done on its own"],
      ["02", "/servicios/agentes-de-ia", "AI agents", "They answer with your business data"],
      ["03", "/servicios/integraciones", "Integrations", "Your tools talking to each other"],
      ["04", "/servicios/sistemas-a-medida", "Custom systems", "What no off-the-shelf tool does"],
      ["05", "/sistema-financiero", "D-Code Finance", "Invoice, collect and know where you stand"],
      ["06", "/precios#g-os", "D-Code OS", "The layer that connects your systems"],
      ["07", "/servicios/paginas-web", "Websites", "Built, rebuilt or connected"],
      ["08", "/que-hacemos", "By company area", "Sales, operations, finance…"],
    ],
    planoT: "What gets installed", planoD: "Each piece solves one specific job and connects to the rest. Nothing is sold on its own unless it has to be.",
    pie: {
      frase: "We build the system that connects your company: automations, AI agents and integrations, on your own data. Madrid, Spain.",
      cols: [
        ["What we build", [["/que-hacemos", "Everything we build"], ["/servicios/automatizaciones", "Automations"], ["/servicios/agentes-de-ia", "AI agents"], ["/servicios/integraciones", "Integrations"], ["/servicios/sistemas-a-medida", "Custom systems"], ["/servicios/paginas-web", "Websites"], ["/sistema-financiero", "D-Code Finance"]]],
        ["By area", [["/departamentos/comercial", "Sales"], ["/departamentos/marketing", "Marketing"], ["/departamentos/clientes", "Customers"], ["/departamentos/produccion", "Operations"], ["/departamentos/finanzas", "Finance"], ["/departamentos/soporte", "Support"], ["/departamentos/administracion", "Administration"], ["/departamentos/direccion", "Management"]]],
        ["Company", [["/metodo", "Method"], ["/garantias", "Guarantees and process"], ["/conocenos", "About us"], ["/casos-exito", "In-house cases"], ["/cambios-en-proceso", "In progress"], ["/blog", "Blog"], ["/precios", "Pricing"], ["/faq", "FAQ"], ["/contacto", "Contact"]]],
        ["Legal", [["/privacidad", "Privacy"], ["/aviso-legal", "Legal notice"], ["/cookies", "Cookies"], ["/seguridad", "Information security"], ["/condiciones-contratacion", "Terms of contract"], ["/acuerdo-encargado-tratamiento", "Data processing agreement"]]],
      ],
      base: "© 2026 D-Code Partners · Madrid",
      baseDer: "Prices exclude VAT · No lock-in",
    },
  },
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const L = (lang, ruta) => (lang === "en" ? enRuta(ruta.split("#")[0]) + (ruta.includes("#") ? "#" + ruta.split("#")[1] : "") : ruta);

/* Analítica y consentimiento: SOLO en el dominio real (se conserva el
   comportamiento de producción al pie de la letra). */
const ANALITICA = `<script>
(function () {
  var host = location.hostname;
  if (host !== 'dcodepartners.com' && host !== 'www.dcodepartners.com') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', 'G-ZL004F9EBH');
  var cookieyes = document.createElement('script');
  cookieyes.id = 'cookieyes';
  cookieyes.type = 'text/javascript';
  cookieyes.src = 'https://cdn-cookieyes.com/client_data/4d2e8fd4065176703ddc3e2999debec6/script.js';
  cookieyes.onload = function () {
    var analitica = document.createElement('script');
    analitica.async = true;
    analitica.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZL004F9EBH';
    document.head.appendChild(analitica);
  };
  document.head.appendChild(cookieyes);
})();
</script>`;

/* Tema: se decide antes de pintar (sin parpadeo). Oscuro por defecto; la
   preferencia guardada manda. Si el almacenamiento falla, oscuro. */
const TEMA = `<script>(function(){var r=document.documentElement,t=null;try{t=localStorage.getItem('dcp-tema')}catch(e){}r.setAttribute('data-theme',t==='light'?'light':'dark');r.classList.remove('sin-js');})();</script>`;

export function cabeza(p) {
  const { lang, ruta, titulo, descripcion, imagen = "/assets/og-image" + (p.lang === "en" ? "-en" : "") + ".png", noindex = false, jsonld = [], css = [], preload = [], extraHead = "" } = p;
  const url = SITIO + (ruta === "/" ? "/" : ruta);
  const es = SITIO + (esRuta(ruta) === "/" ? "/" : esRuta(ruta)), en = SITIO + enRuta(esRuta(ruta));
  const alt = p.sinEn ? "" : `<link rel="alternate" hreflang="es" href="${es}">
<link rel="alternate" hreflang="en" href="${en}">
<link rel="alternate" hreflang="x-default" href="${es}">`;
  return `<!DOCTYPE html>
<html lang="${lang}" class="sin-js" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${TEMA}
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}">
<link rel="canonical" href="${url}">
${alt}
<meta name="theme-color" content="#121314" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#e7e8e5" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png">
<link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/assets/site.webmanifest">
<meta property="og:type" content="website">
<meta property="og:site_name" content="D-Code Partners">
<meta property="og:locale" content="${lang === "en" ? "en_US" : "es_ES"}">
<meta property="og:locale:alternate" content="${lang === "en" ? "es_ES" : "en_US"}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITIO}${imagen}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(descripcion)}">
<meta name="twitter:image" content="${SITIO}${imagen}">
<link rel="preload" href="/assets/v2/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
${preload.join("\n")}
<link rel="stylesheet" href="/assets/v2/dc.css">
${css.map((c) => `<link rel="stylesheet" href="${c}">`).join("\n")}
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
${extraHead}
${ANALITICA}
</head>`;
}

export function cabecera(lang, ruta) {
  const t = T[lang];
  const base = esRuta(ruta);
  const cur = (r) => (base === r || (r !== "/" && base.startsWith(r + "/")) ? ' aria-current="page"' : "");
  const otra = lang === "es" ? enRuta(base) : base;
  const plano = t.plano.map(([n, r, ti, d]) => `<li><a href="${L(lang, r)}"><span class="plano-num">${n}</span><span class="plano-t">${esc(ti)}</span><span class="plano-d">${esc(d)}</span></a></li>`).join("");
  return `<a class="saltar" href="#contenido">${t.saltar}</a>
<header class="cab" data-cab>
  <div class="marco cab-in">
    <a class="marca" href="${L(lang, "/")}" aria-label="D-Code Partners">${LOGO}<span class="marca-n" aria-hidden="true">D-Code<small>PARTNERS</small></span></a>
    <nav class="nav" aria-label="${t.principal}">
      <ul>
        <li><button type="button" class="nav-b" aria-expanded="false" aria-controls="plano" data-plano-b>${t.que} ${CHEV}</button></li>
        <li><a href="${L(lang, "/sistema-financiero")}"${cur("/sistema-financiero")}>${t.finance}</a></li>
        <li><a href="${L(lang, "/precios")}"${cur("/precios")}>${t.precios}</a></li>
        <li><a href="${L(lang, "/metodo")}"${cur("/metodo")}>${t.metodo}</a></li>
      </ul>
    </nav>
    <div class="cab-der">
      <button type="button" class="ctrl" data-tema aria-label="${t.tema}">${SOL}${LUNA}</button>
      <div class="idioma" role="group" aria-label="Idioma / Language"><a href="${lang === "es" ? base : otra}" hreflang="es" lang="es"${lang === "es" ? ' aria-current="true"' : ""}>ES</a><a href="${lang === "en" ? enRuta(base) : otra}" hreflang="en" lang="en"${lang === "en" ? ' aria-current="true"' : ""}>EN</a></div>
      <a class="boton boton--principal boton--peq" href="${L(lang, "/contacto")}">${t.cta}</a>
      <button type="button" class="ctrl menu-b" data-menu aria-label="${t.menu}" aria-expanded="false" aria-controls="hoja">${MENU}</button>
    </div>
  </div>
  <div class="plano" id="plano" data-plano>
    <div class="marco plano-in">
      <div><p class="etiqueta">${t.planoT}</p><p class="texto" style="margin-top:16px">${t.planoD}</p><p style="margin-top:24px"><a class="enlace" href="${L(lang, "/que-hacemos")}">${t.todo} ${FLECHA}</a></p></div>
      <ul class="plano-lista">${plano}</ul>
    </div>
  </div>
</header>
<div class="hoja" id="hoja" data-hoja role="dialog" aria-modal="true" aria-label="${t.principal}" hidden>
  <div class="hoja-cab"><a class="marca" href="${L(lang, "/")}" aria-label="D-Code Partners">${LOGO}<span class="marca-n" aria-hidden="true">D-Code<small>PARTNERS</small></span></a><button type="button" class="ctrl" data-menu-cerrar aria-label="${t.cerrarMenu}">${CERRAR}</button></div>
  <nav aria-label="${t.principal}"><ul>
    ${t.plano.map(([n, r, ti]) => `<li><a href="${L(lang, r)}">${esc(ti)} <small>${n}</small></a></li>`).join("")}
    <li><a href="${L(lang, "/precios")}">${t.precios} <small>09</small></a></li>
    <li><a href="${L(lang, "/metodo")}">${t.metodo} <small>10</small></a></li>
    <li><a href="${L(lang, "/casos-exito")}">${t.casos} <small>11</small></a></li>
  </ul></nav>
  <div class="hoja-pie">
    <a class="boton boton--principal" href="${L(lang, "/contacto")}">${t.cta} ${FLECHA}</a>
    <div style="display:flex;gap:12px"><button type="button" class="ctrl" data-tema aria-label="${t.tema}">${SOL}${LUNA}</button><div class="idioma" role="group" aria-label="Idioma / Language"><a href="${lang === "es" ? base : otra}" hreflang="es" lang="es"${lang === "es" ? ' aria-current="true"' : ""}>ES</a><a href="${lang === "en" ? enRuta(base) : otra}" hreflang="en" lang="en"${lang === "en" ? ' aria-current="true"' : ""}>EN</a></div></div>
  </div>
</div>`;
}

/* Redes: iconos de trazo propios (mismo grosor que el resto de iconos del sitio), sin colores de marca. */
export const REDES = [
  ["Instagram", "https://www.instagram.com/d_codepartners/", "@d_codepartners", '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r=".6" fill="currentColor" stroke="none"/>'],
  ["LinkedIn", "https://www.linkedin.com/in/diego-si%C3%B1eriz-b45319427/", "Diego Siñeriz", '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="3"/><path d="M8 10.5v6M8 7.4v.1M11.6 16.5v-6M11.6 13.2c0-1.6 1-2.8 2.5-2.8s2.3 1 2.3 2.7v3.4"/>'],
  ["Facebook", "https://www.facebook.com/profile.php?id=61593223960437", "D-Code Partners", '<circle cx="12" cy="12" r="8.8"/><path d="M13.3 20.8v-7.6h2.4M13.3 20.8v-7.6M10.4 13.2h2.9M13.3 13.2v-2.3c0-1.4.8-2.2 2.2-2.2h1"/>'],
];
function redes(lang) {
  const sigue = lang === "en" ? "Follow D-Code" : "Síguenos";
  return `<nav class="pie-redes" aria-label="${sigue}"><p class="rotulo">${sigue}</p><ul>${REDES.map(([n, u, h, d]) => `<li><a class="red" href="${u}" target="_blank" rel="noopener noreferrer me" aria-label="${n}: ${esc(h)}${lang === "en" ? " (opens in a new tab)" : " (se abre en otra pestaña)"}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg><span class="red-n" aria-hidden="true">${n}</span></a></li>`).join("")}</ul></nav>`;
}

export function pie(lang) {
  const t = T[lang].pie;
  return `<footer class="pie">
  <div class="marco">
    <div class="pie-g">
      <div class="pie-marca"><a class="marca" href="${L(lang, "/")}" aria-label="D-Code Partners">${LOGO}<span class="marca-n" aria-hidden="true">D-Code<small>PARTNERS</small></span></a><p>${esc(t.frase)}</p><p style="margin-top:12px"><a href="mailto:dcodedepartment@gmail.com">dcodedepartment@gmail.com</a></p></div>
      ${t.cols.map(([h, ls]) => `<nav aria-label="${esc(h)}"><h2 class="rotulo">${esc(h)}</h2><ul>${ls.map(([r, n]) => `<li><a href="${L(lang, r)}">${esc(n)}</a></li>`).join("")}</ul></nav>`).join("\n      ")}
    </div>
    ${redes(lang)}
    <div class="pie-base"><p class="rotulo">${t.base}</p><p class="rotulo">${t.baseDer}</p></div>
  </div>
</footer>`;
}

export function pagina(p, cuerpo, scripts = []) {
  return `${cabeza(p)}
<body${p.claseBody ? ` class="${p.claseBody}"` : ""}>
${cabecera(p.lang, p.ruta)}
<main id="contenido">
${cuerpo}
</main>
${pie(p.lang)}
${p.sinChat ? "" : CHAT[p.lang]}
<script type="module" src="/assets/v2/js/sitio.js"></script>
${scripts.map((s) => (s.startsWith("<") ? s : `<script type="module" src="${s}"></script>`)).join("\n")}
</body>
</html>
`;
}
