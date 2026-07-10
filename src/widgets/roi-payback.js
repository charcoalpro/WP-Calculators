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
