# Charte graphique — Portfolio Flavien Gaujard

> Direction artistique : **« Darkroom éditorial »** — hybride entre l'éditorial sombre photo-led (réf. Komma Komma) et le tech cinématique aux détails monospace (réf. Trionn).
> Concept : le portfolio comme une chambre noire de photographe — un espace sombre et chaud où les projets et les photos apparaissent comme des tirages rétroéclairés, annotés avec la précision d'une fiche technique.
> Patterns et mesures alignés sur l'audit live des deux références (skill `gsap-editorial-showcase-designer` v2).

---

## 1. Concept & tonalité

| Axe              | Décision                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Ambiance         | Sombre, chaude, cinématique — jamais froide ni « SaaS »                                           |
| Registre         | Éditorial magazine : grandes compositions typographiques, photos en héros                         |
| Contrepoint      | Détails techniques monospace : index, coordonnées, métadonnées (année, rôle, stack)               |
| Personnalité     | Développeur-designer : rigueur d'ingénieur (grille, mono) × sensibilité artistique (photo, DJing) |
| Ce qu'on retient | Des photos plein écran encadrées comme des tirages, annotées comme un log système                 |

**Interdits** : glassmorphism, dégradés violets sur fond blanc, bleu SaaS générique, mimétisme Apple, layouts en cartes symétriques prévisibles.

---

## 2. Palette de couleurs

Base sombre **chaude** (jamais de noir pur ni de gris bleuté), un seul accent fort.

### Neutres (fonds, surfaces, texte)

| Token         | Hex       | Usage                                    |
| ------------- | --------- | ---------------------------------------- |
| `--ink-950`   | `#141110` | Fond principal (noir chaud, teinté brun) |
| `--ink-900`   | `#1C1815` | Surfaces, sections alternées             |
| `--ink-800`   | `#292320` | Cartes, panneaux, hover de surface       |
| `--ink-600`   | `#57504A` | Bordures, filets, séparateurs            |
| `--ink-300`   | `#A89F97` | Texte secondaire, légendes, métadonnées  |
| `--paper-100` | `#EDE8E3` | Texte principal (blanc cassé chaud)      |
| `--paper-50`  | `#F7F4F0` | Titres, contenus en pleine emphase       |

### Accent

| Token        | Hex       | Usage                                                           |
| ------------ | --------- | --------------------------------------------------------------- |
| `--rust-500` | `#C4552A` | Accent principal : liens actifs, CTA, soulignés, curseur custom |
| `--rust-400` | `#E06A38` | Hover de l'accent, lueurs, détails incandescents                |
| `--rust-700` | `#8A3A1D` | Accent sur fond clair, états pressés                            |

### Fonctionnel (parcimonie)

| Token   | Hex       | Usage                                                      |
| ------- | --------- | ---------------------------------------------------------- |
| `--ok`  | `#7A9B6D` | Succès (vert sauge désaturé, cohérent avec la base chaude) |
| `--err` | `#C24444` | Erreurs de formulaire                                      |

**Règles**

- Ratio : ~90 % neutres / ~8 % accent / ~2 % fonctionnel.
- L'accent rouille ne sert **jamais** de fond de grande zone — uniquement traits, textes courts, icônes, lueurs. **Une seule exception** : le panneau de transition de page (pattern Komma Komma), qui le rend mémorable.
- L'accent doit « mériter sa place » : panneau de transition + quelques micro-moments UI, rien d'autre.
- Contraste WCAG AA minimum : `--paper-100` sur `--ink-950` ≈ 13:1 ✓ ; `--rust-400` sur `--ink-950` pour les textes accentués (≥ 4.5:1).
- Mode clair : non prioritaire. Si nécessaire, inverser vers `--paper-50` en fond avec `--ink-950` en texte et `--rust-700` en accent.

---

## 3. Typographie

Trois familles maximum, chacune avec un rôle strict.

