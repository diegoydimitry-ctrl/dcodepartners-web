/* ============================================================================
   D-CODE PARTNERS — INTERACCIÓN v3
   ----------------------------------------------------------------------------
   Dos piezas, ambas al servicio del mensaje. Ninguna animación decorativa.

   1) ESCENA ANTES/DESPUÉS: las herramientas sueltas de una empresa se
      reorganizan alrededor de un sistema. Es la propuesta de valor en
      movimiento, no un adorno.

   2) DIAGNÓSTICO: el visitante elige su síntoma y ve qué construiríamos.
      Empieza por el problema —igual que la empresa— en vez de por un catálogo.

   Reglas: nada se ejecuta si el elemento no existe; el movimiento se apaga con
   prefers-reduced-motion dejando SIEMPRE el estado final legible; toda la
   interacción es operable con teclado.
   ========================================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------ 1. ESCENA ANTES/DESPUÉS */
  function initScene() {
    var scene = document.querySelector('[data-scene]');
    if (!scene) return;
    var stage = scene.querySelector('.v3-scene-stage');
    var chips = Array.prototype.slice.call(scene.querySelectorAll('.v3-chip'));
    var btns = Array.prototype.slice.call(scene.querySelectorAll('.v3-scene-toggle button'));
    if (!stage || !chips.length) return;

    // Posiciones "sueltas": deliberadamente irregulares y con ligera rotación.
    // El desorden tiene que LEERSE como desorden, no como otra rejilla.
    var scattered = [
      { x: 2,  y: 6,  r: -4 }, { x: 52, y: 0,  r: 3 },
      { x: 8,  y: 40, r: 2 },  { x: 58, y: 33, r: -3 },
      { x: 0,  y: 72, r: 3 },  { x: 47, y: 78, r: -2 }
    ];

    // Estado ORDENADO: rejilla, no anillo. Se probó un anillo elíptico y se
    // descartó con medidas: la columna del hero deja al escenario ~460px, y
    // seis etiquetas de ~170px no caben en esa circunferencia sin solaparse.
    // Peor aún, al medir el ancho de una etiqueta ya apilada (100% del
    // contenedor) la decisión se realimentaba y nunca podía volver al anillo.
    // Una rejilla ordenada comunica lo mismo —de disperso a ordenado— y no
    // tiene ningún caso en el que se rompa.
    function layout(state) {
      var w = stage.clientWidth, h = stage.clientHeight;
      stage.setAttribute('data-layout', state === 'after' ? 'grid' : 'scatter');

      chips.forEach(function (chip, i) {
        if (state === 'after') {
          // Modo columna: lo resuelve CSS con flex. Se limpian los valores en
          // línea para no pelear con la hoja de estilos.
          chip.style.left = ''; chip.style.top = ''; chip.style.transform = '';
        } else {
          var p = scattered[i % scattered.length];
          chip.style.left = (w * p.x / 100) + 'px';
          chip.style.top = (h * p.y / 100) + 'px';
          chip.style.transform = 'rotate(' + p.r + 'deg)';
        }
      });
    }

    function setState(state) {
      scene.setAttribute('data-state', state);
      btns.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-state') === state));
      });
      layout(state);
    }

    btns.forEach(function (b) {
      b.addEventListener('click', function () { setState(b.getAttribute('data-state')); });
    });

    // Estado inicial. Con movimiento reducido se entra directamente en
    // "conectado": es el estado que explica la propuesta, y sin animación una
    // pantalla de herramientas desordenadas no comunica nada por sí sola.
    setState(reduced ? 'after' : 'before');
    if (!reduced) {
      // La transición se dispara sola una vez, al entrar en pantalla.
      var seen = false;
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !seen) {
          seen = true;
          setTimeout(function () { setState('after'); }, 900);
        }
      }, { threshold: 0.12 });
      io.observe(scene);
    }

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { layout(scene.getAttribute('data-state')); }, 140);
    }, { passive: true });
  }

  /* ------------------------------------------------------- 2. DIAGNÓSTICO */
  function initDiagnostic() {
    var root = document.querySelector('[data-diagnostic]');
    if (!root) return;
    var buttons = Array.prototype.slice.call(root.querySelectorAll('.v3-symptom'));
    var answer = root.querySelector('[data-answer]');
    if (!buttons.length || !answer) return;

    function render(btn) {
      var d = btn.dataset;
      var hue = btn.style.getPropertyValue('--hue') || 'var(--c-brand)';
      answer.style.setProperty('--hue', hue);

      var pieces = (d.pieces || '').split('|').filter(Boolean).map(function (p) {
        var parts = p.split('::');            // etiqueta::tono  (tono vacío = a medida)
        var label = parts[0];
        var tone = parts[1];
        var cls = tone ? 'v3-piece' : 'v3-piece is-new';
        var style = tone ? ' style="--ph:var(' + tone + ')"' : '';
        return '<span class="' + cls + '"' + style + '>' + label + '</span>';
      }).join('');

      answer.innerHTML =
        '<div class="v3-answer-head"><span class="v3-answer-dot"></span>' +
        '<span class="v3-answer-kicker">' + (d.kicker || '') + '</span></div>' +
        '<h3>' + (d.title || '') + '</h3>' +
        '<div class="v3-answer-grid">' +
          '<div class="v3-answer-block"><b>Qué pasa hoy</b><p>' + (d.now || '') + '</p></div>' +
          '<div class="v3-answer-block"><b>Qué construimos</b><p>' + (d.build || '') + '</p></div>' +
          '<div class="v3-answer-block"><b>Con qué piezas</b><div class="v3-pieces">' + pieces + '</div></div>' +
        '</div>';

      if (!reduced) {
        answer.removeAttribute('data-anim');
        void answer.offsetWidth;              // reinicia la animación
        answer.setAttribute('data-anim', '');
      }
    }

    function select(btn) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-selected', String(b === btn));
        b.tabIndex = b === btn ? 0 : -1;
      });
      render(btn);
    }

    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () { select(btn); });
      // Navegación con flechas dentro de la lista, como un tablist real.
      btn.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = buttons[(i + 1) % buttons.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = buttons[(i - 1 + buttons.length) % buttons.length];
        if (next) { e.preventDefault(); select(next); next.focus(); }
      });
    });

    select(buttons[0]);
  }

  function boot() { initScene(); initDiagnostic(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
