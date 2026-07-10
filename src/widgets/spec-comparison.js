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
