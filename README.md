# Prateek Design System

My personal design system. One narrow column, light Geist type, hairlines instead of boxes, and a single marigold dot that says "this is me, right now". It ships as design tokens (CSS variables) and 10 small React components, in light and dark.

Use it for every personal project — portfolio, side projects, docs — so they all look like they came from the same person.

**Web view:** `https://prateekbisht23.github.io/prateek-design-system/` — every token, every component live with controls, a theme switch and a sample home page.

---

## Contents

- [What's in it](#whats-in-it)
- [Use it in a project](#use-it-in-a-project)
  - [Plain HTML, no build](#1-plain-html-no-build)
  - [React (Vite, Next.js)](#2-react-vite-nextjs)
  - [Tokens only, any stack](#3-tokens-only-any-stack)
- [Themes](#themes)
- [Components](#components)
- [Tokens](#tokens)
- [Moving an existing project over](#moving-an-existing-project-over)
- [Versions and updates](#versions-and-updates)
- [Working on the system](#working-on-the-system)

---

## What's in it

| | |
|---|---|
| **Color** | 11 tokens. `paper` ground, `ink` text, `ink-muted` secondary, `line` hairlines, and `marigold` as the only accent |
| **Type** | Geist (300–500) for reading, Geist Mono for dates, times and code. 8 styles from `display` 44px down to `meta` 12px |
| **Space** | 4px base: `space-1` (4) to `space-16` (64). Sections sit 64px apart |
| **Radius** | Square by default; `radius-sm` (6px) for controls, `radius-full` only for the status dot |
| **Layout** | One column, max 560px, with a 112px label column on wider screens |
| **Components** | `Header`, `Status`, `LocalTime`, `TextLink`, `Button`, `CopyButton`, `Section`, `WorkList`, `LinkList`, `Tag` |

The rules behind all of it (voice, when to use the accent, motion, focus states) are in **[DESIGN.md](DESIGN.md)**. Read it once before building a new page.

---

## Use it in a project

Pin a version tag (`v1.0.0` below) so a change here never breaks an old project by surprise.

### 1. Plain HTML, no build

Good for the portfolio and other static pages. Files load straight from this repo via jsDelivr.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400&display=swap">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/prateekbisht23/prateek-design-system@v1.0.0/tokens/tokens.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/prateekbisht23/prateek-design-system@v1.0.0/components/bundle.css">
</head>
<body>
  <div id="app"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/prateekbisht23/prateek-design-system@v1.0.0/components/bundle.js"></script>
  <script>
    const { Header, Status, Button } = window.Prateek;
    const h = React.createElement;

    ReactDOM.createRoot(document.getElementById('app')).render(
      h('div', { className: 'pk-page' },
        h(Header, { name: 'Prateek', links: [{ label: 'Work', href: '/', active: true }] }),
        h('div', { className: 'pk-hero' },
          h('h1', { className: 'pk-name' }, 'Prateek'),
          h(Status, null, 'Building message routing at Fyscal')
        ),
        h(Button, { variant: 'solid', href: 'mailto:you@example.com' }, 'Say hello')
      )
    );
  </script>
</body>
</html>
```

Components are on `window.Prateek`.

### 2. React (Vite, Next.js)

Install from GitHub (no npm account needed):

```sh
npm i github:prateekbisht23/prateek-design-system#v1.0.0
```

Import the styles once, at your app's entry (`main.jsx`, or `app/layout.tsx` in Next.js):

```js
import 'prateek-design-system/tokens.css';
import 'prateek-design-system/components.css';
```

Load the fonts in your HTML `<head>` (or with `next/font` using Geist and Geist Mono):

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400&display=swap">
```

Then use the components:

```jsx
import { Header, Status, Section, WorkList, Button, CopyButton } from 'prateek-design-system';

export default function Home() {
  return (
    <div className="pk-page">
      <Header name="Prateek" links={[{ label: 'Work', href: '/', active: true }, { label: 'Notes', href: '/notes' }]} />

      <div className="pk-hero">
        <h1 className="pk-name">Prateek</h1>
        <Status>Building message routing at Fyscal</Status>
        <p className="pk-lede">Backend engineer in Delhi. I build systems that stay out of the way.</p>
      </div>

      <div className="pk-row" style={{ marginTop: 'var(--space-8)' }}>
        <Button variant="solid" href="mailto:you@example.com">Say hello</Button>
        <CopyButton value="you@example.com" />
      </div>

      <div className="pk-sections">
        <Section label="Work">
          <WorkList items={[{ title: 'Connectra', note: 'message routing', year: 2026, href: '/work/connectra' }]} />
        </Section>
      </div>
    </div>
  );
}
```

Types come with it (`components/index.d.ts`). React 18 or newer is a peer dependency. The module is marked `'use client'`, so it works in the Next.js App Router as-is.

### 3. Tokens only, any stack

Don't need the components? Link or import `tokens.css` and use the variables anywhere: plain CSS, Svelte, Vue, Astro or any static site.

```css
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-sans);
}
.card-title { color: var(--ink); }
.meta { color: var(--ink-muted); font-family: var(--font-mono); }
section + section { margin-top: var(--space-16); }
```

`tokens.css` also ships one class per type style: `.t-display`, `.t-title`, `.t-lede`, `.t-body`, `.t-label`, `.t-small`, `.t-meta`, `.t-code`.

**With Tailwind**, point the theme at the variables so utilities follow the theme too:

```js
// tailwind.config.js
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-raised': 'var(--paper-raised)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        marigold: 'var(--marigold)',
        'marigold-ink': 'var(--marigold-ink)',
      },
      fontFamily: { sans: 'var(--font-sans)', mono: 'var(--font-mono)' },
      maxWidth: { column: 'var(--column)' },
    },
  },
};
```

Then `bg-paper text-ink`, `text-ink-muted`, `border-line`, `max-w-column` work, and switch with the theme on their own.

Need raw values in JS (charts, canvas, emails)? Import `prateek-design-system/tokens.json`.

---

## Themes

Light and dark are built in. Nothing to configure:

- **Follow the OS:** leave `<html>` alone. Dark mode kicks in with the system setting.
- **Force a theme:** set `<html data-theme="light">` or `<html data-theme="dark">`.

A minimal toggle that remembers the choice:

```js
function setTheme(mode) { // 'light' | 'dark' | 'system'
  const root = document.documentElement;
  mode === 'system' ? root.removeAttribute('data-theme') : root.setAttribute('data-theme', mode);
  try { localStorage.setItem('theme', mode); } catch {}
}
```

Put this in `<head>` to apply the saved theme before the page paints, so there's no flash:

```html
<script>
  try { const t = localStorage.getItem('theme'); if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t); } catch {}
</script>
```

---

## Components

All class names start with `pk-`. Full guidelines per component are in `components/<Name>/README.md` and live in the web view.

| Component | What it's for | Key props |
|---|---|---|
| `Header` | Name on the left, 3–4 text links on the right | `name`, `links: {label, href, active}[]` |
| `Status` | The "Now · …" line with the marigold dot. One per page | `children`, `label`, `live` |
| `LocalTime` | Live local time in mono, "Delhi · 14:32 IST" | `place`, `timeZone`, `zoneLabel` |
| `TextLink` | Inline underlined link; external links get ↗ | `href`, `external` |
| `Button` | `solid` (once per view), `ghost`, `text`; renders `<a>` with `href` | `variant`, `href`, `disabled` |
| `CopyButton` | Copies a value (your email), shows "Copied" | `value`, `label`, `variant` |
| `Section` | Small label beside its content; stacks on phones | `label`, `children` |
| `WorkList` | Hairline rows, title left, year right; hover dims the rest | `items: {title, year, href, note}[]` |
| `LinkList` | Outbound links (Resume, GitHub, LinkedIn) | `items: {label, href, meta}[]` |
| `Tag` | Mono outline tag for stack items | `items` or `children` |

Layout helpers in `components.css`: `.pk-page` (the 560px column), `.pk-hero`, `.pk-name`, `.pk-lede`, `.pk-body`, `.pk-row`, `.pk-stack`, `.pk-sections`. A full home page built from these is in [`examples/portfolio.js`](examples/portfolio.js).

---

## Tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#fafaf8` | `#0f0f0e` | Page background |
| `--paper-raised` | `#ffffff` | `#181817` | Toast, hovered rows |
| `--line` | `#e7e6e2` | `#262624` | Hairlines |
| `--line-strong` | `#8a8983` | `#6c6b66` | Link underlines, ghost button border |
| `--ink` | `#151514` | `#ecebe7` | Text, solid button |
| `--ink-muted` | `#65645f` | `#9c9b95` | Labels, years, nav |
| `--on-ink` | `#fafaf8` | `#0f0f0e` | Text on an ink fill |
| `--marigold` | `#e09a12` | `#f0b23e` | Status dot only |
| `--marigold-ink` | `#8f5600` | `#f0b23e` | Accent as text, rarely |
| `--marigold-soft` | `#fbeed2` | `#3a2b0a` | Text selection, highlights |
| `--link` | = `ink` | = `ink` | Links |

Plus `--space-1…16`, `--radius-0/sm/full`, `--shadow-float`, `--focus-ring`, `--column`, `--label-col`, `--page-top`, `--dur-fast`, `--dur-base`, `--font-sans`, `--font-mono`. Every value and its usage note: [`tokens/tokens.json`](tokens/tokens.json).

The three rules that matter most:

1. **One marigold mark per screen.** Never a button, link or heading colour.
2. **Big text gets thinner, not bolder.** Nothing heavier than 500.
3. **Hairlines and space, not cards and shadows.**

---

## Moving an existing project over

Do it in this order; each step is shippable on its own.

1. **Add the tokens.** Link `tokens.css` and the Geist fonts. Nothing changes visually yet.
2. **Swap the basics.** Page background → `var(--paper)`, body text → `var(--ink)`, secondary text → `var(--ink-muted)`, borders → `var(--line)`, font → `var(--font-sans)`. This gets you most of the look.
3. **Swap spacing.** Replace one-off margins with `--space-*`; put `--space-16` between sections.
4. **Drop the extras.** Remove card shadows, extra accent colours and bold headings (use weight 300–400).
5. **Swap components** where they fit: nav → `Header`, project list → `WorkList`, social links → `LinkList`, email button → `Button` + `CopyButton`.
6. **Check dark mode** with `data-theme="dark"` on `<html>`, and fix anything still hard-coded.

Quick search for leftovers: `grep -rnE "#[0-9a-fA-F]{3,6}\b|font-weight:\s*(600|700|bold)" src/`

---

## Versions and updates

- `main` is the latest. Projects should use a **tag**, never `main`.
- Version numbers: **patch** (`v1.0.1`) for fixes, **minor** (`v1.1.0`) for new tokens or components, **major** (`v2.0.0`) when a token or prop is renamed or removed.
- To release: bump `version` in `package.json`, then

  ```sh
  git tag v1.1.0 && git push origin v1.1.0
  ```

- To update a project: change the tag in its CDN links, or run `npm i github:prateekbisht23/prateek-design-system#v1.1.0`.

---

## Working on the system

```
tokens/tokens.json            ← edit colours, type, space here (source of truth)
components/src/components.js  ← edit components here
components/bundle.css         ← component styles
components/<Name>/README.md   ← component guidelines
DESIGN.md                     ← the rules

tokens/tokens.css             ┐
components/bundle.js          │ generated by `npm run build`,
components/index.mjs          │ never edit by hand
site/*.data.js                ┘

index.html, site/, examples/, vendor/   ← the web view (not shipped to projects)
```

```sh
npm run build   # regenerate everything after an edit (Node 18+, no dependencies)
npm run dev     # build, then serve the web view at http://localhost:4173
```

Commit the generated files too, so CDN links and GitHub installs work without a build step.

**The web view** deploys to GitHub Pages on every push to `main` via `.github/workflows/pages.yml`. First time only: Settings → Pages → Source → **GitHub Actions**.

---

React 18.3.1 in `vendor/` is MIT licensed (see `vendor/REACT-LICENSE`).
