/* Greater Than Us — motion layer (GSAP + ScrollTrigger + AOS)
   Depends on vendor/gsap.min.js, vendor/ScrollTrigger.min.js, vendor/aos.js. Degrades gracefully if missing. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof gsap !== 'undefined';
  var hasAOS = typeof AOS !== 'undefined';
  document.documentElement.classList.remove('no-js');

  /* ---- AOS: scroll reveal for tagged elements (data-aos added at build time) ---- */
  if (hasAOS && !reduce) {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60, anchorPlacement: 'top-bottom' });
    // keep AOS in sync with lazy images / load-more
    window.addEventListener('load', function () { AOS.refresh(); });
    document.querySelectorAll('[data-load-more], .tab, .acc__btn').forEach(function (b) {
      b.addEventListener('click', function () { setTimeout(function () { AOS.refreshHard(); }, 50); });
    });
  } else {
    document.querySelectorAll('[data-aos]').forEach(function (el) { el.removeAttribute('data-aos'); });
  }

  if (!hasGsap || reduce) {
    document.querySelectorAll('.hero').forEach(function (h) { h.classList.add('is-ready'); });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ---- Hero entrance ---- */
  document.querySelectorAll('.hero').forEach(function (hero) {
    var parts = ['.hero__logo', '.hero__icon', '.hero__tag', '.hero__title', '.hero__scroll']
      .map(function (s) { return hero.querySelector(s); }).filter(Boolean);
    hero.classList.add('is-ready');
    if (!parts.length) return;
    gsap.set(parts, { opacity: 0, y: 28 });
    var media = hero.querySelector('.hero__media img, .hero__media video');
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (media) tl.fromTo(media, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0);
    tl.to(parts, { opacity: 1, y: 0, duration: .9, stagger: .14 }, .25);

    /* parallax on scroll */
    if (media && typeof ScrollTrigger !== 'undefined') {
      gsap.to(media, {
        yPercent: 18, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  });

  if (typeof ScrollTrigger === 'undefined') return;

  /* ---- Big section headings: subtle clip reveal ---- */
  gsap.utils.toArray('.section__title, .goal__title, .join__title, .st-hero__title, .pr-hero__title').forEach(function (el) {
    gsap.from(el, {
      y: 30, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ---- Chips stagger ---- */
  gsap.utils.toArray('.chips').forEach(function (group) {
    var chips = group.querySelectorAll('.chip');
    if (!chips.length) return;
    gsap.from(chips, {
      y: 14, opacity: 0, duration: .5, stagger: .06, ease: 'power2.out',
      scrollTrigger: { trigger: group, start: 'top 90%', once: true }
    });
  });

  /* ---- Priority rows: image slides in from its side ---- */
  gsap.utils.toArray('.prow').forEach(function (row) {
    var media = row.querySelector('.prow__media');
    if (!media) return;
    var fromLeft = !row.classList.contains('prow--flip');
    gsap.from(media, {
      x: fromLeft ? -60 : 60, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: row, start: 'top 80%', once: true }
    });
  });

  /* ---- Numbers 01 / 02 / 03 count feel ---- */
  gsap.utils.toArray('.prow__num').forEach(function (n) {
    gsap.from(n, { scale: .7, opacity: 0, duration: .6, ease: 'back.out(1.7)', scrollTrigger: { trigger: n, start: 'top 90%', once: true } });
  });

  /* ---- Decorative rules draw in ---- */
  gsap.utils.toArray('.rule').forEach(function (r) {
    gsap.from(r, { scaleX: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: r, start: 'top 92%', once: true } });
  });

  /* ---- Header: subtle shadow once scrolled (no hide/show — keeps nav stable) ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -80',
      onToggle: function (self) { header.classList.toggle('is-scrolled', self.isActive); }
    });
  }

  /* ---- Magnetic-ish primary buttons (desktop only) ---- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn--brick, .btn--brown').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .12, y: (e.clientY - r.top - r.height / 2) * .25, duration: .3 });
      });
      btn.addEventListener('mouseleave', function () { gsap.to(btn, { x: 0, y: 0, duration: .4, ease: 'elastic.out(1,.5)' }); });
    });
  }
})();
