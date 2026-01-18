# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Queirolo Autos Website** - Modern, mobile-first Next.js website for a Chilean automotive dealership specializing in semi-used 4x4 vehicles, financing, vehicle purchase (including those with debt), and consignment services.

**Current Status**: Active development. Frontend complete with Sanity CMS integration. Pending: real vehicle data population, backend integration for forms, final deployment configuration.

**Tech Stack**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Sanity CMS, Zustand, Framer Motion

## Development Commands

All commands are defined in `package.json`:

```bash
# Start development server (includes Sanity Studio at /studio)
npm run dev
# Access at http://localhost:3000
# Sanity Studio at http://localhost:3000/studio

# Build for production
npm run build

# Start production server (after build)
npm run start

# Run linter
npm run lint
```

**Note**: No test framework is currently configured.

## Project Architecture

### Tech Stack Details

**Frontend**:
- Next.js 14 (App Router) with React 18
- TypeScript for type safety
- Tailwind CSS + shadcn/ui (Radix components)
- Heroicons for icons
- Framer Motion for animations

**State Management**:
- Zustand (favorites and vehicle comparison)

**CMS**:
- Sanity.io with embedded Studio at `/studio`
- `next-sanity` for data fetching
- `@sanity/image-url` for image optimization
- Vision plugin for GROQ query testing

**Analytics** (optional):
- Google Analytics 4 (when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set)

### Directory Structure

```
app/                     # Next.js App Router
  page.tsx               # Home
  vehiculos/             # Vehicle listing and detail pages
    page.tsx             # Listing with filters
    [slug]/page.tsx      # Individual vehicle detail
  servicios/page.tsx     # Services (tabs: financing/consignment/contact)
  nosotros/page.tsx      # About page
  contacto/page.tsx      # Contact page with embedded map
  studio/[[...tool]]/    # Sanity Studio (embedded)
  sitemap.ts             # Dynamic sitemap
  robots.ts              # Robots.txt
  layout.tsx             # Root layout
  globals.css            # Global styles

components/              # Reusable UI components
  layout/                # Header, Footer, WhatsAppButton
  forms/                 # FinancingForm, ConsignmentForm, ContactForm
  vehicles/              # VehicleCard, VehicleGallery, CompareBar, etc.
  ui/                    # shadcn/ui components (Button, Dialog, etc.)

lib/                     # Utilities and data fetching
  vehicles.ts            # Sanity queries for vehicles (with mock fallback)
  data.ts                # Mock vehicle data
  calculations.ts        # Loan calculator logic
  seo.ts                 # SEO helpers and JSON-LD
  sanity.ts              # Sanity client configuration
  types.ts               # TypeScript interfaces

sanity/                  # Sanity CMS configuration
  env.ts                 # Environment variables
  lib/client.ts          # Sanity client
  lib/image.ts           # Image URL builder
  schemaTypes/           # Schema definitions
    vehicle.ts           # Vehicle schema
    index.ts             # Schema exports
  structure.ts           # Studio structure

store/                   # Zustand state stores
  useFavorites.ts        # Favorites persistence (localStorage)
  useCompare.ts          # Vehicle comparison state

public/                  # Static assets
  images/                # Logo, placeholders
  manifest.json          # PWA manifest

claudedocs/              # Internal documentation and roadmaps
  00-Analysis-Planning/  # Analysis and design proposals
  03-Phase3-Enhancement/ # Phase 3 implementation notes
  04-Phase4-Optimization/# Phase 4 implementation notes
  05-Phase5-LaunchPreparation/ # Phase 5 deployment guides

config.ts                # Business configuration (hours, contact, etc.)
```

### Routes

**Public Routes**:
- `/` - Homepage with hero, featured vehicles, services
- `/vehiculos` - Vehicle catalog with filters (brand, price, year, km, transmission, fuel)
- `/vehiculos/[slug]` - Vehicle detail page with gallery, specs, calculator
- `/servicios` - Services page with tabs (financing, consignment, purchase)
- `/nosotros` - About page (company history, team)
- `/contacto` - Contact page with embedded Google Maps iframe
- `/studio` - Sanity Studio (CMS admin interface)

**Generated Routes**:
- `/sitemap.xml` - Dynamic sitemap (currently uses mock data)
- `/robots.txt` - Robots configuration

### Business Context

**Company**: Queirolo Autos 
**Location**: Av. Las Condes 12461, Local 4A, Las Condes, Santiago - Chile  
**Business Model**: Vehicle sales, financing, vehicle purchase (including debt), consignment

**Operating Hours**:
- Monday-Friday: 09:30 - 18:00
- Saturday: By appointment

**Contact Channels**:
- Primary: WhatsApp (+56 9) 7214-9979
- Phone: (+56 2) 4367-0362
- Instagram: Active presence

