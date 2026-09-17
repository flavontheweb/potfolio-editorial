/* ==========================================================================
   Portfolio Flavien Gaujard — chorégraphie motion
   GSAP + Lenis, patterns vérifiés (skill editorial-portfolio-design)
   ========================================================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => gsap.utils.toArray(sel, root);

/* --------------------------------------------------------------------------
   Horloge locale (méta layer) — indépendante du motion
   -------------------------------------------------------------------------- */

function initClock() {
  const el = $('[data-clock]');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  });
  const tick = () => (el.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 30_000);
}

function initAccordions() {
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  $$('.xp-details, .edu-details').forEach((details) => {
    const summary = $('summary', details);
    const body = $('.xp-body, .edu-body', details);
    if (!summary || !body) return;

    let closeTimer;

    const syncMode = () => {
      window.clearTimeout(closeTimer);
      details.classList.remove('is-closing');
      details.open = mobileQuery.matches;
    };

    syncMode();
    mobileQuery.addEventListener('change', syncMode);

    summary.addEventListener('click', (event) => {
      if (mobileQuery.matches) {
        event.preventDefault();
        return;
      }

      if (details.classList.contains('is-closing')) {
        event.preventDefault();
        return;
      }

      if (!details.open) return;

      event.preventDefault();
      details.classList.add('is-closing');

      const finishClosing = () => {
        window.clearTimeout(closeTimer);
        body.removeEventListener('transitionend', onTransitionEnd);
        details.open = false;
        details.classList.remove('is-closing');
      };

      const onTransitionEnd = (transitionEvent) => {
        if (transitionEvent.propertyName === 'max-height') finishClosing();
      };

      body.addEventListener('transitionend', onTransitionEnd);
      closeTimer = window.setTimeout(finishClosing, 500);
    });
  });
}

/* --------------------------------------------------------------------------
   Loader rideau — première visite uniquement, ≤ 2 s
   -------------------------------------------------------------------------- */

const VISITED_KEY = 'fg-visited';

function playLoader(onComplete) {
  const loader = $('[data-loader]');
  const chars = $$('[data-loader-char]');
  const meta = $('[data-loader-meta]');
  const curve = $('[data-loader-curve]');

  const tl = gsap.timeline({ onComplete });

  // Monogramme « slot machine » dans colonnes masquées
  tl.from(chars, {
    yPercent: 110,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.08,
  })
    .from(meta, { opacity: 0, y: 8, duration: 0.4, ease: 'power2.out' }, '-=0.2')
    .to({}, { duration: 0.35 }) // temps de lecture
    // Levée du rideau : le bord bas se courbe (scaleY → 0, origin top)
    .to(loader, { y: '-100vh', duration: 0.85, ease: 'power4.inOut' })
    .to(curve, { scaleY: 0, duration: 0.85, ease: 'power4.inOut' }, '<')
    .set(loader, { display: 'none' });

  return tl;
}

/* --------------------------------------------------------------------------
   Reveals d'entrée (héros) — après le loader
   -------------------------------------------------------------------------- */

function playIntro() {
  document.body.dataset.loadState = 'ready';

  const tl = gsap.timeline();
  tl.from('[data-hero-line]', {
    yPercent: 110,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.08,
  }).from(
    '.hero [data-reveal]',
    {
      opacity: 0,
      y: 14,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.06,
      clearProps: 'all',
    },
    '-=0.6',
  );
  return tl;
}

function playMobileIntro() {
  const heroLine = $('[data-hero-line]');
  const heroReveals = $$('.hero [data-reveal]');

  gsap.set(heroLine, { yPercent: 110 });
  gsap.set(heroReveals, { opacity: 0, y: 14 });
  document.body.dataset.loadState = 'ready';

  const tl = gsap.timeline();
  tl.to(heroLine, {
    yPercent: 0,
    duration: 1.1,
    ease: 'power3.out',
  }).to(
    heroReveals,
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.06,
      clearProps: 'opacity,transform',
    },
    '-=0.6',
  );
  return tl;
}

/* --------------------------------------------------------------------------
  Menu overlay — volets en cascade, sans déplacer la page
  -------------------------------------------------------------------------- */

