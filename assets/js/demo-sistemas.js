/* ============================================================================
   D-CODE PARTNERS — MOTOR DE LOS SISTEMAS DE EJEMPLO
   ----------------------------------------------------------------------------
   Comercial, Operaciones y Atención al cliente se montan sobre este motor.
   Cada demo solo describe su empresa ficticia, sus pantallas y su historia;
   todo lo demás —la ventana, la actividad, el narrador, el recorrido que se
   para cuando tocas y sigue cuando sueltas— es de aquí.

   EL RECORRIDO
     · Si nadie toca, la demo cuenta su historia sola, paso a paso.
     · Al primer gesto dentro de la demo, el recorrido se para y mandas tú.
     · Si pasan 12 s sin tocar nada, vuelve a donde lo dejó: se restaura el
       estado del paso en curso y ese paso se repite entero, para que la
       historia nunca quede a medias.
     · El botón de pausa lo para del todo; no vuelve solo.
     · Fuera de la pantalla, con la pestaña oculta o con movimiento reducido,
       no avanza. Con movimiento reducido tampoco arranca solo: se ofrece.

   Uso:  SD.registrar('comercial', def)   (lo hace cada demo)
         SD.montar(host)                  (lo hace la galería)
   ========================================================================= */
(function () {
  'use strict';

  var SD = window.SD = window.SD || {};
  SD.defs = SD.defs || {};
  var pendientes = [];
  var REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CANCEL = { cancelado: true };
  var OCIO_MS = 12000;

  /* ------------------------------------------------------------ ICONOS */
  var P = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var I = SD.I = {
    bandeja: P('<path d="M3 13h5l2 3h4l2-3h5"/><path d="M5.5 5h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>'),
    embudo: P('<path d="M3 4h18l-7 8.5V19l-4 1.5v-8z"/>'),
    agenda: P('<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>'),
    panel: P('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    rayo: P('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
    chispa: P('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>'),
    ia: P('<path d="M9.5 3.5 11 8l4.5 1.5L11 11l-1.5 4.5L8 11 3.5 9.5 8 8z"/><path d="M17.5 13.5 18.3 16l2.2.8-2.2.8-.8 2.4-.8-2.4-2.2-.8 2.2-.8z"/>'),
    persona: P('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    ok: P('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
    aviso: P('<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>'),
    web: P('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    correo: P('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    tel: P('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z"/>'),
    wa: P('<path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z"/><path d="M9 9.5c.3 1.9 2.1 3.9 4.2 4.6l1.1-1.1 1.7.7-.5 1.6c-3.4.2-7-3.3-7-6.7l1.5-.6.8 1.6z"/>'),
    anuncio: P('<path d="M3 11v3a1 1 0 0 0 1 1h1l4 4V6L5 10H4a1 1 0 0 0-1 1z"/><path d="M14 8a3 3 0 0 1 0 8"/>'),
    reloj: P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    caja: P('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>'),
    camion: P('<path d="M1 6h13v10H1zM14 10h4l3 3v3h-7z"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>'),
    llave: P('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>'),
    doc: P('<path d="M6 2.75h8L19.25 8v12.5a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V3.5A.75.75 0 0 1 6 2.75Z"/><path d="M13.5 3v5h5.25M9 13h6M9 16.5h4"/>'),
    euro: P('<path d="M17 6.5A7 7 0 1 0 17 17.5"/><path d="M4 10h9M4 14h9"/>'),
    buscar: P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    flecha: P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    mas: P('<path d="M12 5v14M5 12h14"/>'),
    pausa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg>',
    otra: P('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
    enlace: P('<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>'),
    campana: P('<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>'),
    lista: P('<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>'),
    libro: P('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>'),
    candado: P('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>')
  };
  var LOGO = '<svg viewBox="0 0 120 100" aria-hidden="true" focusable="false"><g fill="currentColor"><rect x="26" y="1" width="16" height="16" rx="2"/><rect x="1" y="27" width="13" height="13" rx="2"/><rect x="35" y="26" width="13" height="13" rx="2"/><rect x="2" y="64" width="12" height="12" rx="2"/><rect x="35" y="64" width="13" height="13" rx="2"/><rect x="26" y="83" width="16" height="16" rx="2"/><path d="M48 1H86A32 32 0 0 1 118 33V38H102V33A16 16 0 0 0 86 17H48Z"/><rect x="102" y="43" width="16" height="16" rx="2"/><path d="M48 99H86A32 32 0 0 0 118 67V63H102V67A16 16 0 0 1 86 83H48Z"/></g><rect x="16" y="45" width="15" height="15" rx="2" fill="#5b8cff"/></svg>';
  var CURSOR = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 2.5v17l4.6-4.3 3 6.8 3-1.3-3-6.6 6.4-.4z" fill="#15161a" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  var UI = {
    es: { demo: 'Demo · datos ficticios', act: 'Actividad del sistema', actD: 'Lo que el sistema ha hecho solo', vacia: 'Todavía nada. En cuanto entre algo, lo verás aquí.',
      verMas: 'Ver toda la actividad', verMenos: 'Ver menos', buscar: 'Buscar', paso: 'Paso', de: 'de',
      pausa: 'Pausar el recorrido', seguir: 'Seguir el recorrido', reiniciar: 'Volver a empezar', empezar: 'Ver cómo funciona',
      mando: 'Tienes el control', mandoT: 'Mandas tú. El recorrido sigue solo en {s} s si no tocas nada.',
      pausadoT: 'Recorrido en pausa. Toca lo que quieras o pulsa ▶ para seguir.',
      reducidoT: 'Pulsa ▶ y la demo te enseña, paso a paso, qué hace este sistema.',
      pantallas: 'Pantallas de la demo', recorrido: 'Recorrido guiado', ahora: 'ahora', usuario: 'Tú' },
    en: { demo: 'Demo · fictional data', act: 'System activity', actD: 'What the system did on its own', vacia: 'Nothing yet. As soon as something comes in, you’ll see it here.',
      verMas: 'See all activity', verMenos: 'See less', buscar: 'Search', paso: 'Step', de: 'of',
      pausa: 'Pause the walkthrough', seguir: 'Resume the walkthrough', reiniciar: 'Start over', empezar: 'See how it works',
      mando: 'You’re in control', mandoT: 'You’re driving. The walkthrough picks up again in {s} s if you leave it alone.',
      pausadoT: 'Walkthrough paused. Explore anything, or press ▶ to carry on.',
      reducidoT: 'Press ▶ and the demo will show you, step by step, what this system does.',
      pantallas: 'Demo screens', recorrido: 'Guided walkthrough', ahora: 'now', usuario: 'You' }
  };

  function clonar(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  SD.esc = esc;

  /* ================================================================ APP */
  function App(host, def) {
    var self = this;
    this.host = host; this.def = def;
    this.en = (host.closest('[lang]') || document.documentElement).getAttribute('lang').slice(0, 2) === 'en';
    this.lang = this.en ? 'en' : 'es';
    this.u = UI[this.lang];
    this.t = def.textos[this.lang];
    this.S = def.estado(this);
    this.gen = 0; this.genU = 0;
    this.i = 0;
    this.modo = REDUCIDO ? 'pausa' : 'auto';   // auto · mando · pausa
    this.visible = false; this.tocado = false; this.ultimoToque = 0; this.flujos = 0;
    this.nuevos = {};
    this.construir();
    this.ir(this.S.ui.p, true);
    this.pintarActividad();
    this.observar();
    if (!REDUCIDO) this.correr(); else this.narrarReposo();
    host.classList.add('is-montado');
  }

  App.prototype.construir = function () {
    var d = this.def, t = this.t, u = this.u, self = this;
    var navB = function (movil) {
      return d.pantallas.map(function (p) {
        return '<button type="button" class="sd-nav-b" data-p="' + p.id + '"' + (movil ? '' : ' title="' + esc(t.pant[p.id]) + '"') + '>' + I[p.icono] + '<span class="sd-nav-l">' + esc(t.pant[p.id]) + '</span><span class="sd-nav-c" data-c="' + p.id + '"></span></button>';
      }).join('');
    };
    this.host.innerHTML =
      '<div class="sd" lang="' + this.lang + '"><div class="sd-app">' +
        '<div class="sd-top"><div class="sd-marca"><span class="sd-logo">' + LOGO + '</span><span class="sd-app-n">' + esc(t.app) + '</span><span class="sd-app-e">· ' + esc(t.empresa) + '</span></div>' +
          '<div class="sd-busca" aria-hidden="true">' + I.buscar + '<span>' + esc(u.buscar) + '</span><kbd>⌘K</kbd></div>' +
          '<span class="sd-demo-chip" title="' + esc(u.demo) + '"><i aria-hidden="true"></i><span class="sd-chip-l">' + esc(u.demo) + '</span><span class="sd-chip-c" aria-hidden="true">Demo</span></span>' +
          '<span class="sd-quien"><span class="sd-av" style="--c:#2f5fe0">' + esc(t.yo.ini) + '</span><span>' + esc(t.yo.n) + '</span></span></div>' +
        '<nav class="sd-nav" aria-label="' + esc(u.pantallas) + '"><p class="sd-nav-k">' + esc(t.navK) + '</p>' + navB(false) +
          '<div class="sd-nav-pie"><b>' + esc(t.pieT) + '</b>' + esc(t.pieD) + '</div></nav>' +
        '<nav class="sd-nav-m" aria-label="' + esc(u.pantallas) + '">' + navB(true) + '</nav>' +
        '<div class="sd-narra" role="group" aria-label="' + esc(u.recorrido) + '">' +
          '<span class="sd-narra-n"></span><p class="sd-narra-t" style="margin:0"></p>' +
          '<div class="sd-narra-c"><button type="button" data-sd-play></button><button type="button" data-sd-otra aria-label="' + esc(u.reiniciar) + '" title="' + esc(u.reiniciar) + '">' + I.otra + '</button></div>' +
          '<span class="sd-narra-p" aria-hidden="true"><i></i></span></div>' +
        '<div class="sd-main" tabindex="-1"></div>' +
        '<aside class="sd-rail" aria-label="' + esc(u.act) + '"><p class="sd-rail-h" style="margin:0"><span class="sd-vivo" aria-hidden="true"></span>' + esc(u.act) + '</p><p class="sd-rail-d">' + esc(u.actD) + '</p><ul class="sd-act" tabindex="0" aria-label="' + esc(u.act) + '"></ul>' +
          '<button type="button" class="sd-rail-b" data-sd-rail>' + esc(u.verMas) + '</button></aside>' +
        '<div class="sd-cursor" aria-hidden="true">' + CURSOR + '</div>' +
      '</div></div>';
    var h = this.host;
    this.app = h.querySelector('.sd-app');
    this.main = h.querySelector('.sd-main');
    this.actEl = h.querySelector('.sd-act');
    this.narraN = h.querySelector('.sd-narra-n'); this.narraT = h.querySelector('.sd-narra-t'); this.narraP = h.querySelector('.sd-narra-p i');
    this.btnPlay = h.querySelector('[data-sd-play]');
    this.cur = h.querySelector('.sd-cursor');

    // Navegación
    h.querySelectorAll('.sd-nav-b').forEach(function (b) {
      b.addEventListener('click', function () { self.ir(b.getAttribute('data-p')); });
    });
    // Narrador
    this.btnPlay.addEventListener('click', function () { self.alternar(); });
    h.querySelector('[data-sd-otra]').addEventListener('click', function () { self.reiniciar(true); });
    h.querySelector('[data-sd-rail]').addEventListener('click', function (e) {
      var r = h.querySelector('.sd-rail'), ab = r.classList.toggle('is-abierto');
      e.currentTarget.textContent = ab ? self.u.verMenos : self.u.verMas;
    });
    // Tocar es tomar el control (el narrador no cuenta)
    var toque = function (e) {
      if (e.target.closest('.sd-narra')) return;
      self.tomarControl();
    };
    h.addEventListener('pointerdown', toque);
    h.addEventListener('keydown', toque);
    this.main.addEventListener('wheel', toque, { passive: true });
    // Acciones de la pantalla (delegadas): data-a="nombre" [data-v="valor"]
    this.main.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]');
      if (!b || !self.main.contains(b)) return;
      var fn = self.def.acciones && self.def.acciones[b.getAttribute('data-a')];
      if (fn) fn(self, b.getAttribute('data-v'), b);
    });
  };

  /* ------------------------------------------------------ PANTALLAS */
  App.prototype.pantalla = function (id) {
    for (var i = 0; i < this.def.pantallas.length; i++) if (this.def.pantallas[i].id === id) return this.def.pantallas[i];
    return this.def.pantallas[0];
  };
  App.prototype.ir = function (id, sinAnim) {
    this.S.ui.p = id;
    this.host.querySelectorAll('.sd-nav-b').forEach(function (b) {
      if (b.getAttribute('data-p') === id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    this.pintar(!sinAnim);
    this.main.scrollTop = 0;
  };
  App.prototype.pintar = function (conAnim, flip) {
    var p = this.pantalla(this.S.ui.p), antes = null, main = this.main, scroll = main.scrollTop;
    if (flip) {
      antes = {};
      main.querySelectorAll('[data-k]').forEach(function (e) { antes[e.getAttribute('data-k')] = e.getBoundingClientRect(); });
    }
    main.innerHTML = '<div class="sd-pant"' + (conAnim ? '' : ' style="animation:none"') + '>' + p.html(this) + '</div>';
    main.scrollTop = scroll;
    if (p.tras) p.tras(this);
    this.nuevos = {};
    if (flip && !REDUCIDO) {
      main.querySelectorAll('[data-k]').forEach(function (e) {
        var a = antes[e.getAttribute('data-k')];
        if (!a) return;
        var b = e.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
        if (!dx && !dy) return;
        e.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; e.style.transition = 'none';
        e.getBoundingClientRect();
        e.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)'; e.style.transform = '';
      });
    }
  };
  App.prototype.refrescar = function (flip) { this.pintar(false, flip); };
  App.prototype.nuevo = function (k) { this.nuevos[k] = 1; };
  App.prototype.esNuevo = function (k) { return this.nuevos[k] ? ' is-nuevo' : ''; };
  App.prototype.q = function (sel) { return this.main.querySelector(sel); };
  App.prototype.contador = function (id, n) {
    this.S.ui.c = this.S.ui.c || {}; this.S.ui.c[id] = n;
    this.host.querySelectorAll('[data-c="' + id + '"]').forEach(function (c) { c.textContent = n || ''; c.classList.toggle('is-on', !!n); });
  };
  App.prototype.contadores = function () {
    var c = this.S.ui.c || {}, self = this;
    this.host.querySelectorAll('[data-c]').forEach(function (e) { var n = c[e.getAttribute('data-c')]; e.textContent = n || ''; e.classList.toggle('is-on', !!n); });
  };

  /* ------------------------------------------------------ ACTIVIDAD */
  App.prototype.actividad = function (tipo, texto, sub) {
    var a = { t: tipo, x: texto, s: sub || '', h: this.hora(), k: 'a' + (++this.S.ui.n) };
    this.S.act.unshift(a);
    if (this.S.act.length > 40) this.S.act.length = 40;
    var li = this.itemAct(a);
    li.classList.add('is-nuevo');
    var v = this.actEl.querySelector('.sd-act-v'); if (v) v.remove();
    this.actEl.insertBefore(li, this.actEl.firstChild);
    while (this.actEl.children.length > 40) this.actEl.removeChild(this.actEl.lastChild);
  };
  App.prototype.itemAct = function (a) {
    var li = document.createElement('li');
    li.setAttribute('data-t', a.t);
    var ico = { ia: I.ia, auto: I.rayo, ok: I.ok, aviso: I.aviso, persona: I.persona, entrada: I.bandeja }[a.t] || I.rayo;
    var tipo = this.t.tipos[a.t] || '';
    li.innerHTML = '<span class="sd-act-i">' + ico + '</span><div><div class="sd-act-t">' + a.x + '</div><div class="sd-act-s"><span class="sd-mono">' + esc(a.h) + '</span><span>' + esc(tipo) + (a.s ? ' · ' + esc(a.s) : '') + '</span></div></div>';
    return li;
  };
  App.prototype.pintarActividad = function () {
    var self = this;
    this.actEl.innerHTML = '';
    if (!this.S.act.length) { this.actEl.innerHTML = '<li class="sd-act-v">' + esc(this.u.vacia) + '</li>'; return; }
    this.S.act.forEach(function (a) { self.actEl.appendChild(self.itemAct(a)); });
  };

  /* ----------------------------------------------------- RELOJ Y CIFRAS */
  App.prototype.hora = function () {
    var m = this.S.reloj % 1440, h = Math.floor(m / 60), mi = m % 60;
    return (this.S.diaTxt ? this.S.diaTxt + ' ' : '') + (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + mi;
  };
  App.prototype.pasa = function (min) { this.S.reloj += min; };
  App.prototype.num = function (n, dec) {
    var s = (dec ? (+n).toFixed(dec) : Math.round(n).toString()), p = s.split('.'), ent = p[0], neg = ent[0] === '-';
    if (neg) ent = ent.slice(1);
    var sep = this.en ? ',' : '.', out = '';
    while (ent.length > 3) { out = sep + ent.slice(-3) + out; ent = ent.slice(0, -3); }
    out = (neg ? '−' : '') + ent + out;
    if (p[1]) out += (this.en ? '.' : ',') + p[1];
    return out;
  };
  App.prototype.eur = function (n) { return this.en ? '€' + this.num(n) : this.num(n) + ' €'; };

  /* ------------------------------------------------------ TIEMPO */
  App.prototype.corre = function () { return this.modo === 'auto' && this.visible && !document.hidden; };
  App.prototype.espera = function (ms) {
    var self = this, g = this.gen;
    return new Promise(function (res, rej) {
      var resto = ms, ult = performance.now();
      (function tic() {
        if (g !== self.gen) return rej(CANCEL);
        var t = performance.now();
        if (self.corre()) resto -= (t - ult);
        ult = t;
        if (resto <= 0) return res();
        setTimeout(tic, 40);
      })();
    });
  };
  // Para lo que lanza el visitante: corre aunque el recorrido esté parado.
  App.prototype.dormir = function (ms) {
    var self = this, g = this.genU;
    return new Promise(function (res, rej) {
      var resto = ms, ult = performance.now();
      (function tic() {
        if (g !== self.genU) return rej(CANCEL);
        var t = performance.now();
        if (self.visible && !document.hidden) resto -= (t - ult);
        ult = t;
        if (resto <= 0) return res();
        setTimeout(tic, 40);
      })();
    });
  };
  App.prototype.flujo = function (fn) {
    var self = this;
    this.tomarControl();
    this.flujos++;
    Promise.resolve().then(function () { return fn(self, function (ms) { return self.dormir(ms); }); })
      .catch(function (e) { if (e !== CANCEL) console.error(e); })
      .then(function () { self.flujos--; self.ultimoToque = performance.now(); });
  };

  /* ----------------------------------------------------- CURSOR */
  App.prototype.cursor = function (el, esperar) {
    var self = this;
    if (!el || REDUCIDO || window.matchMedia('(max-width:900px)').matches) return (esperar ? this.espera(esperar) : Promise.resolve());
    var a = this.app.getBoundingClientRect(), r = el.getBoundingClientRect();
    var x = r.left - a.left + Math.min(r.width * 0.5, 60), y = r.top - a.top + r.height * 0.55;
    this.cur.classList.add('is-on');
    this.cur.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    return this.espera(780).then(function () {
      self.cur.classList.remove('is-clic'); void self.cur.offsetWidth; self.cur.classList.add('is-clic');
      if (el.classList) { el.classList.add('is-pulsado'); setTimeout(function () { el.classList.remove('is-pulsado'); }, 260); }
      return self.espera(esperar || 260);
    });
  };
  App.prototype.esconderCursor = function () { this.cur.classList.remove('is-on'); };
  /* Lleva un elemento a la vista SIN mover la página: solo desplaza los
     contenedores con scroll propio de la aplicación (la pantalla, la hoja de
     detalle, el tablero). Un recorrido que arrastra la página mientras
     alguien lee es lo contrario de enseñar. */
  App.prototype.mostrar = function (el) {
    if (!el) return;
    var n = el.parentElement;
    while (n && n !== this.host) {
      var cs = getComputedStyle(n);
      var r = el.getBoundingClientRect(), c = n.getBoundingClientRect();
      if (/(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 2) {
        if (r.bottom > c.bottom - 70) n.scrollTo({ top: n.scrollTop + (r.bottom - c.bottom) + 90, behavior: REDUCIDO ? 'auto' : 'smooth' });
        else if (r.top < c.top) n.scrollTo({ top: n.scrollTop - (c.top - r.top) - 20, behavior: REDUCIDO ? 'auto' : 'smooth' });
      }
      if (/(auto|scroll)/.test(cs.overflowX) && n.scrollWidth > n.clientWidth + 2) {
        if (r.right > c.right || r.left < c.left) n.scrollTo({ left: n.scrollLeft + (r.left - c.left) - 12, behavior: REDUCIDO ? 'auto' : 'smooth' });
      }
      n = n.parentElement;
    }
  };

  App.prototype.toast = function (titulo, texto, icono) {
    var t = document.createElement('div');
    t.className = 'sd-toast'; t.setAttribute('role', 'status');
    t.innerHTML = '<span class="sd-canal">' + (I[icono] || I.campana) + '</span><div><b>' + esc(titulo) + '</b>' + esc(texto || '') + '</div>';
    this.app.appendChild(t);
    setTimeout(function () { t.remove(); }, 4300);
  };

  /* ------------------------------------------------------ RECORRIDO */
  App.prototype.narrar = function (texto, n) {
    var N = this.def.pasos.length;
    this.narraN.textContent = this.u.paso + ' ' + (n + 1) + ' ' + this.u.de + ' ' + N;
    this.narraT.innerHTML = texto;
    this.narraT.classList.remove('is-cambio'); void this.narraT.offsetWidth; this.narraT.classList.add('is-cambio');
    this.narraP.style.width = ((n + 1) / N * 100).toFixed(1) + '%';
    this.pintarBoton();
  };
  App.prototype.narrarReposo = function () {
    this.narraN.textContent = this.u.recorrido;
    this.narraT.textContent = this.u.reducidoT;
    this.pintarBoton();
  };
  App.prototype.pintarBoton = function () {
    var corriendo = this.modo === 'auto';
    this.btnPlay.innerHTML = corriendo ? I.pausa : I.play + (this.i === 0 && REDUCIDO && !this.tocado ? '<span>' + esc(this.u.empezar) + '</span>' : '');
    this.btnPlay.setAttribute('aria-label', corriendo ? this.u.pausa : this.u.seguir);
    this.btnPlay.setAttribute('title', corriendo ? this.u.pausa : this.u.seguir);
    this.host.querySelector('.sd-narra').classList.toggle('is-mando', this.modo !== 'auto');
  };
  App.prototype.correr = function () {
    var self = this, g = this.gen, pasos = this.def.pasos;
    (function paso() {
      if (g !== self.gen) return;
      var p = pasos[self.i];
      self.snap = { S: clonar(self.S), i: self.i };
      self.narrar(p.narra(self), self.i);
      Promise.resolve().then(function () { return p.hacer(self); })
        .then(function () { self.esconderCursor(); return self.espera(p.pausa || 2200); })
        .then(function () {
          self.i++;
          if (self.i >= pasos.length) {
            return self.espera(3500).then(function () { self.reiniciar(false); });
          }
          paso();
        })
        .catch(function (e) { if (e !== CANCEL) { console.error(e); } });
    })();
  };
  App.prototype.tomarControl = function () {
    this.ultimoToque = performance.now();
    this.tocado = true;
    this.esconderCursor();
    if (this.modo === 'auto') {
      this.modo = 'mando';
      this.pintarBoton();
      this.cuentaAtras();
    }
  };
  App.prototype.cuentaAtras = function () {
    var self = this;
    clearInterval(this._ocio);
    this._ocio = setInterval(function () {
      if (self.modo !== 'mando') { clearInterval(self._ocio); return; }
      if (!self.visible || document.hidden) { self.ultimoToque = performance.now(); return; }
      var falta = OCIO_MS - (performance.now() - self.ultimoToque);
      if (self.flujos) { self.ultimoToque = performance.now(); falta = OCIO_MS; }
      self.narraN.textContent = self.u.mando;
      self.narraT.textContent = self.u.mandoT.replace('{s}', Math.max(1, Math.ceil(falta / 1000)));
      if (falta <= 0) { clearInterval(self._ocio); self.reanudar(); }
    }, 250);
  };
  App.prototype.reanudar = function () {
    // Vuelve al principio del paso en curso con el estado de entonces.
    this.gen++; this.genU++;
    this.S = clonar(this.snap.S); this.i = this.snap.i;
    this.modo = 'auto'; this.tocado = false;
    this.ir(this.S.ui.p, true); this.pintarActividad(); this.contadores();
    this.correr();
  };
  App.prototype.alternar = function () {
    if (this.modo === 'auto') {
      this.modo = 'pausa'; clearInterval(this._ocio);
      this.narraN.textContent = this.u.recorrido; this.narraT.textContent = this.u.pausadoT;
      this.pintarBoton();
      return;
    }
    if (!this.snap) { this.modo = 'auto'; this.correr(); return; }
    if (this.tocado || this.modo === 'mando') { this.reanudar(); return; }
    this.modo = 'auto'; this.pintarBoton();
    this.narrar(this.def.pasos[this.i].narra(this), this.i);
  };
  App.prototype.reiniciar = function (porUsuario) {
    this.gen++; this.genU++;
    clearInterval(this._ocio);
    this.S = this.def.estado(this); this.i = 0; this.snap = null; this.tocado = false;
    this.modo = (porUsuario || !REDUCIDO) ? 'auto' : 'pausa';
    this.ir(this.S.ui.p, true); this.pintarActividad(); this.contadores();
    if (this.modo === 'auto') this.correr(); else this.narrarReposo();
  };
  App.prototype.observar = function () {
    var self = this;
    var cb = function (v) {
      self.visible = v;
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting && e.intersectionRatio > 0.15); }); }, { threshold: [0, 0.15, 0.3] }).observe(this.host);
    } else cb(true);
  };

  /* ====================================================== REGISTRO */
  SD.registrar = function (id, def) {
    SD.defs[id] = def;
    pendientes = pendientes.filter(function (h) {
      if (h.getAttribute('data-sd') === id) { new App(h, def); return false; }
      return true;
    });
  };
  SD.montar = function (host) {
    if (!host || host.classList.contains('is-montado') || host._sd) return;
    host._sd = true;
    var id = host.getAttribute('data-sd');
    if (SD.defs[id]) new App(host, SD.defs[id]); else pendientes.push(host);
  };
  SD.CANCEL = CANCEL;
  document.querySelectorAll('[data-sd][data-sd-auto]').forEach(SD.montar);
})();
