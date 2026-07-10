/* CCX — _util.js · shared browser helpers for the interactive layer.
 * Attaches window.CCX.util and window.CCX.widgets registry. Browser only —
 * the generator never loads this. Keeps every widget small and consistent. */
(function () {
  var CCX = (window.CCX = window.CCX || {});
  CCX.widgets = CCX.widgets || {};

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }

  // field: {type:'number'|'select', id, label, value, hint, step, min, max, options:[{value,label}]}
  function field(f) {
    var input;
    if (f.type === "select") {
      input = el("select", { id: f.id });
      (f.options || []).forEach(function (o) {
        var opt = el("option", { value: o.value, text: o.label });
        if (String(o.value) === String(f.value)) opt.selected = true;
        input.appendChild(opt);
      });
    } else if (f.type === "checkbox") {
      input = el("input", { id: f.id, type: "checkbox" });
      if (f.value) input.checked = true;
    } else {
      input = el("input", { id: f.id, type: "number", inputmode: "decimal" });
      if (f.step != null) input.step = f.step;
      if (f.min != null) input.min = f.min;
      if (f.max != null) input.max = f.max;
      if (f.value != null) input.value = f.value;
    }
    var label = el("label", { for: f.id, text: f.label });
    var kids = f.type === "checkbox"
      ? [el("div", { class: "ccx-toggle" }, [input, el("span", { text: f.label })])]
      : [label, input];
    if (f.hint) kids.push(el("div", { class: "ccx-hint", text: f.hint }));
    return el("div", { class: "ccx-field" }, kids);
  }

  function val(id) { var n = document.getElementById(id); return n ? n.value : null; }
  function numval(id) { var v = parseFloat(val(id)); return isNaN(v) ? 0 : v; }
  function checked(id) { var n = document.getElementById(id); return !!(n && n.checked); }

  /* ---- Shareable-URL state (§8): pure client-side, no storage ------------
   * A widget passes spec.params = { fieldId: "shortName" }. On load we pre-fill
   * fields from ?shortName=value; on user change we mirror state into the query
   * string via history.replaceState (no new history entries, no page reload). */
  function readParams() { try { return new URLSearchParams(window.location.search); } catch (e) { return null; } }
  function paramValue(name, dflt) { var p = readParams(); return (p && p.has(name)) ? p.get(name) : dflt; }
  function hasMap(map) { return !!(map && Object.keys(map).length); }
  function applyParams(fields, map) {
    var p = readParams(); if (!p || !map) return;
    fields.forEach(function (f) {
      var name = map[f.id]; if (!name || !p.has(name)) return;
      var v = p.get(name);
      f.value = (f.type === "checkbox") ? (v === "1" || v === "true") : v;
    });
  }
  function writeParams(fields, map) {
    if (!map) return;
    try {
      var p = new URLSearchParams(window.location.search);
      fields.forEach(function (f) {
        var name = map[f.id]; if (!name) return;
        var n = document.getElementById(f.id); if (!n) return;
        p.set(name, f.type === "checkbox" ? (n.checked ? "1" : "0") : n.value);
      });
      var qs = p.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "") + window.location.hash);
    } catch (e) { /* history unavailable — degrade to no URL sync */ }
  }

  // Standard result block. r = {headline, headlineSmall, lines:[{label,value}], flag, disclaimer}
  function renderResult(target, r) {
    target.innerHTML = "";
    if (r.headline != null) {
      target.appendChild(el("div", { class: "ccx-result-headline" }, [
        document.createTextNode(r.headline + " "),
        r.headlineSmall ? el("small", { text: r.headlineSmall }) : null
      ]));
    }
    if (r.lines && r.lines.length) {
      var lines = el("div", { class: "ccx-result-lines" });
      r.lines.forEach(function (ln) {
        lines.appendChild(el("div", { class: "ccx-result-line" }, [
          el("span", { text: ln.label }), el("span", { text: ln.value })
        ]));
      });
      target.appendChild(lines);
    }
    if (r.flag) target.appendChild(el("div", { class: "ccx-flag", text: r.flag }));
    if (r.disclaimer) target.appendChild(el("div", { class: "ccx-disclaimer", text: r.disclaimer }));
  }

  // Build the widget shell inside a mount, wire live recompute, return {inputs, result, recompute}.
  // spec = {title, sub, fields:[...], compute: fn(read)->resultObj, disclaimer}
  function build(mount, spec) {
    applyParams(spec.fields, spec.params);          // pre-fill from ?params before rendering
    var syncUrl = hasMap(spec.params);
    var inputsWrap = el("div", { class: "ccx-widget-inputs ccx-grid" });
    spec.fields.forEach(function (f) { inputsWrap.appendChild(field(f)); });
    var result = el("div", { class: "ccx-result", role: "status", "aria-live": "polite" });
    var reset = el("button", { class: "ccx-btn ccx-btn-ghost", type: "button", text: "Reset" });
    var actions = el("div", { class: "ccx-actions" }, [reset]);

    var widget = el("div", { class: "ccx-widget" }, [
      el("div", { class: "ccx-widget-title", text: spec.title || "Try your own numbers" }),
      spec.sub ? el("div", { class: "ccx-widget-sub", text: spec.sub }) : null,
      inputsWrap, actions, result
    ]);
    mount.appendChild(widget);

    function recompute() { renderResult(result, spec.compute()); }
    function onChange() { recompute(); if (syncUrl) writeParams(spec.fields, spec.params); }
    inputsWrap.addEventListener("input", onChange);
    inputsWrap.addEventListener("change", onChange);
    reset.addEventListener("click", function (e) {
      e.preventDefault();
      spec.fields.forEach(function (f) {
        var n = document.getElementById(f.id);
        if (!n) return;
        if (f.type === "checkbox") n.checked = !!f.value;
        else n.value = f.value != null ? f.value : "";
      });
      onChange();
    });
    recompute();                                    // initial render only — no URL write on load
    return { widget: widget, result: result, recompute: recompute };
  }

  function mountAll(name, initOne) {
    var nodes = document.querySelectorAll('[data-ccx="' + name + '"]');
    if (!nodes.length) return;
    nodes.forEach(function (node) {
      if (node.getAttribute("data-ccx-ready")) return;
      node.setAttribute("data-ccx-ready", "1");
      try { initOne(node); } catch (err) { if (window.console) console.error("[CCX] " + name + " init failed", err); }
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  CCX.util = { el: el, field: field, val: val, numval: numval, checked: checked, paramValue: paramValue, renderResult: renderResult, build: build, mountAll: mountAll, ready: ready };
})();
