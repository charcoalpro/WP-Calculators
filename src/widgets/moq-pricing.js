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
