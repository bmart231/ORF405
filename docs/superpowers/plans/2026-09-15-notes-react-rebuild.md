# ORF 405 Notes React Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the ORF405 course-notes site (currently a single-page Claude Artifact) as a proper React app living in `notes/` inside the `bmart231/ORF405` repo, deployed to GitHub Pages, with the two written topics (Multiple & Nonparametric Regression, Generalized Linear Models) expanded with worked examples, charts, and deeper derivations.

**Architecture:** Vite + React (JavaScript) with MDX-authored content (`remark-math` + `rehype-katex` for real math rendering), `react-router-dom` in hash mode for per-topic URLs that work on GitHub Pages with no server config, and hand-built inline-SVG chart components (no charting library). GitHub Actions builds and deploys `notes/` to GitHub Pages on push to `main`.

**Tech Stack:** Vite 5, React 18, react-router-dom 6 (HashRouter), @mdx-js/rollup, remark-math, rehype-katex, katex (npm, real CSS+fonts — no CDN workaround needed since this isn't a sandboxed artifact).

**Spec:** `docs/superpowers/specs/2026-09-15-notes-react-design.md`

---

## Before Task 1

- [ ] **Step 0: Create the feature branch**

```bash
cd ~/ORF405
git checkout -b notes-react-rebuild
```

Expected: `Switched to a new branch 'notes-react-rebuild'`

---

### Task 1: Scaffold the Vite + React app shell

**Files:**
- Create: `notes/package.json`
- Create: `notes/vite.config.js`
- Create: `notes/index.html`
- Create: `notes/src/main.jsx`
- Create: `notes/src/App.jsx`
- Create: `notes/.gitignore`
- Test: none (verified by running the dev server)

- [ ] **Step 1: Create `notes/package.json`**

```json
{
  "name": "orf405-notes",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create `notes/vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ORF405/',
  plugins: [react()],
})
```

- [ ] **Step 3: Create `notes/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Source+Serif+4:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap" />
    <title>ORF 405 Notes</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create `notes/src/App.jsx` (temporary placeholder — replaced in Task 9)**

```jsx
export default function App() {
  return <h1>ORF 405 Notes — scaffold OK</h1>
}
```

- [ ] **Step 5: Create `notes/src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 6: Create `notes/.gitignore`**

```
node_modules
dist
.DS_Store
```

- [ ] **Step 7: Install dependencies and verify the dev server boots**

```bash
cd ~/ORF405/notes
npm install
npm run dev -- --port 5173 &
sleep 2
curl -s http://localhost:5173/ | grep -o '<title>[^<]*</title>'
kill %1
```

Expected: `<title>ORF 405 Notes</title>` printed, no errors in between.

- [ ] **Step 8: Commit**

```bash
cd ~/ORF405
git add notes/package.json notes/package-lock.json notes/vite.config.js notes/index.html notes/src/main.jsx notes/src/App.jsx notes/.gitignore
git commit -m "Scaffold Vite + React app for notes site"
```

---

### Task 2: Add MDX, KaTeX, and routing

**Files:**
- Modify: `notes/package.json`
- Modify: `notes/vite.config.js`
- Create: `notes/src/content/topics.js` (stub)
- Create: `notes/src/content/scratch-check.mdx` (throwaway, deleted at end of task)
- Test: none (verified by build output)

- [ ] **Step 1: Install the new dependencies**

```bash
cd ~/ORF405/notes
npm install react-router-dom@^6.26.0 katex@^0.16.11
npm install -D @mdx-js/rollup@^3.0.1 remark-math@^6.0.0 rehype-katex@^7.0.0
```

- [ ] **Step 2: Update `notes/vite.config.js` to add the MDX plugin**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export default defineConfig({
  base: '/ORF405/',
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }) },
    react({ include: /\.(jsx|js|mdx)$/ }),
  ],
})
```

- [ ] **Step 3: Create a throwaway MDX file to prove the pipeline works**

`notes/src/content/scratch-check.mdx`:

```mdx
# Scratch check

Inline math: $a^2+b^2=c^2$

$$
\int_0^1 x^2\,dx = \frac13
$$
```

- [ ] **Step 4: Temporarily wire it into `App.jsx` and verify in the browser**

Edit `notes/src/App.jsx`:

```jsx
import ScratchCheck from './content/scratch-check.mdx'

export default function App() {
  return <ScratchCheck />
}
```

```bash
cd ~/ORF405/notes
npm run build
```

Expected: `vite build` completes with `✓ built` and no MDX/KaTeX errors.

- [ ] **Step 5: Delete the scratch file and revert `App.jsx`**

```bash
rm ~/ORF405/notes/src/content/scratch-check.mdx
```

Restore `notes/src/App.jsx` to the Task 1 placeholder:

```jsx
export default function App() {
  return <h1>ORF 405 Notes — scaffold OK</h1>
}
```

- [ ] **Step 6: Commit**

```bash
cd ~/ORF405
git add notes/package.json notes/package-lock.json notes/vite.config.js
git commit -m "Add MDX, KaTeX, and router dependencies"
```

---

### Task 3: Design tokens and global styles

**Files:**
- Create: `notes/src/styles/tokens.css`
- Modify: `notes/src/main.jsx`
- Test: none (verified visually in Task 13)

- [ ] **Step 1: Create `notes/src/styles/tokens.css`**

