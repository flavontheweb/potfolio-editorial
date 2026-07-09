---
name: editorial-portfolio-design
description: Master skill for premium editorial portfolio and showcase websites at GSAP showcase quality (audited live from TRIONN and Komma Komma). Designs the visitor relationship in three acts (first impression, guided exploration, engagement), locks a verified art direction, then provides the verified pattern library — underlay navigation, curtain loaders, panel page transitions, footer reveals, split-text choreography — with GSAP implementation recipes. Couple with the official gsap-* skills for API details.
metadata:
  version: 2.1.0
  category: design-system
  focus: editorial-portfolio-gsap-showcase
---

# Editorial Portfolio Design — Relationship-Centric Showcase Websites

## Overview

**A showcase website is not a stack of screens. It is a relationship with the visitor.**

Traditional landing-page thinking optimizes isolated sections. Relationship-centric showcase design treats the visit as a narrative arc where trust is built, guided, and converted — the same grammar used by the best GSAP showcase sites (verified live: TRIONN, Komma Komma).

**Core principle:** every design decision serves one of three acts:

- **Act I — First impression (0-3s):** loader, hero statement, typography. Credibility is won or lost here.
- **Act II — Guided exploration (the scroll):** narrative choreography, featured work, proof. The site earns attention it already captured.
- **Act III — Engagement:** contact CTA, footer, memorability. The visitor leaves with intent and a memory.

**Announce at start:** "I'm using the Editorial Portfolio Design skill to design the visitor arc, lock an art direction, and choreograph the GSAP motion plan."

## When to Use

Use this skill when:

- Designing or building a portfolio, studio, brand, or product showcase website
- The user asks for "GSAP showcase quality", "site premium", or references sites like TRIONN / Komma Komma
- A landing page needs motion design with intent, not decoration
- Rethinking an existing site that feels generic or SaaS-templated
- The user wants a distinctive loader, burger menu, or page transition
- Art direction must be locked before implementation starts

**When NOT to use:**

- Dashboards, admin panels, SaaS application UIs (use design-audit or the bencium designers)
- Documentation sites or content-heavy blogs where reading speed beats atmosphere
- Quick prototypes where motion choreography is out of scope
- Pure API/technical GSAP questions (go straight to the official gsap-\* skills)

## Verified Reference Analysis (live audit)

The patterns below were extracted from the live sites (DOM, CSS, and computed styles), not guessed.

### Komma Komma (kommakomma.is) — light editorial

- Stack: Astro + GSAP (bundled) + Lenis smooth scroll.
- Palette: alabaster `#eaeaea` background, onyx `#131313` text, one accent: strawberry `#eb4b3d`.
- Type: one neutral grotesk (BDO Grotesk) at weight 400 everywhere + a monospace for meta labels. Hero H1 ≈ 68px with line-height 1.0 (exactly).
- Hero: line-by-line mask reveal (`data-hero-reveal-line`) + media parallax (`data-hero-parallax-image`, ~±8-12%).
- Header: progressive blur built from 5 stacked layers with increasing blur — content melts under the header instead of hitting a hard bar.
- Burger menu: "underlay nav" — the full-screen menu (4 oversized links + legal/contact meta columns) lives underneath the page layer; opening reveals it from below. Toggle is a real `<button>` with `aria-label` switching "open menu"/"close menu".
- Page transitions: fixed `.transition` wrapper holding a solid accent-colored panel (`.transition__middle`, strawberry) that sweeps over the viewport during navigation.
- Loader: full-screen panel in the background color + a bottom strip (~20vw tall, `transform-origin: top center`) that curves the panel's bottom edge as the curtain lifts; the logo animates through slot-machine masks (a track sliding inside overflow-hidden columns).
- Footer: parallax reveal — the footer sits under the page and its inner content is counter-translated (~-320px → 0) as it scrolls into view, preceded by a curved divider (`site-footer__curve`).
- Project cards: per-character mask reveal on titles (`orbit-card__title-char`), subtle tilt on hover (`orbit-card__tilt`), "Click to view" cursor label.
- Testimonials: quote lines revealed through line masks, 01/02 counter, progress bar, prev/next arrows.
- Texture: static-noise overlay (scaled ~1.03) and large ASCII-art renders used as graphic texture.
- Micro-details: uppercase mono meta labels ("FEATURED PROJECT / 2026 / VIEW PROJECT"), availability pill ("Booking projects for Q3/Q4'26"), duplicated stacked text for roll hovers.

