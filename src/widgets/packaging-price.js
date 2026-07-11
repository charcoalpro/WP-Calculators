/* CCX widget · 6.9 Packaging Price */
(function () {
  var CCX = window.CCX; if (!CCX || !CCX.util) return;
  var U = CCX.util, C = CCX.config, F = CCX.formulas;

  U.ready(function () {
    U.mountAll("packaging-price", function (mount) {
      var pk = C.packaging || {};
      var boxes = pk.boxes || [];
      if (!boxes.length) {
        mount.appendChild(U.el("div", { class: "ccx-widget", html: "<div class=\"ccx-widget-title\">Packaging price</div><div class=\"ccx-hint\">No packaging quotes are available yet.</div>" }));
        return;
      }
      var rate = pk.usd_rate || 16000;

      function boxById(id) { for (var i = 0; i < boxes.length; i++) { if (boxes[i].id === id) return boxes[i]; } return boxes[0]; }
      function idr(x) { return "Rp " + F.num(Math.round(x)); }
      // Applicable tier for a quantity = the largest tier whose qty <= the order; below the
      // smallest tier we fall back to that smallest tier and flag it.
      function tierFor(box, qty) {
        var t = box.tiers.slice().sort(function (a, b) { return a.qty - b.qty; });
        var pick = t[0], next = null;
        for (var i = 0; i < t.length; i++) { if (qty >= t[i].qty) pick = t[i]; }
        for (var j = 0; j < t.length; j++) { if (t[j].qty > qty) { next = t[j]; break; } }
        return { tier: pick, belowMoq: qty < t[0].qty, next: next, smallest: t[0] };
      }

      var defBox = boxes[0];
      var defQty = defBox.tiers[defBox.tiers.length - 1].qty; // largest quoted qty = a sensible default

      U.build(mount, {
        title: "Estimate your packaging cost",
        sub: "Per-box price by order quantity, from current printed-box quotes. USD is an estimate at the rate you set.",
        fields: [
          { type: "select", id: "pk-box", label: "Box", value: defBox.id,
            options: boxes.map(function (b) { return { value: b.id, label: b.label }; }) },
          { type: "number", id: "pk-qty", label: "Order quantity (boxes)", value: defQty, min: 1, step: 100 },
          { type: "number", id: "pk-rate", label: "IDR per USD", value: rate, min: 1, step: 100, hint: "For the USD estimate only." }
        ],
        params: { "pk-box": "box", "pk-qty": "qty", "pk-rate": "rate" },
        compute: function () {
          var box = boxById(U.val("pk-box"));
          var qty = U.numval("pk-qty");
          var r = U.numval("pk-rate") || rate;
          var res = tierFor(box, qty);
          var unit = res.tier.price, total = unit * qty;
          return {
            headline: idr(unit) + " / box",
            headlineSmall: "≈ " + F.money2(unit / r) + " per box at " + F.num(qty) + " boxes",
            lines: [
              { label: "Price per box", value: idr(unit) + "  (≈ " + F.money2(unit / r) + ")" },
              { label: "Order quantity", value: F.num(qty) + " boxes" },
              { label: "Total order", value: idr(total) + "  (≈ " + F.money(total / r) + ")" },
              { label: "Price tier applied", value: F.num(res.tier.qty) + "+ boxes" },
              { label: "Box", value: box.dims + " · " + box.spec }
            ],
            flag: res.belowMoq
              ? "Below the smallest quoted quantity (" + F.num(res.smallest.qty) + " boxes) — showing that tier's price."
              : (res.next ? "Ordering " + F.num(res.next.qty) + "+ boxes drops the price to " + idr(res.next.price) + "/box." : null),
            disclaimer: "Per-box prices are in IDR from current quotes; USD is an estimate at the rate shown. Printing, materials, tooling and lead time affect final pricing — request a quote."
          };
        }
      });
    });
  });
})();
