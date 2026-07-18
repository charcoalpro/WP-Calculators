/* =============================================================================
 * CCX — generator/build-static.js  ·  THE STATIC-TABLE GENERATOR
 * -----------------------------------------------------------------------------
 * Node script. Imports the SAME config.js + formulas.js the browser widgets use,
 * then writes plain, server-renderable HTML blocks into /dist/static/ — one per
 * calculator. That HTML (worked tables, answer capsules, methodology, FAQ,
 * JSON-LD) is the ONLY layer AI engines and Google can read. The widget never
 * produces citable content; it only mounts beneath these blocks.
 *
 * Because every number below is computed from config+formulas (never hardcoded),
 * the static tables and the live widget cannot disagree. Change config, re-run
 * this script, re-paste the block. That's the entire sync guarantee.
 *
 *   Run:  node generator/build-static.js
 * ========================================================================== */
"use strict";
var fs = require("fs");
var path = require("path");
var C = require("../src/config.js");
var F = require("../src/formulas.js");

var OUT = path.join(__dirname, "..", "dist", "static");
fs.mkdirSync(OUT, { recursive: true });

// "Last verified" stamp, stored as "YYYY-MM" or full "YYYY-MM-DD".
// V = human display ("15 July 2026" / "June 2026"); VISO = valid ISO for JSON-LD.
function humanVerified(v) {
  var m = String(v).match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!m) return String(v);
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var mon = months[parseInt(m[2], 10) - 1] || m[2];
  return m[3] ? (parseInt(m[3], 10) + " " + mon + " " + m[1]) : (mon + " " + m[1]);
}
function isoVerified(v) {
  var m = String(v).match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  return m ? (m[1] + "-" + m[2] + "-" + (m[3] || "01")) : String(v);
}
var VRAW = C.meta.verified;              // raw stored value
var V = humanVerified(VRAW);             // e.g. "15 July 2026"
var VISO = isoVerified(VRAW);            // e.g. "2026-07-15" (JSON-LD dateModified)
var A = C.author;
var COUNTRY_LANE = { US: "SRG-LAX", DE: "SRG-HAM", UK: "SRG-FXT", SA: "SRG-JED", IN: "SRG-NSA", TR: "SRG-MER", AE: "SRG-JEA", CA: "SRG-LAX", AU: "SRG-LAX" };