### TRIONN (trionn.com) — dark kinetic

- Stack: GSAP (bundled) + Lenis + WebGL canvases (3 canvas, 6 videos) on a very long scroll (~36 000px).
- Palette: near-black `#040508` body, `#d8d8d8` text; sections drift dark → light with full-section CSS gradients (`#FFFFFF→#D2D2D2`, `#C3C3C3→#FFFFFF`).
- Type trio: display grotesk (Familjen) for headlines (H1 ≈ 104px, weight 400), Neue Haas for body, Martian Mono for meta.
- Split text everywhere: `.chars`/`.char` spans on headlines and key paragraphs, staggered on scroll.
- Nav links: double text layer (`.text-layer.original` + `.text-layer.clone` absolute, opacity 0) powering roll-over hovers.
- Hero: press-and-hold interaction ("HOLD TO …") and a vertical letter-stacked CTA ("START A PROJECT", one character per line).
- Marquee: full-width repeated manifesto words (INSPIRE / INNOVATE / IMPACT).
- Page transitions: full identity overlay (`pl-overlay`) showing logo + destination page label + tagline before revealing the next page.
- Micro-details: live local-time widget ("IST → 23:13").

### Shared DNA To Reproduce

- One display voice + one mono for meta. Weight 400 at display sizes — hierarchy through scale and spacing, never bold-shouting.
- Lenis smooth scroll as the physical foundation for all ScrollTrigger work.
- Masked reveals (line/word/char) as the core motion vocabulary.
- A single strong accent, used sparingly and reused in the page-transition panel.
- Originality budget: loader + menu + page transition are the 3 signature slots; everything else stays calm.
- A meta layer in uppercase mono: labels, indexes (01), years, availability, local time.

## The Five Pillars of Showcase UX

### 1. First Impression as Trust Contract (Act I)

The first 3 seconds decide whether the visitor grants attention.

**Verified reference behavior:**

- Komma Komma: curtain loader (≤2s, curved bottom edge, slot-machine logo) → hero readable immediately after, H1 at line-height exactly 1.0.
- TRIONN: dark kinetic hero (`#040508`), H1 ≈ 104px weight 400, split chars, one memorable statement ("Designed to mean…").

**Design for:**

- **One statement, not a paragraph:** short, assertive, confident hero copy.
- **Typography carries authority:** display at weight 400, hierarchy through scale — never bold-shouting.
- **Loader as promise:** if present, first visit only, ≤2s; it sets the quality bar for everything after.
- **Immediate orientation:** availability pill, minimal nav, one obvious CTA.

**Key question:** if the visitor left after 3 seconds, what would they remember?

### 2. The Scroll as Guided Narrative (Act II)

The scroll is the conversation. Each section must answer the question the previous one raised.

**Verified reference behavior:**

- Komma Komma order: hero → featured project → project list (char-masked titles, hover tilt, cursor label) → services (numbered accordion) → testimonials (line masks, 01/02 counter, progress bar) → footer reveal.
- TRIONN: ~36 000px scroll, sections drifting dark → light via full-section gradients, marquee manifesto (INSPIRE / INNOVATE / IMPACT), press-and-hold CTA.

**Design for:**

- **Question → answer chaining:** hero raises "who are they?" → manifesto answers; manifesto raises "can they prove it?" → featured work answers; work raises "what exactly do they do?" → services answer; services raise "do others trust them?" → proof answers.
- **Rhythm alternation:** breathable statement sections vs dense information blocks — magazine pacing.
- **Motion reveals hierarchy:** masked line/word/char reveals tell the eye what matters first.
- **Atmosphere drift:** long pages may shift between dark and light zones to mark chapters.

**Key question:** does each scroll-stop answer the question the visitor just formed?

### 3. Trust Built Through Proof, Not Claims

