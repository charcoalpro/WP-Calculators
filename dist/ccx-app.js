/*! CCX ccx-app.js — external widget bundle. Generated 2026-07-10T10:37:13.480Z. Do NOT hand-edit. */
/* ---- config.js ---- */
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

;
/* ---- formulas.js ---- */
/* =============================================================================
 * CCX — formulas.js  ·  PURE CALCULATION ENGINE
 * -----------------------------------------------------------------------------
 * Every number in the product — the live widget AND the static AI-citable tables
 * — is computed by THESE functions and only these. The generator (Node) and the
 * widgets (browser) both import this file, so the two layers cannot drift.
 *
 * Functions are pure: they take primitives / plain objects and return plain
 * objects. No DOM, no globals, no side effects. UMD dual-use like config.js.
 *
 * Formatters live here too, so a dollar figure is rendered identically whether
 * it was produced at build time (static HTML) or at runtime (widget).
 * ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;                 // Node (generator)
  } else {
    root.CCX = root.CCX || {};
    root.CCX.formulas = api;              // Browser: window.CCX.formulas
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---- formatters (shared so static == widget output) ------------------- */
  function money(n)  { return "$" + Math.round(n).toLocaleString("en-US"); }
  function money2(n) { return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function num(n, d) { d = d == null ? 0 : d; return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function pct(n, d) { d = d == null ? 1 : d; return num(n, d) + "%"; }

  /* ---- 6.1 Container-Load / Fill Optimizer ------------------------------ */
  // container: {cbm, max_net_t}  carton: {net_kg, cbm}
  function containerLoad(container, carton, packingEfficiency) {
    var byWeight = Math.floor((container.max_net_t * 1000) / carton.net_kg);
    var byVolume = Math.floor((container.cbm * packingEfficiency) / carton.cbm);
    var cartons  = Math.min(byWeight, byVolume);
    var limiting = byWeight <= byVolume ? "weight" : "volume";
    return {
      cartonsByWeight: byWeight,
      cartonsByVolume: byVolume,
      cartons: cartons,
      limitingFactor: limiting,
      netTonnes: (cartons * carton.net_kg) / 1000
    };
  }

  /* ---- 6.2 Landed-Cost -------------------------------------------------- */
  // p = {tonnes, exwPerT, fobPerT, freight, insuranceRate, dutyRate, dutyBasis,
  //      destClearance, destInland}
  function landedCost(p) {
    var goodsExw   = p.exwPerT * p.tonnes;
    var fobTotal   = p.fobPerT * p.tonnes;
    var originChg  = fobTotal - goodsExw;                 // origin inland + export clearance + loading
    var insurance  = p.insuranceRate * (fobTotal + p.freight);
    var cifValue   = fobTotal + p.freight + insurance;
    var customsVal = p.dutyBasis === "FOB" ? fobTotal : cifValue;
    var dutyAmount = p.dutyRate * customsVal;
    var destPort   = p.destClearance;
    var destInland = p.destInland;
    var totalLanded = cifValue + dutyAmount + destPort + destInland;
    var kg = p.tonnes * 1000;
    return {
      goodsExw: goodsExw,
      fobTotal: fobTotal,
      originCharges: originChg,
      freight: p.freight,
      insurance: insurance,
      cifValue: cifValue,
      customsValue: customsVal,
      dutyAmount: dutyAmount,
      destClearance: destPort,
      destInland: destInland,
      totalLanded: totalLanded,
      perKg: totalLanded / kg,
      perT: totalLanded / p.tonnes,
      // Incoterm reference prices = what the supplier quotes; door total is invariant.
      incotermPrices: { EXW: goodsExw, FOB: fobTotal, CIF: cifValue, DDP: totalLanded }
    };
  }

  /* ---- 6.3 Profit-Margin / Reseller Pricing ----------------------------- */
  // mode: "margin" | "markup"
  function profitMargin(costPerKg, pctValue, mode, tonnes) {
    var resale;
    if (mode === "markup") resale = costPerKg * (1 + pctValue / 100);
    else                   resale = costPerKg / (1 - pctValue / 100);
    var profitPerKg = resale - costPerKg;
    var impliedMarginPct = (profitPerKg / resale) * 100;   // profit as % of resale
    var impliedMarkupPct = (profitPerKg / costPerKg) * 100; // profit as % of cost
    return {
      resalePerKg: resale,
      profitPerKg: profitPerKg,
      profitPerContainer: profitPerKg * tonnes * 1000,
      impliedMarginPct: impliedMarginPct,
      impliedMarkupPct: impliedMarkupPct
    };
  }

  /* ---- 6.4 Ocean Transit-Time ------------------------------------------- */
  // ocean = [low, high]; lead = {weathering_days, production_days:[lo,hi],
  //          oem_print_days:[lo,hi], clearance_days:[lo,hi]}
  function transitTime(ocean, lead, includeOemPrint) {
    var printLo = includeOemPrint ? lead.oem_print_days[0] : 0;
    var printHi = includeOemPrint ? lead.oem_print_days[1] : 0;
    var totalLow  = lead.weathering_days + lead.production_days[0] + printLo + ocean[0] + lead.clearance_days[0];
    var totalHigh = lead.weathering_days + lead.production_days[1] + printHi + ocean[1] + lead.clearance_days[1];
    return {
      oceanLow: ocean[0], oceanHigh: ocean[1],
      totalLow: totalLow, totalHigh: totalHigh,
      components: {
        weathering: lead.weathering_days,
        production: lead.production_days,
        oemPrint: includeOemPrint ? lead.oem_print_days : [0, 0],
        ocean: ocean,
        clearance: lead.clearance_days
      }
    };
  }

  /* ---- 6.5 MOQ / Volume Price-Break ------------------------------------- */
  // tiers = [{key,label,tonnes,unit_per_t}, ...]; base = first tier unit price
  function priceBreaks(tiers) {
    var base = tiers[0].unit_per_t;
    return tiers.map(function (t) {
      var total = t.unit_per_t * t.tonnes;
      var savingsVsBase = (base - t.unit_per_t) * t.tonnes;
      return {
        key: t.key, label: t.label, tonnes: t.tonnes,
        unitPerT: t.unit_per_t,
        perKg: t.unit_per_t / 1000,
        total: total,
        savingsVsBase: savingsVsBase,
        discountPct: ((base - t.unit_per_t) / base) * 100
      };
    });
  }

  /* ---- 6.6 Incoterms Cost-Comparison ------------------------------------ */
  // Canonical Incoterms 2020 buyer(B)/seller(S) allocation (simplified summary).
  var INCOTERM_STAGES = [
    { key: "exworks_loading",   label: "Loading at seller's works",      pay: { EXW: "B", FOB: "S", CIF: "S", DDP: "S" } },
    { key: "origin_inland",     label: "Origin inland haulage",          pay: { EXW: "B", FOB: "S", CIF: "S", DDP: "S" } },
    { key: "export_clearance",  label: "Export customs clearance",       pay: { EXW: "B", FOB: "S", CIF: "S", DDP: "S" } },
    { key: "ocean_freight",     label: "Ocean freight",                  pay: { EXW: "B", FOB: "B", CIF: "S", DDP: "S" } },
    { key: "insurance",         label: "Marine insurance",               pay: { EXW: "B", FOB: "B", CIF: "S", DDP: "S" } },
    { key: "destination_port",  label: "Destination port / THC",         pay: { EXW: "B", FOB: "B", CIF: "B", DDP: "S" } },
    { key: "import_duty",       label: "Import duty & taxes",            pay: { EXW: "B", FOB: "B", CIF: "B", DDP: "S" } },
    { key: "destination_inland",label: "Destination inland to door",     pay: { EXW: "B", FOB: "B", CIF: "B", DDP: "S" } }
  ];

  // Uses a landedCost() result to build per-incoterm supplier price vs buyer-arranged.
  function incoterms(landed) {
    var door = landed.totalLanded;
    var order = ["EXW", "FOB", "CIF", "DDP"];
    var summary = order.map(function (ic) {
      var supplierPrice = landed.incotermPrices[ic];
      return {
        incoterm: ic,
        supplierPrice: supplierPrice,
        buyerArranged: door - supplierPrice,   // stages the buyer pays beyond the price
        doorTotal: door                        // invariant across incoterms
      };
    });
    return {
      stages: INCOTERM_STAGES,
      summary: summary,
      stageCosts: {
        goods: landed.goodsExw,
        originCharges: landed.originCharges,
        oceanFreight: landed.freight,
        insurance: landed.insurance,
        destinationPort: landed.destClearance,
        importDuty: landed.dutyAmount,
        destinationInland: landed.destInland
      }
    };
  }

  /* ---- 6.7 ROI / Inventory-Turnover / Payback --------------------------- */
  // capital = landed cost of the container; resalePerKg from margin calc.
  function roiPayback(capital, resalePerKg, tonnes, sellThroughDays, transitDays) {
    var revenue = resalePerKg * tonnes * 1000;
    var grossProfit = revenue - capital;
    var roiPct = (grossProfit / capital) * 100;
    var cycleDays = transitDays + sellThroughDays;
    var turnsPerYear = 365 / cycleDays;
    return {
      revenue: revenue,
      grossProfit: grossProfit,
      roiPct: roiPct,
      cycleDays: cycleDays,
      turnsPerYear: turnsPerYear,
      annualizedRoi: roiPct * turnsPerYear,
      paybackDays: cycleDays
    };
  }

  /* ---- 6.8 Spec-Comparison ---------------------------------------------- */
  // For each field, compare a user value against premium/standard thresholds.
  // "max" fields (lower is better): ash, moisture, drop-test.
  // "min" fields (higher is better): fixed carbon, burn time, density.
  var SPEC_FIELDS = [
    { key: "ash_max_pct",          label: "Ash content",   unit: "%",   dir: "max" },
    { key: "moisture_max_pct",     label: "Moisture",      unit: "%",   dir: "max" },
    { key: "fixed_carbon_min_pct", label: "Fixed carbon",  unit: "%",   dir: "min" },
    { key: "burn_min_minutes",     label: "Burn time",     unit: " min",dir: "min" },
    { key: "density_min",          label: "Density",       unit: " g/cc",dir: "min" },
    { key: "drop_test_max_pct",    label: "Drop-test loss",unit: "%",   dir: "max" }
  ];

  function classifyField(value, premium, standard, dir) {
    if (value == null || isNaN(value)) return "unknown";
    if (dir === "max") {
      if (value <= premium) return "premium";
      if (value <= standard) return "standard";
      return "below";
    } else {
      if (value >= premium) return "premium";
      if (value >= standard) return "standard";
      return "below";
    }
  }

  function specCompare(userSpecs, premium, standard) {
    return SPEC_FIELDS.map(function (f) {
      var v = userSpecs ? userSpecs[f.key] : null;
      return {
        key: f.key, label: f.label, unit: f.unit, dir: f.dir,
        value: v,
        premium: premium[f.key],
        standard: standard[f.key],
        status: classifyField(v, premium[f.key], standard[f.key], f.dir)
      };
    });
  }

  return {
    money: money, money2: money2, num: num, pct: pct,
    containerLoad: containerLoad,
    landedCost: landedCost,
    profitMargin: profitMargin,
    transitTime: transitTime,
    priceBreaks: priceBreaks,
    incoterms: incoterms,
    roiPayback: roiPayback,
    specCompare: specCompare,
    INCOTERM_STAGES: INCOTERM_STAGES,
    SPEC_FIELDS: SPEC_FIELDS
  };
});

