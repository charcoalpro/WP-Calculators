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

  /* ---- 6.8 Spec-Comparison — product grades -----------------------------
   * Single source for our three coconut-charcoal grades, read by BOTH the static
   * table (generator/build-static.js) and the browser widget so the two layers
   * can never disagree. Graded rows carry a per-grade [lo, hi] % band (lower is
   * better); the widget grades a user value by the first grade whose hi it meets.
   * Non-graded rows (smell, smoke) are guarantees shown in the table only. */
  var SPEC_GRADES = ["Platinum", "Super Premium", "Premium"];
  var SPEC_ROWS = [
    { label: "Ash content", unit: "%", grade: true,
      band: [[1.6, 1.9], [1.9, 2.2], [1.9, 2.5]],
      why: "Lower ash means cleaner burning and less residue in the bowl." },
    { label: "Moisture (after oven)", unit: "%", grade: true,
      band: [[3, 4], [4, 5], [5, 6]],
      why: "Low moisture straight after drying lights faster and burns hotter." },
    { label: "Moisture (on packing)", unit: "%", grade: false,
      band: [[4, 8], [5, 8], [6, 8]],
      why: "Moisture at packing shows how dry the coals stay through storage and transit." },
    { label: "Smell", grade: false, text: ["No smell", "No smell", "No smell"],
      why: "An odourless coal keeps the shisha flavour clean." },
    { label: "Smoke", grade: false, text: ["No smoke", "No smoke", "No smoke"],
      why: "No smoke means a clean, low-odour light-up." }
  ];

  // Grade one user value against a graded row: index of the first grade whose
  // upper bound it meets (0 = best), SPEC_GRADES.length if it exceeds every
  // grade, or -1 if not entered. Lower is better.
  function gradeValue(v, row) {
    if (!(v > 0) || !row || !row.grade) return -1;
    for (var i = 0; i < row.band.length; i++) if (v <= row.band[i][1]) return i;
    return SPEC_GRADES.length;
  }
  function gradeName(i) {
    return i < 0 ? "—" : (i >= SPEC_GRADES.length ? "below Premium" : SPEC_GRADES[i]);
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
    gradeValue: gradeValue,
    gradeName: gradeName,
    INCOTERM_STAGES: INCOTERM_STAGES,
    SPEC_GRADES: SPEC_GRADES,
    SPEC_ROWS: SPEC_ROWS
  };
});
