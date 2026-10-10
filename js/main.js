/* Greater Than Us — shared behaviour */
(function () {
  'use strict';

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // on small screens, tapping a dropdown parent opens the submenu instead of navigating
    nav.querySelectorAll('.nav__item--has-dd > .nav__link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width: 960px)').matches) {
          e.preventDefault();
          link.parentElement.classList.toggle('is-closed');
        }
      });
    });
  }

  /* ---- Video lightbox (data-video="YOUTUBE_ID") ---- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var frame = lb.querySelector('.lightbox__frame');
    var close = function () {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      frame.innerHTML = '';
      document.body.style.overflow = '';
    };
    document.querySelectorAll('[data-video]').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.getAttribute('data-video');
        frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
        lb.classList.add('is-open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---- Reveal on scroll ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Progress ring (diamond) + count-up ----
     <svg class="progress__ring" data-progress="30"> with .ring-track and .ring-fill paths */
  document.querySelectorAll('[data-progress]').forEach(function (svg) {
    var fill = svg.querySelector('.ring-fill');
    if (!fill) return;
    var pct = Math.max(0, Math.min(100, parseFloat(svg.getAttribute('data-progress')) || 0));
    var len = fill.getTotalLength();
    fill.style.strokeDasharray = len;
    fill.style.strokeDashoffset = len;
    var run = function () {
      fill.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.3,.7,.2,1)';
      fill.style.strokeDashoffset = len * (1 - pct / 100);
    };
    if ('IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(); o.disconnect(); } }); }, { threshold: 0.4 });
      o.observe(svg);
    } else run();
  });

  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (el.getAttribute('data-decimals') | 0);
    var start = null, dur = 1600;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    var go = function () { requestAnimationFrame(step); };
    if ('IntersectionObserver' in window) {
      var ob = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { go(); ob.disconnect(); } }); }, { threshold: 0.4 });
      ob.observe(el);
    } else go();
  });

  /* ---- Tabs: [data-tabs] container with .tab[data-tab=x] and .tab-panel[data-panel=x] ---- */
  document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
    var tabs = wrap.querySelectorAll('.tab');
    var panels = wrap.querySelectorAll('.tab-panel');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var id = t.getAttribute('data-tab');
        tabs.forEach(function (x) { x.classList.toggle('is-active', x === t); });
        panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-panel') === id); });
      });
    });
  });

  /* ---- Load more: [data-load-more] button reveals hidden .is-hidden items in target ---- */
  document.querySelectorAll('[data-load-more]').forEach(function (btn) {
    var target = document.querySelector(btn.getAttribute('data-load-more'));
    var step = parseInt(btn.getAttribute('data-step') || '6', 10);
    if (!target) return;
    var update = function () { if (!target.querySelector('.is-hidden')) btn.style.display = 'none'; };
    btn.addEventListener('click', function () {
      target.querySelectorAll('.is-hidden').forEach(function (el, i) { if (i < step) el.classList.remove('is-hidden'); });
      update();
    });
    update();
  });

  /* ---- Rotating content sliders ([data-pr-slider]): auto-advance lists (.pr-slider__list li)
     and slides (.pr-slide); arrow click advances; pauses on hover/focus; respects reduced motion ---- */
  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-pr-slider]').forEach(function (s) {
    var items = s.querySelectorAll('.pr-slider__list li, .pr-slide');
    if (items.length < 2) { var a = s.querySelector('.pr-slider__arrow'); if (a) a.style.visibility = 'hidden'; return; }
    var i = Math.max(0, Array.prototype.findIndex.call(items, function (el) { return el.classList.contains('is-active'); }));
    var delay = parseInt(s.getAttribute('data-interval') || '4000', 10), timer;
    function show(k) {
      i = (k + items.length) % items.length;
      items.forEach(function (el, j) { el.classList.toggle('is-active', j === i); });
      var media = s.querySelectorAll('.pr-slider__media img[data-slide]');
      if (media.length) media.forEach(function (im) { im.classList.toggle('is-active', parseInt(im.getAttribute('data-slide'), 10) === i); });
    }
    function play() { clearInterval(timer); if (!noMotion) timer = setInterval(function () { show(i + 1); }, delay); }
    var btn = s.querySelector('.pr-slider__arrow');
    if (btn) btn.addEventListener('click', function () { show(i + 1); play(); });
    items.forEach(function (el, j) { el.addEventListener('click', function () { show(j); play(); }); });
    s.addEventListener('mouseenter', function () { clearInterval(timer); });
    s.addEventListener('mouseleave', play);
    s.addEventListener('focusin', function () { clearInterval(timer); });
    s.addEventListener('focusout', play);
    play();
  });

  /* ---- Accordion: .acc > .acc__item > .acc__btn / .acc__panel ---- */
  document.querySelectorAll('.acc__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.parentElement;
      var open = item.classList.toggle('is-open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---- Story search (subnav) filters .story-card by text ---- */
  document.querySelectorAll('.subnav__search input').forEach(function (inp) {
    inp.addEventListener('input', function () {
      var q = inp.value.trim().toLowerCase();
      var cards = document.querySelectorAll('.story-card, .card[data-searchable]');
      if (!cards.length) return;
      cards.forEach(function (c) { c.style.display = (!q || c.textContent.toLowerCase().indexOf(q) > -1) ? '' : 'none'; });
    });
  });
})();