;
/* ---- widgets/_util.js ---- */
/* CCX — _util.js · shared browser helpers for the interactive layer.
 * Attaches window.CCX.util and window.CCX.widgets registry. Browser only —
 * the generator never loads this. Keeps every widget small and consistent. */
(function () {
  var CCX = (window.CCX = window.CCX || {});
  CCX.widgets = CCX.widgets || {};

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }

  // field: {type:'number'|'select', id, label, value, hint, step, min, max, options:[{value,label}]}
  function field(f) {
    var input;
    if (f.type === "select") {
      input = el("select", { id: f.id });
      (f.options || []).forEach(function (o) {
        var opt = el("option", { value: o.value, text: o.label });
        if (String(o.value) === String(f.value)) opt.selected = true;
        input.appendChild(opt);
      });
    } else if (f.type === "checkbox") {
      input = el("input", { id: f.id, type: "checkbox" });
      if (f.value) input.checked = true;
    } else {
      input = el("input", { id: f.id, type: "number", inputmode: "decimal" });
      if (f.step != null) input.step = f.step;
      if (f.min != null) input.min = f.min;
      if (f.max != null) input.max = f.max;
      if (f.value != null) input.value = f.value;
    }
    var label = el("label", { for: f.id, text: f.label });
    var kids = f.type === "checkbox"
      ? [el("div", { class: "ccx-toggle" }, [input, el("span", { text: f.label })])]
      : [label, input];
    if (f.hint) kids.push(el("div", { class: "ccx-hint", text: f.hint }));
    return el("div", { class: "ccx-field" }, kids);
  }

  function val(id) { var n = document.getElementById(id); return n ? n.value : null; }
  function numval(id) { var v = parseFloat(val(id)); return isNaN(v) ? 0 : v; }
  function checked(id) { var n = document.getElementById(id); return !!(n && n.checked); }

  /* ---- Shareable-URL state (§8): pure client-side, no storage ------------
   * A widget passes spec.params = { fieldId: "shortName" }. On load we pre-fill
   * fields from ?shortName=value; on user change we mirror state into the query
   * string via history.replaceState (no new history entries, no page reload). */
  function readParams() { try { return new URLSearchParams(window.location.search); } catch (e) { return null; } }
  function paramValue(name, dflt) { var p = readParams(); return (p && p.has(name)) ? p.get(name) : dflt; }
  function hasMap(map) { return !!(map && Object.keys(map).length); }
  function applyParams(fields, map) {
    var p = readParams(); if (!p || !map) return;
    fields.forEach(function (f) {
      var name = map[f.id]; if (!name || !p.has(name)) return;
      var v = p.get(name);
      f.value = (f.type === "checkbox") ? (v === "1" || v === "true") : v;
    });
  }
  function writeParams(fields, map) {
    if (!map) return;
    try {
      var p = new URLSearchParams(window.location.search);
      fields.forEach(function (f) {
        var name = map[f.id]; if (!name) return;
        var n = document.getElementById(f.id); if (!n) return;
        p.set(name, f.type === "checkbox" ? (n.checked ? "1" : "0") : n.value);
      });
      var qs = p.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "") + window.location.hash);
    } catch (e) { /* history unavailable — degrade to no URL sync */ }
  }

  // Standard result block. r = {headline, headlineSmall, lines:[{label,value}], flag, disclaimer}
  function renderResult(target, r) {
    target.innerHTML = "";
    if (r.headline != null) {
      target.appendChild(el("div", { class: "ccx-result-headline" }, [
        document.createTextNode(r.headline + " "),
        r.headlineSmall ? el("small", { text: r.headlineSmall }) : null
      ]));
    }
    if (r.lines && r.lines.length) {
      var lines = el("div", { class: "ccx-result-lines" });
      r.lines.forEach(function (ln) {
        lines.appendChild(el("div", { class: "ccx-result-line" }, [
          el("span", { text: ln.label }), el("span", { text: ln.value })
        ]));
      });
      target.appendChild(lines);
    }
    if (r.flag) target.appendChild(el("div", { class: "ccx-flag", text: r.flag }));
    if (r.disclaimer) target.appendChild(el("div", { class: "ccx-disclaimer", text: r.disclaimer }));
  }

  // Build the widget shell inside a mount, wire live recompute, return {inputs, result, recompute}.
  // spec = {title, sub, fields:[...], compute: fn(read)->resultObj, disclaimer}
  function build(mount, spec) {
    applyParams(spec.fields, spec.params);          // pre-fill from ?params before rendering
    var syncUrl = hasMap(spec.params);
    var inputsWrap = el("div", { class: "ccx-widget-inputs ccx-grid" });
    spec.fields.forEach(function (f) { inputsWrap.appendChild(field(f)); });
    var result = el("div", { class: "ccx-result", role: "status", "aria-live": "polite" });
    var reset = el("button", { class: "ccx-btn ccx-btn-ghost", type: "button", text: "Reset" });
    var actions = el("div", { class: "ccx-actions" }, [reset]);

    var widget = el("div", { class: "ccx-widget" }, [
      el("div", { class: "ccx-widget-title", text: spec.title || "Try your own numbers" }),
      spec.sub ? el("div", { class: "ccx-widget-sub", text: spec.sub }) : null,
      inputsWrap, actions, result
    ]);
    mount.appendChild(widget);

    function recompute() { renderResult(result, spec.compute()); }
    function onChange() { recompute(); if (syncUrl) writeParams(spec.fields, spec.params); }
    inputsWrap.addEventListener("input", onChange);
    inputsWrap.addEventListener("change", onChange);
    reset.addEventListener("click", function (e) {
      e.preventDefault();
      spec.fields.forEach(function (f) {
        var n = document.getElementById(f.id);
        if (!n) return;
        if (f.type === "checkbox") n.checked = !!f.value;
        else n.value = f.value != null ? f.value : "";
      });
      onChange();
    });
    recompute();                                    // initial render only — no URL write on load
    return { widget: widget, result: result, recompute: recompute };
  }

  function mountAll(name, initOne) {
    var nodes = document.querySelectorAll('[data-ccx="' + name + '"]');
    if (!nodes.length) return;
    nodes.forEach(function (node) {
      if (node.getAttribute("data-ccx-ready")) return;
      node.setAttribute("data-ccx-ready", "1");
      try { initOne(node); } catch (err) { if (window.console) console.error("[CCX] " + name + " init failed", err); }
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  CCX.util = { el: el, field: field, val: val, numval: numval, checked: checked, paramValue: paramValue, renderResult: renderResult, build: build, mountAll: mountAll, ready: ready };
})();

;
/* ---- widgets/container-load.js ---- */
/* CCX widget · 6.1 Container-Load / Fill Optimizer */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  U.ready(function () {
    U.mountAll("container-load", function (mount) {
      var cartonKeys = Object.keys(C.cartons);
      var containerKeys = Object.keys(C.containers);
      U.build(mount, {
        title: "Estimate your own container load",
        sub: "Coconut charcoal is dense, so weight almost always fills the container before volume does.",
        fields: [
          { type: "select", id: "cl-cube", label: "Cube size", value: 26,
            options: C.cube_sizes_mm.map(function (m) { return { value: m, label: m + " mm" }; }),
            hint: "Affects burn spec, not load math." },
          { type: "select", id: "cl-carton", label: "Master carton", value: "20kg",
            options: cartonKeys.map(function (k) { return { value: k, label: k + " net (" + C.cartons[k].net_kg + " kg)" }; }) },
          { type: "select", id: "cl-container", label: "Container", value: "20ft",
            options: containerKeys.map(function (k) { return { value: k, label: C.containers[k].label }; }) }
        ],
        params: { "cl-cube": "cube", "cl-carton": "carton", "cl-container": "cont" },
        compute: function () {
          var carton = C.cartons[U.val("cl-carton")];
          var container = C.containers[U.val("cl-container")];
          var r = F.containerLoad(container, carton, C.packing_efficiency);
          return {
            headline: F.num(r.netTonnes, 2) + " t",
            headlineSmall: "net charcoal payload",
            lines: [
              { label: "Master cartons that fit", value: F.num(r.cartons) },
              { label: "Limited by", value: r.limitingFactor === "weight" ? "Weight (as expected)" : "Volume" },
              { label: "Max if volume only", value: F.num(r.cartonsByVolume) + " cartons" },
              { label: "Max if weight only", value: F.num(r.cartonsByWeight) + " cartons" }
            ],
            flag: r.limitingFactor === "weight" ? "Weight-capped — the container hits its payload limit with headroom to spare." : null,
            disclaimer: "Uses illustrative carton dimensions. Verify against your real packaging. Packing allows ≥30 cm headspace per IMDG SP 978."
          };
        }
      });
    });
  });
})();

