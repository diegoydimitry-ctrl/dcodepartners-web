/*
 * Reproductor de las demos (sin dependencias). Pinta una aplicación de
 * ejemplo y ejecuta el guion de demos.js en el tiempo. Emite demo_start,
 * demo_25, demo_50 y demo_90 según el tiempo REALMENTE reproducido.
 *
 * Si existe un vídeo (data-video en el contenedor) se ofrece también como
 * alternativa, con subtítulos, y emite los mismos eventos.
 */
(function () {
  'use strict';
  var DEMOS = window.DCODE_DEMOS || {};
  var track = function (n, d) { if (window.__dcodeAds && window.__dcodeAds.track) window.__dcodeAds.track(n, d || {}); };

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function Player(root) {
    this.root = root;
    this.id = root.getAttribute('data-demo');
    this.demo = DEMOS[this.id];
    if (!this.demo) return;
    this.reproducido = 0; // segundos efectivamente vistos
    this.pos = 0;
    this.velocidad = Number(root.getAttribute('data-speed') || 1);
    this.hitos = {};
    this.construir();
    this.reset();
  }

  Player.prototype.construir = function () {
    var d = this.demo, r = this.root;
    r.classList.add('demo', 'sin-empezar');
    r.innerHTML = '';
    var win = el('div', 'demo-win');
    var bar = el('div', 'demo-bar');
    bar.appendChild(el('span', 'demo-dots'));
    bar.appendChild(el('span', 'demo-app', d.app));
    bar.appendChild(el('span', 'demo-badge', 'DATOS DE DEMOSTRACIÓN'));
    win.appendChild(bar);
    var body = el('div', 'demo-body');
    this.nTitulo = el('div', 'demo-titulo');
    var cols = el('div', 'demo-cols');
    this.nEntrada = el('ul', 'demo-entrada');
    this.nEntrada.setAttribute('aria-label', 'Entrada');
    var main = el('div', 'demo-main');
    this.nTabla = el('table', 'demo-tabla');
    var thead = el('thead'), tr = el('tr');
    d.columnas.forEach(function (c) { tr.appendChild(el('th', null, c)); });
    thead.appendChild(tr);
    this.nTabla.appendChild(thead);
    this.nTbody = el('tbody');
    this.nTabla.appendChild(this.nTbody);
    this.nDetalle = el('div', 'demo-detalle');
    this.nKpis = el('div', 'demo-kpis');
    main.appendChild(this.nTabla);
    main.appendChild(this.nDetalle);
    main.appendChild(this.nKpis);
    cols.appendChild(this.nEntrada);
    cols.appendChild(main);
    body.appendChild(this.nTitulo);
    body.appendChild(cols);
    this.nAvisos = el('div', 'demo-avisos');
    this.nAvisos.setAttribute('aria-live', 'polite');
    body.appendChild(this.nAvisos);
    this.nPortada = el('div', 'demo-portada');
    body.appendChild(this.nPortada);
    win.appendChild(body);
    this.nSub = el('p', 'demo-sub');
    this.nSub.setAttribute('aria-live', 'polite');
    win.appendChild(this.nSub);
    r.appendChild(win);

    var ctr = el('div', 'demo-ctrl');
    this.bPlay = el('button', 'demo-play', '▶ Ver demo');
    this.bPlay.type = 'button';
    this.bPlay.setAttribute('data-demo-play', '');
    this.nProg = el('div', 'demo-prog');
    this.nProg.setAttribute('role', 'progressbar');
    this.nProg.setAttribute('aria-label', 'Progreso de la demo');
    this.nProg.setAttribute('aria-valuemin', '0');
    this.nProg.setAttribute('aria-valuemax', '100');
    this.nProgIn = el('span');
    this.nProg.appendChild(this.nProgIn);
    this.nTiempo = el('span', 'demo-tiempo', '0:00 / ' + fmt(d.duracion));
    ctr.appendChild(this.bPlay);
    ctr.appendChild(this.nProg);
    ctr.appendChild(this.nTiempo);
    r.appendChild(ctr);

    var self = this;
    this.bPlay.addEventListener('click', function () { self.alternar(); });
    // El cartel grande del centro también arranca la demo.
    this.nPortada.addEventListener('click', function () { if (!self.tick) self.play(); });
  };

  function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }

  Player.prototype.reset = function () {
    this.pos = 0;
    this.nEntrada.innerHTML = '';
    this.nTbody.innerHTML = '';
    this.nDetalle.innerHTML = '';
    this.nKpis.innerHTML = '';
    this.nAvisos.innerHTML = '';
    this.filas = {};
    this.entradas = {};
    this.aplicados = 0;
    this.aplicarHasta(0);
    this.pintarProgreso();
  };

  Player.prototype.accion = function (a) {
    var self = this, t = a[0];
    if (t === 'titulo') { this.nTitulo.textContent = a[1]; }
    if (t === 'limpiar') { this.nPortada.classList.remove('on'); this.nKpis.innerHTML = ''; this.nDetalle.innerHTML = ''; }
    if (t === 'portada') {
      this.nPortada.innerHTML = '';
      this.nPortada.appendChild(el('strong', null, a[1]));
      (a[2] || []).forEach(function (l) { self.nPortada.appendChild(el('span', null, l)); });
      this.nPortada.classList.add('on');
    } else if (t !== 'limpiar') {
      this.nPortada.classList.remove('on');
    }
    if (t === 'entrada') {
      var li = el('li', 'nuevo');
      li.appendChild(el('span', 'de', a[2]));
      li.appendChild(el('strong', null, a[3]));
      li.appendChild(el('span', 'meta', a[4]));
      li.appendChild(el('span', 'estado', 'nuevo'));
      this.nEntrada.insertBefore(li, this.nEntrada.firstChild);
      this.entradas[a[1]] = li;
    }
    if (t === 'entradaEstado' && this.entradas[a[1]]) {
      var e = this.entradas[a[1]];
      e.querySelector('.estado').textContent = a[2];
      e.className = a[2] === 'no es consulta' ? 'descartado' : 'hecho';
    }
    if (t === 'fila') {
      var tr = el('tr', 'nueva');
      a[2].forEach(function (c) { tr.appendChild(el('td', null, c)); });
      this.nTbody.appendChild(tr);
      this.filas[a[1]] = tr;
    }
    if (t === 'celda' && this.filas[a[1]]) {
      var td = this.filas[a[1]].children[a[2]];
      td.textContent = a[3];
      td.className = a[4] ? 'resalta' : '';
    }
    if (t === 'detalle') {
      this.nDetalle.innerHTML = '';
      this.nKpis.innerHTML = '';
      this.nDetalle.appendChild(el('h4', null, a[1]));
      var dl = el('dl');
      (a[2] || []).forEach(function (kv) { dl.appendChild(el('dt', null, kv[0])); dl.appendChild(el('dd', null, kv[1])); });
      this.nDetalle.appendChild(dl);
      if (a[3]) this.nDetalle.appendChild(el('p', 'nota', a[3]));
    }
    if (t === 'aviso') {
      var n = el('div', 'demo-aviso ' + (a[2] || ''), a[1]);
      this.nAvisos.appendChild(n);
      while (this.nAvisos.children.length > 2) this.nAvisos.removeChild(this.nAvisos.firstChild);
    }
    if (t === 'kpis') {
      this.nDetalle.innerHTML = '';
      this.nKpis.innerHTML = '';
      a[1].forEach(function (k) {
        var b = el('div', 'kpi');
        b.appendChild(el('strong', null, k[1]));
        b.appendChild(el('span', null, k[0]));
        self.nKpis.appendChild(b);
      });
    }
  };

  Player.prototype.aplicarHasta = function (seg) {
    var pasos = this.demo.pasos;
    while (this.aplicados < pasos.length && pasos[this.aplicados].t <= seg) {
      var p = pasos[this.aplicados];
      this.nSub.textContent = p.c;
      for (var i = 0; i < p.a.length; i++) this.accion(p.a[i]);
      this.aplicados++;
    }
  };

  Player.prototype.pintarProgreso = function () {
    var pct = Math.min(100, (this.pos / this.demo.duracion) * 100);
    this.nProgIn.style.width = pct + '%';
    this.nProg.setAttribute('aria-valuenow', String(Math.round(pct)));
    this.nTiempo.textContent = fmt(this.pos) + ' / ' + fmt(this.demo.duracion);
  };

  Player.prototype.hito = function () {
    var pct = (this.reproducido / this.demo.duracion) * 100;
    var self = this;
    [25, 50, 90].forEach(function (h) {
      if (pct >= h && !self.hitos[h]) { self.hitos[h] = true; track('demo_' + h, { demo: self.id, modo: 'animada' }); }
    });
  };

  Player.prototype.play = function () {
    if (this.pos >= this.demo.duracion) this.reset();
    this.root.classList.remove('sin-empezar');
    if (!this.hitos.start) { this.hitos.start = true; track('demo_start', { demo: this.id, modo: 'animada' }); }
    var self = this;
    var ultimo = performance.now();
    this.bPlay.textContent = '❚❚ Pausa';
    this.root.classList.add('reproduciendo');
    this.tick = setInterval(function () {
      var ahora = performance.now();
      var dt = ((ahora - ultimo) / 1000) * self.velocidad;
      ultimo = ahora;
      // Si la pestaña estaba oculta no se cuenta como visto.
      if (document.hidden) return;
      self.pos = Math.min(self.demo.duracion, self.pos + dt);
      self.reproducido += dt;
      self.aplicarHasta(self.pos);
      self.pintarProgreso();
      self.hito();
      if (self.pos >= self.demo.duracion) self.pausa(true);
    }, 100);
  };

  Player.prototype.pausa = function (fin) {
    clearInterval(this.tick);
    this.tick = null;
    this.root.classList.remove('reproduciendo');
    this.bPlay.textContent = fin ? '↻ Ver de nuevo' : '▶ Continuar';
  };

  Player.prototype.alternar = function () { if (this.tick) this.pausa(false); else this.play(); };

  /* Vídeo alternativo (MP4 + subtítulos). Mismos hitos. */
  function initVideo(v) {
    var id = v.getAttribute('data-demo-video');
    var hitos = {};
    v.addEventListener('play', function () { if (!hitos.start) { hitos.start = true; track('demo_start', { demo: id, modo: 'video' }); } });
    v.addEventListener('timeupdate', function () {
      if (!v.duration) return;
      var pct = (v.currentTime / v.duration) * 100;
      [25, 50, 90].forEach(function (h) { if (pct >= h && !hitos[h]) { hitos[h] = true; track('demo_' + h, { demo: id, modo: 'video' }); } });
    });
  }

  function init() {
    var players = [];
    document.querySelectorAll('[data-demo]').forEach(function (n) {
      var p = new Player(n);
      if (p.demo) players.push(p);
    });
    window.__dcodeDemo = players;
    document.querySelectorAll('[data-demo-start]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = players[0];
        if (!p) return;
        p.root.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (!p.tick) p.play();
      });
    });
    document.querySelectorAll('video[data-demo-video]').forEach(initVideo);
    // Modo grabación (lo usa el generador de vídeo): arranca solo.
    if (/[?&]record=1/.test(location.search) && players[0]) {
      document.documentElement.classList.add('demo-record');
      setTimeout(function () { players[0].play(); }, 600);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