function createMenu({ lenis, reduced }) {
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const burgerLines = $$('span', toggle);
  const panels = $$('[data-menu-panel]', menu);
  const content = $('[data-menu-content]', menu);
  const labels = $$('[data-menu-label]');
  const metaBlocks = $$('.menu__meta > div');
  if (!toggle || !menu || !content || !panels.length) return { close: () => {} };

  // Evite les doubles listeners si init est relance (HMR/navigation client).
  menu.__menuAbortController?.abort();
  const listeners = new AbortController();
  menu.__menuAbortController = listeners;

  let open = false;
  let activeTl = null;
  let pendingCloseCallbacks = [];

  gsap.set(menu, { autoAlpha: 0 });
  gsap.set(burgerLines, {
    y: 0,
    rotation: 0,
    width: (i) => (i === 0 ? 28 : 18),
  });
  gsap.set(panels, {
    xPercent: (i) => 118 + i * 7,
    rotateY: -9,
    scale: 0.96,
    transformOrigin: 'right center',
  });
  gsap.set(content, { opacity: 0, y: 18 });
  gsap.set(labels, { yPercent: 110 });
  gsap.set(metaBlocks, { opacity: 0, y: 12 });

  const flushCloseCallbacks = () => {
    const callbacks = pendingCloseCallbacks;
    pendingCloseCallbacks = [];
    callbacks.forEach((cb) => cb());
  };

  const stopActiveTimeline = () => {
    if (!activeTl) return;
    activeTl.kill();
    activeTl = null;
  };

  const animateBurger = (isOpen) => {
    gsap.killTweensOf(burgerLines);
    const duration = reduced ? 0.01 : 0.36;
    gsap.to(burgerLines[0], {
      y: isOpen ? 4 : 0,
      rotation: isOpen ? 45 : 0,
      width: 28,
      duration,
      ease: 'power2.out',
      overwrite: true,
    });
    gsap.to(burgerLines[1], {
      y: isOpen ? -3.5 : 0,
      rotation: isOpen ? -45 : 0,
      width: isOpen ? 28 : 18,
      duration,
      ease: 'power2.out',
      overwrite: true,
    });
  };

  const lockScroll = () => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  const playOpen = () => {
    stopActiveTimeline();
    delete menu.dataset.closing;
    menu.setAttribute('aria-hidden', 'false');
    gsap.set(menu, { autoAlpha: 1 });
    gsap.set(panels, {
      xPercent: (i) => 118 + i * 7,
      rotateY: -9,
      scale: 0.96,
    });
    gsap.set(content, { opacity: 0, y: 18 });
    gsap.set(labels, { yPercent: 110 });
    gsap.set(metaBlocks, { opacity: 0, y: 12 });

    activeTl = gsap.timeline({ onComplete: () => (activeTl = null) });
    activeTl
      .to(panels, {
        xPercent: 0,
        rotateY: 0,
        scale: 1,
        duration: reduced ? 0.5 : 0.86,
        ease: 'expo.out',
        stagger: { each: reduced ? 0.07 : 0.13, from: 'start' },
      })
      .to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0.22 : 0.38,
          ease: 'power2.out',
        },
        reduced ? 0.2 : 0.44,
      )
      .to(
        labels,
        {
          yPercent: 0,
          duration: reduced ? 0.28 : 0.56,
          ease: 'power3.out',
          stagger: 0.045,
        },
        reduced ? 0.22 : 0.5,
      )
      .to(
        metaBlocks,
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0.24 : 0.48,
          ease: 'power2.out',
          stagger: 0.05,
        },
        reduced ? 0.26 : 0.56,
      );
  };

  const playClose = () => {
    stopActiveTimeline();
    menu.dataset.closing = 'true';

    activeTl = gsap.timeline({
      onComplete: () => {
        delete menu.dataset.closing;
        menu.setAttribute('aria-hidden', 'true');
        gsap.set(menu, { autoAlpha: 0 });
        gsap.set(panels, {
          xPercent: (i) => 118 + i * 7,
          rotateY: -9,
          scale: 0.96,
        });
        gsap.set(content, { clearProps: 'opacity,transform' });
        gsap.set(labels, { clearProps: 'transform' });
        gsap.set(metaBlocks, { clearProps: 'opacity,transform' });
        unlockScroll();
        ScrollTrigger.refresh();
        activeTl = null;
        flushCloseCallbacks();
      },
    });

    activeTl
      .to(content, {
        opacity: 0,
        y: 10,
        duration: reduced ? 0.2 : 0.28,
        ease: 'power1.in',
      })
      .to(
        panels,
        {
          xPercent: (i) => 118 + i * 7,
          rotateY: -9,
          scale: 0.96,
          duration: reduced ? 0.42 : 0.68,
          ease: 'expo.in',
          stagger: { each: reduced ? 0.07 : 0.12, from: 'end' },
        },
        0.04,
      )
      .set(panels, {
        xPercent: (i) => 118 + i * 7,
        rotateY: -9,
        scale: 0.96,
      });
  };

  const setState = (next, { onClosed, force = false } = {}) => {
    if (typeof onClosed === 'function') pendingCloseCallbacks.push(onClosed);

    if (activeTl && !force) return;

    if (next === open) {
      if (!open) flushCloseCallbacks();
      return;
    }

    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    animateBurger(open);
    if (open) {
      lockScroll();
      lenis?.stop();
      playOpen();
    } else {
      lenis?.start();
      playClose();
    }
  };

  toggle.addEventListener('click', () => setState(!open, { force: true }), {
    signal: listeners.signal,
  });
  const hoverQuery = window.matchMedia('(hover: hover)');
  toggle.addEventListener(
    'pointerenter',
    () => {
      if (hoverQuery.matches && !open)
        gsap.to(burgerLines[1], { width: 28, duration: 0.25, ease: 'power2.out' });
    },
    { signal: listeners.signal },
  );
  toggle.addEventListener(
    'pointerleave',
    () => {
      if (hoverQuery.matches && !open)
        gsap.to(burgerLines[1], { width: 18, duration: 0.25, ease: 'power2.out' });
    },
    { signal: listeners.signal },
  );
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && open) setState(false);
    },
    { signal: listeners.signal },
  );

  return {
    close: (onClosed) => {
      if (!open) {
        if (typeof onClosed === 'function') onClosed();
        return;
      }
      setState(false, { onClosed, force: true });
    },
    isOpen: () => open,
    destroy: () => {
      listeners.abort();
      stopActiveTimeline();
      unlockScroll();
    },
  };
}