;
/* ---- widgets/landed-cost.js ---- */
/* CCX widget · 6.2 Landed-Cost */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  // Pick a freight lane from origin SRG to the destination country's main port.
  var COUNTRY_LANE = { US: "SRG-LAX", DE: "SRG-HAM", UK: "SRG-FXT", SA: "SRG-JED", IN: "SRG-NSA", TR: "SRG-MER", AE: "SRG-JEA", CA: "SRG-LAX", AU: "SRG-LAX" };

  U.ready(function () {
    U.mountAll("landed-cost", function (mount) {
      var d = C.defaults;
      function laneFreight(country) { return C.freight_per_container[COUNTRY_LANE[country]] || C.freight_per_container["SRG-LAX"]; }

      var api = U.build(mount, {
        title: "Calculate your landed cost",
        sub: "All-in cost to your door for one container. The incoterm changes who pays which line, not the door total.",
        fields: [
          { type: "select", id: "lc-country", label: "Destination", value: U.paramValue("dest", d.dest_country),
            options: Object.keys(C.duty).map(function (k) { return { value: k, label: C.duty[k].label }; }) },
          { type: "select", id: "lc-inco", label: "Incoterm quoted", value: d.incoterm,
            options: ["EXW", "FOB", "CIF", "DDP"].map(function (k) { return { value: k, label: k }; }) },
          { type: "number", id: "lc-tonnes", label: "Net tonnes", value: d.tonnes, min: 1, step: 0.5 },
          { type: "number", id: "lc-fob", label: "FOB price ($/t)", value: C.pricing.fob_per_t, min: 0, step: 10 },
          { type: "number", id: "lc-freight", label: "Ocean freight ($/container)", value: laneFreight(U.paramValue("dest", d.dest_country)), min: 0, step: 50 },
          { type: "number", id: "lc-dest", label: "Destination clearance + inland ($)", value: C.dest_handling.clearance_per_container + C.dest_handling.inland_per_container, min: 0, step: 25 }
        ],
        params: { "lc-country": "dest", "lc-inco": "inco", "lc-tonnes": "t", "lc-fob": "fob", "lc-freight": "frt", "lc-dest": "dst" },
        compute: function () {
          var country = U.val("lc-country"), duty = C.duty[country];
          var tonnes = U.numval("lc-tonnes");
          var destTotal = U.numval("lc-dest");
          var r = F.landedCost({
            tonnes: tonnes,
            exwPerT: C.pricing.exw_per_t,
            fobPerT: U.numval("lc-fob"),
            freight: U.numval("lc-freight"),
            insuranceRate: C.insurance_rate,
            dutyRate: duty.rate, dutyBasis: duty.basis,
            destClearance: destTotal, destInland: 0
          });
          var inco = U.val("lc-inco");
          return {
            headline: F.money(r.totalLanded),
            headlineSmall: "landed to " + duty.label + " · " + F.money2(r.perKg) + "/kg",
            lines: [
              { label: "Goods (FOB)", value: F.money(r.fobTotal) },
              { label: "Ocean freight", value: F.money(r.freight) },
              { label: "Insurance (" + F.pct(C.insurance_rate * 100, 1) + ")", value: F.money(r.insurance) },
              { label: "Import duty (" + F.pct(duty.rate * 100, 1) + " " + duty.basis + ")", value: F.money(r.dutyAmount) },
              { label: "Destination clearance + inland", value: F.money(destTotal) },
              { label: "Supplier price at " + inco, value: F.money(r.incotermPrices[inco]) }
            ],
            flag: country === "US" ? "HS 4402.20 enters the US duty-free (CBP N306942). Verify any current reciprocal-tariff surcharge." : null,
            disclaimer: "Illustrative rates, not a quote. Freight and the US–Indonesia tariff are volatile — verify before relying on figures."
          };
        }
      });

      // Auto-fill freight when country changes (still fully client-side).
      var cSel = document.getElementById("lc-country"), fIn = document.getElementById("lc-freight");
      if (cSel && fIn) cSel.addEventListener("change", function () { fIn.value = laneFreight(cSel.value); api.recompute(); });
    });
  });
})();

