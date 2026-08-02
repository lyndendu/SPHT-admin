# SPHT Admin Workspace

This repository contains the administration frontend workspace for the SPHT system.

## Structure

- `apps/admin` — complete Next.js admin dashboard application.
- `packages/ui` — reusable shadcn UI primitives.
- `packages/hooks` — reusable responsive React hooks.
- `packages/utils` — shared TypeScript utilities.
- `packages/typescript-config` — shared TypeScript configuration.
- `packages/biome-config` — shared Biome defaults.

## Requirements

- Node.js 24 or newer
- pnpm 11.7.0

Enable the repository package manager with Corepack:

```bash
corepack enable
corepack prepare pnpm@11.7.0 --activate
```

## Commands

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm --filter @spht/admin check
```

Pull requests run frozen-lockfile dependency installation, TypeScript checks, a production Next.js build, and Biome checks on Node.js 24 with pnpm 11.7.0.

## Upstream attribution

The initial admin interface is based on `arhamkhnz/next-shadcn-admin-dashboard`, imported from commit `4727cc7533d46e44b401cac34a38da8566ae9677`. The upstream MIT license is preserved at `apps/admin/LICENSE`.
