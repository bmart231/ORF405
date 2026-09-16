# ORF 405 Notes — React Rebuild

## Purpose

A course-notes website for Princeton ORF 405 (Regression & Applied Time Series),
covering the syllabus topic by topic with textbook/proof-depth explanations.
Replaces an earlier single-page Claude Artifact prototype with a proper React
site living in this repo, alongside the existing `Homework1/` material (homework
stays out of scope for this project — it's tracked separately).

The site is for building conceptual understanding, not for homework help.
Content is added topic by topic as the course covers it in lecture.

## Non-goals

- Homework assistance (handled separately, not part of this site)
- User accounts, comments, or any backend/database
- Content for topics not yet covered in lecture (they get placeholder pages)

## Architecture

**Stack**: Vite + React (JavaScript, no TypeScript — keeps content files simple
to author), MDX for content, `react-router-dom` in hash-routing mode, deployed
to GitHub Pages via GitHub Actions.

**Why MDX**: Each topic is authored as near-Markdown prose with embedded custom
components (`<Proof>`, `<Result>`, `<Chart>`) for math and code. This keeps the
"write a new topic after lecture" workflow lightweight — no hand-written JSX for
every paragraph.

**Why hash routing**: GitHub Pages project sites (`bmart231.github.io/ORF405`)
have no server-side rewrite support. Hash-based routes (`/#/glm`) resolve
entirely client-side, so per-topic URLs work without any server configuration.

**Why no charting library**: A handful of illustrative plots (bias-variance
curve, fitted regression line with residuals) don't justify a dependency like
Recharts. Each is a small hand-built inline-SVG React component with real
computed data (per the design system: axes at real scale, labeled ticks,
theme-aware colors).

## Directory layout

```
ORF405/
  Homework1/                  (existing, untouched)
  notes/                       (new — the React app)
    package.json
    vite.config.js             (base: '/ORF405/' for GH Pages)
    index.html
    src/
      main.jsx
      App.jsx                  (router + layout shell)
      components/
        Sidebar.jsx            (topic list, ready/pending state)
        Layout.jsx
        Proof.jsx               (proof box: label + content + ∎)
        Result.jsx               (boxed theorem/definition)
        CodeBlock.jsx            (language-tagged code panel)
        Placeholder.jsx          ("not covered yet" card)
        charts/
          BiasVarianceCurve.jsx
          FittedLineResiduals.jsx
          ... (one component per plot, added as needed)
      content/
        topics.js                (ordered topic registry: slug, title, status, component)
        mnr.mdx                  (Multiple & Nonparametric Regression — written)
        glm.mdx                  (Generalized Linear Models — written)
        (msr.mdx, cls.mdx, dl.mdx, uns.mdx, sts.mdx, lts.mdx, vol.mdx — added as covered)
      styles/
        tokens.css               (color/type tokens, light+dark, ported from the artifact)
  .github/
    workflows/
      deploy.yml                 (build notes/, deploy dist/ to GitHub Pages on push to main)
  docs/superpowers/specs/        (this spec)
```

## Content plan

**Written now (expanded from the artifact prototype), textbook/proof depth:**

1. **Multiple & Nonparametric Regression** — motivation, model + Gauss-Markov
   assumptions, least-squares derivation (normal equations, proof), OLS
   properties (unbiasedness proof, variance, Gauss-Markov theorem proof),
   inference (t/F tests), goodness of fit, nonparametric regression
   (Nadaraya-Watson derivation, local polynomial regression, bias-variance
   tradeoff, bandwidth selection via CV), plus for this rebuild: a worked
   numerical example fitting a small synthetic dataset by hand through the
   normal equations, an inline chart of the bias-variance tradeoff vs.
   bandwidth, a boundary-bias example motivating local-linear over
   Nadaraya-Watson, and a short weighted-least-squares subsection (foreshadowing
   GLM/IRLS). R and Python code snippets.

2. **Generalized Linear Models** — motivation, exponential family (with
   derivation of the mean/variance identities from the cumulant function), GLM
   components, MLE and score equations, IRLS derivation (Fisher scoring, full
   step-by-step), logistic and Poisson regression as special cases, deviance and
   model comparison, diagnostics, plus for this rebuild: a worked
   logistic-regression example with hand-computed IRLS iterations on a tiny
   dataset, an inline chart comparing raw vs. deviance residuals, and a short
   quasi-likelihood/overdispersion subsection. R and Python code snippets.

**Placeholder now, filled in as lecture covers them:** Model Selection &
Regularization, Classification & Supervised Learning, Introduction to Deep
Learning, Unsupervised Learning, Stationary Time Series & Martingales, Linear
Time Series, Discrete-Time Volatility Models.

## Visual design

Carried over from the approved artifact design: paper/ink palette with a
Princeton-orange accent, Fraunces (display) + Source Serif 4 (body) + IBM Plex
Mono (code/labels), light and dark mode via CSS custom properties, sidebar +
single-column reading layout, responsive down to phone width.

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers on push to
`main` affecting `notes/`: installs dependencies, runs `npm run build` in
`notes/`, publishes `notes/dist` to the `gh-pages` environment via
`actions/deploy-pages`. Live at `https://bmart231.github.io/ORF405/`.

## Update workflow

To add a topic once it's covered in lecture: add `<slug>.mdx` under
`notes/src/content/`, register it in `topics.js` with status `"ready"`, remove
its placeholder entry. Push to `main`; the site redeploys automatically.

## Testing

No automated test suite — this is a static content site with no business logic
to unit test. Verification is: `npm run build` succeeds, and the deployed site
is checked manually in a browser (routing between topics, math rendering,
light/dark mode, phone width).