;
/* ---- widgets/profit-margin.js ---- */
/* CCX widget · 6.3 Profit-Margin / Reseller Pricing */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  U.ready(function () {
    U.mountAll("profit-margin", function (mount) {
      U.build(mount, {
        title: "Price your resale",
        sub: "Margin and markup are not the same. Switch the mode to see how the same percentage lands differently.",
        fields: [
          { type: "number", id: "pm-cost", label: "Your landed cost ($/kg)", value: 1.54, min: 0, step: 0.01 },
          { type: "select", id: "pm-mode", label: "Method", value: "margin",
            options: [{ value: "margin", label: "Margin (% of resale)" }, { value: "markup", label: "Markup (% of cost)" }] },
          { type: "number", id: "pm-pct", label: "Target %", value: 40, min: 0, max: 95, step: 1 },
          { type: "number", id: "pm-tonnes", label: "Tonnes per order", value: 18, min: 1, step: 0.5 }
        ],
        params: { "pm-cost": "cost", "pm-mode": "mode", "pm-pct": "pct", "pm-tonnes": "t" },
        compute: function () {
          var cost = U.numval("pm-cost"), pct = U.numval("pm-pct"), mode = U.val("pm-mode"), tonnes = U.numval("pm-tonnes");
          var r = F.profitMargin(cost, pct, mode, tonnes);
          return {
            headline: F.money2(r.resalePerKg) + "/kg",
            headlineSmall: "resale price at " + pct + "% " + mode,
            lines: [
              { label: "Profit per kg", value: F.money2(r.profitPerKg) },
              { label: "Gross profit per " + F.num(tonnes) + " t container", value: F.money(r.profitPerContainer) },
              { label: "Implied margin", value: F.pct(r.impliedMarginPct) },
              { label: "Implied markup", value: F.pct(r.impliedMarkupPct) }
            ],
            flag: mode === "markup" ? "A " + pct + "% markup is only a " + F.pct(r.impliedMarginPct) + " margin." : null,
            disclaimer: "Illustrative. Excludes storage, breakage, marketing and financing costs."
          };
        }
      });
    });
  });
})();