```css
:root{
  --paper:#F6F6F1;
  --surface:#FFFFFF;
  --ink:#1C1C17;
  --ink-soft:#6B6960;
  --ink-faint:#9A9788;
  --accent:#D9660B;
  --accent-ink:#7A3D0E;
  --rule:#E1DED3;
  --proof-bg:#FBF3E9;
  --code-bg:#F0EFE8;
  --sidebar-bg:#FCFBF8;
  --chart-a:#1F7A6C;
  --chart-b:#5B5FA6;
  --shadow:0 1px 2px rgba(28,28,23,0.06);
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --paper:#16150F;
    --surface:#1D1C15;
    --ink:#ECE8DC;
    --ink-soft:#A9A493;
    --ink-faint:#7A7566;
    --accent:#FF9A47;
    --accent-ink:#FFB877;
    --rule:#34321F;
    --proof-bg:#241F14;
    --code-bg:#221F16;
    --sidebar-bg:#191811;
    --chart-a:#4FD9B8;
    --chart-b:#9CA3E8;
    --shadow:none;
  }
}
:root[data-theme="dark"]{
  --paper:#16150F;
  --surface:#1D1C15;
  --ink:#ECE8DC;
  --ink-soft:#A9A493;
  --ink-faint:#7A7566;
  --accent:#FF9A47;
  --accent-ink:#FFB877;
  --rule:#34321F;
  --proof-bg:#241F14;
  --code-bg:#221F16;
  --sidebar-bg:#191811;
  --chart-a:#4FD9B8;
  --chart-b:#9CA3E8;
  --shadow:none;
}
*{box-sizing:border-box;}
html,body,#root{height:100%;}
body{
  margin:0;
  background:var(--paper);
  color:var(--ink);
  font-family:"Source Serif 4",Georgia,"Times New Roman",serif;
  font-size:16px;
  line-height:1.65;
}
h1,h2,h3{
  font-family:"Fraunces","Iowan Old Style",Georgia,serif;
  text-wrap:balance;
  color:var(--ink);
}
.mono,.eyebrow,code,pre,.topic-list,.sidebar-note,.course-tag{
  font-family:"IBM Plex Mono",ui-monospace,Consolas,monospace;
}
.app{
  display:flex;
  min-height:100%;
  align-items:flex-start;
}
.drawer-toggle{
  display:none;
  position:fixed;
  top:calc(12px + env(safe-area-inset-top,0px));
  left:16px;
  z-index:20;
  background:var(--surface);
  color:var(--ink);
  border:1px solid var(--rule);
  border-radius:6px;
  padding:8px 12px;
  font-family:"IBM Plex Mono",monospace;
  font-size:12px;
  letter-spacing:0.04em;
  box-shadow:var(--shadow);
}
.sidebar{
  width:280px;
  flex:0 0 280px;
  background:var(--sidebar-bg);
  border-right:1px solid var(--rule);
  padding:28px 24px 32px;
  position:sticky;
  top:0;
  align-self:stretch;
  height:100vh;
  overflow-y:auto;
}
.course-tag{
  display:inline-block;
  font-size:11px;
  letter-spacing:0.12em;
  color:var(--accent-ink);
  background:var(--proof-bg);
  border:1px solid var(--rule);
  border-radius:4px;
  padding:3px 7px;
  margin-bottom:14px;
}
.course-title{
  font-size:22px;
  font-weight:600;
  line-height:1.2;
  margin:0 0 6px;
}
.course-sub{
  font-size:12.5px;
  color:var(--ink-soft);
  margin:0 0 22px;
}
.topic-list{
  list-style:none;
  margin:0 0 20px;
  padding:0;
  border-top:1px solid var(--rule);
}
.topic-link{
  display:block;
  width:100%;
  text-align:left;
  text-decoration:none;
  background:none;
  border:none;
  border-bottom:1px solid var(--rule);
  color:var(--ink-soft);
  font-size:12.5px;
  line-height:1.5;
  padding:11px 4px;
  cursor:pointer;
}
.topic-link:hover{ color:var(--ink); }
.topic-link.active{
  color:var(--accent-ink);
  font-weight:600;
}
.topic-link .status{
  display:block;
  font-size:10.5px;
  letter-spacing:0.06em;
  color:var(--ink-faint);
  margin-top:2px;
}
.topic-link[data-state="ready"] .status{ color:var(--accent-ink); }
.sidebar-note{
  font-size:11px;
  color:var(--ink-faint);
  line-height:1.6;
  border-top:1px solid var(--rule);
  padding-top:14px;
}
main{
  flex:1 1 auto;
  min-width:0;
  padding:48px 24px 80px;
  display:flex;
  justify-content:center;
}
.topic{
  width:100%;
  max-width:680px;
}
.eyebrow{
  font-size:11.5px;
  letter-spacing:0.1em;
  color:var(--accent-ink);
  margin:0 0 10px;
}
.topic h1{
  font-size:32px;
  font-weight:600;
  margin:0 0 6px;
}
.dek{
  color:var(--ink-soft);
  font-size:15px;
  margin:0 0 36px;
  max-width:60ch;
}
.topic h2{
  font-size:20px;
  font-weight:600;
  margin:40px 0 12px;
  padding-bottom:8px;
  border-bottom:1px solid var(--rule);
}
.topic h3{
  font-size:16px;
  font-weight:600;
  margin:28px 0 10px;
}
.topic p{ margin:0 0 14px; max-width:66ch; }
.topic ul,.topic ol{ margin:0 0 14px; padding-left:22px; max-width:64ch; }
.topic li{ margin-bottom:6px; }
.proof{
  background:var(--proof-bg);
  border-left:3px solid var(--accent);
  border-radius:2px;
  padding:14px 18px 16px;
  margin:0 0 20px;
}
.proof-label{
  font-family:"IBM Plex Mono",monospace;
  font-size:11px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:var(--accent-ink);
  margin:0 0 8px;
}
.proof p:last-child{ margin-bottom:0; }
.qed{ float:right; font-family:"IBM Plex Mono",monospace; }
.result{
  border:1px solid var(--rule);
  background:var(--surface);
  border-radius:6px;
  padding:14px 18px;
  margin:0 0 20px;
}
.result-label{
  font-family:"IBM Plex Mono",monospace;
  font-size:11px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:var(--ink-faint);
  margin:0 0 8px;
}
.code-lang{
  font-family:"IBM Plex Mono",monospace;
  font-size:10.5px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:var(--ink-faint);
  margin:0 0 4px;
}
.code-block{
  background:var(--code-bg);
  border:1px solid var(--rule);
  border-radius:6px;
  overflow-x:auto;
  margin:0 0 14px;
}
.code-block pre{
  margin:0;
  padding:12px 14px;
  font-family:"IBM Plex Mono",monospace;
  font-size:12.5px;
  line-height:1.55;
  color:var(--ink);
  white-space:pre;
}
.placeholder-card{
  border:1px dashed var(--rule);
  border-radius:8px;
  padding:28px 24px;
  color:var(--ink-soft);
  font-size:14.5px;
}
.placeholder-card strong{ color:var(--ink); }
.katex-display{ overflow-x:auto; padding:2px 0; }
.chart{ margin:0 0 22px; }
.chart svg{ width:100%; height:auto; display:block; }
.chart-axis{ stroke:var(--ink-faint); stroke-width:1; }
.chart-line{ stroke-width:2; }
.chart-line-bias{ stroke:var(--chart-a); }
.chart-line-variance{ stroke:var(--chart-b); }
.chart-line-mse{ stroke:var(--accent); }
.chart-point{ fill:var(--accent); }
.chart-fit-line{ stroke:var(--accent); stroke-width:2; fill:none; }
.chart-residual{ stroke:var(--chart-b); stroke-width:1.5; stroke-dasharray:3 2; }
.chart-point-data{ fill:var(--ink-soft); }
.chart-point-pearson{ fill:var(--chart-a); }
.chart-point-deviance{ fill:var(--chart-b); }
.chart-label{ font-family:"IBM Plex Mono",monospace; font-size:10.5px; fill:var(--ink-soft); }
figure.chart{ margin:0 0 22px; }
figure.chart figcaption{
  font-family:"IBM Plex Mono",monospace;
  font-size:11.5px;
  color:var(--ink-soft);
  margin-top:8px;
  line-height:1.5;
}
.legend-bias{ color:var(--chart-a); }
.legend-variance{ color:var(--chart-b); }
.legend-mse{ color:var(--accent); }
@media (max-width:800px){
  .drawer-toggle{ display:block; }
  .sidebar{
    position:fixed;
    left:0; top:0; bottom:0;
    z-index:15;
    transform:translateX(-100%);
    transition:transform 0.2s ease;
    box-shadow:2px 0 12px rgba(0,0,0,0.15);
    padding-top:calc(60px + env(safe-area-inset-top,0px));
  }
  .sidebar.open{ transform:translateX(0); }
  main{ padding:76px 16px 60px; }
  .topic h1{ font-size:26px; }
}
```

