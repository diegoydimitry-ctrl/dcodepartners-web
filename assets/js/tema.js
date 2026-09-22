/* ============================================================================
   D-CODE PARTNERS — TEMA  ·  oscuro ↔ claro, con cambio de dimensión
   ----------------------------------------------------------------------------
   1. El tema vive en <html data-theme="dark|light">. Lo pone un script de
      tres líneas en el <head> ANTES de pintar (sin destello) leyendo
      localStorage('dcp-tema'). Sin elección guardada, oscuro: es la identidad
      de la marca. Este fichero solo gestiona el botón y el cambio.
   2. El cambio no es un fundido. La página actual se va absorbida hacia la
      IZQUIERDA y la nueva entra desde la DERECHA, con una costura de luz que
      las separa. Se hace con View Transitions: el navegador hace dos fotos
      (antes y después) y las anima en la GPU; no se mueve el DOM real, así
      que no hay reflujo ni coste por elemento.
   3. Sin View Transitions, un barrido de espacio cubre la pantalla, el tema
      cambia debajo y el barrido sigue hacia la izquierda. Con movimiento
      reducido, cambio inmediato.
   4. Parallax del cielo (galaxia.css): cada capa se desplaza con el scroll a
      su propia velocidad. Solo transform, en un rAF, y nada si el usuario
      pide movimiento reducido.
   ========================================================================= */
(function () {
  'use strict';
  var D = document, R = D.documentElement, W = window;
  var CLAVE = 'dcp-tema';
  var EN = (R.getAttribute('lang') || '').slice(0, 2) === 'en';
  var TXT = EN
    ? { aClaro: 'Switch to light mode', aOscuro: 'Switch to dark mode' }
    : { aClaro: 'Cambiar a modo claro', aOscuro: 'Cambiar a modo oscuro' };
  var mqReducido = W.matchMedia('(prefers-reduced-motion: reduce)');

  function actual() { return R.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function guardar(t) { try { W.localStorage.setItem(CLAVE, t); } catch (e) { /* modo privado: solo esta página */ } }

  var boton = D.querySelector('[data-tema-btn]');
  function pintarBoton() {
    if (!boton) return;
    var t = actual();
    boton.setAttribute('aria-label', t === 'dark' ? TXT.aClaro : TXT.aOscuro);
  }
  function metaColor() {
    var m = D.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', actual() === 'light' ? '#f3f5fb' : '#06080d');
  }
  function aplicar(t) {
    // Sin transiciones de color durante el cambio: cientos de elementos
    // animando su color a la vez ensucian la foto nueva y cuestan CPU.
    R.classList.add('tema-cambiando');
    R.setAttribute('data-theme', t);
    W.requestAnimationFrame(function () { W.requestAnimationFrame(function () { if (!enCurso) R.classList.remove('tema-cambiando'); }); });
    guardar(t);
    pintarBoton();
    metaColor();
    try { D.dispatchEvent(new CustomEvent('dcp:tema', { detail: { tema: t } })); } catch (e) {}
  }

  /* ---------------------------------------------------- la transición */
  var enCurso = false;
  function portal() {
    var p = D.createElement('div');
    p.className = 'tema-portal';
    p.setAttribute('aria-hidden', 'true');
    D.body.appendChild(p);
    return p;
  }
  function barrido(nuevo, fin) {
    // Plan B sin View Transitions: una franja de espacio cruza de derecha a
    // izquierda; el tema cambia cuando cubre la pantalla.
    var b = D.createElement('div');
    b.className = 'tema-barrido';
    b.setAttribute('aria-hidden', 'true');
    D.body.appendChild(b);
    b.getBoundingClientRect();
    b.classList.add('is-entra');
    setTimeout(function () {
      aplicar(nuevo);
      b.classList.add('is-sale');
      setTimeout(function () { b.remove(); fin(); }, 460);
    }, 380);
  }
  function cambiar() {
    if (enCurso) return;
    var nuevo = actual() === 'dark' ? 'light' : 'dark';
    if (mqReducido.matches) { aplicar(nuevo); return; }
    enCurso = true;
    var terminar = function () { enCurso = false; R.classList.remove('tema-vt', 'tema-cambiando', 'tema-a-claro', 'tema-a-oscuro'); };
    if (typeof D.startViewTransition !== 'function') { barrido(nuevo, terminar); return; }
    R.classList.add('tema-vt', 'tema-cambiando', nuevo === 'light' ? 'tema-a-claro' : 'tema-a-oscuro');
    var p = null;
    var vt;
    try {
      vt = D.startViewTransition(function () { aplicar(nuevo); p = portal(); });
    } catch (e) { aplicar(nuevo); terminar(); return; }
    vt.finished.then(function () { if (p) p.remove(); terminar(); }, function () { if (p) p.remove(); terminar(); });
  }
  if (boton) {
    boton.addEventListener('click', cambiar);
    pintarBoton();
  }
  metaColor();
  // Otra pestaña cambió el tema: esta se pone igual, sin animación.
  W.addEventListener('storage', function (e) {
    if (e.key === CLAVE && (e.newValue === 'light' || e.newValue === 'dark') && e.newValue !== actual()) {
      R.setAttribute('data-theme', e.newValue); pintarBoton(); metaColor();
    }
  });

  /* ------------------------------------------------ parallax del cielo */
  var capas = [
    { el: D.querySelector('.gx-lejos'), k: 0.035, T: 520 },
    { el: D.querySelector('.gx-medio'), k: 0.07, T: 860 }
  ].filter(function (c) { return c.el; });
  if (capas.length && !mqReducido.matches) {
    var pendiente = false;
    var mover = function () {
      pendiente = false;
      var y = W.scrollY || W.pageYOffset || 0;
      for (var i = 0; i < capas.length; i++) {
        var c = capas[i];
        var T = c.T * (W.innerWidth <= 768 && c.T === 860 ? 0.8 : 1);
        c.el.style.transform = 'translate3d(0,' + (-((y * c.k) % T)).toFixed(1) + 'px,0)';
      }
    };
    W.addEventListener('scroll', function () { if (!pendiente) { pendiente = true; W.requestAnimationFrame(mover); } }, { passive: true });
    mover();
  }
})();
