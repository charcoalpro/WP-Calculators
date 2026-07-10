/* =============================================================================
 * CCX — generator/build-embedded.js  ·  SELF-CONTAINED "SIMPLE MODE" BLOCKS
 * -----------------------------------------------------------------------------
 * Wraps each server-rendered static block (dist/static/*.html) with the shared
 * styles and scripts INLINE, producing one standalone file per calculator in
 * dist/embedded/. Each file is a complete Custom HTML block: paste it into a
 * page and it works — no enqueue, no functions.php, no plugin, no uploaded
 * assets, no API. The static tables/text (what AI reads) are plain HTML; the
 * interactive widget runs from the inline script.
 *
 * It reuses the already-built, already-verified dist/ccx.min.css and
 * dist/ccx.min.js, so nothing is re-concatenated by hand.
 *
 *   USAGE:  node generator/build-embedded.js
 *   (run AFTER build-static.js + the minify step, whenever figures change)
 *
 * ONE CALCULATOR PER PAGE: each block carries the full bundle. That's the plan
 * anyway; putting two on one page just loads the bundle twice (harmless — the
 * core is guarded and mounts are de-duplicated).
 * ========================================================================== */
"use strict";
var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var DIST = path.join(ROOT, "dist");
var STATIC_DIR = path.join(DIST, "static");
var OUT_DIR = path.join(DIST, "embedded");

var CALCS = [
  ["container-load",  "Container Load"],
  ["landed-cost",     "Landed Cost"],
  ["profit-margin",   "Reseller Margin"],
  ["transit-time",    "Transit Time"],
  ["moq-pricing",     "Volume Pricing"],
  ["incoterms",       "Incoterms"],
  ["roi-payback",     "ROI & Payback"],
  ["spec-comparison", "Spec Comparison"]
];

function read(p) { return fs.readFileSync(p, "utf8"); }

// Escape any accidental closing tags so inlined CSS/JS can't break out of their
// host <style>/<script> element.
//
// HARDENING (fixes "Uncaught SyntaxError: Unexpected token '<'"):
// WordPress themes/plugins that re-apply wpautop/nl2br to block content WITHOUT
// shielding <script> (GeneratePress Elements, page-builder HTML widgets, some
// inline-JS optimizers) inject "<br />" at newlines *inside* the script element.
// The first token the JS parser then sees is "<". We remove every newline the
// filter could grab: the asset is emitted on the SAME line as its opening and
// closing tag, with all internal newlines collapsed. No "\n" inside the element
// means autop/nl2br has nothing to insert.
//
// We also neutralise "<!--", which flips the HTML tokenizer into "script data
// escaped" state and can swallow the real </script>.
function collapse(src) {
  return String(src).replace(/\r\n?/g, "\n").replace(/\n+/g, " ").trim();
}
function safeForStyle(css) {
  return collapse(css).replace(/<\/style>/gi, "<\\/style>");
}
function safeForScript(js) {
  var out = collapse(js);
  // "<\/script>" is the standard, parser-safe form inside JS string/regex literals.
  out = out.replace(/<\/script>/gi, "<\\/script>");
  // "<!--" has no safe escape in general JS source, so fail loudly rather than
  // silently emit a block that dies in the browser. (terser never emits it.)
  if (out.indexOf("<!--") !== -1) {
    throw new Error("ccx.min.js contains '<!--', which would break the inline <script>. Refusing to build.");
  }
  return out;
}

var css = safeForStyle(read(path.join(DIST, "ccx.min.css")));
var js  = safeForScript(read(path.join(DIST, "ccx.min.js")));

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

var previewParts = [];
CALCS.forEach(function (c) {
  var name = c[0];
  var srcPath = path.join(STATIC_DIR, name + ".html");
  if (!fs.existsSync(srcPath)) { console.warn("  skip (missing): " + name); return; }
  var staticHtml = read(srcPath).trim();

  var header =
    "<!-- CCX self-contained block: " + c[1] + " (" + name + "). " +
    "Paste this ENTIRE block into a WordPress Custom HTML block on its own page. " +
    "No setup, no plugin, no theme edits. One calculator per page. -->\n";

  // NOTE: no newline between a tag and its content. Newlines inside <script>/<style>
  // are exactly what autop/nl2br filters turn into "<br />", corrupting the JS.
  var block =
    header +
    "<style>" + css + "</style>\n" +
    staticHtml + "\n" +
    "<script>" + js + "</script>\n";

  var outPath = path.join(OUT_DIR, name + ".html");
  fs.writeFileSync(outPath, block, "utf8");
  console.log("  wrote dist/embedded/" + name + ".html  (" + Math.round(block.length / 1024) + " KB)");

  previewParts.push(
    '<section style="max-width:820px;margin:40px auto;padding:0 16px">' +
    '<h2 style="font:600 14px system-ui;color:#888;border-bottom:1px solid #ddd;padding-bottom:6px">' +
    c[1] + " &mdash; " + name + "</h2>\n" + block + "</section>"
  );
});

// A single openable page to preview all eight self-contained blocks together.
var preview =
  "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">" +
  "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
  "<title>CCX self-contained blocks — preview</title>" +
  "<style>body{margin:0;background:#f5f5f5;font-family:system-ui,sans-serif}</style></head><body>" +
  "<p style=\"max-width:820px;margin:24px auto;padding:0 16px;color:#555;font:14px system-ui\">" +
  "Preview of all eight self-contained blocks on one page (in production each goes on its own page). " +
  "Each renders its static tables and its interactive widget with no external files.</p>" +
  previewParts.join("\n") +
  "</body></html>";
fs.writeFileSync(path.join(OUT_DIR, "preview-all.html"), preview, "utf8");
console.log("  wrote dist/embedded/preview-all.html");
console.log("Done. Paste any dist/embedded/*.html into a Custom HTML block — nothing else to install.");
