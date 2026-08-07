#!/usr/bin/env python3
"""Refresh the promoted Small Town Capital market site throughout the day.

This script is read-only with respect to brokers/accounts. It only refreshes
public/static website data from approved STC research lanes and Polygon-backed
packets, then optionally rebuilds the Astro static output.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[1]
SKETCH = REPO / "sketches" / "2026-08-03-stc-product-redesign"
COMMAND_CENTER = Path("/root/kingbeemo-command-center")
DEFAULT_ENV = COMMAND_CENTER / ".env"
PUBLIC_DATA = REPO / "public" / "data"
RECEIPTS = REPO / "artifacts" / "site-refresh"

RULES: dict[str, Any] = {
    "contract": "stc.public-site-intraday-refresh-rules",
    "version": 1,
    "safety": {
        "broker_actions": False,
        "orders": False,
        "account_mutation": False,
        "public_claims": "source-labeled_or_observation_only",
        "market_data_provider": "Polygon paid API when available",
    },
    "lanes": {
        "market": {
            "cadence": "every_5_minutes_regular_hours",
            "job": "refresh market_packet, internals, trust, and catalyst tape",
            "tool": "sketch tools/refresh_market_site.py",
            "public_path": "/data/market_packet.json",
        },
        "options": {
            "cadence": "every_30_minutes_regular_hours",
            "job": "refresh read-only options chain summaries and LEAP candidates",
            "tool": "sketch tools/build_options_universe.py",
            "public_path": "/data/options_summary.json",
        },
        "ticker": {
            "cadence": "hourly_regular_hours",
            "job": "refresh ticker dossiers, SEC/company profile receipts where available",
            "tool": "sketch tools/build_ticker_universe.py",
            "public_path": "/data/tickers/*.json",
        },
        "shadowfax": {
            "cadence": "copy_after_command_center_refresh_or_each_site_cycle",
            "job": "publish underfollowed/convexity candidate outputs from Command Center",
            "source": "/root/kingbeemo-command-center/data/outputs/shadowfax-*.json",
            "public_path": "/data/stc-engine/shadowfax/",
        },
        "estel": {
            "cadence": "copy_after_command_center_refresh_or_each_site_cycle",
            "job": "publish company-story/source/vibe outputs from Command Center",
            "source": "/root/kingbeemo-command-center/data/outputs/estel-*.json",
            "public_path": "/data/stc-engine/estel/",
        },
        "pytorch": {
            "cadence": "copy_after_command_center_refresh_or_each_site_cycle",
            "job": "publish feature-vector/model-smoke outputs without trade execution authority",
            "source": "/root/kingbeemo-command-center/data/outputs/pytorch-*.json",
            "public_path": "/data/stc-engine/pytorch/",
        },
        "supabase": {
            "cadence": "copy_after_command_center_refresh_or_each_site_cycle",
            "job": "publish Supabase readonly health/candidate preview receipts",
            "source": "/root/kingbeemo-command-center/data/outputs/supabase-*.json",
            "public_path": "/data/stc-engine/supabase/",
        },
    },
}


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def run(cmd: list[str], cwd: Path, timeout: int, *, dry_run: bool = False) -> dict[str, Any]:
    if dry_run:
        return {"cmd": cmd, "cwd": str(cwd), "status": "dry_run", "exit_code": 0, "duration_ms": 0}
    started = time.monotonic()
    proc = subprocess.run(
        cmd,
        cwd=cwd,
        stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        timeout=timeout,
        check=False,
        env=os.environ.copy(),
    )
    return {
        "cmd": cmd,
        "cwd": str(cwd),
        "status": "ok" if proc.returncode == 0 else "failed",
        "exit_code": proc.returncode,
        "duration_ms": round((time.monotonic() - started) * 1000),
        "stdout_tail": proc.stdout[-2000:],
        "stderr_tail": proc.stderr[-2000:],
    }


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    tmp.replace(path)


def copy_matching(pattern: str, destination: Path, limit: int = 250) -> dict[str, Any]:
    destination.mkdir(parents=True, exist_ok=True)
    files = sorted(COMMAND_CENTER.glob(pattern), key=lambda p: p.stat().st_mtime, reverse=True)[:limit]
    copied: list[str] = []
    for src in files:
        if not src.is_file() or src.suffix.lower() not in {".json", ".md"}:
            continue
        target = destination / src.name
        shutil.copy2(src, target)
        copied.append(str(target.relative_to(REPO / "public")))
    return {"pattern": str(COMMAND_CENTER / pattern), "destination": str(destination), "copied": len(copied), "files": copied[:25]}


def copy_engine_outputs() -> dict[str, Any]:
    root = PUBLIC_DATA / "stc-engine"
    receipts = {
        "shadowfax": copy_matching("data/outputs/shadowfax-*.json", root / "shadowfax"),
        "estel": copy_matching("data/outputs/estel-*.json", root / "estel"),
        "pytorch": copy_matching("data/outputs/pytorch-*.json", root / "pytorch"),
        "supabase": copy_matching("data/outputs/supabase-*.json", root / "supabase"),
    }
    manifest = {"generated_at": utc_now(), "rules": RULES, "lanes": receipts}
    write_json(root / "manifest.json", manifest)
    write_json(PUBLIC_DATA / "site_refresh_rules.json", RULES)
    return receipts


def lane_commands(mode: str, env_file: Path) -> list[tuple[str, list[str], Path, int]]:
    py = sys.executable
    lanes: list[tuple[str, list[str], Path, int]] = []
    if mode in {"market", "all"}:
        lanes.append(("market", [py, str(SKETCH / "tools" / "refresh_market_site.py"), "--env-file", str(env_file), "--output-dir", str(PUBLIC_DATA)], SKETCH, 300))
    if mode in {"options", "all"}:
        lanes.append(("options", [py, str(SKETCH / "tools" / "build_options_universe.py"), "--env-file", str(env_file), "--output-dir", str(PUBLIC_DATA)], SKETCH, 900))
    if mode in {"ticker", "all"}:
        lanes.append(("ticker", [py, str(SKETCH / "tools" / "build_ticker_universe.py"), "--env-file", str(env_file), "--output-dir", str(PUBLIC_DATA)], SKETCH, 900))
    return lanes


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["market", "options", "ticker", "engine", "all"], help="refresh lane")
    parser.add_argument("--env-file", type=Path, default=DEFAULT_ENV)
    parser.add_argument("--build", action="store_true", help="run npm build after a successful refresh")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    receipt: dict[str, Any] = {
        "contract": "stc.public-site-intraday-refresh-receipt",
        "generated_at": utc_now(),
        "mode": args.mode,
        "safety": RULES["safety"],
        "lanes": [],
        "engine_outputs": None,
        "build": None,
    }

    if args.mode != "engine" and not args.env_file.is_file():
        receipt["ok"] = False
        receipt["error"] = "env_file_missing"
        write_json(RECEIPTS / "latest.json", receipt)
        print(json.dumps(receipt, separators=(",", ":")))
        return 78

    ok = True
    if args.mode != "engine":
        for name, cmd, cwd, timeout in lane_commands(args.mode, args.env_file):
            lane = run(cmd, cwd, timeout, dry_run=args.dry_run)
            lane["lane"] = name
            receipt["lanes"].append(lane)
            if lane["status"] not in {"ok", "dry_run"}:
                ok = False
                break

    if ok and args.mode in {"engine", "all", "market", "options", "ticker"}:
        receipt["engine_outputs"] = copy_engine_outputs() if not args.dry_run else {"status": "dry_run"}

    if ok and args.build:
        receipt["build"] = run(["npm", "run", "build"], REPO, 600, dry_run=args.dry_run)
        ok = receipt["build"]["status"] in {"ok", "dry_run"}

    receipt["ok"] = ok
    write_json(RECEIPTS / "latest.json", receipt)
    stamped = RECEIPTS / f"site-refresh-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}.json"
    write_json(stamped, receipt)
    print(json.dumps({"ok": ok, "mode": args.mode, "receipt": str(stamped), "generated_at": receipt["generated_at"]}, separators=(",", ":")))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