/* ---- tiny HTML helpers -------------------------------------------------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
  });
}
// cols: [str]; rows: [[cellHtml,...]]; opts: {caption, highlight:idx, foot:html}
function table(cols, rows, opts) {
  opts = opts || {};
  var thead = "<thead><tr>" + cols.map(function (c) { return "<th scope=\"col\">" + c + "</th>"; }).join("") + "</tr></thead>";
  var tbody = "<tbody>" + rows.map(function (r, i) {
    var cls = (opts.highlight === i) ? " class=\"ccx-row-highlight\"" : "";
    var cells = r.map(function (cell, j) {
      return j === 0 ? "<th scope=\"row\">" + cell + "</th>" : "<td class=\"ccx-num\">" + cell + "</td>";
    }).join("");
    return "<tr" + cls + ">" + cells + "</tr>";
  }).join("") + "</tbody>";
  var cap = opts.caption ? "<caption>" + esc(opts.caption) + " \u00b7 verified " + V + "</caption>" : "";
  var foot = opts.foot ? "<p class=\"ccx-footnote\">" + opts.foot + "</p>" : "";
  return "<div class=\"ccx-table-scroll\"><table class=\"ccx-table\">" + cap + thead + tbody + "</table></div>" + foot;
}
function capsules(arr) {
  return "<div class=\"ccx-capsules\">" + arr.map(function (s) { return "<p class=\"ccx-capsule\">" + s + "</p>"; }).join("") + "</div>";
}
function faqBlock(items) {
  return "<div class=\"ccx-faq\">" + items.map(function (q) {
    return "<details><summary>" + esc(q.q) + "</summary><p>" + q.a + "</p></details>";
  }).join("") + "</div>";
}
function verified() {
  return "<p class=\"ccx-verified\">Last verified <strong>" + V + "</strong>. Figures are illustrative industry ranges, not quotes — verify before relying on them. Freight and the US\u2013Indonesia tariff change most often.</p>";
}
function widgetMount(name, heading, note) {
  return "<h2 class=\"ccx-h\">" + esc(heading) + "</h2>" +
    (note ? "<p>" + esc(note) + "</p>" : "") +
    "<div data-ccx=\"" + name + "\"></div>";
}

/* ---- JSON-LD (Organization + Person + WebPage + FAQPage + optional Dataset) */
function schema(o) {
  var personId = (A.person_url || A.org_url || "") + "#greg";
  var orgId = (A.org_url || "") + "#org";
  var graph = [
    { "@type": "Organization", "@id": orgId, name: A.org_name, url: A.org_url, logo: A.org_logo },
    (function () {
      var p = { "@type": "Person", "@id": personId, name: A.person_name, jobTitle: A.person_jobtitle, url: A.person_url, worksFor: { "@id": orgId } };
      if (A.person_credentials) p.description = A.person_credentials;
      if (A.person_sameas && A.person_sameas.length) p.sameAs = A.person_sameas;
      return p;
    })(),
    { "@type": "WebPage", url: "https://charcoal.pro/tools/" + o.slug + "/", name: o.title,
      author: { "@id": personId }, reviewedBy: { "@id": personId }, publisher: { "@id": orgId },
      dateModified: VISO },
    { "@type": "FAQPage", mainEntity: o.faq.map(function (q) {
      return { "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.aPlain || q.q } };
    }) }
  ];
  if (o.dataset) {
    graph.push({ "@type": "Dataset", name: o.dataset.name, description: o.dataset.desc,
      creator: { "@id": orgId }, dateModified: VISO,
      isAccessibleForFree: true, license: "https://creativecommons.org/licenses/by/4.0/" });
  }
  var doc = { "@context": "https://schema.org", "@graph": graph };
  // Escape "<" so a stray "</script>" (or "<!--") inside any config string can never
  // terminate the JSON-LD element. \u003C is valid inside a JSON string.
  var json = JSON.stringify(doc)
    .replace(/</g, "\\u003C")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  return "<script type=\"application/ld+json\">" + json + "</script>";
}

/* ---- page assembler ----------------------------------------------------- */
// o = {slug, title, lede, capsules:[], sections:[html], faq:[{q,a,aPlain}], widget:{name,heading,note}, dataset}
function page(o) {
  var parts = [];
  parts.push("<div class=\"ccx\">");
  parts.push("<p class=\"ccx-lede\">" + o.lede + "</p>");
  parts.push(capsules(o.capsules));
  o.sections.forEach(function (s) { parts.push(s); });
  parts.push("<h2 class=\"ccx-h\">Frequently asked questions</h2>");
  parts.push(faqBlock(o.faq));
  parts.push(widgetMount(o.widget.name, o.widget.heading, o.widget.note));
  parts.push(verified());
  parts.push(schema(o));
  parts.push("</div>");
  return parts.join("\n");
}
function h2(t) { return "<h2 class=\"ccx-h\">" + esc(t) + "</h2>"; }
function h3(t) { return "<h3 class=\"ccx-h\">" + esc(t) + "</h3>"; }
function p(html) { return "<p>" + html + "</p>"; }
function rng(a, b) { return a === b ? a + " days" : a + "–" + b + " days"; }

/* =========================================================================
 * 6.1 CONTAINER-LOAD
 * ====================================================================== */
function buildContainerLoad() {
  var cartonKeys = Object.keys(C.cartons);
  var contKeys = Object.keys(C.containers);
  var def = C.containers["20ft"];
  var defCarton = C.cartons["20kg"];
  var r20 = F.containerLoad(def, defCarton, C.packing_efficiency);
  var r40 = F.containerLoad(C.containers["40ft"], defCarton, C.packing_efficiency);

  // Summary table: container × [net tonnes, cartons of 20kg, limited by]
  var summaryRows = contKeys.map(function (k) {
    var r = F.containerLoad(C.containers[k], defCarton, C.packing_efficiency);
    return [C.containers[k].label, F.num(r.netTonnes, 1) + " t", F.num(r.cartons), r.limitingFactor];
  });
  var summary = table(["Container", "Net charcoal", "20 kg cartons", "Limited by"], summaryRows,
    { caption: "Net coconut-charcoal payload per container", highlight: 0 });

  // Full matrix: carton (rows) × container (cols) → "N / X.X t"
  var matrixRows = cartonKeys.map(function (ck) {
    var cells = contKeys.map(function (contk) {
      var r = F.containerLoad(C.containers[contk], C.cartons[ck], C.packing_efficiency);
      return F.num(r.cartons) + " <span class=\"ccx-footnote\">/ " + F.num(r.netTonnes, 1) + " t</span>";
    });
    return [ck + " (" + C.cartons[ck].net_kg + " kg)"].concat(cells);
  });
  var matrix = table(["Master carton"].concat(contKeys.map(function (k) { return C.containers[k].label; })), matrixRows,
    { caption: "Cartons that fit \u00d7 net tonnes, by carton and container",
      foot: "Cells show cartons that fit / resulting net tonnes. Packing assumes \u226530 cm headspace and \u226440\u00b0C packing per IMDG Amendment 42-24, Special Provision 978 (UN 1361, Class 4.2)." });

  return page({
    slug: "container-load",
    title: "Coconut Charcoal Container Load Calculator",
    lede: "A 20ft container holds about <strong>" + F.num(r20.netTonnes, 1) + " tonnes</strong> of coconut shisha charcoal (\u2248 " +
      F.num(r20.cartons) + " \u00d7 20 kg cartons); a 40ft holds about <strong>" + F.num(r40.netTonnes, 1) +
      " tonnes</strong>. Because the charcoal is dense, every standard container reaches its weight limit before it runs out of space \u2014 so payload is capped by tonnes, not cubic metres.",
    capsules: [
      "A 20ft container holds approximately <strong>" + F.num(r20.netTonnes, 1) + " tonnes</strong> of coconut shisha charcoal, or about " + F.num(r20.cartons) + " \u00d7 20 kg master cartons (verified " + V + ").",
      "A 40ft container holds approximately <strong>" + F.num(r40.netTonnes, 1) + " tonnes</strong> of coconut shisha charcoal (verified " + V + ").",
      "Because coconut shisha charcoal is dense, all standard containers reach their <strong>weight limit before their volume limit</strong> (verified " + V + ")."
    ],
    sections: [
      summary,
      h2("Full load matrix by carton and container"),
      matrix,
      h2("How this is calculated"),
      p("Two limits are computed and the smaller wins. The weight limit is the container's maximum net payload divided by carton net weight; the volume limit is usable container volume (CBM \u00d7 " + F.pct(C.packing_efficiency * 100, 0) + " packing efficiency) divided by carton volume. For coconut charcoal the weight limit is almost always the binding one, which is why load is quoted in tonnes."),
      p("Payloads shown use a practical net charcoal weight after the \u226530 cm headspace and \u226440\u00b0C packing required for UN 1361 (Class 4.2) under IMDG Special Provision 978. Carton dimensions here are illustrative \u2014 replace them with your real packaging for exact carton counts.")
    ],
    faq: [
      { q: "How many tonnes of shisha charcoal fit in a 20ft container?", a: "About <strong>" + F.num(r20.netTonnes, 1) + " tonnes</strong> of coconut shisha charcoal in a 20ft container, and about " + F.num(r40.netTonnes, 1) + " tonnes in a 40ft \u2014 the load is weight-limited, not volume-limited.", aPlain: "About " + F.num(r20.netTonnes, 1) + " tonnes in a 20ft and " + F.num(r40.netTonnes, 1) + " tonnes in a 40ft; the load is weight-limited." },
      { q: "How many boxes of coconut charcoal fit in a container?", a: "Roughly " + F.num(r20.cartons) + " \u00d7 20 kg cartons in a 20ft and " + F.num(r40.cartons) + " in a 40ft. Smaller cartons raise the box count but the total tonnage stays about the same.", aPlain: "Roughly " + F.num(r20.cartons) + " 20 kg cartons in a 20ft and " + F.num(r40.cartons) + " in a 40ft." },
      { q: "Why is charcoal weight-limited and not volume-limited?", a: "Coconut charcoal cubes are dense, so a container hits its maximum payload weight while space is still left over. That is the opposite of light, bulky cargo, which fills the volume first.", aPlain: "The charcoal is dense, so the container hits its weight limit before its volume limit." }
    ],
    widget: { name: "container-load", heading: "Estimate your own container load", note: "Pick a carton size and container to see the load for your packaging." },
    dataset: { name: "Coconut charcoal container payloads", desc: "Net coconut shisha charcoal payload (tonnes and master cartons) for 20ft, 40ft and 40ft high-cube containers." }
  });
}

/* =========================================================================
 * 6.2 LANDED-COST
 * ====================================================================== */
function lcFor(country, tonnes) {
  var duty = C.duty[country];
  return F.landedCost({
    tonnes: tonnes, exwPerT: C.pricing.exw_per_t, fobPerT: C.pricing.fob_per_t,
    freight: C.freight_per_container[COUNTRY_LANE[country]] || C.freight_per_container["SRG-LAX"],
    insuranceRate: C.insurance_rate, dutyRate: duty.rate, dutyBasis: duty.basis,
    destClearance: C.dest_handling.clearance_per_container, destInland: C.dest_handling.inland_per_container
  });
}
function buildLandedCost() {
  var T = C.defaults.tonnes;
  var countries = Object.keys(C.duty);
  var us = lcFor("US", T);

  // (a) Headline: country × [FOB goods, landed total, $/kg, duty]
  var headRows = countries.map(function (k) {
    var r = lcFor(k, T), duty = C.duty[k];
    return [C.duty[k].label, F.money(r.fobTotal), F.money(r.totalLanded), F.money2(r.perKg), (duty.rate * 100 % 1 ? F.pct(duty.rate * 100, 1) : F.pct(duty.rate * 100, 0)) + " " + duty.basis];
  });
  var headTable = table(["Destination", "Goods (FOB)", "Landed to door", "$/kg", "Import duty"], headRows,
    { caption: "Landed cost of one " + T + " t container by destination (FOB basis, illustrative freight)", highlight: 0 });

  // (a2) Ocean freight by destination for BOTH container sizes (live shipping data).
  var fbc = C.freight_by_country || {};
  var frRows = countries.filter(function (k) { return fbc[k]; }).map(function (k) {
    var fb = fbc[k];
    return [C.duty[k].label, F.money(fb.ft20), F.money(fb.ft40), fb.days != null ? fb.days + " days" : "—"];
  });
  var freightTable = frRows.length
    ? table(["Destination", "20ft freight", "40ft freight", "Ocean transit"], frRows,
        { caption: "Ocean freight from Semarang (Indonesia) by container size", highlight: 0,
          foot: "Freight and transit reflect current shipping data. Coconut charcoal is weight-limited, so a 20ft (≈ 19 t) is often the effective unit, while a 40ft (≈ 25.5 t) carries more charcoal per dollar of freight." })
    : "";

  // (b) Supplier invoice price by incoterm (this is what the incoterm actually changes)
  var incoRows = countries.map(function (k) {
    var r = lcFor(k, T);
    return [C.duty[k].label, F.money(r.incotermPrices.EXW), F.money(r.incotermPrices.FOB), F.money(r.incotermPrices.CIF), F.money(r.incotermPrices.DDP)];
  });
  var incoTable = table(["Destination", "EXW", "FOB", "CIF", "DDP"], incoRows,
    { caption: "Supplier invoice price by incoterm, per " + T + " t container",
      foot: "The incoterm changes which line the supplier invoices, not the final cost to your door \u2014 the door total stays the same across incoterms (assuming no supplier margin on stages they arrange). See the Incoterms tool." });

  // (c) Cost breakdown for the US lane
  var brk = [
    ["Goods (FOB " + F.money(C.pricing.fob_per_t) + "/t \u00d7 " + T + " t)", F.money(us.fobTotal)],
    ["Ocean freight", F.money(us.freight)],
    ["Marine insurance (" + F.pct(C.insurance_rate * 100, 1) + ")", F.money(us.insurance)],
    ["Import duty (" + F.pct(C.duty.US.rate * 100, 0) + " " + C.duty.US.basis + ")", F.money(us.dutyAmount)],
    ["Destination clearance + inland", F.money(us.destClearance + us.destInland)],
    ["<strong>Total landed to door</strong>", "<strong>" + F.money(us.totalLanded) + "</strong>"]
  ];
  var brkTable = table(["Cost component", "Amount (USD)"], brk,
    { caption: "Cost breakdown \u2014 " + T + " t container, Semarang \u2192 Los Angeles (illustrative)" });

  return page({
    slug: "landed-cost",
    title: "Coconut Charcoal Landed Cost Calculator",
    lede: "The landed cost of one 20ft container (" + T + " t) of coconut shisha charcoal to the United States is about <strong>" +
      F.money(us.totalLanded) + "</strong>, or about <strong>" + F.money2(us.perKg) + "/kg</strong>, at FOB terms. " +
      "Coconut shell charcoal (HS " + C.meta.hs_code + ") enters the US duty-free under CBP ruling N306942, so duty is $0 on the customs value \u2014 verify any current reciprocal-tariff surcharge before you rely on it.",
    capsules: [
      "The landed cost of one 20ft container (" + T + " t) of coconut shisha charcoal to the United States is approximately <strong>" + F.money(us.totalLanded) + "</strong>, or <strong>" + F.money2(us.perKg) + "/kg</strong>, at FOB (verified " + V + "; illustrative).",
      "Coconut shisha charcoal (HS " + C.meta.hs_code + ") enters the United States duty-free under CBP ruling N306942 (verified " + V + "; verify current reciprocal-tariff surcharges).",
      "Landed cost per kilogram is the container's all-in door cost divided by net kilograms \u2014 for " + T + " t that is " + F.num(T * 1000) + " kg (verified " + V + ")."
    ],
    sections: [
      headTable,
      freightTable ? h2("Ocean freight by container size") : "",
      freightTable,
      h2("Supplier price by incoterm"),
      incoTable,
      h2("Cost breakdown for one lane"),
      brkTable,
      h2("How this is calculated"),
      p("Landed cost sums the goods value (FOB), ocean freight, marine insurance (" + F.pct(C.insurance_rate * 100, 1) + " of the CIF base), import duty, and destination clearance plus inland delivery. Duty is applied to the customs value \u2014 the FOB value in the US and Canada, the CIF value in the EU, UK and GCC \u2014 at each country's rate."),
      p("For Saudi Arabia and the UAE, a GCC common tariff of about 5% applies and SASO/SABER conformity (PCoC + SCoC) is mandatory. US duty is $0 for HS " + C.meta.hs_code + " under CBP N306942, but the US\u2013Indonesia tariff position is the most volatile input here \u2014 re-check it monthly. All freight and duty figures are illustrative, not quotes.")
    ],
    faq: [
      { q: "How much does it cost to import a container of coconut charcoal to the US?", a: "About <strong>" + F.money(us.totalLanded) + "</strong> all-in to the door for one " + T + " t 20ft container at FOB (\u2248 " + F.money2(us.perKg) + "/kg), on illustrative freight. Duty is $0 under HS " + C.meta.hs_code + " / CBP N306942.", aPlain: "About " + F.money(us.totalLanded) + " all-in for one " + T + " t container at FOB, roughly " + F.money2(us.perKg) + "/kg. US duty is $0." },
      { q: "Is coconut charcoal duty-free into the United States?", a: "Yes \u2014 coconut shell charcoal under HS " + C.meta.hs_code + " is classified duty-free per CBP ruling N306942. A separate reciprocal-tariff surcharge on Indonesian origin can apply and changes often, so verify the current position before quoting.", aPlain: "Yes, duty-free under HS " + C.meta.hs_code + " per CBP N306942, but verify any current reciprocal-tariff surcharge." },
      { q: "Does the incoterm change the landed cost?", a: "No. The incoterm decides who arranges and invoices each stage, but the total cost to your door is the same whether you buy EXW, FOB, CIF or DDP (assuming the supplier adds no margin on stages they cover).", aPlain: "No \u2014 the incoterm changes who pays each stage, not the final door total." }
    ],
    widget: { name: "landed-cost", heading: "Calculate your landed cost", note: "Change the destination, incoterm, tonnage and rates to match your shipment." },
    dataset: { name: "Coconut charcoal landed cost by destination", desc: "All-in landed cost and per-kg cost of an 18 t coconut shisha charcoal container to nine destination markets, with import duty basis and rate." }
  });
}

/* =========================================================================
 * 6.3 PROFIT-MARGIN
 * ====================================================================== */
function buildProfitMargin() {
  var us = lcFor("US", C.defaults.tonnes);
  var cost = Math.round(us.perKg * 100) / 100;   // landed cost/kg anchor
  var pcts = [20, 30, 40, 50];
  var T = C.defaults.tonnes;

  // (a) Margin vs markup clarifier at the anchor cost
  var clarRows = pcts.map(function (pc) {
    var mk = F.profitMargin(cost, pc, "markup", T);
    var mg = F.profitMargin(cost, pc, "margin", T);
    return [pc + "%", F.money2(mk.resalePerKg), F.pct(mk.impliedMarginPct), F.money2(mg.resalePerKg), F.pct(mg.impliedMarkupPct)];
  });
  var clar = table(["Target %", "Markup \u2192 resale/kg", "\u2026actual margin", "Margin \u2192 resale/kg", "\u2026actual markup"], clarRows,
    { caption: "Margin vs markup on a " + F.money2(cost) + "/kg landed cost (the difference people miss)", highlight: 2,
      foot: "Same percentage, two methods, different prices. \u201CMargin\u201D is profit as a share of the selling price; \u201Cmarkup\u201D is profit as a share of cost." });

  // (b) profit per container by margin %
  var profRows = pcts.map(function (pc) {
    var mg = F.profitMargin(cost, pc, "margin", T);
    return [pc + "% margin", F.money2(mg.resalePerKg), F.money2(mg.profitPerKg), F.money(mg.profitPerContainer)];
  });
  var prof = table(["Target margin", "Resale/kg", "Profit/kg", "Gross profit / " + T + " t container"], profRows,
    { caption: "Reseller profit per container at a " + F.money2(cost) + "/kg landed cost", highlight: 2 });

  var mk40 = F.profitMargin(cost, 40, "markup", T);
  var mg40 = F.profitMargin(cost, 40, "margin", T);
  var mg50 = F.profitMargin(cost, 50, "margin", T);

  return page({
    slug: "profit-margin",
    title: "Coconut Charcoal Reseller Margin Calculator",
    lede: "At a landed cost of <strong>" + F.money2(cost) + "/kg</strong> and a 40% margin, coconut shisha charcoal resells at about <strong>" +
      F.money2(mg40.resalePerKg) + "/kg</strong>, yielding roughly <strong>" + F.money(mg40.profitPerContainer) +
      "</strong> gross profit on an " + T + " t container. Note that a 40% markup is not a 40% margin \u2014 the same number gives a different price depending on the method.",
    capsules: [
      "At a landed cost of " + F.money2(cost) + "/kg and a 40% margin, coconut shisha charcoal resells at <strong>" + F.money2(mg40.resalePerKg) + "/kg</strong>, yielding about <strong>" + F.money(mg40.profitPerContainer) + "</strong> gross profit per " + T + " t container (verified " + V + "; illustrative).",
      "A 40% markup is not a 40% margin: on " + F.money2(cost) + "/kg cost, a 40% markup gives " + F.money2(mk40.resalePerKg) + "/kg but only a <strong>" + F.pct(mk40.impliedMarginPct) + "</strong> margin (verified " + V + ").",
      "To earn a true 50% margin on a " + F.money2(cost) + "/kg landed cost, coconut shisha charcoal must sell at <strong>" + F.money2(mg50.resalePerKg) + "/kg</strong>, giving about <strong>" + F.money(mg50.profitPerContainer) + "</strong> gross profit per " + T + " t container (verified " + V + "; illustrative)."
    ],
    sections: [
      clar,
      h2("Profit per container by margin"),
      prof,
      h2("Margin or markup \u2014 which should you use?"),
      p("Markup is calculated on your cost: a " + F.money2(cost) + "/kg cost with a 40% markup sells at " + F.money2(mk40.resalePerKg) + "/kg. Margin is calculated on your selling price: to earn a true 40% margin you sell at " + F.money2(mg40.resalePerKg) + "/kg. Distributors usually plan in margin because it maps directly to profitability; suppliers often quote markup. Mixing them silently erodes profit."),
      p("Figures are illustrative and exclude storage, breakage, marketing and financing costs. Enter your own landed cost \u2014 from the landed-cost tool \u2014 for numbers specific to your lane.")
    ],
    faq: [
      { q: "What is the difference between margin and markup?", a: "Markup is profit as a percentage of cost; margin is profit as a percentage of the selling price. A 40% markup on " + F.money2(cost) + "/kg is only a " + F.pct(mk40.impliedMarginPct) + " margin.", aPlain: "Markup is profit over cost; margin is profit over selling price. A 40% markup is only a " + F.pct(mk40.impliedMarginPct) + " margin." },
      { q: "How much profit is there in a container of shisha charcoal?", a: "At a " + F.money2(cost) + "/kg landed cost and a 40% margin, an " + T + " t container yields about " + F.money(mg40.profitPerContainer) + " gross profit before operating costs.", aPlain: "About " + F.money(mg40.profitPerContainer) + " gross on an " + T + " t container at a 40% margin, before operating costs." }
    ],
    widget: { name: "profit-margin", heading: "Price your resale", note: "Enter your landed cost and switch between margin and markup." }
  });
}

/* =========================================================================
 * 6.4 TRANSIT-TIME
 * ====================================================================== */
function buildTransit() {
  // Destination ports + ocean days: live from the shipping database (every port), with the
  // curated lanes as a fallback. LA / Long Beach is the reference lane for the narrative.
  var tports = (C.transit_ports && C.transit_ports.length) ? C.transit_ports : null;
  var laRef = tports ? tports.filter(function (p) { return /long beach|los angeles/i.test(p.port); })[0] : null;
  var laneLAX = laRef ? [laRef.days, laRef.days] : (C.transit_days["SRG-LAX"] || [20, 30]);
  var rLAX = F.transitTime(laneLAX, C.leadtime, false);

  // (a) ocean days from Indonesia to each destination port
  var oceanRows = tports
    ? tports.map(function (p) { return [esc(p.port) + (p.country ? " (" + esc(p.country) + ")" : ""), p.days + " days"]; })
    : Object.keys(C.ports.dest).map(function (k) { var lane = C.transit_days["SRG-" + k]; return [C.ports.dest[k], lane[0] + "\u2013" + lane[1] + " days"]; });
  var oceanTable = table(["Destination port (from Indonesia)", "Ocean transit"], oceanRows,
    { caption: "Ocean transit time, Indonesia \u2192 destination port", highlight: 0,
      foot: "Ocean days are the latest from current shipping data; Red Sea / Hormuz diversions can add 10\u201320+ days to Europe and Gulf lanes." });

  // (b) full lead-time breakdown SRG-LAX
  var L = C.leadtime;
  var ltRows = [
    ["Weathering (mandatory, pre-packing)", L.weathering_days + " days"],
    ["Production", L.production_days[0] + "\u2013" + L.production_days[1] + " days"],
    ["Ocean transit (Semarang \u2192 Los Angeles)", rng(laneLAX[0], laneLAX[1])],
    ["Destination clearance", L.clearance_days[0] + "\u2013" + L.clearance_days[1] + " days"],
    ["<strong>Door-ready total</strong>", "<strong>" + rLAX.totalLow + "\u2013" + rLAX.totalHigh + " days</strong>"]
  ];
  var ltTable = table(["Stage", "Duration"], ltRows,
    { caption: "Full lead time to door \u2014 Semarang \u2192 Los Angeles (no custom OEM print)",
      foot: "Add " + L.oem_print_days[0] + "\u2013" + L.oem_print_days[1] + " days for custom OEM-printed packaging. The 14-day weathering period before packing is required for UN 1361 under IMDG Special Provision 978." });

  return page({
    slug: "transit-time",
    title: "Indonesia Coconut Charcoal Shipping Time Estimator",
    lede: "Ocean transit for coconut shisha charcoal from Semarang, Indonesia to Los Angeles is about <strong>" +
      laneLAX[0] + "\u2013" + laneLAX[1] + " days</strong>. Allowing for the mandatory 14-day weathering period, production and clearance, the full door-ready lead time is roughly <strong>" +
      rLAX.totalLow + "\u2013" + rLAX.totalHigh + " days</strong>. Red Sea and Hormuz diversions can add 10\u201320+ days on Europe and Gulf lanes.",
    capsules: [
      "Ocean transit from Semarang to Los Angeles for coconut shisha charcoal is approximately <strong>" + laneLAX[0] + "\u2013" + laneLAX[1] + " days</strong> (verified " + V + "); Red Sea/Hormuz diversions can add 10\u201320+ days.",
      "Charcoal requires a mandatory <strong>14-day weathering period</strong> before packing under IMDG Special Provision 978, added on top of ocean transit (verified " + V + ").",
      "Full door-ready lead time from Indonesia to Los Angeles, including weathering, production and clearance, is roughly <strong>" + rLAX.totalLow + "\u2013" + rLAX.totalHigh + " days</strong> (verified " + V + "; illustrative)."
    ],
    sections: [
      oceanTable,
      h2("Full lead-time breakdown"),
      ltTable,
      h2("How this is calculated"),
      p("The headline is ocean transit only. The door-ready total adds the pre-shipment steps that actually gate a coconut-charcoal order: a mandatory 14-day weathering period before packing, production time, optional custom OEM print, and destination clearance. Weathering is not optional \u2014 it is a safety requirement for UN 1361 (Class 4.2) self-heating cargo under IMDG SP 978. Carrier fire-safety guidance from CINS (the Cargo Incident Notification System) identifies charcoal as a recurring cause of container fires, which is why the weathering period and \u226530 cm headspace are enforced."),
      p("Transit ranges are illustrative and highly route-sensitive. Red Sea diversions around the Cape of Good Hope and Strait of Hormuz disruptions materially extend Europe and Gulf lanes; treat any quoted range as date-stamped and confirm with your forwarder.")
    ],
    faq: [
      { q: "How long does it take to ship coconut charcoal from Indonesia?", a: "Ocean transit is about " + laneLAX[0] + "\u2013" + laneLAX[1] + " days to Los Angeles and longer to Europe and the Gulf. Including the 14-day weathering period, production and clearance, plan " + rLAX.totalLow + "\u2013" + rLAX.totalHigh + " days door-ready to the US West Coast.", aPlain: "Ocean transit is about " + laneLAX[0] + "\u2013" + laneLAX[1] + " days to Los Angeles; door-ready is " + rLAX.totalLow + "\u2013" + rLAX.totalHigh + " days including weathering, production and clearance." },
      { q: "Why does charcoal need a 14-day weathering period?", a: "Freshly produced charcoal can self-heat, so UN 1361 (Class 4.2) cargo must weather for 14 days before packing under IMDG Special Provision 978. It is a safety requirement that sits ahead of ocean transit in the timeline.", aPlain: "Freshly made charcoal self-heats; UN 1361 requires 14 days of weathering before packing under IMDG SP 978." }
    ],
    widget: { name: "transit-time", heading: "Estimate your transit and lead time", note: "Pick your ports and whether custom OEM print is needed." },
    dataset: { name: "Indonesia coconut charcoal ocean transit times", desc: "Ocean transit days from Indonesia to every published destination port, plus a full door-ready lead-time breakdown." }
  });
}

/* =========================================================================
 * 6.5 MOQ / PRICE-BREAK
 * ====================================================================== */
function buildMoq() {
  var breaks = F.priceBreaks(C.price_breaks);
  var rows = breaks.map(function (b, i) {
    return [b.label, F.money(b.unitPerT), F.money2(b.perKg), F.num(b.tonnes) + " t", F.money(b.total),
      i === 0 ? "\u2014" : F.pct(b.discountPct), i === 0 ? "\u2014" : F.money(b.savingsVsBase)];
  });
  var tbl = table(["Order size", "$/t", "$/kg", "Volume", "Order value", "Discount", "Saving vs 1\u00d720ft"], rows,
    { caption: "Coconut charcoal volume price breaks (illustrative)", highlight: breaks.length - 1,
      foot: "Discount and saving are measured against a single 20ft container. Illustrative price breaks, not a quote." });
  var big = breaks[breaks.length - 1];
  var mid = breaks[2];

  return page({
    slug: "moq-pricing",
    title: "Coconut Charcoal Volume Price Break Calculator",
    lede: "Wholesale coconut shisha charcoal starts at a full-container MOQ of about " + C.price_breaks[0].tonnes +
      " tonnes (one 20ft) at roughly <strong>" + F.money(breaks[0].unitPerT) + "/t</strong>. Scaling up cuts the unit price: a " +
      big.label.toLowerCase() + " lands near <strong>" + F.money(big.unitPerT) + "/t</strong>, about " + F.pct(big.discountPct) +
      " below the single-container rate.",
    capsules: [
      "The minimum order for wholesale coconut shisha charcoal is one full container \u2014 about " + C.price_breaks[0].tonnes + " tonnes \u2014 at roughly <strong>" + F.money(breaks[0].unitPerT) + "/t</strong> (verified " + V + "; illustrative).",
      "Ordering " + mid.label + " brings the unit price to about <strong>" + F.money(mid.unitPerT) + "/t</strong>, saving roughly <strong>" + F.money(mid.savingsVsBase) + "</strong> versus a single 20ft container (verified " + V + "; illustrative).",
      "At an annual-contract volume the unit price is about <strong>" + F.money(big.unitPerT) + "/t</strong>, around " + F.pct(big.discountPct) + " below the single-container rate (verified " + V + ")."
    ],
    sections: [
      tbl,
      h2("How volume pricing works"),
      p("Coconut charcoal is sold on full-container (FCL) minimums, so the smallest order is one container of about " + C.price_breaks[0].tonnes + " tonnes. Unit price falls as committed volume rises because fixed production, handling and freight-negotiation costs spread across more tonnes. The discount column measures each tier against a single 20ft container."),
      p("These are illustrative tiers to show the shape of volume pricing. Actual pricing depends on cube size and spec, destination, packaging (bulk vs OEM-printed) and contract terms \u2014 request a quote for firm numbers.")
    ],
    faq: [
      { q: "What is the minimum order quantity for coconut shisha charcoal?", a: "One full container \u2014 about " + C.price_breaks[0].tonnes + " tonnes for a 20ft \u2014 is the typical MOQ, because the product ships on full-container-load terms.", aPlain: "One full container, about " + C.price_breaks[0].tonnes + " tonnes for a 20ft." },
      { q: "How much cheaper is buying in larger volume?", a: "Moving from a single 20ft to " + mid.label + " saves about " + F.money(mid.savingsVsBase) + " at these illustrative rates; an annual contract runs about " + F.pct(big.discountPct) + " below the single-container unit price.", aPlain: "About " + F.money(mid.savingsVsBase) + " saved at " + mid.label + "; annual contracts run about " + F.pct(big.discountPct) + " cheaper per tonne." }
    ],
    widget: { name: "moq-pricing", heading: "See your volume price break", note: "Choose an order size to see the unit price and saving." },
    dataset: { name: "Coconut charcoal volume price breaks", desc: "Illustrative wholesale unit price, order value and volume-discount by order size from one 20ft container to an annual contract." }
  });
}

/* =========================================================================
 * 6.6 INCOTERMS
 * ====================================================================== */
function buildIncoterms() {
  var T = C.defaults.tonnes;
  var lc = lcFor("US", T);
  var ic = F.incoterms(lc);
  var order = ["EXW", "FOB", "CIF", "DDP"];

  // (a) who pays what matrix
  var payRows = F.INCOTERM_STAGES.map(function (s) {
    var cells = order.map(function (code) {
      var who = s.pay[code];
      var label = who === "B" ? "Buyer" : "Seller";
      return "<span class=\"ccx-cell-" + who + "\">" + label + "</span>";
    });
    return [s.label].concat(cells);
  });
  var payTable = table(["Cost stage"].concat(order), payRows,
    { caption: "Who pays what \u2014 Incoterms 2020 (coconut charcoal container)",
      foot: "Simplified summary of Incoterms\u00ae 2020 obligations for ocean shipment. \u201CBuyer\u201D means the buyer arranges and pays that stage." });

  // (b) supplier price + buyer-arranged + door total per incoterm
  var costRows = ic.summary.map(function (s) {
    return [s.incoterm, F.money(s.supplierPrice), F.money(s.buyerArranged), F.money(s.doorTotal)];
  });
  var costTable = table(["Incoterm", "Supplier invoices", "Buyer then arranges", "Total to buyer's door"], costRows,
    { caption: "Cost split by incoterm \u2014 " + T + " t container to the US (illustrative)",
      foot: "The total to the buyer's door is the same across incoterms \u2014 the incoterm only moves the line between \u201Csupplier invoices\u201D and \u201Cbuyer arranges\u201D (assuming no supplier margin on covered stages)." });

  var byCode = {};
  ic.summary.forEach(function (s) { byCode[s.incoterm] = s; });

  return page({
    slug: "incoterms",
    title: "Incoterms Cost Comparison for Charcoal Import (EXW / FOB / CIF / DDP)",
    lede: "Under FOB, the buyer of a coconut shisha charcoal container pays ocean freight, insurance, duty and destination costs; under CIF the seller covers freight and insurance to the destination port. Either way the total to your door is about <strong>" +
      F.money(byCode.FOB.doorTotal) + "</strong> for an " + T + " t container \u2014 the incoterm changes who arranges each stage, not the final cost.",
    capsules: [
      "Under FOB, the buyer of a coconut shisha charcoal container pays ocean freight, insurance, duty and destination costs; under CIF the seller covers freight and insurance to the destination port (verified " + V + ").",
      "For the same " + T + " t container, the supplier invoice is about <strong>" + F.money(byCode.EXW.supplierPrice) + "</strong> (EXW), <strong>" + F.money(byCode.FOB.supplierPrice) + "</strong> (FOB), <strong>" + F.money(byCode.CIF.supplierPrice) + "</strong> (CIF) and <strong>" + F.money(byCode.DDP.supplierPrice) + "</strong> (DDP), while the total to the buyer's door stays about " + F.money(byCode.FOB.doorTotal) + " under all four (verified " + V + "; illustrative).",
      "The incoterm decides who arranges and pays each shipping stage \u2014 not the final landed cost (verified " + V + ")."
    ],
    sections: [
      payTable,
      h2("What each incoterm costs"),
      costTable,
      h2("EXW vs FOB vs CIF vs DDP"),
      p("EXW (Ex Works) puts everything on the buyer from the seller's gate. FOB (Free On Board) means the seller handles origin costs and export clearance up to the ship; the buyer takes ocean freight, insurance, duty and destination. CIF (Cost, Insurance, Freight) adds ocean freight and insurance to the destination port to the seller's side; the buyer still handles duty and destination delivery. DDP (Delivered Duty Paid) puts the whole chain, including import duty, on the seller."),
      p("Because the same stages must be paid by someone, the door total is invariant \u2014 what changes is who arranges each stage and where risk transfers. Obligations here summarise Incoterms\u00ae 2020; costs are illustrative, not a quote.")
    ],
    faq: [
      { q: "What is the difference between EXW, FOB, CIF and DDP?", a: "They set who pays and arranges each shipping stage. EXW is buyer-does-everything; FOB adds origin handling and export to the seller; CIF adds ocean freight and insurance to the seller; DDP puts the entire chain including duty on the seller.", aPlain: "They set who arranges each stage: EXW (buyer does all), FOB (seller to ship), CIF (seller adds freight + insurance), DDP (seller does all incl. duty)." },
      { q: "Is FOB or CIF cheaper for importing charcoal?", a: "Neither is inherently cheaper \u2014 the total to your door is the same. CIF just bundles freight and insurance into the supplier's invoice; FOB lets you arrange them yourself, which can be cheaper if you have good freight rates.", aPlain: "The door total is the same; CIF bundles freight and insurance into the invoice, FOB lets you arrange them, which can be cheaper with good rates." },
      { q: "Who pays import duty under CIF?", a: "The buyer. Under CIF the seller covers freight and insurance only to the destination port; import duty, customs clearance and inland delivery remain the buyer's responsibility. Only DDP puts duty on the seller.", aPlain: "The buyer pays duty under CIF; only DDP puts import duty on the seller." }
    ],
    widget: { name: "incoterms", heading: "Compare incoterms for your shipment", note: "Highlight an incoterm and adjust the shipment to see the split." },
    dataset: { name: "Incoterms 2020 cost allocation for charcoal shipment", desc: "Buyer/seller responsibility by cost stage across EXW, FOB, CIF and DDP, with an illustrative cost split for an 18 t coconut charcoal container." }
  });
}

/* =========================================================================
 * 6.7 ROI / PAYBACK
 * ====================================================================== */
function buildRoi() {
  var T = C.defaults.tonnes;
  var capital = Math.round(lcFor("US", T).totalLanded);
  var margin = 35;
  var costPerKg = capital / (T * 1000);
  var resalePerKg = costPerKg / (1 - margin / 100);
  var transit = 25;
  var sells = [30, 60, 90, 120];

  var rows = sells.map(function (d) {
    var r = F.roiPayback(capital, resalePerKg, T, d, transit);
    return [d + " days", F.pct(r.roiPct), F.num(r.turnsPerYear, 1), F.num(r.paybackDays) + " days", F.pct(r.annualizedRoi)];
  });
  var tbl = table(["Sell-through", "ROI / cycle", "Turns / yr", "Payback", "Annualized ROI"], rows,
    { caption: "Return on a " + T + " t container at a " + margin + "% margin (" + transit + "-day transit, illustrative)", highlight: 1,
      foot: "ROI per cycle is fixed by the margin; faster sell-through raises turns and annualized ROI. Capital = " + F.money(capital) + " landed; excludes storage, financing and breakage." });

  var r60 = F.roiPayback(capital, resalePerKg, T, 60, transit);

  return page({
    slug: "roi-payback",
    title: "Coconut Charcoal Import ROI & Payback Calculator",
    lede: "A 20ft container of coconut shisha charcoal (about " + F.money(capital) + " landed) sold through in 60 days at a 35% margin returns roughly <strong>" +
      F.pct(r60.roiPct) + "</strong> per cycle and about <strong>" + F.pct(r60.annualizedRoi) +
      "</strong> annualized, with payback in about " + F.num(r60.paybackDays) + " days. Faster sell-through multiplies the annualized return by turning the same capital more often.",
    capsules: [
      "A 20ft container of coconut shisha charcoal sold through in 60 days at a 35% margin returns about <strong>" + F.pct(r60.roiPct) + "</strong> per cycle and roughly <strong>" + F.pct(r60.annualizedRoi) + "</strong> annualized (verified " + V + "; illustrative).",
      "At a 35% margin the per-cycle ROI is fixed at about " + F.pct(r60.roiPct) + "; payback and annualized return depend on how fast inventory sells through (verified " + V + ").",
      "Cash cycle is transit plus sell-through \u2014 about " + F.num(r60.cycleDays) + " days for a 60-day sell-through on a " + transit + "-day lane, giving roughly " + F.num(r60.turnsPerYear, 1) + " inventory turns a year (verified " + V + ")."
    ],
    sections: [
      tbl,
      h2("How this is calculated"),
      p("Gross profit is revenue at full sell-through minus the landed capital; ROI per cycle is gross profit over capital. The cash cycle is ocean transit plus sell-through days; annual turns are 365 divided by the cycle, and annualized ROI is per-cycle ROI times turns. Payback at full sell-through equals the cash cycle."),
      p("The per-cycle return is set entirely by the margin \u2014 " + F.pct(r60.roiPct) + " at 35% here \u2014 so the lever that matters for annual performance is sell-through speed, which multiplies how many times the same capital works in a year. Figures are illustrative and exclude storage, financing, breakage and marketing.")
    ],
    faq: [
      { q: "What is the ROI on importing a container of coconut charcoal?", a: "At a 35% margin, an " + T + " t container returns about " + F.pct(r60.roiPct) + " gross per cycle. Sold through in 60 days on a " + transit + "-day lane that is roughly " + F.pct(r60.annualizedRoi) + " annualized, before operating costs.", aPlain: "About " + F.pct(r60.roiPct) + " gross per cycle at a 35% margin, roughly " + F.pct(r60.annualizedRoi) + " annualized for a 60-day sell-through, before operating costs." },
      { q: "How fast does a charcoal container pay back?", a: "Payback at full sell-through equals the cash cycle \u2014 transit plus sell-through days. For a 60-day sell-through on a " + transit + "-day lane, that is about " + F.num(r60.paybackDays) + " days.", aPlain: "Payback equals the cash cycle: about " + F.num(r60.paybackDays) + " days for a 60-day sell-through on a " + transit + "-day lane." }
    ],
    widget: { name: "roi-payback", heading: "Model your return and payback", note: "Enter your capital, margin, sell-through and transit." },
    dataset: { name: "Coconut charcoal import ROI by sell-through", desc: "Per-cycle ROI, inventory turns, payback and annualized ROI for an 18 t container at a 35% margin across 30/60/90/120-day sell-through." }
  });
}

/* =========================================================================
 * 6.8 SPEC-COMPARISON
 * ====================================================================== */
function buildSpec() {
  // Grades come from the shared source in formulas.js (F.SPEC_ROWS / F.SPEC_GRADES) \u2014
  // the same data the widget grades against, so this table and the widget can
  // never disagree. Columns: [attribute, ...grades, why it matters].
  function cell(row, gi) {
    if (row.text) return row.text[gi];
    var b = row.band[gi];
    return (b[0] === b[1] ? b[0] : b[0] + "\u2013" + b[1]) + row.unit;
  }
  var specRows = F.SPEC_ROWS.map(function (row) {
    return [row.label].concat(F.SPEC_GRADES.map(function (_g, gi) { return cell(row, gi); })).concat([row.why]);
  });
  var tbl = table(["Attribute"].concat(F.SPEC_GRADES).concat(["Why it matters"]), specRows,
    { caption: "Coconut shisha charcoal grades \u2014 " + F.SPEC_GRADES.join(" vs "), highlight: 0,
      foot: "Typical quality ranges per grade. Confirm against this exporter's published Certificate of Analysis (COA) and burn-test data." });

  return page({
    slug: "spec-comparison",
    title: "Coconut Shisha Charcoal Grades \u2014 Platinum, Super Premium & Premium",
    lede: "Our coconut shisha charcoal comes in three grades \u2014 <strong>Platinum</strong>, <strong>Super Premium</strong> and <strong>Premium</strong> \u2014 separated mainly by ash content and moisture. Platinum runs the lowest ash at <strong>1.6\u20131.9%</strong> and the driest cores (<strong>3\u20134%</strong> moisture after oven); Super Premium sits at <strong>1.9\u20132.2%</strong> ash; Premium at <strong>1.9\u20132.5%</strong>. Every grade burns with <strong>no smell and no smoke</strong>.",
    capsules: [
      "Platinum coconut shisha charcoal has the lowest ash content at 1.6\u20131.9% and 3\u20134% moisture after oven (verified " + V + ").",
      "All three grades \u2014 Platinum, Super Premium and Premium \u2014 burn with no smell and no smoke (verified " + V + ").",
      "Grades are separated by ash content and moisture; on-packing moisture runs 4\u20138% across grades (verified " + V + ")."
    ],
    sections: [
      tbl,
      h2("How the three grades differ"),
      p("The grades share the same coconut-shell base and differ mainly in two lab figures: ash content and moisture. Ash is lowest on Platinum (1.6\u20131.9%), a little higher on Super Premium (1.9\u20132.2%) and Premium (1.9\u20132.5%) \u2014 lower ash means a cleaner burn and less residue in the bowl."),
      p("Moisture is reported twice: straight after oven-drying (3\u20136% depending on grade) and again on packing (4\u20138%), which reflects how the coals settle before they ship. Every grade is produced to be no smell and no smoke once fully lit.")
    ],
    faq: [
      { q: "What is the difference between Platinum, Super Premium and Premium charcoal?", a: "Mainly ash content and moisture. Platinum has the lowest ash (1.6\u20131.9%) and driest cores (3\u20134% after oven), Super Premium is 1.9\u20132.2% ash, and Premium is 1.9\u20132.5%. All three are no smell and no smoke.", aPlain: "Platinum has the lowest ash (1.6\u20131.9%) and moisture; Super Premium is 1.9\u20132.2% ash; Premium is 1.9\u20132.5%. All three are no smell, no smoke." },
      { q: "Do all grades burn with no smell and no smoke?", a: "Yes. Platinum, Super Premium and Premium are all produced to burn with no smell and no smoke once fully lit.", aPlain: "Yes \u2014 all three grades are no smell and no smoke once lit." },
      { q: "Why are there two moisture figures?", a: "One is measured straight after oven-drying and the other on packing. The on-packing figure (4\u20138%) is higher because the coals reabsorb a little moisture before they ship.", aPlain: "One is after oven-drying, one at packing; the on-packing figure is higher because coals reabsorb some moisture before shipping." }
    ],
    widget: { name: "spec-comparison", heading: "Check your charcoal against our grades", note: "Enter your ash and moisture to see which grade it matches." },
    dataset: { name: "Coconut shisha charcoal grade specifications", desc: "Grade ranges for Platinum, Super Premium and Premium coconut shisha charcoal \u2014 ash content and moisture (after oven and on packing), plus no-smell and no-smoke guarantees." }
  });
}

/* =========================================================================
 * 6.9 PACKAGING-PRICE
 * ====================================================================== */
function buildPackaging() {
  var pk = C.packaging || { boxes: [] };
  var boxes = pk.boxes || [];
  var rate = pk.usd_rate || 16000;
  function idr(x) { return "Rp " + F.num(Math.round(x)); }
  function lowPrice(b) { return Math.min.apply(null, b.tiers.map(function (t) { return t.price; })); }

  var rows = [];
  boxes.forEach(function (b) {
    b.tiers.slice().sort(function (a, c) { return a.qty - c.qty; }).forEach(function (t) {
      rows.push([b.label, b.dims, F.num(t.qty) + "+", idr(t.price), F.money2(t.price / rate)]);
    });
  });
  var tbl = rows.length
    ? table(["Box", "Size", "Order qty", "Price / box", "≈ USD / box"], rows,
        { caption: "Printed packaging price by box and order quantity (per box, IDR)", highlight: 0,
          foot: "Per-box prices from current quotes. USD is an estimate at Rp " + F.num(rate) + "/USD. Custom printing, materials, tooling and lead time affect final pricing — request a quote." })
    : p("No packaging quotes are available yet.");

  var inner = boxes.filter(function (b) { return b.kind === "inner"; });
  var master = boxes.filter(function (b) { return b.kind === "master"; });
  var exI = inner[0], exM = master[0];
  var lede = exI || exM
    ? "Custom printed packaging for coconut shisha charcoal is priced per box and falls with order quantity. " +
      (exI ? "Inner retail boxes run from about <strong>" + idr(lowPrice(exI)) + "</strong> per box (≈ " + F.money2(lowPrice(exI) / rate) + ") at volume. " : "") +
      (exM ? "Master shipping cartons run from about <strong>" + idr(lowPrice(exM)) + "</strong> per box (≈ " + F.money2(lowPrice(exM) / rate) + ")." : "")
    : "Custom printed packaging for coconut shisha charcoal is priced per box and falls with order quantity.";

  var caps = [];
  if (exI) caps.push("Custom printed inner boxes for coconut charcoal are about <strong>" + idr(lowPrice(exI)) + "</strong> per box (≈ " + F.money2(lowPrice(exI) / rate) + ") at volume (verified " + V + "; from current quotes).");
  if (exM) caps.push("Printed master shipping cartons are about <strong>" + idr(lowPrice(exM)) + "</strong> per box (≈ " + F.money2(lowPrice(exM) / rate) + ") at volume (verified " + V + "; from current quotes).");
  caps.push("Per-box packaging price falls as order quantity rises — the quantity price breaks are shown in the table above (verified " + V + ").");

  var faq = [];
  if (exI) faq.push({ q: "How much do custom printed inner boxes for coconut charcoal cost?", a: "From about <strong>" + idr(lowPrice(exI)) + "</strong> per box (≈ " + F.money2(lowPrice(exI) / rate) + ") at volume, with the exact price depending on size, material, printing and order quantity.", aPlain: "From about " + idr(lowPrice(exI)) + " per box at volume, depending on size, material, printing and quantity." });
  faq.push({ q: "Does box price drop with larger orders?", a: "Yes — packaging is quoted per box and the per-box price falls as order quantity rises. Enter your quantity in the calculator to see the tier that applies.", aPlain: "Yes; per-box price falls as order quantity rises." });

  return page({
    slug: "packaging-price",
    title: "Coconut Charcoal Packaging Price Calculator",
    lede: lede,
    capsules: caps,
    sections: [
      tbl,
      h2("How packaging is priced"),
      p("Printed inner boxes and master shipping cartons are quoted per box at a given order quantity. The per-box price falls as quantity rises because setup, plate/tooling and print-run costs spread across more units. Prices are in Indonesian rupiah (IDR); the USD column is an estimate at Rp " + F.num(rate) + "/USD."),
      p("Final pricing depends on box size, board and paper grade, number of print colours, finishing and lead time. Use the calculator to estimate a per-box price and total for your quantity, then request a firm quote.")
    ],
    faq: faq,
    widget: { name: "packaging-price", heading: "Estimate your packaging cost", note: "Pick a box and enter your order quantity to see the per-box price and total." },
    dataset: { name: "Coconut charcoal packaging price by box and quantity", desc: "Per-box price of printed inner boxes and master shipping cartons for coconut shisha charcoal, by box configuration and order quantity, in IDR with a USD estimate." }
  });
}

/* ---- write all ---------------------------------------------------------- */
var BUILDS = {
  "container-load": buildContainerLoad,
  "landed-cost": buildLandedCost,
  "profit-margin": buildProfitMargin,
  "transit-time": buildTransit,
  "moq-pricing": buildMoq,
  "incoterms": buildIncoterms,
  "roi-payback": buildRoi,
  "spec-comparison": buildSpec,
  "packaging-price": buildPackaging
};

var wrote = [];
Object.keys(BUILDS).forEach(function (name) {
  var html = BUILDS[name]();
  var file = path.join(OUT, name + ".html");
  fs.writeFileSync(file, html + "\n", "utf8");
  wrote.push([name, html.length]);
});

console.log("Static blocks generated (config verified " + V + "):");
wrote.forEach(function (w) { console.log("  \u2713 dist/static/" + w[0] + ".html  (" + w[1] + " bytes)"); });
console.log("Done. Paste each into a WordPress Custom HTML block.");
