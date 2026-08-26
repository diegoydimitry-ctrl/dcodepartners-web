(function () {
  'use strict';
  var cfg = window.DADDY_PAN_CONFIG || {};

  // ---- wire placeholder links from config ----
  document.querySelectorAll('[data-menu-url]').forEach(function (el) { el.href = cfg.MENU_URL || '#'; });
  document.querySelectorAll('[data-review-url]').forEach(function (el) { el.href = cfg.GOOGLE_REVIEW_URL || '#'; });
  document.querySelectorAll('[data-maps-url]').forEach(function (el) { el.href = cfg.GOOGLE_MAPS_URL || '#'; });

  var footYear = document.getElementById('footYear');
  if (footYear) footYear.textContent = new Date().getFullYear();

  // ---- hero entrance animation ----
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });
  });

  // ---- subtle hero parallax on scroll (starts once the entrance settles) ----
  var heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    var parallaxActive = false;
    setTimeout(function () { parallaxActive = true; }, 950);
    document.addEventListener('scroll', function () {
      if (!parallaxActive) return;
      var y = Math.min(window.scrollY, 500);
      heroVisual.style.transform = 'translateY(' + (y * 0.06).toFixed(1) + 'px) scale(1)';
    }, { passive: true });
  }

  // ---- sticky header ----
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 24) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- mobile drawer ----
  var navToggle = document.getElementById('navToggle');
  var drawer = document.getElementById('mobileDrawer');
  var drawerClose = document.getElementById('mobileDrawerClose');

  function openDrawer() {
    drawer.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', function (e) { if (e.target === drawer) closeDrawer(); });
  drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });

  // ---- menu tabs ----
  var tabs = document.querySelectorAll('.menu-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-menu-tab');
      tabs.forEach(function (t) { t.classList.toggle('is-active', t === tab); });
      document.querySelectorAll('.menu-panel').forEach(function (panel) {
        panel.classList.toggle('is-active', panel.getAttribute('data-menu-panel') === target);
      });
    });
  });

  // ---- reveal on scroll ----
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- chat teaser bubble ----
  var teaser = document.getElementById('chatTeaser');
  var teaserClose = document.getElementById('chatTeaserClose');
  var teaserShown = false;

  function showTeaser() {
    if (teaserShown || sessionStorage.getItem('dp_teaser_dismissed') === '1') return;
    var chatPanel = document.getElementById('chatPanel');
    if (chatPanel && chatPanel.classList.contains('is-open')) return;
    teaserShown = true;
    teaser.classList.add('is-visible');
  }
  setTimeout(showTeaser, 4500);

  teaserClose.addEventListener('click', function (e) {
    e.stopPropagation();
    teaser.classList.remove('is-visible');
    try { sessionStorage.setItem('dp_teaser_dismissed', '1'); } catch (err) { /* private mode */ }
  });
  teaser.addEventListener('click', function () {
    teaser.classList.remove('is-visible');
    if (window.DaddyPanChat) window.DaddyPanChat.open();
  });

  // ---- gallery lightbox ----
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');

  if (galleryItems.length && lightbox) {
    var lightboxStage = document.getElementById('lightboxStage');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var currentIndex = 0;

    var ZOOM_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
      'stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/>' +
      '<line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/>' +
      '<line x1="8" y1="11" x2="14" y2="11"/></svg>';

    galleryItems.forEach(function (item, i) {
      var hint = document.createElement('div');
      hint.className = 'zoom-hint';
      hint.innerHTML = ZOOM_ICON;
      item.appendChild(hint);

      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'Ampliar fotografía');
      item.addEventListener('click', function () { openLightbox(i); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    });

    function renderLightbox(index) {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      var photo = galleryItems[currentIndex].querySelector('.placeholder-photo');
      lightboxStage.innerHTML = '';
      lightboxStage.appendChild(photo.cloneNode(true));
      var label = photo.querySelector('span');
      lightboxCaption.textContent = label ? label.textContent : '';
    }

    function openLightbox(index) {
      renderLightbox(index);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    lightboxPrev.addEventListener('click', function () { renderLightbox(currentIndex - 1); });
    lightboxNext.addEventListener('click', function () { renderLightbox(currentIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') renderLightbox(currentIndex - 1);
      else if (e.key === 'ArrowRight') renderLightbox(currentIndex + 1);
    });

    // touch swipe (mobile)
    var touchStartX = null;
    lightbox.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { renderLightbox(currentIndex + (dx > 0 ? -1 : 1)); }
      touchStartX = null;
    }, { passive: true });
  }

  // ---- open-chat triggers spread across the page ----
  document.querySelectorAll('[data-open-chat]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      teaser.classList.remove('is-visible');
      if (window.DaddyPanChat) window.DaddyPanChat.open();
    });
  });
})();