- [ ] **Step 2: Import the stylesheet and KaTeX CSS in `notes/src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './styles/tokens.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 3: Verify the build still passes**

```bash
cd ~/ORF405/notes
npm run build
```

Expected: `✓ built` with no errors.

- [ ] **Step 4: Commit**

```bash
cd ~/ORF405
git add notes/src/styles/tokens.css notes/src/main.jsx
git commit -m "Add design tokens and global styles"
```

---

### Task 4: Layout, Sidebar, and Placeholder components

**Files:**
- Create: `notes/src/content/topics.js`
- Create: `notes/src/components/Layout.jsx`
- Create: `notes/src/components/Sidebar.jsx`
- Create: `notes/src/components/Placeholder.jsx`
- Test: none (verified in Task 13)

- [ ] **Step 1: Create `notes/src/content/topics.js` (metadata only for now — `Component` fields added in Task 9)**

```js
export const topics = [
  { slug: 'mnr', number: 1, title: 'Multiple & Nonparametric Regression', status: 'ready' },
  { slug: 'glm', number: 2, title: 'Generalized Linear Models', status: 'ready' },
  { slug: 'msr', number: 3, title: 'Model Selection & Regularization', status: 'pending' },
  { slug: 'cls', number: 4, title: 'Classification & Supervised Learning', status: 'pending' },
  { slug: 'dl', number: 5, title: 'Introduction to Deep Learning', status: 'pending' },
  { slug: 'uns', number: 6, title: 'Unsupervised Learning', status: 'pending' },
  { slug: 'sts', number: 7, title: 'Stationary Time Series & Martingales', status: 'pending' },
  { slug: 'lts', number: 8, title: 'Linear Time Series', status: 'pending' },
  { slug: 'vol', number: 9, title: 'Discrete-Time Volatility Models', status: 'pending' },
]
```

- [ ] **Step 2: Create `notes/src/components/Sidebar.jsx`**

```jsx
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { topics } from '../content/topics.js'

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="drawer-toggle" aria-label="Toggle topic list" onClick={() => setOpen((v) => !v)}>
        &#9776; Topics
      </button>
      <nav className={`sidebar${open ? ' open' : ''}`}>
        <span className="course-tag">ORF 405</span>
        <h1 className="course-title">Regression &amp;<br />Applied Time Series</h1>
        <p className="course-sub">Notes &amp; proofs, built topic by topic</p>
        <ol className="topic-list">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <NavLink
                to={`/${topic.slug}`}
                className={({ isActive }) => `topic-link${isActive ? ' active' : ''}`}
                data-state={topic.status}
                onClick={() => setOpen(false)}
              >
                {String(topic.number).padStart(2, '0')} &middot; {topic.title}
                <span className="status">{topic.status === 'ready' ? 'written' : 'not covered yet'}</span>
              </NavLink>
            </li>
          ))}
        </ol>
        <p className="sidebar-note">Homework is tracked separately &mdash; this site is for building intuition and holding the proofs.</p>
      </nav>
    </>
  )
}
```

- [ ] **Step 3: Create `notes/src/components/Layout.jsx`**

```jsx
import Sidebar from './Sidebar.jsx'

export default function Layout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <main id="main">
        <div className="topic">{children}</div>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Create `notes/src/components/Placeholder.jsx`**

```jsx
export default function Placeholder({ topic }) {
  return (
    <>
      <p className="eyebrow">TOPIC {String(topic.number).padStart(2, '0')} OF 09</p>
      <h1>{topic.title}</h1>
      <div className="placeholder-card">
        <strong>Not covered yet.</strong> This page will be filled in once the lecture reaches this topic.
      </div>
    </>
  )
}
```

- [ ] **Step 5: Commit**

```bash
cd ~/ORF405
git add notes/src/content/topics.js notes/src/components/Layout.jsx notes/src/components/Sidebar.jsx notes/src/components/Placeholder.jsx
git commit -m "Add Layout, Sidebar, and Placeholder components"
```

---

### Task 5: Content-authoring components (Proof, Result, CodeBlock)

**Files:**
- Create: `notes/src/components/Proof.jsx`
- Create: `notes/src/components/Result.jsx`
- Create: `notes/src/components/CodeBlock.jsx`
- Test: none (verified in Task 13)

- [ ] **Step 1: Create `notes/src/components/Proof.jsx`**

```jsx
export default function Proof({ label = 'Proof', children }) {
  return (
    <div className="proof">
      <p className="proof-label">{label}</p>
      {children}
      <span className="qed" aria-hidden="true">&#8718;</span>
    </div>
  )
}
```

- [ ] **Step 2: Create `notes/src/components/Result.jsx`**

