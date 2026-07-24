/* CCX widget · 6.10 Factory Production Cost & Profit */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  U.ready(function () {
    U.mountAll("production-cost", function (mount) {
      var FA = F.factoryModel(C);
      U.build(mount, {
        title: "Model the factory's cost and profit",
        sub: "Raw material, exchange rate and margin are the levers; fixed costs (tapioca, oven, wages, electricity, packaging) come from our factory model.",
        fields: [
          { type: "number", id: "pc-raw", label: "Raw material (Rp/kg)", value: FA.raw_idr_per_kg, min: 0, step: 100 },
          { type: "number", id: "pc-fx", label: "Exchange rate (Rp/USD)", value: FA.fx_idr, min: 1, step: 100 },
          { type: "number", id: "pc-margin", label: "Factory margin (% on cost)", value: FA.margin_pct, min: 0, max: 60, step: 1 }
        ],
        params: { "pc-raw": "raw", "pc-fx": "fx", "pc-margin": "m" },
        compute: function () {
          var raw = U.numval("pc-raw"), fx = U.numval("pc-fx") || 1, m = U.numval("pc-margin");
          var r = F.factoryPrice(FA, raw, fx, m);
          return {
            headline: F.money(r.priceT) + "/t",
            headlineSmall: "factory selling price at " + F.pct(m, 0) + " margin",
            lines: [
              { label: "Production cost (incl. " + F.pct(FA.loss_pct, 0) + " material loss)", value: F.money(r.prodT) + "/t" },
              { label: "Packaging (boxes, plastic, stickers)", value: F.money(r.packT) + "/t" },
              { label: "Total factory cost", value: F.money(r.costT) + "/t · Rp " + F.num(r.costIdrKg) + "/kg" },
              { label: "Factory profit (EBITDA)", value: F.money(r.profitT) + "/t" }
            ],
            flag: "Profit is EBITDA before tax — and 5–10% of production typically fails and must be remade, so real net is lower.",
            disclaimer: "Fixed costs from our Magelang factory model. Illustrative, not a quote."
          };
        }
      });
    });
  });
})();
