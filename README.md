# Coconut-Shell Charcoal B2B Calculators

Eight self-contained calculators for a WordPress site selling wholesale coconut-shell shisha/hookah charcoal (Indonesia → global export, full-container / ~18 t MOQ). Built for **SEO + GEO (AI citation) + UX** at once.

Author/reviewer of record: **Greg Ryabtsev**. Theme target: **GeneratePress**. Language: **English**.

---

## The one principle everything hangs on

Every calculator ships as **two layers on the same page**:

1. **Static layer (the asset)** — server-rendered HTML: worked-example tables, reference tables, answer-capsule sentences, methodology, FAQ, JSON-LD. This is what ChatGPT / Perplexity / Gemini / Google AI Overviews read and cite. **It is present in View Source with JavaScript disabled.**
2. **Interactive layer (the magnet)** — a vanilla-JS widget that lets a visitor compute their own numbers. AI can't see it; its job is engagement and earning backlinks that lift the static layer.

Both layers derive every number from **one shared config + one shared formula file**, so the citable tables and the live widget can never disagree. Change a number in `src/config.js`, re-run the generator, re-paste the block.

> **Data is baked in at build time, never fetched by the browser.** Every number is read from `src/config.js` when you run the generator and written straight into the HTML. If a widget fetched anything and rendered numbers with JS, those numbers would be invisible to AI — defeating the whole design.

---

## Repo layout

```
charcoal-calculators/
  src/
    config.js            ← SINGLE SOURCE OF TRUTH (all volatile numbers; dummy for now)
    formulas.js          ← pure calc engine (all 8 calculators), used by widget + generator
    ccx.css              ← one namespaced stylesheet (.ccx)
    widgets/
      _util.js           ← shared browser helpers (mount, fields, result, a11y)
      container-load.js  landed-cost.js  profit-margin.js  transit-time.js
      moq-pricing.js     incoterms.js    roi-payback.js    spec-comparison.js
  generator/
    build-static.js      ← Node: renders the static HTML blocks from config+formulas
    build-embedded.js    ← Node: wraps each block with inline CSS+JS (self-contained "Simple Mode")
    api-adapter.js       ← Node: (optional) pulls numbers from the cPanel API at BUILD TIME
  update-from-api.sh     ← one command: pull from the API + rebuild all blocks
  INSTALL-WORDPRESS.md   ← ⭐ step-by-step deploy guide (start here)
  dist/
    static/*.html        ← the 8 blocks (shared-asset mode: paste + enqueue ccx.min.*)
    embedded/*.html      ← the 8 self-contained blocks (Simple Mode: paste only, nothing to install)
    ccx.min.js           ← concatenated + minified widgets (load once, site-wide)
    ccx.min.css          ← minified styles (load once, site-wide)
  wordpress/
    ccx-enqueue.php      ← GeneratePress child-theme / WPCode enqueue snippet (shared-asset mode)
    llms.txt             ← sample, upload to site root
    robots-crawlers-note.md
  README.md
```

---

## Build & update workflow

Requires Node 18+ (built with v22).

```bash
# 1. edit your figures in src/config.js  (the single source of truth)

# 2. regenerate the static blocks
node generator/build-static.js            # writes dist/static/*.html

# 3. rebuild the minified bundle (any minifier; example uses terser + clean-css-cli)
npx terser  <concat of config+formulas+_util+widgets> --compress --mangle -o dist/ccx.min.js
npx cleancss -o dist/ccx.min.css src/ccx.css

# 4. (Simple Mode) wrap each block with inline CSS+JS -> self-contained files
node generator/build-embedded.js          # writes dist/embedded/*.html
```

Concatenation order for the JS bundle matters: `config.js → formulas.js → widgets/_util.js → the 8 widgets`.

