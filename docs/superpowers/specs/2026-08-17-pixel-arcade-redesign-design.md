# Pixel-Arcade Redesign — Design

**Date:** 2026-08-17
**Status:** Approved for planning
**Scope:** Full visual and structural redesign of the Nordiana Sahira portfolio site into a retro pixel-art / arcade aesthetic, based on a supplied reference design.

---

## 1. Goal

Replace the current navy/blue flat design with a retro 8-bit arcade design system: black-outlined pixel frames with hard drop shadows, a purple/neon palette, `Press Start 2P` and `VT323` typography, and arcade-flavored interaction (typing terminal, marquee ticker, floating particles, scroll progress bar, RPG-style skill meters, achievement cards, and a playable mini-game).

All existing real content is preserved. No content is invented — every new string is derived from what already lives in the repo.

## 2. Constraints and decisions

| Decision | Choice | Rationale |
|---|---|---|
| Styling approach | Keep CSS Modules; extend, do not replace | Matches existing repo convention; avoids a Tailwind toolchain change for a job this size. The clip-path/hard-shadow frame system needs hand-written CSS regardless. |
| Shared primitives | One global `src/styles/pixel.css` | The frame system, buttons, eyebrows, tags and reveal animation appear in every section. Duplicating them across nine module files is strictly worse than one small global sheet. |
| Fonts | `@fontsource` packages, not Google Fonts CDN | The repo already uses `@fontsource/outfit` and `@fontsource/roboto`. Keeps builds self-contained and offline-capable. |
| Imagery | Real photos, crisp, inside pixel frames | This is a résumé site a recruiter will read. Retro character comes from the frame and palette; faces and project screenshots stay legible. |
| Interactive scope | Full — terminal, ticker, particles, progress bar, meters, achievements, mini-game | Explicitly chosen. |
| Hero right column | Photo, not terminal (deviates from reference) | A résumé site should put a face above the fold. The terminal moves to About, still landing in section two. |
| Copy for new sections | Derived from existing repo content | Skill levels read off her own Hero/About wording; achievements from CGPA, internship count, and project count already in the data files. |

### Open input

`CONTACT_EMAIL` is not present anywhere in the repo and could not be extracted from `public/resume.pdf` (only referee addresses were recoverable). Until the real address is supplied, the primary contact CTA renders as **CONNECT ON LINKEDIN** pointing at the existing LinkedIn URL. The email address lives in exactly one place — a single exported constant in the Contact component — so switching to an `✉ EMAIL ME` mailto button is a one-line change with no other edits.

## 3. Design tokens

Rewrite `src/vars.css`:

```
--bg          #120c1e   page background
--panel       #231a3d   card interior
--panel-soft  #2c2150   raised/secondary interior
--outline     #000000   every border and hard shadow
--text        #f5f1ff
--muted       #a99fcf
--yellow      #ffd23f   primary action
--pink        #ff4d7d   accent 1
--green       #33ff9e   accent 2
--blue        #4fd6ff   accent 3
--purple      #b98bff   accent 4
--pf-step     8px       pixel-frame corner notch size
--pf-border   4px       pixel-frame border thickness

--font-pixel  "Press Start 2P"   headings, labels, buttons
--font-mono   "VT323"            body copy, terminal, tags
--font-ui     "Inter"            nav links, small UI text
```

The old `--color-primary/secondary/dark/bg` tokens are removed. Every module file is rewritten against the new set; no module may reference a removed token.

## 4. Global primitives — `src/styles/pixel.css`

- `.pfClip` — the twelve-point `clip-path` polygon producing notched pixel corners
- `.pfOuter` / `.pfInner` — the two-layer frame: black outer padded by `--pf-border`, panel-colored inner, `drop-shadow(6px 6px 0)` on the outer
- `.pfSm` / `.pfLg` — token overrides for smaller/larger frames
- `.btn`, `.btnPrimary`, `.btnGhost` — 3px outline, 4px hard shadow, translate on hover, invert on active
- `.eyebrow` + `.lv` — the `LV.01 SECTION NAME` label pattern
- `.tag`, `.chip` — VT323 pills with 2px outlines
- `.reveal` / `.inView` — the scroll-reveal transition pair
- `body::before` — 26px grid overlay; `body::after` — scanline overlay
- A `@media (prefers-reduced-motion: reduce)` block neutralizing every animation defined in this file

