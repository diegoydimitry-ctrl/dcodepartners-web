/*
 * D-Code · landings de Google Ads
 * Atribución, consentimiento, eventos, demo y formulario.
 *
 * Reglas que este fichero cumple y que las pruebas comprueban:
 *  · Nada se guarda en el navegador sin consentimiento de publicidad.
 *  · Las etiquetas de Google solo existen en el dominio real y detrás de
 *    CookieYes (lo hace el <head> de cada página, no este fichero).
 *  · Solo «formulario» puede enviarse como conversión de Google Ads.
 *  · Ningún dato personal en URLs ni en eventos.
 */
(function () {
  'use strict';
  var CFG = window.DCODE_ADS_CONFIG || {};
  var host = location.hostname;
  var ES_PRODUCCION = (CFG.produccionHosts || []).indexOf(host) !== -1;
  var params = new URLSearchParams(location.search);
  var DEBUG = !ES_PRODUCCION || params.get('debug') === '1';
  var CLAVE = 'dcode_ads_attr';

  var estado = window.__dcodeAds = window.__dcodeAds || {
    eventos: [], atribucion: {}, consentimiento: { anuncios: 'desconocido', analitica: 'desconocido' },
    produccion: ES_PRODUCCION, persistido: false
  };

  /* ───────────────────────── eventos ───────────────────────── */
  window.dataLayer = window.dataLayer || [];
  function track(nombre, datos) {
    var d = datos || {};
    d.landing = d.landing || document.body.getAttribute('data-landing') || location.pathname;
    estado.eventos.push({ evento: nombre, datos: d, t: Date.now() });
    // dataLayer local: no sale del navegador salvo que gtag esté cargado.
    window.dataLayer.push(Object.assign({ event: 'dcode_' + nombre }, d));
    if (typeof window.gtag === 'function') window.gtag('event', nombre, d);
    pintarDebug();
  }
  estado.track = track;

  /* ─────────────────────── consentimiento ─────────────────────── */
  function aplicarConsentimiento(anuncios, analitica) {
    var antes = estado.consentimiento.anuncios;
    estado.consentimiento = { anuncios: anuncios, analitica: analitica };
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: anuncios, ad_user_data: anuncios, ad_personalization: anuncios,
        analytics_storage: analitica
      });
    }
    if (anuncios === 'granted') persistir();
    else if (anuncios === 'denied' && antes !== 'denied') borrar();
    pintarDebug();
  }

  function leerCookieYes() {
    try {
      if (typeof window.getCkyConsent !== 'function') return false;
      var c = window.getCkyConsent();
      if (!c || !c.categories) return false;
      aplicarConsentimiento(c.categories.advertisement ? 'granted' : 'denied', c.categories.analytics ? 'granted' : 'denied');
      return true;
    } catch (e) { return false; }
  }

  if (ES_PRODUCCION) {
    document.addEventListener('cookieyes_consent_update', function (e) {
      var acc = (e && e.detail && e.detail.accepted) || [];
      aplicarConsentimiento(acc.indexOf('advertisement') !== -1 ? 'granted' : 'denied',
        acc.indexOf('analytics') !== -1 ? 'granted' : 'denied');
    });
    document.addEventListener('cookieyes_banner_load', leerCookieYes);
    var intentos = 0;
    var t = setInterval(function () { if (leerCookieYes() || ++intentos > 20) clearInterval(t); }, 250);
  }

  /* ───────────────────────── atribución ───────────────────────── */
  var CAMPOS = {
    gclid: ['gclid'], gbraid: ['gbraid'], wbraid: ['wbraid'],
    utm_source: ['utm_source'], utm_medium: ['utm_medium'], utm_campaign: ['utm_campaign'],
    utm_content: ['utm_content'], utm_term: ['utm_term'],
    keyword: ['keyword', 'kw'], matchtype: ['matchtype', 'mt'], device: ['device', 'dev']
  };
  var LIMPIO = /^[A-Za-z0-9_\-.:~ %+()áéíóúüñÁÉÍÓÚÜÑ,]{1,256}$/;

  function leerUrl() {
    var a = {};
    Object.keys(CAMPOS).forEach(function (k) {
      CAMPOS[k].some(function (p) {
        var v = params.get(p);
        if (v && LIMPIO.test(v)) { a[k] = v.slice(0, 256); return true; }
        return false;
      });
    });
    return a;
  }

  function leerGuardado() {
    try {
      var raw = localStorage.getItem(CLAVE);
      if (!raw) return null;
      var o = JSON.parse(raw);
      var dias = (Date.now() - o.ts) / 864e5;
      if (!o.ts || dias > (CFG.diasAtribucion || 90)) { localStorage.removeItem(CLAVE); return null; }
      return o.valores || null;
    } catch (e) { return null; }
  }

  function persistir() {
    if (estado.consentimiento.anuncios !== 'granted') return;
    if (!Object.keys(estado.atribucion).length) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ ts: Date.now(), valores: estado.atribucion }));
      estado.persistido = true;
    } catch (e) { /* almacenamiento no disponible: se sigue en memoria */ }
  }

  function borrar() {
    try { localStorage.removeItem(CLAVE); } catch (e) { /* nada */ }
    estado.persistido = false;
  }

  // Un clic nuevo (con identificador) manda sobre lo guardado; si la URL no
  // trae nada, se usa lo guardado (solo existe si hubo consentimiento).
  var deUrl = leerUrl();
  var tieneClic = deUrl.gclid || deUrl.gbraid || deUrl.wbraid || deUrl.utm_source;
  estado.atribucion = tieneClic ? deUrl : (leerGuardado() || {});
  if (tieneClic) persistir();

  function datosDispositivo() {
    if (estado.atribucion.device) return estado.atribucion.device;
    return /Mobi|Android/i.test(navigator.userAgent) ? 'm' : 'c';
  }

  /* ──────────────── prueba de consentimiento (solo Preview) ──────────────── */
  function barraPrueba() {
    if (ES_PRODUCCION) return;
    var forzado = params.get('dcode_consent');
    if (forzado === 'granted' || forzado === 'denied') { aplicarConsentimiento(forzado, forzado); }
    var bar = document.createElement('div');
    bar.className = 'ads-testbar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Modo prueba');
    bar.innerHTML = '<strong>PREVIEW · modo prueba</strong> <span>Sin CookieYes ni Google fuera de dcodepartners.com. Simula el consentimiento:</span> ' +
      '<button type="button" data-c="granted">Aceptar publicidad</button> <button type="button" data-c="denied">Rechazar</button> ' +
      '<button type="button" data-dbg>Eventos</button>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-dbg')) { document.documentElement.classList.toggle('ads-debug-open'); pintarDebug(); return; }
      aplicarConsentimiento(b.getAttribute('data-c'), b.getAttribute('data-c'));
    });
    document.body.appendChild(bar);
  }

  function pintarDebug() {
    if (!DEBUG || !document.body) return;
    var p = document.getElementById('ads-debug');
    if (!p) {
      p = document.createElement('pre');
      p.id = 'ads-debug';
      p.setAttribute('aria-hidden', 'true');
      document.body.appendChild(p);
    }
    p.textContent = 'consentimiento: ' + JSON.stringify(estado.consentimiento) +
      '\natribución: ' + JSON.stringify(estado.atribucion) + (estado.persistido ? ' (guardada)' : ' (solo memoria)') +
      '\neventos:\n' + estado.eventos.slice(-12).map(function (e) { return ' · ' + e.evento; }).join('\n');
  }

  /* ─────────────────────────── CTAs ─────────────────────────── */
  function initCtas() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-cta]');
      if (!a) return;
      var tipo = a.getAttribute('data-cta');
      if (tipo === 'diagnostico') track('cta_diagnostico', { posicion: a.getAttribute('data-pos') || '' });
      if (tipo === 'caso') track('cta_caso', { posicion: a.getAttribute('data-pos') || '' });
      if (tipo === 'whatsapp') track('whatsapp', {});
      var modo = a.getAttribute('data-modo');
      var form = document.getElementById('ads-form');
      if (form && modo) {
        form.setAttribute('data-modo', modo);
        var titulo = document.getElementById('form-titulo');
        if (titulo) titulo.textContent = modo === 'caso' ? 'Cuéntanos tu caso' : 'Reserva tu diagnóstico de 30 minutos';
        var enviar = document.getElementById('form-enviar');
        if (enviar) enviar.textContent = modo === 'caso' ? 'Enviar mi caso' : 'Continuar y elegir horario';
      }
    });
    if (CFG.whatsapp) {
      document.querySelectorAll('[data-whatsapp-slot]').forEach(function (s) {
        var a = document.createElement('a');
        a.href = 'https://wa.me/' + String(CFG.whatsapp).replace(/\D/g, '');
        a.rel = 'noopener'; a.target = '_blank'; a.className = 'btn btn-ghost'; a.setAttribute('data-cta', 'whatsapp');
        a.textContent = 'Escribir por WhatsApp';
        s.appendChild(a);
      });
    }
  }

  /* ────────────────────────── formulario ────────────────────────── */
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  }

  function initForm() {
    var form = document.getElementById('ads-form');
    if (!form) return;
    var inicio = Date.now();
    var submissionId = uuid();
    var turnstileToken = '';

    if (ES_PRODUCCION && CFG.turnstileSiteKey) {
      var slot = document.getElementById('turnstile-slot');
      if (slot) {
        window.dcodeAdsTurnstile = function (tok) { turnstileToken = tok; };
        slot.innerHTML = '<div class="cf-turnstile" data-sitekey="' + CFG.turnstileSiteKey + '" data-theme="dark" data-callback="dcodeAdsTurnstile"></div>';
        var s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        s.async = true; s.defer = true;
        document.head.appendChild(s);
      }
    }

    function errores(errs) {
      form.querySelectorAll('.field-error').forEach(function (n) { n.textContent = ''; });
      form.querySelectorAll('[aria-invalid]').forEach(function (n) { n.removeAttribute('aria-invalid'); });
      var primero = null;
      Object.keys(errs || {}).forEach(function (k) {
        var n = form.querySelector('[data-error-for="' + k + '"]');
        var input = form.querySelector('[name="' + k + '"]');
        if (n) n.textContent = errs[k];
        if (input) { input.setAttribute('aria-invalid', 'true'); primero = primero || input; }
      });
      if (primero) primero.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var boton = document.getElementById('form-enviar');
      var aviso = document.getElementById('form-estado');
      var fd = new FormData(form);
      var datos = {
        nombre: fd.get('nombre') || '', empresa: fd.get('empresa') || '', web: fd.get('web') || '',
        email: fd.get('email') || '', telefono: fd.get('telefono') || '', sector: fd.get('sector') || '',
        tamano: fd.get('tamano') || '', necesidad: fd.get('necesidad') || '',
        privacidad: fd.get('privacidad') === 'on',
        website_confirm: fd.get('website_confirm') || '',
        fill_ms: Date.now() - inicio,
        submission_id: submissionId,
        ad_consent: ES_PRODUCCION ? (estado.consentimiento.anuncios === 'granted' ? 'granted' : (estado.consentimiento.anuncios === 'denied' ? 'denied' : 'sin_banner')) : (estado.consentimiento.anuncios === 'granted' ? 'granted' : estado.consentimiento.anuncios === 'denied' ? 'denied' : 'sin_banner'),
        cta: form.getAttribute('data-modo') || 'diagnostico',
        turnstile_token: turnstileToken,
        attribution: Object.assign({}, estado.atribucion, {
          device: datosDispositivo(),
          landing: document.body.getAttribute('data-landing') || location.pathname
        })
      };
      // Copia visible para depuración/pruebas: los campos ocultos reflejan
      // exactamente lo que se envía.
      Object.keys(datos.attribution).forEach(function (k) {
        var h = form.querySelector('input[type=hidden][name="' + k + '"]');
        if (h) h.value = datos.attribution[k] || '';
      });
      if (!datos.privacidad) { errores({ privacidad: 'Necesitamos tu aceptación de la política de privacidad.' }); return; }
      boton.disabled = true;
      aviso.textContent = 'Enviando…';
      fetch('/api/ads-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', body: JSON.stringify(datos)
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j }; });
      }).then(function (res) {
        if (res.status >= 200 && res.status < 300 && res.j.ok) {
          track('formulario', { cta: datos.cta, fuente: datos.attribution.gclid || datos.attribution.gbraid || datos.attribution.wbraid ? 'google_ads' : 'otra' });
          conversionPrincipal(res.j.ref, datos.email, function () {
            var sig = '/gracias-diagnostico?ref=' + encodeURIComponent(res.j.ref || '') +
              '&o=' + encodeURIComponent((document.body.getAttribute('data-landing') || '').replace(/^\//, '')) +
              '&c=' + encodeURIComponent(datos.cta);
            location.assign(sig);
          });
          return;
        }
        boton.disabled = false;
        if (res.j && res.j.errors) { errores(res.j.errors); aviso.textContent = 'Revisa los campos marcados.'; }
        else aviso.textContent = (res.j && res.j.error) || 'No se ha podido enviar. Escríbenos a dcodedepartment@gmail.com.';
      }).catch(function () {
        boton.disabled = false;
        aviso.textContent = 'Sin conexión. Vuelve a intentarlo o escríbenos a dcodedepartment@gmail.com.';
      });
    });
  }

  // Única conversión de Google Ads que se envía desde la web.
  function conversionPrincipal(ref, email, despues) {
    var hecho = false;
    function fin() { if (!hecho) { hecho = true; despues(); } }
    if (ES_PRODUCCION && typeof window.gtag === 'function' && CFG.googleAdsId && CFG.conversionFormulario) {
      if (estado.consentimiento.anuncios === 'granted' && email) {
        // Conversiones mejoradas: gtag normaliza y cifra (SHA-256) el email.
        window.gtag('set', 'user_data', { email: String(email).trim().toLowerCase() });
      }
      window.gtag('event', 'conversion', { send_to: CFG.conversionFormulario, transaction_id: ref, event_callback: fin });
      setTimeout(fin, 1200);
    } else {
      fin();
    }
  }

  function initGoogleAds() {
    if (ES_PRODUCCION && CFG.googleAdsId && typeof window.gtag === 'function') {
      window.gtag('config', CFG.googleAdsId);
    }
  }

  function init() {
    barraPrueba();
    initCtas();
    initForm();
    initGoogleAds();
    pintarDebug();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
