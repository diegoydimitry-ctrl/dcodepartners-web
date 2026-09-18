/*
 * Página de gracias: reserva del diagnóstico con Cal.com (mismo evento que
 * /contacto). El calendario solo se carga si la persona lo pide.
 * Al confirmarse la reserva: evento «reserva» y aviso al servidor para
 * anotar la reunión programada en el lead (por su referencia opaca).
 */
(function () {
  'use strict';
  var CFG = window.DCODE_ADS_CONFIG || {};
  var ref = window.__dcodeRef || '';
  var ns = CFG.calNamespace || 'diagnostico-ads';
  var track = function (n, d) { if (window.__dcodeAds && window.__dcodeAds.track) window.__dcodeAds.track(n, d || {}); };
  var estado = document.getElementById('reserva-estado');
  var sub = document.getElementById('g-sub');
  if (window.__dcodeCta === 'caso' && sub) {
    sub.textContent = 'Lo revisa una persona del equipo y te escribe en menos de 24 h laborables con lo que construiríamos. Si prefieres hablarlo ya, elige horario.';
  }

  function cargarCal(cb) {
    if (window.Cal && window.Cal.loaded) return cb();
    (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');
    window.Cal('init', ns, { origin: 'https://cal.com' });
    cb();
  }

  function alReservar(e) {
    var d = (e && e.detail && e.detail.data) || {};
    var inicio = d.startTime || (d.booking && d.booking.startTime) || '';
    track('reserva', { origen: window.__dcodeOrigen || '' });
    if (estado) estado.textContent = 'Reserva confirmada. Te llegará la invitación por email.';
    if (!ref) return;
    fetch('/api/ads-lead-event', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
      body: JSON.stringify({ tipo: 'reserva', ref: ref, inicio: inicio })
    }).catch(function () { /* la reserva ya existe en Cal.com; el equipo la ve igual */ });
  }
  window.__dcodeAlReservar = alReservar; // lo usan las pruebas

  var boton = document.getElementById('abrir-cal');
  if (boton) boton.addEventListener('click', function () {
    boton.disabled = true;
    cargarCal(function () {
      window.Cal.ns[ns]('inline', {
        elementOrSelector: '#cal-inline',
        calLink: CFG.calLink,
        // La referencia viaja como metadato de la reserva (no es un dato personal).
        config: { layout: 'month_view', theme: 'dark', 'metadata[dcode_ref]': ref }
      });
      window.Cal.ns[ns]('ui', { theme: 'dark', cssVarsPerTheme: { dark: { 'cal-brand': '#43e0ff' } }, layout: 'month_view' });
      window.Cal.ns[ns]('on', { action: 'bookingSuccessful', callback: alReservar });
    });
  });
})();