## 5. Components

### New

| Component | Responsibility | Depends on |
|---|---|---|
| `PixelFrame` | Renders the two-layer notched frame. Props: `size` (`sm\|md\|lg`), `className`, `children`. Every card in the site goes through it. | `pixel.css` |
| `ScrollProgress` | Fixed 6px top bar, width = scroll fraction. Passive scroll listener. | — |
| `Particles` | Nine absolutely-positioned drifting squares. Purely decorative, `aria-hidden`. Renders nothing under reduced motion. | `usePrefersReducedMotion` |
| `Terminal` | Types command/response pairs from a prop, then a blinking cursor. Renders all lines instantly under reduced motion. Cancels its own timers on unmount. | `usePrefersReducedMotion` |
| `Ticker` | Duplicated marquee track, CSS-animated. `aria-hidden`. | — |
| `Skills` | Three `LV.n` meters plus framed skill-icon chips. Meters animate in on reveal. | `useReveal`, `skillGroups.json` |
| `Achievements` | Four stat cards; numeric values count up on reveal. | `useReveal`, `achievements.json` |
| `Game` | Canvas dodge-the-bugs runner with character picker. | `usePrefersReducedMotion` |

### Hooks

- `useReveal()` — returns a ref and an `inView` boolean via `IntersectionObserver` (threshold 0.15), unobserving after first intersection. Falls back to immediately-visible when `IntersectionObserver` is absent or reduced motion is set.
- `usePrefersReducedMotion()` — subscribes to the media query and re-renders on change.

### Modified

`App.jsx`, `Navbar`, `Hero`, `About`, `Experience`, `Projects`, `ProjectCard`, `Contact`, and each of their `.module.css` files. `index.html` gets an updated `<title>` and a `theme-color` meta matching `--bg`.

### Deleted

`src/components/Skills/Skill.jsx` and `src/components/Skills/skill.module.css` — a dead duplicate of `Experience` that is never imported. Its filename slot is taken by the new `Skills.jsx`.

### New data files

`src/data/skillGroups.json` and `src/data/achievements.json`, following the existing `projects.json` / `history.json` / `skills.json` pattern so content stays editable without touching components.

## 6. Section-by-section

### Navbar
Fixed pill with `rgba(35,26,61,0.88)` + blur and a 3px black outline; shrinks its padding past 40px of scroll. Text logo `diana.exe` in `Press Start 2P` with `.exe` in pink. Links: About, Experience, Projects, Skills. Pink `SAY HI` CTA to `#contact`.

The existing hamburger menu is **kept** and restyled as a pixel button. The reference merely hides its nav links below 720px; adopting that would be a mobile regression. The four social icon links currently in the navbar move to the Contact section, where the reference places them.

### Hero
Two-column grid. Left: blinking `★ PRESS START ★`, `HI, I'M DIANA.` in `Press Start 2P` with a pink accent word, her existing bio in VT323, and two buttons — `▶ SEE MY WORK` → `#projects`, `✉ LET'S TALK` → `#contact`.

Right: `assets/hero/dianaprofile.png` in a `pf-lg` frame with a `P1` tag, three floating stickers (`🐘 PHP`, `🔷 LARAVEL`, `⚛️ REACT`), and a mouse-driven 3D tilt. Tilt is disabled under reduced motion and on non-hover pointers.

### Ticker
Full-width band between Hero and About:
`OPEN TO WORK • PHP · LARAVEL · REACT · JAVA • INFORMATION SYSTEMS ENGINEERING • CGPA 3.44 • BUILDING SYSTEMS SINCE 2021 •`

### About — `LV.01`
Two columns. Left: the `Terminal` component, typing:

```
$ whoami        → Nordiana Sahira — Information Systems Engineering grad
$ stack         → PHP · Laravel · Java · React · Python
$ experience    → 3 internships, 2+ years building systems
$ availability  → Open to opportunities ✓
```

Right: her existing intro paragraph, then the two education entries from the current markup as framed cards — UiTM Jasin BSc (Hons) Information Systems Engineering, CGPA 3.44, and UiTM Jasin Diploma in Computer Science, CGPA 3.30 — each with its existing icon (`serverIcon.png`, `uiIcon.png`) in a small pixel frame.