Premium credibility comes from showing, never asserting.

**Verified reference behavior:**

- Komma Komma: real project cards with year labels, "FEATURED PROJECT / 2026" mono meta, client testimonials with names, portraits, and roles, availability pill ("Booking projects for Q3/Q4'26").
- TRIONN: metrics snapshot section, client partnership quotes, live local-time widget (IST → real presence).

**Design for:**

- **Meta layer as credibility texture:** uppercase mono labels, indexes (01), years, locations, local time.
- **Specific proof:** named clients, dated projects, concrete outcomes — never stock logo rows without context.
- **Scarcity honesty:** availability status signals demand without bragging.
- **Restraint as signal:** one accent color, weight 400 display, calm motion = confidence.

**Key question:** what on this page could ONLY be said by this studio/person?

### 4. Signature Moments Budget (memorability)

A site is remembered by 2-3 signature interactions, not by animating everything.

**Verified reference behavior:**

- Komma Komma spends its budget on: curtain loader, underlay burger menu, accent-colored panel page transition, footer parallax reveal.
- TRIONN spends its on: identity overlay page transition (logo + destination label), press-and-hold hero CTA, WebGL moments.
- Everything else on both sites stays calm: standard masked reveals, subtle parallax (±8-12%), fast text-roll hovers.

**Design for:**

- **Three slots maximum:** loader, menu, page transition — pick where personality lives.
- **Calm everywhere else:** scroll motion is grammar, not fireworks.
- **The accent earns its place:** reuse the single accent color in the transition panel and small UI moments only.

**Key question:** which 3 moments will the visitor describe to a friend?

### 5. Engagement and Exit Memory (Act III)

The end of the page is the beginning of the relationship.

**Verified reference behavior:**

- Komma Komma: full contact CTA section → footer parallax reveal (footer sits under the page, content counter-translated ~-320px → 0) with meta, legal, book-a-call.
- TRIONN: "LET'S TALK" vertical letter-stacked CTA, contact as a destination page with its own transition.

**Design for:**

- **One unambiguous ask:** book a call, start a project, say hello — not five competing CTAs.
- **The footer as final scene:** parallax reveal makes the ending physical; meta details (location, time, email) make it human.
- **Exit with intent:** the last viewport should contain the ask + a reason to remember (signature moment or statement echo).

**Key question:** when the visitor closes the tab, what do they do next?

## The Showcase Design Process

### Phase 1: Understand the Relationship Context

Ask these questions before any visual decision:

1. **Who is the visitor?** (potential client, recruiter, peer, press?)
2. **What must they feel in 3 seconds?** (craft, boldness, calm, scale?)
3. **What is the single conversion?** (book a call, view work, contact?)
4. **What proof exists?** (projects, clients, testimonials, metrics?)
5. **What content is real?** (never design around lorem ipsum — audit resume/portfolio content first)
6. **Dark or light world?** (TRIONN dark kinetic vs Komma Komma light editorial — or a locked hybrid)

### Phase 2: Lock the Art Direction

Propose exactly 2 directions, get explicit validation, then lock:

1. **Palette:** background + ink + ONE accent (verified refs: `#eaeaea`/`#131313`/`#eb4b3d` light, `#040508`/`#d8d8d8` dark).
2. **Type system:** 2-3 voices max — display grotesk (weight 400) + body + mono for meta.
3. **Ratio system:** golden ratio or Fibonacci for spacing and type scale — one system, consistent.
4. **Atmosphere:** noise/grain texture, gradient drift, ASCII accents — pick deliberately or omit.

Never start coding before the user validates the direction.

### Phase 3: Script the Narrative Arc

1. **Map Act I / II / III** onto the page blueprint (below).
2. **Write the question-answer chain:** each section answers the previous question, raises the next.
3. **Assign the signature budget:** which 3 moments (loader / menu / transition) carry personality.
4. **Define the meta layer:** mono labels, indexes, years, availability, local time.

### Phase 4: Choreograph Motion With Intent

