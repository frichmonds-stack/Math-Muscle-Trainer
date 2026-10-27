#!/usr/bin/env bash
# Usage:
#   ./run-all.sh <appDir> [baselineDir]
# Runs smoke, captures screenshots to out/current (with a review sheet), and (if baselineDir
# given) pixel-compares against it. Exits non-zero if smoke fails or screenshots differ.
#   ./run-all.sh --baseline <appDir>     capture a fresh baseline into out/baseline
#   ./run-all.sh --determinism <appDir>  capture twice and compare (should be 0 diff)
#   ./run-all.sh --review <appDir>       fit check + capture + review sheet in out/review
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"
[ -d node_modules/playwright-core ] || npm install --no-audit --no-fund

case "${1:-}" in
  --baseline)
    rm -rf out/baseline && node capture.js "$2" out/baseline; exit $? ;;
  --determinism)
    rm -rf out/det-a out/det-b
    node capture.js "$2" out/det-a && node capture.js "$2" out/det-b && node compare.js out/det-a out/det-b
    exit $? ;;
  --review)
    rm -rf out/review
    node fit.js "$2" --out=out/review/fit; fit_status=$?
    node capture.js "$2" out/review || exit 1
    node sheet.js out/review --fit=out/review/fit/fit-report.json || exit 1
    exit $fit_status ;;
  ""|-h|--help)
    sed -n '2,9p' "$0"; exit 2 ;;
esac

APP="$1"; BASE="${2:-}"; status=0
node smoke.js "$APP" || status=1
rm -rf out/current && node capture.js "$APP" out/current && node sheet.js out/current || status=1
if [ -n "$BASE" ]; then
  node compare.js "$BASE" out/current --diff-dir=out/diff || status=1
fi
exit $status
