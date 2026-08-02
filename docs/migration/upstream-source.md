# Upstream source snapshot

- Repository: `arhamkhnz/next-shadcn-admin-dashboard`
- Commit: `4727cc7533d46e44b401cac34a38da8566ae9677`
- Imported application path: `apps/admin`

## Relocated shared paths

| Upstream path | Workspace path |
| --- | --- |
| `src/components/ui/**` | `packages/ui/src/**` |
| `src/hooks/**` | `packages/hooks/src/**` |
| `src/lib/utils.ts` | `packages/utils/src/index.ts` |

All other tracked upstream files remain under `apps/admin`.

The migration branch is validated by the repository's pull-request CI before merge.
