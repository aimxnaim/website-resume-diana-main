# Pixel-Arcade Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Nordiana Sahira portfolio from its navy flat design into a retro 8-bit arcade site, preserving all real content and adding terminal, ticker, skill-meter, achievements and mini-game sections.

**Architecture:** Keep the existing Vite + React 18 + CSS Modules structure. Replace the design tokens in `src/vars.css`, add one global `src/styles/pixel.css` holding the primitives that repeat in every section (pixel frame, buttons, eyebrows, tags, reveal), then rewrite each component's module CSS against the new tokens. New sections arrive as new components with their own module CSS, driven by JSON data files matching the existing `projects.json` / `history.json` pattern.

**Tech Stack:** Vite 4, React 18, CSS Modules, `@fontsource` (Press Start 2P, VT323, Inter), Canvas 2D for the mini-game. No new runtime dependencies beyond the three font packages.

**Spec:** `docs/superpowers/specs/2026-08-17-pixel-arcade-redesign-design.md`

---

## Global Constraints

- **Palette, verbatim:** `--bg #120c1e`, `--panel #231a3d`, `--panel-soft #2c2150`, `--outline #000000`, `--text #f5f1ff`, `--muted #a99fcf`, `--yellow #ffd23f`, `--pink #ff4d7d`, `--green #33ff9e`, `--blue #4fd6ff`, `--purple #b98bff`.
- **Frame geometry:** `--pf-step 8px`, `--pf-border 4px`; `sm` variant `5px/3px`; `lg` variant `10px/5px`.
- **Fonts:** `Press Start 2P` for headings/labels/buttons, `VT323` for body copy and terminal, `Inter` for nav and small UI. Loaded via `@fontsource` imports in `src/main.jsx` — never a Google Fonts CDN link.
- **No invented content.** Every user-visible string must trace to `Hero.jsx`, `About.jsx`, `history.json`, `projects.json`, `skills.json`, or `Navbar.jsx` as they exist at the start of this plan. Skill levels and achievement figures are fixed by this plan; do not adjust them.
- **Contact email is unknown.** The primary contact CTA is `CONNECT ON LINKEDIN` using `https://www.linkedin.com/in/nordiana-sahira/`. The address lives in one exported constant so it can be swapped later.
- **Reduced motion is mandatory.** Every animation added anywhere must be neutralized under `prefers-reduced-motion: reduce`.
- **The mobile hamburger menu must survive.** The reference design hides nav links below 720px with no replacement; do not copy that.
- **React.StrictMode double-invokes effects in dev.** Every effect that starts a timer, animation frame, or event listener must clean up fully, and must be safe to run twice.
- **Lint gate:** `npm run lint` runs at `--max-warnings 0`. Warnings fail.

### Verification Cycle

This repo has **no test framework**, and the approved spec (§9) rules out adding one — the work is almost entirely CSS and visual composition, where unit tests would assert little of value. In place of the usual red/green TDD cycle, every task below ends with this three-part gate, and each task states its own specific browser assertions:

1. `npm run lint` — must exit 0.
2. `npm run build` — must exit 0.
3. `npm run dev`, then check the named assertions in a real browser. Use Playwright (`mcp__playwright__browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, `browser_console_messages`). Zero console errors is part of every gate.

A task is not done until all three pass. If a task's browser assertion cannot be confirmed, stop and report rather than moving on.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `src/styles/pixel.css` | Global primitives: frame system, buttons, eyebrow, tag/chip, reveal, body overlays |
| `src/components/PixelFrame/PixelFrame.jsx` | The two-layer notched frame, used by every card |
| `src/components/PixelFrame/PixelFrame.module.css` | Frame-local styles |
| `src/hooks/usePrefersReducedMotion.js` | Live boolean for the reduced-motion media query |
| `src/hooks/useReveal.js` | `IntersectionObserver` ref + `inView` flag |
| `src/components/ScrollProgress/*` | Fixed top progress bar |
| `src/components/Particles/*` | Drifting decorative pixels |
| `src/components/Ticker/*` | Marquee band |
| `src/components/Terminal/*` | Typing terminal |
| `src/components/Skills/Skills.jsx` + `Skills.module.css` | LV meters + skill chips |
| `src/components/Achievements/*` | Four stat cards with count-up |
| `src/components/Game/*` | Canvas dodge-the-bugs runner |
| `src/data/skillGroups.json` | Meter groups and levels |
| `src/data/achievements.json` | Stat card content |

**Modified:** `src/vars.css`, `src/index.css`, `src/main.jsx`, `src/App.jsx`, `src/App.module.css`, `index.html`, and every file under `src/components/{Navbar,Hero,About,Experience,Projects,Contact}/`.

**Deleted:** `src/components/Skills/Skill.jsx`, `src/components/Skills/skill.module.css` — a dead duplicate of `Experience` that nothing imports.

---

### Task 1: Design foundation — tokens, fonts, global primitives

**Files:**
- Modify: `src/vars.css` (full rewrite)
- Modify: `src/index.css` (full rewrite)
- Modify: `src/main.jsx:6-7` (font imports)
- Modify: `src/App.module.css` (full rewrite)
- Modify: `index.html:5-7`
- Create: `src/styles/pixel.css`

**Interfaces:**
- Consumes: nothing.
- Produces: the CSS custom properties listed in Global Constraints, and these **global** class names available to every later task: `pf-clip`, `pf-outer`, `pf-inner`, `pf-sm`, `pf-lg`, `btn`, `btn-primary`, `btn-ghost`, `eyebrow`, `lv`, `tag`, `chip`, `chip-c1`, `chip-c2`, `chip-c3`, `pixel-font`, `section`, `section-head`, `reveal`, `in-view`. These are plain global classes (not CSS Module exports) — reference them as literal strings, e.g. `className="btn btn-primary"`, or combined with module classes as `` className={`${styles.card} pf-outer`} ``.

- [ ] **Step 1: Install the font packages**

```bash
npm install @fontsource/press-start-2p @fontsource/vt323 @fontsource/inter
```

- [ ] **Step 2: Rewrite `src/vars.css`**

```css
:root {
  /* Surfaces */
  --color-bg: #120c1e;
  --color-panel: #231a3d;
  --color-panel-soft: #2c2150;
  --color-outline: #000000;

  /* Type */
  --color-text: #f5f1ff;
  --color-muted: #a99fcf;

  /* Accents */
  --color-yellow: #ffd23f;
  --color-pink: #ff4d7d;
  --color-green: #33ff9e;
  --color-blue: #4fd6ff;
  --color-purple: #b98bff;

  /* Pixel frame geometry */
  --pf-step: 8px;
  --pf-border: 4px;

  /* Fonts */
  --font-pixel: "Press Start 2P", monospace;
  --font-mono: "VT323", monospace;
  --font-ui: "Inter", system-ui, sans-serif;
}
```

Note: the old `--color-primary`, `--color-secondary`, `--color-dark` and `--font-roboto` tokens are gone. Later tasks rewrite every module that referenced them; until then the site will look broken in places, which is expected.

- [ ] **Step 3: Rewrite `src/index.css`**

```css
@import "./vars.css";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-ui);
  line-height: 1.6;
  overflow-x: hidden;
}

h1,
h2,
h3 {
  line-height: 1.25;
}

