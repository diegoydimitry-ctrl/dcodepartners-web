/* ==================================================================
   D-Code Partners — comportamiento compartido entre páginas.
   Cada bloque comprueba que sus elementos existen antes de actuar,
   así este mismo archivo es seguro de incluir en cualquier página.
   ================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

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
  }

  /* ---------- Mega menu (desktop hover + keyboard, mobile tap-toggle) ---------- */
  document.querySelectorAll('.has-mega').forEach(function (item) {
    var trigger = item.querySelector('.mega-trigger');
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth > 900) return; // desktop uses hover/focus via CSS
      e.preventDefault();
      var isOpen = item.classList.toggle('mega-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
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

  /* ---------- Interactive window tilt + spotlight ---------- */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
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
      });
    });
  }

  /* ---------- Generic accordion (Método, FAQ, Garantías) ---------- */
  document.querySelectorAll('[data-accordion]').forEach(function (list) {
    var singleOpen = list.dataset.accordion !== 'multi';
    list.querySelectorAll(':scope > .accordion-item').forEach(function (item) {
      var trigger = item.querySelector('.accordion-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        if (singleOpen) {
          list.querySelectorAll(':scope > .accordion-item').forEach(function (r) {
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

  /* ---------- Hero neural-network canvas ---------- */
  var canvas = document.getElementById('hero-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var width, height, dpr, nodes = [], running = true;

    var resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    var initNodes = function () {
      var count = window.innerWidth < 640 ? 14 : 22;
      nodes = Array.from({ length: count }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 1.6 + Math.random() * 1.6
        };
      });
    };

    var step = function () {
      ctx.clearRect(0, 0, width, height);
      var maxDist = Math.min(width, height) * 0.34;

      nodes.forEach(function (n) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });

      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            var alpha = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = 'rgba(91,140,255,' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(function (n) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(67,224,255,0.85)';
        ctx.fill();
      });

      if (running && !prefersReducedMotion) requestAnimationFrame(step);
    };

    var drawStatic = function () {
      ctx.clearRect(0, 0, width, height);
      nodes.forEach(function (n) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(67,224,255,0.85)';
        ctx.fill();
      });
    };

    resize();
    initNodes();
    if (prefersReducedMotion) {
      drawStatic();
    } else {
      requestAnimationFrame(step);
    }

    window.addEventListener('resize', function () {
      resize();
      initNodes();
    });

    if ('IntersectionObserver' in window) {
      var canvasIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          running = entry.isIntersecting;
          if (running && !prefersReducedMotion) requestAnimationFrame(step);
        });
      }, { threshold: 0.05 });
      canvasIO.observe(canvas);
    }
  }

  /* ---------- Contact form (Turnstile + /api/send) ---------- */
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  if (form && note) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var button = form.querySelector('button');

      if (typeof turnstile === 'undefined' || !turnstile.getResponse()) {
        note.textContent = 'Completa la verificación anti-spam.';
        note.className = 'form-note err';
        return;
      }

      button.disabled = true;
      button.textContent = 'Enviando...';

      var datos = {
        nombre: document.getElementById('nombre').value,
        empresa: document.getElementById('empresa').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        mensaje: document.getElementById('mensaje').value,
        turnstileToken: turnstile.getResponse()
      };

      try {
        var respuesta = await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
          note.textContent = '¡Solicitud enviada correctamente!';
          note.className = 'form-note ok';
          form.reset();
          turnstile.reset();
          setTimeout(function () {
            note.textContent = '';
            note.className = 'form-note';
          }, 4000);
        } else {
          note.textContent = 'Ha ocurrido un error al enviar la solicitud.';
          note.className = 'form-note err';
        }
      } catch (err) {
        note.textContent = 'No se pudo conectar con el servidor.';
        note.className = 'form-note err';
      }

      button.disabled = false;
      button.textContent = 'Solicitar mi Mes Gratuito';
    });
  }

  /* ---------- Chat widget (design preview — no live backend) ----------
     Guided, scripted demo only. Free-text input always resolves to an
     honest "this is a preview" message instead of pretending to be an
     AI that isn't actually connected to anything. */
  var chatWidget = document.getElementById('chat-widget');
  if (chatWidget) {
    var chatBubble = document.getElementById('chat-bubble');
    var chatWindowEl = chatWidget.querySelector('.chat-window');
    var chatMessages = document.getElementById('chat-messages');
    var chatQuick = document.getElementById('chat-quick-replies');
    var chatForm = document.getElementById('chat-form');
    var chatInput = document.getElementById('chat-input');

    chatBubble.addEventListener('click', function () {
      var isOpen = chatWidget.classList.toggle('open');
      chatBubble.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      chatWindowEl.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      if (isOpen && chatInput) chatInput.focus();
    });

    var addMessage = function (content, who, isHtml) {
      var div = document.createElement('div');
      div.className = 'chat-msg ' + who;
      if (isHtml) { div.innerHTML = content; } else { div.textContent = content; }
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return div;
    };

    var showTyping = function (cb, delay) {
      var t = document.createElement('div');
      t.className = 'chat-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      chatMessages.appendChild(t);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      setTimeout(function () {
        t.remove();
        cb();
      }, delay || 900);
    };

    var REPLIES = {
      automatizacion: {
        user: 'Automatización de tareas',
        bot: 'Solemos empezar por gestión documental, reporting o seguimiento comercial: procesos con reglas claras que hoy hace una persona a mano.',
        cta: { text: 'Ver Automatización IA', href: '/servicios/automatizacion-ia' }
      },
      atencion: {
        user: 'Atención al cliente 24/7',
        bot: 'Podemos montarte un agente que responda al instante en tu web o WhatsApp, y que avise a tu equipo cuando de verdad haga falta una persona.',
        cta: { text: 'Ver Agentes de IA', href: '/servicios/agentes-ia' }
      },
      humano: {
        user: 'Quiero hablar con una persona',
        bot: 'Por supuesto. Diego y Dimitry responden en menos de 24h — resérvate una llamada de 30 minutos, sin coste ni compromiso.',
        cta: { text: 'Reservar llamada gratuita', href: '/contacto' }
      }
    };

    var handleReply = function (key) {
      var r = REPLIES[key];
      if (!r) return;
      addMessage(r.user, 'user');
      if (chatQuick) chatQuick.style.display = 'none';
      showTyping(function () {
        var html = r.bot + (r.cta ? ' <a class="btn btn-sm btn-primary chat-cta" href="' + r.cta.href + '">' + r.cta.text + '</a>' : '');
        addMessage(html, 'bot', true);
      });
    };

    if (chatQuick) {
      chatQuick.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () { handleReply(btn.dataset.reply); });
      });
    }

    if (chatForm) {
      chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = chatInput.value.trim();
        if (!val) return;
        addMessage(val, 'user');
        chatInput.value = '';
        if (chatQuick) chatQuick.style.display = 'none';
        showTyping(function () {
          addMessage(
            'Esto es una vista previa del diseño — todavía no está conectado a un asistente real. Cuéntanoslo directamente y te respondemos en menos de 24h: <a class="btn btn-sm btn-primary chat-cta" href="/contacto">Reservar llamada gratuita</a>',
            'bot',
            true
          );
        }, 700);
      });
    }
  }
})();
