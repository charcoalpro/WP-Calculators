/* CCX widget · 6.11 Price-to-Grade Check — which grade does a quoted $/t buy? */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  U.ready(function () {
    U.mountAll("price-check", function (mount) {
      var FA = F.factoryModel(C);
      var losses = F.SPEC_GRADES.map(function (g, i) { return g + " " + F.pct(FA.grade_loss_pct[i], 0); }).join(" / ");
      U.build(mount, {
        title: "Check what your price should buy",
        sub: "Assumes raw material Rp " + F.num(FA.raw_idr_per_kg) + "/kg, Rp " + F.num(FA.fx_idr) + "/USD, " +
          F.pct(FA.margin_pct, 0) + " factory margin; material loss " + losses + ".",
        fields: [
          { type: "number", id: "pg-price", label: "Offered price (USD/t)", value: 1500, min: 0, step: 10 },
          { type: "checkbox", id: "pg-inner", label: "Price includes inner boxes (+" + F.money(FA.pack_inner_usd_t) + "/t)", value: false },
          { type: "checkbox", id: "pg-master", label: "Price includes colour-printed master box (+" + F.money(FA.pack_master_usd_t) + "/t)", value: false }
        ],
        params: { "pg-price": "p", "pg-inner": "ib", "pg-master": "mb" },
        compute: function () {
          var offer = U.numval("pg-price"), ib = U.checked("pg-inner"), mb = U.checked("pg-master");
          var r = F.priceGrade(FA, offer, ib, mb);
          var lines = F.SPEC_GRADES.map(function (g, i) {
            return { label: g + " standard (" + F.pct(FA.grade_loss_pct[i], 0) + " loss)", value: F.money(r.prices[i]) + "/t" };
          });
          lines.push({ label: "Your price vs " + F.SPEC_GRADES[r.nearest] + " standard", value: (r.delta >= 0 ? "+" : "−") + F.money(Math.abs(r.delta)) + "/t" });
          var flag = null;
          if (r.tooLow) flag = "More than 5% below the Premium standard — at this price genuine coconut briquette is unlikely: expect mixed material, chemical binders or short weight.";
          else if (r.aboveTop) flag = "More than 5% above the Platinum standard — either premium extras are included, or there is room to negotiate.";
          return {
            headline: F.SPEC_GRADES[r.nearest],
            headlineSmall: "is the grade standard closest to this price",
            lines: lines,
            flag: flag,
            disclaimer: "Standards computed from our production-cost model at the assumptions above. Illustrative — confirm the actual grade with a COA and burn test."
          };
        }
      });
    });
  });
})();