a {
  color: inherit;
  text-decoration: none;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 4: Create `src/styles/pixel.css`**

```css
@import "../vars.css";

/* ---------- backdrop overlays ---------- */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 26px 26px;
  pointer-events: none;
  z-index: 0;
}

body::after {
  content: "";
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.18) 0px,
    rgba(0, 0, 0, 0.18) 1px,
    transparent 2px,
    transparent 3px
  );
  pointer-events: none;
  z-index: 60;
  opacity: 0.5;
}

/* ---------- layout ---------- */
.section {
  position: relative;
  z-index: 1;
  padding: 120px 24px;
  max-width: 1120px;
  margin: 0 auto;
}

.section-head {
  margin-bottom: 48px;
  max-width: 640px;
}

.section-head h2 {
  font-family: var(--font-pixel);
  font-size: clamp(18px, 2.6vw, 26px);
}

.pixel-font {
  font-family: var(--font-pixel);
}

/* ---------- pixel frame ---------- */
.pf-clip {
  clip-path: polygon(
    0 var(--pf-step),
    var(--pf-step) var(--pf-step),
    var(--pf-step) 0,
    calc(100% - var(--pf-step)) 0,
    calc(100% - var(--pf-step)) var(--pf-step),
    100% var(--pf-step),
    100% calc(100% - var(--pf-step)),
    calc(100% - var(--pf-step)) calc(100% - var(--pf-step)),
    calc(100% - var(--pf-step)) 100%,
    var(--pf-step) 100%,
    var(--pf-step) calc(100% - var(--pf-step)),
    0 calc(100% - var(--pf-step))
  );
}

.pf-outer {
  background: var(--color-outline);
  padding: var(--pf-border);
  filter: drop-shadow(6px 6px 0 rgba(0, 0, 0, 0.55));
  transition: transform 0.2s ease;
}

.pf-inner {
  background: var(--color-panel);
  height: 100%;
}

.pf-sm {
  --pf-step: 5px;
  --pf-border: 3px;
}

.pf-lg {
  --pf-step: 10px;
  --pf-border: 5px;
}

/* ---------- buttons ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  font-family: var(--font-ui);
  font-weight: 700;
  font-size: 14px;
  border: 3px solid var(--color-outline);
  box-shadow: 4px 4px 0 var(--color-outline);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  cursor: pointer;
}

.btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--color-outline);
}

.btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--color-outline);
}

.btn-primary {
  background: var(--color-yellow);
  color: #1a1024;
}

.btn-ghost {
  background: var(--color-panel);
  color: var(--color-text);
}

/* ---------- focus (the reference defines none) ---------- */
a:focus-visible,
button:focus-visible {
  outline: 3px solid var(--color-green);
  outline-offset: 3px;
}

/* ---------- eyebrow ---------- */
.eyebrow {
  font-family: var(--font-pixel);
  font-size: 11px;
  color: var(--color-green);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.eyebrow .lv {
  background: var(--color-outline);
  color: var(--color-yellow);
  padding: 4px 8px;
}

/* ---------- tags & chips ---------- */
.tag {
  font-family: var(--font-mono);
  font-size: 15px;
  padding: 3px 10px;
  background: var(--color-panel-soft);
  border: 2px solid var(--color-outline);
  color: var(--color-muted);
}

.chip {
  font-family: var(--font-mono);
  font-size: 18px;
  padding: 6px 14px;
  border: 2px solid var(--color-outline);
  transition: transform 0.15s ease;
}

.chip:hover {
  transform: translateY(-3px);
}

.chip-c1 {
  background: rgba(255, 77, 125, 0.16);
  color: var(--color-pink);
}

.chip-c2 {
  background: rgba(79, 214, 255, 0.16);
  color: var(--color-blue);
}

.chip-c3 {
  background: rgba(51, 255, 158, 0.16);
  color: var(--color-green);
}

/* ---------- scroll reveal ---------- */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .pf-outer,
  .btn,
  .chip {
    transition: none;
  }
}
```

- [ ] **Step 5: Update `src/main.jsx` font imports**

Replace lines 6-7 (`import "@fontsource/outfit";` / `import "@fontsource/roboto";`) with:

```jsx
import "@fontsource/press-start-2p";
import "@fontsource/vt323";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./styles/pixel.css";
```

Keep `import "./index.css";` above these so `pixel.css` wins on cascade ties.

- [ ] **Step 6: Rewrite `src/App.module.css`**

```css
@import "./vars.css";

.App {
  position: relative;
  width: 100%;
  min-height: 100vh;
}
```

The old rule set `overflow: hidden` and a fixed `height: 100%`, which clips the new full-page sections. Removing it is required, not optional.

- [ ] **Step 7: Update `index.html` head**

Replace the `<title>` line and add a theme color, so lines 5-7 read:

```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#120c1e" />
    <title>Nordiana Sahira — Information Systems Engineer</title>
```

- [ ] **Step 8: Verify**

Run `npm run lint`, then `npm run build`, then `npm run dev`.

Browser assertions:
- Page background is dark purple `#120c1e`, not navy.
- A faint 26px grid and horizontal scanlines are visible over the whole page.
- Existing text renders in Inter (not Outfit) — the old sections will look unstyled and broken in places. **This is expected at this stage.**
- Console has zero errors.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json src/vars.css src/index.css src/main.jsx src/App.module.css src/styles/pixel.css index.html
git commit -m "feat: replace design tokens with pixel-arcade system"
```

---

### Task 2: Motion hooks and page chrome

**Files:**
- Create: `src/hooks/usePrefersReducedMotion.js`
- Create: `src/hooks/useReveal.js`
- Create: `src/components/ScrollProgress/ScrollProgress.jsx`
- Create: `src/components/ScrollProgress/ScrollProgress.module.css`
- Create: `src/components/Particles/Particles.jsx`
- Create: `src/components/Particles/Particles.module.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: tokens and globals from Task 1.
- Produces:
  - `usePrefersReducedMotion(): boolean` — default export absent; named export. Re-renders on media query change.
  - `useReveal(): [React.RefObject<HTMLElement>, boolean]` — attach the ref to any element; the boolean flips true once it enters the viewport, and never flips back.
  - `<ScrollProgress />`, `<Particles />` — both self-contained, no props.

- [ ] **Step 1: Create `src/hooks/usePrefersReducedMotion.js`**

```js
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () => window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (event) => setReduced(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
};
```

- [ ] **Step 2: Create `src/hooks/useReveal.js`**

```js
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export const useReveal = () => {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return undefined;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return [ref, inView];
};
```

- [ ] **Step 3: Create `src/components/ScrollProgress/ScrollProgress.module.css`**

```css
@import "../../vars.css";

.track {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--color-outline);
  z-index: 100;
}

.fill {
  height: 100%;
  width: 0;
  background: repeating-linear-gradient(
    45deg,
    var(--color-yellow) 0 8px,
    var(--color-pink) 8px 16px
  );
}
```

- [ ] **Step 4: Create `src/components/ScrollProgress/ScrollProgress.jsx`**

```jsx
import React, { useEffect, useRef } from "react";

import styles from "./ScrollProgress.module.css";

export const ScrollProgress = () => {
  const fillRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

      if (fillRef.current) {
        fillRef.current.style.width = `${pct}%`;
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <div className={styles.fill} ref={fillRef} />
    </div>
  );
};
```

- [ ] **Step 5: Create `src/components/Particles/Particles.module.css`**

```css
@import "../../vars.css";

.field {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  bottom: -20px;
  width: 8px;
  height: 8px;
  opacity: 0;
  animation: drift linear infinite;
}

@keyframes drift {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.85;
  }
  90% {
    opacity: 0.85;
  }
  100% {
    transform: translateY(-110vh) translateX(24px);
    opacity: 0;
  }
}
```

- [ ] **Step 6: Create `src/components/Particles/Particles.jsx`**

```jsx
import React from "react";

import styles from "./Particles.module.css";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const PARTICLES = [
  { left: "4%", color: "var(--color-yellow)", duration: "10s", delay: "0s" },
  { left: "14%", color: "var(--color-pink)", duration: "13s", delay: "2s" },
  { left: "24%", color: "var(--color-blue)", duration: "9s", delay: "4s" },
  { left: "38%", color: "var(--color-green)", duration: "12s", delay: "1s" },
  { left: "52%", color: "var(--color-yellow)", duration: "11s", delay: "5s" },
  { left: "66%", color: "var(--color-pink)", duration: "14s", delay: "3s" },
  { left: "78%", color: "var(--color-blue)", duration: "10s", delay: "6s" },
  { left: "88%", color: "var(--color-green)", duration: "13s", delay: "2.5s" },
  { left: "95%", color: "var(--color-yellow)", duration: "9s", delay: "4.5s" },
];

export const Particles = () => {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className={styles.field} aria-hidden="true">
      {PARTICLES.map((particle, id) => (
        <span
          key={id}
          className={styles.particle}
          style={{
            left: particle.left,
            background: particle.color,
            animationDuration: particle.duration,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};
```

- [ ] **Step 7: Wire both into `src/App.jsx`**

```jsx
import styles from "./App.module.css";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { Experience } from "./components/Experience/Experience";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Particles } from "./components/Particles/Particles";
import { Projects } from "./components/Projects/Projects";
import { ScrollProgress } from "./components/ScrollProgress/ScrollProgress";

function App() {
  return (
    <div className={styles.App}>
      <ScrollProgress />
      <Particles />
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </div>
  );
}

export default App;
```

- [ ] **Step 8: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- A 6px striped yellow/pink bar sits at the very top and its width grows as you scroll; at the bottom of the page it fills the full width.
- Small colored squares drift upward behind the content.
- With `prefers-reduced-motion: reduce` emulated, **no** particle elements exist in the DOM (query `[class*="particle"]` → 0 results), and the progress bar still tracks scroll.
- Console has zero errors, including no React StrictMode warnings.

- [ ] **Step 9: Commit**

```bash
git add src/hooks src/components/ScrollProgress src/components/Particles src/App.jsx
git commit -m "feat: add motion hooks, scroll progress bar and particle field"
```

---

### Task 3: PixelFrame primitive and Hero section

**Files:**
- Create: `src/components/PixelFrame/PixelFrame.jsx`
- Create: `src/components/PixelFrame/PixelFrame.module.css`
- Modify: `src/components/Hero/Hero.jsx` (full rewrite)
- Modify: `src/components/Hero/Hero.module.css` (full rewrite)

**Interfaces:**
- Consumes: `usePrefersReducedMotion` from Task 2; globals `pf-outer`, `pf-inner`, `pf-clip`, `pf-sm`, `pf-lg`, `btn`, `btn-primary`, `btn-ghost` from Task 1.
- Produces: `<PixelFrame size="sm" | "md" | "lg" className innerClassName {...rest}>` — `size` defaults to `"md"`. Renders an outer black div and an inner panel div; children land inside the inner div. Extra props spread onto the outer div. Every later task uses this for cards.

- [ ] **Step 1: Create `src/components/PixelFrame/PixelFrame.module.css`**

```css
.outer {
  display: block;
}

.inner {
  display: block;
}
```

- [ ] **Step 2: Create `src/components/PixelFrame/PixelFrame.jsx`**

```jsx
import React from "react";

import styles from "./PixelFrame.module.css";

const SIZE_CLASS = {
  sm: "pf-sm",
  md: "",
  lg: "pf-lg",
};

export const PixelFrame = ({
  size = "md",
  className = "",
  innerClassName = "",
  children,
  ...rest
}) => {
  const outer = ["pf-outer", "pf-clip", SIZE_CLASS[size], styles.outer, className]
    .filter(Boolean)
    .join(" ");
  const inner = ["pf-inner", "pf-clip", styles.inner, innerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={outer} {...rest}>
      <div className={inner}>{children}</div>
    </div>
  );
};
```

- [ ] **Step 3: Rewrite `src/components/Hero/Hero.jsx`**

The bio paragraph is copied verbatim from the current file — do not reword it.

```jsx
import React, { useEffect, useRef } from "react";

import styles from "./Hero.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { getImageUrl } from "../../utils";

const STICKERS = [
  { label: "🐘 PHP", className: styles.s1 },
  { label: "🔷 LARAVEL", className: styles.s2 },
  { label: "⚛️ REACT", className: styles.s3 },
];

export const Hero = () => {
  const sectionRef = useRef(null);
  const tiltRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const tilt = tiltRef.current;

    if (!section || !tilt) return undefined;
    if (reducedMotion || !window.matchMedia("(hover: hover)").matches) {
      tilt.style.transform = "";
      return undefined;
    }

    const onMove = (event) => {
      const rect = section.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      tilt.style.transform = `rotateX(${relY * -10}deg) rotateY(${relX * 10}deg)`;
    };

    const onLeave = () => {
      tilt.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  return (
    <section className={styles.container} id="hero" ref={sectionRef}>
      <div className={styles.grid}>
        <div className={styles.content}>
          <div className={styles.pressStart}>★ PRESS START ★</div>
          <h1 className={styles.title}>
            HI, I&apos;M <span className={styles.accent}>DIANA</span>.
            <br />I BUILD SYSTEMS
            <br />THAT SHIP.
          </h1>
          <p className={styles.description}>
            I&apos;m a recent graduate with a degree in Information Systems
            Engineering, passionate about systems and related fields. I have
            hands-on experience with programming languages such as Java, PHP,
            HTML, CSS, Python, and JavaScript. Additionally, I have a solid
            understanding of Laravel framework concepts and possess a strong
            skill set in system development programming and system
            documentation.
          </p>
          <div className={styles.actions}>
            <a href="#projects" className="btn btn-primary">
              ▶ SEE MY WORK
            </a>
            <a href="#contact" className="btn btn-ghost">
              ✉ LET&apos;S TALK
            </a>
          </div>
        </div>

        <div className={styles.photoWrap}>
          <div className={styles.p1Tag}>P1</div>
          {STICKERS.map((sticker) => (
            <div
              key={sticker.label}
              className={`${styles.sticker} ${sticker.className}`}
            >
              {sticker.label}
            </div>
          ))}
          <div className={styles.tiltCard} ref={tiltRef}>
            <PixelFrame size="lg" innerClassName={styles.photoInner}>
              <img
                src={getImageUrl("hero/dianaprofile.png")}
                alt="Nordiana Sahira"
                className={styles.photo}
              />
            </PixelFrame>
          </div>
        </div>
      </div>
    </section>
  );
};
```

`PixelFrame` does not forward refs, so the tilt transform goes on a plain wrapper div around it — that div carries `perspective`'s child transform while the frame keeps its own `drop-shadow`.

- [ ] **Step 4: Rewrite `src/components/Hero/Hero.module.css`**

```css
@import "../../vars.css";

.container {
  composes: section from global;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 160px;
  padding-bottom: 80px;
}

.grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;
  width: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.pressStart {
  font-family: var(--font-pixel);
  font-size: 11px;
  color: var(--color-yellow);
  margin-bottom: 18px;
  animation: blink 1.1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.title {
  font-family: var(--font-pixel);
  font-size: clamp(20px, 3.2vw, 34px);
  margin-bottom: 22px;
}

.accent {
  color: var(--color-pink);
}

.description {
  font-family: var(--font-mono);
  font-size: 20px;
  color: var(--color-muted);
  max-width: 520px;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.photoWrap {
  position: relative;
  perspective: 900px;
}

.tiltCard {
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.2s ease;
}

.photoInner {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo {
  display: block;
  width: 100%;
  height: auto;
}

.p1Tag {
  position: absolute;
  top: -14px;
  left: -14px;
  background: var(--color-yellow);
  color: #1a1024;
  font-family: var(--font-pixel);
  font-size: 9px;
  padding: 6px 8px;
  border: 3px solid var(--color-outline);
  z-index: 3;
}

.sticker {
  position: absolute;
  font-family: var(--font-pixel);
  font-size: 10px;
  padding: 8px 10px;
  background: var(--color-panel);
  border: 3px solid var(--color-outline);
  box-shadow: 3px 3px 0 var(--color-outline);
  animation: float 5s ease-in-out infinite;
  z-index: 2;
}

.s1 {
  top: -20px;
  right: -24px;
  color: var(--color-blue);
  animation-delay: 0s;
}

.s2 {
  bottom: 40px;
  right: -30px;
  color: var(--color-pink);
  animation-delay: 1.2s;
}

.s3 {
  bottom: -24px;
  left: 24px;
  color: var(--color-yellow);
  animation-delay: 2.1s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media screen and (max-width: 830px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 72px;
  }

  .photoWrap {
    max-width: 320px;
    margin: 0 auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pressStart,
  .sticker {
    animation: none;
  }

  .tiltCard {
    transform: none !important;
    transition: none;
  }
}
```

Note `composes: section from global` — this is how a CSS Module pulls in a global class from `pixel.css`. Later tasks use the same idiom for their section containers.

- [ ] **Step 5: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- Hero fills the viewport: blinking `★ PRESS START ★`, a Press Start 2P headline with `DIANA` in pink, VT323 body copy, and two pixel buttons with hard black shadows.
- Her photo sits in a thick black notched frame with a `P1` tag top-left and three floating stickers.
- Moving the mouse across the hero tilts the framed photo in 3D; leaving it resets to flat.
- Clicking `▶ SEE MY WORK` jumps to the projects section.
- At 390px width the grid is a single column and the photo is centered.
- Under `prefers-reduced-motion: reduce`, nothing blinks or floats and the tilt does not respond to the mouse.

- [ ] **Step 6: Commit**

```bash
git add src/components/PixelFrame src/components/Hero
git commit -m "feat: add PixelFrame primitive and rebuild hero"
```

---

### Task 4: Navbar

**Files:**
- Modify: `src/components/Navbar/Navbar.jsx` (full rewrite)
- Modify: `src/components/Navbar/Navbar.module.css` (full rewrite)

**Interfaces:**
- Consumes: globals from Task 1.
- Produces: `<Navbar />` — unchanged export name and signature. The four social links currently living here move out; Task 11 (Contact) takes ownership of them. Do not delete the URLs before Task 11 is written — they are reproduced in that task.

- [ ] **Step 1: Rewrite `src/components/Navbar/Navbar.jsx`**

```jsx
import React, { useEffect, useState } from "react";

import styles from "./Navbar.module.css";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={styles.header}>
      <div className={`${styles.inner} ${scrolled ? styles.scrolled : ""}`}>
        <a href="#hero" className={styles.logo}>
          diana<span>.exe</span>
        </a>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
          <ul className={styles.list} onClick={() => setMenuOpen(false)}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className={styles.cta}
            onClick={() => setMenuOpen(false)}
          >
            SAY HI
          </a>
        </div>
      </div>
    </header>
  );
};
```

- [ ] **Step 2: Rewrite `src/components/Navbar/Navbar.module.css`**

```css
@import "../../vars.css";

.header {
  position: fixed;
  top: 6px;
  left: 0;
  right: 0;
  z-index: 70;
  display: flex;
  justify-content: center;
  padding: 16px 24px;
}

.inner {
  width: 100%;
  max-width: 920px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(35, 26, 61, 0.88);
  backdrop-filter: blur(10px);
  border: 3px solid var(--color-outline);
  padding: 12px 18px;
  transition: padding 0.25s ease;
}

.scrolled {
  padding: 7px 16px;
}

.logo {
  font-family: var(--font-pixel);
  font-size: 13px;
  color: var(--color-text);
}

.logo span {
  color: var(--color-pink);
}

.links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.list {
  list-style: none;
  display: flex;
  gap: 24px;
}

.list a {
  font-family: var(--font-ui);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-muted);
  transition: color 0.15s ease;
}

.list a:hover {
  color: var(--color-yellow);
}

.cta {
  font-family: var(--font-pixel);
  font-size: 10px;
  background: var(--color-pink);
  color: #1a1024;
  padding: 10px 14px;
  border: 3px solid var(--color-outline);
  box-shadow: 3px 3px 0 var(--color-outline);
  white-space: nowrap;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.cta:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--color-outline);
}

.menuBtn {
  display: none;
  background: var(--color-panel-soft);
  color: var(--color-text);
  border: 3px solid var(--color-outline);
  box-shadow: 3px 3px 0 var(--color-outline);
  font-size: 16px;
  line-height: 1;
  padding: 8px 12px;
  cursor: pointer;
}

@media screen and (max-width: 830px) {
  .menuBtn {
    display: block;
  }

  .links {
    display: none;
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    background: var(--color-panel);
    border: 3px solid var(--color-outline);
    box-shadow: 5px 5px 0 var(--color-outline);
    padding: 20px 24px;
  }

  .open {
    display: flex;
  }

  .list {
    flex-direction: column;
    gap: 14px;
  }

  .cta {
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .inner,
  .cta {
    transition: none;
  }
}
```

- [ ] **Step 3: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- A floating black-outlined nav pill is centered at the top with `diana.exe` (`.exe` in pink) on the left and four links plus a pink `SAY HI` button on the right.
- Scrolling past 40px visibly shrinks the pill's vertical padding.
- Each nav link scrolls to its section; `SAY HI` scrolls to contact.
- At 390px width the links collapse behind a `☰` button; tapping it opens a framed dropdown, tapping a link closes it, and the icon toggles to `✕`.
- Tabbing through the nav shows a green focus outline on every link and the button.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar
git commit -m "feat: rebuild navbar as pixel nav pill with section links"
```

---

### Task 5: Ticker

**Files:**
- Create: `src/components/Ticker/Ticker.jsx`
- Create: `src/components/Ticker/Ticker.module.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: nothing beyond Task 1 tokens.
- Produces: `<Ticker />` — no props, renders a full-bleed marquee band. Placed between `<Hero />` and `<About />`.

- [ ] **Step 1: Create `src/components/Ticker/Ticker.module.css`**

```css
@import "../../vars.css";

.ticker {
  width: 100%;
  overflow: hidden;
  background: var(--color-panel-soft);
  border-top: 3px solid var(--color-outline);
  border-bottom: 3px solid var(--color-outline);
  position: relative;
  z-index: 1;
}

.track {
  display: flex;
  width: max-content;
  animation: marquee 24s linear infinite;
}

.item {
  font-family: var(--font-pixel);
  font-size: 12px;
  color: var(--color-yellow);
  padding: 16px 0;
  white-space: nowrap;
}

.item:nth-child(2) {
  color: var(--color-pink);
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none;
  }
}
```

- [ ] **Step 2: Create `src/components/Ticker/Ticker.jsx`**

Every claim in `MESSAGE` traces to `Hero.jsx`, `About.jsx` or `history.json`.

```jsx
import React from "react";

import styles from "./Ticker.module.css";

const MESSAGE =
  "OPEN TO WORK  •  PHP · LARAVEL · REACT · JAVA  •  INFORMATION SYSTEMS ENGINEERING  •  CGPA 3.44  •  BUILDING SYSTEMS SINCE 2021  •  ";

export const Ticker = () => (
  <div className={styles.ticker} aria-hidden="true">
    <div className={styles.track}>
      <span className={styles.item}>{MESSAGE}</span>
      <span className={styles.item}>{MESSAGE}</span>
    </div>
  </div>
);
```

- [ ] **Step 3: Wire into `src/App.jsx`**

Add `import { Ticker } from "./components/Ticker/Ticker";` and place `<Ticker />` between `<Hero />` and `<About />`.

- [ ] **Step 4: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- A full-width band with 3px black top and bottom borders sits directly below the hero.
- Yellow Press Start 2P text scrolls right-to-left and loops with no visible gap or jump at the wrap point.
- Under `prefers-reduced-motion: reduce` the text is static.
- The band does not cause a horizontal scrollbar on the page at any width.

- [ ] **Step 5: Commit**

```bash
git add src/components/Ticker src/App.jsx
git commit -m "feat: add marquee ticker band"
```

---

### Task 6: Terminal component and About section

**Files:**
- Create: `src/components/Terminal/Terminal.jsx`
- Create: `src/components/Terminal/Terminal.module.css`
- Modify: `src/components/About/About.jsx` (full rewrite)
- Modify: `src/components/About/About.module.css` (full rewrite)

**Interfaces:**
- Consumes: `PixelFrame` (Task 3), `usePrefersReducedMotion` and `useReveal` (Task 2).
- Produces: `<Terminal title="..." lines={[{ prompt, result }]} />` — types each pair in sequence, then leaves a blinking cursor. Renders every line immediately when reduced motion is set.

- [ ] **Step 1: Create `src/components/Terminal/Terminal.module.css`**

```css
@import "../../vars.css";

.terminal {
  overflow: hidden;
}

.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-panel-soft);
  border-bottom: 3px solid var(--color-outline);
}

.dot {
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-outline);
}

.red {
  background: var(--color-pink);
}

.yellow {
  background: var(--color-yellow);
}

.green {
  background: var(--color-green);
}

.barTitle {
  margin-left: 6px;
  font-family: var(--font-mono);
  font-size: 16px;
  color: var(--color-muted);
}

.body {
  padding: 20px;
  font-family: var(--font-mono);
  font-size: 19px;
  min-height: 240px;
}

.line {
  margin-bottom: 6px;
  color: var(--color-muted);
}

.prompt {
  color: var(--color-green);
}

.result {
  color: var(--color-text);
}

.cursor {
  display: inline-block;
  width: 10px;
  height: 18px;
  background: var(--color-yellow);
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
  }
}
```

- [ ] **Step 2: Create `src/components/Terminal/Terminal.jsx`**

The typing runs off a single interval driven by a character counter, so it is fully cancellable and safe under StrictMode's double-invoke.

```jsx
import React, { useEffect, useState } from "react";

import styles from "./Terminal.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const CHAR_MS = 32;
const PAUSE_CHARS = 8;

export const Terminal = ({ title, lines }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [typed, setTyped] = useState(0);

  const steps = [];
  lines.forEach((line, index) => {
    for (let i = 1; i <= line.prompt.length; i += 1) {
      steps.push({ index, promptChars: i, showResult: false });
    }
    for (let i = 0; i < PAUSE_CHARS; i += 1) {
      steps.push({ index, promptChars: line.prompt.length, showResult: false });
    }
    steps.push({ index, promptChars: line.prompt.length, showResult: true });
    for (let i = 0; i < PAUSE_CHARS; i += 1) {
      steps.push({ index, promptChars: line.prompt.length, showResult: true });
    }
  });

  const total = steps.length;
  const done = reducedMotion || typed >= total;

  useEffect(() => {
    if (reducedMotion) return undefined;

    setTyped(0);
    const id = setInterval(() => {
      setTyped((value) => {
        if (value >= total) {
          clearInterval(id);
          return value;
        }
        return value + 1;
      });
    }, CHAR_MS);

    return () => clearInterval(id);
  }, [reducedMotion, total]);

  const current = done ? null : steps[typed];

  return (
    <PixelFrame size="lg" innerClassName={styles.terminal}>
      <div className={styles.bar}>
        <span className={`${styles.dot} ${styles.red}`} />
        <span className={`${styles.dot} ${styles.yellow}`} />
        <span className={`${styles.dot} ${styles.green}`} />
        <span className={styles.barTitle}>{title}</span>
      </div>
      <div className={styles.body}>
        {lines.map((line, index) => {
          const visible = done || index < current.index;
          const active = !done && index === current.index;

          if (!visible && !active) return null;

          const promptText = visible
            ? line.prompt
            : line.prompt.slice(0, current.promptChars);
          const showResult = visible || current.showResult;

          return (
            <div key={line.prompt}>
              <div className={styles.line}>
                <span className={styles.prompt}>{promptText}</span>
              </div>
              {showResult && (
                <div className={`${styles.line} ${styles.result}`}>
                  {line.result}
                </div>
              )}
            </div>
          );
        })}
        {done && (
          <div className={styles.line}>
            <span className={styles.prompt}>$ </span>
            <span className={styles.cursor} />
          </div>
        )}
      </div>
    </PixelFrame>
  );
};
```

- [ ] **Step 3: Rewrite `src/components/About/About.jsx`**

The intro paragraph and both education entries are copied verbatim from the current file.

```jsx
import React from "react";

import styles from "./About.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { Terminal } from "../Terminal/Terminal";
import { useReveal } from "../../hooks/useReveal";
import { getImageUrl } from "../../utils";

const TERMINAL_LINES = [
  {
    prompt: "$ whoami",
    result: "Nordiana Sahira — Information Systems Engineering grad",
  },
  { prompt: "$ stack", result: "PHP · Laravel · Java · React · Python" },
  {
    prompt: "$ experience",
    result: "3 internships, 2+ years building systems",
  },
  { prompt: "$ availability", result: "Open to opportunities ✓" },
];

const EDUCATION = [
  {
    icon: "about/serverIcon.png",
    alt: "Server icon",
    school: "University Of Technology MARA, Jasin",
    detail:
      "Bachelor of Information Systems (Hons.) Information Systems Engineering — CGPA : 3.44",
  },
  {
    icon: "about/uiIcon.png",
    alt: "UI icon",
    school: "University Of Technology MARA, Jasin",
    detail: "Diploma in Computer Science — CGPA : 3.30",
  },
];

export const About = () => {
  const [ref, inView] = useReveal();

  return (
    <section className={styles.container} id="about">
      <div
        ref={ref}
        className={`${styles.grid} reveal ${inView ? "in-view" : ""}`}
      >
        <div className={styles.terminalCol}>
          <Terminal title="diana@portfolio: ~" lines={TERMINAL_LINES} />
        </div>

        <div className={styles.text}>
          <div className="eyebrow">
            <span className="lv">LV.01</span> ABOUT ME
          </div>
          <h2 className={styles.heading}>NICE TO MEET YOU.</h2>
          <p className={styles.intro}>
            Throughout my university studies, I have gained nearly 2 years of
            hands-on programming experience, particularly excelling in building
            websites from the ground up. My front-end skills include
            technologies such as CSS, Bootstrap, React.js, and Mobirise.
            Additionally, I possess back-end expertise in Node.js, Laravel,
            Laragon, and XAMPP, allowing me to build full-stack applications
            that are both dynamic and responsive.
          </p>

          <ul className={styles.education}>
            {EDUCATION.map((entry) => (
              <li key={entry.detail}>
                <PixelFrame size="sm" innerClassName={styles.eduCard}>
                  <PixelFrame size="sm" innerClassName={styles.eduIcon}>
                    <img src={getImageUrl(entry.icon)} alt={entry.alt} />
                  </PixelFrame>
                  <div>
                    <h3 className={styles.eduSchool}>{entry.school}</h3>
                    <p className={styles.eduDetail}>{entry.detail}</p>
                  </div>
                </PixelFrame>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Rewrite `src/components/About/About.module.css`**

```css
@import "../../vars.css";

.container {
  composes: section from global;
}

.grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 48px;
  align-items: start;
}

