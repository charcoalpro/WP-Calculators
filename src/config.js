/*! CCX config.js — GENERATED from the admin API at build time. Do NOT hand-edit.
 *  Source of truth: the database behind https://id.charcoal.pro/admin/api/config
 *  Regenerate:  node generator/api-adapter.js --write  &&  node generator/build-static.js
 *  Generated:   2026-07-10T10:15:57.337Z
 */
(function (root, factory) {
  var cfg = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = cfg;
  else { root.CCX = root.CCX || {}; root.CCX.config = cfg; }
})(typeof self !== "undefined" ? self : this, function () {
  return {
    "meta": {
      "verified": "2026-06",
      "currency": "USD",
      "hs_code": "4402.20",
      "data_is_dummy": true
    },
    "author": {
      "org_name": "Charcoal.pro",
      "org_url": "https://charcoal.pro",
      "org_logo": "https://charcoal.pro/logo.png",
      "person_name": "Greg Ryabtsev",
      "person_jobtitle": "Founder",
      "person_url": "https://charcoal.pro/about",
      "person_sameas": [],
      "person_credentials": ""
    },
    "pricing": {
      "exw_per_t": 1000,
      "fob_per_t": 1300,
      "market_low": 1200,
      "market_high": 1400
    },
    "containers": {
      "20ft": {
        "label": "20ft Standard",
        "cbm": 33,
        "max_net_t": 19
      },
      "40ft": {
        "label": "40ft Standard",
        "cbm": 67,
        "max_net_t": 25.5
      },
      "40ftHC": {
        "label": "40ft High Cube",
        "cbm": 76,
        "max_net_t": 26
      }
    },
    "packing_efficiency": 0.88,
    "cartons": {
      "1kg": {
        "net_kg": 1,
        "cbm": 0.0014
      },
      "10kg": {
        "net_kg": 10,
        "cbm": 0.0143
      },
      "20kg": {
        "net_kg": 20,
        "cbm": 0.0286
      },
      "24kg": {
        "net_kg": 24,
        "cbm": 0.0343
      }
    },
    "cube_sizes_mm": [
      25,
      26,
      27
    ],
    "duty": {
      "US": {
        "rate": 0,
        "basis": "FOB",
        "label": "United States",
        "note": "HS4402.20 duty-free per CBP N306942. VERIFY current Section 122 / reciprocal surcharge on Indonesian origin — HIGHLY VOLATILE.",
        "clearance": 350,
        "inland": 300
      },
      "DE": {
        "rate": 0,
        "basis": "CIF",
        "label": "Germany",
        "note": "EU TARIC HS4402.20. VERIFY.",
        "clearance": 350,
        "inland": 300
      },
      "UK": {
        "rate": 0,
        "basis": "CIF",
        "label": "United Kingdom",
        "note": "UK Global Tariff. VERIFY.",
        "clearance": 350,
        "inland": 300
      },
      "SA": {
        "rate": 0.05,
        "basis": "CIF",
        "label": "Saudi Arabia",
        "note": "GCC common tariff ~5%. SASO/SABER PCoC+SCoC mandatory. VERIFY.",
        "clearance": 350,
        "inland": 300
      },
      "IN": {
        "rate": 0.3,
        "basis": "CIF",
        "label": "India",
        "note": "~30% effective. VERIFY.",
        "clearance": 350,
        "inland": 300
      },
      "TR": {
        "rate": 0,
        "basis": "CIF",
        "label": "Turkey",
        "note": "VERIFY.",
        "clearance": 350,
        "inland": 300
      },
      "AE": {
        "rate": 0.05,
        "basis": "CIF",
        "label": "UAE",
        "note": "GCC ~5%. VERIFY.",
        "clearance": 350,
        "inland": 300
      },
      "CA": {
        "rate": 0,
        "basis": "FOB",
        "label": "Canada",
        "note": "VERIFY.",
        "clearance": 350,
        "inland": 300
      },
      "AU": {
        "rate": 0,
        "basis": "FOB",
        "label": "Australia",
        "note": "VERIFY; biosecurity/phytosanitary applies.",
        "clearance": 350,
        "inland": 300
      }
    },
    "insurance_rate": 0.004,
    "dest_handling": {
      "clearance_per_container": 350,
      "inland_per_container": 300
    },
    "freight_per_container": {
      "SRG-LAX": 3500,
      "SRG-NYC": 5500,
      "SRG-HAM": 4500,
      "SRG-FXT": 4500,
      "SRG-JEA": 2500,
      "SRG-JED": 3000,
      "SRG-NSA": 1800,
      "SRG-MER": 4000
    },
    "transit_days": {
      "SRG-LAX": [
        20,
        30
      ],
      "SRG-NYC": [
        30,
        45
      ],
      "SRG-HAM": [
        35,
        50
      ],
      "SRG-FXT": [
        35,
        50
      ],
      "SRG-JEA": [
        12,
        22
      ],
      "SRG-JED": [
        16,
        28
      ],
      "SRG-NSA": [
        10,
        18
      ],
      "SRG-MER": [
        25,
        40
      ]
    },
    "routing_note": "Red Sea diversions (Cape of Good Hope routing) and Hormuz disruption can add 10-20+ days to EU/Gulf lanes. Treat as user-editable and date-stamp.",
    "ports": {
      "origin": {
        "SRG": "Semarang",
        "SUB": "Surabaya",
        "TPP": "Tanjung Priok (Jakarta)"
      },
      "dest": {
        "LAX": "Los Angeles / Long Beach",
        "NYC": "New York",
        "HAM": "Hamburg",
        "FXT": "Felixstowe",
        "JEA": "Jebel Ali",
        "JED": "Jeddah",
        "NSA": "Nhava Sheva",
        "MER": "Mersin"
      }
    },
    "leadtime": {
      "weathering_days": 14,
      "production_days": [
        7,
        14
      ],
      "oem_print_days": [
        14,
        21
      ],
      "clearance_days": [
        2,
        7
      ]
    },
    "price_breaks": [
      {
        "key": "1x20",
        "label": "1 × 20ft",
        "tonnes": 19,
        "unit_per_t": 1300
      },
      {
        "key": "1x40",
        "label": "1 × 40ft",
        "tonnes": 25.5,
        "unit_per_t": 1270
      },
      {
        "key": "2x40",
        "label": "2 × 40ft",
        "tonnes": 51,
        "unit_per_t": 1240
      },
      {
        "key": "5x40",
        "label": "5 × 40ft",
        "tonnes": 127.5,
        "unit_per_t": 1205
      },
      {
        "key": "annual",
        "label": "Annual contract",
        "tonnes": 300,
        "unit_per_t": 1175
      }
    ],
    "specs": {
      "premium": {
        "ash_max_pct": 2.5,
        "fixed_carbon_min_pct": 80,
        "moisture_max_pct": 5,
        "burn_min_minutes": 75,
        "density_min": 0.9,
        "drop_test_max_pct": 5
      },
      "standard": {
        "ash_max_pct": 4,
        "fixed_carbon_min_pct": 72,
        "moisture_max_pct": 8,
        "burn_min_minutes": 60,
        "density_min": 0.8,
        "drop_test_max_pct": 10
      }
    },
    "defaults": {
      "origin": "SRG",
      "dest_port": "LAX",
      "dest_country": "US",
      "tonnes": 18,
      "incoterm": "FOB",
      "carton": "20kg",
      "container": "20ft"
    }
  };
});
