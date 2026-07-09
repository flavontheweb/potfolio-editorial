/* ==========================================================================
   Portfolio Flavien Gaujard — chorégraphie motion
   GSAP + Lenis, patterns vérifiés (skill editorial-portfolio-design)
   ========================================================================== */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => gsap.utils.toArray(sel, root);

/* --------------------------------------------------------------------------
   Horloge locale (méta layer) — indépendante du motion
   -------------------------------------------------------------------------- */

function initClock() {
  const el = $("[data-clock]");
  if (!el) return;
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
  const tick = () => (el.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 30_000);
}

/* --------------------------------------------------------------------------
   Loader rideau — première visite uniquement, ≤ 2 s
   -------------------------------------------------------------------------- */

const VISITED_KEY = "fg-visited";

function playLoader(onComplete) {
  const loader = $("[data-loader]");
  const chars = $$("[data-loader-char]");
  const meta = $("[data-loader-meta]");
  const curve = $("[data-loader-curve]");

  const tl = gsap.timeline({ onComplete });

  // Monogramme « slot machine » dans colonnes masquées
  tl.from(chars, {
    yPercent: 110,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.08,
  })
    .from(
      meta,
      { opacity: 0, y: 8, duration: 0.4, ease: "power2.out" },
      "-=0.2",
    )
    .to({}, { duration: 0.35 }) // temps de lecture
    // Levée du rideau : le bord bas se courbe (scaleY → 0, origin top)
    .to(loader, { y: "-100vh", duration: 0.85, ease: "power4.inOut" })
    .to(curve, { scaleY: 0, duration: 0.85, ease: "power4.inOut" }, "<")
    .set(loader, { display: "none" });

  return tl;
}

/* --------------------------------------------------------------------------
   Reveals d'entrée (héros) — après le loader
   -------------------------------------------------------------------------- */

function playIntro() {
  document.body.dataset.loadState = "ready";

  const tl = gsap.timeline();
  tl.from("[data-hero-line]", {
    yPercent: 110,
    duration: 1.1,
    ease: "power3.out",
    stagger: 0.08,
  }).from(
    ".hero [data-reveal]",
    {
      opacity: 0,
      y: 14,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.06,
      clearProps: "all",
    },
    "-=0.6",
  );
  return tl;
}

/* --------------------------------------------------------------------------
   Menu underlay — la page glisse pour révéler le menu dessous
   -------------------------------------------------------------------------- */

function createMenu({ lenis, reduced }) {
  const toggle = $("[data-menu-toggle]");
  const menu = $("[data-menu]");
  const page = $("[data-page]");
  const labels = $$("[data-menu-label]");
  const metaBlocks = $$(".menu__meta > div");
  if (!toggle || !menu || !page) return { close: () => {} };

  let open = false;
  let tl = null;

  if (!reduced) {
    tl = gsap.timeline({
      paused: true,
      onReverseComplete: () => menu.setAttribute("aria-hidden", "true"),
    });
    tl.to(page, {
      yPercent: 58,
      scale: 0.985,
      duration: 0.8,
      ease: "power3.inOut",
    })
      .from(
        labels,
        { yPercent: 110, duration: 0.7, ease: "power3.out", stagger: 0.05 },
        "-=0.4",
      )
      .from(
        metaBlocks,
        { opacity: 0, y: 12, duration: 0.5, ease: "power2.out", stagger: 0.06 },
        "-=0.5",
      );
  }

  const setState = (next) => {
    open = next;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Fermer le menu" : "Ouvrir le menu",
    );
    if (open) {
      menu.setAttribute("aria-hidden", "false");
      lenis?.stop();
      if (tl === null) menu.style.visibility = "visible";
      else tl.play();
    } else {
      lenis?.start();
      if (tl === null) {
        menu.style.visibility = "";
        menu.setAttribute("aria-hidden", "true");
      } else {
        tl.reverse();
      }
    }
  };

  toggle.addEventListener("click", () => setState(!open));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) setState(false);
  });

  return { close: () => open && setState(false), isOpen: () => open };
}

/* --------------------------------------------------------------------------
   Transition « panneau rouille » — la seule grande surface d'accent
   -------------------------------------------------------------------------- */

