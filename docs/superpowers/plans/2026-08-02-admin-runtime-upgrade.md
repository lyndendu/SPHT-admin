# SPHT Admin Runtime Upgrade Plan

**Goal:** Align `SPHT-admin` with the verified `SPHT-web` runtime by upgrading Node.js 22 to Node.js 24 and pnpm 10.14.0 to pnpm 11.7.0 without changing application dependencies, routes, UI components, or business behavior.

## Changes

- Set root `packageManager` to `pnpm@11.7.0`.
- Add root Node.js engine requirement `>=24`.
- Run GitHub Actions on Node.js 24.
- Activate pnpm 11.7.0 through Corepack.
- Keep frozen-lockfile installation and the existing typecheck, build, and Biome checks.
- Update README runtime requirements and commands.
- Regenerate the lockfile only if pnpm 11.7.0 changes it.

## Exclusions

- No application dependency upgrades.
- No Next.js, React, Tailwind, Zod, Biome, or TypeScript version changes.
- No route, component, styling, or business-logic changes.
- No package restructuring.

## Verification

```bash
corepack enable
corepack prepare pnpm@11.7.0 --activate
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm --filter @spht/admin check
```

The upgrade is merged only after the permanent pull-request CI passes on Node.js 24 and pnpm 11.7.0.