1. **Foundation:** Lenis smooth scroll synced with ScrollTrigger (verified on both refs).
2. **Grammar:** masked reveals (line for calm, char for kinetic), parallax ±8-14% max.
3. **Timing:** loader ≤2s, transitions ≤1.2s, reveals 0.5-0.9s, hovers 200-350ms.
4. **Accessibility:** prefers-reduced-motion kills Lenis and loader, content visible statically.

### Phase 5: Validate the Relationship

Check against the three acts before delivery:

- **Act I:** hero readable in 3s? Statement memorable? Loader ≤2s first-visit-only?
- **Act II:** does every scroll-stop answer a question? Rhythm alternates? Proof specific?
- **Act III:** one unambiguous CTA? Footer as final scene? Exit memory identified?
- **Budget:** exactly ≤3 signature moments? Everything else calm?
- **Craft:** WCAG AA, 60fps, keyboard-operable menu, reduced-motion fallback?

## Visual System

### Composition and grid

- Dominant hero with short memorable statement.
- Alternate breathable sections and dense information blocks.
- Controlled asymmetry, never arbitrary chaos; optical alignment over geometric.
- Modular grid with 8 or 12 columns; place key anchors using golden-ratio splits.
- Canonical proportion pairs for major section splits: 1:1.618, 2:3, 3:5, 5:8.
- Position focal blocks near phi anchors (~38.2% and 61.8% of the container).
- Photography composition logic where relevant: rule of thirds, golden-spiral eye flow, diagonal tension balanced by negative space.
- Keep composition readable first; never force mathematical purity against hierarchy.

### Typography

- Verified showcase pairings:
  - Light editorial (Komma Komma): one neutral grotesk, weight 400 only, + monospace for meta.
  - Dark kinetic (TRIONN): display grotesk + neutral sans body + mono meta (three voices max).
- Display stays at weight 400-500; hierarchy from size and spacing, not boldness.
- Recommended scale (verified against live sites):
  - Eyebrow/meta: 11-13px, mono, uppercase, tracked
  - Body: 16-20px depending on viewport
  - H2: 42-72px
  - H1 hero: 64-110px desktop (Komma Komma: 68px, TRIONN: 104px), 40-56px mobile
- Display line-height: 0.95-1.05 (Komma Komma uses exactly 1.0); comfortable leading for long-form copy.
- Headline progression options (choose one, do not mix aggressively):
  - Golden-ratio modular scale: $x_{n+1}=x_n\times1.618$ → 12, 19, 31, 50, 81, 131
  - Fibonacci stepping: 13, 21, 34, 55, 89, 144
- Avoid: generic default fonts, too many families, bold display weights that break the editorial calm.

### Color and texture

- Short palette (3-5 useful tones), one refined accent maximum.
- Verified showcase palettes:
  - Light editorial: `#eaeaea` background / `#131313` text / accent `#eb4b3d`.
  - Dark kinetic: `#040508` background / `#d8d8d8` text / sections drifting toward `#ffffff`.
- The accent must earn its place: transition panel + a few small UI moments only.
- Keep contrast high (WCAG AA minimum) for premium readability.
- Texture options (verified in the wild): static-noise overlay at very low opacity, ASCII-art renders, fine grain, soft vignette.
- Long pages may drift dark ↔ light using full-section linear gradients (TRIONN pattern).
- Avoid generic startup gradients on components.

### Spacing system (golden ratio or Fibonacci)

- Spacing must follow a ratio-based scale, one system per project:
  - Golden progression (rounded): 4, 6, 10, 16, 26, 42, 68, 110
  - Fibonacci progression: 4, 8, 13, 21, 34, 55, 89
- Mappings: micro gaps 4-10, component padding 13-34, section spacing 55-110.
- Vertical rhythm locks to the chosen scale across margins, paddings, inter-section gaps.

### Navigation and UI

- Minimal stable header; prefer the progressive-blur header (stacked blur layers) over a hard bar.
- Few but clear CTAs.
- Refined fast hover states (100-220ms); default link hover is the text roll (duplicated label sliding inside a masked container).
- Preferred modules:
  - discreet editorial marquee (repeated manifesto words)
  - project list with image reveal and per-character title masks
  - numbered service accordions with (01) mono indexes
  - testimonial slider with line-masked quotes, counter (01/02), progress bar
  - meta layer: availability pill, local-time widget, year labels

