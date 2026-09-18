#!/usr/bin/env node
// Genera las tres landings y la página de gracias en la raíz del repositorio.
//   node marketing/google-ads/landings/generar.mjs
// Las páginas generadas SÍ se versionan (Vercel sirve estáticos tal cual).
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANDINGS, COMUN } from './contenido.mjs';

const require = createRequire(import.meta.url);
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const { SECTORES, TAMANOS, CONSENT_VERSION } = require(path.join(RAIZ, 'api/_lib/ads/schema.js'));
const DEMOS = require(path.join(RAIZ, 'assets/ads/demos.js'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ver = (rel) => createHash('sha1').update(readFileSync(path.join(RAIZ, rel))).digest('hex').slice(0, 10);

const LOGO = '<svg width="30" height="25" viewBox="0 0 120 100" aria-hidden="true" focusable="false"><g fill="currentColor"><rect x="26" y="1" width="16" height="16" rx="2"/><rect x="1" y="27" width="13" height="13" rx="2"/><rect x="35" y="26" width="13" height="13" rx="2"/><rect x="2" y="64" width="12" height="12" rx="2"/><rect x="35" y="64" width="13" height="13" rx="2"/><rect x="26" y="83" width="16" height="16" rx="2"/><path d="M48 1H86A32 32 0 0 1 118 33V38H102V33A16 16 0 0 0 86 17H48Z"/><rect x="102" y="43" width="16" height="16" rx="2"/><path d="M48 99H86A32 32 0 0 0 118 67V63H102V67A16 16 0 0 1 86 83H48Z"/></g><rect x="16" y="45" width="15" height="15" rx="2" fill="#5b8cff"/></svg>';

// Puerta de consentimiento: MISMO patrón que el resto de la web
// (scripts/check-consentimiento.mjs lo comprueba) + Consent Mode v2 con
// todo DENEGADO por defecto antes de cualquier etiqueta de Google.
const PUERTA = `<!-- Consentimiento y analitica: SOLO en el dominio real (mismo patron que el resto
     de la web). Consent Mode v2: todo denegado por defecto; CookieYes lo actualiza.
     La analitica se crea DENTRO del onload de CookieYes. -->
<script>
(function () {
  var host = location.hostname;
  if (host !== 'dcodepartners.com' && host !== 'www.dcodepartners.com') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);
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

function head({ title, description, canonical, extra = '' }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="#06080d">
<link rel="canonical" href="https://dcodepartners.com${canonical}">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/spacegrotesk-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/ads/ads.css?v=${ver('assets/ads/ads.css')}">
${extra}${PUERTA}
</head>`;
}

const cabecera = (ctaDestino) => `<a class="skip" href="#contenido">Saltar al contenido</a>
<header class="top">
  <a class="logo" href="/" aria-label="D-Code Partners, inicio">${LOGO}<span>D-Code<small>PARTNERS</small></span></a>
  <a class="btn btn-ghost" href="${ctaDestino}" data-cta="diagnostico" data-modo="diagnostico" data-pos="cabecera">Reservar diagnóstico</a>
</header>`;

const pie = `<footer class="pie"><div class="wrap">
  <p>D-Code Partners · Madrid, España · <a href="mailto:dcodedepartment@gmail.com">dcodedepartment@gmail.com</a></p>
  <p><a href="/privacidad">Política de privacidad</a> · <a href="/cookies">Cookies</a> · <a href="/aviso-legal">Aviso legal</a></p>
</div></footer>`;

function videoHtml(demo) {
  const mp4 = `assets/ads/video/demo-${demo}.mp4`;
  if (!existsSync(path.join(RAIZ, mp4))) return '';
  return `
      <details class="demo-video">
        <summary>Ver como vídeo (${DEMOS[demo].duracion} s, con subtítulos, sin sonido)</summary>
        <video data-demo-video="${demo}" controls muted playsinline preload="none" poster="/assets/ads/video/demo-${demo}.jpg" width="1280" height="720">
          <source src="/${mp4}?v=${ver(mp4)}" type="video/mp4">
          <track kind="captions" src="/assets/ads/video/demo-${demo}.vtt" srclang="es" label="Español" default>
        </video>
      </details>`;
}

function formulario(l) {
  const sectores = Object.keys(SECTORES).map((s) => `<option>${esc(s)}</option>`).join('');
  const tamanos = TAMANOS.map((s) => `<option>${esc(s)}</option>`).join('');
  const ocultos = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'keyword', 'matchtype', 'device', 'landing']
    .map((n) => `<input type="hidden" name="${n}" value="">`).join('\n        ');
  return `
  <section class="s" id="formulario" aria-labelledby="form-titulo">
    <div class="wrap">
      <div class="form-card">
        <h2 id="form-titulo">Reserva tu diagnóstico de 30 minutos</h2>
        <p class="lead">Primero nos cuentas tu caso; en el siguiente paso eliges horario. Si prefieres que te escribamos, envíalo y te respondemos en menos de 24 h laborables.</p>
        <form id="ads-form" data-modo="diagnostico" novalidate>
          <div class="fgrid">
            <div class="field"><label for="f-nombre">Nombre</label><input id="f-nombre" name="nombre" autocomplete="name" required maxlength="100"><span class="field-error" data-error-for="nombre"></span></div>
            <div class="field"><label for="f-empresa">Empresa</label><input id="f-empresa" name="empresa" autocomplete="organization" required maxlength="120"><span class="field-error" data-error-for="empresa"></span></div>
            <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" inputmode="email" autocomplete="email" required maxlength="254"><span class="field-error" data-error-for="email"></span></div>
            <div class="field"><label for="f-web">Web <span class="opt">(para preparar el diagnóstico)</span></label><input id="f-web" name="web" inputmode="url" autocomplete="url" placeholder="tuempresa.com" maxlength="200"><span class="field-error" data-error-for="web"></span></div>
            <div class="field"><label for="f-telefono">Teléfono <span class="opt">(opcional)</span></label><input id="f-telefono" name="telefono" type="tel" inputmode="tel" autocomplete="tel" maxlength="30"><span class="field-error" data-error-for="telefono"></span></div>
            <div class="field"><label for="f-sector">Sector</label><select id="f-sector" name="sector" required><option value="">Elige uno</option>${sectores}</select><span class="field-error" data-error-for="sector"></span></div>
            <div class="field"><label for="f-tamano">Número de personas en la empresa</label><select id="f-tamano" name="tamano" required><option value="">Elige uno</option>${tamanos}</select><span class="field-error" data-error-for="tamano"></span></div>
            <div class="field full"><label for="f-necesidad">¿Qué proceso os quita más tiempo?</label><textarea id="f-necesidad" name="necesidad" required maxlength="1500" placeholder="Ej.: ${esc(l.demo === 'comercial' ? 'enviamos presupuestos y nadie hace seguimiento' : l.demo === 'atencion' ? 'las consultas de clientes se pierden en el buzón' : 'cada cliente nuevo nos obliga a repetir los mismos pasos')}"></textarea><span class="field-error" data-error-for="necesidad"></span></div>
            <div class="hp" aria-hidden="true"><label for="f-wc">No rellenar</label><input id="f-wc" name="website_confirm" tabindex="-1" autocomplete="off"></div>
            <div class="field full">
              <label class="check"><input type="checkbox" name="privacidad" required> <span>He leído y acepto la <a href="/privacidad" target="_blank" rel="noopener">política de privacidad</a>.</span></label>
              <span class="field-error" data-error-for="privacidad"></span>
              <p class="form-pie">Responsable: D-Code Partners. Finalidad: responder a tu solicitud y preparar el diagnóstico. No se ceden a terceros salvo obligación legal. Puedes ejercer tus derechos en dcodedepartment@gmail.com. Versión ${CONSENT_VERSION}.</p>
            </div>
            <div class="full" id="turnstile-slot"></div>
          </div>
        ${ocultos}
          <button class="btn btn-main" id="form-enviar" type="submit">Continuar y elegir horario</button>
          <p class="form-estado" id="form-estado" role="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  </section>`;
}