;
/* ---- widgets/transit-time.js ---- */
/* CCX widget · 6.4 Ocean Transit-Time Estimator */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  U.ready(function () {
    U.mountAll("transit-time", function (mount) {
      var origins = Object.keys(C.ports.origin);
      // Destination port options = those with a transit lane from SRG (origin metadata).
      var destPorts = Object.keys(C.ports.dest);

      U.build(mount, {
        title: "Estimate your transit and lead time",
        sub: "Ocean days plus the pre-shipment steps that actually gate a coconut-charcoal order.",
        fields: [
          { type: "select", id: "tt-origin", label: "Origin port", value: "SRG",
            options: origins.map(function (k) { return { value: k, label: C.ports.origin[k] }; }) },
          { type: "select", id: "tt-dest", label: "Destination port", value: "LAX",
            options: destPorts.map(function (k) { return { value: k, label: C.ports.dest[k] }; }) },
          { type: "checkbox", id: "tt-oem", label: "Include custom OEM print (+14–21 days)", value: false }
        ],
        params: { "tt-origin": "o", "tt-dest": "d", "tt-oem": "oem" },
        compute: function () {
          var origin = U.val("tt-origin"), dest = U.val("tt-dest");
          var lane = origin + "-" + dest;
          var ocean = C.transit_days[lane] || C.transit_days["SRG-" + dest] || [null, null];
          if (ocean[0] == null) {
            return { headline: "—", headlineSmall: "no published lane for " + lane,
              disclaimer: "Add this lane to config transit_days to enable an estimate." };
          }
          var r = F.transitTime(ocean, C.leadtime, U.checked("tt-oem"));
          var c = r.components;
          return {
            headline: r.oceanLow + "–" + r.oceanHigh + " days",
            headlineSmall: "ocean transit " + (C.ports.origin[origin] || origin) + " → " + (C.ports.dest[dest] || dest),
            lines: [
              { label: "Weathering (mandatory)", value: c.weathering + " days" },
              { label: "Production", value: c.production[0] + "–" + c.production[1] + " days" },
              { label: "OEM print", value: U.checked("tt-oem") ? c.oemPrint[0] + "–" + c.oemPrint[1] + " days" : "not included" },
              { label: "Ocean transit", value: c.ocean[0] + "–" + c.ocean[1] + " days" },
              { label: "Destination clearance", value: c.clearance[0] + "–" + c.clearance[1] + " days" },
              { label: "Door-ready total", value: r.totalLow + "–" + r.totalHigh + " days" }
            ],
            flag: "Red Sea / Hormuz diversions can add 10–20+ days to EU and Gulf lanes.",
            disclaimer: "Illustrative ranges. The 14-day weathering period before packing is required under IMDG SP 978."
          };
        }
      });
    });
  });
})();

