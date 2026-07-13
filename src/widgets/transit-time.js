/* CCX widget · 6.4 Ocean Transit-Time Estimator */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  function rng(a, b) { return a === b ? a + " days" : a + "–" + b + " days"; }

  U.ready(function () {
    U.mountAll("transit-time", function (mount) {
      var origins = Object.keys(C.ports.origin);
      // Destination ports: live from the shipping database (every port + latest transit days),
      // falling back to the curated list if the sync isn't available.
      var tports = (C.transit_ports && C.transit_ports.length) ? C.transit_ports : null;
      var destOptions = tports
        ? tports.map(function (p, i) { return { value: String(i), label: p.port + (p.country ? " (" + p.country + ")" : "") }; })
        : Object.keys(C.ports.dest).map(function (k) { return { value: k, label: C.ports.dest[k] }; });

      U.build(mount, {
        title: "Estimate your transit and lead time",
        sub: "Ocean days from Indonesia plus the pre-shipment steps that actually gate a coconut-charcoal order.",
        fields: [
          { type: "select", id: "tt-origin", label: "Origin port", value: "SRG",
            options: origins.map(function (k) { return { value: k, label: C.ports.origin[k] }; }) },
          { type: "select", id: "tt-dest", label: "Destination port", value: destOptions[0] && destOptions[0].value,
            options: destOptions },
          { type: "checkbox", id: "tt-oem", label: "Include custom OEM print (+14–21 days)", value: false }
        ],
        params: { "tt-origin": "o", "tt-dest": "d", "tt-oem": "oem" },
        compute: function () {
          var origin = U.val("tt-origin"), destVal = U.val("tt-dest");
          var ocean, destName;
          if (tports) {
            var p = tports[parseInt(destVal, 10)] || tports[0];
            ocean = [p.days, p.days]; destName = p.port;
          } else {
            ocean = C.transit_days[origin + "-" + destVal] || C.transit_days["SRG-" + destVal] || [null, null];
            destName = C.ports.dest[destVal] || destVal;
          }
          if (ocean[0] == null) {
            return { headline: "—", headlineSmall: "no transit data for that port",
              disclaimer: "Add this port to your shipping data to enable an estimate." };
          }
          var r = F.transitTime(ocean, C.leadtime, U.checked("tt-oem"));
          var c = r.components;
          return {
            headline: rng(r.oceanLow, r.oceanHigh),
            headlineSmall: "ocean transit " + (C.ports.origin[origin] || origin) + " → " + destName,
            lines: [
              { label: "Weathering (mandatory)", value: c.weathering + " days" },
              { label: "Production", value: rng(c.production[0], c.production[1]) },
              { label: "OEM print", value: U.checked("tt-oem") ? rng(c.oemPrint[0], c.oemPrint[1]) : "not included" },
              { label: "Ocean transit", value: rng(c.ocean[0], c.ocean[1]) },
              { label: "Destination clearance", value: rng(c.clearance[0], c.clearance[1]) },
              { label: "Door-ready total", value: rng(r.totalLow, r.totalHigh) }
            ],
            flag: "Red Sea / Hormuz diversions can add 10–20+ days to EU and Gulf lanes.",
            disclaimer: "Ocean days are the latest from your shipping data; lead-time steps are illustrative. The 14-day weathering period before packing is required under IMDG SP 978."
          };
        }
      });
    });
  });
})();
