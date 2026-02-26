/* ============================================================
   BILAN AMOS — ANIMATIONS PROFESSIONNELLES
   Maxime Gonthier · 2025-2026
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. CURSEUR PERSONNALISÉ — BALLE DE TENNIS
     ============================================================ */
  (function initCursor() {
    // Ne pas activer sur mobile/tablette
    if (window.matchMedia('(hover: none)').matches) return;

    // Injecter les styles du curseur
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }

      #tennis-cursor {
        position: fixed;
        top: 0; left: 0;
        width: 28px; height: 28px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 32%, #F0E44A, #C9B800 60%, #A89500);
        pointer-events: none;
        z-index: 999999;
        transform: translate(-50%, -50%);
        will-change: transform;
        box-shadow: 0 2px 10px rgba(0,0,0,0.55), inset 0 -1px 3px rgba(0,0,0,0.2);
        transition: width 0.18s ease, height 0.18s ease, opacity 0.2s ease;
        opacity: 0;
      }

      /* Coutures */
      #tennis-cursor::before {
        content: '';
        position: absolute; inset: 0; border-radius: 50%;
        border: 1.8px solid rgba(255,255,255,0.55);
        clip-path: ellipse(50% 18% at 50% 50%);
        transform: rotate(0deg);
        animation: cursorSeam1 0.5s linear infinite paused;
      }
      #tennis-cursor::after {
        content: '';
        position: absolute; inset: 0; border-radius: 50%;
        border: 1.8px solid rgba(255,255,255,0.40);
        clip-path: ellipse(18% 50% at 50% 50%);
        animation: cursorSeam2 0.5s linear infinite paused;
      }
      #tennis-cursor.moving::before { animation-play-state: running; }
      #tennis-cursor.moving::after  { animation-play-state: running; }

      /* Agrandissement au hover d'éléments cliquables */
      #tennis-cursor.cursor-hover {
        width: 42px; height: 42px;
        background: radial-gradient(circle at 35% 32%, #F0E44A, #C9B800 60%, #A89500);
        box-shadow: 0 0 18px rgba(200,90,27,0.55), 0 2px 10px rgba(0,0,0,0.5);
      }

      /* Effet click */
      #tennis-cursor.cursor-click {
        width: 18px; height: 18px;
        box-shadow: 0 0 22px rgba(223,207,32,0.9), 0 0 8px rgba(200,90,27,0.7);
      }

      /* Traînée */
      .cursor-trail {
        position: fixed;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, rgba(240,228,74,0.55), rgba(200,90,27,0.2));
        pointer-events: none;
        z-index: 999990;
        transform: translate(-50%, -50%);
        will-change: transform, opacity;
      }

      @keyframes cursorSeam1 {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes cursorSeam2 {
        from { transform: rotate(0deg); }
        to   { transform: rotate(-360deg); }
      }

      @keyframes trailFade {
        from { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
        to   { opacity: 0;   transform: translate(-50%, -50%) scale(0.2); }
      }
    `;
    document.head.appendChild(style);

    // Créer le curseur
    const cursor = document.createElement('div');
    cursor.id = 'tennis-cursor';
    document.body.appendChild(cursor);

    // Spring physics pour le curseur
    let mouseX = -100, mouseY = -100;
    let curX = -100, curY = -100;
    let vx = 0, vy = 0;
    const stiffness = 0.22;
    const damping   = 0.72;
    let movingTimer  = null;
    let isFirstMove  = true;

    // Pool de traînées
    const TRAIL_COUNT = 6;
    const trails = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const t = document.createElement('div');
      t.className = 'cursor-trail';
      const size = 8 - i * 0.8;
      t.style.cssText = `width:${size}px;height:${size}px;opacity:0;`;
      document.body.appendChild(t);
      trails.push({ el: t, x: -100, y: -100 });
    }

    function animateCursor() {
      const dx = mouseX - curX;
      const dy = mouseY - curY;
      vx = vx * damping + dx * stiffness;
      vy = vy * damping + dy * stiffness;
      curX += vx;
      curY += vy;

      cursor.style.left = curX + 'px';
      cursor.style.top  = curY + 'px';

      // Traînée avec décalage progressif
      for (let i = TRAIL_COUNT - 1; i > 0; i--) {
        trails[i].x = trails[i - 1].x;
        trails[i].y = trails[i - 1].y;
        const delay = (TRAIL_COUNT - i) * 0.03;
        trails[i].el.style.left    = trails[i].x + 'px';
        trails[i].el.style.top     = trails[i].y + 'px';
        trails[i].el.style.opacity = (0.35 * (1 - i / TRAIL_COUNT)).toFixed(2);
        trails[i].el.style.transitionDelay = delay + 's';
      }
      trails[0].x = curX;
      trails[0].y = curY;
      trails[0].el.style.left = curX + 'px';
      trails[0].el.style.top  = curY + 'px';

      requestAnimationFrame(animateCursor);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (isFirstMove) {
        curX = mouseX; curY = mouseY;
        cursor.style.opacity = '1';
        isFirstMove = false;
      }

      cursor.classList.add('moving');
      clearTimeout(movingTimer);
      movingTimer = setTimeout(() => cursor.classList.remove('moving'), 120);
    });

    // Hover sur liens/boutons
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('a, button, .btn, .card, .comp-card, .interview-card, .nav-links li, .contact-link-card, [data-cursor-hover]');
      if (t) cursor.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
      const t = e.target.closest('a, button, .btn, .card, .comp-card, .interview-card, .nav-links li, .contact-link-card, [data-cursor-hover]');
      if (t) cursor.classList.remove('cursor-hover');
    });

    // Click effect
    document.addEventListener('mousedown', () => {
      cursor.classList.add('cursor-click');
      spawnClickRipple(curX, curY);
    });
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('cursor-click');
    });

    animateCursor();
  })();


  /* ============================================================
     2. TRANSITION DE PAGE — BALLE QUI TRAVERSE L'ÉCRAN
     ============================================================ */
  (function initPageTransition() {
    const style = document.createElement('style');
    style.textContent = `
      #page-transition-overlay {
        position: fixed;
        inset: 0;
        z-index: 99998;
        pointer-events: none;
        overflow: hidden;
      }

      #pt-ball {
        position: absolute;
        width: 70px; height: 70px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 32%, #F0E44A, #C9B800 60%, #A89500);
        box-shadow: 0 4px 20px rgba(0,0,0,0.6);
        top: 50%;
        left: -100px;
        transform: translateY(-50%);
        opacity: 0;
      }
      #pt-ball::before {
        content: '';
        position: absolute; inset: 0; border-radius: 50%;
        border: 2.5px solid rgba(255,255,255,0.5);
        clip-path: ellipse(50% 20% at 50% 50%);
      }
      #pt-ball::after {
        content: '';
        position: absolute; inset: 0; border-radius: 50%;
        border: 2.5px solid rgba(255,255,255,0.35);
        clip-path: ellipse(20% 50% at 50% 50%);
      }

      #pt-wipe {
        position: absolute;
        top: 0; bottom: 0; left: -105%;
        width: 100%;
        background: linear-gradient(135deg, #0F0F0F 0%, #1B4D1C 50%, #C85A1B 100%);
        opacity: 0;
      }

      /* Animation OUT */
      @keyframes pt-ball-out {
        0%   { left: -100px; opacity: 0; transform: translateY(-50%) rotate(0deg); }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { left: calc(100vw + 100px); opacity: 0; transform: translateY(-50%) rotate(1440deg); }
      }
      @keyframes pt-wipe-in {
        0%   { left: -105%; opacity: 0.85; }
        100% { left: 0%;    opacity: 0.95; }
      }
      @keyframes pt-wipe-out {
        0%   { left: 0%; opacity: 0.95; }
        100% { left: 105%; opacity: 0; }
      }

      /* Page IN animation */
      @keyframes page-fade-in {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .page-enter-animation {
        animation: page-fade-in 0.55s cubic-bezier(0.4,0,0.2,1) forwards;
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.innerHTML = `<div id="pt-wipe"></div><div id="pt-ball"></div>`;
    document.body.appendChild(overlay);

    const ptBall = document.getElementById('pt-ball');
    const ptWipe = document.getElementById('pt-wipe');

    function runTransition(href) {
      // Bloquer les clics pendant la transition
      overlay.style.pointerEvents = 'all';

      // Phase 1 : wipe + balle
      ptWipe.style.animation = 'none';
      ptBall.style.animation = 'none';
      void ptBall.offsetWidth;

      ptWipe.style.animation = 'pt-wipe-in 0.45s cubic-bezier(0.4,0,0.2,1) forwards';
      ptBall.style.animation = 'pt-ball-out 0.7s cubic-bezier(0.2,0,0.5,1) forwards';

      setTimeout(() => {
        window.location.href = href;
      }, 420);
    }

    // Intercepter les clics internes
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('http') || link.getAttribute('target') === '_blank') return;
      e.preventDefault();
      runTransition(href);
    });

    // Animation d'entrée sur la page courante
    const mainContent = document.querySelector('.page-content, .hero') ||
                        document.querySelector('main') ||
                        document.body;
    ptWipe.style.animation = 'pt-wipe-out 0.5s 0.05s cubic-bezier(0.4,0,0.2,1) forwards';
    ptWipe.style.left = '0%';
    ptWipe.style.opacity = '0.95';

    if (mainContent) {
      mainContent.style.opacity = '0';
      setTimeout(() => {
        mainContent.style.opacity = '';
        mainContent.classList.add('page-enter-animation');
        setTimeout(() => mainContent.classList.remove('page-enter-animation'), 600);
      }, 80);
    }
  })();


  /* ============================================================
     3. BARRE DE PROGRESSION AU SCROLL
     ============================================================ */
  (function initScrollProgress() {
    const style = document.createElement('style');
    style.textContent = `
      #scroll-progress {
        position: fixed;
        top: 0; left: 0;
        height: 3px;
        width: 0%;
        background: linear-gradient(90deg, var(--clay, #C85A1B), #DFCF20, var(--clay, #C85A1B));
        background-size: 200% 100%;
        z-index: 10001;
        transition: width 0.1s linear;
        animation: shimmerBar 2.5s linear infinite;
      }
      @keyframes shimmerBar {
        0%   { background-position: 0% 0%; }
        100% { background-position: 200% 0%; }
      }
      /* Petite balle au bout de la barre */
      #scroll-progress::after {
        content: '';
        position: absolute;
        right: -7px; top: 50%;
        width: 14px; height: 14px;
        transform: translateY(-50%);
        border-radius: 50%;
        background: radial-gradient(circle at 35% 32%, #F0E44A, #C9B800);
        box-shadow: 0 0 8px rgba(223,207,32,0.9), 0 2px 6px rgba(0,0,0,0.5);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);

    function updateBar() {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateBar, { passive: true });
  })();


  /* ============================================================
     4. COMPTEURS ANIMÉS (pour les stats chiffrées)
     ============================================================ */
  (function initCounters() {
    const style = document.createElement('style');
    style.textContent = `
      [data-count] {
        display: inline-block;
        transition: transform 0.1s ease;
      }
      [data-count].counting {
        color: var(--clay, #C85A1B);
      }
    `;
    document.head.appendChild(style);

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function animateCount(el, target, suffix) {
      const duration = 1800;
      const start    = performance.now();
      el.classList.add('counting');

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value    = Math.round(easeOut(progress) * target);
        el.textContent = value + (suffix || '');
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + (suffix || '');
          el.classList.remove('counting');
        }
      }
      requestAnimationFrame(step);
    }

    // Détecter les éléments avec data-count, ou chercher les grands chiffres dans les sections stats
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (!isNaN(target)) {
          animateCount(el, target, suffix);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.6 });

    document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));

    // Auto-détection : grands chiffres dans .score-num et blocs stats (Bebas Neue, grand texte)
    function autoDetectNumbers() {
      // Chercher dans les synthèse stats (font Bebas Neue, grande taille)
      document.querySelectorAll('.synthese-grid, .score-board, [class*="score"]').forEach(parent => {
        parent.querySelectorAll('div, span').forEach(el => {
          if (el.children.length > 0) return;
          const text = el.textContent.trim();
          const match = text.match(/^(\d+)(.*)$/);
          if (match && parseInt(match[1]) > 1) {
            el.dataset.count  = match[1];
            el.dataset.suffix = match[2];
            el.textContent = '0' + match[2];
            obs.observe(el);
          }
        });
      });
    }
    // Lancer après le chargement complet
    if (document.readyState === 'complete') autoDetectNumbers();
    else window.addEventListener('load', autoDetectNumbers);
  })();


  /* ============================================================
     5. TILT 3D DES CARTES AU HOVER
     ============================================================ */
  (function initCardTilt() {
    const style = document.createElement('style');
    style.textContent = `
      .card, .comp-card, .interview-card, .contact-link-card {
        transform-style: preserve-3d;
        will-change: transform;
        transition: transform 0.15s ease, box-shadow 0.15s ease !important;
      }
    `;
    document.head.appendChild(style);

    function applyTilt(el, e) {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const rx     = ((e.clientY - cy) / (rect.height / 2)) * -7;
      const ry     = ((e.clientX - cx) / (rect.width  / 2)) *  7;
      const dist   = Math.hypot(e.clientX - cx, e.clientY - cy);
      const glow   = Math.max(0, 1 - dist / (Math.max(rect.width, rect.height) * 0.7));
      el.style.transform   = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.025)`;
      el.style.boxShadow   = `0 ${8 + glow * 12}px ${20 + glow * 20}px rgba(200,90,27,${0.12 + glow * 0.22})`;
      el.style.zIndex      = '2';
    }

    function resetTilt(el) {
      el.style.transform  = '';
      el.style.boxShadow  = '';
      el.style.zIndex     = '';
    }

    function bindTilt(selector) {
      document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mousemove',  e => applyTilt(el, e));
        el.addEventListener('mouseleave', () => resetTilt(el));
      });
    }

    function init() {
      bindTilt('.card, .comp-card, .interview-card, .contact-link-card');
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  })();


  /* ============================================================
     6. BOUTONS MAGNÉTIQUES
     ============================================================ */
  (function initMagneticButtons() {
    if (window.matchMedia('(hover: none)').matches) return;

    const style = document.createElement('style');
    style.textContent = `
      .btn { will-change: transform; }
    `;
    document.head.appendChild(style);

    function bind() {
      document.querySelectorAll('.btn, .btn-clay, .btn-primary, .btn-outline').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const cx   = rect.left + rect.width  / 2;
          const cy   = rect.top  + rect.height / 2;
          const dx   = (e.clientX - cx) * 0.28;
          const dy   = (e.clientY - cy) * 0.28;
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
          btn.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
          setTimeout(() => { btn.style.transition = ''; }, 400);
        });
      });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
    else bind();
  })();


  /* ============================================================
     7. RIPPLE AU CLICK SUR LES BOUTONS
     ============================================================ */
  (function initRipple() {
    const style = document.createElement('style');
    style.textContent = `
      .btn { position: relative; overflow: hidden; }
      .ripple-wave {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        background: rgba(255,255,255,0.3);
        pointer-events: none;
        animation: rippleAnim 0.55s linear forwards;
      }
      @keyframes rippleAnim {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn, button');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top  - size / 2}px;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  })();


  /* ============================================================
     8. RIPPLE CLICK CURSEUR — EXPLOSION DE PETITES BALLES
     ============================================================ */
  function spawnClickRipple(x, y) {
    const style = document.getElementById('click-ripple-style');
    if (!style) {
      const s = document.createElement('style');
      s.id = 'click-ripple-style';
      s.textContent = `
        .click-spark {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 999995;
          background: radial-gradient(circle at 35% 35%, #F0E44A, #C9B800);
          will-change: transform, opacity;
        }
        @keyframes sparkFly {
          0%   { transform: translate(0,0) scale(1); opacity: 0.9; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
      `;
      document.head.appendChild(s);
    }

    const count  = 7;
    const spread = 55;
    for (let i = 0; i < count; i++) {
      const angle   = (i / count) * Math.PI * 2;
      const dist    = spread * (0.5 + Math.random() * 0.5);
      const dx      = Math.cos(angle) * dist;
      const dy      = Math.sin(angle) * dist;
      const size    = 5 + Math.random() * 6;
      const spark   = document.createElement('div');
      spark.className = 'click-spark';
      spark.style.cssText = `
        width:${size}px; height:${size}px;
        left:${x}px; top:${y}px;
        --dx: ${dx}px; --dy: ${dy}px;
        margin-left:-${size/2}px; margin-top:-${size/2}px;
        animation: sparkFly ${0.38 + Math.random() * 0.18}s ease-out forwards;
      `;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    }
  }
  // Rendre accessible globalement pour l'init curseur
  window._spawnClickRipple = spawnClickRipple;


  /* ============================================================
     9. PARALLAX HERO — MOUVEMENT DE PROFONDEUR
     ============================================================ */
  (function initParallax() {
    if (window.matchMedia('(hover: none)').matches) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const layers = hero.querySelectorAll('.hero-bg, .court-overlay, .deco-ball');

    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const nx = (e.clientX - cx) / cx; // -1 à 1
      const ny = (e.clientY - cy) / cy;

      layers.forEach((layer, i) => {
        const depth = (i + 1) * 0.4;
        const tx    = nx * depth * 8;
        const ty    = ny * depth * 5;
        layer.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    });
  })();


  /* ============================================================
     10. NAVBAR — COMPORTEMENT AU SCROLL (hide/show)
     ============================================================ */
  (function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const style = document.createElement('style');
    style.textContent = `
      .navbar {
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1),
                    background 0.35s ease,
                    box-shadow 0.35s ease !important;
      }
      .navbar.nav-hidden {
        transform: translateY(-100%);
      }
      .navbar.nav-scrolled {
        background: rgba(8,8,8,0.97) !important;
        box-shadow: 0 4px 30px rgba(200,90,27,0.2);
      }
    `;
    document.head.appendChild(style);

    let lastScroll = 0;
    let ticking    = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const cur = window.scrollY;
          if (cur > lastScroll + 8 && cur > 120) {
            navbar.classList.add('nav-hidden');
          } else if (cur < lastScroll - 8) {
            navbar.classList.remove('nav-hidden');
          }
          navbar.classList.toggle('nav-scrolled', cur > 60);
          lastScroll = cur;
          ticking    = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();


  /* ============================================================
     11. BOUNCE BALLE DÉCORATIVE EN PAGE D'ACCUEIL
         Petite balle qui rebondit dans un coin discret
     ============================================================ */
  (function initBounceBall() {
    // Uniquement sur la home (hero présent)
    if (!document.querySelector('.hero')) return;

    const style = document.createElement('style');
    style.textContent = `
      #bounce-corner-ball {
        position: fixed;
        bottom: 28px; right: 28px;
        width: 22px; height: 22px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 32%, #F0E44A, #C9B800);
        box-shadow: 0 3px 10px rgba(0,0,0,0.5);
        z-index: 9990;
        pointer-events: none;
        animation: bounceBall 1.4s cubic-bezier(0.36,0,0.66,-0.56) infinite alternate;
        opacity: 0.7;
      }
      #bounce-corner-ball::before {
        content: '';
        position: absolute; inset: 0; border-radius: 50%;
        border: 1.5px solid rgba(255,255,255,0.45);
        clip-path: ellipse(50% 20% at 50% 50%);
      }
      #bounce-shadow {
        position: fixed;
        bottom: 22px; right: 33px;
        width: 14px; height: 4px;
        border-radius: 50%;
        background: rgba(0,0,0,0.35);
        z-index: 9989;
        pointer-events: none;
        animation: bounceShadow 1.4s cubic-bezier(0.36,0,0.66,-0.56) infinite alternate;
      }
      @keyframes bounceBall {
        from { transform: translateY(0px) scaleX(1) scaleY(1); }
        to   { transform: translateY(-28px) scaleX(0.95) scaleY(1.05); }
      }
      @keyframes bounceShadow {
        from { transform: scaleX(1); opacity: 0.35; }
        to   { transform: scaleX(0.55); opacity: 0.12; }
      }
    `;
    document.head.appendChild(style);

    const ball   = document.createElement('div'); ball.id   = 'bounce-corner-ball';
    const shadow = document.createElement('div'); shadow.id = 'bounce-shadow';
    document.body.appendChild(shadow);
    document.body.appendChild(ball);
  })();


  /* ============================================================
     12. SMOOTH REVEAL AMÉLIORÉ — stagger sur les grilles
     ============================================================ */
  (function enhanceReveal() {
    const style = document.createElement('style');
    style.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1),
                    transform 0.6s cubic-bezier(0.4,0,0.2,1);
      }
      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }
      /* Stagger dans les grilles */
      .card-grid .reveal:nth-child(1), .card-grid-3 .reveal:nth-child(1) { transition-delay: 0ms; }
      .card-grid .reveal:nth-child(2), .card-grid-3 .reveal:nth-child(2) { transition-delay: 80ms; }
      .card-grid .reveal:nth-child(3), .card-grid-3 .reveal:nth-child(3) { transition-delay: 160ms; }
      .card-grid .reveal:nth-child(4), .card-grid-3 .reveal:nth-child(4) { transition-delay: 240ms; }
      .card-grid .reveal:nth-child(5), .card-grid-3 .reveal:nth-child(5) { transition-delay: 320ms; }
      .card-grid .reveal:nth-child(6), .card-grid-3 .reveal:nth-child(6) { transition-delay: 400ms; }
    `;
    document.head.appendChild(style);
  })();


  /* ============================================================
     13. TOOLTIP BALLE SUR LES LIENS DE NAV
     ============================================================ */
  (function initNavBallTooltip() {
    const style = document.createElement('style');
    style.textContent = `
      .nav-links li { position: relative; }
      .nav-ball-indicator {
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%) scale(0);
        width: 8px; height: 8px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 32%, #F0E44A, #C9B800);
        transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        pointer-events: none;
      }
      .nav-links li:hover .nav-ball-indicator,
      .nav-links li:has(.active) .nav-ball-indicator {
        transform: translateX(-50%) scale(1);
      }
    `;
    document.head.appendChild(style);

    function init() {
      document.querySelectorAll('.nav-links li').forEach(li => {
        const ind = document.createElement('div');
        ind.className = 'nav-ball-indicator';
        li.appendChild(ind);
      });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  })();

})();
