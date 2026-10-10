// Motion choreography (GSAP + ScrollTrigger + SplitText). Progressive enhancement:
// runs only when motion is allowed, and the page is fully readable without it.
// The page-load intros and the divider draw-ins are CSS (site.css); this file handles scroll-triggered
// entrances, scroll depth, pointer effects, and keyboard-focus reveals.
(function () {
  'use strict';
  var root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  if (window.SplitText) gsap.registerPlugin(window.SplitText);
  if (window.ScrambleTextPlugin) gsap.registerPlugin(window.ScrambleTextPlugin);
  window.__motionReady = true;

  var $ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var EASE = 'power3.out';
  // Entrances begin once an element is well inside the viewport, so the motion is seen, not missed.
  var START = 'top 85%';
  // Hover effects (site.css) use `transform`; entrances hand it back when they finish.
  var CLEAR = 'transform,opacity';

  var mm = gsap.matchMedia();
  mm.add(
    { motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 1200px)', fine: '(hover: hover) and (pointer: fine)' },
    function (ctx) {
      var c = ctx.conditions;
      if (!c.motion) return;
      root.classList.add('has-gsap');
      var cleanups = [];
      var listen = function (el, type, fn, opts) { el.addEventListener(type, fn, opts); cleanups.push(function () { el.removeEventListener(type, fn, opts); }); };

      // ---- Hero: depth on scroll, and a little parallax toward the pointer -------------
      var hero = document.querySelector('.hero');
      if (hero && c.wide) {
        var scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
        // The wrapper, not the <img>: the img's CSS entrance animates `translate`, which GSAP would absorb.
        gsap.to('.hero-portrait', { yPercent: 7, ease: 'none', scrollTrigger: scrub });
        gsap.to('.hero-copy, .hero-side', { y: -50, opacity: 0.3, ease: 'none', scrollTrigger: scrub });
        if (c.fine) {
          // The portrait drifts a few pixels against the pointer (CSS variables, eased by a CSS transition).
          var img = hero.querySelector('.hero-portrait img');
          var frame = 0;
          listen(hero, 'pointermove', function (e) {
            if (frame) return;
            frame = requestAnimationFrame(function () {
              frame = 0;
              var r = hero.getBoundingClientRect();
              img.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * -16).toFixed(1) + 'px');
              img.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * -10).toFixed(1) + 'px');
            });
          });
          listen(hero, 'pointerleave', function () { img.style.setProperty('--px', '0px'); img.style.setProperty('--py', '0px'); });
        }
      }

      // ---- Magnetic round button: the circle leans toward the pointer -----------------------
      if (c.fine) {
        $('.round-cta').forEach(function (cta) {
          var dot = cta.querySelector('.round-cta-icon');
          listen(cta, 'pointermove', function (e) {
            // Measure from the link (which never moves), so the pull doesn't feed back on itself.
            var r = cta.getBoundingClientRect();
            var dx = e.clientX - (r.left + dot.offsetWidth / 2);
            var dy = e.clientY - (r.top + r.height / 2);
            dot.style.setProperty('--mx', gsap.utils.clamp(-12, 12, dx * 0.3).toFixed(1) + 'px');
            dot.style.setProperty('--my', gsap.utils.clamp(-12, 12, dy * 0.3).toFixed(1) + 'px');
          });
          listen(cta, 'pointerleave', function () { dot.style.setProperty('--mx', '0px'); dot.style.setProperty('--my', '0px'); });
        });
      }

      // ---- Magnetic buttons and icons: pulled a few pixels toward the pointer --------------------
      if (c.fine) {
        $('[data-magnetic]').forEach(function (el) {
          var box = null;   // measured on entry, so the pull doesn't move the target it measures
          var reset = function () { box = null; el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); };
          listen(el, 'pointerenter', function () { box = el.getBoundingClientRect(); });
          listen(el, 'pointermove', function (e) {
            if (!box) box = el.getBoundingClientRect();
            el.style.setProperty('--mx', gsap.utils.clamp(-8, 8, (e.clientX - (box.left + box.width / 2)) * 0.25).toFixed(1) + 'px');
            el.style.setProperty('--my', gsap.utils.clamp(-6, 6, (e.clientY - (box.top + box.height / 2)) * 0.3).toFixed(1) + 'px');
          });
          listen(el, 'pointerleave', reset);
        });
      }

      // ---- Glowing card edges (adapted from 21st.dev's "Glowing Effect") ---------------------------
      // Near a card, the arc of its border facing the pointer lights up and eases around the edge after it.
      // All rects are read first and all styles written after, so moving the pointer never forces extra layout.
      var glowCards = c.fine ? $('[data-glow]') : [];
      if (glowCards.length) {
        var REACH = 72;   // px beyond a card's edge at which its glow wakes up
        var glow = glowCards.map(function (card) {
          return { card: card, active: false, angle: 0, ease: gsap.quickTo(card, '--glow-start', { duration: 1.1, ease: 'expo.out' }) };
        });
        var px = -1e4, py = -1e4, queued = 0;
        var update = function () {
          queued = 0;
          var rects = glow.map(function (g) { return g.card.getBoundingClientRect(); });
          glow.forEach(function (g, i) {
            var r = rects[i];
            var near = px > r.left - REACH && px < r.right + REACH && py > r.top - REACH && py < r.bottom + REACH;
            if (near !== g.active) { g.active = near; g.card.style.setProperty('--glow-active', near ? '1' : '0'); }
            if (!near) return;
            g.card.style.setProperty('--glow-x', Math.round(px - r.left) + 'px');
            g.card.style.setProperty('--glow-y', Math.round(py - r.top) + 'px');
            // Angle from the card's centre, 0 at the top, clockwise; take the short way round.
            var target = Math.atan2(py - (r.top + r.height / 2), px - (r.left + r.width / 2)) * 180 / Math.PI + 90;
            g.angle += ((((target - g.angle) % 360) + 540) % 360) - 180;
            g.ease(g.angle);
          });
        };
        var queue = function () { if (!queued) queued = requestAnimationFrame(update); };
        listen(document, 'pointermove', function (e) { px = e.clientX; py = e.clientY; queue(); }, { passive: true });
        listen(window, 'scroll', queue, { passive: true });
        listen(document.documentElement, 'pointerleave', function () { px = py = -1e4; queue(); });
        cleanups.push(function () { glow.forEach(function (g) { g.card.style.removeProperty('--glow-active'); }); });
      }

      // ---- Section headings: label slides in, words rise out of a mask, the aside follows ------
      $('.section-head').forEach(function (head) {
        gsap.set(head, { opacity: 1, y: 0 });
        var h2 = head.querySelector('h2');
        var label = head.querySelector('.section-label');
        var aside = head.querySelector('.section-aside');
        var tl = gsap.timeline({ scrollTrigger: { trigger: head, start: START, once: true }, defaults: { ease: EASE } });
        if (label) {
          tl.from(label, { x: -24, opacity: 0, duration: 0.7 });
          // The label decodes from code-like characters into its text.
          if (window.ScrambleTextPlugin) tl.to(label, { duration: 0.9, ease: 'none', scrambleText: { text: label.textContent, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/_', speed: 0.6 } }, 0);
        }
        if (window.SplitText && h2) {
          var split = window.SplitText.create(h2, { type: 'words', mask: 'words' });
          tl.from(split.words, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.06 }, label ? '-=0.45' : 0);
        } else if (h2) {
          tl.from(h2, { y: 28, opacity: 0, duration: 0.8 }, '-=0.45');
        }
        if (aside) tl.from(aside.children, { y: 18, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.7');
      });

      // ---- Projects: the card rises, its text settles, then the architecture assembles ---------
      $('.project').forEach(function (card) {
        gsap.set(card, { opacity: 1, y: 0 });
        gsap.timeline({ scrollTrigger: { trigger: card, start: START, once: true }, defaults: { ease: EASE } })
          .from(card, { y: 80, opacity: 0, duration: 1, clearProps: CLEAR })
          .from(card.querySelectorAll('.project-top > *, .project-title, .metrics > div, .project-links > *'), { y: 18, opacity: 0, duration: 0.6, stagger: 0.05 }, '<0.2')
          .from(card.querySelectorAll('.project-visual .arch-tier, .project-visual .arch-pipeline, .project-visual .arch-external'), { y: 18, opacity: 0, duration: 0.6, stagger: 0.1 }, '<0.1')
          .from(card.querySelectorAll('.project-visual .arch-beams'), { opacity: 0, duration: 0.8 }, '<0.4');
      });

      // ---- Diagrams outside cards assemble tier by tier (About story, case-study architecture) ---
      $('.story-visual .arch, .case-arch .arch').forEach(function (arch) {
        gsap.timeline({ scrollTrigger: { trigger: arch, start: 'top 80%', once: true }, defaults: { ease: EASE } })
          .from(arch.querySelectorAll('.arch-tier, .arch-pipeline, .arch-external'), { y: 22, opacity: 0, duration: 0.7, stagger: 0.12 })
          .from(arch.querySelectorAll('.arch-beams'), { opacity: 0, duration: 0.8 }, '<0.5');
      });

      // ---- Everything else marked .reveal: batched rise, one after another ---------------------
      var rest = $('.reveal').filter(function (el) { return !el.matches('.section-head, .project'); });
      if (rest.length) {
        gsap.set(rest, { opacity: 0, y: 48 });
        ST.batch(rest, {
          start: START,
          once: true,
          onEnter: function (batch) {
            batch = batch.filter(function (el) { return !el.hasAttribute('data-revealed'); });
            if (!batch.length) return;
            gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: EASE, stagger: 0.12, overwrite: true, clearProps: CLEAR });
            batch.forEach(function (el, i) {
              var chips = el.querySelectorAll(':scope > .chips li');
              if (chips.length) gsap.from(chips, { y: 10, opacity: 0, duration: 0.5, ease: EASE, stagger: 0.03, delay: 0.25 + i * 0.12 });
            });
          },
        });
      }

      // ---- Footer: "Get in touch" rises word by word -----------------------------------------
      var ctaText = document.querySelector('.footer-cta-text');
      if (ctaText && window.SplitText) {
        var words = window.SplitText.create(ctaText, { type: 'words', mask: 'words' }).words;
        gsap.timeline({ scrollTrigger: { trigger: '.site-footer', start: 'top 90%', once: true } })
          .from(words, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.07 })
          .from('.footer-cta .icon', { x: -24, opacity: 0, duration: 0.8, ease: EASE }, '<0.3');
      }

      // ---- Case-study pages: sections rise as you read -------------------------------------------
      if (document.querySelector('.case-header')) {
        $('.case-section, .case-panel, .impl-grid > div, .challenge, .next-card').forEach(function (el) {
          gsap.from(el, { y: 48, opacity: 0, duration: 1, ease: EASE, clearProps: CLEAR, scrollTrigger: { trigger: el, start: START, once: true } });
        });
      }

      // ---- Keyboard users never wait for an entrance ----------------------------------------------
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
          // Only elements GSAP has animated: the CSS page-load intros finish on their own, and touching
          // them here would make GSAP absorb their in-flight `translate`.
          if (!n._gsap) continue;
          // Jump any running entrance on this element to its end state, then make sure it is opaque.
          gsap.getTweensOf(n).forEach(function (t) { if (t.vars && 'opacity' in t.vars) t.progress(1); });
          if (parseFloat(getComputedStyle(n).opacity) < 1) gsap.set(n, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: CLEAR });
        }
      };
      document.addEventListener('focusin', onFocus);

      return function () {
        root.classList.remove('has-gsap');
        document.removeEventListener('focusin', onFocus);
        cleanups.forEach(function (fn) { fn(); });
      };
    }
  );

  // Recalculate trigger positions once fonts and lazy images have settled.
  window.addEventListener('load', function () { ST.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
})();