/* --------------------------------------------------------------------------
   Transition « panneau rouille » — la seule grande surface d'accent
   -------------------------------------------------------------------------- */

function createTransition({ lenis, reduced }) {
  const wrapper = $('[data-transition]');
  const panel = $('[data-transition-panel]');
  let running = false;

  const jumpTo = (target) => {
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else target.scrollIntoView();
  };

  return (target) => {
    if (reduced || !wrapper || !panel) {
      target.scrollIntoView();
      return;
    }
    if (running) return;
    running = true;

    gsap.killTweensOf(panel);

    const tl = gsap.timeline({
      onComplete: () => {
        running = false;
      },
    });
    tl.set(wrapper, { visibility: 'visible' })
      .set(panel, { yPercent: 102 })
      .fromTo(panel, { yPercent: 102 }, { yPercent: 0, duration: 0.45, ease: 'power4.in' })
      .add(() => jumpTo(target))
      .to(panel, {
        yPercent: -102,
        duration: 0.6,
        ease: 'expo.out',
        delay: 0.08,
      })
      .set(wrapper, { visibility: 'hidden' });
  };
}

/* --------------------------------------------------------------------------
   Navigation par ancres
   -------------------------------------------------------------------------- */

function initNavigation({ lenis, menu, transition, reduced }) {
  $$('[data-nav-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();

      const fromMenu = link.dataset.menuLink !== undefined;
      if (fromMenu) {
        // Fermeture du menu puis scroll direct, sans panneau rouille.
        menu.close(() => {
          if (lenis) lenis.scrollTo(target, { duration: 1.1 });
          else target.scrollIntoView();
        });
      } else if (lenis) {
        lenis.scrollTo(target, { duration: 1.1 });
      } else {
        target.scrollIntoView();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Text roll hovers
   -------------------------------------------------------------------------- */

function bindTextRolls() {
  $$('.roll').forEach((el) => {
    const copies = el.querySelectorAll('[data-roll-copy]');
    if (copies.length < 2) return;
    const [a, b] = copies;
    el.addEventListener('mouseenter', () => {
      gsap
        .timeline({ defaults: { duration: 0.28, ease: 'power2.out' } })
        .to(a, { yPercent: -100 }, 0)
        .to(b, { yPercent: -100 }, 0);
    });
    el.addEventListener('mouseleave', () => {
      gsap
        .timeline({ defaults: { duration: 0.28, ease: 'power2.out' } })
        .to(a, { yPercent: 0 }, 0)
        .to(b, { yPercent: 0 }, 0);
    });
  });
}

/* --------------------------------------------------------------------------
   Projects carousel — horizontal, infinite, arrows
   -------------------------------------------------------------------------- */

function initProjectsCarousel({ reduced = false, mobile = false } = {}) {
  const root = $('[data-projects-carousel]');
  const viewport = $('.projects-carousel__viewport', root || document);
  const track = $('[data-projects-track]', root || document);
  const prev = $('[data-projects-prev]', root || document);
  const next = $('[data-projects-next]', root || document);
  if (!root || !viewport || !track || !prev || !next) return;

  if (track.dataset.enhanced === 'true') return;
  track.dataset.enhanced = 'true';

  const originals = Array.from(track.children);
  if (originals.length < 2) return;

  const cloneCount = Math.min(2, originals.length);

  const headClones = originals.slice(-cloneCount).map((el) => {
    const clone = el.cloneNode(true);
    clone.dataset.clone = 'head';
    return clone;
  });

  const tailClones = originals.slice(0, cloneCount).map((el) => {
    const clone = el.cloneNode(true);
    clone.dataset.clone = 'tail';
    return clone;
  });

  const headFrag = document.createDocumentFragment();
  headClones.forEach((clone) => headFrag.appendChild(clone));
  track.prepend(headFrag);

  const tailFrag = document.createDocumentFragment();
  tailClones.forEach((clone) => tailFrag.appendChild(clone));
  track.appendChild(tailFrag);

  const slides = () => Array.from(track.children);

  let index = cloneCount;
  let step = 0;
  let busy = false;
  let autoplay = null;
  let focused = false;
  let visible = false;
  let paused = false;
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  const resetAutoplay = () => {
    if (!autoplay) return;
    autoplay.pause(0);
    if (!busy && !focused && visible && !paused && !document.hidden) {
      autoplay.play();
    }
  };

  const playLeftShadowCycle = (durationMs) => {
    viewport.style.setProperty('--shadow-cycle-duration', `${durationMs}ms`);
    viewport.classList.remove('is-sliding');
    void viewport.offsetWidth;
    viewport.classList.add('is-sliding');
  };

  const measureStep = () => {
    const all = slides();
    if (all.length < 2) return 0;
    const a = all[0].getBoundingClientRect();
    const b = all[1].getBoundingClientRect();
    return Math.abs(b.left - a.left);
  };

  const place = (i) => {
    gsap.set(track, { x: -i * step });
  };

  const updateViewportHeight = (slideIndex = index) => {
    if (!mobileQuery.matches) {
      viewport.style.height = '';
      return;
    }

    const activeSlide = slides()[slideIndex];
    if (activeSlide) viewport.style.height = `${activeSlide.offsetHeight}px`;
  };

  const moveTo = (nextIndex) => {
    resetAutoplay();
    if (busy || step === 0) return;
    busy = true;
    autoplay?.pause(0);
    index = nextIndex;
    updateStepper?.({ animate: mobile });
    const slideDuration = mobile ? 0.28 : reduced ? 0.01 : 0.55;
    if (!mobile) playLeftShadowCycle(Math.round(slideDuration * 1000));
    updateViewportHeight(index);

    gsap.to(track, {
      x: -index * step,
      duration: slideDuration,
      ease: reduced && !mobile ? 'none' : 'power3.out',
      onComplete: () => {
        const total = originals.length;
        const maxRealIndex = total + cloneCount - 1;

        if (index >= total + cloneCount) {
          index = cloneCount;
          place(index);
        } else if (index < cloneCount) {
          index = maxRealIndex;
          place(index);
        }
        updateStepper?.({ animate: false });
        updateViewportHeight(index);
        viewport.classList.remove('is-sliding');
        busy = false;
        resetAutoplay();
      },
    });
  };

  const refresh = () => {
    step = measureStep();
    place(index);
    updateViewportHeight(index);
  };

  refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener('resize', refresh);

  prev.addEventListener('click', () => moveTo(index - 1));
  next.addEventListener('click', () => moveTo(index + 1));

  const timer = $('[data-projects-timer]', root);
  const timerDigits = $$('[data-projects-seconds]', root);
  const pauseButton = $('[data-projects-pause]', root);
  const stepper = $('[data-projects-stepper]', root);
  const stepButtons = $$('[data-projects-step]', root);
  if (!timer || !pauseButton) return;

  const currentRealIndex = () => {
    const total = originals.length;
    return (((index - cloneCount) % total) + total) % total;
  };

  const getStepWidths = () => ({
    active: `${gsap.utils.clamp(32, 48, window.innerWidth * 0.12)}px`,
    idle: `${gsap.utils.clamp(18, 26, window.innerWidth * 0.06)}px`,
  });

  const updateStepper = ({ animate = false } = {}) => {
    const widths = getStepWidths();

    stepButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === currentRealIndex();
      button.setAttribute('aria-current', String(active));

      if (!mobile) return;

      gsap.to(button, {
        width: active ? widths.active : widths.idle,
        flexBasis: active ? widths.active : widths.idle,
        opacity: active ? 1 : 0.72,
        '--step-fill-start': active ? '#e06a38' : '#292320',
        '--step-fill-end': active ? '#c4552a' : '#1c1815',
        '--step-border': active ? '#e06a38' : '#57504a',
        duration: animate ? 0.32 : 0.01,
        ease: animate ? 'power2.out' : 'none',
        overwrite: 'auto',
      });
    });
  };

  stepButtons.forEach((button, buttonIndex) => {
    button.addEventListener('click', () => moveTo(cloneCount + buttonIndex));
  });

  updateStepper();

  if (mobile) {
    timer.hidden = true;
    pauseButton.hidden = true;
    if (stepper) stepper.hidden = false;
    return;
  }

  if (stepper) stepper.hidden = true;
  if (!mobile && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    timer.hidden = true;
    return;
  }

  timer.hidden = false;
  pauseButton.hidden = false;
  const countdown = { remaining: 1 };
  autoplay = gsap.to(countdown, {
    remaining: 0,
    duration: 5,
    ease: 'none',
    paused: true,
    onUpdate: () => {
      timer.style.setProperty('--timer-progress', String(countdown.remaining));
      const seconds = `${String(Math.ceil(countdown.remaining * 5)).padStart(2, '0')}s`;
      timerDigits.forEach((digits) => {
        if (digits.textContent !== seconds) digits.textContent = seconds;
      });
    },
    onComplete: () => moveTo(index + 1),
  });

  viewport.addEventListener('focusin', () => {
    focused = true;
    resetAutoplay();
  });
  viewport.addEventListener('focusout', (event) => {
    focused = viewport.contains(event.relatedTarget);
    resetAutoplay();
  });
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    const label = paused
      ? 'Reprendre le défilement automatique'
      : 'Mettre le défilement automatique en pause';
    pauseButton.setAttribute('aria-label', label);
    pauseButton.title = label;
    $('[data-projects-pause-icon]', pauseButton).textContent = paused ? '▶' : 'Ⅱ';
    resetAutoplay();
  });
  document.addEventListener('visibilitychange', resetAutoplay);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    resetAutoplay();
  });
  observer.observe(viewport);
}

