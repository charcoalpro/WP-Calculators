/* CCX widget · 6.8 Spec-Comparison — which product grade is your charcoal? */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, F = CCX.formulas || {};

  // The graded attributes (ash, moisture after oven), in SPEC_ROWS order.
  var GRADED = (F.SPEC_ROWS || []).filter(function (r) { return r.grade; });
  var OVER = (F.SPEC_GRADES || []).length;   // sentinel index for "below Premium"

  function fmt(v) { return String(Math.round(v * 100) / 100); }

  U.ready(function () {
    U.mountAll("spec-comparison", function (mount) {
      U.build(mount, {
        title: "Which grade is your charcoal?",
        sub: "Enter your ash content and post-oven moisture to see which of our grades — Platinum, Super Premium or Premium — it matches.",
        fields: [
          { type: "number", id: "sc-ash",   label: "Ash content (%)",        value: 2.0, min: 0, step: 0.1 },
          { type: "number", id: "sc-moist", label: "Moisture after oven (%)", value: 4.5, min: 0, step: 0.1 }
        ],
        params: { "sc-ash": "ash", "sc-moist": "moi" },
        compute: function () {
          var vals = [U.numval("sc-ash"), U.numval("sc-moist")];
          var idx = GRADED.map(function (row, i) { return F.gradeValue(vals[i], row); });
          var scored = idx.filter(function (i) { return i >= 0; });
          var worst = scored.length ? Math.max.apply(null, idx) : -1;  // worse grade wins; -1s ignored
          var below = GRADED.filter(function (row, i) { return idx[i] >= OVER; })
                            .map(function (row) { return row.label.toLowerCase(); });
          return {
            headline: worst < 0 ? "—" : (worst >= OVER ? "Below Premium" : F.gradeName(worst)),
            headlineSmall: worst < 0 ? "enter your figures" : "overall grade match",
            lines: GRADED.map(function (row, i) {
              return {
                label: row.label + " (" + F.gradeName(idx[i]) + ")",
                value: vals[i] > 0 ? fmt(vals[i]) + row.unit : "—"
              };
            }),
            flag: below.length
              ? "Above Premium limits on " + below.join(" and ") + " — outside our graded range."
              : (worst >= 0 ? "Every grade is no smell, no smoke." : null),
            disclaimer: "Grade bands are typical ranges — verify against this exporter's published COA and burn-test data."
          };
        }
      });
    });
  });
})();
