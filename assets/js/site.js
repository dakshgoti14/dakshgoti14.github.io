// Progressive enhancement only — every section renders and works without this file.
(function () {
  'use strict';
  window.__siteReady = true;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var nav = document.querySelector('[data-nav]');
  var toggle = document.querySelector('[data-nav-toggle]');

  // ---- Toast ------------------------------------------------------------------
  var toastEl = document.querySelector('[data-toast]');
  var toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2200);
  }

  function copyText(text) {
    var done = function () { toast('Copied ' + text); };
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(done, function () { toast('Copy failed — ' + text); });
    }
    // Fallback for non-secure contexts (e.g. file://).
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed — ' + text); }
    area.remove();
    return Promise.resolve();
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      copyText(btn.getAttribute('data-copy')).then(function () {
        btn.classList.add('is-done');
        setTimeout(function () { btn.classList.remove('is-done'); }, 1800);
      });
    });
  });

  // ---- Mobile menu --------------------------------------------------------
  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    // Close on a tap outside the bar, or when keyboard focus moves past the last item.
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false);
    });
    nav.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !nav.contains(e.relatedTarget)) setMenu(false);
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  // ---- Command palette ------------------------------------------------------
  var dialog = document.querySelector('[data-cmdk]');
  if (dialog && typeof dialog.showModal === 'function') {
    var input = dialog.querySelector('[data-cmdk-input]');
    var items = Array.prototype.slice.call(dialog.querySelectorAll('.cmdk-item'));
    var empty = dialog.querySelector('[data-cmdk-empty]');
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    var active = -1;

    document.querySelectorAll('[data-cmdk-key]').forEach(function (k) { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });
    items.forEach(function (el, i) { el.id = 'cmdk-opt-' + i; });

    var visible = function () { return items.filter(function (el) { return !el.hidden; }); };

    var setActive = function (index) {
      var list = visible();
      items.forEach(function (el) { el.setAttribute('aria-selected', 'false'); });
      if (!list.length) { active = -1; input.removeAttribute('aria-activedescendant'); return; }
      active = (index + list.length) % list.length;
      var el = list[active];
      el.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', el.id);
      el.scrollIntoView({ block: 'nearest' });
    };

    var filter = function () {
      var q = input.value.trim().toLowerCase();
      items.forEach(function (el) {
        var hay = el.getAttribute('data-label') + ' ' + (el.querySelector('.cmdk-hint') ? el.querySelector('.cmdk-hint').textContent.toLowerCase() : '');
        el.hidden = q !== '' && hay.indexOf(q) === -1;
      });
      dialog.querySelectorAll('.cmdk-group').forEach(function (g) {
        g.hidden = !g.querySelector('.cmdk-item:not([hidden])');
      });
      empty.hidden = visible().length > 0;
      setActive(0);
    };

    var open = function () {
      if (dialog.open) return;
      setMenu(false);
      input.value = '';
      filter();
      dialog.showModal();
      input.focus();
    };
    var close = function () { if (dialog.open) dialog.close(); };

    var run = function (el) {
      if (!el) return;
      var href = el.getAttribute('data-href');
      var action = el.getAttribute('data-action');
      close();
      if (action === 'copy') { copyText(el.getAttribute('data-value')); return; }
      if (!href) return;
      if (el.hasAttribute('data-external')) { window.open(href, '_blank', 'noopener'); return; }
      window.location.href = href;
    };

    document.querySelectorAll('[data-cmdk-open]').forEach(function (b) { b.addEventListener('click', open); });
    document.addEventListener('keydown', function (e) {
      var typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); dialog.open ? close() : open(); }
      else if (e.key === '/' && !typing && !dialog.open) { e.preventDefault(); open(); }
    });
    input.addEventListener('input', filter);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
      else if (e.key === 'End') { e.preventDefault(); setActive(visible().length - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); run(visible()[active]); }
    });
    items.forEach(function (el) {
      el.addEventListener('click', function () { run(el); });
      el.addEventListener('mousemove', function () {
        var i = visible().indexOf(el);
        if (i !== active) setActive(i);
      });
    });
    // Click on the backdrop (outside the panel) closes.
    dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });
  }

  // ---- Clickable cards ---------------------------------------------------------------
  // A click anywhere on a card follows its data-card-href. Real links and buttons inside keep their
  // own behaviour; selecting text never navigates; Cmd/Ctrl/Shift-click and middle-click open a new tab.
  // (Not a CSS stretched link: the GSAP transforms and glow layers would trap its overlay.)
  document.querySelectorAll('[data-card-href]').forEach(function (card) {
    var href = card.getAttribute('data-card-href');
    var external = card.hasAttribute('data-card-external');
    var follow = function (newTab) {
      if (newTab || external) window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    };
    card.addEventListener('click', function (e) {
      if (e.target.closest('a, button, input, summary')) return;
      if (String(window.getSelection ? window.getSelection() : '')) return;
      follow(e.metaKey || e.ctrlKey || e.shiftKey);
    });
    card.addEventListener('auxclick', function (e) {
      if (e.button === 1 && !e.target.closest('a')) follow(true);
    });
  });

  // ---- Architecture beams ----------------------------------------------------------
  // Adapted from Magic UI's Animated Beam (via 21st.dev): an SVG overlay inside each diagram draws a
  // faint path plus a travelling glow between connected nodes; parent→fan edges become smooth curves.
  // Positions come from layout offsets (not getBoundingClientRect) so beams stay attached while the
  // diagram is transformed (3D tilt, parallax). The CSS connectors remain as the no-JS fallback.
  var SVGNS = 'http://www.w3.org/2000/svg';
  var offsetIn = function (el, root) {
    var x = 0, y = 0;
    while (el && el !== root) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return { x: x, y: y };
  };
  var nodesOf = function (tier) {
    return Array.prototype.slice.call(tier.querySelectorAll(':scope > .arch-node, :scope > .arch-row > li > .arch-node'));
  };
  document.querySelectorAll('.arch').forEach(function (arch) {
    var tiers = Array.prototype.slice.call(arch.querySelectorAll(':scope > .arch-tiers > .arch-tier'));
    if (tiers.length < 2) return;
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'arch-beams');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var edges = [];
    for (var t = 1; t < tiers.length; t++) {
      var parents = nodesOf(tiers[t - 1]);
      var children = nodesOf(tiers[t]);
      // Only a single node fans out; a fan never converges in these diagrams.
      if (parents.length !== 1) continue;
      children.forEach(function (child, i) {
        var base = document.createElementNS(SVGNS, 'path');
        base.setAttribute('class', 'beam-base');
        var glow = document.createElementNS(SVGNS, 'path');
        glow.setAttribute('class', 'beam-glow');
        glow.setAttribute('pathLength', '100');
        glow.style.setProperty('--d', (t * 0.55 + i * 0.12).toFixed(2) + 's');
        svg.appendChild(base);
        svg.appendChild(glow);
        edges.push({ from: parents[0], to: child, paths: [base, glow] });
      });
    }
    if (!edges.length) return;
    arch.insertBefore(svg, arch.firstChild);
    var draw = function () {
      var w = arch.offsetWidth, h = arch.offsetHeight;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.setAttribute('width', w);
      svg.setAttribute('height', h);
      edges.forEach(function (e) {
        var a = offsetIn(e.from, arch), b = offsetIn(e.to, arch);
        var x1 = a.x + e.from.offsetWidth / 2, y1 = a.y + e.from.offsetHeight;
        var x2 = b.x + e.to.offsetWidth / 2, y2 = b.y;
        var my = (y1 + y2) / 2;
        var d = Math.abs(x1 - x2) < 1
          ? 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2
          : 'M' + x1 + ' ' + y1 + ' C' + x1 + ' ' + my + ' ' + x2 + ' ' + my + ' ' + x2 + ' ' + y2;
        e.paths.forEach(function (p) { p.setAttribute('d', d); });
      });
    };
    draw();
    arch.classList.add('has-beams');
    if ('ResizeObserver' in window) new ResizeObserver(draw).observe(arch);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  });

  // ---- Spotlight: a soft glow that follows the pointer inside cards -------------
  if (finePointer && !reduced) {
    var frame = null;
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('[data-spotlight]');
      if (!card || frame) return;
      frame = requestAnimationFrame(function () {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        frame = null;
      });
    }, { passive: true });
  }

  if (!hasIO) {
    document.documentElement.classList.remove('js');
    return;
  }

  // ---- Nav background once the page has scrolled ---------------------------
  if (nav) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  // A section is "current" when it crosses a band just above the middle of the viewport.
  var band = { rootMargin: '-40% 0px -55% 0px' };

  // ---- Active section indicator ------------------------------------------
  // Sections without their own nav item highlight their parent (data-nav-group); the hero clears it.
  var links = document.querySelectorAll('[data-nav-link]');
  var tracked = document.querySelectorAll('main section[id]');
  if (links.length && tracked.length) {
    var setCurrent = function (id) {
      links.forEach(function (a) {
        if (a.getAttribute('data-nav-link') === id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.getAttribute('data-nav-group') || entry.target.id);
      });
    }, band);
    tracked.forEach(function (section) { activeObserver.observe(section); });
  }

  // ---- Case study table of contents -----------------------------------------
  var tocLinks = document.querySelectorAll('[data-toc]');
  if (tocLinks.length) {
    var byTarget = new Map();
    tocLinks.forEach(function (a) {
      var heading = document.getElementById(a.getAttribute('href').slice(1));
      if (heading) byTarget.set(heading.closest('section') || heading, a);
    });
    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        byTarget.get(entry.target).setAttribute('aria-current', 'true');
      });
    }, band);
    byTarget.forEach(function (_, el) { tocObserver.observe(el); });
  }

  // ---- Count-up for metrics as they come into view ----------------------------
  // "200K+" counts 0→200, "<200ms" 0→200, "~92%" 0→92; non-numeric values are left alone.
  if (!reduced) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        var el = entry.target;
        var m = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(el.textContent);
        if (!m) return;
        var target = parseFloat(m[2]);
        var decimals = (m[2].split('.')[1] || '').length;
        var start = performance.now();
        var step = function (now) {
          var t = Math.min(1, (now - start) / 900);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = m[1] + (target * eased).toFixed(decimals) + m[3];
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { countObserver.observe(el); });
  }

  // ---- Reveal on scroll ----------------------------------------------------
  var reveals = document.querySelectorAll('.reveal');
  if (reduced) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  reveals.forEach(function (el) { revealObserver.observe(el); });

  // Opening <details> reveals its contents immediately.
  document.querySelectorAll('details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      d.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    });
  });
})();
