# Phase 5 VPS Fix Log (Sanity data after restart)

**Date**: 2026-01-16
**Goal**: After VPS restart, `/vehiculos` and `/vehiculos/[slug]` must load from Sanity without needing `/studio`.

## Root cause (most likely)
- In production, `lib/vehicles.ts` silently fell back to `mockVehicles` when env vars were missing or when the first Sanity fetch failed. This could mask the real issue after restart and keep the UI on local data.
- `mockVehicles` uses local image paths (`/images/vehicles/*.jpg`) that are not present in VPS containers, causing missing images and inconsistent behavior.
- The listing page fetch runs once on mount and did not retry; transient Sanity/network failures during cold start could lock the UI into fallback data.

## Changes applied (minimal and safe)
1. **Fail-fast in production** when Sanity envs are missing or fetch fails (no silent mock fallback).
2. **Retry once** on Sanity fetch in production to survive cold start/transient errors.
3. **UI error state** on `/vehiculos` when fetch fails (instead of mock data).

## Files touched
- `lib/vehicles.ts`
- `app/vehiculos/page.tsx`

## Verification checklist (VPS)
- [ ] Confirm `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are set without quotes.
- [ ] Rebuild the container (NEXT_PUBLIC_* are build-time).
- [ ] Start the app and load `/vehiculos` directly; verify real Sanity data appears.
- [ ] Open a vehicle detail `/vehiculos/[slug]` for a published slug; verify it loads.
- [ ] Check logs for `[Sanity] Sanity configured:` at startup.
- [ ] Confirm images load from `cdn.sanity.io`.

## Notes
- The UI no longer masks missing Sanity configuration in production. If Sanity is unreachable, `/vehiculos` shows a controlled error message instead of mock data.
- In development, mock data remains available for local workflows.
