(function () {
  'use strict';
  var cfg = window.DADDY_PAN_CONFIG || {};

  // ---- wire placeholder links from config ----
  document.querySelectorAll('[data-menu-url]').forEach(function (el) { el.href = cfg.MENU_URL || '#'; });
  document.querySelectorAll('[data-review-url]').forEach(function (el) { el.href = cfg.GOOGLE_REVIEW_URL || '#'; });
  document.querySelectorAll('[data-maps-url]').forEach(function (el) { el.href = cfg.GOOGLE_MAPS_URL || '#'; });

  var footYear = document.getElementById('footYear');
  if (footYear) footYear.textContent = new Date().getFullYear();

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

  // ---- open-chat triggers spread across the page ----
  document.querySelectorAll('[data-open-chat]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      teaser.classList.remove('is-visible');
      if (window.DaddyPanChat) window.DaddyPanChat.open();
    });
  });
})();