### Key Features (Implemented)

1. **Vehicle Catalog** (`/vehiculos`)
   - Dynamic filtering (brand, price, year, km, transmission, fuel)
   - Filter state synced to URL query parameters
   - Grid layout with responsive design
   - "RECIÉN LLEGADO" badges for new arrivals
   - Fallback to mock data if Sanity not configured

2. **Vehicle Detail Pages** (`/vehiculos/[slug]`)
   - Image gallery with lightbox and zoom
   - Tabbed interface (specifications, features)
   - Real-time loan calculator
   - WhatsApp contact integration
   - SEO metadata and JSON-LD structured data

3. **Vehicle Comparison Tool**
   - Compare up to 3 vehicles side-by-side
   - Persistent comparison bar (fixed bottom)
   - Modal with detailed comparison table
   - State managed via Zustand

4. **Favorites System**
   - Heart icon on vehicle cards
   - Persisted in localStorage
   - Managed via Zustand store

5. **Loan Calculator**
   - Real-time monthly payment calculation
   - Configurable: vehicle price, down payment, installments
   - Formula: `cuotaMensual = montoFinanciar * (tasaMensual * (1 + tasaMensual)^cuotas) / ((1 + tasaMensual)^cuotas - 1)`
   - Default interest rate: 12% annual

6. **Forms** (currently simulated)
   - Financing form
   - Consignment form
   - Contact form
   - Client-side validation
   - **Pending**: Backend integration for actual submission

7. **SEO & PWA**
   - Dynamic metadata per page
   - JSON-LD structured data for vehicles
   - Sitemap and robots.txt
   - PWA manifest
   - Cache headers configured in `next.config.js`

8. **Analytics** (optional)
   - Google Analytics 4 integration
   - Event tracking helpers available (not fully wired in UI)

9. **Floating WhatsApp Button**
   - Omnipresent on all pages
   - Direct link to business WhatsApp

## Sanity CMS Integration

### Environment Variables

Required for Sanity Studio and real data:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

Optional:
```env
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-16
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Critical Notes**:
- `NEXT_PUBLIC_*` variables are embedded at **build time**. Changing them requires a rebuild.
- Do **not** use quotes around values in `.env.local` (some VPS environments fail with quotes).
- If env vars are missing, the app falls back to `mockVehicles` from `lib/data.ts`.

### Running Sanity Studio

1. Ensure env vars are set in `.env.local`
2. Run `npm run dev`
3. Navigate to `http://localhost:3000/studio`
4. Log in with your Sanity account

### Creating and Publishing Vehicles

1. In Studio, go to **Vehiculos** (Vehicles)
2. Click **Create** and select `vehicle` document type
3. Fill required fields:
   - Name, slug (must be unique)
   - Brand, model, year
   - Price, mileage
   - Transmission, fuel type
   - Images (upload via Sanity asset manager)
   - Features (comfort, safety, entertainment, other)
4. Click **Publish** (drafts are not visible on frontend)

### Data Fetching

**How it works**:
- `lib/vehicles.ts` contains `getVehicles()` and `getVehicleBySlug()`
- Queries use GROQ: `*[_type == "vehicle"]`
- Results are mapped to `Vehicle` interface
- Images are fetched as `images[].asset->url` (from `cdn.sanity.io`)
- If `projectId` is missing or fetch fails, falls back to `mockVehicles`

**Revalidation**:
- Data is revalidated every 60 seconds (ISR)
- Configured via `{ next: { revalidate: 60 } }` in fetch options

**Image Handling**:
- Images are served from `cdn.sanity.io`
- `next.config.js` includes `cdn.sanity.io` in `remotePatterns`
- Placeholder SVG used if no images available

## Deployment Notes

### Build-Time Considerations

- `NEXT_PUBLIC_*` env vars are resolved at **build time**
- If deploying via Docker or VPS, ensure env vars are set **before** `npm run build`
- Changing env vars in production requires a rebuild

### Sanity CORS Configuration

- Add your production domain to Sanity CORS origins
- Go to `manage.sanity.io` → Your Project → API → CORS Origins
- Add your domain (e.g., `https://queirolo.cl`)

### Image Optimization

- Next.js Image component requires `cdn.sanity.io` in `next.config.js` (already configured)
- Verify images are published in Sanity and URLs resolve to `cdn.sanity.io`
- If using mock data in production, ensure `public/images/vehicles/*` exists or images will fail

### Common Pitfalls

1. **Mock data in production**: Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are set without quotes, then rebuild.
2. **Images not loading**: Check that vehicles have published images in Sanity and `cdn.sanity.io` is in `next.config.js`.
3. **Studio not loading**: Ensure env vars are set and you're logged into Sanity.
4. **Sitemap shows mock data**: `app/sitemap.ts` currently uses `mockVehicles`; update to fetch from Sanity for production.
5. **Forms don't submit**: Forms currently simulate submission; backend integration required for production.

