# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Queirolo Mundo 4x4 Website** - Modern, mobile-first website for a Chilean automotive dealership specializing in semi-used 4x4 vehicles, financing, vehicle purchase (including those with debt), and consignment services.

**Current Status**: Project in planning/initial development phase. Reference analysis document (`analisis-queirolo-cl.md`) contains comprehensive analysis of current website (www.queirolo.cl) including structure, features, and modernization recommendations.

**Tech Stack**: To be determined based on requirements (likely HTML/CSS/JavaScript static site or modern framework)

## Development Commands

### Local Development
```bash
# Static server for HTML/CSS/JS (if using static approach)
python -m http.server 8000
# Access at http://localhost:8000

# Alternative with Node
npx serve .
```

### Docker Development (if implemented)
```bash
# Build and run with Docker Compose
docker compose up --build

# Direct Docker build
docker build -t queirolo-web .
docker run --rm -p 8080:80 queirolo-web
```

## Project Architecture

### Business Context

**Company**: Queirolo Mundo 4x4
**Location**: Av. Las Condes 12461, Local 4A, Las Condes, Santiago - Chile
**Business Model**: Vehicle sales, financing, vehicle purchase (including debt), consignment

**Operating Hours**:
- Monday-Friday: 09:30 - 18:00
- Saturday: By appointment

**Contact Channels**:
- Primary: WhatsApp (+56 9) 7214-9979
- Phone: (+56 2) 4367-0362
- Instagram: Active presence

### Core Website Sections

Based on current site analysis (see `analisis-queirolo-cl.md`):

1. **INICIO (Homepage)**
   - Hero section with vehicle slider
   - Featured vehicles ("RECIÉN LLEGADO" badges)
   - Service overview cards
   - Trust indicators

2. **SEMINUEVOS (Inventory)**
   - Vehicle catalog with advanced filters (brand, model, year, price, transmission, fuel, location)
   - Grid layout for vehicle cards
   - ~25 vehicles in inventory (reference)
   - Vehicle detail pages with image galleries

3. **FINANCIAMIENTO (Financing)**
   - Direct credit offering ("TU CRÉDITO DIRECTO INMEDIATO")
   - Benefits: No debt registration, immediate delivery, insured vehicles
   - Credit quotation form (personal data, vehicle data, credit data)
   - **Recommendation**: Implement real-time loan simulator

4. **AUTO EN PRENDA (Vehicle Purchase with Debt)**
   - 3-step process explanation
   - Contact form for vehicle assessment
   - Target: Vehicle owners with outstanding debt

5. **CONSIGNACION (Consignment)**
   - Consignment service explanation
   - Form for vehicle owners to offer vehicles
   - Commission-based model

6. **CONTACTO (Contact)**
   - Interactive map (Leaflet/OpenStreetMap integration)
   - Contact information and hours
   - Social media links

### Design System

**Color Palette** (Corporate):
- Primary Red: `#e74c3c` (brand color for logo, buttons, accents)
- Dark Red: `#c0392b` (hover states, emphasis)
- Black: `#000000` (text, headers, backgrounds)
- White: `#ffffff` (backgrounds, text on dark)
- Dark Gray: `#2c3e50` (secondary backgrounds)

**Typography**:
- Primary: Sans-serif (Inter, Roboto, or Outfit recommended for modernization)
- Fallback: -apple-system, BlinkMacSystemFont, system-ui

**Spacing/Layout**:
- Mobile-first responsive design
- Breakpoints: 768px (tablet), 1024px (desktop)
- Consistent padding and margin using CSS variables recommended

### Key Features to Implement

1. **Conversion Optimization**
   - Floating WhatsApp button (omnipresent)
   - Multiple lead capture forms (financing, consignment, purchase)
   - Click-to-call phone numbers
   - UTM parameter tracking for marketing

2. **Vehicle Catalog**
   - Dynamic filtering (AJAX preferred over page reload)
   - Image galleries with lightbox/modal
   - "RECIÉN LLEGADO" badge system
   - Sorting options (price, year, brand)
   - **Advanced**: 360° vehicle viewer, comparison tool

3. **Loan Calculator**
   - Real-time calculation based on:
     - Vehicle price (monto)
     - Down payment (pie)
     - Number of installments (cuotas)
     - Interest rate (annual %, typically ~12%)
   - Formula: `cuotaMensual = montoFinanciar * (tasaMensual * (1 + tasaMensual)^cuotas) / ((1 + tasaMensual)^cuotas - 1)`
   - Display: Monthly payment, total cost, amortization graph