/* --------------------------------------------------------------------------
  Photos — fullscreen image transition
  -------------------------------------------------------------------------- */

function initPhotoLightbox({ reduced = false, lenis = null } = {}) {
  const lightbox = $('[data-photo-lightbox]');
  const lightboxImage = $('[data-photo-lightbox-image]');
  const closeBtn = $('[data-photo-lightbox-close]');

  if (!lightbox || !lightboxImage) return;

  lightbox.__photoAbortController?.abort();
  const listeners = new AbortController();
  lightbox.__photoAbortController = listeners;

  const animateDuration = reduced ? 0.01 : 0.55;
  const closeDuration = reduced ? 0.01 : 0.45;

  let activeImage = null;
  let animating = false;
  let activeRect = null;

  const lockScroll = () => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    lenis?.stop();
  };

  const unlockScroll = () => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    lenis?.start();
  };

  const computeTargetRect = (origin) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ratio =
      origin.naturalWidth && origin.naturalHeight
        ? origin.naturalWidth / origin.naturalHeight
        : origin.clientWidth / Math.max(origin.clientHeight, 1);

    const maxW = vw * 0.9;
    const maxH = vh * 0.86;
    let width = maxW;
    let height = width / ratio;

    if (height > maxH) {
      height = maxH;
      width = height * ratio;
    }

    return {
      left: (vw - width) / 2,
      top: (vh - height) / 2,
      width,
      height,
    };
  };

  const placeCloseButton = (rect) => {
    if (!closeBtn || !rect) return;
    const left = Math.max(12, rect.left + rect.width - 110);
    const top = Math.max(12, rect.top + 14);
    gsap.set(closeBtn, { left, top });
  };

  const openLightbox = (origin) => {
    if (animating || !origin) return;
    animating = true;
    activeImage = origin;

    const from = origin.getBoundingClientRect();
    const to = computeTargetRect(origin);
    activeRect = to;

    lightboxImage.src = origin.dataset.photoLightboxSrc || origin.currentSrc || origin.src;
    lightboxImage.alt = origin.alt;

    gsap.killTweensOf([lightbox, lightboxImage]);

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    origin.style.visibility = 'hidden';
    lockScroll();

    gsap.set(lightbox, { opacity: 0 });
    gsap.set(lightboxImage, {
      position: 'fixed',
      left: from.left,
      top: from.top,
      width: from.width,
      height: from.height,
      borderRadius: 0,
      objectFit: 'cover',
    });

    if (closeBtn) placeCloseButton({ left: from.left, top: from.top, width: from.width });

    const tl = gsap.timeline({
      onComplete: () => {
        animating = false;
      },
    });

    tl.to(lightbox, { opacity: 1, duration: 0.28, ease: 'power2.out' }, 0).to(
      lightboxImage,
      {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        objectFit: 'contain',
        duration: animateDuration,
        ease: reduced ? 'none' : 'expo.out',
      },
      0,
    );

    if (closeBtn) {
      tl.to(
        closeBtn,
        {
          left: Math.max(12, to.left + to.width - 110),
          top: Math.max(12, to.top + 14),
          opacity: 1,
          duration: reduced ? 0.01 : 0.4,
          ease: reduced ? 'none' : 'power2.out',
        },
        0.1,
      );
    }
  };

  const closeLightbox = () => {
    if (animating || !activeImage) return;
    animating = true;

    const to = activeImage.getBoundingClientRect();

    gsap.killTweensOf([lightbox, lightboxImage]);
    gsap.killTweensOf(closeBtn);
    const tl = gsap.timeline({
      onComplete: () => {
        activeImage.style.visibility = '';
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.removeAttribute('src');
        lightboxImage.removeAttribute('alt');
        gsap.set(lightboxImage, { clearProps: 'all' });
        if (closeBtn) gsap.set(closeBtn, { clearProps: 'all' });
        activeImage = null;
        activeRect = null;
        animating = false;
        unlockScroll();
      },
    });

    if (closeBtn) {
      tl.to(
        closeBtn,
        {
          opacity: 0,
          duration: reduced ? 0.01 : 0.18,
          ease: 'power1.out',
        },
        0,
      );
    }

    tl.to(lightboxImage, {
      left: to.left,
      top: to.top,
      width: to.width,
      height: to.height,
      objectFit: 'cover',
      duration: closeDuration,
      ease: reduced ? 'none' : 'power3.inOut',
    }).to(
      lightbox,
      {
        opacity: 0,
        duration: reduced ? 0.01 : 0.22,
        ease: 'power1.out',
      },
      reduced ? 0 : '-=0.18',
    );
  };

  document.addEventListener(
    'click',
    (e) => {
      const trigger = e.target.closest('[data-photo-zoom]');
      if (!trigger) return;
      const img = trigger.querySelector('img');
      if (!img) return;
      openLightbox(img);
    },
    { signal: listeners.signal },
  );

  lightbox.addEventListener(
    'click',
    (e) => {
      if (e.target === lightbox) closeLightbox();
    },
    { signal: listeners.signal },
  );

  closeBtn?.addEventListener('click', closeLightbox, {
    signal: listeners.signal,
  });

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && activeImage) closeLightbox();
    },
    { signal: listeners.signal },
  );

  window.addEventListener(
    'resize',
    () => {
      if (!activeImage || !activeRect || !closeBtn) return;
      const to = computeTargetRect(activeImage);
      activeRect = to;
      gsap.set(lightboxImage, {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
      });
      placeCloseButton(to);
    },
    { signal: listeners.signal },
  );
}

