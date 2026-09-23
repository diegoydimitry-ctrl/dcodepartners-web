/* ==================================================================
   D-Code Partners — comportamiento compartido entre páginas.
   Cada bloque comprueba que sus elementos existen antes de actuar,
   así este mismo archivo es seguro de incluir en cualquier página.
   ================================================================== */
/* ══════════════════════════════════════════════════════════════════
   EL PRESUPUESTO DE FOTOGRAMA  ·  window.DCP
   ══════════════════════════════════════════════════════════════════
   Un PC dibuja esta web sin despeinarse; un iPad, no. Y no por lo mismo
   que un teléfono: el iPad tiene pantalla grande (lienzos enormes),
   pantalla de 2x, y un navegador que compone esos lienzos a mano. Lo que
   MEDIMOS en un iPad simulado (1024×1366, dpr 2, CPU ×4) antes de esto:

     · portada, leyendo quieto ....... 42 ms por fotograma, 27 por encima de 50
     · portada, bajando .............. 40 ms, 47 por encima de 50
     · servicios, leyendo quieto ..... 48 ms, 43 por encima de 50

   Y de dónde salía, apagando cada capa por separado:

     · el campo de partículas de la portada (2.100 puntos, 8,3 ms de
       JavaScript por fotograma) → quitándolo, 40 ms pasan a 18
     · el instrumento de fondo de las páginas interiores (unas 5.000
       operaciones de lienzo por dibujo, a pantalla completa) → quitándolo,
       48 ms pasan a 18. Bajarle los fotogramas por segundo NO servía: el
       coste está en cada dibujo, no en cuántos haya.
     · el cielo y los orbes no aparecen en la medida: no son el problema.

   Así que cada dispositivo tiene su experiencia, y no por el ancho de la
   ventana —que es lo que se hacía y por eso un iPad recibía la carga de un
   escritorio— sino por lo que el dispositivo es y por lo que aguanta:

     pc ......... todo como está: densidad entera, lienzo a 1,75x, sin tope
                  de fotogramas, fondo animado siempre.
     tableta .... lienzo a 1x, densidad al 55 %, 30 fotogramas, el fondo
                  ambiente NO anima en bucle (se redibuja cuando cambia
                  algo) y el campo se queda quieto mientras el dedo baja.
     telefono ... como la tableta, con densidad al 50 %.

   Encima va un GOBERNADOR: mide los fotogramas de verdad y, si no se
   llega al presupuesto, baja un escalón de calidad (y sube otra vez si
   sobra holgura). Un iPad viejo acaba en menos densidad que uno nuevo sin
   que nadie tenga que decidirlo aquí.

   Todo esto es un objeto y nada más: si este fichero no cargara, cada
   módulo sigue con sus valores de siempre. */
