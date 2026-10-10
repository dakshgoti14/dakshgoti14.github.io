// Progressive enhancement only — every section renders and works without this file.
(function () {
  'use strict';
  window.__siteReady = true;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Old single-page links (/#projects, /#contact, …) now point at their own pages -----
  var MOVED = { projects: 'projects/', github: 'projects/#github', engineering: 'about/#engineering', skills: 'about/#skills', education: 'education/', contact: 'contact/' };
  var oldHash = location.hash.slice(1);
  if (oldHash && MOVED[oldHash] && document.querySelector('.hero') && !document.getElementById(oldHash)) {
    location.replace(MOVED[oldHash]);
    return;
  }
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
    document.documentElement.classList.toggle('menu-open', open);   // lock page scroll behind the sheet
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
    window.matchMedia('(min-width: 1101px)').addEventListener('change', function (mq) {
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

  // ---- Message form: compose the email in the visitor's own mail app -----------------
  // There is no backend; without JavaScript the form falls back to a plain mailto submission
  // (with the browser's own validation). With it, errors appear inline beside the field.
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.setAttribute('novalidate', '');
    var required = Array.prototype.slice.call(form.querySelectorAll('[required]'));
    var showError = function (field, show) {
      var message = document.getElementById(field.id + '-error');
      if (!message) return;
      message.hidden = !show;
      if (show) { field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', message.id); }
      else { field.removeAttribute('aria-invalid'); field.removeAttribute('aria-describedby'); }
    };
    required.forEach(function (field) {
      field.addEventListener('input', function () { if (field.value.trim()) showError(field, false); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = required.filter(function (field) { return !field.value.trim(); });
      required.forEach(function (field) { showError(field, missing.indexOf(field) !== -1); });
      if (missing.length) { missing[0].focus(); return; }
      var name = form.elements.name.value.trim();
      var subject = form.elements.subject.value.trim() || 'Hello from ' + name;
      var body = form.elements.message.value.trim() + '\n\n— ' + name;
      toast('Opening your email app…');
      window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  });

  // ---- Clickable cards ---------------------------------------------------------------
  // A click anywhere on a card follows its data-card-href. Real links and buttons inside keep their
  // own behaviour; selecting text never navigates; Cmd/Ctrl/Shift-click and middle-click open a new tab.
  // (Not a CSS stretched link: the entrance transforms would trap its overlay.)
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
  // diagram is transformed (entrance animations). The CSS connectors remain as the no-JS fallback.
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

    // Hover a node: light its path back to the top tier plus its direct children; dim the rest.
    var parentOf = new Map(), childrenOf = new Map();
    edges.forEach(function (e) {
      parentOf.set(e.to, e);
      if (!childrenOf.has(e.from)) childrenOf.set(e.from, []);
      childrenOf.get(e.from).push(e);
    });
    var clearTrace = function () {
      arch.classList.remove('is-tracing');
      arch.querySelectorAll('.is-lit, .is-hot').forEach(function (el) { el.classList.remove('is-lit', 'is-hot'); });
    };
    var trace = function (node) {
      clearTrace();
      arch.classList.add('is-tracing');
      node.classList.add('is-lit');
      var light = function (e) { e.from.classList.add('is-lit'); e.to.classList.add('is-lit'); e.paths.forEach(function (p) { p.classList.add('is-hot'); }); };
      for (var up = parentOf.get(node); up; up = parentOf.get(up.from)) light(up);
      (childrenOf.get(node) || []).forEach(light);
    };
    arch.querySelectorAll('.arch-node').forEach(function (node) {
      node.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') trace(node); });
    });
    arch.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') clearTrace(); });
    // Touch: tap a node to trace it, tap anywhere else to clear. (Inside project cards a tap opens
    // the case study instead, so tracing is mouse-only there.)
    if (!arch.closest('[data-card-href]')) {
      arch.addEventListener('click', function (e) {
        var node = e.target.closest('.arch-node');
        if (node) trace(node);
      });
      document.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'touch' && !arch.contains(e.target)) clearTrace();
      });
    }
    if ('ResizeObserver' in window) new ResizeObserver(draw).observe(arch);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  });

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
        // Only the number counts (units and prefixes are separate spans, so they keep their styling).
        var num = entry.target.querySelector('[data-num]');
        if (!num) return;
        var value = num.textContent;
        var target = parseFloat(value);
        var decimals = (value.split('.')[1] || '').length;
        var start = performance.now();
        var step = function (now) {
          var t = Math.min(1, (now - start) / 1200);
          var eased = 1 - Math.pow(1 - t, 4);
          num.textContent = t < 1 ? (target * eased).toFixed(decimals) : value;
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
})();