function landing(l) {
  const demo = DEMOS[l.demo];
  const transcripcion = demo.pasos.map((p) => `<li>${esc(p.c)}</li>`).join('');
  const faqs = [...l.faq, ...COMUN.faqComun].map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n      ');
  return `${head({ title: l.title, description: l.description, canonical: `/${l.slug}` })}
<body data-landing="/${l.slug}" data-grupo="${l.grupo}">
${cabecera('#formulario')}
<main id="contenido">
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy hero-a">
        <span class="kicker">${esc(l.kicker)}</span>
        <h1>${l.h1}</h1>
        <p class="sub">${esc(l.sub)}</p>
      </div>
      <div class="hero-copy hero-b">
        <ol class="pasos3">${l.pasos.map((p, i) => `<li><b>${i + 1}</b><span>${esc(p)}</span></li>`).join('')}</ol>
        <div class="acts">
          <button type="button" class="btn btn-main" data-demo-start>▶ Ver demo (${demo.duracion} s)</button>
          <a class="btn btn-ghost" href="#formulario" data-cta="diagnostico" data-modo="diagnostico" data-pos="hero">Reservar diagnóstico de 30 min</a>
        </div>
      </div>
      <div class="hero-demo">
        <div id="demo" data-demo="${l.demo}" aria-label="Demostración con datos inventados"></div>
        <p class="nota-demo">Demostración con datos inventados. Muestra lo que D-Code construye; en el diagnóstico lo ves funcionando de verdad.</p>${videoHtml(l.demo)}
        <details class="transcripcion"><summary>Leer la demo paso a paso</summary><ol>${transcripcion}</ol></details>
      </div>
    </div>
  </section>

  <section class="s" aria-labelledby="t-problema">
    <div class="wrap">
      <h2 id="t-problema">${esc(l.problemaTitulo)}</h2>
      <div class="cards">${l.problemas.map(([t, d]) => `<div class="card"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>
    </div>
  </section>

  <section class="s" aria-labelledby="t-sistema">
    <div class="wrap">
      <h2 id="t-sistema">${esc(l.sistemaTitulo)}</h2>
      <p class="lead">${esc(l.sistemaLead)}</p>
      <ol class="flujo">${l.flujo.map(([t, d]) => `<li><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('')}</ol>
    </div>
  </section>

  <section class="s" aria-labelledby="t-como">
    <div class="wrap">
      <h2 id="t-como">Cómo funciona: qué hace el sistema y qué decide una persona</h2>
      <div class="dos">
        <div class="card"><h3>Lo hace el sistema</h3><ul class="lista">${l.sistemaHace.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="card"><h3>Lo decide una persona</h3><ul class="lista">${l.personaDecide.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      </div>
      <p class="acts" style="margin-top:18px"><button type="button" class="btn btn-ghost" data-demo-start>▶ Volver a ver la demo</button></p>
    </div>
  </section>

  <section class="s" aria-labelledby="t-que">
    <div class="wrap">
      <h2 id="t-que">Qué más se puede automatizar</h2>
      <p class="lead">Solo lo que ya sabemos construir y podemos enseñarte funcionando.</p>
      <div class="cards">${COMUN.catalogo.map(([t, d]) => `<div class="card"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>
    </div>
  </section>

  <section class="s" aria-labelledby="t-proceso">
    <div class="wrap">
      <h2 id="t-proceso">Cómo trabajamos</h2>
      <ol class="flujo">${COMUN.proceso.map(([t, d]) => `<li><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('')}</ol>
      <div class="acts" style="margin-top:18px">
        <a class="btn btn-main" href="#formulario" data-cta="diagnostico" data-modo="diagnostico" data-pos="proceso">Reservar diagnóstico de 30 min</a>
        <a class="btn btn-ghost" href="#formulario" data-cta="caso" data-modo="caso" data-pos="proceso">Dejar mi caso</a>
        <span data-whatsapp-slot></span>
      </div>
    </div>
  </section>
${formulario(l)}
  <section class="s faq" aria-labelledby="t-faq">
    <div class="wrap">
      <h2 id="t-faq">Preguntas</h2>
      ${faqs}
    </div>
  </section>
</main>
${pie}
<div class="barra-cta"><a class="btn btn-main" href="#formulario" data-cta="diagnostico" data-modo="diagnostico" data-pos="barra">Reservar diagnóstico</a><a class="btn btn-ghost" href="#formulario" data-cta="caso" data-modo="caso" data-pos="barra">Dejar mi caso</a></div>
<script src="/assets/ads/config.js?v=${ver('assets/ads/config.js')}" defer></script>
<script src="/assets/ads/demos.js?v=${ver('assets/ads/demos.js')}" defer></script>
<script src="/assets/ads/ads.js?v=${ver('assets/ads/ads.js')}" defer></script>
<script src="/assets/ads/demo-player.js?v=${ver('assets/ads/demo-player.js')}" defer></script>
</body>
</html>
`;
}

function gracias() {
  // La referencia (opaca, no personal) se retira de la URL ANTES de que se
  // cargue cualquier etiqueta, para que no llegue a ninguna analítica.
  const limpiar = `<script>
(function () {
  var p = new URLSearchParams(location.search);
  window.__dcodeRef = /^L-[A-Za-z0-9_-]{12}$/.test(p.get('ref') || '') ? p.get('ref') : '';
  window.__dcodeCta = p.get('c') === 'caso' ? 'caso' : 'diagnostico';
  window.__dcodeOrigen = (p.get('o') || '').replace(/[^a-z-]/g, '').slice(0, 60);
  if (location.search) history.replaceState(null, '', location.pathname);
})();
</script>
`;
  return `${head({ title: 'Solicitud recibida | D-Code Partners', description: 'Hemos recibido tu solicitud. Elige horario para el diagnóstico de 30 minutos.', canonical: '/gracias-diagnostico', extra: limpiar })}
<body data-landing="/gracias-diagnostico">
${cabecera('#reserva')}
<main id="contenido">
  <section class="hero">
    <div class="wrap">
      <span class="kicker">Solicitud recibida</span>
      <h1>Gracias. <em>Ya tenemos tu caso.</em></h1>
      <p class="sub" id="g-sub">Lo revisa una persona del equipo y te escribe en menos de 24 h laborables. Si quieres, elige ya el horario del diagnóstico.</p>
      <ol class="pasos3">
        <li><b>1</b><span>Revisamos lo que nos has contado y tu web.</span></li>
        <li><b>2</b><span>Diagnóstico de 30 minutos por videollamada.</span></li>
        <li><b>3</b><span>Solo después, si encaja, una propuesta concreta.</span></li>
      </ol>
    </div>
  </section>
  <section class="s" id="reserva" aria-labelledby="t-reserva">
    <div class="wrap">
      <h2 id="t-reserva">Elige horario para el diagnóstico</h2>
      <p class="lead">Se abre el calendario de reservas (Cal.com). Si prefieres que te propongamos hora, no hagas nada: te escribimos.</p>
      <div class="acts"><button type="button" class="btn btn-main" id="abrir-cal" data-cta="diagnostico" data-pos="gracias">Elegir horario ahora</button></div>
      <div id="cal-inline" style="margin-top:16px"></div>
      <p class="form-estado" id="reserva-estado" role="status" aria-live="polite"></p>
    </div>
  </section>
</main>
${pie}
<script src="/assets/ads/config.js?v=${ver('assets/ads/config.js')}" defer></script>
<script src="/assets/ads/ads.js?v=${ver('assets/ads/ads.js')}" defer></script>
<script src="/assets/ads/gracias.js?v=${ver('assets/ads/gracias.js')}" defer></script>
</body>
</html>
`;
}

for (const l of LANDINGS) {
  writeFileSync(path.join(RAIZ, `${l.slug}.html`), landing(l));
  console.log(`✓ /${l.slug}`);
}
writeFileSync(path.join(RAIZ, 'gracias-diagnostico.html'), gracias());
console.log('✓ /gracias-diagnostico');