**To deploy in WordPress, follow `INSTALL-WORDPRESS.md`** (step-by-step). In short: paste each
`dist/embedded/*.html` into a Custom HTML block on its own page — no plugin, no theme edits,
nothing to install. Open `dist/embedded/preview-all.html` to preview all eight locally first.
(Advanced alternative: the shared-asset method loads `dist/ccx.min.*` once via
`wordpress/ccx-enqueue.php` and pastes the `dist/static/*.html` blocks — see `INSTALL-WORDPRESS.md` §Method B.)

**Optional — drive numbers from the cPanel database (Part 2 of the suite):** instead of editing
`config.js` by hand, run `./update-from-api.sh` (with `CCX_API_URL` + `CCX_API_TOKEN` set) to pull
`GET /config` from the API and rebuild all blocks in one step. This is a **build-time** pull —
WordPress never calls the API. See `../cpanel-api/INSTALL-CPANEL-API.md` and the suite `README.md`.

**Monthly:** re-verify freight and the **US–Indonesia tariff** (the two most perishable inputs), update `config.js`, regenerate, re-paste, bump version, clear cache.

---

## What is dummy vs real

Everything in `config.js` is **illustrative** right now and labelled as such on-page. Before go-live, replace with verified data:

- **Highest volatility:** US–Indonesia tariff (post-IEEPA / Section 122 / reciprocal dynamics) and ocean freight — re-check monthly.
- **Replace with your real values:** carton dimensions/CBM (or container tonnages will be slightly off), spec benchmarks (against your actual COA), FOB pricing, duty rates by country, destination handling costs.
- **E-E-A-T placeholders in `config.author`:** org name/URL/logo, Greg's job title, an author/about page URL, and profile `sameAs` links. The name is real; **do not invent credentials** — fill in real ones or leave blank.
- **Your strongest differentiator:** publish your **own burn-test / COA data** as a static data page and cite it from the spec tool. Neither charcoal.pro (no calculators) nor Tropaxis (JS-hidden numbers) can match server-rendered original data.

---

## Sizes

- `ccx.min.js` ≈ 25 KB, `ccx.min.css` ≈ 6 KB (each under the 30 KB budget; ~10 KB gzipped combined).
- One shared bundle, cached across pages. Each page runs only the one widget whose `data-ccx` mount exists; the other seven no-op.
- To trim further, gate the enqueue to `/tools/` pages (commented block in `ccx-enqueue.php`) or split per-page bundles.

---

## Acceptance criteria — status

1. **SSR test** — all tables + capsules present with JS disabled / in View Source ✔ (numbers are literal HTML; verified by grep across all 8 blocks).
2. **Sync test** — change a config value → regenerated block moves with it; widget uses the same `formulas.js` ✔ (freight 3500→4200 moved US landed 27,658→28,360, then restored).
3. **No console errors / self-init only where mount exists** — widgets guard on `CCX.util` and `mountAll` only touches matching nodes ✔ (all JS passes `node --check`, incl. minified bundle).
4. **No style leakage** — every rule scoped under `.ccx`; box-sizing reset scoped; test on GeneratePress + Twenty Twenty-Four.
5. **No globals but `window.CCX`; no storage** — IIFEs + single namespace; no localStorage/sessionStorage/cookies ✔.
6. **Accessibility** — `<label for>` on every input, `aria-live="polite"` results, 44px targets, visible focus, AA contrast tokens ✔.
7. **Mobile** — single-column inputs; wide tables scroll inside `.ccx-table-scroll`; no page overflow at 360px.
8. **Numbers match** — every cell computed from `formulas.js`; spot-checks hand-verified (US 27,658; India 33,541; DE 28,662).
9. **Freshness + cites** — "Last verified" stamp on every block; CBP N306942, IMDG SP 978, HS 4402.20, UN 1361, Incoterms 2020 present as static text ✔.
10. **Weight-limit finding surfaced** — container-load states charcoal binds on weight, not volume ✔.

Items 4 and 7 need a final visual check in a real browser on two themes; everything else is verified in the build.