.terminalCol {
  position: sticky;
  top: 120px;
}

.heading {
  font-family: var(--font-pixel);
  font-size: 20px;
  margin-bottom: 18px;
}

.intro {
  font-family: var(--font-mono);
  font-size: 20px;
  color: var(--color-muted);
  margin-bottom: 28px;
}

.education {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.eduCard {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px;
}

.eduIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  flex-shrink: 0;
}

.eduIcon img {
  display: block;
  width: 32px;
  height: 32px;
}

.eduSchool {
  font-family: var(--font-pixel);
  font-size: 11px;
  color: var(--color-yellow);
  margin-bottom: 8px;
}

.eduDetail {
  font-family: var(--font-mono);
  font-size: 18px;
  color: var(--color-muted);
}

@media screen and (max-width: 830px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .terminalCol {
    position: static;
  }
}
```

- [ ] **Step 5: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- Scrolling to About reveals a two-column layout: a framed terminal on the left, `LV.01 ABOUT ME` eyebrow and copy on the right.
- The terminal types `$ whoami` character by character, prints the result, continues through all four lines, and finishes with a blinking yellow cursor.
- Both education cards render with their icon in a small nested frame, CGPA 3.44 and 3.30 intact.
- The terminal column stays pinned while the right column scrolls past it on desktop.
- Under `prefers-reduced-motion: reduce`, all four command/result pairs are present immediately on load with no typing.
- Console shows no "state update on unmounted component" warnings after navigating away mid-type.

- [ ] **Step 6: Commit**

```bash
git add src/components/Terminal src/components/About
git commit -m "feat: add typing terminal and rebuild about section"
```

---

### Task 7: Experience section

**Files:**
- Modify: `src/components/Experience/Experience.jsx` (full rewrite)
- Modify: `src/components/Experience/Experience.module.css` (full rewrite)

**Interfaces:**
- Consumes: `PixelFrame` (Task 3), `useReveal` (Task 2), `src/data/history.json` (unchanged).
- Produces: `<Experience />` — same export name. **The skills rendering is removed from this component**; Task 9 builds it as a standalone `<Skills />` section. Do not leave a `<h2>Skills</h2>` inside `#experience`.