## Signature Interaction Patterns (the originality budget)

Loader, burger menu, and page transition are the three slots where the site earns its personality. Spend the budget there and keep everything else calm.

### 1. Curtain loader with curved edge (Komma Komma)

- A full-screen panel in the page background color covers the site on first load.
- A bottom strip (~20vw tall, `transform-origin: top center`) scales as the panel lifts, giving the curtain a soft convex edge instead of a straight line.
- The logo animates inside overflow-hidden columns like a slot machine (a translated track per column).
- Page content and header stay hidden (`opacity: 0`) until the loader resolves; drive states with a `data-load-state` attribute on `<body>`.
- Play it on first visit only, keep it ≤2s, and skip it entirely for returning visitors.

### 2. Panel page transitions

Two verified variants:

- Accent panel sweep (Komma Komma): a fixed `.transition` wrapper holds a solid accent-colored panel that covers the viewport during navigation, then reveals the next page. Simple, fast, memorable because of the accent.
- Identity overlay (TRIONN): a full overlay presenting logo + destination page label + tagline, setting context before the reveal.
- Keep the total transition under ~1.2s. Cover with `power4.in`, reveal with `power4.out` or `expo.out`.

### 3. Underlay burger navigation (Komma Komma)

- The full-screen menu lives underneath the page layer, not on top of it.
- Opening the burger slides/clips the page away to reveal oversized nav links plus small meta columns (legal, contact, book-a-call).
- Nav links enter with masked line reveals and stagger; small links use text-roll hovers.
- The toggle is a real `<button>` with `aria-expanded` and an `aria-label` switching between "open menu" and "close menu".

### 4. Footer parallax reveal (Komma Komma)

- The footer sits beneath the page; its inner content starts counter-translated (about -30% to -40%) and eases to 0 as the footer scrolls into view — the page appears to lift off the footer.
- Optionally preceded by a curved divider block.

### 5. Progressive blur header

- 4-6 stacked layers with increasing backdrop blur and masked gradients; scrolling content melts under the header instead of hitting a solid bar.

### 6. Text roll hover

- Every primary link/label holds two copies of its text inside an overflow-hidden container (original + clone positioned below).
- On hover both translate vertically (roll). Duration 200-350ms, `power2.out`/`power3.out` feel.

### 7. Kinetic micro-interactions (use sparingly)

- Press-and-hold CTA ("HOLD TO …") with progress feedback (TRIONN).
- Vertical letter-stacked CTA (one character per line).
- Hover tilt on project cards (subtle, ≤6deg).
- Cursor label ("Click to view") following the pointer over media.

## Motion Language (GSAP)

Principle: motion should reveal hierarchy and narrative, not steal attention. The three signature slots carry the personality; scroll motion stays calm.

### 0. Physical foundation

