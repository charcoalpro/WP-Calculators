#!/usr/bin/env bash
# =============================================================================
# CCX — update-from-api.sh  ·  pull the latest numbers from the cPanel API and
# rebuild every block, ready to paste into WordPress.
#
#   1) fetches GET {CCX_API_URL}/config   (the connector: generator/api-adapter.js)
#   2) rewrites src/config.js
#   3) rebuilds dist/static/*.html and dist/embedded/*.html
#
# The browser never calls the API — this runs on YOUR machine at build time.
#
# USAGE:
#   export CCX_API_URL="https://id.charcoal.pro/admin/api"
#   export CCX_API_TOKEN="the-same-token-as-in-cpanel-api/public/lib/config.php"
#   ./update-from-api.sh
#
# Then paste dist/embedded/*.html into your WordPress pages (one per page).
# Requires Node 18+.
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")"

: "${CCX_API_URL:?Set CCX_API_URL, e.g. https://id.charcoal.pro/admin/api}"
: "${CCX_API_TOKEN:?Set CCX_API_TOKEN (must match the token in cpanel-api/public/lib/config.php)}"

echo "==> 1/3  Pulling config from $CCX_API_URL/config"
node generator/api-adapter.js --write

echo "==> 2/3  Rebuilding static blocks"
node generator/build-static.js

echo "==> 3/3  Rebuilding self-contained blocks"
node generator/build-embedded.js

echo ""
echo "Done. Paste the updated dist/embedded/*.html into your pages (one per page),"
echo "or dist/static/*.html if you use the shared-asset method. Then clear any cache."