/* --------------------------------------------------------------------------
   Grammaire scroll (calme) : reveals, parallaxe, footer
   -------------------------------------------------------------------------- */

function initScrollMotion() {
  // Sections : fade + lift
  $$('[data-reveal]').forEach((el) => {
    if (el.closest('.hero')) return; // le héros est géré par l'intro
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  // Manifeste : reveal ligne à ligne masqué
  const manifestoLines = $$('[data-manifesto-line]');
  if (manifestoLines.length) {
    gsap.from(manifestoLines, {
      yPercent: 110,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: {
        trigger: '.manifesto',
        start: 'top 70%',
        once: true,
      },
    });
  }

  // Parallaxe héros (±10 %)
  const heroMedia = $('[data-hero-parallax]');
  if (heroMedia) {
    gsap.fromTo(
      heroMedia,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', scrub: 0.6 },
      },
    );
  }

  // Parallaxe médias (galerie) — profondeur clampée 2-14 %
  $$('[data-parallax]').forEach((el) => {
    const depth = gsap.utils.clamp(2, 14, Number(el.dataset.parallaxDepth || 8));
    gsap.fromTo(
      el.querySelector('img'),
      { yPercent: -depth, scale: 1 + depth / 50 },
      {
        yPercent: depth,
        scale: 1 + depth / 50,
        ease: 'none',
        scrollTrigger: { trigger: el, scrub: 0.6 },
      },
    );
  });

  // Footer reveal parallaxe : contenu contre-translaté
  const footerInner = $('[data-footer-inner]');
  if (footerInner) {
    gsap.fromTo(
      footerInner,
      { yPercent: -30 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-footer]',
          start: 'top bottom',
          end: 'top 30%',
          scrub: 0.8,
        },
      },
    );
  }

  // Storytelling : chapitres pinnés, travelling galerie, marquee, drift de fond
  initStackPin();
  initGalleryPin();
  initMarquee();
  initBackgroundDrift();
}

