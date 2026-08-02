# SPHT Admin Monorepo Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the complete upstream Next.js admin dashboard while relocating it to `apps/admin` and extracting reusable code into workspace packages.

**Architecture:** Build a pnpm/Turborepo monorepo. Import the upstream Git tree without reconstructing files, nest that tree under `apps/admin`, then extract only app-independent UI primitives, hooks, and utilities to packages with explicit package exports.

**Tech Stack:** Next.js 16, React, TypeScript, Tailwind CSS 4, shadcn/ui, pnpm workspaces, Turborepo, Biome.

## Global Constraints

- Preserve every upstream file and screen.
- Source snapshot: `4727cc7533d46e44b401cac34a38da8566ae9677`.
- Do not move route-specific, server-specific, dashboard-data, navigation, authentication, or global-style code into shared packages.
- Keep the upstream MIT license and attribution.
- Packages must not import from `apps/admin`.

---

### Task 1: Import the upstream snapshot

**Files:**
- Create: complete upstream tree under temporary migration branch
- Verify: upstream root files and `src/**`

- [ ] Create a migration branch from the target repository's initial commit.
- [ ] Import the upstream root tree as a Git subtree without manually recreating files.
- [ ] Compare the imported snapshot to upstream commit `4727cc7`.
- [ ] Commit with `chore: import upstream admin dashboard`.

### Task 2: Wrap the application in the monorepo

**Files:**
- Move: complete imported tree to `apps/admin/**`
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.npmrc`
- Modify: `apps/admin/package.json`
- Modify: `apps/admin/tsconfig.json`
- Modify: `apps/admin/next.config.mjs`

- [ ] Nest the complete upstream tree under `apps/admin` using its Git tree SHA.
- [ ] Add root workspace scripts: `dev`, `build`, `typecheck`, `lint`, `format`.
- [ ] Configure pnpm workspace packages as `apps/*` and `packages/*`.
- [ ] Configure Turborepo task dependencies and build outputs.
- [ ] Preserve application-local static assets, Next.js configuration, scripts, and metadata.
- [ ] Commit with `refactor: move admin dashboard into apps workspace`.

### Task 3: Extract shared packages

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/hooks/package.json`
- Create: `packages/utils/package.json`
- Create: `packages/typescript-config/**`
- Create: `packages/biome-config/**`
- Move: reusable files from `apps/admin/src/components/ui/**` to `packages/ui/src/**`
- Move: app-independent files from `apps/admin/src/hooks/**` to `packages/hooks/src/**`
- Move: app-independent files from `apps/admin/src/lib/**` to `packages/utils/src/**`
- Modify: all affected imports in `apps/admin/src/**`

- [ ] Classify each candidate by checking that it has no dependency on routes, admin state, server code, navigation, dashboard data, or app global CSS.
- [ ] Move safe UI primitives and add an `@spht/ui` export map.
- [ ] Move safe hooks and add an `@spht/hooks` export map.
- [ ] Move safe utilities and add an `@spht/utils` export map.
- [ ] Keep unsafe or app-specific files in `apps/admin` and document why.
- [ ] Replace aliases with package imports and prevent reverse dependencies.
- [ ] Commit with `refactor: extract reusable workspace packages`.

### Task 4: Preserve tooling and attribution

**Files:**
- Create or modify: root `README.md`
- Preserve: `apps/admin/LICENSE`
- Modify: root `.gitignore`
- Modify: Husky/Biome configuration as required for workspace paths

- [ ] Document workspace commands and directory responsibilities.
- [ ] Credit the upstream repository and source commit.
- [ ] Ensure hooks execute from the repository root.
- [ ] Commit with `docs: document SPHT admin workspace`.

### Task 5: Verify the migration

**Tests:**
- File inventory comparison
- Workspace dependency installation
- Biome check
- TypeScript check
- Next.js production build

- [ ] Run `pnpm install --frozen-lockfile` after generating the workspace lockfile.
- [ ] Run `pnpm lint` and fix all migration-caused findings.
- [ ] Run `pnpm typecheck` and fix package-boundary/type-resolution errors.
- [ ] Run `pnpm build` and fix Next.js workspace/transpilation issues.
- [ ] Compare upstream paths against `apps/admin` plus documented relocated package paths.
- [ ] Record exact command results in the pull request description.
- [ ] Commit with `test: verify monorepo migration` if verification requires tracked changes.
