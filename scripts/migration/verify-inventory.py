#!/usr/bin/env python3
from __future__ import annotations

import os
from pathlib import Path

inventory_path = Path("/tmp/upstream-files.zlist")
if not inventory_path.exists():
    raise SystemExit("Missing upstream inventory: /tmp/upstream-files.zlist")

upstream_paths = [
    item.decode()
    for item in inventory_path.read_bytes().split(b"\0")
    if item
]

missing: list[tuple[str, str]] = []
for upstream_path in upstream_paths:
    if upstream_path.startswith("src/components/ui/"):
        expected_path = "packages/ui/src/" + upstream_path.removeprefix("src/components/ui/")
    elif upstream_path.startswith("src/hooks/"):
        expected_path = "packages/hooks/src/" + upstream_path.removeprefix("src/hooks/")
    elif upstream_path == "src/lib/utils.ts":
        expected_path = "packages/utils/src/index.ts"
    else:
        expected_path = "apps/admin/" + upstream_path

    if not os.path.lexists(expected_path):
        missing.append((upstream_path, expected_path))

if missing:
    for source_path, expected_path in missing:
        print(f"MISSING: {source_path} -> {expected_path}")
    raise SystemExit(f"{len(missing)} upstream files are missing")

for package_path in ("packages/ui/src", "packages/hooks/src", "packages/utils/src"):
    for file_path in Path(package_path).rglob("*"):
        if file_path.suffix not in {".ts", ".tsx", ".js", ".jsx"}:
            continue
        content = file_path.read_text()
        if '"@/' in content or "'@/" in content or "apps/admin" in content:
            raise SystemExit(f"Shared package has an application dependency: {file_path}")

print(f"Inventory verified: {len(upstream_paths)} upstream files are represented in the workspace.")