- Use Lenis smooth scroll (both reference sites do) and sync it with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` + a single `gsap.ticker` driver.
- Never mix Lenis with CSS `scroll-behavior: smooth`.
- Disable smooth scrolling for `prefers-reduced-motion`.

### 1. Timing rhythm

- First-load loader: ≤2s, first visit only.
- Page transition: 0.8s-1.2s total (cover + reveal).
- Hero intro after reveal: 0.8s-1.6s total.
- Headline stagger: 0.03s-0.08s per line/word; 0.01s-0.03s per char.
- Section reveals: 0.5s-0.9s.
- Hover rolls: 200-350ms.
- Scroll scrub progressive and calm (scrub 0.5-1).

### 2. Recommended easing

- `power2.out`, `power3.out`, `expo.out` for entrances.
- `power4.in` to cover, `power4.out`/`expo.out` to reveal (page transitions).
- `none` for linear scrub behavior.
- Avoid elastic and bounce unless explicitly requested.

### 3. Required GSAP patterns

1. Split heading reveal through masks (line for editorial calm, char for kinetic accents)
2. Subtle image parallax (5%-14% preferred, 18% hard cap)
3. Section fade + lift on scroll
4. Underlay burger menu timeline (page slides away, links stagger in)
5. Panel page transition (accent sweep or identity overlay)
6. Footer parallax reveal (counter-translated inner content)
7. Text roll hovers on primary links
8. Subtle counter/metric reveal (if KPIs exist)

### 4. Subtle parallax system

- Use parallax as depth cue, not as effect showcase.
- Apply to media layers, never to long body text.
- Limit vertical range for premium feel:
  - foreground layer: 8%-14%
  - mid layer: 5%-9%
  - background layer: 2%-5%
- Prefer one directional axis (`yPercent`), avoid combined x/y drift.
- Keep scrub smooth and tied to section duration.
- Disable or reduce on mobile if it hurts readability.
- Never stack heavy parallax with aggressive zoom and blur in the same section.

### 5. Performance

- Use only `transform` and `opacity` for animated properties.
- Limit simultaneous timelines.
- Respect `prefers-reduced-motion` (kill Lenis, show content statically).
- Clean up ScrollTriggers and Lenis on unmount.
- Reserve `will-change` for the loader/transition panels, remove it after.

## Page Blueprint (recommended order)

1. Loader (first visit only) → curtain lift with curved edge
2. Progressive-blur header + burger toggle
3. Hero statement (masked line reveal) + primary CTA + availability pill
4. Manifesto intro (2-4 lines, word/line split on scroll)
5. Immersive featured project (parallax media + mono meta labels)
6. Project list / case studies (char-masked titles, cursor label, hover tilt)
7. Services (numbered accordion or grid, (01) mono indexes)
8. Optional marquee (repeated manifesto words)
9. Proof section (line-masked testimonials with counter + progress, logos)
10. Final contact CTA
11. Footer parallax reveal (meta, location, local time, legal)

## Copywriting Rules (editorial tone)

- Keep sentences short, dense, and assertive.
- Avoid empty marketing jargon.
- Voice should be confident, precise, and calm.
- Aim for maximum impact with minimal wording.

Tone examples:

- "Designed to mean intention."
- "Built for hyperscale."
- "Web experiences for brands that refuse to blend in."

## GSAP Implementation Recipe (template)

Use this base in React, Vue, or vanilla projects. It wires Lenis + the scroll grammar + the signature patterns. For API details, defer to the official gsap-\* skills.

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function initEditorialMotion(root = document) {
  const mm = gsap.matchMedia();
  let lenis = null;

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set("[data-reveal], [data-hero-line]", { opacity: 1, y: 0 });
    return () => {};
  });

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // 0) Smooth scroll foundation (verified on both reference sites)
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // 1) Hero: masked line reveal (wrap each line in overflow-hidden)
    gsap.from("[data-hero-line]", {
      yPercent: 110,
      duration: 1.0,
      ease: "power3.out",
      stagger: 0.06,
      clearProps: "all",
    });

    // 2) Section reveals
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    });

    // 3) Subtle media parallax (clamped, yPercent only)
    gsap.utils.toArray("[data-parallax]").forEach((el) => {
      const depth = Number(el.getAttribute("data-parallax-depth") || 8);
      const clamped = Math.min(Math.max(depth, 2), 14);
      gsap.fromTo(
        el,
        { yPercent: -clamped },
        {
          yPercent: clamped,
          ease: "none",
          scrollTrigger: { trigger: el, scrub: 0.6 },
        },
      );
    });

    // 4) Footer parallax reveal (Komma Komma pattern)
    const footerInner = root.querySelector("[data-footer-inner]");
    if (footerInner) {
      gsap.fromTo(
        footerInner,
        { yPercent: -35 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-footer]",
            start: "top bottom",
            end: "top top",
            scrub: 0.8,
          },
        },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  });

  return () => mm.revert();
}

// Underlay burger menu (Komma Komma pattern):
// the nav sits UNDER the page; the page slides away to reveal it.
export function createUnderlayMenu({ page, links, toggle }) {
  const tl = gsap.timeline({ paused: true });
  tl.to(page, {
    yPercent: 55,
    scale: 0.98,
    duration: 0.8,
    ease: "power3.inOut",
  }).from(
    links,
    { yPercent: 110, duration: 0.7, ease: "power3.out", stagger: 0.05 },
    "-=0.35",
  );

  let open = false;
  toggle.addEventListener("click", () => {
    open = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "close menu" : "open menu");
    open ? tl.play() : tl.reverse();
  });
  return tl;
}

// Accent panel page transition (Komma Komma pattern):
// a solid accent-colored panel sweeps over, navigation happens, panel reveals.
export function pageTransition(panel, navigate) {
  const tl = gsap.timeline();
  tl.set(panel, { yPercent: 100, autoAlpha: 1 })
    .to(panel, { yPercent: 0, duration: 0.5, ease: "power4.in" })
    .add(() => navigate()) // swap content / router push
    .to(panel, {
      yPercent: -100,
      duration: 0.6,
      ease: "power4.out",
      delay: 0.1,
    });
  return tl;
}

// Text roll hover: element contains two stacked copies inside overflow-hidden.
export function bindTextRoll(el) {
  const [a, b] = el.querySelectorAll("[data-roll-copy]");
  const enter = () =>
    gsap
      .timeline({ defaults: { duration: 0.3, ease: "power2.out" } })
      .to(a, { yPercent: -100 }, 0)
      .fromTo(b, { yPercent: 100 }, { yPercent: 0 }, 0);
  const leave = () =>
    gsap
      .timeline({ defaults: { duration: 0.3, ease: "power2.out" } })
      .to(a, { yPercent: 0 }, 0)
      .to(b, { yPercent: 100 }, 0);
  el.addEventListener("mouseenter", enter);
  el.addEventListener("mouseleave", leave);
}
```