- [ ] **Step 1: Rewrite `src/components/Experience/Experience.jsx`**

```jsx
import React from "react";

import styles from "./Experience.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { useReveal } from "../../hooks/useReveal";
import history from "../../data/history.json";
import { getImageUrl } from "../../utils";

const HistoryCard = ({ item }) => {
  const [ref, inView] = useReveal();

  return (
    <li ref={ref} className={`reveal ${inView ? "in-view" : ""}`}>
      <PixelFrame innerClassName={styles.card}>
        <div className={styles.cardHead}>
          <PixelFrame size="sm" innerClassName={styles.logo}>
            <img
              src={getImageUrl(item.imageSrc)}
              alt={`${item.organisation} logo`}
            />
          </PixelFrame>
          <div>
            <h3 className={styles.role}>{item.role}</h3>
            <p className={styles.org}>{item.organisation}</p>
            <span className={styles.dates}>
              {item.startDate.trim()} — {item.endDate.trim()}
            </span>
          </div>
        </div>

        <ul className={styles.bullets}>
          {item.experiences.map((experience, id) => (
            <li key={id} className={styles.bullet}>
              <span className={styles.marker} aria-hidden="true">
                ▸
              </span>
              <span>{experience.trim()}</span>
            </li>
          ))}
        </ul>
      </PixelFrame>
    </li>
  );
};

export const Experience = () => {
  const [headRef, headInView] = useReveal();

  return (
    <section className={styles.container} id="experience">
      <div
        ref={headRef}
        className={`section-head reveal ${headInView ? "in-view" : ""}`}
      >
        <div className="eyebrow">
          <span className="lv">LV.02</span> WHERE I&apos;VE WORKED
        </div>
        <h2>EXPERIENCE</h2>
      </div>

      <ul className={styles.history}>
        {history.map((item, id) => (
          <HistoryCard key={id} item={item} />
        ))}
      </ul>
    </section>
  );
};
```

