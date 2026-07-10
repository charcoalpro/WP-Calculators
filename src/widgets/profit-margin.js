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