(function () {
  'use strict';
  var W = window, D = document;
  var reducido = W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var grueso = W.matchMedia('(pointer:coarse)').matches;
  /* Tableta o teléfono NO se decide por el ancho de la ventana: un iPad en
     vertical mide 834 px y se llevaría el trato de un móvil, y al girarlo
     cambiaría de clase a mitad de visita. Se decide por el lado mayor de la
     PANTALLA, que no cambia al girar: un iPhone grande llega a 932 y un iPad
     pequeño empieza en 1.133. */
  var lado = 0;
  try { lado = Math.max(W.screen.width || 0, W.screen.height || 0); } catch (e) {}
  if (!lado) lado = Math.max(W.innerWidth || 0, W.innerHeight || 0);
  var clase = !grueso ? 'pc' : (lado >= 1000 ? 'tableta' : 'telefono');

  /* EL CAMPO DE PARTÍCULAS, SOLO CON RATÓN. Medido en el perfil iPad bajando
     por los pasos de la portada: el lienzo fijo a pantalla completa costaba
     1.414 ms de compositor en el recorrido; con el MISMO lienzo dibujando
     pero oculto, 311. Es decir, lo caro no era calcular las partículas sino
     subir una textura del tamaño de la pantalla a la GPU en cada fotograma,
     y por eso congelarlo no arreglaba nada en un iPad de verdad. En táctil
     el campo se apaga entero y el cielo lo pone la galaxia, que son mosaicos
     ya pintados y degradados: se compone una vez y no se vuelve a tocar. */
  var PERFIL = {
    pc:       { dpr: 1.75, densidad: 1,    msMin: 0,  ambienteVivo: true,  pausaScroll: 0,   suelo: 0.6,  campoVivo: true },
    tableta:  { dpr: 1,    densidad: 0.55, msMin: 33, ambienteVivo: false, pausaScroll: 700, suelo: 0.35, campoVivo: false },
    telefono: { dpr: 1,    densidad: 0.5,  msMin: 33, ambienteVivo: false, pausaScroll: 700, suelo: 0.3,  campoVivo: false }
  };
  var P = PERFIL[clase];
  var nivel = 1;                    // lo mueve el gobernador
  var oyentes = [];

  var DCP = {
    clase: clase,
    grueso: grueso,
    reducido: reducido,
    /* El dpr que toca. El techo que pasa cada módulo es el suyo de siempre:
       en «pc» manda ese, en táctil manda el del perfil. */
    dpr: function (techo) {
      var d = W.devicePixelRatio || 1;
      var tope = Math.min(techo == null ? 2 : techo, P.dpr);
      /* Con el gobernador bajo, también baja la resolución del lienzo: es
         lo que más alivia al compositor sin tocar lo que se ve. */
      if (nivel < 1) tope = Math.max(0.75, tope * (0.85 + nivel * 0.15));
      return Math.min(d, tope);
    },
    /* Cuántas partículas de las que pediría un escritorio. */
    densidad: function () { return P.densidad * nivel; },
    /* Milisegundos mínimos entre fotogramas (0 = los que dé el navegador). */
    msMin: function () { return P.msMin; },
    /* ¿El fondo ambiente anima en bucle, o se redibuja cuando cambia algo? */
    ambienteVivo: function () { return P.ambienteVivo && !reducido; },
    /* ¿Se monta el campo de partículas a pantalla completa? En táctil no: su
       sitio lo ocupa la galaxia, que no cuesta nada por fotograma. */
    campoVivo: function () { return P.campoVivo; },
    /* Mientras el dedo baja, el campo se queda quieto este rato. */
    pausaScroll: function () { return P.pausaScroll; },
    nivel: function () { return nivel; },
    /* Avisa cuando cambia el escalón de calidad: cada módulo se reconstruye. */
    suscribir: function (fn) { if (typeof fn === 'function') oyentes.push(fn); },
    info: function () { return { clase: clase, nivel: nivel, dpr: DCP.dpr(1.75), densidad: DCP.densidad() }; }
  };
  W.DCP = DCP;

  function avisar() { for (var i = 0; i < oyentes.length; i++) { try { oyentes[i](nivel); } catch (e) {} } }

  /* ---------------------------------------------------- el gobernador
     Mide de verdad, en ventanas de 90 fotogramas, y compara el percentil 90
     con el presupuesto (33 ms en táctil, 16,7 en escritorio). Dos ventanas
     malas seguidas bajan un escalón; tres buenas seguidas suben uno. La
     histéresis evita el vaivén, y nunca baja del suelo del perfil ni sube
     por encima de 1. */
  var ESCALONES = [1, 0.75, 0.55, 0.4, 0.3];
  var objetivo = P.msMin || 16.7;
  var muestras = [], malas = 0, buenas = 0, ultimo = 0, activo = true, ultimoCambio = -1e9;
  if (!reducido) {
    var mide = function (t) {
      if (!activo) return;
      if (ultimo) {
        var dt = t - ultimo;
        /* Un salto enorme es la pestaña volviendo del fondo, no un fallo
           de pintado: no cuenta. */
        if (dt < 900) muestras.push(dt);
      }
      ultimo = t;
      /* Ventanas cortas: con 90 fotogramas a 25 por segundo, el primer
         ajuste tardaba ocho segundos y esos ocho segundos son justo los que
         alguien pasa mirando la portada por primera vez. */
      if (muestras.length >= 45) {
        var orden = muestras.slice().sort(function (a, b) { return a - b; });
        var p90 = orden[Math.floor(orden.length * 0.9)];
        muestras.length = 0;
        /* Una ventana catastrófica (más del doble del presupuesto) no espera
           a la segunda: se baja ya. */
        if (p90 > objetivo * 2.2) { malas += 2; buenas = 0; }
        else if (p90 > objetivo * 1.6) { malas++; buenas = 0; }
        else if (p90 < objetivo * 1.05) { buenas++; malas = 0; }
        else { malas = 0; buenas = 0; }
        var i = ESCALONES.indexOf(nivel);
        /* Un cambio de escalón reconstruye el campo: como mucho uno cada ocho
           segundos, para que un equipo en el límite no se pase la visita
           reconstruyéndose. */
        var puede = (t - ultimoCambio) > 8000;
        if (puede && malas >= 2 && i < ESCALONES.length - 1 && ESCALONES[i + 1] >= P.suelo) {
          nivel = ESCALONES[i + 1]; malas = 0; ultimoCambio = t; avisar();
        } else if (puede && buenas >= 4 && i > 0) {
          nivel = ESCALONES[i - 1]; buenas = 0; ultimoCambio = t; avisar();
        }
      }
      W.requestAnimationFrame(mide);
    };
    W.requestAnimationFrame(mide);
    D.addEventListener('visibilitychange', function () { ultimo = 0; muestras.length = 0; });
  }

  /* La hora del último scroll, en un solo sitio. Cada lienzo la consulta
     para quedarse quieto mientras el dedo baja; antes solo la escribía el
     campo de la portada, así que en las páginas interiores esa pausa no
     llegaba a aplicarse nunca. */
  W.__dcpScroll = 0;
  W.addEventListener('scroll', function () { W.__dcpScroll = performance.now(); }, { passive: true });

  /* Una marca en <html> para que el CSS también pueda aligerar. */
  D.documentElement.setAttribute('data-dispositivo', clase);

  /* LA CLASE SE VUELVE A MIRAR. Se decidía una vez al cargar, y eso deja dos
     casos mal: un portátil con pantalla táctil al que se le conecta un ratón,
     y —sobre todo— las herramientas de desarrollo, que al activar el modo
     teléfono cambian el puntero y el tamaño SIN recargar; la página seguía
     creyéndose un PC y lo que se veía allí no era lo que ve un teléfono. */
  function revisarClase() {
    var g = W.matchMedia('(pointer:coarse)').matches;
    var l = 0;
    try { l = Math.max(W.screen.width || 0, W.screen.height || 0); } catch (e) {}
    if (!l) l = Math.max(W.innerWidth || 0, W.innerHeight || 0);
    var nueva = !g ? 'pc' : (l >= 1000 ? 'tableta' : 'telefono');
    if (nueva === clase) return;
    clase = nueva; P = PERFIL[clase]; grueso = g;
    objetivo = P.msMin || 16.7;
    nivel = 1; muestras.length = 0; malas = 0; buenas = 0; ultimoCambio = -1e9;
    DCP.clase = clase; DCP.grueso = g;
    D.documentElement.setAttribute('data-dispositivo', clase);
    avisar();
  }
  var mqPuntero = W.matchMedia('(pointer:coarse)');
  if (mqPuntero.addEventListener) mqPuntero.addEventListener('change', revisarClase);
  else if (mqPuntero.addListener) mqPuntero.addListener(revisarClase);
  var tRev;
  W.addEventListener('resize', function () { clearTimeout(tRev); tRev = setTimeout(revisarClase, 250); }, { passive: true });
})();

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Trabajo diferido para no competir con el primer input ----------
     Justo al llegar a una página, este script hace bastante trabajo síncrono
     de golpe (menú, indicador de nav, reveal, canvas del hero, líneas de
     Departamentos...). Lo esencial para que la página se vea y sea navegable
     va primero, sin diferir. Lo puramente decorativo y algo más caro de
     calcular (el canvas del hero, las líneas de Departamentos) se pospone un
     instante con requestIdleCallback — así no compite con el primer gesto de
     scroll del usuario justo después de cargar. */
  var runWhenIdle = function (fn) {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 400 });
    else setTimeout(fn, 1);
  };

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Saltos a ancla suaves (skip-link, índice lateral de Home) ----------
     scroll-behavior:smooth ya NO está en <html> (ver styles.css) porque
     interfería con el scroll normal de rueda/trackpad. Los saltos a un
     punto concreto de la página siguen siendo suaves, pero puntuales: se
     resuelven aquí, en JS, sin tocar el comportamiento del scroll continuo. */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return; // deja que el navegador haga su comportamiento por defecto
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      if (history.pushState) history.pushState(null, '', '#' + id);
      /* El foco va con el salto. Sin esto, «Saltar al contenido» movía la
         vista pero dejaba el foco en el propio enlace, y el siguiente Tab
         volvía a la cabecera: el salto no saltaba para quien usa teclado. */
      if (!/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(target.tagName) && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      try { target.focus({ preventScroll: true }); } catch (err) { target.focus(); }
    });
  });

  /* ---------- Mobile nav toggle ---------- */
  var burger = document.getElementById('burger');
  var mainNav = document.getElementById('main-nav');
  if (burger && mainNav) {
    burger.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    var closeMobileNav = function () {
      burger.classList.remove('open');
      mainNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.querySelectorAll('.has-mega.mega-open').forEach(function (item) {
        item.classList.remove('mega-open');
        var t = item.querySelector('.mega-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    };
    // Links that navigate close the mobile nav. The mega-trigger and links
    // inside the mega-menu itself are handled separately below so tapping
    // "Servicios" on mobile expands the submenu instead of closing the nav.
    mainNav.querySelectorAll(':scope > ul > li > a:not(.mega-trigger)').forEach(function (a) {
      a.addEventListener('click', closeMobileNav);
    });
    mainNav.querySelectorAll('.mega-menu a').forEach(function (a) {
      a.addEventListener('click', closeMobileNav);
    });
    // Esc cierra el menú móvil y devuelve el foco al botón que lo abrió
    // (contrato Drawer del D-Code Design System).
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !mainNav.classList.contains('open')) return;
      closeMobileNav();
      burger.focus();
    });
  }

  /* ---------- Language switcher (ES default, /en/ mirrors every ES path) ----------
     Los enlaces ya llevan en el HTML su href real (rastreable sin JS). Esto
     solo los reajusta a la URL exacta de la visita (p. ej. una 404 en una
     ruta cualquiera). */
  document.querySelectorAll('.lang-switch').forEach(function (switcher) {
    var path = window.location.pathname;
    var isEn = path === '/en' || path.indexOf('/en/') === 0;
    var esHref = isEn ? (path.replace(/^\/en/, '') || '/') : path;
    var enHref = isEn ? path : ('/en' + (path === '/' ? '' : path));
    var esLink = switcher.querySelector('[data-lang="es"]');
    var enLink = switcher.querySelector('[data-lang="en"]');
    if (esLink) { esLink.href = esHref; esLink.setAttribute('aria-current', isEn ? 'false' : 'true'); }
    if (enLink) { enLink.href = enHref; enLink.setAttribute('aria-current', isEn ? 'true' : 'false'); }
  });

  /* ---------- Mega menu (desktop hover + keyboard, mobile tap-toggle) ---------- */
  document.querySelectorAll('.has-mega').forEach(function (item) {
    var trigger = item.querySelector('.mega-trigger');
    if (!trigger) return;
    // Escritorio: el menú se abre con :hover y :focus-within, así que con el
    // teclado no había forma de cerrarlo sin salir del bloque. Esc lo oculta
    // (.mega-dismissed), deja el foco en el disparador y el menú vuelve a
    // abrirse en cuanto el ratón o el foco salen y regresan.
    item.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || window.innerWidth <= 940) return;
      item.classList.add('mega-dismissed');
      trigger.focus();
    });
    item.addEventListener('mouseleave', function () { item.classList.remove('mega-dismissed'); });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) item.classList.remove('mega-dismissed');
    });
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth > 940) return; // desktop uses hover/focus via CSS — umbral alineado con el CSS (DIR-052)
      e.preventDefault();
      var isOpen = item.classList.toggle('mega-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- Nav sliding indicator ----------
     Creado por JS (no en el HTML de cada página) para no tener que tocar
     la cabecera compartida en las 58 páginas del sitio: una sola píldora
     que se desliza entre los elementos del menú al pasar el ratón, y
     vuelve a la página activa al salir. Solo en desktop — el menú móvil
     es un panel vertical donde esto no aplica. */
  var navTopList = document.querySelector('nav.main-nav > ul');
  if (navTopList) {
    var navIndicator = document.createElement('span');
    navIndicator.className = 'nav-indicator';
    navIndicator.setAttribute('aria-hidden', 'true');
    navTopList.appendChild(navIndicator);

    var navTopLinks = Array.prototype.slice.call(
      navTopList.querySelectorAll(':scope > li > a, :scope > li > .nav-link-btn')
    );

    var moveNavIndicator = function (el) {
      if (!el || window.innerWidth <= 940) { navIndicator.style.opacity = '0'; return; }
      var elRect = el.getBoundingClientRect();
      var listRect = navTopList.getBoundingClientRect();
      navIndicator.style.width = elRect.width + 'px';
      navIndicator.style.transform = 'translateX(' + (elRect.left - listRect.left) + 'px)';
      navIndicator.style.opacity = '1';
    };

    var navActiveLink = navTopList.querySelector(':scope > li > a[aria-current="page"]');
    navTopLinks.forEach(function (a) {
      a.addEventListener('mouseenter', function () { moveNavIndicator(a); });
      a.addEventListener('focus', function () { moveNavIndicator(a); });
    });
    navTopList.addEventListener('mouseleave', function () { moveNavIndicator(navActiveLink); });

    var navIndicatorResizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(navIndicatorResizeTimer);
      navIndicatorResizeTimer = setTimeout(function () { moveNavIndicator(navActiveLink); }, 150);
    });
    // Posición inicial tras el primer layout (fuentes/webfonts pueden
    // desplazar ligeramente el ancho real de cada enlace).
    window.requestAnimationFrame(function () { moveNavIndicator(navActiveLink); });
  }

  /* ---------- Scroll reveal ----------
     EL UMBRAL PROPORCIONAL ESCONDIA LAS PAGINAS LARGAS. Estaba en
     threshold:0.15, que quiere decir "el 15% del AREA DEL ELEMENTO tiene que
     estar en pantalla". Para una tarjeta de 300 px eso son 45 px y entra
     enseguida; para el cuerpo de la Politica de Privacidad, que mide 4.457 px,
     son 668 px — asi que la pagina se abria con el titulo y CUATRO MIL
     QUINIENTOS PIXELES EN BLANCO, y el texto solo aparecia despues de
     desplazarse un buen trecho.

     Y en una ventana mas baja que ese 15% no aparecia NUNCA: en un navegador
     de 600 px de alto la politica de privacidad era, sencillamente, invisible.

     Medido antes del arreglo, con la ventana a 1440x900:
       /privacidad                     .prose 4.457 px · opacidad 0 al cargar
       /condiciones-contratacion       igual
       /acuerdo-encargado-tratamiento  igual
       /aviso-legal (3.086 px)         entraba por los pelos

     La correccion es la que debio ser desde el principio: threshold 0 —basta
     con que ASOME— y un margen negativo abajo para que entre un poco antes de
     llegar del todo. El efecto se ve igual en los bloques pequeños, y los
     grandes dejan de desaparecer. Ademas se marca visible de entrada todo lo
     que ya esta en la primera pantalla, para que nada se vea "aparecer" en un
     sitio donde el usuario no ha llegado a hacer scroll todavia. */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-up, .reveal-blur, .reveal-narrow, .reveal-converge');
  if (revealEls.length) {
    /* MOVIMIENTO REDUCIDO: TODO VISIBLE YA.
       Esto faltaba. Con prefers-reduced-motion los bloques seguian empezando a
       opacidad 0 esperando al observador, asi que quien tiene esa preferencia
       activada —justo quien no deberia depender de una animacion— se
       encontraba /conocenos, /blog, /departamentos y /contacto con bloques en
       blanco hasta que hiciera scroll. Medido: 2 bloques invisibles en
       /conocenos, 2 en /blog, 2 en /departamentos, 1 en /contacto.
       La entrada es un adorno; el contenido no. */
    if (prefersReducedMotion) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
      var pend = [];
      revealEls.forEach(function (el) {
        // Lo que ya se ve al cargar no se "revela": ya esta.
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('is-visible'); return; }
        io.observe(el); pend.push(el);
      });
      /* RED DE SEGURIDAD. El observador entrega sus avisos una vez por
         fotograma y contra la posicion del momento de la entrega: si el
         visitante arrastra la barra de scroll o da un golpe de trackpad, la
         pagina salta por encima de bloques enteros y esos bloques SE QUEDAN
         INVISIBLES. Medido en /departamentos/comercial recorriendola a
         saltos: doce bloques seguian a opacidad 0 al terminar — el radar, las
         cabeceras, los enlaces y toda la fila de resultados. Media pagina en
         blanco.

         Esto barre lo que quede pendiente cuando el scroll para. Se
         autolimita: cada elemento sale de la lista al mostrarse, y cuando la
         lista se vacia el oyente se retira solo. */
      if (pend.length) {
        var pt = null;
        var barrer = function () {
          for (var i = pend.length - 1; i >= 0; i--) {
            var e = pend[i], b = e.getBoundingClientRect();
            /* Antes pedia ademas b.bottom > 0, o sea "que siga a la vista".
               Un arrastre de la barra hasta el final deja los bloques POR
               ENCIMA de la ventana y ya no volvian a cumplirlo nunca: se
               quedaban invisibles para siempre. Medido saltando al final de
               /conocenos, /blog, /departamentos y /servicios/agentes-ia.
               Entrar sin animacion es infinitamente mejor que no entrar. */
            if (b.top < window.innerHeight * 0.92) {
              e.classList.add('is-visible'); io.unobserve(e); pend.splice(i, 1);
            }
          }
          if (!pend.length) {
            window.removeEventListener('scroll', tras);
            window.removeEventListener('pageshow', tras);
          }
        };
        var tras = function () { clearTimeout(pt); pt = setTimeout(barrer, 140); };
        window.addEventListener('scroll', tras, { passive: true });
        /* Al volver con el boton de atras el navegador restaura la posicion de
           scroll DESPUES de que este codigo haya decidido que se ve y que no,
           asi que hay que volver a mirar. */
        window.addEventListener('pageshow', tras);
        setTimeout(barrer, 260);
      }
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------- Hero console: línea de log ----------
     El panel del Hero deja de ser una lista estática de "Conectado" y hace
     visible, con eventos concretos, la promesa del H1 ("cada Departamento
     lo hace por ti, todos los días"). Mensajes en data-log-cycle (JSON),
     ya en el idioma de la página -- sin lógica de i18n aquí.
     DIR-006: recorre la lista UNA vez y se detiene en el último mensaje --
     un log que rota para siempre es exactamente el cliché de "vida de
     terminal ambiental" que la investigación de esta ronda señala como
     genérico en 2026 ("infinite scrolling logs... reads as templated, not
     alive"). Un evento que ocurre y se asienta se lee como un sistema que
     hizo algo real, no como una animación decorativa en bucle.
     Con prefers-reduced-motion se queda en el primer mensaje, sin rotar. */
  var heroLogLine = document.querySelector('.hero-console-log-line');
  if (heroLogLine && !prefersReducedMotion) {
    var logLines = [];
    try { logLines = JSON.parse(heroLogLine.getAttribute('data-log-cycle') || '[]'); } catch (e) {}
    if (logLines.length > 1) {
      var logIdx = 0;
      var logTimer = setInterval(function () {
        logIdx += 1;
        if (logIdx >= logLines.length) { clearInterval(logTimer); return; }
        heroLogLine.classList.add('is-swapping');
        setTimeout(function () {
          heroLogLine.textContent = logLines[logIdx];
          heroLogLine.classList.remove('is-swapping');
        }, 300);
      }, 3800);
    }
  }

  /* ---------- Departamentos (Home): pulso del sistema conectado ----------
     Arranca solo cuando la sección entra en pantalla (dos pasadas y se
     detiene), no en bucle infinito desde la carga -- ver comentario junto
     a .dept-flow en styles.css. */
  var deptRowsEl = document.querySelector('.dept-rows');
  if (deptRowsEl && !prefersReducedMotion && 'IntersectionObserver' in window) {
    var deptFlowIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          deptRowsEl.classList.add('is-flowing');
          deptFlowIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    deptFlowIO.observe(deptRowsEl);
  }

  /* ---------- Panel de control de Departamentos (DIR-WEB-20260820-002) ----------
     Solo existe en /departamentos (hub): lista maestra de 8 botones +
     panel de detalle. Cambia únicamente por acción del visitante (click o
     teclado), nunca por temporizador. En móvil (<=760px, la misma
     ruptura que usa el propio CSS del componente) el detalle vive debajo
     de la rejilla en vez de al lado, así que además de alternar el panel
     activo se lleva a la vista con scroll suave -- comportamiento propio
     de móvil, no una versión reducida del de escritorio. */
  var deptConsole = document.querySelector('[data-dept-console]');
  if (deptConsole) {
    var dcItems = Array.prototype.slice.call(deptConsole.querySelectorAll('.dept-console-item'));
    var dcPanes = Array.prototype.slice.call(deptConsole.querySelectorAll('.dept-console-pane'));
    var dcDetail = deptConsole.querySelector('.dept-console-detail');

    /* DIR-WEB-VIZ-20260821: (re)dispara la entrada animada de la
       visualización de un Departamento -- se llama al abrir su pestaña
       (nunca por scroll, esto vive dentro de pestañas). Quitar y volver a
       añadir la clase fuerza el reflow para que la animación se repita
       cada vez que se vuelve a entrar en la misma pestaña. Con
       prefers-reduced-motion no se añade nunca: el contenido se queda
       exactamente como estaba (estático, en su posición final). */
    function activateVisual(pane) {
      var visual = pane && pane.querySelector('.dcp-visual');
      if (!visual || prefersReducedMotion) return;
      visual.classList.remove('dcv-live');
      void visual.offsetWidth;
      visual.classList.add('dcv-live');
    }

    dcItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var dept = item.getAttribute('data-dept');
        if (item.classList.contains('is-active')) {
          if (window.innerWidth <= 760 && dcDetail) { dcDetail.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' }); }
          return;
        }
        dcItems.forEach(function (i) {
          var active = i === item;
          i.classList.toggle('is-active', active);
          i.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        var newPane = null;
        dcPanes.forEach(function (pane) {
          var active = pane.getAttribute('data-dept') === dept;
          pane.classList.toggle('is-active', active);
          pane.hidden = !active;
          if (active) newPane = pane;
        });
        activateVisual(newPane);
        if (window.innerWidth <= 760 && dcDetail) {
          dcDetail.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
        }
      });
    });

    // La pestaña activa por defecto (Comercial) también reproduce su
    // entrada, no solo las que se abren con un clic.
    activateVisual(deptConsole.querySelector('.dept-console-pane.is-active'));

    // Leyenda compartida: al pasar el cursor (o tocar) cada etapa/columna/
    // ticket, cambia el texto de .dcv-caption para explicar qué hace la IA
    // ahí -- la interacción tiene un propósito, no es solo decorativa.
    Array.prototype.slice.call(deptConsole.querySelectorAll('[data-caption]')).forEach(function (node) {
      var visual = node.closest('.dcp-visual');
      var captionEl = visual && visual.querySelector('.dcv-caption');
      if (!captionEl) return;
      var defaultText = captionEl.getAttribute('data-default') || captionEl.textContent;
      function show() { captionEl.textContent = node.getAttribute('data-caption'); }
      function hide() { captionEl.textContent = defaultText; }
      node.addEventListener('mouseenter', show);
      node.addEventListener('mouseleave', hide);
      node.addEventListener('click', show);
    });
  }

  /* ---------- Red de Departamentos (líneas de conexión entre tarjetas) ----------
     Solo existe en /departamentos (hub): un trazo SVG entre cada tarjeta y la
     siguiente, calculado a partir de la posición real (responsive), que se
     "dibuja" cuando la tarjeta de llegada entra en pantalla. Se desactiva por
     completo por debajo de 900px (la cuadrícula pasa a una columna). */
  var deptGrid = document.querySelector('.servicios-cards[data-stagger]');
  var deptSvg = deptGrid ? deptGrid.querySelector('.dept-connections') : null;
  if (deptGrid && deptSvg) {
    var deptCards = Array.prototype.slice.call(deptGrid.querySelectorAll(':scope > .service-card'));
    var deptPaths = []; // { el, toCard }
    var deptRevealed = []; // cards whose connection has already been drawn in (survives a resize rebuild)

    var buildDeptConnections = function () {
      if (window.innerWidth < 900 || !deptCards.length) { deptSvg.innerHTML = ''; deptPaths = []; return; }
      var gridRect = deptGrid.getBoundingClientRect();
      var svgNS = 'http://www.w3.org/2000/svg';
      deptSvg.innerHTML =
        '<defs><linearGradient id="dept-connection-grad" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#43e0ff"/><stop offset="1" stop-color="#9b6bff"/>' +
        '</linearGradient></defs>';
      deptPaths = [];
      var centers = deptCards.map(function (card) {
        var r = card.getBoundingClientRect();
        return { x: r.left - gridRect.left + r.width / 2, y: r.top - gridRect.top + r.height / 2 };
      });
      for (var i = 0; i < centers.length - 1; i++) {
        var a = centers[i], b = centers[i + 1];
        var midY = (a.y + b.y) / 2;
        var d = 'M' + a.x + ',' + a.y + ' Q' + a.x + ',' + midY + ' ' + (a.x + b.x) / 2 + ',' + midY +
          ' T' + b.x + ',' + b.y;
        var path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', d);
        deptSvg.appendChild(path);
        var len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        deptPaths.push({ el: path, toCard: deptCards[i + 1] });
      }
      // Re-apply immediately for cards already revealed before this rebuild
      // (e.g. a window resize after the user has scrolled past them) — a
      // freshly built path always starts hidden otherwise.
      deptPaths.forEach(function (p) {
        if (deptRevealed.indexOf(p.toCard) !== -1) p.el.style.strokeDashoffset = '0';
      });
    };

    var drawDeptConnectionsFor = function (card) {
      if (deptRevealed.indexOf(card) === -1) deptRevealed.push(card);
      deptPaths.forEach(function (p) {
        if (p.toCard === card) p.el.style.strokeDashoffset = '0';
      });
    };

    runWhenIdle(buildDeptConnections);
    if ('IntersectionObserver' in window) {
      var deptIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            drawDeptConnectionsFor(entry.target);
            deptIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      deptCards.forEach(function (c) { deptIO.observe(c); });
    }

    var deptResizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(deptResizeTimer);
      deptResizeTimer = setTimeout(buildDeptConnections, 200);
    });
  }

  /* ---------- Side-index scroll-spy (home page only) ---------- */
  var indexLinks = document.querySelectorAll('.side-index a');
  var trackedSections = document.querySelectorAll('main section[id]');
  if (indexLinks.length && trackedSections.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      indexLinks.forEach(function (a) {
        a.classList.toggle('active', a.dataset.target === id);
      });
    };
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    trackedSections.forEach(function (s) { sectionIO.observe(s); });
  }

  /* ---------- Interactive window tilt + spotlight ----------
     Solo importa al pasar el ratón por encima, nunca en el primer frame —
     diferido para no sumarse al trabajo síncrono justo al cargar la
     página, que es precisamente lo que compite con el primer gesto de
     scroll del usuario tras un cambio de página. */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    runWhenIdle(function () {
      // Mueve --rx/--ry/--mx/--my 1:1 con el cursor para el tilt+spotlight
      // de las tarjetas .window reales — un efecto sutil y de bajo coste.
      document.querySelectorAll('.window:not(.chat-window)').forEach(function (win) {
        win.addEventListener('mousemove', function (e) {
          var rect = win.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width;
          var py = (e.clientY - rect.top) / rect.height;
          var maxTilt = 3.5;
          win.style.setProperty('--rx', ((px - 0.5) * maxTilt * 2) + 'deg');
          win.style.setProperty('--ry', (-(py - 0.5) * maxTilt * 2) + 'deg');
          win.style.setProperty('--mx', (px * 100) + '%');
          win.style.setProperty('--my', (py * 100) + '%');
        });
        win.addEventListener('mouseleave', function () {
          win.style.setProperty('--rx', '0deg');
          win.style.setProperty('--ry', '0deg');
          win.style.setProperty('--mx', '50%');
          win.style.setProperty('--my', '50%');
        });
      });
    });
  }


  /* ---------- Desplegables <details>: abrir uno cierra el anterior ----------
     Los planes de Finance son <details> nativos —sin JavaScript se abren, se
     recorren con el teclado y el buscador del navegador encuentra dentro—.
     Lo único que les falta es no acumularse: tres abiertos son tres metros de
     página. Se cierran entre ellos con una línea, y el que vive dentro de la
     demo financiera se queda fuera: allí manda su propio código. */
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (!d || d.tagName !== 'DETAILS' || !d.open) return;
    if (window.__dcpImprimiendo) return;   // al imprimir se abren todos a la vez
    if (d.closest('.fdemo-app')) return;
    document.querySelectorAll('details[open]').forEach(function (o) {
      if (o !== d && !o.closest('.fdemo-app') && !o.contains(d) && !d.contains(o)) cierraSuave(o);
    });
  }, true);

  /* ---------- Los desplegables, abriendo y cerrando con suavidad ----------
     Un <details> abre de golpe: el navegador le quita el display:none al
     cuerpo y la pagina pega un salto de trescientos pixeles. Aqui se anima la
     ALTURA, que es lo unico que se puede animar de verdad: al abrir, de cero
     a lo que mida; al cerrar, de lo que mida a cero, y solo entonces se
     quita el atributo `open`.

     Si no hay JavaScript, o si alguien tiene el movimiento reducido, sigue
     abriendo igual. Se pierde la suavidad, no la funcion. */
  var suavePrefiere = window.matchMedia('(prefers-reduced-motion: reduce)');
  function cuerpoDe(d) { return d.querySelector(':scope > .plan-body, :scope > *:not(summary)'); }
  function abreSuave(d) {
    var c = cuerpoDe(d); if (!c || suavePrefiere.matches) { d.open = true; return; }
    d.open = true;
    var alto = c.scrollHeight;
    d.classList.add('es-animando');
    c.style.setProperty('--alto', '0px');
    /* Dos fotogramas: uno para que el navegador acepte la altura cero como
       punto de partida, y el siguiente para animar hacia la altura real. */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        c.style.setProperty('--alto', alto + 'px');
        setTimeout(function () {
          d.classList.remove('es-animando');
          c.style.removeProperty('--alto');
        }, 360);
      });
    });
  }
  function cierraSuave(d) {
    var c = cuerpoDe(d); if (!c || suavePrefiere.matches) { d.open = false; return; }
    var alto = c.scrollHeight;
    d.classList.add('es-animando', 'es-cerrando');
    c.style.setProperty('--alto', alto + 'px');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        c.style.setProperty('--alto', '0px');
        setTimeout(function () {
          d.open = false;
          d.classList.remove('es-animando', 'es-cerrando');
          c.style.removeProperty('--alto');
        }, 340);
      });
    });
  }
  document.querySelectorAll('details.plan').forEach(function (d) {
    var sum = d.querySelector(':scope > summary'); if (!sum) return;
    sum.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (d.open) cierraSuave(d);
      else {
        document.querySelectorAll('details[open]').forEach(function (o) {
          if (o !== d && !o.closest('.fdemo-app') && !o.contains(d) && !d.contains(o)) cierraSuave(o);
        });
        abreSuave(d);
      }
    });
  });

  /* ---------- Llegar a contacto desde un plan ----------
     El boton de cada plan trae ?plan=finance-ia. Sin esto, la persona llega
     al formulario y tiene que volver a explicar de que venia hablando; con
     esto, el mensaje ya trae escrito el plan por el que pregunta y lo unico
     que hace falta anadir es lo suyo. */
  (function () {
    var plan = new URLSearchParams(location.search).get('plan');
    if (!plan) return;
    var NOMBRES = {
      'finance': 'Finance',
      'finance-ia': 'Finance con inteligencia',
      'finance-medida': 'Finance a medida'
    };
    var en = document.documentElement.lang === 'en';
    // En inglés, el nombre con el que el plan aparece en /en/sistema-financiero.
    if (en) NOMBRES = { 'finance': 'Finance', 'finance-ia': 'Finance with intelligence', 'finance-medida': 'Finance, made to measure' };
    var nombre = NOMBRES[plan];
    if (!nombre) return;
    var caja = document.querySelector('textarea[name="mensaje"]');
    if (!caja || caja.value.trim()) return;
    caja.value = en
      ? 'Hi — I am interested in the \u201c' + nombre + '\u201d plan. I would like to know whether it fits what we do.\n\n'
      : 'Hola: me interesa el plan ' + nombre + '. Me gustaría saber si encaja con lo que hacemos.\n\n';
    var aviso = document.createElement('p');
    aviso.className = 'form-desde-plan';
    aviso.textContent = en ? 'You arrived from the \u201c' + nombre + '\u201d plan.' : 'Vienes del plan ' + nombre + '.';
    // Arriba del formulario, no junto al mensaje: el mensaje está en el paso 3
    // y el aviso tiene que verse al llegar.
    var form = caja.closest('form'), primero = form && form.querySelector('.form-step');
    if (primero) primero.parentNode.insertBefore(aviso, primero);
    else if (caja.parentNode) caja.parentNode.insertBefore(aviso, caja);
  })();

  /* ---------- Llegar a contacto desde el diagnóstico ----------
     El diagnóstico de la portada deja su resumen en sessionStorage (nunca en
     la URL) y enlaza con ?desde=diagnostico. Si el mensaje está vacío, se
     escribe con ese resumen: la persona solo tiene que añadir lo suyo. */
  (function () {
    if (new URLSearchParams(location.search).get('desde') !== 'diagnostico') return;
    var texto = null;
    try { texto = sessionStorage.getItem('dcp-diagnostico'); } catch (e) { return; }
    if (!texto) return;
    var caja = document.querySelector('textarea[name="mensaje"]');
    if (!caja || caja.value.trim()) return;
    caja.value = texto;
    var en = document.documentElement.lang === 'en';
    var aviso = document.createElement('p');
    aviso.className = 'form-desde-plan';
    aviso.textContent = en ? 'You arrived from the diagnostic: your estimate is already in the message.' : 'Vienes del diagnóstico: tu estimación ya está en el mensaje.';
    // Arriba del formulario, no junto al mensaje: el mensaje está en el paso 3
    // y el aviso tiene que verse al llegar.
    var form = caja.closest('form'), primero = form && form.querySelector('.form-step');
    if (primero) primero.parentNode.insertBefore(aviso, primero);
    else if (caja.parentNode) caja.parentNode.insertBefore(aviso, caja);
  })();

  /* ---------- Al imprimir, los desplegables se imprimen abiertos ----------
     Un <details> cerrado no imprime su contenido aunque el CSS lo intente:
     los planes saldrían en el papel sin decir qué incluyen. Se abren al
     imprimir y se devuelven como estaban al terminar. */
  (function () {
    var abiertos = [];
    window.addEventListener('beforeprint', function () {
      window.__dcpImprimiendo = true;
      abiertos = [];
      document.querySelectorAll('details:not([open])').forEach(function (d) { d.setAttribute('open', ''); abiertos.push(d); });
      // Las ilustraciones animadas, en su estado final (el mismo que ve quien
      // tiene el movimiento reducido).
      document.querySelectorAll('.motion-journey').forEach(function (m) { m.classList.add('is-settled'); });
    });
    window.addEventListener('afterprint', function () {
      abiertos.forEach(function (d) { d.removeAttribute('open'); });
      abiertos = [];
      setTimeout(function () { window.__dcpImprimiendo = false; }, 0);
    });
  })();

  /* ---------- Generic accordion (Método, FAQ, Garantías) ---------- */
  document.querySelectorAll('[data-accordion]').forEach(function (list) {
    var singleOpen = list.dataset.accordion !== 'multi';
    list.querySelectorAll(':scope > .accordion-item').forEach(function (item) {
      var trigger = item.querySelector('.accordion-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        if (singleOpen) {
          /* Contra la PÁGINA, no contra la lista. En las preguntas frecuentes
             hay cinco categorías y cerrar solo dentro de la suya dejaba cinco
             respuestas abiertas a la vez. */
          document.querySelectorAll('.accordion-item.open').forEach(function (r) {
            r.classList.remove('open');
            var t = r.querySelector('.accordion-trigger');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
        }
        if (!isOpen) {
          item.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  /* ---------- FAQ search filter ---------- */
  var faqSearchInput = document.getElementById('faq-search-input');
  if (faqSearchInput) {
    var faqSearchWrap = faqSearchInput.closest('.faq-search');
    var faqClear = document.getElementById('faq-search-clear');
    var faqCategories = Array.prototype.slice.call(document.querySelectorAll('.faq-category'));
    var faqEmpty = document.getElementById('faq-empty');

    var setItemOpen = function (item, open) {
      item.classList.toggle('open', open);
      var trigger = item.querySelector('.accordion-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    var runFaqFilter = function () {
      var q = faqSearchInput.value.trim().toLowerCase();
      if (faqSearchWrap) faqSearchWrap.classList.toggle('has-value', q.length > 0);
      var anyVisible = false;

      faqCategories.forEach(function (cat) {
        var items = cat.querySelectorAll('.accordion-item');
        var catHasMatch = false;
        /* El nombre del bloque cuenta como texto buscable. Sin esto, buscar
           «seguridad» en una página que TIENE un bloque llamado «Seguridad y
           Confidencialidad» devolvía cero resultados, porque las preguntas de
           dentro dicen «seguros» y no «seguridad». Comprobado antes y después. */
        var cabecera = cat.querySelector('.faq-category-head');
        var nomCat = cabecera ? cabecera.textContent.toLowerCase() : '';
        var catCoincide = q !== '' && nomCat.indexOf(q) !== -1;
        items.forEach(function (item, i) {
          var match = q === '' || catCoincide || item.textContent.toLowerCase().indexOf(q) !== -1;
          item.style.display = match ? '' : 'none';
          if (match) {
            catHasMatch = true;
            anyVisible = true;
            setItemOpen(item, q !== '');
          }
        });
        if (q === '') {
          items.forEach(function (item) { setItemOpen(item, false); });
        }
        cat.style.display = catHasMatch ? '' : 'none';
      });

      if (faqEmpty) faqEmpty.classList.toggle('show', !anyVisible);
    };

    faqSearchInput.addEventListener('input', runFaqFilter);
    if (faqClear) {
      faqClear.addEventListener('click', function () {
        faqSearchInput.value = '';
        runFaqFilter();
        faqSearchInput.focus();
      });
    }
  }

  /* ---------- FAQ deep link (/faq#slug opens + scrolls to that question) ---------- */
  if (window.location.hash && document.querySelector('.faq-list')) {
    var faqTarget = document.getElementById(window.location.hash.slice(1));
    if (faqTarget && faqTarget.classList.contains('accordion-item')) {
      faqTarget.classList.add('open');
      var faqTrigger = faqTarget.querySelector('.accordion-trigger');
      if (faqTrigger) faqTrigger.setAttribute('aria-expanded', 'true');
      setTimeout(function () {
        faqTarget.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      }, 300);
    }
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('.counter');
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseInt(el.dataset.count, 10) || 0;
      if (prefersReducedMotion) { el.textContent = target; return; }
      var duration = 1400;
      var start = performance.now();
      var tick = function (now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      var counterIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { counterIO.observe(c); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- Signature moments de Departamentos ----------
     Interacción compartida por varias de las visualizaciones propias de
     cada Departamento (radar de Comercial, embudo de Marketing, órbita de
     Clientes): un elemento con [data-signature-crosshighlight] agrupa
     varios [data-stage] — al pasar el ratón o el foco por cualquiera de
     ellos, todos los que comparten el mismo valor de data-stage se
     marcan a la vez, mostrando la correspondencia entre el visual y la
     fase concreta. Un único patrón, reutilizado, no una interacción
     distinta por página. */
  document.querySelectorAll('[data-signature-crosshighlight]').forEach(function (scope) {
    var triggers = scope.querySelectorAll('[data-stage]');
    triggers.forEach(function (el) {
      var stage = el.getAttribute('data-stage');
      var group = scope.querySelectorAll('[data-stage="' + stage + '"]');
      var activate = function () { group.forEach(function (g) { g.classList.add('is-active'); }); };
      var deactivate = function () { group.forEach(function (g) { g.classList.remove('is-active'); }); };
      el.addEventListener('mouseenter', activate);
      el.addEventListener('mouseleave', deactivate);
      el.addEventListener('focus', activate);
      el.addEventListener('blur', deactivate);
    });
  });

  /* ---------- Clientes: órbita de la ficha de cliente ---------- */
  var orbitScope = document.querySelector('.orbit-scope');
  if (orbitScope) {
    var orbitCaption = document.getElementById('orbit-caption');
    var orbitDefaultCaption = orbitCaption ? orbitCaption.textContent : '';
    orbitScope.querySelectorAll('.orbit-node').forEach(function (node) {
      var show = function () {
        orbitScope.querySelectorAll('.orbit-node').forEach(function (n) { n.classList.toggle('is-active', n === node); });
        if (orbitCaption) orbitCaption.textContent = node.dataset.detail || node.dataset.label || orbitDefaultCaption;
      };
      var hide = function () {
        node.classList.remove('is-active');
        if (orbitCaption) orbitCaption.textContent = orbitDefaultCaption;
      };
      node.addEventListener('mouseenter', show);
      node.addEventListener('mouseleave', hide);
      node.addEventListener('focus', show);
      node.addEventListener('blur', hide);
    });
  }

  /* ---------- Soporte: ticket en vivo (ciclo de estados) ----------
     Recorrido automático, pausado en cuanto el ticket sale de pantalla y
     reanudado al volver a entrar — así, cada vez que el usuario pasa por
     esta sección, la vuelve a ver desde "Recibido". Nunca depende de la
     posición de scroll: el usuario puede cruzar la sección a cualquier
     velocidad, en cualquier dirección, sin que el ciclo se lo impida. */
  var ticketStatusEl = document.getElementById('ticket-status');
  if (ticketStatusEl) {
    var ticketSteps = Array.prototype.slice.call(document.querySelectorAll('.ticket-step'));
    var ticketStates = ticketSteps.map(function (s) { return s.dataset.status; });
    var ticketClasses = ['', 'st-clasificado', 'st-prioridad', 'st-respondido', 'st-resuelto'];
    var ticketIndex = 0;
    var ticketTimer = null;
    var renderTicketState = function (i) {
      ticketSteps.forEach(function (s, idx) { s.classList.toggle('active', idx <= i); });
      ticketStatusEl.textContent = ticketStates[i];
      ticketStatusEl.className = 'ticket-status ' + (ticketClasses[i] || '');
    };
    var resetTicketCycle = function () {
      ticketIndex = 0;
      renderTicketState(0);
    };
    resetTicketCycle();
    var advanceTicket = function () {
      ticketIndex = (ticketIndex + 1) % ticketStates.length;
      renderTicketState(ticketIndex);
    };
    var startTicketCycle = function () {
      if (ticketTimer || prefersReducedMotion) return;
      ticketTimer = setInterval(advanceTicket, 1900);
    };
    var stopTicketCycle = function () {
      clearInterval(ticketTimer);
      ticketTimer = null;
    };
    if ('IntersectionObserver' in window) {
      var ticketIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { resetTicketCycle(); startTicketCycle(); }
          else stopTicketCycle();
        });
      }, { threshold: 0.4 });
      ticketIO.observe(ticketStatusEl.closest('.ticket-card') || ticketStatusEl);
    } else if (!prefersReducedMotion) {
      startTicketCycle();
    }
  }

  /* ---------- Contacto — formulario progresivo (DIR-048) ----------
     Controla qué paso de #contact-form está visible. Deliberadamente
     NO toca el contrato de datos: los campos reales (mismo id/name/
     required de siempre) nunca se destruyen ni se recrean, solo se
     muestran/ocultan — así que el bloque de envío real, justo debajo
     en este mismo archivo, sigue leyendo exactamente los mismos
     elementos sin ningún cambio en su lógica. Se registra ANTES que
     ese bloque a propósito: su listener de submit necesita poder
     interceptar (con stopImmediatePropagation) un envío prematuro —
     Enter en el paso 1, por ejemplo — antes de que el listener de
     envío real llegue a ejecutarse; los listeners sobre el mismo
     elemento se disparan en el orden en que se registran. */
  var stepForm = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');
  if (stepForm && formSuccess) {
    var stepEls = Array.prototype.slice.call(stepForm.querySelectorAll(':scope > .form-step'));
    var totalSteps = stepEls.length;
    var progressDots = Array.prototype.slice.call(stepForm.querySelectorAll('.form-progress-dot'));
    var progressBar = stepForm.querySelector('.form-progress');
    var stepCounter = document.getElementById('form-step-current');
    var backBtn = document.getElementById('form-back-btn');
    var nextBtn = document.getElementById('form-next-btn');
    var submitBtn = document.getElementById('form-submit-btn');
    var formSuccessBookBtn = document.getElementById('form-success-book-btn');
    var currentStep = 1;

    /* EL ERROR SE DICE EN LA PÁGINA Y EN SU IDIOMA.
       `reportValidity()` enseña el globo del navegador: en inglés aunque la
       página esté en español («Please include an '@'…»), encima del campo
       siguiente, y desaparece al desplazarse. Aquí el mensaje se escribe
       debajo del campo, en el idioma de la página, el campo queda marcado
       como inválido para quien usa lector de pantalla, y se borra en cuanto
       se corrige. La validación del navegador sigue siendo la fuente: solo
       cambia cómo se cuenta. */
    var EN_FORM = (document.documentElement.lang || 'es').slice(0, 2) === 'en';
    var MENSAJES = {
      vacio:   EN_FORM ? 'Please fill in this field.' : 'Rellena este campo.',
      email:   EN_FORM ? 'Enter an email address, like name@company.com.' : 'Escribe un email, como nombre@empresa.com.',
      tel:     EN_FORM ? 'Enter a valid phone number.' : 'Escribe un teléfono válido.',
      casilla: EN_FORM ? 'You have to accept the privacy policy to continue.' : 'Tienes que aceptar la política de privacidad para continuar.',
      otro:    EN_FORM ? 'Check this field.' : 'Revisa este campo.'
    };
    var textoError = function (campo) {
      var v = campo.validity;
      if (campo.type === 'checkbox') return MENSAJES.casilla;
      if (v.valueMissing) return MENSAJES.vacio;
      if (v.typeMismatch && campo.type === 'email') return MENSAJES.email;
      if (v.typeMismatch && campo.type === 'tel') return MENSAJES.tel;
      return MENSAJES.otro;
    };
    var limpiaError = function (campo) {
      campo.removeAttribute('aria-invalid');
      var id = campo.id + '-error', el = document.getElementById(id);
      if (el) el.remove();
      var d = (campo.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) { return x && x !== id; });
      if (d.length) campo.setAttribute('aria-describedby', d.join(' ')); else campo.removeAttribute('aria-describedby');
    };
    var pintaError = function (campo) {
      limpiaError(campo);
      var id = campo.id + '-error';
      var p = document.createElement('p');
      p.className = 'field-error'; p.id = id; p.setAttribute('role', 'alert');
      p.textContent = textoError(campo);
      (campo.closest('.field') || campo.parentNode).appendChild(p);
      campo.setAttribute('aria-invalid', 'true');
      var d = (campo.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      d.push(id); campo.setAttribute('aria-describedby', d.join(' '));
      if (!campo.dataset.errorEscuchado) {
        campo.dataset.errorEscuchado = '1';
        var revisa = function () { if (campo.checkValidity()) limpiaError(campo); };
        campo.addEventListener('input', revisa);
        campo.addEventListener('change', revisa);
        campo.addEventListener('blur', function () { if (!campo.checkValidity()) pintaError(campo); });
      }
    };
    var validateStep = function (n) {
      var stepEl = stepEls[n - 1];
      if (!stepEl) return true;
      var fields = stepEl.querySelectorAll('input[required], textarea[required], select[required]');
      var primero = null;
      for (var i = 0; i < fields.length; i++) {
        if (fields[i].checkValidity()) limpiaError(fields[i]);
        else { pintaError(fields[i]); if (!primero) primero = fields[i]; }
      }
      if (primero) { primero.focus(); return false; }
      return true;
    };

    var showStep = function (n, focusFirst) {
      currentStep = n;
      stepEls.forEach(function (el, i) { el.classList.toggle('is-active', i === n - 1); });
      progressDots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === n - 1);
        dot.classList.toggle('is-done', i < n - 1);
      });
      if (stepCounter) stepCounter.textContent = n;
      /* El tramo recorrido del carril: de la primera parada a la actual. Las
         paradas son puntos, no barras, así que el avance es la distancia
         entre centros, no una fracción del total. */
      if (progressBar && totalSteps > 1) {
        progressBar.style.setProperty('--avance', ((n - 1) / (totalSteps - 1) * 100) + '%');
      }
      if (progressBar) progressBar.setAttribute('aria-valuenow', n);
      if (backBtn) backBtn.style.display = n > 1 ? 'inline-flex' : 'none';
      if (nextBtn) nextBtn.style.display = n < totalSteps ? 'inline-flex' : 'none';
      if (submitBtn) submitBtn.style.display = n === totalSteps ? 'inline-flex' : 'none';
      if (focusFirst) {
        var firstField = stepEls[n - 1] && stepEls[n - 1].querySelector('input, textarea');
        if (firstField) firstField.focus();
      }
    };

    var goNext = function () {
      if (!validateStep(currentStep)) return;
      if (currentStep < totalSteps) showStep(currentStep + 1, true);
    };
    var goBack = function () {
      if (currentStep > 1) showStep(currentStep - 1, true);
    };

    if (backBtn) backBtn.addEventListener('click', goBack);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    // Enter en un <input> de un paso intermedio avanza, en vez de no
    // hacer nada o disparar un envío a medio rellenar. Dentro de un
    // <textarea> (paso 3) se deja pasar sin interceptar — ahí Enter es
    // un salto de línea normal, no una acción de navegación.
    stepForm.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if ((e.target.tagName || '').toLowerCase() === 'textarea') return;
      if (currentStep < totalSteps) { e.preventDefault(); goNext(); }
    });

    // Red de seguridad: si algo dispara un submit sin pasar por el
    // paso final (Enter, autocompletado agresivo del navegador...),
    // se convierte en un simple "Continuar" y NUNCA llega al listener
    // de envío real de más abajo.
    stepForm.addEventListener('submit', function (e) {
      if (currentStep !== totalSteps) {
        e.preventDefault();
        e.stopImmediatePropagation();
        goNext();
        return;
      }
      if (!validateStep(totalSteps)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });

    // Expuesta para que el bloque de envío real llame a esto en su
    // propia rama de éxito, sin que ese bloque necesite saber nada del
    // wizard de pasos — solo "hubo éxito, muéstralo bien".
    var showFormSuccess = function () {
      stepForm.setAttribute('hidden', '');
      formSuccess.removeAttribute('hidden');
      formSuccess.setAttribute('tabindex', '-1');
      formSuccess.focus();
    };

    if (formSuccessBookBtn) {
      formSuccessBookBtn.addEventListener('click', function () {
        var bookingBtn = document.getElementById('booking-cta-btn');
        if (bookingBtn) bookingBtn.click();
      });
    }

    showStep(1, false);
  }

  /* ---------- Contact form (Turnstile + envío principal + respaldo) ----------
     Envío principal: directo al webhook de producción del workflow "Lead
     IA 360" en n8n, que valida el lead, lo guarda en Airtable, lo analiza
     con Gemini y envía los emails de confirmación y alerta interna.
     Envío de respaldo: si el principal falla por cualquier motivo (fetch
     rechazada, estado HTTP no exitoso), se reintenta automáticamente
     contra /api/contact-fallback (función serverless propia del sitio,
     solo envía los dos emails) para que una solicitud legítima nunca se
     pierda por un fallo puntual del servicio principal. */
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');

  // Referenciadas por nombre desde data-expired-callback / data-error-callback
  // en el div .cf-turnstile de contacto.html — deben vivir en window porque
  // el script de Turnstile las busca por nombre global, no como closures
  // locales de este IIFE. Sin esto, un token caducado (~5 min) o un fallo de
  // carga del propio widget producían el mismo "Completa la verificación
  // anti-spam" sin explicar el motivo real.
  window.dcodeTurnstileExpired = function () {
    if (!note) return;
    note.textContent = 'La verificación anti-spam ha caducado. Vuelve a marcarla antes de enviar.';
    note.className = 'form-note err';
  };
  window.dcodeTurnstileError = function () {
    if (!note) return;
    note.textContent = 'No se pudo cargar la verificación anti-spam. Recarga la página e inténtalo de nuevo.';
    note.className = 'form-note err';
  };

  if (form && note) {
    // URL de producción del nodo Webhook "lead-ia-360-v2". Es solo el path
    // configurado en el nodo (sin el webhookId): n8n solo antepone el
    // webhookId a la ruta cuando el parámetro "path" está vacío o es
    // dinámico; aquí es un string fijo, así que la ruta pública es
    // exactamente /webhook/<path>. Verificado en vivo contra n8n: GET a esta
    // URL devuelve "not registered for GET requests" (la ruta existe, solo
    // acepta POST); GET a la misma URL con el webhookId insertado devuelve
    // "webhook is not registered" (la ruta no existe). Una URL anterior con
    // el webhookId de más nunca llegó a ejecutar el workflow.
    var N8N_WEBHOOK_URL = 'https://diegoydimitry2.app.n8n.cloud/webhook/lead-ia-360-v2';
    var FALLBACK_ENDPOINT = '/api/contact-fallback';

    // Intenta un envío y devuelve { ok, status, texto } sin lanzar nunca
    // (un fallo de red se traduce en ok:false en vez de una excepción), así
    // el llamador no necesita un try/catch propio por cada intento.
    //
    // Se envía como application/x-www-form-urlencoded (no JSON): es un
    // "simple request" según la spec CORS, así que el navegador NO manda
    // preflight OPTIONS. El preflight real contra el webhook de n8n devuelve
    // 500 (bug de la infraestructura de n8n Cloud con responseMode
    // "responseNode", confirmado repitiendo la petición desde el propio
    // servidor de n8n) — evitarlo así es más fiable que depender de que n8n
    // lo arregle. n8n y el endpoint de respaldo parsean form-urlencoded en
    // un objeto igual que JSON, así que no hace falta cambiar nada más.
    var intentarEnvio = function (url, datos) {
      var params = new URLSearchParams();
      Object.keys(datos).forEach(function (key) { params.append(key, datos[key]); });
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      }).then(function (respuesta) {
        return respuesta.text().catch(function () { return ''; }).then(function (texto) {
          return { ok: respuesta.ok, status: respuesta.status, texto: texto };
        });
      }).catch(function (err) {
        return { ok: false, status: 0, texto: String(err && err.message || err) };
      });
    };

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      /* EL BOTON DE ENVIAR, NO EL PRIMERO QUE HAYA.
         form.querySelector('button') devolvia #form-back-btn —"Atras"—,
         porque en un formulario de cuatro pasos ese es el primer boton del
         DOM. Consecuencia medida: al enviar se bloqueaba y se renombraba el
         boton de VOLVER, mientras el de enviar seguia activo, asi que se podia
         pulsar otra vez y mandar el mismo lead dos veces. */
      var button = document.getElementById('form-submit-btn') ||
                   form.querySelector('button[type="submit"]') ||
                   form.querySelector('button');
      var textoBoton = button.textContent;

      if (typeof turnstile === 'undefined') {
        note.textContent = 'No se pudo cargar la verificación anti-spam. Recarga la página e inténtalo de nuevo.';
        note.className = 'form-note err';
        return;
      }
      if (!turnstile.getResponse()) {
        note.textContent = 'Completa la verificación anti-spam.';
        note.className = 'form-note err';
        return;
      }

      button.disabled = true;
      button.textContent = 'Enviando...';

      // Todo el cuerpo va en try/finally: si document.getElementById(...)
      // devolviera null por cualquier motivo inesperado, o cualquier otra
      // excepción no prevista ocurriera aquí dentro, el botón nunca debe
      // quedarse bloqueado en "Enviando..." sin explicación.
      try {
        var datos = {
          nombre: document.getElementById('nombre').value,
          empresa: document.getElementById('empresa').value,
          email: document.getElementById('email').value,
          telefono: document.getElementById('telefono').value,
          mensaje: document.getElementById('mensaje').value,
          turnstileToken: turnstile.getResponse()
        };

        var principal = await intentarEnvio(N8N_WEBHOOK_URL, datos);

        var resultado = principal;
        if (!principal.ok) {
          console.error('[contact-form] Fallo el envío principal, reintentando por respaldo:', principal.status, principal.texto);
          var respaldo = await intentarEnvio(FALLBACK_ENDPOINT, datos);
          if (respaldo.ok) resultado = respaldo;
          else {
            console.error('[contact-form] Fallo también el envío de respaldo:', respaldo.status, respaldo.texto);
            // Se conservan ambos motivos técnicos en el mensaje visible —
            // mismo criterio que el asistente de IA: un fallo real debe
            // poder diagnosticarse viendo la propia página.
            resultado = {
              ok: false,
              status: principal.status,
              texto: 'principal ' + principal.status + ': ' + principal.texto.slice(0, 150) +
                ' / respaldo ' + respaldo.status + ': ' + respaldo.texto.slice(0, 150)
            };
          }
        }

        if (resultado.ok) {
          note.textContent = 'Solicitud enviada correctamente. Nos pondremos en contacto contigo muy pronto.';
          note.className = 'form-note ok';
          form.reset();
          turnstile.reset();
          setTimeout(function () {
            note.textContent = '';
            note.className = 'form-note';
          }, 4000);
          // Panel de confirmación del wizard de pasos (DIR-048) — definido
          // más arriba en este archivo; se comprueba por si esta página no
          // tuviera el wizard por algún motivo, para no romper el envío.
          if (typeof showFormSuccess === 'function') showFormSuccess();
        } else {
          note.textContent = 'Ha ocurrido un error al enviar la solicitud. Inténtalo de nuevo en unos minutos. (' + resultado.texto + ')';
          note.className = 'form-note err';
          // Un token de Turnstile es de un solo uso: si el intento principal
          // llegó a consumirlo (p. ej. rechazado ya verificado o caducado),
          // reintentar con el mismo token fallaría igual — se pide uno nuevo.
          turnstile.reset();
        }
      } catch (err) {
        note.textContent = 'No se pudo procesar el formulario. Recarga la página e inténtalo de nuevo.';
        note.className = 'form-note err';
        console.error('[contact-form] Excepción inesperada al enviar el formulario:', err);
      } finally {
        button.disabled = false;
        /* Y se devuelve SU texto, el que tenia. Antes escribia aqui
           "Solicitar mi Mes Gratuito": una oferta retirada de toda la web
           hace varias fases, que reaparecia en el boton en cuanto alguien
           intentaba enviar el formulario. */
        button.textContent = textoBoton;
      }
    });
  }

  /* ---------- Movilidad por Departamento: entrada repetible, nunca bloqueante (DIR-019) ----------
     La versión anterior (DIR-017/018) medía cuánto se había recorrido un
     raíl de scroll — incluso sin position:sticky, esa lógica ataba la
     animación a LA POSICIÓN del scroll, y eso es exactamente lo que
     Dirección pidió eliminar: ninguna animación puede depender de cuánto
     ha avanzado el documento, porque entonces una ráfaga de rueda rápida
     "adelanta" a la animación y se percibe como si la página se hubiera
     parado a esperarla.
     Aquí no se mide nada del scroll: cada [data-motion-journey] solo
     sabe si está a la vista o no (IntersectionObserver, sin rootMargin
     ni cálculo de progreso) y activa o desactiva la clase is-playing.
     Toda la coreografía (qué aparece, cuándo, en qué orden) vive en CSS
     puro como @keyframes con animation-delay — corre en su propio reloj
     interno, nunca en el del scroll: el usuario puede cruzar la sección
     en 100ms o en 10s, la animación no cambia el ritmo al que avanza la
     página en ningún caso. Al salir de pantalla se quita is-playing, así
     que al volver a entrar la coreografía se repite desde el principio.
     Con prefers-reduced-motion, is-settled se aplica una sola vez y ya
     no se vuelve a tocar el DOM: todo el contenido queda visible en su
     posición final, sin ninguna animación. */
  var motionJourneys = Array.prototype.slice.call(document.querySelectorAll('[data-motion-journey]'));
  if (motionJourneys.length) {
    if (prefersReducedMotion) {
      motionJourneys.forEach(function (el) { el.classList.add('is-settled'); });
    } else if ('IntersectionObserver' in window) {
      var motionIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('is-playing', entry.isIntersecting);
        });
      }, { threshold: 0.3 });
      motionJourneys.forEach(function (el) { motionIO.observe(el); });
    } else {
      motionJourneys.forEach(function (el) { el.classList.add('is-settled'); });
    }
  }

  /* ---------- Asistente de IA de D-Code Partners ----------
     Llama a /api/chat (recuperación sobre el contenido real del sitio, con
     upgrade automático a generación LLM si el backend tiene un proveedor
     configurado). Sin respuestas escritas a mano en el cliente: los botones
     rápidos y el texto libre pasan por el mismo pipeline. */
  var chatWidget = document.getElementById('chat-widget');
  if (chatWidget) {
    var chatBubble = document.getElementById('chat-bubble');
    var chatWindowEl = chatWidget.querySelector('.chat-window');
    var chatMessages = document.getElementById('chat-messages');
    var chatQuick = document.getElementById('chat-quick-replies');
    var chatForm = document.getElementById('chat-form');
    var chatInput = document.getElementById('chat-input');
    var chatSubmitBtn = chatForm ? chatForm.querySelector('button[type="submit"]') : null;

    var CHAT_ENDPOINT = '/api/chat';
    var HISTORY_KEY = 'dcodeChatHistory';
    var MAX_STORED_TURNS = 20;
    var MAX_MESSAGE_LENGTH = 600;
    var isSending = false;

    var setChatOpen = function (isOpen) {
      chatWidget.classList.toggle('open', isOpen);
      chatBubble.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      chatWindowEl.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      // La ventana pasa de visibility:hidden a visible en el siguiente
      // fotograma: un focus() síncrono se perdía y el foco se quedaba en la
      // burbuja.
      if (isOpen && chatInput) {
        var focusInput = function () { if (chatWidget.classList.contains('open')) chatInput.focus(); };
        setTimeout(focusInput, 60);
        setTimeout(function () { if (document.activeElement !== chatInput) focusInput(); }, 260);
      }
    };
    chatBubble.addEventListener('click', function () {
      setChatOpen(!chatWidget.classList.contains('open'));
    });
    // Esc cierra el asistente y devuelve el foco a la burbuja.
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !chatWidget.classList.contains('open')) return;
      setChatOpen(false);
      chatBubble.focus();
    });

    /* ---- Markdown ligero y seguro: escapa todo el HTML primero, y solo
       luego reconoce **negrita**, [enlaces](/ruta) y listas "- item". Así
       una respuesta jamás puede inyectar HTML/JS, venga de donde venga. */
    var escapeHtml = function (str) {
      return String(str).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };

    var renderInline = function (text) {
      text = text.replace(/\[([^\]]+)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)/g, function (m, label, href) {
        var isExternal = /^https?:\/\//.test(href);
        var attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        return '<a href="' + href + '"' + attrs + '>' + label + '</a>';
      });
      text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      return text;
    };

    var renderMarkdown = function (raw) {
      var lines = escapeHtml(raw).split('\n');
      var html = '';
      var listBuffer = [];

      var flushList = function () {
        if (!listBuffer.length) return;
        html += '<ul>' + listBuffer.map(function (item) {
          return '<li>' + renderInline(item) + '</li>';
        }).join('') + '</ul>';
        listBuffer = [];
      };

      lines.forEach(function (line) {
        var trimmed = line.trim();
        if (!trimmed) { flushList(); return; }
        var bulletMatch = trimmed.match(/^-\s+(.*)$/);
        if (bulletMatch) { listBuffer.push(bulletMatch[1]); return; }
        flushList();
        var noteMatch = trimmed.match(/^\*(.+)\*$/);
        if (noteMatch) {
          html += '<p class="chat-msg-note">' + renderInline(noteMatch[1]) + '</p>';
          return;
        }
        html += '<p>' + renderInline(trimmed) + '</p>';
      });
      flushList();
      return html;
    };

    /* ---- Memoria de conversación durante la sesión (sobrevive a la
       navegación entre páginas, no a cerrar la pestaña). */
    var loadHistory = function () {
      try {
        var raw = sessionStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    };
    var saveHistory = function (history) {
      try {
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_STORED_TURNS)));
      } catch (e) {
        /* Almacenamiento no disponible (modo privado, cuota llena...): la
           conversación sigue funcionando, simplemente no persiste. */
      }
    };

    var scrollToBottom = function () {
      chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    };

    var addMessage = function (text, who, silent) {
      var div = document.createElement('div');
      div.className = 'chat-msg ' + who;
      div.innerHTML = who === 'bot' ? renderMarkdown(text) : escapeHtml(text);
      chatMessages.appendChild(div);
      if (!silent) scrollToBottom();
      return div;
    };

    var showTyping = function () {
      var t = document.createElement('div');
      t.className = 'chat-typing';
      t.id = 'chat-typing-indicator';
      t.innerHTML = '<span></span><span></span><span></span>';
      chatMessages.appendChild(t);
      scrollToBottom();
    };
    var hideTyping = function () {
      var t = document.getElementById('chat-typing-indicator');
      if (t) t.remove();
    };

    var setSending = function (sending) {
      isSending = sending;
      if (chatInput) chatInput.disabled = sending;
      if (chatSubmitBtn) chatSubmitBtn.disabled = sending;
    };

    var history = loadHistory();
    if (history.length) {
      // El mensaje de bienvenida ya está en el HTML: se conserva y el
      // historial guardado se añade a continuación, no lo sustituye.
      history.forEach(function (turn) {
        addMessage(turn.content, turn.role === 'user' ? 'user' : 'bot', true);
      });
      if (chatQuick) chatQuick.style.display = 'none';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    var sendMessage = function (rawText) {
      var text = (rawText || '').trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!text || isSending) return;

      addMessage(text, 'user');
      if (chatQuick) chatQuick.style.display = 'none';
      history.push({ role: 'user', content: text });
      saveHistory(history);

      setSending(true);
      showTyping();

      /* El backend responde en texto plano, emitido en fragmentos según el
         modelo va generando (ver api/chat.js): cualquier cuerpo de
         respuesta -generación real, aviso de límite, error de
         configuración- es directamente el texto a mostrar, así que no hace
         falta distinguir formatos aquí. finish() cierra el turno una sola
         vez, venga por donde venga. */
      var finish = function (fullReply) {
        setSending(false);
        if (chatInput) chatInput.focus();
        if (fullReply) {
          history.push({ role: 'assistant', content: fullReply });
          saveHistory(history);
        }
      };

      fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(0, -1) })
      })
        .then(function (response) {
          // Navegadores sin streaming de fetch (muy minoritarios hoy):
          // se degrada a mostrar la respuesta completa de una vez en
          // cuanto llega, en vez de fallar.
          if (!response.body || !response.body.getReader) {
            return response.text().then(function (full) {
              hideTyping();
              addMessage(
                full || 'Ha ocurrido un problema al procesar tu mensaje. Inténtalo de nuevo en unos segundos o contáctanos directamente.',
                'bot'
              );
              finish(full);
            });
          }

          var reader = response.body.getReader();
          var decoder = new TextDecoder();
          var full = '';
          var botDiv = null;

          var pump = function () {
            return reader.read().then(function (step) {
              if (step.done) return;
              var chunk = decoder.decode(step.value, { stream: true });
              if (chunk) {
                if (!botDiv) {
                  hideTyping();
                  botDiv = addMessage('', 'bot', true);
                  botDiv.classList.add('streaming');
                }
                full += chunk;
                botDiv.innerHTML = renderMarkdown(full);
                scrollToBottom();
              }
              return pump();
            });
          };

          return pump().then(function () {
            if (botDiv) botDiv.classList.remove('streaming');
            if (!full) {
              hideTyping();
              addMessage('Ha ocurrido un problema al procesar tu mensaje. Inténtalo de nuevo en unos segundos o contáctanos directamente.', 'bot');
            }
            finish(full);
          });
        })
        .catch(function () {
          hideTyping();
          var reply = 'No se ha podido conectar con el asistente. Comprueba tu conexión e inténtalo de nuevo.';
          addMessage(reply, 'bot');
          finish(reply);
        });
    };

    if (chatQuick) {
      chatQuick.querySelectorAll('.chat-quick-question').forEach(function (btn) {
        btn.addEventListener('click', function () { sendMessage(btn.textContent); });
      });
    }

    if (chatForm) {
      chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = chatInput.value;
        chatInput.value = '';
        sendMessage(val);
      });
    }
  }
})();