4. **Forms Integration**
   - Form validation (client-side + server-side)
   - Chilean phone format: `+56XXXXXXXXX` (9 digits after +56)
   - RUT validation (Chilean ID, Módulo 11 algorithm)
   - Success/error feedback
   - Integration endpoint: n8n webhook or backend API

5. **Performance Optimization**
   - Lazy loading for images (`<img loading="lazy">`)
   - WebP format with JPG fallback
   - Responsive images (`srcset`, `<picture>`)
   - Minified CSS/JS
   - CDN for static assets

6. **SEO Requirements**
   - Schema.org markup for vehicles (type: `Car`)
   - Meta tags: title, description, Open Graph
   - Semantic HTML (proper heading hierarchy)
   - Alt text for all images
   - Clean URLs (e.g., `/seminuevos/bmw-x3-2018`)

## Critical Implementation Notes

### Chilean Market Specifics
- **Currency**: Chilean Peso (CLP) - format with thousand separators: `$18.990.000`
- **Phone Format**: `+56 9 XXXX XXXX` (mobile) or `+56 2 XXXX XXXX` (landline)
- **RUT Validation**: Use Módulo 11 algorithm for client RUT (if collecting)
- **Language**: Spanish only (Chilean variant)

### Conversion Funnel
```
Visitor → [Interest Type] → Lead Capture → Qualified Lead
         ↓
         - Search Vehicle → Catalog → WhatsApp/Form
         - Need Credit → Financing → Calculator → Form
         - Sell Vehicle → Consignment/Debt Purchase → Form
```

### Form Data Schema (Reference)
```javascript
// Financing Form
{
  // Personal Data
  nombre: string,
  rut: string,          // Chilean ID (XX.XXX.XXX-X)
  email: string,
  telefono: string,     // +56XXXXXXXXX
  comuna: string,       // Municipality/district

  // Vehicle Data
  marca: string,
  modelo: string,
  año: number,
  patente: string,      // Optional (license plate)

  // Credit Data
  monto: number,        // Total vehicle price
  pie: number,          // Down payment
  cuotas: number,       // Number of installments

  // Tracking
  page_url: string,
  timestamp: string,
  utm_source: string,   // Optional
  utm_medium: string,   // Optional
  utm_campaign: string  // Optional
}
```

## Modernization Priorities

Based on `analisis-queirolo-cl.md`, prioritize:

1. **Visual Design** (High Impact)
   - Modern color palette with gradients
   - Premium typography
   - Full-width layouts with generous whitespace
   - Micro-animations and smooth transitions

2. **Mobile Experience** (Critical)
   - Mobile-first design approach
   - Touch-friendly interface (minimum 44x44px tap targets)
   - Optimized forms for mobile keyboards
   - Fast loading on mobile networks

3. **Interactive Features** (Engagement)
   - Real-time loan calculator
   - Vehicle comparison tool
   - 360° vehicle viewer
   - Video content (showroom tour, testimonials)

4. **Performance** (SEO/UX)
   - Target < 1.5s initial load
   - WebP images with lazy loading
   - Minified assets
   - CDN integration

5. **Conversion Optimization**
   - Clear CTAs above fold
   - Trust indicators (years in business, vehicle count)
   - Social proof (testimonials, reviews)
   - Multiple contact options (WhatsApp, phone, form, chat)

## Reference Documents

- `analisis-queirolo-cl.md` - Comprehensive analysis of current website with screenshots, recommendations, and implementation roadmap
- `../guia_arquitectura_multiempresa.md` - Multi-tenant architecture guide (if integrating with backend system)

## Deployment Considerations

### Static Hosting Options
- Netlify / Vercel (recommended for static sites)
- AWS S3 + CloudFront
- GitHub Pages
- Railway (current hosting provider for related projects)

### Backend Integration (if needed)
- API endpoints for vehicle inventory
- Form submission handler (n8n webhook or custom API)
- CMS for content management (inventory, blog posts)
- Database: MySQL (consistent with related projects)

## Security Notes

- Validate all form inputs server-side
- Sanitize user-provided content
- Use HTTPS for all pages (especially forms)
- Implement rate limiting on form submissions
- No sensitive data in client-side code
- Secure webhook URLs (if using n8n integration)