| Rôle                                      | Police                                                            | Fallback                | Caractère                                           |
| ----------------------------------------- | ----------------------------------------------------------------- | ----------------------- | --------------------------------------------------- |
| **Display** (titres héros, gros chiffres) | PP Neue Montreal _(alternative libre : General Sans — Fontshare)_ | `sans-serif`            | Grotesque neutre et massive, façon Komma Komma      |
| **Texte** (corps, navigation, UI)         | General Sans                                                      | `system-ui, sans-serif` | Lisible, sobre, proche du display pour la cohérence |
| **Mono** (métadonnées, labels, index)     | Fragment Mono _(Google Fonts)_                                    | `monospace`             | Détail technique, façon Trionn                      |

### Échelle Fibonacci (13 / 21 / 34 / 55 / 89 px — lisibilité avant pureté mathématique)

| Token         | Taille                              | Usage                                                                |
| ------------- | ----------------------------------- | -------------------------------------------------------------------- |
| `--text-hero` | `clamp(3.4375rem, 7.5vw, 6.875rem)` | 55 → 110 px : titre héros (cap vérifié : Komma 68 px, TRIONN 104 px) |
| `--text-h1`   | 5.5625 rem (89 px)                  | Titres de page                                                       |
| `--text-h2`   | 3.4375 rem (55 px)                  | Titres de section                                                    |
| `--text-h3`   | 2.125 rem (34 px)                   | Sous-sections, titres de projet                                      |
| `--text-lg`   | 1.3125 rem (21 px)                  | Intros, chapôs                                                       |
| `--text-base` | 1 rem (16 px)                       | Corps de texte (16–20 px selon viewport)                             |
| `--text-sm`   | 0.875 rem (14 px)                   | Légendes, notes                                                      |
| `--text-meta` | 0.8125 rem (13 px)                  | Labels mono, toujours en `letter-spacing: 0.08em` + capitales        |

**Règles**

- Display : `font-weight: 400–500` — **jamais de bold à taille display** ; la hiérarchie vient de l'échelle et de l'espace (vérifié : Komma Komma est en 400 partout). `letter-spacing: -0.02em`, `line-height: 1.0` (0.95–1.05 toléré).
- Corps : `line-height: 1.6`, largeur de mesure 60–75 caractères max.
- Labels mono toujours en capitales espacées : `FEATURED PROJECT`, `EST. 2000`, `INDEX — 01`.
- Typographie française soignée : apostrophes typographiques (’), guillemets « », espaces insécables avant `: ; ! ?`, tirets cadratins — pour les incises.
- Jamais plus de deux graisses par famille sur une même vue.

---

## 4. Espacement & grille

- **Échelle Fibonacci** (une seule échelle, verrouillée partout — marges, paddings, gaps) : `4 / 8 / 13 / 21 / 34 / 55 / 89 / 144`.
  - Micro-espacements : 4–13 · padding de composants : 13–34 · espacement de sections : 55–144.
- **Grille** : 12 colonnes desktop, gouttière 21 px, marges latérales `clamp(21px, 5vw, 89px)`.
- **Ancrages phi** : blocs focaux (héros, features) positionnés près de 38,2 % / 61,8 % du conteneur ; splits majeurs en 1:1.618, 2:3, 3:5 ou 5:8.
- **Sections** : padding vertical généreux (55–144 px) — l'espace négatif fait partie de l'identité.
- **Asymétrie volontaire** : textes décalés, photos qui débordent de la grille, labels ancrés aux bords de l'écran (façon Komma Komma : `FEATURED PROJECT` à gauche, `VIEW PROJECT` à droite). Alignement **optique** prioritaire sur l'alignement géométrique.
- Composition photo appliquée au layout : règle des tiers pour le focal principal, tension diagonale équilibrée par l'espace négatif. Lisibilité d'abord — ne jamais forcer la pureté mathématique contre la hiérarchie.
- Breakpoints : `640 / 1024 / 1440`.

---

## 5. Imagerie & photographie

La photographie est un pilier de l'identité (galerie photo prévue en section dédiée).

