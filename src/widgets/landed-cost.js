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
      // Prefer live per-country freight for the chosen container size; fall back to the lane value.
      function freightFor(country, size) {
        var fb = C.freight_by_country && C.freight_by_country[country];
        if (fb) { var v = (String(size) === "40") ? fb.ft40 : fb.ft20; if (v != null) return v; }
        return laneFreight(country);
      }
      var startCountry = U.paramValue("dest", d.dest_country);

      var api = U.build(mount, {
        title: "Calculate your landed cost",
        sub: "All-in cost to your door for one container. The incoterm changes who pays which line, not the door total.",
        fields: [
          { type: "select", id: "lc-country", label: "Destination", value: startCountry,
            options: Object.keys(C.duty).map(function (k) { return { value: k, label: C.duty[k].label }; }) },
          { type: "select", id: "lc-container", label: "Container", value: "20",
            options: [{ value: "20", label: "20ft" }, { value: "40", label: "40ft" }] },
          { type: "select", id: "lc-inco", label: "Incoterm quoted", value: d.incoterm,
            options: ["EXW", "FOB", "CIF", "DDP"].map(function (k) { return { value: k, label: k }; }) },
          { type: "number", id: "lc-tonnes", label: "Net tonnes", value: d.tonnes, min: 1, step: 0.5 },
          { type: "number", id: "lc-fob", label: "FOB price ($/t)", value: C.pricing.fob_per_t, min: 0, step: 10 },
          { type: "number", id: "lc-freight", label: "Ocean freight ($/container)", value: freightFor(startCountry, "20"), min: 0, step: 50 },
          { type: "number", id: "lc-dest", label: "Destination clearance + inland ($)", value: C.dest_handling.clearance_per_container + C.dest_handling.inland_per_container, min: 0, step: 25 }
        ],
        params: { "lc-country": "dest", "lc-container": "cs", "lc-inco": "inco", "lc-tonnes": "t", "lc-fob": "fob", "lc-freight": "frt", "lc-dest": "dst" },
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

      // Auto-fill freight when the destination OR container size changes.
      var cSel = document.getElementById("lc-country"), szSel = document.getElementById("lc-container"), fIn = document.getElementById("lc-freight");
      function syncFreight() { if (fIn) { fIn.value = freightFor(cSel ? cSel.value : startCountry, szSel ? szSel.value : "20"); api.recompute(); } }
      if (cSel) cSel.addEventListener("change", syncFreight);
      if (szSel) szSel.addEventListener("change", syncFreight);
    });
  });
})();