function initMobileReveals() {
  const revealItems = $$('[data-reveal]').filter((el) => !el.closest('.hero'));
  const manifestoLines = $$('[data-manifesto-line]');
  const manifesto = $('.manifesto');
  const stackChapters = $$('[data-stack-chapter]');
  const galleryFrames = $$('[data-gallery-frame]').filter(
    (el) => !el.classList.contains('gallery__frame--end'),
  );

  if (
    !revealItems.length &&
    !manifestoLines.length &&
    !stackChapters.length &&
    !galleryFrames.length
  )
    return;

  gsap.set(revealItems, { opacity: 0, y: 18 });
  gsap.set(manifestoLines, { yPercent: 110 });
  gsap.set(stackChapters, { autoAlpha: 0, y: 24 });
  gsap.set(galleryFrames, {
    autoAlpha: 0,
    y: 18,
    scale: 0.985,
    transformOrigin: 'center center',
  });
  stackChapters.forEach((chapter) => {
    const surfaces = [
      ...chapter.querySelectorAll('[data-stack-panel]'),
      chapter.querySelector('[data-stack-sheet]'),
    ].filter(Boolean);

    gsap.set(chapter.querySelector('[data-stack-title]'), { yPercent: 110 });
    gsap.set(chapter.querySelector('[data-stack-desc]'), { opacity: 0, y: 14 });
    gsap.set(chapter.querySelectorAll('[data-stack-item]'), { opacity: 0, y: 14 });
    gsap.set(surfaces, {
      xPercent: (index) => 118 + index * 7,
      rotateY: -9,
      scale: 0.96,
      transformOrigin: 'right center',
    });
  });

  const reveal = (entries) => {
    const visibleItems = [];
    const visibleGalleryFrames = [];

    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = entry.target;
      observer.unobserve(target);

      if (target.matches('[data-gallery-frame]')) {
        visibleGalleryFrames.push(target);
        return;
      }

      if (target.matches('[data-stack-chapter]')) {
        const surfaces = [
          ...target.querySelectorAll('[data-stack-panel]'),
          target.querySelector('[data-stack-sheet]'),
        ].filter(Boolean);

        gsap
          .timeline()
          .to(target, {
            autoAlpha: 1,
            y: 0,
            duration: 0.48,
            ease: 'power2.out',
            clearProps: 'visibility,opacity,transform',
          })
          .to(
            target.querySelector('[data-stack-title]'),
            {
              yPercent: 0,
              duration: 0.62,
              ease: 'power3.out',
              clearProps: 'transform',
            },
            0.04,
          )
          .to(
            surfaces,
            {
              xPercent: 0,
              rotateY: 0,
              scale: 1,
              duration: 0.72,
              ease: 'expo.out',
              stagger: 0.08,
            },
            0.06,
          )
          .to(
            target.querySelector('[data-stack-desc]'),
            {
              opacity: 1,
              y: 0,
              duration: 0.42,
              ease: 'power2.out',
              clearProps: 'opacity,transform',
            },
            0.2,
          )
          .to(
            target.querySelectorAll('[data-stack-item]'),
            {
              opacity: 1,
              y: 0,
              duration: 0.42,
              ease: 'power2.out',
              stagger: 0.025,
              clearProps: 'opacity,transform',
            },
            0.34,
          );
        return;
      }

      if (target === manifesto) {
        gsap.to(manifestoLines, {
          yPercent: 0,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.06,
          clearProps: 'transform',
        });
        return;
      }

      visibleItems.push(target);
    });

    if (visibleItems.length) {
      gsap.to(visibleItems, {
        opacity: 1,
        y: 0,
        duration: 0.58,
        ease: 'power2.out',
        stagger: 0.045,
        clearProps: 'opacity,transform',
      });
    }

    if (visibleGalleryFrames.length) {
      gsap.to(gsap.utils.shuffle(visibleGalleryFrames), {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.62,
        ease: 'power2.out',
        stagger: { each: 0.04, from: 'random' },
        clearProps: 'visibility,opacity,transform,transformOrigin',
      });
    }
  };

  const observer = new IntersectionObserver(reveal, {
    threshold: 0.18,
    rootMargin: '0px 0px -12% 0px',
  });

  revealItems.forEach((el) => observer.observe(el));
  if (manifesto && manifestoLines.length) observer.observe(manifesto);
  stackChapters.forEach((chapter) => observer.observe(chapter));
  galleryFrames.forEach((frame) => observer.observe(frame));

  return () => observer.disconnect();
}