- **Traitement** : photos plein cadre ou en « tirage encadré » (marge sombre autour, comme une fenêtre — réf. héros Komma Komma).
- **Tonalité** : privilégier des photos aux dominantes chaudes ou neutres ; éviter les images très saturées froides qui cassent la palette.
- **Overlay** : dégradé `--ink-950` 0 → 60 % en bas des images portant du texte.
- **Grain** : overlay de grain subtil (opacité 3–5 %) sur les fonds pour l'ambiance argentique.
- **Légendes** : toujours en mono — lieu, année, éventuellement données EXIF (`F/2.8 — 1/250 — ISO 400`), pour lier photo et culture technique.
- Formats : AVIF/WebP, `loading="lazy"`, ratios imposés 3:2 et 4:5.

---

## 6. Iconographie & détails graphiques

- Icônes : trait fin (1.5 px), style géométrique, monochrome (`--paper-100` ou `--ink-300`), accent `--rust-500` réservé aux états actifs. Cohérent avec ton travail d'iconographie chez Buawei.
- Flèches → comme motif récurrent de navigation (liens, CTA, « view project »).
- Filets horizontaux 1 px (`--ink-600`) pour structurer les listes (expériences, index de projets).
- Numérotation systématique en mono : `01`, `02`, `03`…
- Curseur custom discret : point qui devient cercle `--rust-500` sur les éléments interactifs ; label curseur (« Voir le projet ») sur les médias cliquables.
- Méta layer récurrent : pill de disponibilité, horloge locale (`ANNECY — 14:32`), années, index — l'ADN mono des deux références.

---

## 7. Motion (GSAP + Lenis)

Motion sobre et éditoriale — sentie plutôt que vue. **Budget d'originalité** : trois moments signature (loader, menu, transition de page) portent la personnalité du site ; tout le reste reste calme.

### Fondation physique

- **Lenis smooth scroll** (fondation des deux références), synchronisé avec ScrollTrigger : `lenis.on('scroll', ScrollTrigger.update)` + un seul driver `gsap.ticker`.
- Jamais de `scroll-behavior: smooth` CSS en parallèle de Lenis.
- `prefers-reduced-motion` : désactiver smooth scroll, parallaxe et reveals via `gsap.matchMedia()`.

### Les trois moments signature (patterns vérifiés)

| Slot                   | Pattern                                                                                                                                                                                                               | Durée / easing                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Loader rideau**      | Panneau plein écran couleur `--ink-950` + bande basse (~20vw, `transform-origin: top center`) qui courbe le bord en se levant ; monogramme en « slot machine » dans des colonnes masquées. Première visite uniquement | ≤ 2 s                                            |
| **Menu underlay**      | Le menu plein écran vit **sous** la page ; l'ouverture fait glisser la page pour le révéler : 4–5 liens surdimensionnés en reveal masqué + colonnes méta (contact, réseaux). `<button>` réel avec `aria-expanded`     | 0.6–0.9 s                                        |
| **Transition de page** | Panneau `--rust-500` plein écran qui balaie le viewport entre les routes — la seule grande surface d'accent autorisée                                                                                                 | 0.8–1.2 s — cover `power4.in`, reveal `expo.out` |

### Motion courante (calme)

| Contexte      | Pattern                                                                                  | Durée / easing           |
| ------------- | ---------------------------------------------------------------------------------------- | ------------------------ |
| Héros         | Reveal ligne à ligne masqué (SplitText) + parallaxe photo ±8–12 %                        | 0.8–1.6 s, `power3.out`  |
| Scroll        | Fade + lift des sections ; parallaxe médias 5–14 % (cap dur : 18 %)                      | scrub 0.5–1, ease `none` |
| Hover liens   | **Text roll** : deux copies du texte dans un conteneur masqué, translation verticale     | 200–350 ms, `power2.out` |
| Cartes projet | Titre en masque par caractère, tilt subtil ≤ 6°, léger scale image 1.03                  | 300–500 ms               |
| Footer        | **Reveal parallaxe** : contenu contre-translaté (−30 à −40 %) → 0 à l'entrée du viewport | scrub doux               |
| Stagger       | 0.03–0.08 s par ligne/mot ; 0.01–0.03 s par caractère                                    | —                        |

**Règles**

- Animer uniquement `transform` et `opacity` (performance).
- Jamais d'elastic ni de bounce.
- Parallaxe = indice de profondeur, appliquée aux médias seulement — jamais au texte courant.

