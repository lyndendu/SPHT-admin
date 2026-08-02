# SPHT Admin Runtime Verification

The merged Admin runtime is verified through the permanent repository CI with Node.js 24 and pnpm 11.7.0.

```bash
corepack enable
corepack prepare pnpm@11.7.0 --activate
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm --filter @spht/admin check
```

The runtime upgrade does not change application dependencies, routes, UI components, styles, or business behavior.