;
/* ---- widgets/moq-pricing.js ---- */
/* CCX widget · 6.5 MOQ / Volume Price-Break */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  U.ready(function () {
    U.mountAll("moq-pricing", function (mount) {
      var breaks = F.priceBreaks(C.price_breaks);
      function row(key) { return breaks.filter(function (b) { return b.key === key; })[0]; }

      U.build(mount, {
        title: "See your volume price break",
        sub: "Unit price falls as the order scales. Savings are shown against a single 20ft container.",
        fields: [
          { type: "select", id: "moq-tier", label: "Order size", value: C.price_breaks[0].key,
            options: C.price_breaks.map(function (t) { return { value: t.key, label: t.label + " (" + t.tonnes + " t)" }; }) }
        ],
        params: { "moq-tier": "tier" },
        compute: function () {
          var r = row(U.val("moq-tier"));
          return {
            headline: F.money(r.unitPerT) + "/t",
            headlineSmall: r.label + " · " + F.money2(r.perKg) + "/kg",
            lines: [
              { label: "Order volume", value: F.num(r.tonnes) + " t" },
              { label: "Total order value", value: F.money(r.total) },
              { label: "Discount vs 1 × 20ft", value: F.pct(r.discountPct) },
              { label: "Saving vs 1 × 20ft", value: F.money(r.savingsVsBase) }
            ],
            flag: r.key !== C.price_breaks[0].key
              ? "Scaling to " + r.label + " cuts the unit price by " + F.pct(r.discountPct) + " versus a single 20ft container."
              : "This is the baseline tier — larger orders unlock the discounts below.",
            disclaimer: "Illustrative price breaks, not a quote. Final pricing depends on spec, destination and contract terms."
          };
        }
      });
    });
  });
})();