- [ ] **Step 2: Rewrite `src/components/Experience/Experience.module.css`**

```css
@import "../../vars.css";

.container {
  composes: section from global;
}

.history {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.card {
  padding: 26px;
}

.cardHead {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 20px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  flex-shrink: 0;
  background: var(--color-panel-soft);
}

.logo img {
  display: block;
  width: 72px;
  height: auto;
}

.role {
  font-family: var(--font-pixel);
  font-size: 13px;
  color: var(--color-text);
  margin-bottom: 8px;
}

.org {
  font-family: var(--font-mono);
  font-size: 19px;
  color: var(--color-blue);
  margin-bottom: 10px;
}

.dates {
  display: inline-block;
  font-family: var(--font-pixel);
  font-size: 9px;
  background: var(--color-yellow);
  color: #1a1024;
  border: 2px solid var(--color-outline);
  padding: 5px 8px;
}

.bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bullet {
  display: flex;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 19px;
  color: var(--color-muted);
}

.marker {
  color: var(--color-green);
  flex-shrink: 0;
}

@media screen and (max-width: 620px) {
  .cardHead {
    flex-direction: column;
  }
}
```

- [ ] **Step 3: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- Three framed job cards appear, in `history.json` order: Personel MySTEP (Jabatan Perangkaan Malaysia Negeri Johor), Tech Intern (Perbendaharaan Negeri Johor), Tech Intern (Bahagian Perancang Negeri).
- Each card shows its company logo in a small nested frame, role in Press Start 2P, organisation in blue VT323, and a yellow date tag.
- Bullets render with a green `▸` marker and no stray hyphen or SVG arrow.
- Cards fade and slide up as they scroll into view.
- **The `#experience` section contains no "Skills" heading and no skill icons** — that content is gone until Task 9 reintroduces it as its own section.

- [ ] **Step 4: Commit**

```bash
git add src/components/Experience
git commit -m "feat: rebuild experience as pixel job cards, split out skills"
```

---

### Task 8: Projects section

**Files:**
- Modify: `src/components/Projects/Projects.jsx` (full rewrite)
- Modify: `src/components/Projects/Projects.module.css` (full rewrite)
- Modify: `src/components/Projects/ProjectCard.jsx` (full rewrite)
- Modify: `src/components/Projects/ProjectCard.module.css` (full rewrite)

**Interfaces:**
- Consumes: `PixelFrame` (Task 3), `useReveal` (Task 2), `src/data/projects.json` (unchanged), globals `tag`, `section-head`.
- Produces: `<Projects />` and `<ProjectCard project={...} />` — same export names and the same `project` prop shape as today.

- [ ] **Step 1: Rewrite `src/components/Projects/ProjectCard.jsx`**

The `demo` and `source` links stay out — both are `example.com` placeholders in `projects.json`.

```jsx
import React from "react";

import styles from "./ProjectCard.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { useReveal } from "../../hooks/useReveal";
import { getImageUrl } from "../../utils";

export const ProjectCard = ({
  project: { title, imageSrc, description, skills },
  index = 0,
}) => {
  const [ref, inView] = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <PixelFrame className={styles.card} innerClassName={styles.inner}>
        <div className={styles.shot}>
          <img src={getImageUrl(imageSrc)} alt={`Screenshot of ${title}`} />
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{title.trim()}</h3>
          <p className={styles.description}>{description.trim()}</p>
          <ul className={styles.skills}>
            {skills.map((skill, id) => (
              <li key={id} className="tag">
                {skill.trim()}
              </li>
            ))}
          </ul>
        </div>
      </PixelFrame>
    </div>
  );
};
```

- [ ] **Step 2: Rewrite `src/components/Projects/ProjectCard.module.css`**

```css
@import "../../vars.css";

.card {
  height: 100%;
}

.card:hover {
  transform: translateY(-6px);
}

.inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.shot {
  border-bottom: 3px solid var(--color-outline);
  background: var(--color-panel-soft);
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.shot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.title {
  font-family: var(--font-pixel);
  font-size: 13px;
  line-height: 1.6;
}

.description {
  font-family: var(--font-mono);
  font-size: 19px;
  color: var(--color-muted);
  flex: 1;
}

.skills {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (prefers-reduced-motion: reduce) {
  .card:hover {
    transform: none;
  }
}
```

- [ ] **Step 3: Rewrite `src/components/Projects/Projects.jsx`**

```jsx
import React from "react";

import styles from "./Projects.module.css";
import { ProjectCard } from "./ProjectCard";
import { useReveal } from "../../hooks/useReveal";
import projects from "../../data/projects.json";

export const Projects = () => {
  const [headRef, headInView] = useReveal();

  return (
    <section className={styles.container} id="projects">
      <div
        ref={headRef}
        className={`section-head reveal ${headInView ? "in-view" : ""}`}
      >
        <div className="eyebrow">
          <span className="lv">LV.03</span> SELECTED WORK
        </div>
        <h2>THINGS I&apos;VE BUILT</h2>
      </div>

      <div className={styles.grid}>
        {projects.map((project, id) => (
          <ProjectCard key={id} project={project} index={id} />
        ))}
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Rewrite `src/components/Projects/Projects.module.css`**

```css
@import "../../vars.css";

.container {
  composes: section from global;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  align-items: stretch;
}

