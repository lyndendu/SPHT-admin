# SPHT Admin Monorepo Migration Design

## Goal

Import the complete `arhamkhnz/next-shadcn-admin-dashboard` repository into `lyndendu/SPHT-admin`, preserve every existing source file and screen, and reorganize it as the admin application of an extensible SPHT monorepo.

## Approved structure

```text
SPHT-admin/
├── apps/
│   └── admin/                 # complete upstream Next.js admin dashboard
├── packages/
│   ├── ui/                    # reusable shadcn UI primitives
│   ├── hooks/                 # framework-safe reusable React hooks
│   ├── utils/                 # reusable TypeScript utilities
│   ├── typescript-config/     # shared TypeScript bases
│   └── biome-config/          # shared Biome policy
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Migration rules

1. Use upstream `main` commit `4727cc7533d46e44b401cac34a38da8566ae9677` as the source snapshot.
2. Preserve the upstream project in full under `apps/admin`; do not delete pages, assets, examples, scripts, documentation, or configuration merely because they are not immediately needed by SPHT.
3. Move only genuinely reusable, app-independent code into `packages`; route-specific pages, navigation, authentication screens, dashboard data, server code, and global application styles remain in `apps/admin`.
4. Maintain import compatibility through package exports and TypeScript path aliases. The admin application must render the same routes and behavior after migration.
5. Use pnpm workspaces and Turborepo at the repository root. Keep Next.js application commands available through root scripts.
6. Preserve the upstream MIT license and attribution.

## Package boundaries

- `@spht/ui`: shadcn primitives and generic visual components that do not own SPHT business state.
- `@spht/hooks`: generic client hooks with no route-specific or admin-only dependency.
- `@spht/utils`: generic functions such as class-name merging and formatting helpers.
- `@spht/typescript-config`: reusable TypeScript compiler bases.
- `@spht/biome-config`: repository-wide formatting and linting settings.

## Dependency direction

```text
apps/admin -> @spht/ui
apps/admin -> @spht/hooks
apps/admin -> @spht/utils
packages/ui -> @spht/utils
packages/* -X-> apps/admin
```

Packages must never import from `apps/admin`. Application-specific components may consume shared packages.

## Validation

The migration is complete only when dependency installation, Biome checks, TypeScript checking, and the production Next.js build run successfully from the repository root. A file inventory comparison must also confirm that every upstream path exists under `apps/admin`, except paths deliberately relocated into documented shared packages.