---

## 8. Composants clés

| Composant              | Spécification                                                                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Loader**             | Rideau à bord courbé (cf. § 7), monogramme slot-machine — première visite seulement, skip pour les visiteurs récurrents                                                                  |
| **Header**             | Fin, fixe, **progressive blur** : 4–6 couches empilées au flou croissant — le contenu « fond » sous le header au lieu de buter sur une barre. Monogramme à gauche, burger + CTA à droite |
| **Menu**               | Underlay plein écran sous la page (cf. § 7) : liens surdimensionnés + colonnes méta (contact, réseaux, mentions)                                                                         |
| **Héros**              | Photo plein écran « encadrée », nom en display géant (reveal par lignes), labels mono ancrés aux coins                                                                                   |
| **Transition de page** | Panneau `--rust-500` qui balaie le viewport entre les routes                                                                                                                             |
| **Carte projet**       | Image dominante, titre h3 en reveal par caractère, ligne mono `ROLE — STACK — ANNÉE`, filet 1 px, tilt ≤ 6° + label curseur « Voir le projet » au hover                                  |
| **Liste expériences**  | Lignes horizontales façon index numéroté `(01)` : entreprise / poste / dates en mono, expansion au clic                                                                                  |
| **Galerie photo**      | Grille asymétrique (mix 3:2 et 4:5), lightbox sobre fond `--ink-950`, légendes EXIF mono                                                                                                 |
| **Boutons & liens**    | Pas d'ombre : fond `--rust-500` texte `--paper-50` (primaire) ; bordure 1 px `--ink-600` (secondaire). Hover : text roll + flèche qui glisse                                             |
| **Méta layer**         | Pill de disponibilité (ex. « Open to work — 2026 »), horloge locale `ANNECY — 14:32`, années, index 01/02                                                                                |
| **Footer**             | **Reveal parallaxe** (le footer vit sous la page), grand « Contact » en display, liens GitHub/LinkedIn/mail en mono avec text roll, mention `EST. 2000 — ANNECY, FR`                     |

---

## 9. Accessibilité

- Contraste AA minimum partout, AAA pour le corps de texte.
- Focus visible : outline 2 px `--rust-400`, offset 2 px — jamais supprimé.
- Cibles tactiles ≥ 44 px.
- Navigation clavier complète, `skip-link` vers le contenu.
- Textes alternatifs descriptifs sur toutes les photos de la galerie.

---

## 10. Tokens CSS (référence d'implémentation)

```css
:root {
  /* Couleurs */
  --ink-950: #141110;
  --ink-900: #1c1815;
  --ink-800: #292320;
  --ink-600: #57504a;
  --ink-300: #a89f97;
  --paper-100: #ede8e3;
  --paper-50: #f7f4f0;
  --rust-500: #c4552a;
  --rust-400: #e06a38;
  --rust-700: #8a3a1d;
  --ok: #7a9b6d;
  --err: #c24444;

  /* Typographie */
  --font-display: "PP Neue Montreal", "General Sans", sans-serif;
  --font-body: "General Sans", system-ui, sans-serif;
  --font-mono: "Fragment Mono", monospace;

  --text-hero: clamp(3.4375rem, 7.5vw, 6.875rem); /* 55 → 110px */
  --text-h1: 5.5625rem; /* 89px */
  --text-h2: 3.4375rem; /* 55px */
  --text-h3: 2.125rem; /* 34px */
  --text-lg: 1.3125rem; /* 21px */
  --text-base: 1rem; /* 16px */
  --text-sm: 0.875rem; /* 14px */
  --text-meta: 0.8125rem; /* 13px */

  /* Espacement (échelle Fibonacci) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 13px;
  --space-4: 21px;
  --space-5: 34px;
  --space-6: 55px;
  --space-7: 89px;
  --space-8: 144px;

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1); /* proche expo.out */
  --dur-fast: 200ms; /* micro-interactions */
  --dur-roll: 250ms; /* text rolls */
  --dur-reveal: 700ms; /* reveals de section */
  --dur-transition: 1000ms; /* transition de page */
}
```
