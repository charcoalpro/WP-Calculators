/* =============================================================================
 * CCX — generator/build-bundle.js  ·  EXTERNAL WIDGET BUNDLE
 * -----------------------------------------------------------------------------
 * Concatenates the SAME source the inline block uses (config + formulas + util +
 * widgets) into ONE plain file: dist/ccx-app.js. Served as a normal external
 * <script> (via CDN), so WordPress content filters (wpautop, wptexturize/entity
 * encoding, WPML) and JS optimizers (FlyingPress) can't corrupt it the way they
 * mangle an inline <script> pasted into post content.
 *
 * config.js is regenerated from the live API each build, so the widget's numbers
 * stay in sync with the static tables. No minifier required.
 *
 *   Run:  node generator/build-bundle.js   (after api-adapter.js --write)
 * ========================================================================== */
"use strict";
var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var SRC = path.join(ROOT, "src");

// Order matters: config/formulas/util must precede the widgets that read them.
var FILES = [
  "config.js",
  "formulas.js",
  "widgets/_util.js",
  "widgets/container-load.js",
  "widgets/landed-cost.js",
  "widgets/profit-margin.js",
  "widgets/transit-time.js",
  "widgets/moq-pricing.js",
  "widgets/incoterms.js",
  "widgets/roi-payback.js",
  "widgets/spec-comparison.js",
  "widgets/packaging-price.js"
];

var stamp = new Date().toISOString();
var parts = FILES.map(function (f) {
  return "/* ---- " + f + " ---- */\n" + fs.readFileSync(path.join(SRC, f), "utf8");
});
// ";" between IIFEs guards against any file that omits a trailing semicolon.
var out =
  "/*! CCX ccx-app.js — external widget bundle. Generated " + stamp + ". Do NOT hand-edit. */\n" +
  parts.join("\n;\n") + "\n";

var outPath = path.join(ROOT, "dist", "ccx-app.js");
fs.writeFileSync(outPath, out, "utf8");
console.log("wrote dist/ccx-app.js (" + Math.round(out.length / 1024) + " KB)");
