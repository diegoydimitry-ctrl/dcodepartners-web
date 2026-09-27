#!/usr/bin/env node
/* ==========================================================================
   Construye las páginas del sistema «Instalación» desde sus módulos de
   contenido. Uso: node scripts/v2/build.mjs  (después: npm run build:precios)
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pagina, SITIO } from "./plantilla.mjs";
import { inicio, META as META_INICIO } from "./paginas/inicio.mjs";
import fs2 from "node:fs";
import { precios, META_PRECIOS, JSONLD_PRECIOS } from "./paginas/precios.mjs";
const DX = (lang) => fs2.readFileSync(new URL(`./paginas/diagnostico.${lang}.html`, import.meta.url), "utf8");
const DIAG = {
  es: { titulo: "Diagnóstico gratuito: cuánto tiempo perdéis a mano | D-Code", descripcion: "Tres preguntas y una estimación con tus horas y tu coste por hora: cuánto trabajo repetitivo podría hacer un sistema en tu empresa. Orientativo y sin datos personales.", et: "Diagnóstico · 30 segundos", h1: "¿Dónde se os va el tiempo?", lead: "Tres toques y una estimación con vuestras horas y vuestro coste por hora. Orientativa, sin datos personales." },
  en: { titulo: "Free assessment: how much time you lose to manual work | D-Code", descripcion: "Three questions and an estimate with your own hours and hourly cost: how much repetitive work a system could take over in your company. Indicative, no personal data.", et: "Assessment · 30 seconds", h1: "Where does your time go?", lead: "Three taps and an estimate with your own hours and hourly cost. Indicative, no personal data." },
};
const CT = (lang) => JSON.parse(fs2.readFileSync(new URL(`./paginas/contacto.${lang}.json`, import.meta.url), "utf8"));
const contacto = (lang) => { const c = CT(lang); return `<header class="pag-cab"><div class="marco"><p class="etiqueta aparece">${c.hero[0]}</p><h1 class="h1 aparece" style="--i:1">${c.hero[1]}</h1><p class="lead aparece" style="--i:2">${c.hero[2]}</p></div></header>
<section class="contacto"><div class="marco contacto-in">
  <div class="contacto-main">
    <section class="cfg" id="configurador" aria-labelledby="cfg-t"></section>
    <div class="formulario" id="formulario">${c.form}</div>
  </div>
  <aside class="contacto-lado" aria-label="${lang === "en" ? "Direct contact" : "Contacto directo"}">
    <dl class="directo">${c.rows.map(([k, v]) => `<div><dt class="rotulo">${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
    <p class="contacto-faq"><span class="peq">${c.faq[0]}</span> <a class="enlace" href="${c.faq[1]}">${c.faq[2]}</a></p>
  </aside>
</div></section>`; };
const diagnostico = (lang) => `<div class="marco diag-in"><div style="display:grid;gap:24px;padding-top:72px"><p class="etiqueta">${DIAG[lang].et}</p><h1 class="h1">${DIAG[lang].h1}</h1><p class="lead">${DIAG[lang].lead}</p></div><div style="padding-top:72px">${DX(lang)}</div></div>`;

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const escribir = (rel, html) => { const f = path.join(RAIZ, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); console.log("  " + rel); };

const ORG = { "@context": "https://schema.org", "@type": "Organization", "@id": SITIO + "/#organizacion", name: "D-Code Partners", alternateName: "D-Code", url: SITIO + "/", logo: SITIO + "/assets/logo/dcode-icon-sm.png", image: SITIO + "/assets/og-image.png", email: "dcodedepartment@gmail.com", sameAs: ["https://www.instagram.com/d_codepartners/", "https://www.facebook.com/profile.php?id=61593223960437"], address: { "@type": "PostalAddress", addressLocality: "Madrid", addressCountry: "ES" }, founder: [{ "@type": "Person", name: "Diego Siñeriz", sameAs: "https://www.linkedin.com/in/diego-si%C3%B1eriz-b45319427/" }, { "@type": "Person", name: "Dimitry Sosenko" }] };
const WEB = (lang) => ({ "@context": "https://schema.org", "@type": "WebSite", "@id": SITIO + "/#web", url: SITIO + "/", name: "D-Code Partners", inLanguage: lang === "en" ? "en" : "es", publisher: { "@id": SITIO + "/#organizacion" } });

const PAGINAS = [
  {
    lang: "es", ruta: "/", archivo: "index.html", ...META_INICIO.es,
    css: ["/assets/v2/inicio.css"], jsonld: [ORG, WEB("es")],
    preload: ['<link rel="modulepreload" href="/assets/v2/js/inicio.js">', '<link rel="preload" as="image" href="/assets/v2/img/piezas/1100/001.webp" media="(min-width: 761px)">'],
    cuerpo: () => inicio("es"), scripts: ["/assets/v2/js/inicio.js"],
  },
  {
    lang: "en", ruta: "/en", archivo: "en/index.html", ...META_INICIO.en,
    css: ["/assets/v2/inicio.css"], jsonld: [ORG, WEB("en")],
    preload: ['<link rel="modulepreload" href="/assets/v2/js/inicio.js">', '<link rel="preload" as="image" href="/assets/v2/img/piezas/1100/001.webp" media="(min-width: 761px)">'],
    cuerpo: () => inicio("en"), scripts: ["/assets/v2/js/inicio.js"],
  },
  ...["es", "en"].map((lang) => ({
    lang, ruta: lang === "en" ? "/en/diagnostico" : "/diagnostico", archivo: (lang === "en" ? "en/" : "") + "diagnostico.html",
    titulo: DIAG[lang].titulo, descripcion: DIAG[lang].descripcion, css: ["/assets/v2/diagnostico.css"],
    jsonld: [ORG], cuerpo: () => diagnostico(lang), scripts: ["/assets/v2/js/diagnostico.js"],
  })),
  ...["es", "en"].map((lang) => { const c = CT(lang); return {
    lang, ruta: lang === "en" ? "/en/contacto" : "/contacto", archivo: (lang === "en" ? "en/" : "") + "contacto.html",
    titulo: c.meta.title, descripcion: c.meta.desc, css: ["/assets/v2/interior.css", "/assets/v2/contacto.css"], jsonld: c.ld.map((j) => JSON.parse(j)),
    extraHead: '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>',
    cuerpo: () => contacto(lang), scripts: ['<script src="/assets/js/catalogo-datos.js" defer></script>', '<script src="/assets/js/configurador.js" defer></script>'],
  }; }),
  ...["es", "en"].map((lang) => ({
    lang, ruta: lang === "en" ? "/en/precios" : "/precios", archivo: (lang === "en" ? "en/" : "") + "precios.html", ...META_PRECIOS[lang],
    css: ["/assets/v2/interior.css", "/assets/v2/precios.css"], jsonld: [ORG, JSONLD_PRECIOS(lang)], cuerpo: () => precios(lang), scripts: [],
  })),
];

console.log("Sistema «Instalación»:");
for (const p of PAGINAS) escribir(p.archivo, pagina(p, p.cuerpo(), p.scripts));