## Design Tokens Example (ratio-based, showcase palettes)

```css
:root {
  /* Fibonacci spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 13px;
  --space-4: 21px;
  --space-5: 34px;
  --space-6: 55px;
  --space-7: 89px;

  /* Golden-ratio type scale (rounded) */
  --step--1: 12px;
  --step-0: 19px;
  --step-1: 31px;
  --step-2: 50px;
  --step-3: 81px;
  --step-4: 131px;

  /* Light editorial palette (verified: Komma Komma) */
  --color-bg: #eaeaea;
  --color-ink: #131313;
  --color-accent: #eb4b3d;

  /* Dark kinetic palette (verified: TRIONN) */
  /* --color-bg: #040508; --color-ink: #d8d8d8; sections drift toward #fff */

  /* Display rhythm */
  --display-leading: 1; /* Komma Komma hero: line-height exactly 1.0 */
}
```

## Companion Skills Protocol

This skill is the **director and pattern library**. For implementation details, couple with:

| Need                                                              | Companion skill      |
| ----------------------------------------------------------------- | -------------------- |
| Core tweens, easing, stagger, matchMedia                          | `gsap-core`          |
| Scroll-linked animation, pinning, scrub                           | `gsap-scrolltrigger` |
| Sequencing signature moments (loader, menu, transition timelines) | `gsap-timeline`      |
| SplitText, ScrollTo, Flip, Observer, CustomEase                   | `gsap-plugins`       |
| 60fps, layout thrashing, will-change discipline                   | `gsap-performance`   |
| Vue/Svelte/vanilla lifecycle and cleanup                          | `gsap-frameworks`    |
| Typographic correctness (quotes, dashes, hierarchy)               | `ui-typography`      |

**Workflow:** run Phases 1-3 (context, direction, narrative) → use the pattern library and recipes above → back implementation details with the official `gsap-*` skills → run Phase 5 validation.

## Common Mistakes

### ❌ Designing Screens Instead of an Arc

**Problem:** Stacking pretty sections with no question-answer chain

**Fix:** Script the narrative first (Phase 3); every section must answer the previous question

### ❌ Animating Everything

**Problem:** Every element fades, slides, and bounces — nothing is memorable

**Fix:** Enforce the 3-slot signature budget; keep scroll motion as calm grammar

### ❌ Claims Without Proof

**Problem:** "We craft premium experiences" with zero named projects or dates

**Fix:** Build the meta layer — years, clients, indexes, availability, local time

### ❌ Bold-Shouting Typography

