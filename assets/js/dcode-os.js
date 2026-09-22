/* ============================================================================
   D-CODE OS — la capa operativa (portada)
   ----------------------------------------------------------------------------
   1. Cables: de cada sistema independiente a la capa. Se calculan con las
      posiciones reales (solo al cargar y al cambiar el tamaño, nunca por
      fotograma) y por ellos viajan paquetes animados con la Web Animations
      API: transform y opacity, en el compositor.
   2. Un solo reloj (setInterval de 1,4 s) mueve todo lo demás: los pasos de
      cada sistema, la capa, la actividad en tiempo real y el caso de punta a
      punta. Solo corre con la sección a la vista y sin pausa.
   3. Todo es interactivo: los sistemas emiten su evento, el mapa enfoca un
      sistema, la IA espera a que una persona apruebe, y los módulos cambian
      la vista. Quien toca, manda: el caso deja de avanzar solo 12 s.
   4. Movimiento reducido: nada se mueve solo; todo sigue respondiendo.
   ========================================================================= */
(function () {
  'use strict';
  var sec = document.getElementById('dcode-os');
  if (!sec) return;
  var D = document, W = window;
  var reducido = W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || sec).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || sec).querySelectorAll(s)); };

  var datos = { pasos: [], feed: [] }, iconos = {};
  try { datos = JSON.parse($('[data-os-datos]').textContent); } catch (e) {}
  try { iconos = JSON.parse($('[data-os-iconos]').textContent); } catch (e) {}

  function color(el) {
    var cs = getComputedStyle(el), v = cs.getPropertyValue('--c').trim();
    var m = v.match(/var\((--[\w-]+)\)/);
    return m ? (cs.getPropertyValue(m[1]).trim() || getComputedStyle(D.documentElement).getPropertyValue(m[1]).trim()) : (v || '#7aa2ff');
  }

  /* ----------------------------------------------------------- 1. cables */
  var conv = $('[data-os-conv]'), svg = $('.os-cables'), capa = $('[data-os-capa]'), pqc = $('.os-pqc');
  var sistemas = $$('.os-sis > .oss');
  var NS = 'http://www.w3.org/2000/svg';
  var rutas = {};            // clave -> { pts: [[x,y]...], c }
  var anims = [];            // animaciones en bucle de los paquetes
  var visible = false, pausa = false;
  function el(tag, at) { var e = D.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); return e; }

  function dibujar() {
    if (!svg || !capa || !conv) return;
    var R = conv.getBoundingClientRect();
    if (!R.width) return;
    var C = capa.getBoundingClientRect();
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', '0 0 ' + Math.round(R.width) + ' ' + Math.round(R.height));
    var defs = el('defs', {}); svg.appendChild(defs);
    anims.forEach(function (a) { a.cancel(); }); anims = [];
    while (pqc.firstChild) pqc.removeChild(pqc.firstChild);
    var n = sistemas.length;
    sistemas.forEach(function (s, i) {
      var r = s.getBoundingClientRect();
      var x1 = r.left + r.width / 2 - R.left, y1 = r.bottom - R.top;
      var x2 = C.left - R.left + C.width * (0.2 + 0.6 * (n > 1 ? i / (n - 1) : 0.5)), y2 = C.top - R.top;
      if (y2 - y1 < 24) { rutas[s.getAttribute('data-oss')] = null; return; }   // en columna: sin cable
      var dy = y2 - y1;
      var d = 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' C' + x1.toFixed(1) + ' ' + (y1 + dy * 0.55).toFixed(1) + ' ' +
        x2.toFixed(1) + ' ' + (y2 - dy * 0.55).toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1);
      var c = color(s), gid = 'os-cg-' + i;
      var g = el('linearGradient', { id: gid, gradientUnits: 'userSpaceOnUse', x1: x1, y1: y1, x2: x2, y2: y2 });
      g.appendChild(el('stop', { offset: '0', 'stop-color': c }));
      g.appendChild(el('stop', { offset: '1', 'stop-color': '#9fbcff' }));
      defs.appendChild(g);
      svg.appendChild(el('path', { d: d, class: 'os-cable-luz', stroke: 'url(#' + gid + ')' }));
      var p = el('path', { d: d, class: 'os-cable', stroke: 'url(#' + gid + ')' });
      svg.appendChild(p);
      var L = 0, pts = [];
      try { L = p.getTotalLength(); } catch (e) {}
      for (var k = 0; k <= 10; k++) { var q = p.getPointAtLength(L * k / 10); pts.push([q.x, q.y]); }
      rutas[s.getAttribute('data-oss')] = { pts: pts, c: c };
      if (!reducido) anims.push(paquete(pts, c, 2600, i * 650, Infinity, 0.9));
    });
    if (!visible || pausa) anims.forEach(function (a) { a.pause(); });
  }
  function paquete(pts, c, dur, delay, veces, alfa) {
    var i = D.createElement('i'); i.style.setProperty('--c', c); pqc.appendChild(i);
    var fr = pts.map(function (q, k) {
      return { transform: 'translate(' + q[0].toFixed(1) + 'px,' + q[1].toFixed(1) + 'px)', opacity: k === 0 || k === pts.length - 1 ? 0 : alfa, offset: k / (pts.length - 1) };
    });
    var a = i.animate(fr, { duration: dur, delay: delay, iterations: veces, easing: 'cubic-bezier(.45,0,.55,1)' });
    if (veces !== Infinity) a.onfinish = function () { i.remove(); };
    return a;
  }
  var pendiente = false;
  function pedirDibujo() { if (pendiente) return; pendiente = true; W.requestAnimationFrame(function () { pendiente = false; dibujar(); }); }
  if (W.ResizeObserver) new ResizeObserver(pedirDibujo).observe(conv);
  D.addEventListener('dcp:tema', pedirDibujo);
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(pedirDibujo);

  /* ------------------------------------------------ 2. sistemas y capa */
  var capas = $$('.os-capas li'), iCapa = 0;
  var estados = sistemas.map(function (s, i) { return { s: s, pasos: $$('.oss-pasos li', s), n: i % 6, espera: 0 }; });
  function pintaSistema(e) {
    e.pasos.forEach(function (li, k) { li.classList.toggle('is-on', k === e.n); li.classList.toggle('is-hecho', k < e.n); });
  }
  estados.forEach(pintaSistema);
  if (reducido) estados.forEach(function (e) { e.n = 3; pintaSistema(e); });

  function emitir(clave, manual) {
    var ruta = rutas[clave], s = sec.querySelector('.oss[data-oss="' + clave + '"]');
    if (s) { s.classList.add('is-emite'); W.setTimeout(function () { s.classList.remove('is-emite'); }, 1400); }
    var llegar = function () {
      capa.classList.add('is-recibe'); W.setTimeout(function () { capa.classList.remove('is-recibe'); }, 700);
      var ev = null;
      for (var k = 0; k < datos.feed.length; k++) if (datos.feed[(iFeed + k) % datos.feed.length].k === clave) { ev = datos.feed[(iFeed + k) % datos.feed.length]; break; }
      if (ev) nuevoEvento(ev);
    };
    if (ruta && !reducido) { var a = paquete(ruta.pts, ruta.c, 1100, 0, 1, 1); a.finished.then(llegar, function () {}); }
    else llegar();
  }
  $$('[data-oss-emite]').forEach(function (b) { b.addEventListener('click', function () { emitir(b.getAttribute('data-oss-emite'), true); }); });

  /* ------------------------------------------------------- 3. la aplicación */
  var app = $('[data-os]');
  var botones = $$('.os-nav-b'), vistas = $$('[data-os-vista]');
  function ir(id) {
    botones.forEach(function (b) { if (b.getAttribute('data-os-ir') === id) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    vistas.forEach(function (v) { v.hidden = v.getAttribute('data-os-vista') !== id; });
  }
  botones.forEach(function (b) { b.addEventListener('click', function () { ir(b.getAttribute('data-os-ir')); }); });

  // tiempo real
  var feed = $('.os-feed'), iFeed = 4, kpiEv = $('.os-kpi .os-kpi-v'), nEv = 1284;
  var fmt = (D.documentElement.lang || 'es').slice(0, 2) === 'en' ? function (n) { return n.toLocaleString('en-GB'); } : function (n) { return n.toLocaleString('es-ES'); };
  function nuevoEvento(ev) {
    if (!feed || !ev) return;
    var li = D.createElement('li');
    li.className = 'is-nuevo'; li.style.setProperty('--c', 'var(' + ev.c + ')');
    var tag = /^(IA|AI)$/.test(ev.t) ? 'ia' : /^(Persona|Person)$/.test(ev.t) ? 'p' : 'auto';
    li.innerHTML = '<span class="os-fd-i">' + (iconos[ev.k] || '') + '</span><span class="os-fd-t"><b></b><small></small></span><em class="os-tag os-tag--' + tag + '"></em>';
    li.querySelector('b').textContent = ev.a; li.querySelector('small').textContent = ev.b; li.querySelector('em').textContent = ev.t;
    feed.insertBefore(li, feed.firstChild);
    while (feed.children.length > 5) feed.removeChild(feed.lastChild);
    nEv += 1 + (nEv % 3); if (kpiEv) kpiEv.textContent = fmt(nEv);
    var nodo = sec.querySelector('.os-mn-b[data-os-nodo="' + ev.k + '"]');
    if (nodo && !reducido) { var mn = nodo.parentNode; mn.classList.remove('is-ping'); void mn.offsetWidth; mn.classList.add('is-ping'); }
  }

  // mapa: enfocar un sistema
  var mapa = $('.os-mapa'), rayos = $$('.os-rayos line'), nodos = $$('.os-mn-b');
  nodos.forEach(function (b, i) {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      nodos.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      rayos.forEach(function (r) { r.classList.remove('is-foco'); });
      mapa.classList.toggle('is-foco', on);
      if (on) {
        b.setAttribute('aria-pressed', 'true'); if (rayos[i]) rayos[i].classList.add('is-foco');
        var k = b.getAttribute('data-os-nodo');
        for (var j = 0; j < datos.feed.length; j++) if (datos.feed[j].k === k) { nuevoEvento(datos.feed[j]); break; }
      }
    });
  });

  // la IA propone, una persona decide
  var iaAcc = $('[data-os-ia]'), iaRes = $('[data-os-ia-res]');
  function decidir(ok) {
    if (!iaAcc || !iaRes) return;
    iaRes.textContent = iaRes.getAttribute(ok ? 'data-l-ok' : 'data-l-rev');
    iaRes.classList.toggle('is-rev', !ok); iaRes.hidden = false; iaAcc.hidden = true;
    nuevoEvento({ k: 'leads', c: '--k-comercial', a: iaRes.textContent, b: ok ? 'IA → persona' : 'IA', t: ok ? (D.documentElement.lang === 'en' ? 'Person' : 'Persona') : (D.documentElement.lang === 'en' ? 'AI' : 'IA') });
  }
  var bOk = $('[data-os-ia-ok]'), bRev = $('[data-os-ia-rev]');
  if (bOk) bOk.addEventListener('click', function () { decidir(true); });
  if (bRev) bRev.addEventListener('click', function () { decidir(false); });

  // el caso de punta a punta
  var pasos = $$('.os-flujo > li'), que = $('[data-os-que]'), actual = 0, mandaUsuario = 0;
  function marcar(n) {
    actual = n;
    pasos.forEach(function (li, k) { li.classList.toggle('is-on', k === n); li.classList.toggle('is-hecho', k < n); });
    if (que && datos.pasos[n]) que.textContent = datos.pasos[n];
  }
  pasos.forEach(function (li, k) {
    li.querySelector('.os-paso').addEventListener('click', function () { mandaUsuario = Date.now() + 12000; marcar(k); });
  });
  marcar(reducido ? pasos.length - 1 : 0);

  // pausa
  var bPausa = $('[data-os-pausa]');
  if (bPausa) bPausa.addEventListener('click', function () {
    pausa = !pausa;
    sec.classList.toggle('is-pausa', pausa);
    bPausa.setAttribute('aria-pressed', pausa ? 'true' : 'false');
    bPausa.setAttribute('aria-label', bPausa.getAttribute(pausa ? 'data-l-seguir' : 'data-l-pausa'));
    actualizar();
  });

  /* --------------------------------------------------------- 4. el reloj */
  var reloj = null, tic = 0;
  function paso() {
    tic++;
    // sistemas: cada uno avanza; al acabar, emite y vuelve a empezar
    estados.forEach(function (e, i) {
      if (e.espera > 0) { e.espera--; if (!e.espera) { e.n = 0; pintaSistema(e); } return; }
      if ((tic + i) % 2) return;                          // a destiempo, no todos a la vez
      if (e.n < e.pasos.length - 1) { e.n++; pintaSistema(e); }
      else { emitir(e.s.getAttribute('data-oss'), false); e.espera = 3; }
    });
    // la capa
    if (capas.length) { capas.forEach(function (c, k) { c.classList.toggle('is-on', k === iCapa); }); iCapa = (iCapa + 1) % capas.length; }
    // tiempo real
    if (tic % 2 === 0 && datos.feed.length) { nuevoEvento(datos.feed[iFeed % datos.feed.length]); iFeed++; }
    // el caso
    if (tic % 2 === 1 && Date.now() > mandaUsuario && pasos.length) marcar((actual + 1) % pasos.length);
  }
  function actualizar() {
    var correr = visible && !pausa && !reducido;
    if (correr && !reloj) reloj = W.setInterval(paso, 1400);
    if (!correr && reloj) { W.clearInterval(reloj); reloj = null; }
    anims.forEach(function (a) { if (correr) a.play(); else a.pause(); });
  }
  if ('IntersectionObserver' in W) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      sec.classList.toggle('is-vivo', visible);
      if (visible) pedirDibujo();
      actualizar();
    }, { rootMargin: '80px 0px' }).observe(sec);
  } else { visible = true; sec.classList.add('is-vivo'); actualizar(); }
  D.addEventListener('visibilitychange', function () { if (D.hidden) { var v = visible; visible = false; actualizar(); visible = v; } else actualizar(); });
  pedirDibujo();
})();
