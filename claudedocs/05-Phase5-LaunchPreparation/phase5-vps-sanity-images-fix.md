# Phase 5: VPS Sanity Images Fix

**Date**: 2026-01-16
**Issue**: Images not loading in VPS, service crashes repeatedly
**Error**: `The requested resource isn't a valid image for /images/vehicles/<archivo>.jpg received null`

---

## Root Cause Analysis

### Problem 1: Fallback to non-existent local images
The vehicle mapper in `lib/vehicles.ts` had a hardcoded fallback:
```tsx
image: sanityVehicle.images?.[0] || '/images/placeholder.jpg'
```

When Sanity images were `null` or empty, the code fell back to `/images/placeholder.jpg` which doesn't exist in the Docker container, causing Next.js Image to crash.

### Problem 2: Environment variables with quotes
In EasyPanel/Hostinger VPS, env vars were set with literal quotes:
```
NEXT_PUBLIC_SANITY_PROJECT_ID="4124jngl"  // Wrong - includes quotes
```
This made the projectId check fail (`"4124jngl"` !== `4124jngl`), triggering the mockVehicles fallback which also has `/images/vehicles/*.jpg` paths.

### Problem 3: Mock data paths
`lib/data.ts` (mockVehicles) contains local image paths like:
```tsx
image: '/images/vehicles/toyota-4runner-2020.jpg'
```
These files don't exist in production container.

---

## Fixes Applied

### 1. Safe placeholder image (`lib/vehicles.ts`)
```tsx
// Before
image: sanityVehicle.images?.[0] || '/images/placeholder.jpg'

// After - uses inline SVG data URI
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,...'
image: getSafeImageUrl(safeImages)
```

### 2. Env var quote stripping (`lib/sanity.ts`)
```tsx
function cleanEnvVar(value: string | undefined): string {
    if (!value) return ''
    return value.replace(/^["']|["']$/g, '').trim()
}

export const projectId = cleanEnvVar(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
```

### 3. Null-safe image handling
```tsx
const safeImages = sanityVehicle.images?.filter((img: string) => img) || []
images: safeImages.length > 0 ? safeImages : [PLACEHOLDER_IMAGE]
```

### 4. Better logging for debugging
```tsx
console.log(`[Sanity] ${configStatus}`)  // Server-side config log
console.warn('[getVehicles] Sanity Project ID not found. Using mock data.')
```

---

## Files Modified

| File | Change |
|------|--------|
| `lib/sanity.ts` | Added `cleanEnvVar()` to strip quotes, added startup logging |
| `lib/vehicles.ts` | Added `PLACEHOLDER_IMAGE` SVG, `getSafeImageUrl()`, null-safe mapping |

---

## VPS Deployment Checklist

### 1. Fix Environment Variables (CRITICAL)
In EasyPanel/Hostinger environment settings, ensure env vars have **NO QUOTES**:

```bash
# WRONG (with quotes)
NEXT_PUBLIC_SANITY_PROJECT_ID="4124jngl"
NEXT_PUBLIC_SANITY_DATASET="production"

# CORRECT (no quotes)
NEXT_PUBLIC_SANITY_PROJECT_ID=4124jngl
NEXT_PUBLIC_SANITY_DATASET=production
```

### 2. Rebuild the Container
After fixing env vars, rebuild the Docker image:
```bash
docker build -t queirolo-web .
# or trigger rebuild in EasyPanel
```

**Important**: `NEXT_PUBLIC_*` variables are embedded at **build time**, not runtime. If you change them, you MUST rebuild.

### 3. Verify Logs
After deployment, check logs for:
```
[Sanity] Sanity configured: projectId=4124jngl, dataset=production
```

If you see:
```
[Sanity] WARNING: Sanity projectId not configured - will use mock data
```
Then the env var is still wrong.

### 4. Test
- `/vehiculos` - Should show vehicles from Sanity
- Click a vehicle - Detail page should load with Sanity images
- Images should come from `cdn.sanity.io` (check Network tab)

---

## Next.js Image Configuration

Already configured in `next.config.js`:
```js
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
}
```

---

## Troubleshooting

### Images still not loading?
1. Check browser DevTools Network tab - are requests going to `cdn.sanity.io`?
2. Check if vehicles are **published** in Sanity (not drafts)
3. Verify CORS settings in Sanity dashboard allow your domain

### Service still crashing?
1. Check container logs for the specific error
2. Verify env vars don't have quotes
3. Ensure Sanity project has at least one published vehicle

### Seeing mock data instead of Sanity?
1. Rebuild container after setting env vars
2. Check logs for `[Sanity] Sanity configured: projectId=...`
3. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set correctly

---

## Summary

| Issue | Solution |
|-------|----------|
| Invalid local image paths | Use inline SVG placeholder |
| Env vars with quotes | Strip quotes in `cleanEnvVar()` |
| Null/empty Sanity images | Filter nulls, fallback to placeholder |
| Build-time env vars | Must rebuild container after changes |
