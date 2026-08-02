#!/usr/bin/env bash
set -euo pipefail

SOURCE_REPOSITORY="${SOURCE_REPOSITORY:-arhamkhnz/next-shadcn-admin-dashboard}"
SOURCE_COMMIT="${SOURCE_COMMIT:-4727cc7533d46e44b401cac34a38da8566ae9677}"
UPSTREAM_DIR="${UPSTREAM_DIR:-/tmp/upstream-admin}"

rm -rf "$UPSTREAM_DIR"
git clone "https://github.com/${SOURCE_REPOSITORY}.git" "$UPSTREAM_DIR"
git -C "$UPSTREAM_DIR" checkout --detach "$SOURCE_COMMIT"
test "$(git -C "$UPSTREAM_DIR" rev-parse HEAD)" = "$SOURCE_COMMIT"
git -C "$UPSTREAM_DIR" ls-files -z > /tmp/upstream-files.zlist

rm -rf apps packages
mkdir -p apps/admin packages
cp -a "$UPSTREAM_DIR"/. apps/admin/
rm -rf apps/admin/.git

shopt -s dotglob nullglob
mkdir -p packages/ui/src packages/hooks/src packages/utils/src

mv apps/admin/src/components/ui/* packages/ui/src/
rmdir apps/admin/src/components/ui

mv apps/admin/src/hooks/* packages/hooks/src/
rmdir apps/admin/src/hooks

mv apps/admin/src/lib/utils.ts packages/utils/src/index.ts

node scripts/migration/configure-workspace.mjs
python3 scripts/migration/verify-inventory.py