**Problem:** 900-weight display fonts screaming for authority

**Fix:** Weight 400 at large scale, hierarchy through size and spacing (both refs verified)

### ❌ Generic Overlay Menu

**Problem:** Burger opens a plain fade-in overlay on top of the page

**Fix:** Use the underlay pattern — the page moves away, revealing nav beneath

### ❌ Coding Before Locking Direction

**Problem:** Building sections while palette/type/ratio are still floating

**Fix:** Phase 2 requires explicit user validation of 1 of 2 proposed directions

### ❌ Skipping the Reduced-Motion Path

**Problem:** Lenis + loader + reveals with no fallback

**Fix:** prefers-reduced-motion kills smooth scroll and loader, shows content statically

### ❌ Loader Replayed on Every Navigation

**Problem:** The curtain plays on each page change, punishing exploration

**Fix:** First visit only (sessionStorage flag); page changes use the panel transition instead

## Quality Checklist (before delivery)

- [ ] Clear typography hierarchy across at least 3 levels (display + body + mono meta).
- [ ] Hero readable within 3 seconds.
- [ ] Loader plays on first visit only and never exceeds 2s.
- [ ] Burger menu is a real `<button>` with `aria-expanded` + `aria-label`, keyboard operable.
- [ ] Page transition under 1.2s and interruptible (no input lock beyond it).
- [ ] Coherent grid across desktop, tablet, and mobile.
- [ ] Layout uses explicit ratio logic (golden ratio and/or Fibonacci).
- [ ] Spacing tokens follow a single ratio-based progression.
- [ ] Type scale follows a coherent modular progression.
- [ ] Smooth motion at 60fps on standard hardware.
- [ ] Lenis and ScrollTrigger stay in sync (no double smoothing).
- [ ] No demo-like gratuitous effects outside the 3 signature slots.
- [ ] WCAG AA contrast is respected.
- [ ] Reduced-motion mode: no Lenis, no loader, content visible statically.
- [ ] Primary CTA is visible and unambiguous.
- [ ] Every scroll-stop answers the question the previous section raised.
- [ ] Proof is specific: named projects, years, real testimonials.

## Anti-patterns (forbidden)

- Over-animation everywhere (personality belongs to loader/menu/transition only)
- Slow transitions that block reading flow
- Loader replayed on every navigation
- Menu overlay dropped on top of the page with a plain fade (use the underlay pattern)
- Too many accent colors
- Default glassmorphism
- Repetitive SaaS cards with no art direction
- Typography with no contrast in personality
- Bold display weights shouting over the layout
- Claims without proof; logo rows without context

## Quick Reference

| Generic landing page       | Relationship-centric showcase              |
| -------------------------- | ------------------------------------------ |
| Hero + features + pricing  | Act I / II / III narrative arc             |
| Sections stacked           | Question → answer chaining                 |
| Animate everything         | 3-slot signature budget                    |
| Bold display fonts         | Weight 400 at scale, spacing hierarchy     |
| Claims ("premium", "best") | Proof: named projects, years, availability |
| 5 CTAs competing           | One unambiguous ask                        |
| Footer as legal dump       | Footer as final scene (parallax reveal)    |
| Template palette           | Locked direction: bg + ink + one accent    |

## Suggested Activation Prompt

When this skill is active, start with:

1. "I propose 2 editorial directions compatible with this style (light editorial à la Komma Komma vs dark kinetic à la TRIONN)."
2. "I lock a palette, a type pairing, and a GSAP motion plan — including the 3 signature slots (loader, menu, page transition) — before coding."
3. "I deliver a responsive, accessible result with no gimmick effects outside the signature slots."

## Remember

- The visit is a relationship: first impression → guided exploration → engagement
- Lock the art direction (palette, type, ratio) with the user BEFORE coding
- Personality lives in ≤3 signature moments; everything else stays calm
- Proof beats claims: meta layer, named work, dated projects
- Weight 400 + scale + spacing = premium authority
- Couple with the official `gsap-*` skills for implementation details
- Reduced-motion and accessibility are part of the craft, not an afterthought

**The sections will always matter. But the arc matters more.**