;
/* ---- widgets/incoterms.js ---- */
/* CCX widget · 6.6 Incoterms Cost-Comparison */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  U.ready(function () {
    U.mountAll("incoterms", function (mount) {
      U.build(mount, {
        title: "Compare incoterms for your shipment",
        sub: "See what each incoterm price includes — and why the total to your door stays the same.",
        fields: [
          { type: "select", id: "ic-inco", label: "Incoterm to highlight", value: "FOB",
            options: ["EXW", "FOB", "CIF", "DDP"].map(function (k) { return { value: k, label: k }; }) },
          { type: "number", id: "ic-tonnes", label: "Net tonnes", value: 18, min: 1, step: 0.5 },
          { type: "number", id: "ic-fob", label: "FOB price ($/t)", value: C.pricing.fob_per_t, min: 0, step: 10 },
          { type: "number", id: "ic-freight", label: "Ocean freight ($/container)", value: C.freight_per_container["SRG-LAX"], min: 0, step: 50 }
        ],
        params: { "ic-inco": "inco", "ic-tonnes": "t", "ic-fob": "fob", "ic-freight": "frt" },
        compute: function () {
          var tonnes = U.numval("ic-tonnes");
          var lc = F.landedCost({
            tonnes: tonnes, exwPerT: C.pricing.exw_per_t, fobPerT: U.numval("ic-fob"),
            freight: U.numval("ic-freight"), insuranceRate: C.insurance_rate,
            dutyRate: C.duty.US.rate, dutyBasis: C.duty.US.basis,
            destClearance: C.dest_handling.clearance_per_container, destInland: C.dest_handling.inland_per_container
          });
          var ic = F.incoterms(lc);
          var inco = U.val("ic-inco");
          var sel = ic.summary.filter(function (s) { return s.incoterm === inco; })[0];
          return {
            headline: F.money(sel.supplierPrice),
            headlineSmall: "supplier price at " + inco + " · you then arrange " + F.money(sel.buyerArranged),
            lines: ic.summary.map(function (s) {
              return { label: s.incoterm + " — you pay supplier", value: F.money(s.supplierPrice) };
            }).concat([{ label: "Total to your door (all incoterms)", value: F.money(sel.doorTotal) }]),
            flag: "Same door total across incoterms — the incoterm decides who arranges and pays each stage, not the final cost (assumes no supplier margin on stages they cover).",
            disclaimer: "Incoterms 2020 obligations summarized. Illustrative costs, not a quote."
          };
        }
      });
    });
  });
})();

