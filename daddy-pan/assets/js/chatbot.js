/**
 * Daddy Pan — chatbot de demostración.
 *
 * Flujo de reserva 100% simulado en el navegador (nombre → teléfono → fecha
 * → hora → personas → confirmar). No hay backend real: `submitBooking()` es
 * el único punto de contacto con el "exterior" y hoy solo hace una espera
 * artificial + genera una referencia falsa. Conectarlo a Google Sheets (u
 * otro backend) más adelante consiste en sustituir esa función por un
 * fetch() a DADDY_PAN_CONFIG.GOOGLE_SHEETS_ENDPOINT — el resto del chatbot
 * no necesita cambios.
 */
(function () {
  'use strict';

  var cfg = window.DADDY_PAN_CONFIG || {};

  var MAIN_QUICK_REPLIES = [
    { label: 'Reservar mesa', action: 'main-book' },
    { label: 'Ver la carta', action: 'main-menu' },
    { label: 'Horario y ubicación', action: 'main-hours' }
  ];

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function genBookingCode() {
    return 'DP-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  // Simulación de envío — ver cabecera del archivo para cómo conectarlo de verdad.
  function submitBooking(data) {
    return new Promise(function (resolve) {
      // TODO(integración real): sustituir por, p. ej.:
      // fetch(cfg.GOOGLE_SHEETS_ENDPOINT, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // }).then(function (r) { return r.json(); }).then(resolve);
      console.log('[Daddy Pan demo] Reserva simulada:', data);
      setTimeout(function () {
        resolve({ ok: true, code: genBookingCode() });
      }, 900);
    });
  }

  function DaddyPanChat() {
    this.panel = document.getElementById('chatPanel');
    this.launcher = document.getElementById('chatLauncher');
    this.badge = this.launcher.querySelector('.chat-launcher-badge');
    this.body = document.getElementById('chatBody');
    this.input = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('chatSendBtn');
    this.closeBtn = document.getElementById('chatCloseBtn');

    this.started = false;
    this.state = 'idle';
    this.data = {};
    this.typingEl = null;

    this.bindEvents();
  }

  DaddyPanChat.prototype.bindEvents = function () {
    var self = this;
    this.launcher.addEventListener('click', function () { self.toggle(); });
    this.closeBtn.addEventListener('click', function () { self.close(); });
    this.sendBtn.addEventListener('click', function () { self.onSend(); });
    this.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); self.onSend(); }
    });
    this.input.addEventListener('input', function () { self.updateSendState(); });
    this.body.addEventListener('click', function (e) { self.onBodyClick(e); });
    this.updateSendState();
  };

  DaddyPanChat.prototype.updateSendState = function () {
    this.sendBtn.disabled = !this.input.value.trim();
  };

  DaddyPanChat.prototype.flagInvalid = function () {
    var self = this;
    this.input.classList.remove('is-invalid');
    // force reflow so the shake animation can retrigger on repeated errors
    void this.input.offsetWidth;
    this.input.classList.add('is-invalid');
    setTimeout(function () { self.input.classList.remove('is-invalid'); }, 650);
  };

  DaddyPanChat.prototype.open = function () {
    this.panel.classList.add('is-open');
    this.launcher.classList.add('is-open');
    this.launcher.setAttribute('aria-expanded', 'true');
    if (this.badge) this.badge.style.display = 'none';
    if (!this.started) { this.started = true; this.showMainMenu(); }
    this.focusInput();
  };

  DaddyPanChat.prototype.close = function () {
    this.panel.classList.remove('is-open');
    this.launcher.classList.remove('is-open');
    this.launcher.setAttribute('aria-expanded', 'false');
  };

  DaddyPanChat.prototype.toggle = function () {
    if (this.panel.classList.contains('is-open')) this.close();
    else this.open();
  };

  DaddyPanChat.prototype.focusInput = function () {
    var self = this;
    setTimeout(function () { try { self.input.focus(); } catch (e) { /* noop */ } }, 320);
  };

  DaddyPanChat.prototype.scrollToBottom = function () {
    this.body.scrollTop = this.body.scrollHeight;
  };

  DaddyPanChat.prototype.addMessage = function (content, from, opts) {
    opts = opts || {};
    var row = document.createElement('div');
    row.className = 'msg-row from-' + from;
    var avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = from === 'bot' ? 'DP' : 'Tú';
    var bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = opts.escape === false ? content : escapeHtml(content).replace(/\n/g, '<br>');
    row.appendChild(avatar);
    row.appendChild(bubble);
    this.body.appendChild(row);
    this.scrollToBottom();
    return row;
  };

  DaddyPanChat.prototype.userSay = function (text) {
    this.addMessage(text, 'user', { escape: true });
  };

  DaddyPanChat.prototype.showTyping = function () {
    if (this.typingEl) return;
    var row = document.createElement('div');
    row.className = 'msg-row from-bot typing';
    row.innerHTML = '<div class="msg-avatar">DP</div><div class="msg-bubble">' +
      '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
    this.body.appendChild(row);
    this.typingEl = row;
    this.scrollToBottom();
  };

  DaddyPanChat.prototype.hideTyping = function () {
    if (this.typingEl) { this.typingEl.remove(); this.typingEl = null; }
  };

  DaddyPanChat.prototype.botRespond = function (callback, delay) {
    var self = this;
    this.showTyping();
    setTimeout(function () {
      self.hideTyping();
      callback();
      self.scrollToBottom();
    }, delay || (500 + Math.random() * 450));
  };

  // Shows a list of bot text bubbles one after another, each with its own
  // typing pause, then runs `done` (used to attach quick replies at the end).
  DaddyPanChat.prototype.queueBotMessages = function (messages, done) {
    var self = this;
    if (!messages.length) { if (done) done(); return; }
    var next = messages[0];
    var rest = messages.slice(1);
    this.botRespond(function () {
      self.addMessage(next, 'bot', { escape: false });
      self.queueBotMessages(rest, done);
    });
  };

  DaddyPanChat.prototype.addQuickReplies = function (list) {
    var wrap = document.createElement('div');
    wrap.className = 'quick-replies';
    list.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quick-reply';
      btn.dataset.qrAction = item.action;
      btn.dataset.qrValue = item.value != null ? item.value : item.label;
      btn.textContent = item.label;
      wrap.appendChild(btn);
    });
    this.body.appendChild(wrap);
    this.scrollToBottom();
  };

  DaddyPanChat.prototype.firstName = function (full) {
    var w = (full || '').trim().split(/\s+/)[0];
    return w || full;
  };

  DaddyPanChat.prototype.onBodyClick = function (e) {
    var qr = e.target.closest('.quick-reply');
    if (qr && !qr.disabled) {
      var group = qr.parentElement;
      var label = qr.textContent;
      var action = qr.dataset.qrAction;
      var value = qr.dataset.qrValue;
      group.remove();
      this.userSay(label);
      this.dispatchAction(action, value, label);
      return;
    }
    if (e.target.closest('[data-confirm-booking]')) { this.confirmBooking(); return; }
    if (e.target.closest('[data-edit-booking]')) { this.editBooking(); return; }
  };

  DaddyPanChat.prototype.dispatchAction = function (action, value) {
    switch (action) {
      case 'main-book': this.startBooking(); break;
      case 'main-menu': this.showMenuInfo(); break;
      case 'main-hours': this.showLocationInfo(); break;
      case 'step-date':
      case 'step-time':
      case 'step-people': this.handleStepAnswer(value); break;
      case 'restart-book': this.startBooking(); break;
      case 'back-home': this.backHome(); break;
      case 'goto-menu-section': this.goToSection('#carta'); break;
      case 'open-menu-url': this.openExternal(cfg.MENU_URL); break;
      case 'open-map-url': this.openExternal(cfg.GOOGLE_MAPS_URL); break;
      default: break;
    }
  };

  DaddyPanChat.prototype.showMainMenu = function () {
    var self = this;
    this.queueBotMessages([
      '¡Hola! 👋 Soy el asistente virtual de Daddy Pan.',
      '¿En qué puedo ayudarte hoy?'
    ], function () { self.addQuickReplies(MAIN_QUICK_REPLIES); });
  };

  DaddyPanChat.prototype.backHome = function () {
    this.state = 'idle';
    var self = this;
    this.queueBotMessages(['¿Necesitas algo más?'], function () { self.addQuickReplies(MAIN_QUICK_REPLIES); });
  };

  DaddyPanChat.prototype.showMenuInfo = function () {
    var self = this;
    this.queueBotMessages([
      'Tenemos cocina de mercado y coctelería de autor 🍽️',
      'Puedes ver un adelanto de la carta en la sección "Carta" de la web, o descargarla completa en PDF.'
    ], function () {
      self.addQuickReplies([
        { label: 'Ir a la carta', action: 'goto-menu-section' },
        { label: 'Descargar PDF', action: 'open-menu-url' },
        { label: 'Reservar mesa', action: 'main-book' }
      ]);
    });
  };

  DaddyPanChat.prototype.showLocationInfo = function () {
    var self = this;
    var hours = (cfg.HOURS || []).map(function (h) { return h.days + ': ' + h.time; }).join('\n');
    this.queueBotMessages([
      'Estamos en ' + (cfg.ADDRESS || 'nuestra dirección') + '.',
      'Nuestro horario:\n' + hours
    ], function () {
      self.addQuickReplies([
        { label: 'Cómo llegar', action: 'open-map-url' },
        { label: 'Reservar mesa', action: 'main-book' }
      ]);
    });
  };

  DaddyPanChat.prototype.goToSection = function (selector) {
    this.close();
    var el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  DaddyPanChat.prototype.openExternal = function (url) {
    if (url && url !== '#') window.open(url, '_blank', 'noopener');
    var self = this;
    this.queueBotMessages(['¿Necesitas algo más?'], function () { self.addQuickReplies(MAIN_QUICK_REPLIES); });
  };

  DaddyPanChat.prototype.startBooking = function () {
    this.data = {};
    this.state = 'name';
    var self = this;
    this.queueBotMessages([
      '¡Perfecto! 🙌 Vamos a reservar tu mesa, solo necesito un par de datos.',
      '¿A qué nombre hago la reserva?'
    ], function () { self.focusInput(); });
  };

  DaddyPanChat.prototype.handleStepAnswer = function (rawText) {
    var text = (rawText || '').trim();
    if (!text) return;
    var self = this;

    switch (this.state) {
      case 'name':
        this.data.name = text;
        this.queueBotMessages(['Encantado, ' + this.firstName(text) + ' 😊 ¿Cuál es tu teléfono de contacto?'],
          function () { self.state = 'phone'; self.focusInput(); });
        break;

      case 'phone':
        if (!/\d{6,}/.test(text.replace(/\D/g, ''))) {
          this.flagInvalid();
          this.queueBotMessages(['Creo que ese teléfono no es válido 🤔 ¿Puedes escribirlo de nuevo? (mínimo 6 dígitos)']);
          break;
        }
        this.data.phone = text;
        this.state = 'date';
        this.queueBotMessages(['¿Qué día quieres venir?'], function () {
          self.addQuickReplies([
            { label: 'Hoy', action: 'step-date', value: 'Hoy' },
            { label: 'Mañana', action: 'step-date', value: 'Mañana' },
            { label: 'Este finde', action: 'step-date', value: 'Este fin de semana' }
          ]);
        });
        break;

      case 'date':
        this.data.date = text;
        this.state = 'time';
        this.queueBotMessages(['¿A qué hora os viene bien?'], function () {
          self.addQuickReplies([
            { label: '13:30', action: 'step-time', value: '13:30' },
            { label: '14:00', action: 'step-time', value: '14:00' },
            { label: '20:30', action: 'step-time', value: '20:30' },
            { label: '21:30', action: 'step-time', value: '21:30' }
          ]);
        });
        break;

      case 'time':
        this.data.time = text;
        this.state = 'people';
        this.queueBotMessages(['¿Cuántos seréis en total?'], function () {
          self.addQuickReplies([
            { label: '2', action: 'step-people', value: '2 personas' },
            { label: '4', action: 'step-people', value: '4 personas' },
            { label: '6', action: 'step-people', value: '6 personas' },
            { label: '8 o más', action: 'step-people', value: '8 o más personas' }
          ]);
        });
        break;

      case 'people':
        this.data.people = text;
        this.state = 'confirm';
        this.showSummary();
        break;

      default:
        break;
    }
  };

  DaddyPanChat.prototype.showSummary = function () {
    var self = this;
    this.queueBotMessages(['Perfecto, revisemos los datos antes de confirmar:'], function () {
      var d = self.data;
      var wrap = document.createElement('div');
      wrap.innerHTML =
        '<div class="booking-summary">' +
          '<h5>Resumen de tu reserva</h5>' +
          '<div class="bs-row"><span>Nombre</span><span>' + escapeHtml(d.name || '—') + '</span></div>' +
          '<div class="bs-row"><span>Teléfono</span><span>' + escapeHtml(d.phone || '—') + '</span></div>' +
          '<div class="bs-row"><span>Fecha</span><span>' + escapeHtml(d.date || '—') + '</span></div>' +
          '<div class="bs-row"><span>Hora</span><span>' + escapeHtml(d.time || '—') + '</span></div>' +
          '<div class="bs-row"><span>Personas</span><span>' + escapeHtml(d.people || '—') + '</span></div>' +
          '<div class="bs-actions">' +
            '<button type="button" class="btn btn-primary" data-confirm-booking>Confirmar</button>' +
            '<button type="button" class="btn btn-outline" data-edit-booking>Editar</button>' +
          '</div>' +
        '</div>';
      self.body.appendChild(wrap.firstChild);
      self.scrollToBottom();
    });
  };

  DaddyPanChat.prototype.confirmBooking = function () {
    var self = this;
    var confirmBtn = this.body.querySelector('.booking-summary [data-confirm-booking]');
    if (confirmBtn) confirmBtn.textContent = 'Enviando…';
    this.body.querySelectorAll('.booking-summary .bs-actions .btn').forEach(function (b) { b.disabled = true; });
    this.showTyping();
    submitBooking(this.data).then(function (res) {
      self.hideTyping();
      self.addMessage('✅ ¡Solicitud recibida correctamente! Te confirmaremos por teléfono en breve.', 'bot', { escape: false });
      self.addMessage('<span style="color:var(--muted); font-size:.78rem;">Referencia de la demo: ' + res.code + '</span>', 'bot', { escape: false });
      self.addQuickReplies([
        { label: 'Hacer otra reserva', action: 'restart-book' },
        { label: 'Volver al inicio', action: 'back-home' }
      ]);
      self.state = 'idle';
    });
  };

  DaddyPanChat.prototype.editBooking = function () {
    this.body.querySelectorAll('.booking-summary .bs-actions .btn').forEach(function (b) { b.disabled = true; });
    this.startBooking();
  };

  DaddyPanChat.prototype.handleConfirmText = function (text) {
    var t = text.toLowerCase();
    if (/confirm|^s[ií]$|vale|ok/.test(t)) { this.confirmBooking(); }
    else if (/edit|cambi|corrig/.test(t)) { this.editBooking(); }
    else { this.queueBotMessages(['Puedes pulsar "Confirmar" o "Editar" arriba, o escribir «confirmar» / «editar».']); }
  };

  DaddyPanChat.prototype.routeIdleText = function (text) {
    var t = text.toLowerCase();
    var self = this;
    if (/reserv/.test(t)) { this.startBooking(); }
    else if (/cart|men[uú]|comer|plato|comida/.test(t)) { this.showMenuInfo(); }
    else if (/hora|horario|abr|cierra|abiert|d[oó]nde|ubicaci|direcci|llegar|mapa/.test(t)) { this.showLocationInfo(); }
    else if (/hola|buenas|hey/.test(t)) { this.showMainMenu(); }
    else if (/graci/.test(t)) {
      this.queueBotMessages(['¡Gracias a ti! Si quieres, puedo ayudarte con esto:'], function () { self.addQuickReplies(MAIN_QUICK_REPLIES); });
    } else {
      this.queueBotMessages(['No estoy seguro de haber entendido eso 🤔 Puedo ayudarte con esto:'], function () { self.addQuickReplies(MAIN_QUICK_REPLIES); });
    }
  };

  DaddyPanChat.prototype.onSend = function () {
    var text = this.input.value.trim();
    if (!text) return;
    this.input.value = '';
    this.updateSendState();
    this.userSay(text);

    if (this.state === 'confirm') { this.handleConfirmText(text); }
    else if (this.state === 'idle' || !this.state) { this.routeIdleText(text); }
    else { this.handleStepAnswer(text); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.DaddyPanChat = new DaddyPanChat();
  });
})();