### Hosting Recommendations

- **Vercel** (recommended for Next.js, automatic deployments)
- **Netlify** (alternative with similar features)
- **VPS/Docker** (requires manual setup, ensure env vars are set before build)

## Chilean Market Specifics

- **Currency**: Chilean Peso (CLP) - format with thousand separators: `$18.990.000`
- **Phone Format**: `+56 9 XXXX XXXX` (mobile) or `+56 2 XXXX XXXX` (landline)
- **RUT Validation**: Use Módulo 11 algorithm for Chilean ID (if collecting)
- **Language**: Spanish only (Chilean variant)

## Reference Documents

Internal documentation in `claudedocs/`:
- `00-Analysis-Planning/analisis-queirolo-cl.md` - Analysis of original website
- `00-Analysis-Planning/FRONTEND_DESIGN_PROPOSAL.md` - Design roadmap
- `03-Phase3-Enhancement/PHASE3_SUMMARY.md` - Phase 3 implementation notes
- `04-Phase4-Optimization/PHASE4_SUMMARY.md` - Phase 4 optimization notes
- `05-Phase5-LaunchPreparation/PHASE5_IMPLEMENTATION_GUIDE.md` - Launch preparation guide
- `CONFIG_README.md` - Configuration guide (actual config in `config.ts`)

## Troubleshooting

**Problem**: Seeing mock data on `/vehiculos`  
**Solution**: 
1. Check `.env.local` has `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (no quotes)
2. Rebuild: `npm run build`
3. Publish vehicles in Sanity Studio

**Problem**: Images not loading or Next.js Image errors  
**Solution**:
1. Verify images are published in Sanity
2. Check `next.config.js` includes `cdn.sanity.io` in `remotePatterns` (already configured)
3. If using mock data, ensure `public/images/vehicles/*` exists

**Problem**: Studio won't open or fails to create vehicles  
**Solution**: Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are set in `.env.local`

**Problem**: Sitemap doesn't reflect real data  
**Solution**: `app/sitemap.ts` currently uses `mockVehicles`; update to fetch from Sanity for production

**Problem**: GA4 not tracking  
**Solution**: Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local`

**Problem**: Forms don't send data  
**Solution**: Forms currently simulate submission; backend integration required for production

## Security Notes

- All form inputs should be validated server-side (currently client-side only)
- Use HTTPS for all pages (especially forms)
- Implement rate limiting on form submissions (when backend is integrated)
- No sensitive data in client-side code
- Sanity API tokens should never be exposed (use environment variables)

---

## Change Log

### What was improved and why:

- **Removed outdated "to be determined" stack references**: The tech stack is now Next.js 14 + Sanity, not a static site. Updated to reflect actual implementation.
- **Replaced static server commands with actual npm scripts**: Removed `python -m http.server` and `npx serve` commands; replaced with real `npm run dev/build/start/lint` from `package.json`.
- **Removed Docker commands**: No Docker configuration exists in the repo; removed misleading Docker examples.
- **Updated architecture section with real directory structure**: Added accurate file tree based on actual `app/`, `components/`, `lib/`, `sanity/`, `store/` structure.
- **Added real routes**: Documented actual routes (`/vehiculos`, `/vehiculos/[slug]`, `/servicios`, `/nosotros`, `/contacto`, `/studio`) verified in codebase.
- **Added Sanity CMS integration section**: Documented how to run Studio, create/publish vehicles, and how data fetching works (GROQ queries, fallback to mock data).
- **Added environment variables section**: Documented required `NEXT_PUBLIC_SANITY_*` vars, build-time embedding, and common pitfalls (quotes in env vars).
- **Added deployment notes**: Documented CORS configuration, image optimization with `cdn.sanity.io`, build-time env var resolution, and common deployment pitfalls.
- **Removed references to non-existent features**: Removed Leaflet/OpenStreetMap (current implementation uses Google Maps iframe), removed n8n webhook references (forms currently simulated).
- **Added troubleshooting section**: Practical solutions for common issues (mock data, images not loading, Studio errors, sitemap, forms).
- **Updated reference documents**: Aligned with actual `claudedocs/` structure and removed non-existent files.
- **Removed backend integration assumptions**: Clarified that forms currently simulate submission and require backend integration for production.
- **Added tech stack details**: Listed actual dependencies (Tailwind, shadcn/ui, Zustand, Framer Motion, next-sanity, etc.).
- **Clarified current status**: Changed from "planning/initial development" to "active development" with clear list of what's done vs. pending.
- **Removed generic modernization priorities**: Kept only business context and Chilean market specifics; removed redundant design recommendations already implemented.
- **Added change log**: This section documents all improvements for transparency.