```jsx
export default function Result({ label, children }) {
  return (
    <div className="result">
      {label && <p className="result-label">{label}</p>}
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Create `notes/src/components/CodeBlock.jsx`**

```jsx
export default function CodeBlock({ lang, children }) {
  return (
    <div>
      <p className="code-lang">{lang}</p>
      <div className="code-block">
        <pre>{children}</pre>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd ~/ORF405
git add notes/src/components/Proof.jsx notes/src/components/Result.jsx notes/src/components/CodeBlock.jsx
git commit -m "Add Proof, Result, and CodeBlock content components"
```

---

### Task 6: Chart component — BiasVarianceCurve

**Files:**
- Create: `notes/src/components/charts/BiasVarianceCurve.jsx`
- Test: none (verified visually in Task 13)

- [ ] **Step 1: Create `notes/src/components/charts/BiasVarianceCurve.jsx`**

```jsx
const H_MIN = 0.05
const H_MAX = 1.0
const POINTS = 60
const N = 200
const BIAS_COEF = 0.25
const VAR_COEF = 1.2

function buildCurve() {
  const hs = Array.from({ length: POINTS }, (_, i) => H_MIN + (i * (H_MAX - H_MIN)) / (POINTS - 1))
  return hs.map((h) => {
    const bias2 = BIAS_COEF * h ** 4
    const variance = VAR_COEF / (N * h)
    return { h, bias2, variance, mse: bias2 + variance }
  })
}

export default function BiasVarianceCurve() {
  const curve = buildCurve()
  const best = curve.reduce((a, b) => (b.mse < a.mse ? b : a))

  const width = 560
  const height = 300
  const padding = { top: 16, right: 16, bottom: 36, left: 44 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const maxY = Math.max(...curve.map((d) => Math.max(d.bias2, d.variance, d.mse)))
  const x = (h) => padding.left + ((h - H_MIN) / (H_MAX - H_MIN)) * plotW
  const y = (v) => padding.top + plotH - (v / maxY) * plotH

  const line = (key) =>
    curve.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(d.h).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(' ')

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Bias-squared, variance, and MSE curves against bandwidth h">
        <line x1={padding.left} y1={padding.top + plotH} x2={padding.left + plotW} y2={padding.top + plotH} className="chart-axis" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotH} className="chart-axis" />
        <text x={padding.left + plotW / 2} y={height - 6} className="chart-label" textAnchor="middle">bandwidth h</text>
        <text x={14} y={padding.top + plotH / 2} className="chart-label" textAnchor="middle" transform={`rotate(-90 14 ${padding.top + plotH / 2})`}>error</text>
        <path d={line('bias2')} className="chart-line chart-line-bias" fill="none" />
        <path d={line('variance')} className="chart-line chart-line-variance" fill="none" />
        <path d={line('mse')} className="chart-line chart-line-mse" fill="none" />
        <circle cx={x(best.h)} cy={y(best.mse)} r={4} className="chart-point" />
        <text x={x(best.h)} y={y(best.mse) - 10} className="chart-label" textAnchor="middle">h* &asymp; {best.h.toFixed(2)}</text>
      </svg>
      <figcaption>
        <span className="legend-bias">bias&sup2;</span> &middot; <span className="legend-variance">variance</span> &middot; <span className="legend-mse">MSE</span> against bandwidth, for an illustrative $m''(x)$ and design density. The minimum near h&asymp;{best.h.toFixed(2)} is the bias&ndash;variance optimal bandwidth referenced in the text.
      </figcaption>
    </figure>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/ORF405
git add notes/src/components/charts/BiasVarianceCurve.jsx
git commit -m "Add BiasVarianceCurve chart component"
```

---

### Task 7: Chart component — FittedLineResiduals

**Files:**
- Create: `notes/src/components/charts/FittedLineResiduals.jsx`
- Test: none (verified visually in Task 13)

- [ ] **Step 1: Create `notes/src/components/charts/FittedLineResiduals.jsx`**

```jsx
const N = 22
const TRUE_INTERCEPT = 1
const TRUE_SLOPE = 2

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildData() {
  const rand = mulberry32(405)
  const points = []
  for (let i = 0; i < N; i++) {
    const x = -2 + (4 * i) / (N - 1)
    const noise = (rand() - 0.5) * 2.2
    const y = TRUE_INTERCEPT + TRUE_SLOPE * x + noise
    points.push({ x, y })
  }
  const n = points.length
  const xBar = points.reduce((s, p) => s + p.x, 0) / n
  const yBar = points.reduce((s, p) => s + p.y, 0) / n
  const sxy = points.reduce((s, p) => s + (p.x - xBar) * (p.y - yBar), 0)
  const sxx = points.reduce((s, p) => s + (p.x - xBar) ** 2, 0)
  const slope = sxy / sxx
  const intercept = yBar - slope * xBar
  return { points, slope, intercept }
}

export default function FittedLineResiduals() {
  const { points, slope, intercept } = buildData()
  const width = 560
  const height = 320
  const padding = { top: 16, right: 16, bottom: 36, left: 44 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const xMin = -2.2
  const xMax = 2.2
  const yMin = Math.min(...points.map((p) => p.y)) - 1
  const yMax = Math.max(...points.map((p) => p.y)) + 1

  const x = (v) => padding.left + ((v - xMin) / (xMax - xMin)) * plotW
  const y = (v) => padding.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH
  const fit = (v) => intercept + slope * v

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Scatter of synthetic data with fitted regression line and residuals">
        <line x1={padding.left} y1={padding.top + plotH} x2={padding.left + plotW} y2={padding.top + plotH} className="chart-axis" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotH} className="chart-axis" />
        <text x={padding.left + plotW / 2} y={height - 6} className="chart-label" textAnchor="middle">x</text>
        <text x={14} y={padding.top + plotH / 2} className="chart-label" textAnchor="middle" transform={`rotate(-90 14 ${padding.top + plotH / 2})`}>y</text>
        <path
          d={`M ${x(xMin).toFixed(1)} ${y(fit(xMin)).toFixed(1)} L ${x(xMax).toFixed(1)} ${y(fit(xMax)).toFixed(1)}`}
          className="chart-fit-line"
        />
        {points.map((p, i) => (
          <line key={`r-${i}`} x1={x(p.x)} y1={y(p.y)} x2={x(p.x)} y2={y(fit(p.x))} className="chart-residual" />
        ))}
        {points.map((p, i) => (
          <circle key={`p-${i}`} cx={x(p.x)} cy={y(p.y)} r={3.5} className="chart-point-data" />
        ))}
      </svg>
      <figcaption>
        Synthetic data (n={N}) with the fitted line &ycirc; = {intercept.toFixed(2)} + {slope.toFixed(2)}x. Dashed segments are residuals, the quantities squared and summed in RSS.
      </figcaption>
    </figure>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/ORF405
git add notes/src/components/charts/FittedLineResiduals.jsx
git commit -m "Add FittedLineResiduals chart component"
```

---

### Task 8: Chart component — ResidualComparison

**Files:**
- Create: `notes/src/components/charts/ResidualComparison.jsx`
- Test: none (verified visually in Task 13)

- [ ] **Step 1: Create `notes/src/components/charts/ResidualComparison.jsx`**

```jsx
const DATA = [
  { y: 0, mu: 0.05 },
  { y: 0, mu: 0.09 },
  { y: 0, mu: 0.14 },
  { y: 1, mu: 0.18 },
  { y: 0, mu: 0.27 },
  { y: 0, mu: 0.35 },
  { y: 1, mu: 0.41 },
  { y: 0, mu: 0.52 },
  { y: 1, mu: 0.63 },
  { y: 1, mu: 0.74 },
  { y: 0, mu: 0.81 },
  { y: 1, mu: 0.92 },
]

function residuals() {
  return DATA.map(({ y, mu }) => {
    const pearson = (y - mu) / Math.sqrt(mu * (1 - mu))
    const dev = -2 * (y * Math.log(mu) + (1 - y) * Math.log(1 - mu))
    const sign = y - mu === 0 ? 1 : Math.sign(y - mu)
    const deviance = sign * Math.sqrt(Math.max(dev, 0))
    return { pearson, deviance }
  })
}

export default function ResidualComparison() {
  const rows = residuals()
  const width = 560
  const height = 300
  const padding = { top: 16, right: 16, bottom: 36, left: 44 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const maxAbs = Math.max(...rows.flatMap((r) => [Math.abs(r.pearson), Math.abs(r.deviance)]))
  const x = (i) => padding.left + (i / (rows.length - 1)) * plotW
  const y = (v) => padding.top + plotH / 2 - (v / maxAbs) * (plotH / 2)

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Pearson versus deviance residuals for a fitted logistic regression">
        <line x1={padding.left} y1={padding.top + plotH / 2} x2={padding.left + plotW} y2={padding.top + plotH / 2} className="chart-axis" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotH} className="chart-axis" />
        <text x={padding.left + plotW / 2} y={height - 6} className="chart-label" textAnchor="middle">observation i, sorted by fitted mu</text>
        <text x={14} y={padding.top + plotH / 2} className="chart-label" textAnchor="middle" transform={`rotate(-90 14 ${padding.top + plotH / 2})`}>residual</text>
        {rows.map((r, i) => (
          <circle key={`p-${i}`} cx={x(i)} cy={y(r.pearson)} r={3.5} className="chart-point-pearson" />
        ))}
        {rows.map((r, i) => (
          <circle key={`d-${i}`} cx={x(i)} cy={y(r.deviance)} r={3.5} className="chart-point-deviance" />
        ))}
      </svg>
      <figcaption>
        <span className="legend-bias">Pearson</span> vs <span className="legend-variance">deviance</span> residuals for the same 12 fitted values &mu;<sub>i</sub>. They agree near &mu;&asymp;0.5 and diverge as &mu; approaches 0 or 1, since the Pearson residual's denominator shrinks faster there than the deviance residual's log-based scaling.
      </figcaption>
    </figure>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/ORF405
git add notes/src/components/charts/ResidualComparison.jsx
git commit -m "Add ResidualComparison chart component"
```

---

### Task 9: Topic registry, stub content, and routing

**Files:**
- Create: `notes/src/content/mnr.mdx` (stub — replaced in Task 10)
- Create: `notes/src/content/glm.mdx` (stub — replaced in Task 11)
- Modify: `notes/src/content/topics.js`
- Modify: `notes/src/App.jsx`
- Test: none (verified via dev server)

- [ ] **Step 1: Create the stub `notes/src/content/mnr.mdx`**

```mdx
<p className="eyebrow">TOPIC 01 OF 09</p>

# Multiple & Nonparametric Regression

<p className="dek">Stub — full content added in Task 10.</p>
```

- [ ] **Step 2: Create the stub `notes/src/content/glm.mdx`**

```mdx
<p className="eyebrow">TOPIC 02 OF 09</p>

# Generalized Linear Models

<p className="dek">Stub — full content added in Task 11.</p>
```

- [ ] **Step 3: Update `notes/src/content/topics.js` to import the MDX components**

```js
import Mnr from './mnr.mdx'
import Glm from './glm.mdx'

export const topics = [
  { slug: 'mnr', number: 1, title: 'Multiple & Nonparametric Regression', status: 'ready', Component: Mnr },
  { slug: 'glm', number: 2, title: 'Generalized Linear Models', status: 'ready', Component: Glm },
  { slug: 'msr', number: 3, title: 'Model Selection & Regularization', status: 'pending' },
  { slug: 'cls', number: 4, title: 'Classification & Supervised Learning', status: 'pending' },
  { slug: 'dl', number: 5, title: 'Introduction to Deep Learning', status: 'pending' },
  { slug: 'uns', number: 6, title: 'Unsupervised Learning', status: 'pending' },
  { slug: 'sts', number: 7, title: 'Stationary Time Series & Martingales', status: 'pending' },
  { slug: 'lts', number: 8, title: 'Linear Time Series', status: 'pending' },
  { slug: 'vol', number: 9, title: 'Discrete-Time Volatility Models', status: 'pending' },
]
```

- [ ] **Step 4: Replace `notes/src/App.jsx` with the routed version**

```jsx
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Placeholder from './components/Placeholder.jsx'
import { topics } from './content/topics.js'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to={`/${topics[0].slug}`} replace />} />
          {topics.map((topic) => (
            <Route
              key={topic.slug}
              path={`/${topic.slug}`}
              element={topic.status === 'ready' ? <topic.Component /> : <Placeholder topic={topic} />}
            />
          ))}
        </Routes>
      </Layout>
    </HashRouter>
  )
}
```

- [ ] **Step 5: Verify routing works**

```bash
cd ~/ORF405/notes
npm run build
npm run preview -- --port 4173 &
sleep 2
curl -s http://localhost:4173/ORF405/ | grep -o '<title>[^<]*</title>'
kill %1
```

Expected: build succeeds, title tag prints correctly. (Full route-by-route check with a real browser happens in Task 13, once content exists.)

- [ ] **Step 6: Commit**

```bash
cd ~/ORF405
git add notes/src/content/mnr.mdx notes/src/content/glm.mdx notes/src/content/topics.js notes/src/App.jsx
git commit -m "Wire up topic registry and hash routing"
```

---

### Task 10: Content — Multiple & Nonparametric Regression

**Files:**
- Modify: `notes/src/content/mnr.mdx` (replaces the Task 9 stub)
- Test: none (verified in Task 13)

- [ ] **Step 1: Replace `notes/src/content/mnr.mdx` with the full content**

```mdx
import Proof from '../components/Proof.jsx'
import Result from '../components/Result.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import BiasVarianceCurve from '../components/charts/BiasVarianceCurve.jsx'
import FittedLineResiduals from '../components/charts/FittedLineResiduals.jsx'

<p className="eyebrow">TOPIC 01 OF 09</p>

# Multiple & Nonparametric Regression

<p className="dek">From one predictor to many, then from a fixed functional form to none at all.</p>

## 1. Motivation

Simple linear regression relates a response to a single predictor. Almost nothing in finance is that clean: an asset's excess return depends simultaneously on market risk, size, and value exposure (as in Fama–French); a bond's yield depends on maturity, credit spread, and liquidity together. Multiple regression lets several predictors act jointly. But multiple regression still forces the mean response to be a straight line (or plane) in the predictors. When there's no reason to believe that — a volatility smile, a nonlinear term structure — we let the data pick the shape instead. That's nonparametric regression.

## 2. The Multiple Linear Regression Model

For observations $i=1,\dots,n$ with response $y_i$ and predictors $x_{i1},\dots,x_{ip}$:

$$
y_i = \beta_0 + \beta_1 x_{i1} + \cdots + \beta_p x_{ip} + \varepsilon_i
$$

In matrix form, stacking observations, $y = X\beta + \varepsilon$, where $y\in\mathbb{R}^n$, $X$ is the $n\times(p+1)$ design matrix (its first column is all ones, for the intercept), $\beta\in\mathbb{R}^{p+1}$, and $\varepsilon\in\mathbb{R}^n$.

<Result label="Gauss–Markov Assumptions">

**(A1) Linearity** — $E[y\mid X]=X\beta$.

**(A2) Full rank** — $\mathrm{rank}(X)=p+1$, so no predictor is an exact linear combination of the others and $X^\top X$ is invertible.

**(A3) Spherical errors** — $\mathrm{Var}(\varepsilon\mid X)=\sigma^2 I_n$ (homoscedastic, uncorrelated).

**(A4) Normality** (needed only for exact finite-sample inference) — $\varepsilon\mid X\sim N(0,\sigma^2 I_n)$.

</Result>

## 3. Least Squares: Derivation

Choose $\beta$ to minimize the residual sum of squares:

$$
\mathrm{RSS}(\beta) = (y-X\beta)^\top(y-X\beta) = y^\top y - 2\beta^\top X^\top y + \beta^\top X^\top X \beta
$$

<Proof label="Derivation">

Differentiate with respect to $\beta$:

$$
\nabla_\beta\, \mathrm{RSS}(\beta) = -2X^\top y + 2X^\top X\beta
$$

Setting the gradient to zero gives the *normal equations*, $X^\top X\beta = X^\top y$. By (A2), $X^\top X$ is invertible, so the unique solution is

$$
\hat\beta = (X^\top X)^{-1}X^\top y
$$

The Hessian is $2X^\top X \succ 0$, confirming this is the minimizer, not a saddle point.

</Proof>

Geometrically, $\hat y = X\hat\beta = X(X^\top X)^{-1}X^\top y = Hy$ is the orthogonal projection of $y$ onto the column space of $X$. $H$, the *hat matrix*, is symmetric and idempotent ($H^2=H$).

### Worked example

Take three points, $x=(-1,0,1)$ and $y=(0,1,3)$, fit with an intercept and slope. The design matrix and its Gram matrix are

$$
X=\begin{bmatrix}1&-1\\1&0\\1&1\end{bmatrix},\qquad
X^\top X=\begin{bmatrix}3&0\\0&2\end{bmatrix},\qquad
X^\top y=\begin{bmatrix}4\\3\end{bmatrix}
$$

Since $X^\top X$ is diagonal here, $(X^\top X)^{-1}=\begin{bmatrix}1/3&0\\0&1/2\end{bmatrix}$, so

$$
\hat\beta = (X^\top X)^{-1}X^\top y = \begin{bmatrix}4/3\\3/2\end{bmatrix}
$$

i.e. $\hat y = 4/3 + 1.5x$ — the intercept is the mean of $y$ (since $\bar x=0$ makes the columns of $X$ orthogonal) and the slope is exactly $S_{xy}/S_{xx}=3/2$, matching the single-predictor OLS formula as a sanity check.

## 4. Properties of the OLS Estimator

<Proof label="Unbiasedness">

$$
E[\hat\beta\mid X] = E[(X^\top X)^{-1}X^\top y\mid X] = (X^\top X)^{-1}X^\top E[y\mid X] = (X^\top X)^{-1}X^\top X\beta = \beta
$$

using (A1) in the third step.

</Proof>

<Proof label="Variance">

$$
\mathrm{Var}(\hat\beta\mid X) = (X^\top X)^{-1}X^\top \,\mathrm{Var}(y\mid X)\, X(X^\top X)^{-1} = (X^\top X)^{-1}X^\top(\sigma^2 I)X(X^\top X)^{-1} = \sigma^2(X^\top X)^{-1}
$$

using (A3).

</Proof>

<Result label="Gauss–Markov Theorem">

Under (A1)–(A3), $\hat\beta$ is BLUE: among all linear unbiased estimators $\tilde\beta=Cy$, $\mathrm{Var}(\tilde\beta)-\mathrm{Var}(\hat\beta)$ is positive semi-definite.

</Result>

<Proof label="Proof">

Let $\tilde\beta=Cy$ be linear and unbiased, so $E[Cy\mid X]=CX\beta=\beta$ for all $\beta$, forcing $CX=I$. Write $C=(X^\top X)^{-1}X^\top + D$ for some matrix $D$; unbiasedness of $\tilde\beta$ is then equivalent to $DX=0$. Then

$$
\mathrm{Var}(\tilde\beta\mid X) = \sigma^2 CC^\top = \sigma^2\big[(X^\top X)^{-1} + DD^\top\big]
$$

because the cross terms contain $DX=0$ and its transpose. Hence $\mathrm{Var}(\tilde\beta)-\mathrm{Var}(\hat\beta) = \sigma^2 DD^\top$, which is positive semi-definite for any $D$.

</Proof>

### Weighted least squares (a preview of GLM/IRLS)

If $\mathrm{Var}(\varepsilon\mid X)=\sigma^2 \Omega$ for a known, non-identity diagonal $\Omega=\mathrm{diag}(\omega_1,\dots,\omega_n)$ — heteroscedastic but uncorrelated errors — the Gauss–Markov argument above still goes through after rescaling. Minimizing the *weighted* RSS,

$$
\mathrm{RSS}_W(\beta) = \sum_i \frac{1}{\omega_i}(y_i - x_i^\top\beta)^2 = (y-X\beta)^\top W (y-X\beta), \qquad W=\Omega^{-1}
$$

gives, by the same derivation as Section 3 with $X^\top X\to X^\top WX$ and $X^\top y \to X^\top Wy$,

$$
\hat\beta_{WLS} = (X^\top WX)^{-1}X^\top Wy
$$

which is BLUE under this weighted error structure. This exact weighted normal-equation form reappears in the GLM notes as the inner step of iteratively reweighted least squares — a GLM is, at each iteration, a weighted regression of a "working response" on $X$.

## 5. Inference

Under (A4), $\hat\beta\mid X \sim N\big(\beta,\ \sigma^2(X^\top X)^{-1}\big)$. Replacing the unknown $\sigma^2$ with the unbiased estimator $s^2=\mathrm{RSS}/(n-p-1)$ gives, for each coefficient,

$$
t_j = \frac{\hat\beta_j-\beta_{j0}}{s\sqrt{[(X^\top X)^{-1}]_{jj}}} \ \sim\ t_{n-p-1} \quad\text{under } H_0:\beta_j=\beta_{j0}
$$

To test several restrictions jointly — comparing a full model ($p+1$ parameters) to a nested restricted model with $q+1$ parameters, $q$ smaller than $p$ — use

$$
F = \frac{(\mathrm{RSS}_{\text{restricted}}-\mathrm{RSS}_{\text{full}})/(p-q)}{\mathrm{RSS}_{\text{full}}/(n-p-1)} \ \sim\ F_{p-q,\ n-p-1}
$$

under the null that the restricted model already holds.

## 6. Goodness of Fit

With $\mathrm{TSS}=\sum_i(y_i-\bar y)^2$, $R^2 = 1-\mathrm{RSS}/\mathrm{TSS}$ always rises as predictors are added, so it can't be used to compare models of different size. The adjusted version corrects for this:

$$
\bar R^2 = 1 - \frac{\mathrm{RSS}/(n-p-1)}{\mathrm{TSS}/(n-1)}
$$

<FittedLineResiduals />

## 7. Nonparametric Regression

Now drop the assumption that $E[y\mid x]$ is linear in $x$, and instead let $m(x)=E[y\mid x]$ be an unknown smooth function estimated directly from the data.

<Result label="Nadaraya–Watson (kernel) estimator">

$$
\hat m_h(x) = \frac{\sum_{i=1}^n K\!\left(\dfrac{x-x_i}{h}\right) y_i}{\sum_{i=1}^n K\!\left(\dfrac{x-x_i}{h}\right)}
$$

for a kernel $K$ (e.g. Gaussian, Epanechnikov) and bandwidth $h>0$.

</Result>

<Proof label="Where it comes from">

$\hat m_h(x)$ is exactly the value of $c$ that minimizes the *locally weighted* squared error $\sum_i K\!\left(\frac{x-x_i}{h}\right)(y_i-c)^2$ — a local constant fit, weighting nearby points heavily and distant points lightly. Differentiating with respect to $c$ and setting the result to zero recovers the weighted-average formula above.

</Proof>

*Local polynomial regression* generalizes this: at each $x$, fit a degree-$d$ polynomial by weighted least squares, $\min_{\gamma}\sum_i K\!\left(\frac{x-x_i}{h}\right)\Big(y_i-\sum_{j=0}^d \gamma_j(x_i-x)^j\Big)^2$, and set $\hat m(x)=\hat\gamma_0$. Local linear fits ($d=1$) correct much of the Nadaraya–Watson bias near the boundary of the data.

### Boundary bias, worked

Suppose the true $m(x)=x$ (a straight line) and we evaluate near the left boundary of the data, where only points with $x_i\ge x$ fall inside the kernel's support — the neighborhood is one-sided, not symmetric. The Nadaraya–Watson estimator averages $y_i$ over that one-sided neighborhood, so $E[\hat m_h(x)] \ne m(x)$ even as $n\to\infty$ with $h\to0$ slowly enough: the estimator is biased toward the *interior* value of $m$, since it can only average points from one side. Concretely, for $m(x)=x$ evaluated at the boundary with a one-sided uniform kernel of width $h$, $E[\hat m_h(x)]\approx x + h/2$ — an $O(h)$ bias, one order worse than the $O(h^2)$ interior bias. Local *linear* regression removes this: because it fits a line rather than a constant to the one-sided neighborhood, it correctly extrapolates the local slope and the leading bias term vanishes, leaving the same $O(h^2)$ rate as in the interior. This is the standard reason local linear (or higher-order local polynomial) fits are preferred to Nadaraya–Watson near the edges of the data — exactly where a term structure or volatility curve's endpoint often matters most.

<Result label="Bias–variance tradeoff">

For twice-differentiable $m$ and design density $f$, $\mathrm{Bias}[\hat m_h(x)] = O(h^2)$, driven by $m''(x)$, while $\mathrm{Var}[\hat m_h(x)] \approx \dfrac{\sigma^2(x)\,R(K)}{n\,h\,f(x)}$, where $R(K)=\int K(u)^2\,du$. Shrinking $h$ removes bias but leaves fewer effective observations near each $x$, inflating variance; growing $h$ does the opposite. Balancing the two gives an optimal bandwidth $h^\ast \propto n^{-1/5}$ — a slower convergence rate than the $n^{-1/2}$ parametric rate, which is the price of not assuming a functional form.

</Result>

<BiasVarianceCurve />

In practice, $h$ is chosen by leave-one-out cross-validation: minimize $\mathrm{CV}(h)=\frac1n\sum_i\big(y_i-\hat m_{h,-i}(x_i)\big)^2$, where $\hat m_{h,-i}$ is estimated with observation $i$ removed.

## 8. Code

<CodeBlock lang="R">{`fit <- lm(ret ~ mkt + smb + hml, data = ff_data)
summary(fit)

# local linear (nonparametric) fit of ret on mkt
library(KernSmooth)
np_fit <- locpoly(ff_data$mkt, ff_data$ret, degree = 1, bandwidth = 0.05)`}</CodeBlock>

<CodeBlock lang="Python">{`import statsmodels.api as sm

X = sm.add_constant(ff_data[["mkt", "smb", "hml"]])
fit = sm.OLS(ff_data["ret"], X).fit()
print(fit.summary())

# local linear (nonparametric) fit of ret on mkt
smoothed = sm.nonparametric.lowess(ff_data["ret"], ff_data["mkt"], frac=0.2)`}</CodeBlock>
```

- [ ] **Step 2: Verify the build still passes**

```bash
cd ~/ORF405/notes
npm run build
```

Expected: `✓ built` with no MDX/KaTeX syntax errors.

- [ ] **Step 3: Commit**

```bash
cd ~/ORF405
git add notes/src/content/mnr.mdx
git commit -m "Write full Multiple & Nonparametric Regression content"
```

---

### Task 11: Content — Generalized Linear Models

**Files:**
- Modify: `notes/src/content/glm.mdx` (replaces the Task 9 stub)
- Test: none (verified in Task 13)

- [ ] **Step 1: Replace `notes/src/content/glm.mdx` with the full content**

```mdx
import Proof from '../components/Proof.jsx'
import Result from '../components/Result.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import ResidualComparison from '../components/charts/ResidualComparison.jsx'

<p className="eyebrow">TOPIC 02 OF 09</p>

# Generalized Linear Models

<p className="dek">One framework for binary outcomes, counts, and continuous responses alike.</p>

## 1. Motivation

Linear regression assumes a continuous, unbounded, homoscedastic response. That's the wrong model for a default indicator (bounded in $\{0,1\}$), a trade count (non-negative integer), or claim severity (positive, skewed). GLMs keep the linear predictor but let it drive the mean of *any* exponential-family distribution through a link function.

## 2. The Exponential Family

A response $y$ belongs to the (one-parameter) exponential family if its density or mass function can be written

$$
f(y;\theta,\phi) = \exp\!\left\{ \frac{y\theta - b(\theta)}{a(\phi)} + c(y,\phi) \right\}
$$

where $\theta$ is the canonical parameter, $\phi$ a dispersion parameter, and $b(\cdot)$ the cumulant function. Differentiating the (log of the) density's normalization gives two identities used throughout GLM theory:

$$
E[y]=b'(\theta)=:\mu, \qquad \mathrm{Var}(y)=a(\phi)\,b''(\theta) =: a(\phi)\,V(\mu)
$$

$V(\mu)$ is the *variance function* — it's what makes the Gaussian, Bernoulli, and Poisson cases behave so differently.

<Result label="Examples">

**Gaussian($\mu,\sigma^2$)**: $\theta=\mu$, $b(\theta)=\theta^2/2$, $a(\phi)=\sigma^2$, $V(\mu)=1$.

**Bernoulli($p$)**: $\theta=\log\frac{p}{1-p}$ (the logit), $b(\theta)=\log(1+e^\theta)$, $a(\phi)=1$, $V(\mu)=\mu(1-\mu)$.

**Poisson($\lambda$)**: $\theta=\log\lambda$, $b(\theta)=e^\theta$, $a(\phi)=1$, $V(\mu)=\mu$.

</Result>

## 3. Components of a GLM

A GLM has three pieces: (1) a **random component** — each $y_i$ drawn independently from an exponential-family distribution with mean $\mu_i$; (2) a **systematic component**, the linear predictor $\eta_i = x_i^\top\beta$; and (3) a **link function** $g$ connecting the two, $g(\mu_i)=\eta_i$. The *canonical link* is $g=(b')^{-1}$, i.e. the choice that makes $\theta_i=\eta_i$ directly — identity for Gaussian, logit for Bernoulli, log for Poisson.

## 4. Maximum Likelihood Estimation

For independent observations, the log-likelihood is $\ell(\beta) = \sum_i \big[y_i\theta_i - b(\theta_i)\big]/a(\phi) + c(y_i,\phi)$, with $\theta_i$ tied to $\beta$ through $\eta_i=x_i^\top\beta$ and $\mu_i=g^{-1}(\eta_i)$. Differentiating via the chain rule $\theta_i\to\mu_i\to\eta_i\to\beta_j$ gives the score equations

$$
\frac{\partial \ell}{\partial \beta_j} = \sum_i \frac{y_i-\mu_i}{a(\phi)\,V(\mu_i)\,g'(\mu_i)}\, x_{ij} = 0, \qquad j=0,\dots,p
$$

Because $\mu_i$ depends on $\beta$ nonlinearly through $g$, these equations have no closed-form solution outside the Gaussian/identity-link case — unlike ordinary least squares.

## 5. Iteratively Reweighted Least Squares

The score equations are solved by Fisher scoring, a Newton–Raphson variant that uses the expected (Fisher) information in place of the observed Hessian.

<Proof label="Derivation">

Write $w_i = \big[V(\mu_i)\,g'(\mu_i)^2\big]^{-1}$ (absorbing $a(\phi)$). The score vector and Fisher information have entries

$$
U_j(\beta)=\sum_i w_i\,g'(\mu_i)\,(y_i-\mu_i)\,x_{ij}, \qquad I_{jk}(\beta)=\sum_i w_i\,x_{ij}x_{ik}
$$

The Fisher scoring update $\beta^{(t+1)}=\beta^{(t)}+I(\beta^{(t)})^{-1}U(\beta^{(t)})$, rewritten in matrix form and simplified, collapses to a weighted least-squares step,

$$
\beta^{(t+1)} = \big(X^\top W^{(t)} X\big)^{-1} X^\top W^{(t)} z^{(t)}
$$

where $W^{(t)}=\mathrm{diag}(w_i^{(t)})$ and the *working response* is the local linearization $z_i^{(t)} = \eta_i^{(t)} + \big(y_i-\mu_i^{(t)}\big)g'(\mu_i^{(t)})$. Because $\mu_i^{(t)}$, $w_i^{(t)}$, and $z_i^{(t)}$ are all recomputed at the new $\beta$ each round, this is weighted least squares applied repeatedly — hence "iteratively reweighted."

</Proof>

### Worked example: one IRLS step

Take four points for a logistic fit, $x=(-1,-0.3,0.3,1)$, $y=(0,0,1,1)$, starting from $\beta^{(0)}=(0,0)$. At $\beta^{(0)}$, $\eta_i=0$ for every $i$, so $\mu_i=\mathrm{logistic}(0)=0.5$ and $w_i=\mu_i(1-\mu_i)=0.25$ for all four points (equal weights, since $g'(\mu)=1/[\mu(1-\mu)]=4$ at $\mu=0.5$). The working response is

$$
z_i = \eta_i + (y_i-\mu_i)\,g'(\mu_i) = 0 + (y_i-0.5)\times 4
$$

giving $z=(-2,-2,2,2)$. Because the weights are equal, $\beta^{(1)}$ is just the OLS fit of $z$ on $x$: with $\bar x=0$ and $\bar z=0$,

$$
\hat\beta_1^{(1)} = \frac{\sum_i x_i z_i}{\sum_i x_i^2} = \frac{(-1)(-2)+(-0.3)(-2)+(0.3)(2)+(1)(2)}{1+0.09+0.09+1} = \frac{5.2}{2.18} \approx 2.385
$$

and $\hat\beta_0^{(1)}=0$. So after one IRLS step, $\eta_i^{(1)} \approx 2.385\,x_i$ — already correctly separating the two classes by sign, and IRLS continues refining $w_i$ and $z_i$ at this new $\beta$ until convergence.

## 6. Logistic Regression

Take $y_i\sim\mathrm{Bernoulli}(p_i)$ with the canonical logit link, $\log\frac{p_i}{1-p_i}=x_i^\top\beta$. The log-likelihood is

$$
\ell(\beta) = \sum_i\Big[y_i\, x_i^\top\beta - \log\big(1+e^{x_i^\top\beta}\big)\Big]
$$

with score $X^\top(y-p)=0$, solved by IRLS as above. Because $g(\mu)=\log\frac{\mu}{1-\mu}$, $\beta_j$ is the change in log-odds per unit increase in $x_j$, and $e^{\beta_j}$ is the corresponding odds ratio — the standard reason logistic coefficients are reported exponentiated.

## 7. Poisson Regression

Take $y_i\sim\mathrm{Poisson}(\lambda_i)$ with the canonical log link, $\lambda_i = e^{x_i^\top\beta}$. The log-likelihood is $\ell(\beta)=\sum_i\big[y_i\,x_i^\top\beta - e^{x_i^\top\beta} - \log(y_i!)\big]$, with score $X^\top(y-\lambda)=0$. Here $e^{\beta_j}$ is the multiplicative effect on the expected count per unit increase in $x_j$.

### Overdispersion and quasi-likelihood

The Poisson model forces $\mathrm{Var}(y_i)=\lambda_i$ exactly. Trade or claim counts are usually more dispersed than that. A *quasi-likelihood* model keeps the same mean structure and variance function but lets $\mathrm{Var}(y_i)=\phi\,\lambda_i$ for an estimated dispersion $\phi>1$, with

$$
\hat\phi = \frac{1}{n-p-1}\sum_i \frac{(y_i-\hat\lambda_i)^2}{\hat\lambda_i}
$$

(the Pearson-based estimate). $\hat\beta$ is unchanged from the ordinary Poisson fit — the score equations don't involve $\phi$ — but every standard error is inflated by $\sqrt{\hat\phi}$, which is the whole point: ignoring overdispersion doesn't bias the coefficients, but it makes every test look more significant than it is. When the extra dispersion itself needs a distributional model (not just a variance correction), the negative binomial distribution replaces Poisson outright.

## 8. Deviance & Model Comparison

The deviance generalizes RSS to the GLM setting: $D = 2\,a(\phi)\big[\ell(y;y)-\ell(y;\hat\mu)\big]$, twice the gap between the saturated model's log-likelihood (a perfect fit) and the fitted model's. For Gaussian data with the identity link, $D=\mathrm{RSS}$ exactly. Comparing nested models via $\Delta D = D_{\text{reduced}}-D_{\text{full}}$ gives an asymptotic $\chi^2_{\Delta\mathrm{df}}$ likelihood-ratio test; for non-nested comparisons, $\mathrm{AIC}=-2\ell(\hat\beta)+2(p+1)$ trades fit against complexity.

## 9. Diagnostics

Raw residuals $y_i-\hat\mu_i$ aren't homoscedastic in a GLM, so two standardized versions are used instead: **Pearson residuals**, $r_i^P=(y_i-\hat\mu_i)/\sqrt{V(\hat\mu_i)}$, and **deviance residuals**, $r_i^D=\mathrm{sign}(y_i-\hat\mu_i)\sqrt{d_i}$, where $d_i$ is observation $i$'s contribution to the total deviance.

<ResidualComparison />

## 10. Code

<CodeBlock lang="R">{`# logistic regression
fit <- glm(default ~ credit_score + leverage, data = loans,
            family = binomial(link = "logit"))
summary(fit)
exp(coef(fit))   # odds ratios

# poisson regression
fit_pois <- glm(n_trades ~ volatility + volume, data = trades,
                 family = poisson(link = "log"))`}</CodeBlock>

<CodeBlock lang="Python">{`import statsmodels.api as sm
import statsmodels.formula.api as smf

logit_fit = smf.glm("default ~ credit_score + leverage", data=loans,
                     family=sm.families.Binomial()).fit()
print(logit_fit.summary())

pois_fit = smf.glm("n_trades ~ volatility + volume", data=trades,
                    family=sm.families.Poisson()).fit()`}</CodeBlock>
```

- [ ] **Step 2: Verify the build still passes**

```bash
cd ~/ORF405/notes
npm run build
```

Expected: `✓ built` with no MDX/KaTeX syntax errors.

- [ ] **Step 3: Commit**

```bash
cd ~/ORF405
git add notes/src/content/glm.mdx
git commit -m "Write full Generalized Linear Models content"
```

---

### Task 12: GitHub Pages deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Test: none (verified on push; see note below)

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy notes to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'notes/**'
      - '.github/workflows/deploy.yml'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: notes/package-lock.json
      - name: Install dependencies
        working-directory: notes
        run: npm ci
      - name: Build
        working-directory: notes
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: notes/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
cd ~/ORF405
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deploy workflow for notes site"
```

**Note for whoever runs this plan:** this workflow only takes effect once the repo's Pages source is set to "GitHub Actions" in Settings → Pages on github.com — that's a one-time manual step in the GitHub UI (or `gh api repos/bmart231/ORF405/pages -X POST -f build_type=workflow` if the `gh` CLI is authenticated), not something achievable via git alone. Flag this to the user rather than silently skipping it.

---

### Task 13: Local verification

**Files:** none created or modified.

- [ ] **Step 1: Full production build**

```bash
cd ~/ORF405/notes
npm run build
```

Expected: `✓ built` with no errors or warnings about missing modules.

- [ ] **Step 2: Start a preview server**

```bash
cd ~/ORF405/notes
npm run preview -- --port 4173 &
```

Expected: prints a `Local: http://localhost:4173/ORF405/` URL.

- [ ] **Step 3: Browser-check each written topic and the routing/placeholder behavior**

Using the browser automation tools (load them first if deferred, via `ToolSearch` for `mcp__claude-in-chrome__tabs_create_mcp`, `navigate`, `computer`, `read_page`, `resize_window`):

1. Navigate to `http://localhost:4173/ORF405/#/mnr` — confirm the page shows "Multiple & Nonparametric Regression", the Gauss–Markov `Result` box, the derivation `Proof` boxes with a rendered ∎, all formulas rendered as real math (not raw `$...$` text), and the `FittedLineResiduals` and `BiasVarianceCurve` charts rendering as SVGs with visible axes/curves.
2. Navigate to `http://localhost:4173/ORF405/#/glm` — confirm the IRLS derivation, the worked-example numbers, and the `ResidualComparison` chart render correctly.
3. Click a pending topic (e.g. "Model Selection & Regularization") in the sidebar — confirm it shows the "Not covered yet" placeholder card and the URL updates to `#/msr`.
4. Use `resize_window` to test at ~390px width — confirm the sidebar collapses behind the "☰ Topics" button and no horizontal scrollbar appears on the page body.
5. Check console for errors via `read_console_messages` — expected: no errors.

- [ ] **Step 4: Stop the preview server**

```bash
kill %1
```

- [ ] **Step 5: If anything in Step 3 is broken, fix it and re-run Steps 1–4 before proceeding.**

---

### Task 14: Push the branch

**Files:** none.

- [ ] **Step 1: Push the feature branch to origin**

```bash
cd ~/ORF405
git push -u origin notes-react-rebuild
```

Expected: branch pushed, GitHub prints a compare/PR URL.

- [ ] **Step 2: Stop here.** Do not merge to `main` or open a PR without the user's explicit go-ahead — merging to `main` is what triggers the live GitHub Pages deploy (Task 12), and the one-time Pages-source setting (see Task 12's note) needs to be confirmed first.

---

## Plan self-review notes

- **Spec coverage:** directory layout (Task 1–11), content plan for both written topics including all four requested expansions — worked examples (Tasks 10/11), charts (Tasks 6–8), deeper proofs (already textbook-depth, retained and extended in Tasks 10/11), extra sub-topics (WLS preview in Task 10, quasi-likelihood in Task 11) — visual design (Task 3), deployment (Task 12), update workflow (documented in the spec itself, not a separate task since it's a future-session instruction, not a build step) are all covered.
- **Scope:** this is one cohesive feature (rebuild the notes site) even though it spans many files; not decomposed further because the pieces are tightly coupled (routing depends on the registry, content depends on the components, etc.) and none of them is independently useful on its own.
