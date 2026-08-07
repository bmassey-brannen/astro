#!/usr/bin/env bash
set -euo pipefail

# STC public site market-data deployment loop.
# Read-only: refreshes public market data from Polygon-backed lanes, builds Astro,
# commits only approved live-market public artifacts, and pushes to GitHub Pages.

REPO="/root/astro"
COMMAND_CENTER="/root/kingbeemo-command-center"
LOCK="/tmp/stc-site-update-and-deploy.lock"
LOG_DIR="$REPO/artifacts/site-refresh"
mkdir -p "$LOG_DIR"

exec 9>"$LOCK"
if ! flock -n 9; then
  echo "$(date -u +%FT%TZ) stc-site-deploy skipped: lock held"
  exit 0
fi

cd "$REPO"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="$LOG_DIR/deploy-$STAMP.log"

{
  echo "== STC site refresh/deploy $STAMP =="
  echo "repo=$REPO command_center=$COMMAND_CENTER"

  # Pull latest tracked repo state without touching local generated/untracked data.
  git fetch origin main --quiet || true

  # Refresh public site data and copy engine receipts. This does not touch brokers/orders.
  python3 scripts/stc_intraday_site_refresh.py market --build

  # Keep lock files local only.
  rm -f public/data/.ticker-universe.lock public/data/.options-build.lock

  # Stage only the public live-data surface and the deploy/refresh scripts.
  git add \
    public/data \
    public/assets/home-live.js \
    src/pages/index.astro \
    scripts/stc_intraday_site_refresh.py \
    scripts/stc_site_update_and_deploy.sh

  if git diff --cached --quiet; then
    echo "no staged public-data/site changes; nothing to deploy"
  else
    git commit -m "Refresh STC public market data $STAMP"
    env -u GITHUB_TOKEN git push origin main
  fi

  echo "== freshness receipts =="
  python3 - <<'PY'
from pathlib import Path
from datetime import datetime, timezone
import json
for p in [Path('public/data/market_trust.json'), Path('public/data/market_packet.json'), Path('artifacts/site-refresh/latest.json')]:
    if not p.exists():
        print(p, 'MISSING')
        continue
    st = datetime.fromtimestamp(p.stat().st_mtime, timezone.utc)
    age = (datetime.now(timezone.utc)-st).total_seconds()/60
    print(str(p), 'mtime_utc='+st.isoformat(), 'age_min='+str(round(age,2)), 'bytes='+str(p.stat().st_size))
    try:
        d=json.loads(p.read_text())
        print('  generated_at=', d.get('generated_at'), 'source=', d.get('source'), 'packet_state=', d.get('packet_state'))
    except Exception as exc:
        print('  json_error=', type(exc).__name__, exc)
PY
} 2>&1 | tee "$LOG"
