# Copilot Instructions for This Repo

This repo contains a React + TypeScript portfolio app under `portfolio/` built with Vite and Tailwind CSS, deployed to GitHub Pages. Use these notes to be immediately productive.

## Architecture
- App lives in `portfolio/src/`. Entry `main.tsx` mounts `<App/>` wrapped in `ThemeProvider`.
- Routing is section-based via fullPage.js, not React Router. Sections are anchors: `#home`, `#about`, `#projects`, `#contact`.
- Global page changes are broadcast using `window.dispatchEvent(new CustomEvent('pageChange', { detail: { index, anchor } }))` from `App.tsx` (see `afterLoad` in fullPage.js init). Components listen for this to update state.
- Key components:
  - `Navbar`: uses `fullpage_api.moveTo(anchor)` for navigation; listens for `pageChange` to set active link and scrolled state.
  - `ProgressTimeline`: left-side progress/dot indicator; updates from `pageChange` events.
  - `Projects` + `ShowcaseModal`: feature carousel powered by `framer-motion`, imports assets under `portfolio/Project-Showcase/**` via `new URL(..., import.meta.url).href` so Vite bundles them.
  - `Contact`: EmailJS form (`@emailjs/browser`) with a honeypot field and simple validation; shows transient success/error; copies phone/email via Clipboard API.
  - `BottomPill`: footer pill that swaps to social icons when the contact section is active.
- Theme system:
  - `ThemeContext.tsx` stores `'light' | 'dark'` in localStorage and applies the class on `<html>` which Tailwind consumes (`darkMode: 'class'`).
  - Color tokens are CSS variables in `src/index.css`; Tailwind colors map to them in `tailwind.config.ts`.

## Styling & Animations
- Tailwind v4 with plugin `@tailwindcss/aspect-ratio`. Utilities are available via `@import "tailwindcss";` in `index.css`.
- Custom CSS vars for colors live in `index.css` and are referenced by Tailwind `theme.extend.colors`.
- `fullpage.js` styles are imported in `index.css` (`@import "fullpage.js/dist/fullpage.css"`).
- Animations primarily via `framer-motion`; additional keyframes like `fadeIn` are declared in `index.css`.

## Build & Run
- Work inside `portfolio/`.
- Scripts (`portfolio/package.json`):
  - `npm run dev` → Vite dev server.
  - `npm run build` → `tsc -b && vite build`.
  - `npm run preview` → Preview production build.
  - `npm run lint` → ESLint (configured in `eslint.config.js`).
  - `npm run deploy` → Deploys `dist/` to GitHub Pages via `gh-pages`. `predeploy` builds first.
- Vite `base` is set to `/Portfolio-Website/` (see `vite.config.ts`) for GitHub Pages; `homepage` matches in `package.json`.

## Conventions & Patterns
- Section navigation uses fullPage.js; avoid native scrolling handlers that conflict. To navigate programmatically, use:
  ```ts
  (window as any).fullpage_api?.moveTo('projects')
  ```
- To react to section changes, subscribe to the `pageChange` event. Example (used by `usePageActive`):
  ```ts
  useEffect(() => {
    const onChange = (e: Event) => {
      const { anchor } = (e as CustomEvent).detail || {}
      setActive(anchor === target)
    }
    window.addEventListener('pageChange', onChange)
    return () => window.removeEventListener('pageChange', onChange)
  }, [target])
  ```
- Asset importing for large/binary files under `Project-Showcase/**` should use `new URL(path, import.meta.url).href` so Vite includes them in the bundle.
- Keep sections structured as `.section` wrappers inside `#fullpage` (see `App.tsx`). New sections must be added to `anchors` in the fullPage.js config and considered in `Navbar` and `ProgressTimeline`.
- Theme toggling: call `toggleTheme()` from `useTheme()`. Do not manipulate classes directly; the provider manages `<html>` classes and persistence.
- Accessibility UX: small ARIA attributes are used in `Contact` and nav; follow those patterns when adding interactive elements.

## External Integrations
- EmailJS: configured via `emailjs.sendForm('service_yxsbzwr', 'template_f1ovonq', formRef.current, { publicKey: 'K-s_xFAcbcC3jPeW2' })`. Keep keys in code for now (no env wiring). Update IDs/keys if the EmailJS service/template changes.
- GitHub Pages: deployment assumes the repo is `DICEsda/Portfolio-Website`; Vite `base` and `homepage` are aligned for that path.

## Adding/Modifying Features
- Add a section:
  1) Create a component and wrap it in `<div className="section">` under `#fullpage` in `App.tsx`.
  2) Add the new anchor to `anchors` in the fullPage.js config and update nav arrays in `Navbar`/timeline in `ProgressTimeline`.
- Add a project to the carousel: edit `src/components/Projects.tsx` and extend the `projects` array. Include assets via `new URL(...)` at the top to ensure bundling.
- Change theme colors: update CSS vars in `src/index.css`, Tailwind picks them up automatically.

## Gotchas
- Running from the repo root will not work; use the `portfolio/` folder. Install with `npm install` inside `portfolio/`.
- If fullPage.js types cause issues, the project intentionally suppresses types with `// @ts-ignore` in `App.tsx`.
- When importing non-code assets from nested `Project-Showcase` paths with spaces or parentheses, use `new URL('...path...', import.meta.url).href` to avoid dev server 404s.
- The root-level `package.json` is not used by the app; treat `portfolio/package.json` as canonical for scripts and deps.
