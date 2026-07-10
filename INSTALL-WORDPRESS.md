# Part 1 — Install the Calculators in WordPress

**Goal:** put the 8 calculators live on your site.
**You do NOT need:** a plugin, a child theme, file uploads, or a database.
**Time:** ~3 minutes per calculator.

There are two methods. **Use Method A (Simple Mode).** Method B is optional and only
worth it if you run many calculator pages and want them to share one cached file.

---

## Method A — Simple Mode (recommended)

Each calculator is **one self-contained file** in `dist/embedded/`. You paste the whole
file into a Custom HTML block on its own page. The styles and the interactive widget are
inside the file, so there is nothing else to set up.

### Step 0 — Preview locally first (optional but reassuring)

Double-click **`dist/embedded/preview-all.html`**. It opens in your browser and shows all
eight calculators working, with no server involved. If they look right here, they’ll look
right on your site.

### Step 1 — Back up (30 seconds)

Most hosts have a one-click backup, or use a plugin like UpdraftPlus. You won’t need it —
pasting into a Custom HTML block can’t break your site — but do it anyway.

### Step 2 — Create the first page as a draft

1. WordPress admin → **Pages → Add New**.
2. Give it a title, e.g. **“Container Load Calculator.”**
3. Set the URL slug to match the cross-links (see the table below), e.g. `container-load`.
4. **Don’t publish yet** — leave it as a draft.

### Step 3 — Paste the calculator

1. Open the matching file from `dist/embedded/`, e.g. **`container-load.html`**, in any
   text editor.
2. **Select all → copy** (include the little `<!-- ... -->` comment at the top).
3. In the page, click **＋** to add a block, search **“Custom HTML,”** and paste into the box.

### Step 4 — Preview, then publish

1. Click **Preview** (top right) → **Preview in new tab**.
2. You should see the tables and text, and an interactive box you can type into.
3. If it looks good, **Publish**.

### Step 5 — Repeat for the other seven

Do Steps 2–4 for each file. **One calculator per page.**

| File in `dist/embedded/` | Suggested page title | Suggested slug |
|---|---|---|
| `container-load.html` | Container Load Calculator | `container-load` |
| `landed-cost.html` | Landed Cost Calculator | `landed-cost` |
| `profit-margin.html` | Reseller Margin Calculator | `profit-margin` |
| `transit-time.html` | Transit Time Estimator | `transit-time` |
| `moq-pricing.html` | Volume Pricing / MOQ | `moq-pricing` |
| `incoterms.html` | Incoterms Cost Comparison | `incoterms` |
| `roi-payback.html` | ROI & Payback Calculator | `roi-payback` |
| `spec-comparison.html` | Spec Comparison | `spec-comparison` |

> **Slugs are up to you.** The blocks no longer contain a related-tools menu, so nothing
> depends on these exact paths. Pick whatever URLs suit your site structure.

That’s the whole install. Nothing was added to your theme; deleting a block later removes
it cleanly and affects nothing else.

---

## Updating the numbers later

Everything for a calculator lives inside its one block, so updating = replace the block.
You have two ways to produce updated blocks:

**Option 1 — edit by hand (no API).** Open `src/config.js`, change the value, then rebuild:

```bash
node generator/build-static.js
node generator/build-embedded.js
```

**Option 2 — pull from your cPanel database (if you set up Part 2).** One command:

```bash
export CCX_API_URL="https://id.charcoal.pro/admin/api"
export CCX_API_TOKEN="the-same-token-as-in-cpanel-api/public/lib/config.php"
./update-from-api.sh
```

Either way, then in WordPress: edit the page → click the Custom HTML block → **select all
in the block → delete → paste the new file** → **Update** → clear any caching plugin.

> **Monthly:** re-check the **US–Indonesia tariff** and **ocean freight** (the two most
> perishable numbers), rebuild, and re-paste those blocks.

---

## Method B — Shared assets (optional, advanced)

Use this only if you’ll have many calculator pages and want them to share one cached CSS +
JS file instead of embedding them in every block. It requires either a small theme snippet
or a code-snippets plugin.

1. Upload `dist/ccx.min.css` and `dist/ccx.min.js` to your child theme’s `/assets/` folder.
2. Add the enqueue snippet from `wordpress/ccx-enqueue.php` (child-theme `functions.php`, or
   a WPCode/Code Snippets PHP snippet set to run site-wide). Editing `functions.php` directly
   is the one step that can white-screen a site if mistyped — a code-snippets plugin is safer.
3. Paste each `dist/static/*.html` (the **static** folder, not `embedded/`) into a Custom
   HTML block on its own page — these are the same blocks without the inlined assets.
4. Bump `CCX_ASSET_VER` in the snippet and clear cache after each update.

Simple Mode (Method A) does the same thing with zero setup, at the cost of ~40 KB extra per
page (invisible to visitors). If in doubt, use Method A.

---

## Troubleshooting

- **Console shows `Uncaught SyntaxError: Unexpected token '<'` and the calculator never
  appears (tables still fine).** This means something on your site edited the pasted script
  before the browser parsed it — a theme/plugin re-applying WordPress's auto-paragraph
  (`wpautop`/`nl2br`) filter inserted a `<br />` *inside* the `<script>`. The blocks are now
  built as a single line specifically so there is no newline for such a filter to grab, so
  re-paste the current `dist/embedded/*.html` and it will run. To confirm the block is intact,
  open **View Source** on the page and check the `<script>` opens and closes on one line with
  no `<br />` or `<p>` inside it.
- **Still broken after re-pasting?** A JS-optimizing plugin (Autoptimize, LiteSpeed, WP Rocket,
  Cloudflare Rocket Loader) may be rewriting inline scripts. Exclude the page from inline-JS
  minification/combination, or switch that page to Method B below.
- **A change didn’t show up.** Clear your caching plugin / host cache and hard-refresh
  (Ctrl/Cmd-Shift-R).
- **The widget box doesn’t appear, but the tables do.** Make sure you pasted the *entire*
  file (the `<script>` at the bottom included) into a **Custom HTML** block — not a
  Paragraph or Classic block, which can strip scripts.
- **Two calculators on one page.** Supported, but each carries the full bundle. Prefer one
  per page. If you need several on a page, tell me and I’ll produce a combined block.
- **Styling looks off.** The calculator styles are scoped and can’t affect your theme, but a
  very aggressive theme could style tables/buttons. If so, send a screenshot and I’ll add a
  couple of defensive rules.