`assets/about/aboutdiana.png` is retired from the layout (file left in the repo).

### Experience — `LV.02`
The three entries from `history.json` as `pf-outer` cards. Company logo in a small pixel frame, `role, organisation` in `Press Start 2P`, date range as a yellow pixel tag, and the bullet list in VT323 with `▸` markers replacing the current inline SVG arrows.

The skills rendering currently nested inside this section is removed and becomes its own section.

### Projects — `LV.03`
`ProjectCard` rebuilt: screenshot in a framed header, title in `Press Start 2P`, VT323 description, `skills[]` rendered as `.tag` chips, and a 6px lift on hover. Cards stagger their reveal.

The `demo` / `source` links stay commented out — both point at `example.com` placeholders in `projects.json`.

### Skills — `LV.04`
Three meters, ten segments each, levels derived from her own wording in Hero and About:

- `FRONTEND` — LV.7 — HTML, CSS, Bootstrap, React, Mobirise
- `BACKEND` — LV.8 — PHP, Laravel, Node.js, Python, Java, C++
- `TOOLS` — LV.7 — XAMPP, Laragon, phpMyAdmin, WordPress

Every name above appears in `Hero.jsx`, `About.jsx`, `history.json`, `projects.json` or `skills.json`. No tool is added that she has not claimed.

Filled segments scale in with a staggered delay on reveal. Below each meter, the existing skill icons from `assets/skills/` render as framed chips so the current assets stay in use.

### Achievements — `★`
Four cards, every figure traceable to existing repo content:

| Icon | Value | Label | Source |
|---|---|---|---|
| 🎓 | 3.44 | CGPA, BSc Information Systems Engineering | `About.jsx` |
| 💼 | 3 | internships and placements completed | `history.json` |
| 🚀 | 3 | systems shipped end to end | `projects.json` |
| ⏱️ | 2+ YRS | hands-on programming since 2021 | `About.jsx`, `history.json` |

Numeric values count up on reveal; static under reduced motion.

### Contact — `FINAL`
Replaces the current copyright-only footer. Centered `READY PLAYER TWO?`, a short line of copy, primary + secondary buttons (see §2 Open input for the primary), and social pills for GitHub, LinkedIn and Instagram using the URLs currently in `Navbar.jsx`. The existing copyright line moves into a restyled `<footer>` beneath.

### Game — `★ SECRET LEVEL`
The reference's canvas runner, ported to React: refs instead of module-scope mutable state, `cancelAnimationFrame` and listener removal in the effect cleanup, and the character picker as component state. Space/ArrowUp only intercept the page scroll when the canvas is on screen. Under reduced motion the section renders the canvas in its idle state with the animation loop never started, and says so.

## 7. Accessibility and motion

- Every animation defined anywhere in the redesign is neutralized under `prefers-reduced-motion: reduce`: particles unmounted, terminal rendered statically, tilt disabled, meters pre-filled, counters static, ticker and reveals frozen, `scroll-behavior` reset to `auto`.
- Decorative layers (particles, ticker, grid, scanlines) carry `aria-hidden="true"`.
- `:focus-visible` outlines on every pixel button, nav link and social pill — the reference defines none.
- The mobile hamburger menu is preserved.
- Body copy uses VT323 at 18–20px, sized up from the reference's defaults, since VT323 runs small.

## 8. Verification

The repo has no test framework and this change is almost entirely visual, so verification is build, lint, and browser inspection:

1. `npm run build` completes clean.
2. `npm run lint` passes at `--max-warnings 0` (the repo's existing setting).
3. Dev server driven in a real browser via Playwright: screenshot every section at 1440px and 390px widths.
4. Reduced-motion path checked by emulating `prefers-reduced-motion: reduce` and confirming the terminal renders complete, meters are pre-filled, and no particles are mounted.
5. Console checked for errors and for React unmount warnings after navigating away.
6. Every image referenced still resolves — no 404s in the network log.

## 9. Out of scope

- Rewriting the résumé PDF
- Adding real `demo` / `source` URLs to `projects.json`
- Any change to build tooling, deployment, or dependencies beyond the three `@fontsource` packages
- Refactoring unrelated to the redesign