/* --------------------------------------------------------------------------
   Boîte à outils — chapitres pinnés qui se succèdent au scroll
   -------------------------------------------------------------------------- */

const pad2 = (n) => String(n).padStart(2, '0');

function initStackPin() {
  const section = $('[data-stack]');
  if (!section) return;
  const chapters = $$('[data-stack-chapter]', section);
  if (!chapters.length) return;
  section.dataset.enhanced = '';

  const bar = $('[data-stack-progress]', section);

  // États initiaux : chapitre 1 visible, les suivants cachés
  chapters.forEach((chapter, i) => {
    gsap.set(chapter, { autoAlpha: i === 0 ? 1 : 0 });
  });

  // Entrée du premier chapitre à l'approche de la section (avant le pin)
  const first = chapters[0];
  const firstSurfaces = [
    ...first.querySelectorAll('[data-stack-panel]'),
    first.querySelector('[data-stack-sheet]'),
  ].filter(Boolean);
  gsap
    .timeline({
      scrollTrigger: { trigger: section, start: 'top 65%', once: true },
    })
    .from(firstSurfaces, {
      xPercent: (index) => 118 + index * 7,
      rotateY: -9,
      scale: 0.96,
      transformOrigin: 'right center',
      duration: 0.86,
      ease: 'expo.out',
      stagger: 0.1,
    })
    .from(
      first.querySelector('[data-stack-title]'),
      {
        yPercent: 110,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.62',
    )
    .from(
      first.querySelector('[data-stack-desc]'),
      { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' },
      '-=0.5',
    )
    .from(
      first.querySelectorAll('[data-stack-item]'),
      { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out', stagger: 0.03 },
      '-=0.35',
    );

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=' + chapters.length * 85 + '%',
      pin: true,
      scrub: 0.5,
      onUpdate(self) {
        if (bar)
          gsap.set(bar, {
            scaleX: self.animation?.progress() ?? self.progress,
          });
      },
    },
  });

  chapters.forEach((chapter, i) => {
    const title = chapter.querySelector('[data-stack-title]');
    const desc = chapter.querySelector('[data-stack-desc]');
    const items = chapter.querySelectorAll('[data-stack-item]');
    const surfaces = [
      ...chapter.querySelectorAll('[data-stack-panel]'),
      chapter.querySelector('[data-stack-sheet]'),
    ].filter(Boolean);

    if (i > 0) {
      tl.fromTo(chapter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, i)
        .fromTo(
          surfaces,
          {
            xPercent: (index) => 118 + index * 7,
            rotateY: -9,
            scale: 0.96,
            transformOrigin: 'right center',
          },
          {
            xPercent: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.46,
            ease: 'expo.out',
            stagger: 0.035,
          },
          i + 0.01,
        )
        .fromTo(
          title,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.3, ease: 'power3.out' },
          i + 0.12,
        )
        .fromTo(
          desc,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
          i + 0.18,
        )
        .fromTo(
          items,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.28,
            ease: 'power2.out',
            stagger: 0.018,
          },
          i + 0.28,
        );
    }

    if (i < chapters.length - 1) {
      tl.to(chapter, { autoAlpha: 0, y: -34, duration: 0.22, ease: 'power2.in' }, i + 0.75);
    }
  });
}

