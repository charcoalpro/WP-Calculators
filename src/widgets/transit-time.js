/* CCX widget · 6.4 Ocean Transit-Time Estimator */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  U.ready(function () {
    U.mountAll("transit-time", function (mount) {
      var origins = Object.keys(C.ports.origin);
      // Destination port options = those with a transit lane from SRG (origin metadata).
      var destPorts = Object.keys(C.ports.dest);

      U.build(mount, {
        title: "Estimate your transit and lead time",
        sub: "Ocean days plus the pre-shipment steps that actually gate a coconut-charcoal order.",
        fields: [
          { type: "select", id: "tt-origin", label: "Origin port", value: "SRG",
            options: origins.map(function (k) { return { value: k, label: C.ports.origin[k] }; }) },
          { type: "select", id: "tt-dest", label: "Destination port", value: "LAX",
            options: destPorts.map(function (k) { return { value: k, label: C.ports.dest[k] }; }) },
          { type: "checkbox", id: "tt-oem", label: "Include custom OEM print (+14–21 days)", value: false }
        ],
        params: { "tt-origin": "o", "tt-dest": "d", "tt-oem": "oem" },
        compute: function () {
          var origin = U.val("tt-origin"), dest = U.val("tt-dest");
          var lane = origin + "-" + dest;
          var ocean = C.transit_days[lane] || C.transit_days["SRG-" + dest] || [null, null];
          if (ocean[0] == null) {
            return { headline: "—", headlineSmall: "no published lane for " + lane,
              disclaimer: "Add this lane to config transit_days to enable an estimate." };
          }
          var r = F.transitTime(ocean, C.leadtime, U.checked("tt-oem"));
          var c = r.components;
          return {
            headline: r.oceanLow + "–" + r.oceanHigh + " days",
            headlineSmall: "ocean transit " + (C.ports.origin[origin] || origin) + " → " + (C.ports.dest[dest] || dest),
            lines: [
              { label: "Weathering (mandatory)", value: c.weathering + " days" },
              { label: "Production", value: c.production[0] + "–" + c.production[1] + " days" },
              { label: "OEM print", value: U.checked("tt-oem") ? c.oemPrint[0] + "–" + c.oemPrint[1] + " days" : "not included" },
              { label: "Ocean transit", value: c.ocean[0] + "–" + c.ocean[1] + " days" },
              { label: "Destination clearance", value: c.clearance[0] + "–" + c.clearance[1] + " days" },
              { label: "Door-ready total", value: r.totalLow + "–" + r.totalHigh + " days" }
            ],
            flag: "Red Sea / Hormuz diversions can add 10–20+ days to EU and Gulf lanes.",
            disclaimer: "Illustrative ranges. The 14-day weathering period before packing is required under IMDG SP 978."
          };
        }
      });
    });
  });
})();
