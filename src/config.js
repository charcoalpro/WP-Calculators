/* =============================================================================
 * CCX — config.js  ·  SINGLE SOURCE OF TRUTH
 * -----------------------------------------------------------------------------
 * Every volatile number lives HERE and nowhere else. Both the browser widget
 * and the Node static-table generator read this same object, which is the only
 * reason the interactive numbers and the AI-citable static tables can never
 * disagree.
 *
 * DUAL-USE (UMD): in the browser this attaches to window.CCX.config; in Node it
 * is module.exports. Do not convert to ESM-only or browser-only — the shared
 * contract is what keeps the two layers in sync.
 *
 * DATA SOURCE: the values below are DUMMY / illustrative and safe to build with.
 * Edit them here — this file is the single source of truth. Data is baked into the
 * static HTML at build time on purpose — it is never fetched by client JS, or it
 * would be invisible to AI engines (the whole point of the two-layer design).
 *
 * Every figure marked VERIFY is volatile. Freight and the US–Indonesia tariff
 * are the most perishable and must be re-checked monthly before regenerating.
 * ========================================================================== */
(function (root, factory) {
  var cfg = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = cfg;                 // Node (generator)
  } else {
    root.CCX = root.CCX || {};
    root.CCX.config = cfg;                // Browser: window.CCX.config
  }
})(typeof self !== "undefined" ? self : this, function () {
  return {
    meta: {
      verified: "2026-06",                // shown as "Last verified" + in footnotes
      currency: "USD",
      hs_code: "4402.20",
      data_is_dummy: true                 // flip to false once API/verified data is wired
    },

    /* -----------------------------------------------------------------------
     * AUTHOR / ORG — powers Organization + Person JSON-LD (E-E-A-T).
     * Name is real. Fields marked TODO are placeholders — replace with Greg's
     * real credentials before go-live. Do NOT invent credentials.
     * --------------------------------------------------------------------- */
    author: {
      org_name: "Charcoal.pro",                          // TODO: confirm legal/trading name
      org_url: "https://charcoal.pro",                   // TODO: confirm canonical domain
      org_logo: "https://charcoal.pro/logo.png",         // TODO: real logo URL
      person_name: "Greg Ryabtsev",
      person_jobtitle: "Founder",                        // TODO: confirm exact title
      person_url: "https://charcoal.pro/about",          // TODO: author/about page
      person_sameas: [],                                 // TODO: LinkedIn / profile URLs
      person_credentials: ""                             // TODO: e.g. "10+ yrs coconut-charcoal export" — real only
    },

    /* --- Pricing (USD/tonne) — VERIFY, volatile ------------------------- */
    pricing: { exw_per_t: 1000, fob_per_t: 1300, market_low: 1200, market_high: 1400 },

    /* --- Containers: charcoal is dense -> WEIGHT-capped, not volume-capped.
     * max_net_t = practical net charcoal payload after SP978 headspace/packing. */
    containers: {
      "20ft":   { label: "20ft Standard",  cbm: 33, max_net_t: 19.0 },
      "40ft":   { label: "40ft Standard",  cbm: 67, max_net_t: 25.5 },
      "40ftHC": { label: "40ft High Cube", cbm: 76, max_net_t: 26.0 }
    },
    packing_efficiency: 0.88,             // gaps + >=30cm SP978 headspace

    /* --- Master cartons: net kg + CBM per carton — VERIFY to real packaging -
     * CBM reflects ~0.70 t/m3 effective packed density of coconut charcoal cubes
     * (cube density ~0.9 g/cc minus in-carton gaps). These DUMMY dims make weight
     * the binding constraint on every container — which is the real-world finding.
     * Replace with the client's actual carton dimensions before go-live. */
    cartons: {
      "1kg":  { net_kg: 1,  cbm: 0.0014 },
      "10kg": { net_kg: 10, cbm: 0.0143 },
      "20kg": { net_kg: 20, cbm: 0.0286 },
      "24kg": { net_kg: 24, cbm: 0.0343 }
    },

    cube_sizes_mm: [25, 26, 27],          // affects burn spec, not carton math

    /* --- Import duty by destination. rate = fraction of customs value. VERIFY ALL */
    duty: {
      US: { rate: 0.00, basis: "FOB", label: "United States", note: "HS4402.20 duty-free per CBP N306942. VERIFY current Section 122 / reciprocal surcharge on Indonesian origin — HIGHLY VOLATILE." },
      DE: { rate: 0.00, basis: "CIF", label: "Germany",       note: "EU TARIC HS4402.20. VERIFY." },
      UK: { rate: 0.00, basis: "CIF", label: "United Kingdom", note: "UK Global Tariff. VERIFY." },
      SA: { rate: 0.05, basis: "CIF", label: "Saudi Arabia",  note: "GCC common tariff ~5%. SASO/SABER PCoC+SCoC mandatory. VERIFY." },
      IN: { rate: 0.30, basis: "CIF", label: "India",         note: "~30% effective. VERIFY." },
      TR: { rate: 0.00, basis: "CIF", label: "Turkey",        note: "VERIFY." },
      AE: { rate: 0.05, basis: "CIF", label: "UAE",           note: "GCC ~5%. VERIFY." },
      CA: { rate: 0.00, basis: "FOB", label: "Canada",        note: "VERIFY." },
      AU: { rate: 0.00, basis: "FOB", label: "Australia",     note: "VERIFY; biosecurity/phytosanitary applies." }
    },

    insurance_rate: 0.004,                // ~0.4% of CIF base — VERIFY with insurer

    /* --- Destination-side handling defaults (USD/container) — VERIFY -------
     * clearance = destination customs/port handling (THC etc.);
     * inland = destination port -> buyer's door drayage. Editable in widgets. */
    dest_handling: { clearance_per_container: 350, inland_per_container: 300 },

    /* --- Ocean freight per container (USD) by lane code — VERIFY, most volatile */
    freight_per_container: {
      "SRG-LAX": 3500, "SRG-NYC": 5500, "SRG-HAM": 4500, "SRG-FXT": 4500,
      "SRG-JEA": 2500, "SRG-JED": 3000, "SRG-NSA": 1800, "SRG-MER": 4000
    },

    /* --- Ocean transit DAYS by lane [low, high] — VERIFY; Red Sea/Hormuz sensitive */
    transit_days: {
      "SRG-LAX": [20, 30], "SRG-NYC": [30, 45], "SRG-HAM": [35, 50], "SRG-FXT": [35, 50],
      "SRG-JEA": [12, 22], "SRG-JED": [16, 28], "SRG-NSA": [10, 18], "SRG-MER": [25, 40]
    },
    routing_note: "Red Sea diversions (Cape of Good Hope routing) and Hormuz disruption can add 10–20+ days to EU/Gulf lanes. Treat as user-editable and date-stamp.",

    /* --- Port + lane metadata (labels for tables / dropdowns) ------------- */
    ports: {
      origin: { SRG: "Semarang", SUB: "Surabaya", TPP: "Tanjung Priok (Jakarta)" },
      dest: {
        LAX: "Los Angeles / Long Beach", NYC: "New York", HAM: "Hamburg",
        FXT: "Felixstowe", JEA: "Jebel Ali", JED: "Jeddah",
        NSA: "Nhava Sheva", MER: "Mersin"
      }
    },

    /* --- Lead-time components (days) ------------------------------------- */
    leadtime: { weathering_days: 14, production_days: [7, 14], oem_print_days: [14, 21], clearance_days: [2, 7] },

    /* --- Volume price-breaks (USD/tonne) — illustrative, clearly label ---- */
    price_breaks: [
      { key: "1x20", label: "1 × 20ft",        tonnes: 19,  unit_per_t: 1300 },
      { key: "1x40", label: "1 × 40ft",        tonnes: 25.5, unit_per_t: 1270 },
      { key: "2x40", label: "2 × 40ft",        tonnes: 51,  unit_per_t: 1240 },
      { key: "5x40", label: "5 × 40ft",        tonnes: 127.5, unit_per_t: 1205 },
      { key: "annual", label: "Annual contract", tonnes: 300, unit_per_t: 1175 }
    ],

    /* --- Spec benchmarks (typical coconut shisha charcoal) — VERIFY vs COA - */
    specs: {
      premium:  { ash_max_pct: 2.5, fixed_carbon_min_pct: 80, moisture_max_pct: 5, burn_min_minutes: 75, density_min: 0.90, drop_test_max_pct: 5 },
      standard: { ash_max_pct: 4.0, fixed_carbon_min_pct: 72, moisture_max_pct: 8, burn_min_minutes: 60, density_min: 0.80, drop_test_max_pct: 10 }
    },

    /* --- Default lanes used to render worked examples in static tables ---- */
    defaults: { origin: "SRG", dest_port: "LAX", dest_country: "US", tonnes: 18, incoterm: "FOB", carton: "20kg", container: "20ft" }
  };
});