/* --------------------------------------------------------------------------
   Galerie — travelling horizontal pinné (la pellicule défile)
   -------------------------------------------------------------------------- */

function initGalleryPin() {
  const section = $('[data-gallery]');
  const track = $('[data-gallery-track]');
  if (!section || !track) return;
  section.dataset.enhanced = '';

  const frames = $$('[data-gallery-frame]', section);
  const current = $('[data-gallery-current]', section);
  const bar = $('[data-gallery-progress]', section);
  const distance = () => Math.max(0, track.offsetWidth - window.innerWidth);

  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + Math.max(distance(), window.innerHeight),
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.animation?.progress() ?? self.progress;
        if (current && frames.length) {
          const idx = Math.min(frames.length - 1, Math.floor(p * frames.length));
          current.textContent = pad2(idx + 1);
        }
        if (bar) gsap.set(bar, { scaleX: p });
      },
    },
  });
}

/* --------------------------------------------------------------------------
   Marquee éditorial — dérive horizontale liée au scroll
   -------------------------------------------------------------------------- */

function initMarquee() {
  $$('[data-marquee-track]').forEach((track) => {
    gsap.fromTo(
      track,
      { x: 0 },
      {
        x: () => -track.scrollWidth * 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: track.closest('.marquee'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

/* --------------------------------------------------------------------------
   Drift d'ambiance — le fond respire entre les chapitres
   -------------------------------------------------------------------------- */

function initBackgroundDrift() {
  const page = $('[data-page]');
  if (!page) return;
  const sections = $$('[data-bg]');
  if (!sections.length) return;

  const defaultColor = '#141110';

  const setBackground = (color) => {
    gsap.to(page, {
      backgroundColor: color || defaultColor,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  sections.forEach((section, index) => {
    const color = section.dataset.bg;
    const prevColor = sections[index - 1]?.dataset.bg || defaultColor;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => setBackground(color),
      onEnterBack: () => setBackground(color),
      onLeaveBack: () => setBackground(prevColor),
    });
  });
}

/* --------------------------------------------------------------------------
   Bootstrap
   -------------------------------------------------------------------------- */

function init() {
  initClock();
  initAccordions();

  const mm = gsap.matchMedia();

  const lockMobileViewportHeight = () => {
    const root = document.documentElement;
    const updateHeight = () => {
      root.style.setProperty('--mobile-viewport-height', `${window.innerHeight}px`);
    };

    updateHeight();
    screen.orientation?.addEventListener('change', updateHeight);

    return () => {
      screen.orientation?.removeEventListener('change', updateHeight);
      root.style.removeProperty('--mobile-viewport-height');
    };
  };

  const initStaticExperience = () => {
    document.body.dataset.loadState = 'ready';
    $('[data-loader]')?.remove();
    const menu = createMenu({ lenis: null, reduced: true });
    const transition = createTransition({ lenis: null, reduced: true });
    initNavigation({ lenis: null, menu, transition, reduced: true });
    initProjectsCarousel({ reduced: true });
    initPhotoLightbox({ reduced: true, lenis: null });
  };

  const initMobileExperience = () => {
    $('[data-loader]')?.remove();
    const menu = createMenu({ lenis: null, reduced: false });
    const transition = createTransition({ lenis: null, reduced: true });
    initNavigation({ lenis: null, menu, transition, reduced: true });
    bindTextRolls();
    initProjectsCarousel({ reduced: true, mobile: true });
    initPhotoLightbox({ reduced: false, lenis: null });
    playMobileIntro();
    const cleanupReveals = initMobileReveals();

    return () => {
      cleanupReveals?.();
      menu.destroy();
    };
  };

  // Mode reduced motion desktop : contenu statique, pas de smooth scroll ni loader
  mm.add('(min-width: 768px) and (prefers-reduced-motion: reduce)', () => {
    initStaticExperience();
  });

  // Mobile : interactions conservées, effets de scroll et smooth scroll désactivés.
  mm.add('(max-width: 767px)', () => {
    return initMobileExperience();
  });

  mm.add('(max-width: 767px)', () => {
    return lockMobileViewportHeight();
  });

  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    // Fondation : Lenis + ScrollTrigger, un seul driver
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const menu = createMenu({ lenis, reduced: false });
    const transition = createTransition({ lenis, reduced: false });
    initNavigation({ lenis, menu, transition, reduced: false });
    bindTextRolls();
    initProjectsCarousel({ reduced: false });
    initPhotoLightbox({ reduced: false, lenis });

    // Loader : première visite seulement
    const firstVisit = !sessionStorage.getItem(VISITED_KEY);
    if (firstVisit) {
      sessionStorage.setItem(VISITED_KEY, '1');
      playLoader(() => {
        playIntro();
        initScrollMotion();
      });
    } else {
      $('[data-loader]')?.remove();
      playIntro();
      initScrollMotion();
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