;
/* ---- widgets/roi-payback.js ---- */
/* CCX widget · 6.7 ROI / Inventory-Turnover / Payback */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  // Default capital = landed cost of the default container (kept in sync with config).
  function defaultCapital() {
    var duty = C.duty[C.defaults.dest_country];
    var lc = F.landedCost({
      tonnes: C.defaults.tonnes,
      exwPerT: C.pricing.exw_per_t,
      fobPerT: C.pricing.fob_per_t,
      freight: C.freight_per_container["SRG-LAX"],
      insuranceRate: C.insurance_rate,
      dutyRate: duty.rate, dutyBasis: duty.basis,
      destClearance: C.dest_handling.clearance_per_container,
      destInland: C.dest_handling.inland_per_container
    });
    return Math.round(lc.totalLanded);
  }

  U.ready(function () {
    U.mountAll("roi-payback", function (mount) {
      U.build(mount, {
        title: "Model your return and payback",
        sub: "How fast the container pays back, and what the same margin annualizes to once you turn inventory.",
        fields: [
          { type: "number", id: "roi-capital", label: "Capital (landed cost, $)", value: defaultCapital(), min: 0, step: 100 },
          { type: "number", id: "roi-tonnes", label: "Net tonnes", value: C.defaults.tonnes, min: 1, step: 0.5 },
          { type: "number", id: "roi-margin", label: "Resale margin (%)", value: 35, min: 0, max: 95, step: 1 },
          { type: "select", id: "roi-sell", label: "Sell-through", value: "60",
            options: [30, 60, 90, 120].map(function (d) { return { value: d, label: d + " days" }; }) },
          { type: "number", id: "roi-transit", label: "Transit (days)", value: 25, min: 0, step: 1 }
        ],
        params: { "roi-capital": "cap", "roi-tonnes": "t", "roi-margin": "m", "roi-sell": "s", "roi-transit": "tr" },
        compute: function () {
          var capital = U.numval("roi-capital"), tonnes = U.numval("roi-tonnes");
          var margin = U.numval("roi-margin"), sell = U.numval("roi-sell"), transit = U.numval("roi-transit");
          var costPerKg = capital / (tonnes * 1000);
          var resalePerKg = margin < 100 ? costPerKg / (1 - margin / 100) : costPerKg;
          var r = F.roiPayback(capital, resalePerKg, tonnes, sell, transit);
          return {
            headline: F.pct(r.roiPct),
            headlineSmall: "gross ROI per cycle · " + F.pct(r.annualizedRoi) + " annualized",
            lines: [
              { label: "Resale price needed", value: F.money2(resalePerKg) + "/kg" },
              { label: "Revenue at full sell-through", value: F.money(r.revenue) },
              { label: "Gross profit", value: F.money(r.grossProfit) },
              { label: "Cash cycle (transit + sell-through)", value: F.num(r.cycleDays) + " days" },
              { label: "Inventory turns / year", value: F.num(r.turnsPerYear, 1) },
              { label: "Payback", value: F.num(r.paybackDays) + " days" }
            ],
            flag: "Annualized return scales with turns — faster sell-through multiplies the same per-cycle ROI.",
            disclaimer: "Illustrative. Assumes full sell-through at the stated margin; excludes storage, financing and breakage."
          };
        }
      });
    });
  });
})();

;
/* ---- widgets/spec-comparison.js ---- */
/* CCX widget · 6.8 Spec-Comparison */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  var STATUS_WORD = { premium: "meets premium", standard: "standard grade", below: "below standard", unknown: "—" };

  U.ready(function () {
    U.mountAll("spec-comparison", function (mount) {
      U.build(mount, {
        title: "Compare your current charcoal",
        sub: "Enter your supplier's COA figures to see how each attribute lands against the premium benchmark.",
        fields: [
          { type: "number", id: "sc-ash",     label: "Ash content (%)",   value: 4,    min: 0, step: 0.1 },
          { type: "number", id: "sc-moist",   label: "Moisture (%)",      value: 6,    min: 0, step: 0.1 },
          { type: "number", id: "sc-fc",      label: "Fixed carbon (%)",  value: 74,   min: 0, step: 0.1 },
          { type: "number", id: "sc-burn",    label: "Burn time (min)",   value: 62,   min: 0, step: 1 },
          { type: "number", id: "sc-density", label: "Density (g/cc)",    value: 0.82, min: 0, step: 0.01 },
          { type: "number", id: "sc-drop",    label: "Drop-test loss (%)",value: 9,    min: 0, step: 0.1 }
        ],
        params: { "sc-ash": "ash", "sc-moist": "moi", "sc-fc": "fc", "sc-burn": "burn", "sc-density": "den", "sc-drop": "drop" },
        compute: function () {
          var userSpecs = {
            ash_max_pct: U.numval("sc-ash"),
            moisture_max_pct: U.numval("sc-moist"),
            fixed_carbon_min_pct: U.numval("sc-fc"),
            burn_min_minutes: U.numval("sc-burn"),
            density_min: U.numval("sc-density"),
            drop_test_max_pct: U.numval("sc-drop")
          };
          var rows = F.specCompare(userSpecs, C.specs.premium, C.specs.standard);
          var premiumCount = rows.filter(function (r) { return r.status === "premium"; }).length;
          var below = rows.filter(function (r) { return r.status === "below"; }).map(function (r) { return r.label; });
          return {
            headline: premiumCount + " of " + rows.length,
            headlineSmall: "attributes meeting premium benchmark",
            lines: rows.map(function (r) {
              return {
                label: r.label + " (" + STATUS_WORD[r.status] + ")",
                value: F.num(r.value, r.unit === "%" || r.unit === " g/cc" ? 2 : 0).replace(/\.00$/, "") + r.unit +
                       "  vs  " + r.premium + r.unit + " prem"
              };
            }),
            flag: below.length
              ? "Below premium and standard on: " + below.join(", ") + "."
              : (premiumCount === rows.length ? "Every measured attribute meets the premium benchmark." : null),
            disclaimer: "Benchmarks are typical premium/standard ranges — verify against this exporter's published COA and burn-test data."
          };
        }
      });
    });
  });
})();

