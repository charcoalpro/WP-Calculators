/*! CCX config.js — GENERATED from the admin API at build time. Do NOT hand-edit.
 *  Source of truth: the database behind https://id.charcoal.pro/admin/api/config
 *  Regenerate:  node generator/api-adapter.js --write  &&  node generator/build-static.js
 *  Generated:   2026-07-13T03:33:15.769Z
 */
(function (root, factory) {
  var cfg = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = cfg;
  else { root.CCX = root.CCX || {}; root.CCX.config = cfg; }
})(typeof self !== "undefined" ? self : this, function () {
  return {
    "meta": {
      "verified": "2026-07-15",
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
        "note": "Base rate duty-free (HS 4402.20; CBP N306942). HOWEVER a ~10% US Section 122 surcharge applies to Indonesian-origin goods as of Jul 2026, expiring ~24 Jul 2026 (IEEPA reciprocal tariffs struck down by SCOTUS 20 Feb 2026). Re-verify current rate with a customs broker -- HIGHLY VOLATILE.",
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
        "rate": 0.065,
        "basis": "FOB",
        "label": "Canada",
        "note": "MFN 6.5% on HS 4402.20.90 (shisha/BBQ cube charcoal). Duty-free only under Canada GPT if Indonesia is GPT-eligible with valid origin docs -- verify before quoting.",
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
      "SRG-LAX": 8240,
      "SRG-NYC": 5500,
      "SRG-HAM": 2450,
      "SRG-FXT": 3520,
      "SRG-JEA": 4500,
      "SRG-JED": 4450,
      "SRG-NSA": 2560,
      "SRG-MER": 5200
    },
    "transit_days": {
      "SRG-LAX": [
        52,
        52
      ],
      "SRG-NYC": [
        30,
        45
      ],
      "SRG-HAM": [
        45,
        45
      ],
      "SRG-FXT": [
        34,
        34
      ],
      "SRG-JEA": [
        20,
        20
      ],
      "SRG-JED": [
        25,
        25
      ],
      "SRG-NSA": [
        26,
        26
      ],
      "SRG-MER": [
        42,
        42
      ]
    },
    "freight_by_country": {
      "IN": {
        "ft20": 2560,
        "ft40": 2795,
        "days": 26
      },
      "US": {
        "ft20": 8240,
        "ft40": 10300,
        "days": 52
      },
      "TR": {
        "ft20": 5200,
        "ft40": 7800,
        "days": 42
      },
      "UK": {
        "ft20": 3520,
        "ft40": 6355,
        "days": 34
      },
      "SA": {
        "ft20": 4450,
        "ft40": 6250,
        "days": 25
      },
      "AE": {
        "ft20": 4500,
        "ft40": 4800,
        "days": 20
      },
      "CA": {
        "ft20": 2425,
        "ft40": 3035,
        "days": 38
      },
      "AU": {
        "ft20": 1500,
        "ft40": 2520,
        "days": 29
      },
      "DE": {
        "ft20": 2450,
        "ft40": 3850,
        "days": 45
      }
    },
    "transit_ports": [
      {
        "port": "Durres",
        "country": "Albania",
        "days": 60
      },
      {
        "port": "Alger",
        "country": "Algeria",
        "days": 55
      },
      {
        "port": "Algiers",
        "country": "Algeria",
        "days": 40
      },
      {
        "port": "Melbourne",
        "country": "Australia",
        "days": 31
      },
      {
        "port": "Sydney",
        "country": "Australia",
        "days": 29
      },
      {
        "port": "Baku",
        "country": "Azerbajan",
        "days": 59
      },
      {
        "port": "Khalifa Bin Salman",
        "country": "Bahrain",
        "days": 12
      },
      {
        "port": "Antwerpen",
        "country": "Belgium",
        "days": 41
      },
      {
        "port": "Santos",
        "country": "Brazil",
        "days": 55
      },
      {
        "port": "Kribi",
        "country": "Cameroon",
        "days": 45
      },
      {
        "port": "Montreal",
        "country": "Canada",
        "days": 57
      },
      {
        "port": "Toronto",
        "country": "Canada",
        "days": 55
      },
      {
        "port": "Vancouver",
        "country": "Canada",
        "days": 38
      },
      {
        "port": "Qingdao",
        "country": "China",
        "days": 14
      },
      {
        "port": "Shanghai",
        "country": "China",
        "days": 15
      },
      {
        "port": "Tianjin",
        "country": "China",
        "days": 12
      },
      {
        "port": "Xiamen",
        "country": "China",
        "days": 15
      },
      {
        "port": "Xingang",
        "country": "China",
        "days": 10
      },
      {
        "port": "Conakry",
        "country": "Conakry",
        "days": 55
      },
      {
        "port": "Limassol",
        "country": "Cyprus",
        "days": 41
      },
      {
        "port": "Copenhagen",
        "country": "Denmark",
        "days": 52
      },
      {
        "port": "Alexandria",
        "country": "Egypt",
        "days": 39
      },
      {
        "port": "Dekheila (Alexandria)",
        "country": "Egypt",
        "days": 42
      },
      {
        "port": "Port Said West",
        "country": "Egypt",
        "days": 42
      },
      {
        "port": "Sokhan",
        "country": "Egypt",
        "days": 35
      },
      {
        "port": "Sokhna",
        "country": "Egypt",
        "days": 39
      },
      {
        "port": "Suva",
        "country": "Fiji",
        "days": 50
      },
      {
        "port": "Le Havre",
        "country": "France",
        "days": 35
      },
      {
        "port": "Banjul",
        "country": "Gambia",
        "days": 65
      },
      {
        "port": "Poti",
        "country": "Georgia",
        "days": 45
      },
      {
        "port": "Bremerhaven",
        "country": "Germany",
        "days": 45
      },
      {
        "port": "Hamburg",
        "country": "Germany",
        "days": 45
      },
      {
        "port": "Tema",
        "country": "Ghana",
        "days": 69
      },
      {
        "port": "Piraeus",
        "country": "Greece",
        "days": 45
      },
      {
        "port": "Hong Kong",
        "country": "Hong Kong",
        "days": 10
      },
      {
        "port": "Chennai",
        "country": "India",
        "days": 18
      },
      {
        "port": "Jawaharlal Nehru Port (JNP)",
        "country": "India",
        "days": 18
      },
      {
        "port": "Kolkata",
        "country": "India",
        "days": 26
      },
      {
        "port": "Mumbai",
        "country": "India",
        "days": 18
      },
      {
        "port": "Mundra",
        "country": "India",
        "days": 18
      },
      {
        "port": "Nava Sheva",
        "country": "India",
        "days": 15
      },
      {
        "port": "Bandar Abbas",
        "country": "Iran",
        "days": 15
      },
      {
        "port": "Basra",
        "country": "Iraq",
        "days": 18
      },
      {
        "port": "Umm Qasr",
        "country": "Iraq",
        "days": 17
      },
      {
        "port": "Ashdod",
        "country": "Israel (Palestine)",
        "days": 35
      },
      {
        "port": "Haifa",
        "country": "Israel (Palestine)",
        "days": 35
      },
      {
        "port": "Genoa",
        "country": "Italy",
        "days": 35
      },
      {
        "port": "Gioia Tauro",
        "country": "Italy",
        "days": 55
      },
      {
        "port": "Abidjan",
        "country": "Ivory Coast",
        "days": 51
      },
      {
        "port": "Tokyo",
        "country": "Japan",
        "days": 14
      },
      {
        "port": "Aqaba",
        "country": "Jordan",
        "days": 53
      },
      {
        "port": "Mombasa",
        "country": "Kenya",
        "days": 45
      },
      {
        "port": "Busan",
        "country": "Korea",
        "days": 10
      },
      {
        "port": "Incheon",
        "country": "Korea",
        "days": 17
      },
      {
        "port": "Shuwaikh",
        "country": "Kuwait",
        "days": 20
      },
      {
        "port": "Apapa",
        "country": "Lagos",
        "days": 60
      },
      {
        "port": "Beirut",
        "country": "Lebanon",
        "days": 42
      },
      {
        "port": "Benghazi",
        "country": "Libya",
        "days": 39
      },
      {
        "port": "Misrata",
        "country": "Libya",
        "days": 38
      },
      {
        "port": "Tripoli",
        "country": "Libya",
        "days": 55
      },
      {
        "port": "Klaipeda",
        "country": "Lithuania",
        "days": 55
      },
      {
        "port": "Port Klang",
        "country": "Malaysia",
        "days": 5
      },
      {
        "port": "Male",
        "country": "Maldives",
        "days": 28
      },
      {
        "port": "Casablanca",
        "country": "Morocco",
        "days": 47
      },
      {
        "port": "Kathamandu",
        "country": "Nepal",
        "days": 45
      },
      {
        "port": "Amsterdam",
        "country": "Netherlands (Holland)",
        "days": 42
      },
      {
        "port": "Rotterdam",
        "country": "Netherlands (Holland)",
        "days": 37
      },
      {
        "port": "Tauranga",
        "country": "New Zealand",
        "days": 20
      },
      {
        "port": "Auckland",
        "country": "New Zeland",
        "days": 28
      },
      {
        "port": "Salalah",
        "country": "Oman",
        "days": 17
      },
      {
        "port": "Sohar",
        "country": "Oman",
        "days": 38
      },
      {
        "port": "Karachi",
        "country": "Pakistan",
        "days": 14
      },
      {
        "port": "Asuncion",
        "country": "Paraguay",
        "days": 77
      },
      {
        "port": "Callao",
        "country": "Peru",
        "days": 51
      },
      {
        "port": "Gdynia",
        "country": "Poland",
        "days": 48
      },
      {
        "port": "Lisbon",
        "country": "Portugal",
        "days": 30
      },
      {
        "port": "Sines",
        "country": "Portugal",
        "days": 39
      },
      {
        "port": "Dohar",
        "country": "Qatar",
        "days": 15
      },
      {
        "port": "Hamad",
        "country": "Qatar",
        "days": 15
      },
      {
        "port": "Hammad",
        "country": "Qatar",
        "days": 22
      },
      {
        "port": "Constanca",
        "country": "Romania",
        "days": 56
      },
      {
        "port": "Constanta",
        "country": "Romania",
        "days": 44
      },
      {
        "port": "Novorossiysk",
        "country": "Russia",
        "days": 48
      },
      {
        "port": "Saint Petersburg",
        "country": "Russia",
        "days": 45
      },
      {
        "port": "Vladivostok",
        "country": "Russia",
        "days": 18
      },
      {
        "port": "Dammam",
        "country": "Saudi Arabia (KSA)",
        "days": 18
      },
      {
        "port": "King Abdullah",
        "country": "Saudi Arabia (KSA)",
        "days": 43
      },
      {
        "port": "Riyadh",
        "country": "Saudi Arabia (KSA)",
        "days": 36
      },
      {
        "port": "Jeddah",
        "country": "Saudi Arabia",
        "days": 25
      },
      {
        "port": "Dakar",
        "country": "Senegal",
        "days": 35
      },
      {
        "port": "Durban",
        "country": "South Africa",
        "days": 35
      },
      {
        "port": "Barcelona",
        "country": "Spain",
        "days": 37
      },
      {
        "port": "Valencia",
        "country": "Spain",
        "days": 55
      },
      {
        "port": "Latakia",
        "country": "Syria",
        "days": 55
      },
      {
        "port": "Keelung",
        "country": "Taiwan",
        "days": 14
      },
      {
        "port": "Rades",
        "country": "Tunis",
        "days": 65
      },
      {
        "port": "Ambarli",
        "country": "Turkey",
        "days": 50
      },
      {
        "port": "Iskenderum",
        "country": "Turkey",
        "days": 42
      },
      {
        "port": "Istanbul",
        "country": "Turkey",
        "days": 35
      },
      {
        "port": "Izmir",
        "country": "Turkey",
        "days": 42
      },
      {
        "port": "Mersin",
        "country": "Turkey",
        "days": 35
      },
      {
        "port": "Port of Long Beach (USA)",
        "country": "USA",
        "days": 41
      },
      {
        "port": "Fujairah",
        "country": "United Arab Emirates (UAE)",
        "days": 20
      },
      {
        "port": "Jebel Ali",
        "country": "United Arab Emirates (UAE)",
        "days": 14
      },
      {
        "port": "Felixstowe",
        "country": "United Kingdom (UK)",
        "days": 39
      },
      {
        "port": "Glasgow",
        "country": "United Kingdom (UK)",
        "days": 39
      },
      {
        "port": "London",
        "country": "United Kingdom (UK)",
        "days": 43
      },
      {
        "port": "Manchester",
        "country": "United Kingdom (UK)",
        "days": 48
      },
      {
        "port": "Southampton",
        "country": "United Kingdom (UK)",
        "days": 34
      },
      {
        "port": "Houston",
        "country": "United States (USA)",
        "days": 52
      },
      {
        "port": "Jacksonville",
        "country": "United States (USA)",
        "days": 57
      },
      {
        "port": "New Orleans",
        "country": "United States (USA)",
        "days": 83
      },
      {
        "port": "New York",
        "country": "United States (USA)",
        "days": 40
      },
      {
        "port": "Norfolk",
        "country": "United States (USA)",
        "days": 42
      },
      {
        "port": "Savanah USA",
        "country": "United States (USA)",
        "days": 56
      },
      {
        "port": "Tacoma",
        "country": "United States (USA)",
        "days": 45
      },
      {
        "port": "Tanpa Bay",
        "country": "United States (USA)",
        "days": 57
      },
      {
        "port": "Aden",
        "country": "Yemen",
        "days": 33
      },
      {
        "port": "Hodeidah",
        "country": "Yemen",
        "days": 25
      }
    ],
    "packaging": {
      "usd_rate": 16000,
      "boxes": [
        {
          "id": "inner-bf4e65",
          "kind": "inner",
          "label": "Inner box 110x110x110 mm, duplex 310 gsm",
          "dims": "110x110x110 mm",
          "spec": "E flute, CMYK (4 colors), opp glossy",
          "tiers": [
            {
              "qty": 2000,
              "price": 2950
            },
            {
              "qty": 10000,
              "price": 1950
            }
          ]
        },
        {
          "id": "inner-b7cf58",
          "kind": "inner",
          "label": "Inner box 110x110x110 mm, duplex 250 gsm",
          "dims": "110x110x110 mm",
          "spec": "E flute, CMYK (4 colors), opp glossy",
          "tiers": [
            {
              "qty": 18750,
              "price": 1825
            }
          ]
        },
        {
          "id": "master-0582d9",
          "kind": "master",
          "label": "Master carton Cube 25, 217x164x415 mm",
          "dims": "217x164x415 mm",
          "spec": "Single wall (3 layers), K150/M125/K150, 1 color",
          "tiers": [
            {
              "qty": 200,
              "price": 6300
            },
            {
              "qty": 2140,
              "price": 6200
            }
          ]
        },
        {
          "id": "master-5b8daf",
          "kind": "master",
          "label": "Master carton Cube 26, 230x233x565 mm",
          "dims": "230x233x565 mm",
          "spec": "Single wall (3 layers), Duplex 310 gsm B flute, 3 colors",
          "tiers": [
            {
              "qty": 940,
              "price": 19000
            }
          ]
        },
        {
          "id": "master-425e7b",
          "kind": "master",
          "label": "Master carton Cube 26, 225x115x560 mm",
          "dims": "225x115x560 mm",
          "spec": "Single wall (3 layers), K150/M125/K150, 2 colors",
          "tiers": [
            {
              "qty": 1940,
              "price": 5900
            }
          ]
        }
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
