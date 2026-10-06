// Motion choreography (GSAP + ScrollTrigger + SplitText). Progressive enhancement:
// runs only when motion is allowed, and the page is fully readable without it.
// The head script hides intro elements under html.motion; this file reveals them, and a
// timeout in the head removes .motion if this file never runs.
(function () {
  'use strict';
  var root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('motion'); return; }
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  if (window.SplitText) gsap.registerPlugin(window.SplitText);
  window.__motionReady = true;

  var $ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var EASE = 'power3.out';

  var mm = gsap.matchMedia();
  mm.add(
    { motion: '(prefers-reduced-motion: no-preference)', fine: '(pointer: fine)', wide: '(min-width: 1001px)' },
    function (ctx) {
      var c = ctx.conditions;
      if (!c.motion) { root.classList.remove('motion'); return; }
      root.classList.add('has-gsap');
      // Un-hide intro elements *before* creating tweens: gsap.from() animates toward the current
      // computed value, and immediateRender applies the start state in this same task (no flash).
      root.classList.remove('motion');

      // ---- Hero intro ----------------------------------------------------------
      var hero = document.querySelector('.hero');
      if (hero) {
        // .btn has a CSS transition on transform (hover lift), which fights GSAP; suspend it for the
        // intro and restore it afterwards.
        var ctaItems = $('.hero-cta > *');
        gsap.set(ctaItems, { transition: 'none' });
        var tl = gsap.timeline({ defaults: { ease: EASE }, onComplete: function () { gsap.set(ctaItems, { clearProps: 'transition,transform' }); } });
        tl.from('.hero .eyebrow', { y: -12, opacity: 0, duration: 0.6 })
          .from('.hero .line-mask > span', { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.09 }, '-=0.3')
          .from('.hero-summary', { y: 18, opacity: 0, duration: 0.8 }, '-=0.65')
          .from(ctaItems, { y: 16, opacity: 0, scale: 0.96, duration: 0.6, stagger: 0.06 }, '-=0.55')
          .from('.signals li', { y: 10, opacity: 0, duration: 0.5, stagger: 0.06 }, '-=0.4')
          .from('.hero .window', { rotateX: 24, y: 70, opacity: 0, transformPerspective: 1400, transformOrigin: '50% 100%', duration: 1.4, ease: 'expo.out' }, 0.25)
          .from('.hero .arch-tier', { y: 14, opacity: 0, duration: 0.6, stagger: 0.12 }, 0.75)
          .from('.hero .arch-beams', { opacity: 0, duration: 0.8 }, 1.15)
          .from('.hero .badge', { scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.15 }, 1.2);

        // Depth on scroll: the visual drifts up and tilts back; the copy eases out.
        // (Scroll targets the wrapper so it never fights the intro tween on .window.)
        if (c.wide) {
          gsap.to('.hero-visual', { yPercent: -8, rotateX: -6, transformPerspective: 1400, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
          gsap.to('.hero .badge--a', { y: -60, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
          gsap.to('.hero .badge--b', { y: -110, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
          gsap.to('.hero-copy', { y: -60, opacity: 0.35, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
        }
        gsap.to('.aurora-gl', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      }

      // ---- Marquee leans with scroll speed ---------------------------------------
      var lists = $('.marquee-list');
      if (lists.length) {
        var skewTo = gsap.quickTo(lists, 'skewX', { duration: 0.6, ease: 'power3' });
        ST.create({ onUpdate: function (self) { skewTo(gsap.utils.clamp(-8, 8, self.getVelocity() / -260)); } });
      }

      // ---- Section headings: words rise out of a mask -----------------------------
      $('.section-head').forEach(function (head) {
        gsap.set(head, { opacity: 1, y: 0 });
        var h2 = head.querySelector('h2');
        var tlh = gsap.timeline({ scrollTrigger: { trigger: head, start: 'top 85%', once: true }, defaults: { ease: EASE } });
        var num = head.querySelector('.section-num');
        var lead = head.querySelector('.lead');
        if (num) tlh.from(num, { x: -16, opacity: 0, duration: 0.6 });
        if (window.SplitText && h2 && !h2.querySelector('.gradient-text')) {
          var split = window.SplitText.create(h2, { type: 'words', mask: 'words' });
          tlh.from(split.words, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.05 }, '-=0.4');
        } else if (h2) {
          tlh.from(h2, { y: 24, opacity: 0, duration: 0.8 }, '-=0.4');
        }
        if (lead) tlh.from(lead, { y: 14, opacity: 0, duration: 0.7 }, '-=0.6');
      });

      // ---- Experience: the timeline draws as you read -----------------------------
      var timeline = document.querySelector('.timeline');
      if (timeline) {
        // The progress line is .timeline::after, driven through a custom property.
        gsap.fromTo(timeline, { '--tl-progress': 0 }, { '--tl-progress': 1, ease: 'none', scrollTrigger: { trigger: timeline, start: 'top 70%', end: 'bottom 55%', scrub: 0.4 } });
        $('.timeline-item').forEach(function (item) {
          gsap.set(item, { opacity: 1, y: 0 });
          ST.create({ trigger: item, start: 'top 62%', toggleClass: { targets: item, className: 'is-reached' } });
          gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 80%', once: true }, defaults: { ease: EASE } })
            .from(item.querySelector('.timeline-meta'), c.wide ? { x: -24, opacity: 0, duration: 0.8 } : { y: 16, opacity: 0, duration: 0.7 })
            .from(item.querySelector('.timeline-card'), c.wide ? { x: 40, opacity: 0, duration: 0.9 } : { y: 24, opacity: 0, duration: 0.8 }, '<0.1')
            .from(item.querySelectorAll('.bullets li'), { y: 12, opacity: 0, duration: 0.5, stagger: 0.06 }, '<0.3');
        });
      }

      // ---- Projects: visual slides in from its side, then the architecture assembles
      $('.project').forEach(function (card, i) {
        gsap.set(card, { opacity: 1, y: 0 });
        // Even cards put the visual on the right, so it enters from the right.
        var side = c.wide ? (i % 2 ? 1 : -1) : 0;
        gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 80%', once: true }, defaults: { ease: EASE } })
          .from(card, { y: 50, opacity: 0, duration: 0.9 })
          .from(card.querySelector('.project-visual'), { x: 60 * side, rotateY: -10 * side, transformPerspective: 1200, duration: 1.1, ease: 'expo.out' }, '<')
          .from(card.querySelectorAll('.project-visual .arch-tier, .project-visual .arch-pipeline, .project-visual .arch-external'), { y: 14, opacity: 0, duration: 0.55, stagger: 0.1 }, '<0.3')
          .from(card.querySelectorAll('.project-visual .arch-beams'), { opacity: 0, duration: 0.7 }, '<0.4')
          .from(card.querySelectorAll('.project-head > *, .project-summary, .metrics > div, .project .chips li, .project-links > *'), { y: 14, opacity: 0, duration: 0.5, stagger: 0.025 }, '<0.05');
      });

      // ---- Everything else marked .reveal: batched rise ------------------------------
      var rest = $('.reveal').filter(function (el) { return !el.matches('.section-head, .timeline-item, .project'); });
      if (rest.length) gsap.set(rest, { opacity: 0, y: 36 });
      if (rest.length) ST.batch(rest, {
        start: 'top 88%',
        once: true,
        onEnter: function (batch) {
          batch = batch.filter(function (el) { return !el.hasAttribute('data-revealed'); });
          if (!batch.length) return;
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.09, overwrite: true });
          batch.forEach(function (el) {
            var chips = el.querySelectorAll(':scope > .chips li');
            if (chips.length) gsap.from(chips, { scale: 0.85, opacity: 0, duration: 0.45, ease: 'back.out(1.6)', stagger: 0.025, delay: 0.25 });
          });
        },
      });

      // ---- Case-study pages ------------------------------------------------------
      var caseHeader = document.querySelector('.case-header');
      if (caseHeader) {
        // The h1 is left alone so the cross-page view transition can morph into it.
        gsap.timeline({ defaults: { ease: EASE } })
          .from('.back-link', { x: -12, opacity: 0, duration: 0.5 })
          .from('.case-header > :not(h1)', { y: 18, opacity: 0, duration: 0.7, stagger: 0.07 }, '-=0.2')
          .from('.case-header .chips li', { scale: 0.85, opacity: 0, duration: 0.4, ease: 'back.out(1.6)', stagger: 0.03 }, '-=0.5');
        $('.case-section, .case-panel, .impl-grid > div, .challenge, .next-card').forEach(function (el) {
          gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: EASE, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        });
        var caseArch = document.querySelector('.case-arch');
        if (caseArch) {
          gsap.timeline({ scrollTrigger: { trigger: caseArch, start: 'top 75%', once: true } })
            .from(caseArch.querySelectorAll('.arch-tier, .arch-pipeline, .arch-external'), { y: 18, opacity: 0, duration: 0.6, ease: EASE, stagger: 0.14 })
            .from(caseArch.querySelectorAll('.arch-beams'), { opacity: 0, duration: 0.8 }, '<0.5');
        }
      }

      // ---- Keyboard users never wait for an entrance ------------------------------------
      // Reveals animate opacity (not visibility), so unrevealed content stays in the tab order;
      // if focus lands inside something still faded out, show it immediately.
      var onFocus = function (e) {
        // Keyboard focus only: snapping an element into place under a mouse press would move it away
        // from the pointer between mousedown and mouseup and swallow the click.
        if (!e.target.matches || !e.target.matches(':focus-visible')) return;
        // Finish any entrance whose trigger contains the focused element...
        ST.getAll().forEach(function (st) {
          if (st.animation && st.trigger && st.trigger.contains(e.target)) st.animation.progress(1);
        });
        // ...and un-fade anything left (batched reveals have no single animation to finish).
        for (var n = e.target; n && n !== document.body; n = n.parentElement) {
          if (n.classList.contains('reveal')) n.setAttribute('data-revealed', '');   // batch reveals skip it later
          // Jump any running entrance on this element to its end state, then make sure it is opaque.
          gsap.getTweensOf(n).forEach(function (t) { if (t.vars && 'opacity' in t.vars) t.progress(1); });
          if (parseFloat(getComputedStyle(n).opacity) < 1) gsap.set(n, { opacity: 1, x: 0, y: 0, scale: 1 });
        }
      };
      document.addEventListener('focusin', onFocus);

      // ---- 3D tilt toward the pointer (project visuals, repository cards) -------------
      if (c.fine && c.wide) {
        var tilt = function (host, target, max) {
          var rx = gsap.quickTo(target, 'rotateX', { duration: 0.5, ease: 'power3' });
          var ry = gsap.quickTo(target, 'rotateY', { duration: 0.5, ease: 'power3' });
          gsap.set(target, { transformPerspective: 1000 });
          host.addEventListener('pointermove', function (e) {
            var r = target.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            var inside = Math.abs(x) <= 0.5 && Math.abs(y) <= 0.5;
            rx(inside ? -y * max : 0);
            ry(inside ? x * max : 0);
          });
          host.addEventListener('pointerleave', function () { rx(0); ry(0); });
        };
        $('.project').forEach(function (card) { tilt(card, card.querySelector('.project-visual'), 7); });
        $('.repo-card').forEach(function (card) { tilt(card, card, 4); });
      }

      return function () { root.classList.remove('has-gsap'); document.removeEventListener('focusin', onFocus); };
    }
  );

  // Recalculate trigger positions once fonts and lazy images have settled.
  window.addEventListener('load', function () { ST.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
})();
