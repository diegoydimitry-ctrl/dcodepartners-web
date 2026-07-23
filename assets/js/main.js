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
        items.forEach(function (item, i) {
          var match = q === '' || item.textContent.toLowerCase().indexOf(q) !== -1;
          item.style.display = match ? '' : 'none';
          if (match) {
            catHasMatch = true;
            anyVisible = true;
            setItemOpen(item, q !== '');
          }
        });
        if (q === '') {
          items.forEach(function (item, i) { setItemOpen(item, i === 0); });
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

  /* ---------- Contact form (Turnstile + webhook n8n directo) ----------
     Envío directo al webhook de producción del workflow "Lead IA 360" en
     n8n — sin backend intermedio. n8n valida el lead, lo guarda en
     Airtable, lo analiza con Gemini y envía los emails de confirmación y
     alerta interna; aquí solo se interpreta la respuesta HTTP. */
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  if (form && note) {
    var N8N_WEBHOOK_URL = 'https://diegoydimitry.app.n8n.cloud/webhook/lead-ia-360';
    var FALLBACK_EMAIL = 'dcodedepartment@gmail.com';

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
        var respuesta = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });

        var cuerpo = null;
        try { cuerpo = await respuesta.json(); } catch (parseErr) { cuerpo = null; }

        if (respuesta.ok) {
          note.textContent = 'Solicitud enviada correctamente. Nos pondremos en contacto contigo muy pronto.';
          note.className = 'form-note ok';
          form.reset();
          turnstile.reset();
          setTimeout(function () {
            note.textContent = '';
            note.className = 'form-note';
          }, 4000);
        } else if (respuesta.status === 400) {
          var detalle = cuerpo && Array.isArray(cuerpo.errors) && cuerpo.errors.length
            ? cuerpo.errors[0]
            : 'Revisa los datos del formulario e inténtalo de nuevo.';
          note.textContent = detalle;
          note.className = 'form-note err';
        } else if (respuesta.status === 404) {
          note.textContent = 'El servicio no está disponible en este momento. Escríbenos a ' + FALLBACK_EMAIL + '.';
          note.className = 'form-note err';
          console.error('[contact-form] Webhook de n8n no encontrado (404). ¿Workflow activo?', N8N_WEBHOOK_URL);
        } else {
          note.textContent = 'Ha ocurrido un error al enviar la solicitud. Inténtalo de nuevo en unos minutos.';
          note.className = 'form-note err';
          console.error('[contact-form] Error del webhook de n8n:', respuesta.status, cuerpo);
        }
      } catch (err) {
        note.textContent = 'No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';
        note.className = 'form-note err';
        console.error('[contact-form] Fallo de red al llamar al webhook de n8n:', err);
      }

      button.disabled = false;
      button.textContent = 'Solicitar mi Mes Gratuito';
    });
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

    chatBubble.addEventListener('click', function () {
      var isOpen = chatWidget.classList.toggle('open');
      chatBubble.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      chatWindowEl.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      if (isOpen && chatInput) chatInput.focus();
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

      fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(0, -1) })
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          hideTyping();
          var reply = (result.ok && result.data && result.data.success && result.data.reply)
            ? result.data.reply
            : 'Ha ocurrido un problema al procesar tu mensaje. Inténtalo de nuevo en unos segundos o contáctanos directamente.';
          addMessage(reply, 'bot');
          history.push({ role: 'assistant', content: reply });
          saveHistory(history);
        })
        .catch(function () {
          hideTyping();
          var reply = 'No se ha podido conectar con el asistente. Comprueba tu conexión e inténtalo de nuevo.';
          addMessage(reply, 'bot');
          history.push({ role: 'assistant', content: reply });
          saveHistory(history);
        })
        .then(function () {
          setSending(false);
          if (chatInput) chatInput.focus();
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