@media screen and (max-width: 760px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- Three project cards render in a two-column grid: the e-Scarve system, the Taman Pahlawan Reporting System, and Website Portfolio.
- Each card shows its screenshot filling a 16:9 framed header with a 3px divider, a Press Start 2P title, VT323 description, and skill tags as bordered pills.
- Hovering a card lifts it 6px.
- Cards reveal in a staggered sequence, roughly 80ms apart.
- No `Demo` or `Source` links appear.
- Network log shows `escarve.png`, `tamanpahlawan.png` and `website.png` all loading with status 200.

- [ ] **Step 6: Commit**

```bash
git add src/components/Projects
git commit -m "feat: rebuild project cards in pixel frames"
```

---

### Task 9: Skills section

**Files:**
- Create: `src/data/skillGroups.json`
- Create: `src/components/Skills/Skills.jsx`
- Create: `src/components/Skills/Skills.module.css`
- Delete: `src/components/Skills/Skill.jsx`
- Delete: `src/components/Skills/skill.module.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `PixelFrame` (Task 3), `useReveal` (Task 2), `getImageUrl`.
- Produces: `<Skills />` — renders `#skills`. Placed between `<Projects />` and `<Contact />` in `App.jsx`.

Note on the deletions: `src/components/Skills/Skill.jsx` exports a symbol named `Experience` and is never imported anywhere. Confirm with `grep -rn "Skills/Skill" src` returning nothing before deleting.

- [ ] **Step 1: Create `src/data/skillGroups.json`**

Levels and names are fixed by the spec. Every name appears in `Hero.jsx`, `About.jsx`, `history.json`, `projects.json` or `skills.json`.

```json
[
  {
    "title": "FRONTEND",
    "level": 7,
    "accent": "c1",
    "chips": ["HTML", "CSS", "Bootstrap", "React", "Mobirise"],
    "icons": ["skills/htmll.png", "skills/csss.png", "skills/reactt.png"]
  },
  {
    "title": "BACKEND",
    "level": 8,
    "accent": "c2",
    "chips": ["PHP", "Laravel", "Node.js", "Python", "Java", "C++"],
    "icons": [
      "skills/php.png",
      "skills/laravel.png",
      "skills/nodee.png",
      "skills/python.png",
      "skills/c+++.png"
    ]
  },
  {
    "title": "TOOLS",
    "level": 7,
    "accent": "c3",
    "chips": ["XAMPP", "Laragon", "phpMyAdmin", "WordPress"],
    "icons": ["skills/xampp.png", "skills/laragon.png"]
  }
]
```

- [ ] **Step 2: Create `src/components/Skills/Skills.module.css`**

```css
@import "../../vars.css";

.container {
  composes: section from global;
}

.group {
  margin-bottom: 40px;
}

.meterRow {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.meterLabel {
  font-family: var(--font-pixel);
  font-size: 12px;
  color: var(--color-text);
}

.meterLevel {
  font-family: var(--font-mono);
  font-size: 20px;
  color: var(--color-muted);
}

.meterBar {
  display: flex;
  gap: 4px;
  margin-bottom: 18px;
}

.seg {
  width: 26px;
  height: 14px;
  background: var(--color-panel-soft);
  border: 2px solid var(--color-outline);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s ease;
}

.filled.c1 {
  background: var(--color-pink);
}

.filled.c2 {
  background: var(--color-blue);
}

.filled.c3 {
  background: var(--color-green);
}

.inView .seg {
  transform: scaleX(1);
}

.chipRow {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.iconRow {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: var(--color-panel-soft);
}

.icon img {
  display: block;
  width: 34px;
  height: 34px;
  object-fit: contain;
}

@media (prefers-reduced-motion: reduce) {
  .seg {
    transform: scaleX(1);
    transition: none;
  }
}
```

- [ ] **Step 3: Create `src/components/Skills/Skills.jsx`**

```jsx
import React from "react";

import styles from "./Skills.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { useReveal } from "../../hooks/useReveal";
import skillGroups from "../../data/skillGroups.json";
import { getImageUrl } from "../../utils";

const SEGMENTS = 10;

const SkillGroup = ({ group }) => {
  const [ref, inView] = useReveal();

  return (
    <div
      ref={ref}
      className={`${styles.group} ${inView ? styles.inView : ""}`}
    >
      <div className={styles.meterRow}>
        <span className={styles.meterLabel}>{group.title}</span>
        <span className={styles.meterLevel}>LV.{group.level}</span>
      </div>

      <div className={styles.meterBar}>
        {Array.from({ length: SEGMENTS }, (_, id) => (
          <span
            key={id}
            className={`${styles.seg} ${
              id < group.level ? `${styles.filled} ${styles[group.accent]}` : ""
            }`}
            style={{ transitionDelay: `${id * 45}ms` }}
          />
        ))}
      </div>

      <div className={styles.chipRow}>
        {group.chips.map((chip) => (
          <span key={chip} className={`chip chip-${group.accent}`}>
            {chip}
          </span>
        ))}
      </div>

      <div className={styles.iconRow}>
        {group.icons.map((icon) => (
          <PixelFrame key={icon} size="sm" innerClassName={styles.icon}>
            <img src={getImageUrl(icon)} alt="" aria-hidden="true" />
          </PixelFrame>
        ))}
      </div>
    </div>
  );
};

export const Skills = () => {
  const [headRef, headInView] = useReveal();

  return (
    <section className={styles.container} id="skills">
      <div
        ref={headRef}
        className={`section-head reveal ${headInView ? "in-view" : ""}`}
      >
        <div className="eyebrow">
          <span className="lv">LV.04</span> MY TOOLBOX
        </div>
        <h2>STUFF I BUILD WITH</h2>
      </div>

      {skillGroups.map((group) => (
        <SkillGroup key={group.title} group={group} />
      ))}
    </section>
  );
};
```

- [ ] **Step 4: Delete the dead files and wire in the new section**

```bash
grep -rn "Skills/Skill" src   # must return nothing
git rm src/components/Skills/Skill.jsx src/components/Skills/skill.module.css
```

Then in `src/App.jsx` add `import { Skills } from "./components/Skills/Skills";` and place `<Skills />` between `<Projects />` and `<Contact />`.

- [ ] **Step 5: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- A `#skills` section renders below Projects with the `LV.04 MY TOOLBOX` eyebrow.
- Three meters appear: `FRONTEND LV.7` with 7 of 10 segments pink, `BACKEND LV.8` with 8 blue, `TOOLS LV.7` with 7 green.
- Segments wipe in left-to-right in a staggered sequence when the group scrolls into view.
- Chip rows render in the matching accent color; the skill PNG icons render below each group in small frames.
- Under `prefers-reduced-motion: reduce`, all segments are already at full width on load.
- The `SKILLS` nav link scrolls here.

- [ ] **Step 6: Commit**

```bash
git add src/data/skillGroups.json src/components/Skills src/App.jsx
git commit -m "feat: add skills section with RPG level meters"
```

---

### Task 10: Achievements section

**Files:**
- Create: `src/data/achievements.json`
- Create: `src/components/Achievements/Achievements.jsx`
- Create: `src/components/Achievements/Achievements.module.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `PixelFrame` (Task 3), `useReveal` and `usePrefersReducedMotion` (Task 2).
- Produces: `<Achievements />` — placed between `<Skills />` and `<Contact />`.

- [ ] **Step 1: Create `src/data/achievements.json`**

`countTo` drives the count-up; entries without it render `value` as static text.

```json
[
  {
    "icon": "🎓",
    "value": "3.44",
    "label": "CGPA, BSc Information Systems Engineering"
  },
  {
    "icon": "💼",
    "value": "3",
    "countTo": 3,
    "label": "internships and placements completed"
  },
  {
    "icon": "🚀",
    "value": "3",
    "countTo": 3,
    "label": "systems shipped end to end"
  },
  {
    "icon": "⏱️",
    "value": "2+ YRS",
    "label": "hands-on programming since 2021"
  }
]
```

- [ ] **Step 2: Create `src/components/Achievements/Achievements.module.css`**

```css
@import "../../vars.css";

.container {
  composes: section from global;
}

.strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.card {
  padding: 22px 16px;
  text-align: center;
  height: 100%;
}

.icon {
  font-size: 26px;
  display: block;
  margin-bottom: 10px;
}

.value {
  font-family: var(--font-pixel);
  font-size: 13px;
  color: var(--color-yellow);
  display: inline-block;
  margin-bottom: 10px;
}

.pop {
  animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes pop {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.label {
  font-family: var(--font-mono);
  font-size: 17px;
  color: var(--color-muted);
}

@media screen and (max-width: 760px) {
  .strip {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pop {
    animation: none;
  }
}
```

- [ ] **Step 3: Create `src/components/Achievements/Achievements.jsx`**

```jsx
import React, { useEffect, useState } from "react";

import styles from "./Achievements.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { useReveal } from "../../hooks/useReveal";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import achievements from "../../data/achievements.json";

const DURATION = 1100;

const AchievementCard = ({ item, index }) => {
  const [ref, inView] = useReveal();
  const reducedMotion = usePrefersReducedMotion();
  const [count, setCount] = useState(item.countTo ? 0 : null);

  useEffect(() => {
    if (!inView || !item.countTo || reducedMotion) return undefined;

    let frame = 0;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * item.countTo));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setCount(item.countTo);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, item.countTo, reducedMotion]);

  const shown =
    item.countTo && !reducedMotion && count !== null
      ? String(count)
      : item.value;

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <PixelFrame size="sm" innerClassName={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          {item.icon}
        </span>
        <span className={`${styles.value} ${inView ? styles.pop : ""}`}>
          {shown}
        </span>
        <p className={styles.label}>{item.label}</p>
      </PixelFrame>
    </div>
  );
};

export const Achievements = () => {
  const [headRef, headInView] = useReveal();

  return (
    <section className={styles.container} id="achievements">
      <div
        ref={headRef}
        className={`section-head reveal ${headInView ? "in-view" : ""}`}
      >
        <div className="eyebrow">
          <span className="lv">★</span> ACHIEVEMENTS UNLOCKED
        </div>
        <h2>BY THE NUMBERS</h2>
      </div>

      <div className={styles.strip}>
        {achievements.map((item, id) => (
          <AchievementCard key={item.label} item={item} index={id} />
        ))}
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Wire into `src/App.jsx`**

Add `import { Achievements } from "./components/Achievements/Achievements";` and place `<Achievements />` between `<Skills />` and `<Contact />`.

- [ ] **Step 5: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- Four small framed cards render in one row on desktop, two columns at 390px.
- Values read `3.44`, `3`, `3`, `2+ YRS` with labels matching `achievements.json`.
- The two `countTo` cards visibly count from 0 up to 3 when scrolled into view; `3.44` and `2+ YRS` render as static text.
- Values pop-scale in on reveal.
- Under `prefers-reduced-motion: reduce`, all four values are final on load with no pop and no counting.

- [ ] **Step 6: Commit**

```bash
git add src/data/achievements.json src/components/Achievements src/App.jsx
git commit -m "feat: add achievements strip with count-up stats"
```

---

### Task 11: Contact section and footer

**Files:**
- Modify: `src/components/Contact/Contact.jsx` (full rewrite)
- Modify: `src/components/Contact/Contact.module.css` (full rewrite)

**Interfaces:**
- Consumes: `useReveal` (Task 2), globals `btn`, `btn-primary`, `btn-ghost`, `eyebrow`.
- Produces: `<Contact />` — same export name. Exports an additional named constant `CONTACT_EMAIL`, currently `null`. Renders `#contact` plus the footer that currently holds the copyright line.

The four social URLs below are carried over verbatim from `Navbar.jsx` as it existed before Task 4.

- [ ] **Step 1: Rewrite `src/components/Contact/Contact.jsx`**

```jsx
import React from "react";

import styles from "./Contact.module.css";
import { useReveal } from "../../hooks/useReveal";

// No email address is available for the site owner yet. Set this to a real
// address to switch the primary CTA from LinkedIn to a mailto: button.
export const CONTACT_EMAIL = null;

const LINKEDIN_URL = "https://www.linkedin.com/in/nordiana-sahira/";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Dodidee" },
  { label: "LinkedIn", href: LINKEDIN_URL },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nrdiananrzn/?next=%2F&hl=en",
  },
];

export const Contact = () => {
  const [ref, inView] = useReveal();

  return (
    <>
      <section className={styles.container} id="contact">
        <div ref={ref} className={`reveal ${inView ? "in-view" : ""}`}>
          <div className="eyebrow">
            <span className="lv">FINAL</span> GET IN TOUCH
          </div>
          <h2 className={styles.heading}>READY PLAYER TWO?</h2>
          <p className={styles.copy}>
            Open to opportunities in system development and web engineering.
            Let&apos;s build something together.
          </p>

          <div className={styles.actions}>
            {CONTACT_EMAIL ? (
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary">
                ✉ EMAIL ME
              </a>
            ) : (
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                ▶ CONNECT ON LINKEDIN
              </a>
            )}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              ⬇ RÉSUMÉ
            </a>
          </div>

          <div className={styles.socials}>
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pill}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Built and designed by Nordiana Sahira</span>
        <span>© 2024. All Rights Reserved.</span>
      </footer>
    </>
  );
};
```

- [ ] **Step 2: Rewrite `src/components/Contact/Contact.module.css`**

```css
@import "../../vars.css";

.container {
  composes: section from global;
  text-align: center;
}

.heading {
  font-family: var(--font-pixel);
  font-size: clamp(20px, 3.6vw, 30px);
  margin-bottom: 20px;
  line-height: 1.5;
}

.copy {
  font-family: var(--font-mono);
  font-size: 20px;
  color: var(--color-muted);
  max-width: 480px;
  margin: 0 auto 36px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.socials {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.pill {
  font-family: var(--font-mono);
  font-size: 17px;
  padding: 8px 18px;
  border: 2px solid var(--color-outline);
  background: var(--color-panel);
  color: var(--color-muted);
  transition: color 0.15s ease, transform 0.15s ease;
}

.pill:hover {
  color: var(--color-yellow);
  transform: translateY(-3px);
}

.footer {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
  padding: 40px 24px 60px;
  color: var(--color-muted);
  font-family: var(--font-mono);
  font-size: 17px;
  border-top: 3px solid var(--color-outline);
}

@media (prefers-reduced-motion: reduce) {
  .pill {
    transition: none;
  }

  .pill:hover {
    transform: none;
  }
}
```

- [ ] **Step 3: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- A centered `#contact` section renders `READY PLAYER TWO?` in Press Start 2P above two pixel buttons.
- The primary yellow button reads `▶ CONNECT ON LINKEDIN` and opens `linkedin.com/in/nordiana-sahira/` in a new tab.
- `⬇ RÉSUMÉ` opens `/resume.pdf` in a new tab and the PDF loads.
- Three social pills (GitHub, LinkedIn, Instagram) render and each opens the correct profile in a new tab.
- The footer beneath keeps both original copyright lines.
- The `SAY HI` nav button scrolls here.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact
git commit -m "feat: rebuild contact section with CTAs and social pills"
```

---

### Task 12: Bonus mini-game

**Files:**
- Create: `src/components/Game/Game.jsx`
- Create: `src/components/Game/Game.module.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `PixelFrame` (Task 3), `useReveal` and `usePrefersReducedMotion` (Task 2), globals `btn`, `btn-primary`, `btn-ghost`.
- Produces: `<Game />` — placed last, after `<Contact />`'s section but the component renders after Contact in `App.jsx`. Since `Contact` renders both `#contact` and the `<footer>`, insert `<Game />` **before** `<Contact />` so the footer stays at the bottom of the page.

All mutable game state lives in a single `useRef` object so React re-renders never reset a run, and the animation frame plus every listener is torn down in the effect cleanup.

- [ ] **Step 1: Create `src/components/Game/Game.module.css`**

```css
@import "../../vars.css";

.container {
  composes: section from global;
  text-align: center;
}

.head {
  margin: 0 auto 32px;
  max-width: 100%;
  text-align: center;
}

.head h2 {
  font-family: var(--font-pixel);
  font-size: clamp(18px, 2.6vw, 26px);
}

.hint {
  font-family: var(--font-mono);
  font-size: 19px;
  color: var(--color-muted);
  margin-bottom: 18px;
}

.hint strong {
  color: var(--color-yellow);
}

.charGrid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 28px;
}

.charOption {
  background: var(--color-panel);
  border: 3px solid var(--color-outline);
  padding: 14px 10px;
  width: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: var(--font-mono);
  color: var(--color-muted);
  box-shadow: 3px 3px 0 var(--color-outline);
  transition: transform 0.1s ease, box-shadow 0.1s ease,
    border-color 0.15s ease, color 0.15s ease;
}

.charOption:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--color-outline);
}

.selected {
  border-color: var(--color-yellow);
  color: var(--color-text);
}

.charEmoji {
  font-size: 28px;
  line-height: 1;
}

.charName {
  font-size: 15px;
  letter-spacing: 0.03em;
}

.screenWrap {
  max-width: 700px;
  margin: 0 auto;
}

.screen {
  padding: 10px;
  position: relative;
}

.canvas {
  display: block;
  width: 100%;
  max-width: 700px;
  height: auto;
  margin: 0 auto;
  touch-action: manipulation;
  cursor: pointer;
}

.overlay {
  position: absolute;
  inset: 10px;
  background: rgba(18, 12, 30, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.show {
  opacity: 1;
  pointer-events: all;
}

.overlayTitle {
  font-family: var(--font-pixel);
  font-size: 16px;
  color: var(--color-pink);
  margin-bottom: 12px;
}

.overlayScore {
  font-family: var(--font-mono);
  font-size: 22px;
  color: var(--color-text);
  margin-bottom: 18px;
}

.startRow {
  margin-top: 20px;
}

@media (prefers-reduced-motion: reduce) {
  .charOption,
  .overlay {
    transition: none;
  }
}
```

- [ ] **Step 2: Create `src/components/Game/Game.jsx`**

```jsx
import React, { useCallback, useEffect, useRef, useState } from "react";

import styles from "./Game.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const W = 700;
const H = 260;
const GROUND_Y = H - 40;

const CHARACTERS = [
  { emoji: "🧑‍💻", name: "CODER", color: "#33ff9e" },
  { emoji: "🥷", name: "NINJA", color: "#ff4d7d" },
  { emoji: "🤖", name: "ROBOT", color: "#4fd6ff" },
  { emoji: "👾", name: "ALIEN", color: "#ffd23f" },
  { emoji: "🧙", name: "WIZARD", color: "#b98bff" },
];

const makePlayer = () => ({
  x: 60,
  y: GROUND_Y - 30,
  w: 28,
  h: 30,
  vy: 0,
  jumping: false,
});

export const Game = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    player: makePlayer(),
    obstacles: [],
    speed: 5,
    score: 0,
    spawnTimer: 70,
    running: false,
    frame: 0,
  });
  const charRef = useRef(CHARACTERS[0]);
  const reducedMotion = usePrefersReducedMotion();

  const [character, setCharacter] = useState(CHARACTERS[0]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  charRef.current = character;

  const drawGround = useCallback((ctx) => {
    ctx.strokeStyle = "#a99fcf";
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(W, GROUND_Y);
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const drawPlayer = useCallback((ctx, player) => {
    ctx.font = "28px sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(charRef.current.emoji, player.x - 3, player.y + player.h - 2);
  }, []);

  const drawIdle = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#120c1e";
    ctx.fillRect(0, 0, W, H);
    drawGround(ctx);
    drawPlayer(ctx, makePlayer());
  }, [drawGround, drawPlayer]);

  // Redraw the idle frame whenever the character changes and no run is active.
  useEffect(() => {
    if (!stateRef.current.running) drawIdle();
  }, [character, drawIdle]);

  const startGame = useCallback(() => {
    const state = stateRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    cancelAnimationFrame(state.frame);
    state.player = makePlayer();
    state.obstacles = [];
    state.speed = 5;
    state.score = 0;
    state.spawnTimer = 70;
    state.running = true;
    setGameOver(false);

    const endGame = () => {
      state.running = false;
      cancelAnimationFrame(state.frame);
      const points = Math.floor(state.score / 5);
      setScore(points);
      setBest((current) => Math.max(current, points));
      setGameOver(true);
    };

    const loop = () => {
      if (!state.running) return;

      const { player } = state;
      player.vy += 0.6;
      player.y += player.vy;

      if (player.y > GROUND_Y - player.h) {
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.jumping = false;
      }

      state.spawnTimer -= 1;
      if (state.spawnTimer <= 0) {
        state.obstacles.push({ x: W, y: GROUND_Y - 24, w: 22, h: 24 });
        state.spawnTimer = Math.max(
          38,
          85 - state.speed * 4 + Math.random() * 30
        );
      }

      state.obstacles.forEach((o) => {
        o.x -= state.speed;
      });
      state.obstacles = state.obstacles.filter((o) => o.x + o.w > -10);

      const hit = state.obstacles.some(
        (o) =>
          player.x + 4 < o.x + o.w - 4 &&
          player.x + player.w - 4 > o.x + 4 &&
          player.y + 4 < o.y + o.h &&
          player.y + player.h > o.y + 4
      );

      if (hit) {
        endGame();
        return;
      }

      state.score += 1;
      state.speed += 0.0035;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#120c1e";
      ctx.fillRect(0, 0, W, H);
      drawGround(ctx);
      drawPlayer(ctx, player);

      ctx.font = "22px sans-serif";
      state.obstacles.forEach((o) => ctx.fillText("🐛", o.x, o.y + 20));

      ctx.font = '14px "Press Start 2P", monospace';
      ctx.fillStyle = charRef.current.color;
      ctx.fillText(`SCORE ${Math.floor(state.score / 5)}`, 16, 26);

      state.frame = requestAnimationFrame(loop);
    };

    state.frame = requestAnimationFrame(loop);
  }, [drawGround, drawPlayer]);

  const jump = useCallback(() => {
    const state = stateRef.current;

    if (!state.running) {
      startGame();
      return;
    }

    if (!state.player.jumping) {
      state.player.vy = -11.5;
      state.player.jumping = true;
    }
  }, [startGame]);

  // Draw the idle frame once, and tear the loop down on unmount.
  useEffect(() => {
    drawIdle();
    const state = stateRef.current;

    return () => {
      state.running = false;
      cancelAnimationFrame(state.frame);
    };
  }, [drawIdle]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code !== "Space" && event.code !== "ArrowUp") return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
      if (!onScreen) return;

      event.preventDefault();
      jump();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [jump]);

  return (
    <section className={styles.container} id="game">
      <div className={`section-head ${styles.head}`}>
        <div className="eyebrow">
          <span className="lv">★</span> SECRET LEVEL
        </div>
        <h2>BONUS: DODGE THE BUGS</h2>
      </div>

      <p className={styles.hint}>Choose your player:</p>
      <div className={styles.charGrid}>
        {CHARACTERS.map((option) => (
          <button
            key={option.name}
            type="button"
            className={`${styles.charOption} ${
              option.name === character.name ? styles.selected : ""
            }`}
            aria-pressed={option.name === character.name}
            onClick={() => setCharacter(option)}
          >
            <span className={styles.charEmoji} aria-hidden="true">
              {option.emoji}
            </span>
            <span className={styles.charName}>{option.name}</span>
          </button>
        ))}
      </div>

      <p className={styles.hint}>
        You scrolled this far, so here&apos;s a mini-game. Press{" "}
        <strong>SPACE</strong> or tap the screen to jump.
      </p>

      <div className={styles.screenWrap}>
        <PixelFrame size="lg" innerClassName={styles.screen}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className={styles.canvas}
            onPointerDown={jump}
          />
          <div
            className={`${styles.overlay} ${gameOver ? styles.show : ""}`}
            role="status"
          >
            <div>
              <p className={styles.overlayTitle}>GAME OVER</p>
              <p className={styles.overlayScore}>
                Score: {score} — Best: {best}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={startGame}
              >
                ▶ PLAY AGAIN
              </button>
            </div>
          </div>
        </PixelFrame>
      </div>

      <div className={styles.startRow}>
        <button type="button" className="btn btn-ghost" onClick={jump}>
          ▶ INSERT COIN TO START
        </button>
      </div>

      {reducedMotion && (
        <p className={styles.hint} style={{ marginTop: "18px" }}>
          Reduced motion is on — the game is paused. Press START to play anyway.
        </p>
      )}
    </section>
  );
};
```

- [ ] **Step 3: Wire into `src/App.jsx`**

Add `import { Game } from "./components/Game/Game";` and place `<Game />` **before** `<Contact />`, so the footer that `Contact` renders stays last on the page.

- [ ] **Step 4: Verify**

Run `npm run lint`, `npm run build`, `npm run dev`.

Browser assertions:
- A `#game` section renders above the contact section with five character buttons; the CODER button starts selected.
- Clicking a different character redraws the idle canvas with that emoji.
- Clicking `▶ INSERT COIN TO START` begins a run: the character falls to the dashed ground line, 🐛 obstacles scroll in from the right, and the SCORE counter climbs in the character's accent color.
- Pressing Space jumps; pressing Space while the canvas is off-screen does **not** block page scrolling.
- Colliding with a bug shows the `GAME OVER` overlay with a score and a best score; `▶ PLAY AGAIN` starts a fresh run and the best score persists across runs.
- Tapping the canvas jumps on touch.
- Under `prefers-reduced-motion: reduce`, the canvas renders the idle frame with no loop running and the reduced-motion note appears.
- Navigating away and back leaves no runaway animation frame — console stays clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/Game src/App.jsx
git commit -m "feat: add dodge-the-bugs bonus mini-game"
```

---

### Task 13: Full-site verification sweep

**Files:**
- Modify: any file needing a fix found during the sweep.
- Create: `docs/superpowers/plans/2026-08-17-pixel-arcade-verification.md` (findings log)

**Interfaces:**
- Consumes: everything from Tasks 1-12.
- Produces: a verified site and a short findings log.

- [ ] **Step 1: Confirm the final `src/App.jsx`**

It must read exactly:

```jsx
import styles from "./App.module.css";
import { About } from "./components/About/About";
import { Achievements } from "./components/Achievements/Achievements";
import { Contact } from "./components/Contact/Contact";
import { Experience } from "./components/Experience/Experience";
import { Game } from "./components/Game/Game";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Particles } from "./components/Particles/Particles";
import { Projects } from "./components/Projects/Projects";
import { ScrollProgress } from "./components/ScrollProgress/ScrollProgress";
import { Skills } from "./components/Skills/Skills";
import { Ticker } from "./components/Ticker/Ticker";

function App() {
  return (
    <div className={styles.App}>
      <ScrollProgress />
      <Particles />
      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Achievements />
      <Game />
      <Contact />
    </div>
  );
}

export default App;
```

- [ ] **Step 2: Confirm no stale tokens survive**

```bash
grep -rn "color-primary\|color-secondary\|color-dark\|font-roboto\|Outfit\|@fontsource/outfit\|@fontsource/roboto" src/ index.html package.json
```

Expected: no matches. If `@fontsource/outfit` or `@fontsource/roboto` still appear in `package.json`, remove them with `npm uninstall @fontsource/outfit @fontsource/roboto`.

- [ ] **Step 3: Build and lint**

```bash
npm run lint
npm run build
```

Both must exit 0.

- [ ] **Step 4: Desktop pass at 1440px**

Serve the production build with `npm run preview`, then in the browser at 1440×900 screenshot each of: hero, ticker, about, experience, projects, skills, achievements, game, contact.

Check: no horizontal scrollbar anywhere; every section's eyebrow reads the right level (`LV.01` About, `LV.02` Experience, `LV.03` Projects, `LV.04` Skills, `★` Achievements, `★` Secret Level, `FINAL` Contact); all frames show their notched corners and hard shadows.

- [ ] **Step 5: Mobile pass at 390px**

Repeat the screenshots at 390×844.

Check: hamburger menu opens and closes; hero is single-column; project grid is one column; achievements are two columns; the game canvas scales down inside its frame; no element overflows the viewport width.

- [ ] **Step 6: Reduced-motion pass**

Emulate `prefers-reduced-motion: reduce` and reload.

Check: zero particle elements in the DOM; terminal shows all four lines immediately; skill meters are fully drawn on load; achievement values are final with no counting; ticker is static; nothing blinks or floats; the hero photo does not tilt on mouse move.

- [ ] **Step 7: Asset and console audit**

Check the network log for any request returning 404 — every file under `assets/` referenced by `getImageUrl` must resolve, as must `/resume.pdf`. Then read the console: zero errors and zero React warnings across a full scroll of the page plus one game run.

- [ ] **Step 8: Link audit**

Click every link: four nav links, `SAY HI`, both hero buttons, both contact buttons, three social pills. Each must reach its intended target; the external ones must open in a new tab.

- [ ] **Step 9: Write the findings log and commit**

Record in `docs/superpowers/plans/2026-08-17-pixel-arcade-verification.md`: each step above, pass or fail, and what was fixed. Then:

```bash
git add -A
git commit -m "chore: full-site verification sweep for pixel-arcade redesign"
```

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
|---|---|
| §3 Design tokens | 1 |
| §4 Global primitives | 1 |
| §5 `PixelFrame` | 3 |
| §5 Hooks | 2 |
| §5 `ScrollProgress`, `Particles` | 2 |
| §5 `Terminal` | 6 |
| §5 `Ticker` | 5 |
| §5 `Skills`, `Achievements`, `Game` | 9, 10, 12 |
| §5 Deletions (`Skill.jsx`) | 9 |
| §5 New data files | 9, 10 |
| §6 Navbar | 4 |
| §6 Hero | 3 |
| §6 Ticker | 5 |
| §6 About | 6 |
| §6 Experience | 7 |
| §6 Projects | 8 |
| §6 Skills | 9 |
| §6 Achievements | 10 |
| §6 Contact | 11 |
| §6 Game | 12 |
| §7 Accessibility and motion | every task's verify step; swept in 13 |
| §8 Verification | 13 |

No spec requirement is unassigned.

**Type consistency check:**
- `PixelFrame` takes `size` / `className` / `innerClassName` in Task 3 and is called with exactly those names in Tasks 6, 7, 8, 9, 10, 12. ✓
- `useReveal()` returns `[ref, inView]` in Task 2 and is destructured that way everywhere. ✓
- `usePrefersReducedMotion()` returns a bare boolean in Task 2, used as one in Tasks 2, 3, 6, 10, 12. ✓
- `Terminal` takes `title` and `lines: [{ prompt, result }]` in Task 6; About passes exactly that shape. ✓
- Global class names introduced in Task 1 (`btn`, `btn-primary`, `btn-ghost`, `eyebrow`, `lv`, `tag`, `chip`, `chip-c1..c3`, `section`, `section-head`, `reveal`, `in-view`, `pf-*`) are the only global strings referenced later. ✓
- `skillGroups.json` uses `accent: "c1"|"c2"|"c3"`, consumed as both `styles[group.accent]` and `chip-${group.accent}` — the module CSS defines `.c1/.c2/.c3` and `pixel.css` defines `.chip-c1/.chip-c2/.chip-c3`. ✓

**Known deviation from the skill's default:** the usual red/green TDD cycle is replaced by the lint/build/browser Verification Cycle, because the repo has no test runner and the approved spec §9 rules out adding one. This is called out at the top of Global Constraints.
