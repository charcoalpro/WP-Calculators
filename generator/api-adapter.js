/* =============================================================================
 * CCX — generator/api-adapter.js  ·  THE CONNECTOR (BUILD TIME ONLY)
 * -----------------------------------------------------------------------------
 * This is the bridge between the two parts of the suite:
 *
 *     cpanel-api (MySQL)  --GET /config-->  api-adapter.js  --writes-->  src/config.js
 *
 * It fetches GET {API}/config from the admin API and regenerates src/config.js
 * from it. Because /config already returns the exact config shape, this is a
 * straight fetch-and-write — no field mapping. Runs on your machine / CI as part
 * of the build; it is NEVER shipped to the browser.
 *
 *   WHY BUILD-TIME: if the browser fetched the API the numbers would render via
 *   JS and be invisible to AI engines — the whole point of the two-layer design.
 *   WordPress never calls the API. You pull here, rebuild, and paste.
 *
 *   USAGE (URL + token must match cpanel-api/public/lib/config.php 'token'):
 *     CCX_API_URL=https://id.charcoal.pro/admin/api CCX_API_TOKEN=xxxx \
 *       node generator/api-adapter.js            # dry run: fetch + validate + summary
 *     ... node generator/api-adapter.js --write   # regenerate src/config.js
 *     (then)  node generator/build-static.js       # rebuild the static blocks
 *             node generator/build-embedded.js     # rebuild the self-contained blocks
 *
 * Requires Node 18+ (built-in fetch).
 * ========================================================================== */
"use strict";
var fs = require("fs");
var path = require("path");

var API_URL = (process.env.CCX_API_URL || "https://id.charcoal.pro/admin/api").replace(/\/+$/, "");
var API_TOKEN = process.env.CCX_API_TOKEN || "";
var WRITE = process.argv.indexOf("--write") !== -1;
var CONFIG_PATH = path.join(__dirname, "..", "src", "config.js");

var REQUIRED_KEYS = [
  "meta", "author", "pricing", "containers", "packing_efficiency", "cartons",
  "cube_sizes_mm", "duty", "insurance_rate", "dest_handling",
  "freight_per_container", "transit_days", "routing_note", "ports",
  "leadtime", "price_breaks", "specs", "defaults"
];

function renderConfigJs(cfg) {
  var body = JSON.stringify(cfg, null, 2).replace(/\n/g, "\n  ");
  var stamp = new Date().toISOString();
  return (
"/*! CCX config.js — GENERATED from the admin API at build time. Do NOT hand-edit.\n" +
" *  Source of truth: the database behind " + API_URL + "/config\n" +
" *  Regenerate:  node generator/api-adapter.js --write  &&  node generator/build-static.js\n" +
" *  Generated:   " + stamp + "\n" +
" */\n" +
"(function (root, factory) {\n" +
"  var cfg = factory();\n" +
"  if (typeof module !== \"undefined\" && module.exports) module.exports = cfg;\n" +
"  else { root.CCX = root.CCX || {}; root.CCX.config = cfg; }\n" +
"})(typeof self !== \"undefined\" ? self : this, function () {\n" +
"  return " + body + ";\n" +
"});\n"
  );
}

(async function main() {
  console.log("Fetching " + API_URL + "/config" + (API_TOKEN ? " (authorised)" : " (no token set!)"));
  var cfg;
  try {
    // Cache-buster: the API is fronted by LiteSpeed on a WordPress host; without a
    // unique query string a stale/partial /config can be served, failing validation.
    var res = await fetch(API_URL + "/config?_cb=" + Date.now(), { headers: { "X-API-Key": API_TOKEN, "Accept": "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText);
    cfg = await res.json();
  } catch (e) {
    console.error("FETCH FAILED: " + e.message);
    console.error("src/config.js is unchanged. Check CCX_API_URL / CCX_API_TOKEN, remote MySQL, and that the API is deployed.");
    process.exit(1);
  }

  var missing = REQUIRED_KEYS.filter(function (k) { return !(k in cfg); });
  if (missing.length) {
    console.error("VALIDATION FAILED — /config is missing keys: " + missing.join(", "));
    console.error("Refusing to overwrite config.js with an incomplete response.");
    process.exit(1);
  }

  var lanes = Object.keys(cfg.freight_per_container || {}).length;
  var countries = Object.keys(cfg.duty || {}).length;
  console.log("OK — verified " + (cfg.meta && cfg.meta.verified) + ", dummy=" + (cfg.meta && cfg.meta.data_is_dummy) +
    ", " + countries + " countries, " + lanes + " lanes, " + (cfg.price_breaks || []).length + " price tiers.");

  if (WRITE) {
    fs.writeFileSync(CONFIG_PATH, renderConfigJs(cfg), "utf8");
    console.log("Wrote src/config.js. Now run: node generator/build-static.js && node generator/build-embedded.js");
  } else {
    console.log("Dry run only. Re-run with --write to regenerate src/config.js, then rebuild the blocks.");
  }
})();
