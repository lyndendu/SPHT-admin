# SPHT Admin Workspace

This repository contains the administration frontend workspace for the SPHT system.

## Structure

- `apps/admin` — complete Next.js admin dashboard application.
- `packages/ui` — reusable shadcn UI primitives.
- `packages/hooks` — reusable responsive React hooks.
- `packages/utils` — shared TypeScript utilities.
- `packages/typescript-config` — shared TypeScript configuration.
- `packages/biome-config` — shared Biome defaults.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## Upstream attribution

The initial admin interface is based on `arhamkhnz/next-shadcn-admin-dashboard`, imported from commit `4727cc7533d46e44b401cac34a38da8566ae9677`. The upstream MIT license is preserved at `apps/admin/LICENSE`.
