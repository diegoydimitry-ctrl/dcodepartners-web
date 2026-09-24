/* ============================================================================
   D-CODE PARTNERS — main-b · LO QUE NO HACE FALTA AL ENTRAR
   ----------------------------------------------------------------------------
   Salió de main.js sin tocar una línea de su lógica. El motivo está medido:
   main.js pesaba 81 KB y compilarlo costaba 200–270 ms de hilo bloqueado en
   un teléfono, justo mientras la página se monta. Lo de aquí —el formulario
   de contacto por pasos, su envío, la movilidad por departamento y el
   asistente— no lo necesita nadie en el primer segundo:

     · en /contacto el formulario SÍ se ve al entrar, así que la marca
       type="dcp/cerca" con data-cuando="#contact-form" lo trae enseguida;
     · en el resto, en el primer hueco libre después de cargar.

   Lo único añadido es esta envoltura y la línea de prefersReducedMotion, que
   antes venía de la de main.js.
   ========================================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
