/* CCX widget · 6.1 Container-Load / Fill Optimizer */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  U.ready(function () {
    U.mountAll("container-load", function (mount) {
      var cartonKeys = Object.keys(C.cartons);
      var containerKeys = Object.keys(C.containers);
      U.build(mount, {
        title: "Estimate your own container load",
        sub: "Coconut charcoal is dense, so weight almost always fills the container before volume does.",
        fields: [
          { type: "select", id: "cl-cube", label: "Cube size", value: 26,
            options: C.cube_sizes_mm.map(function (m) { return { value: m, label: m + " mm" }; }),
            hint: "Affects burn spec, not load math." },
          { type: "select", id: "cl-carton", label: "Master carton", value: "20kg",
            options: cartonKeys.map(function (k) { return { value: k, label: k + " net (" + C.cartons[k].net_kg + " kg)" }; }) },
          { type: "select", id: "cl-container", label: "Container", value: "20ft",
            options: containerKeys.map(function (k) { return { value: k, label: C.containers[k].label }; }) }
        ],
        params: { "cl-cube": "cube", "cl-carton": "carton", "cl-container": "cont" },
        compute: function () {
          var carton = C.cartons[U.val("cl-carton")];
          var container = C.containers[U.val("cl-container")];
          var r = F.containerLoad(container, carton, C.packing_efficiency);
          return {
            headline: F.num(r.netTonnes, 2) + " t",
            headlineSmall: "net charcoal payload",
            lines: [
              { label: "Master cartons that fit", value: F.num(r.cartons) },
              { label: "Limited by", value: r.limitingFactor === "weight" ? "Weight (as expected)" : "Volume" },
              { label: "Max if volume only", value: F.num(r.cartonsByVolume) + " cartons" },
              { label: "Max if weight only", value: F.num(r.cartonsByWeight) + " cartons" }
            ],
            flag: r.limitingFactor === "weight" ? "Weight-capped — the container hits its payload limit with headroom to spare." : null,
            disclaimer: "Uses illustrative carton dimensions. Verify against your real packaging. Packing allows ≥30 cm headspace per IMDG SP 978."
          };
        }
      });
    });
  });
})();