function createTransition({ lenis, reduced }) {
  const wrapper = $("[data-transition]");
  const panel = $("[data-transition-panel]");

  const jumpTo = (target) => {
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else target.scrollIntoView();
  };

  return (target) => {
    if (reduced || !wrapper || !panel) {
      target.scrollIntoView();
      return;
    }
    const tl = gsap.timeline();
    tl.set(wrapper, { visibility: "visible" })
      .fromTo(
        panel,
        { yPercent: 102 },
        { yPercent: 0, duration: 0.45, ease: "power4.in" },
      )
      .add(() => jumpTo(target))
      .to(panel, {
        yPercent: -102,
        duration: 0.6,
        ease: "expo.out",
        delay: 0.08,
      })
      .set(wrapper, { visibility: "hidden" });
  };
}

/* --------------------------------------------------------------------------
   Navigation par ancres
   -------------------------------------------------------------------------- */

function initNavigation({ lenis, menu, transition, reduced }) {
  $$("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();

      const fromMenu = link.dataset.menuLink !== undefined;
      if (fromMenu) {
        // Signature : fermeture du menu + balayage rouille
        menu.close();
        gsap.delayedCall(reduced ? 0 : 0.45, () => transition(target));
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
  $$(".roll").forEach((el) => {
    const copies = el.querySelectorAll("[data-roll-copy]");
    if (copies.length < 2) return;
    const [a, b] = copies;
    el.addEventListener("mouseenter", () => {
      gsap
        .timeline({ defaults: { duration: 0.28, ease: "power2.out" } })
        .to(a, { yPercent: -100 }, 0)
        .to(b, { yPercent: -100 }, 0);
    });
    el.addEventListener("mouseleave", () => {
      gsap
        .timeline({ defaults: { duration: 0.28, ease: "power2.out" } })
        .to(a, { yPercent: 0 }, 0)
        .to(b, { yPercent: 0 }, 0);
    });
  });
}

/* --------------------------------------------------------------------------
   Grammaire scroll (calme) : reveals, parallaxe, footer
   -------------------------------------------------------------------------- */

function initScrollMotion() {
  // Sections : fade + lift
  $$("[data-reveal]").forEach((el) => {
    if (el.closest(".hero")) return; // le héros est géré par l'intro
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  // Manifeste : reveal ligne à ligne masqué
  const manifestoLines = $$("[data-manifesto-line]");
  if (manifestoLines.length) {
    gsap.from(manifestoLines, {
      yPercent: 110,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.07,
      scrollTrigger: {
        trigger: ".manifesto",
        start: "top 70%",
        once: true,
      },
    });
  }

  // Parallaxe héros (±10 %)
  const heroMedia = $("[data-hero-parallax]");
  if (heroMedia) {
    gsap.fromTo(
      heroMedia,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", scrub: 0.6 },
      },
    );
  }

  // Parallaxe médias (galerie) — profondeur clampée 2-14 %
  $$("[data-parallax]").forEach((el) => {
    const depth = gsap.utils.clamp(
      2,
      14,
      Number(el.dataset.parallaxDepth || 8),
    );
    gsap.fromTo(
      el.querySelector("img"),
      { yPercent: -depth, scale: 1 + depth / 50 },
      {
        yPercent: depth,
        scale: 1 + depth / 50,
        ease: "none",
        scrollTrigger: { trigger: el, scrub: 0.6 },
      },
    );
  });

  // Footer reveal parallaxe : contenu contre-translaté
  const footerInner = $("[data-footer-inner]");
  if (footerInner) {
    gsap.fromTo(
      footerInner,
      { yPercent: -30 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-footer]",
          start: "top bottom",
          end: "top 30%",
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

/* --------------------------------------------------------------------------
   Boîte à outils — chapitres pinnés qui se succèdent au scroll
   -------------------------------------------------------------------------- */

const pad2 = (n) => String(n).padStart(2, "0");

function initStackPin() {
  const section = $("[data-stack]");
  if (!section) return;
  const chapters = $$("[data-stack-chapter]", section);
  if (!chapters.length) return;
  section.dataset.enhanced = "";

  const bar = $("[data-stack-progress]", section);

  // États initiaux : chapitre 1 visible, les suivants cachés
  chapters.forEach((chapter, i) => {
    gsap.set(chapter, { autoAlpha: i === 0 ? 1 : 0 });
  });

  // Entrée du premier chapitre à l'approche de la section (avant le pin)
  const first = chapters[0];
  gsap
    .timeline({
      scrollTrigger: { trigger: section, start: "top 65%", once: true },
    })
    .from(first.querySelector("[data-stack-title]"), {
      yPercent: 110,
      duration: 0.8,
      ease: "power3.out",
    })
    .from(
      first.querySelector("[data-stack-desc]"),
      { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" },
      "-=0.5",
    )
    .from(
      first.querySelectorAll("[data-stack-item]"),
      { opacity: 0, y: 16, duration: 0.5, ease: "power2.out", stagger: 0.03 },
      "-=0.35",
    );

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=" + chapters.length * 85 + "%",
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
    const title = chapter.querySelector("[data-stack-title]");
    const desc = chapter.querySelector("[data-stack-desc]");
    const items = chapter.querySelectorAll("[data-stack-item]");

    if (i > 0) {
      tl.fromTo(chapter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, i)
        .fromTo(
          title,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.3, ease: "power3.out" },
          i + 0.03,
        )
        .fromTo(
          desc,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
          i + 0.1,
        )
        .fromTo(
          items,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.28,
            ease: "power2.out",
            stagger: 0.018,
          },
          i + 0.12,
        );
    }

    if (i < chapters.length - 1) {
      tl.to(
        chapter,
        { autoAlpha: 0, y: -34, duration: 0.22, ease: "power2.in" },
        i + 0.75,
      );
    }
  });
}

/* --------------------------------------------------------------------------
   Galerie — travelling horizontal pinné (la pellicule défile)
   -------------------------------------------------------------------------- */

function initGalleryPin() {
  const section = $("[data-gallery]");
  const track = $("[data-gallery-track]");
  if (!section || !track) return;
  section.dataset.enhanced = "";

  const frames = $$("[data-gallery-frame]", section);
  const current = $("[data-gallery-current]", section);
  const bar = $("[data-gallery-progress]", section);
  const distance = () => Math.max(0, track.offsetWidth - window.innerWidth);

  gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => "+=" + Math.max(distance(), window.innerHeight),
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.animation?.progress() ?? self.progress;
        if (current && frames.length) {
          const idx = Math.min(
            frames.length - 1,
            Math.floor(p * frames.length),
          );
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
  $$("[data-marquee-track]").forEach((track) => {
    gsap.fromTo(
      track,
      { x: 0 },
      {
        x: () => -track.scrollWidth * 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: track.closest(".marquee"),
          start: "top bottom",
          end: "bottom top",
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
  const page = $("[data-page]");
  if (!page) return;
  $$("[data-bg]").forEach((section) => {
    const color = section.dataset.bg;
    ScrollTrigger.create({
      trigger: section,
      start: "top 50%",
      end: "bottom 50%",
      onToggle(self) {
        if (self.isActive) {
          gsap.to(page, {
            backgroundColor: color,
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      },
    });
  });
}

/* --------------------------------------------------------------------------
   Bootstrap
   -------------------------------------------------------------------------- */

function init() {
  initClock();

  const mm = gsap.matchMedia();

  // Mode reduced motion : contenu statique, pas de smooth scroll ni loader
  mm.add("(prefers-reduced-motion: reduce)", () => {
    document.body.dataset.loadState = "ready";
    const menu = createMenu({ lenis: null, reduced: true });
    const transition = createTransition({ lenis: null, reduced: true });
    initNavigation({ lenis: null, menu, transition, reduced: true });
  });

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Fondation : Lenis + ScrollTrigger, un seul driver
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const menu = createMenu({ lenis, reduced: false });
    const transition = createTransition({ lenis, reduced: false });
    initNavigation({ lenis, menu, transition, reduced: false });
    bindTextRolls();

    // Loader : première visite seulement
    const firstVisit = !sessionStorage.getItem(VISITED_KEY);
    if (firstVisit) {
      sessionStorage.setItem(VISITED_KEY, "1");
      playLoader(() => {
        playIntro();
        initScrollMotion();
      });
    } else {
      $("[data-loader]")?.remove();
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
