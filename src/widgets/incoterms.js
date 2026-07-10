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
