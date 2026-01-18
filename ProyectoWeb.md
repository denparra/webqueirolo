# Queirolo Autos Web

## Resumen del proyecto
Sitio web para Queirolo Autos (automotora 4x4 en Chile) enfocado en mostrar inventario de vehiculos seminuevos, facilitar la comparacion y simulacion de financiamiento, y convertir visitas en contactos mediante WhatsApp y formularios. El frontend consume inventario desde Sanity CMS cuando esta configurado, con fallback a datos mock para desarrollo.

## Features actuales (demostradas en codigo)
- Catalogo de vehiculos con filtros por marca, precio, anio, kilometraje, transmision y combustible, con sync a la URL (`app/vehiculos/page.tsx`).
- Ficha de vehiculo con galeria, lightbox/zoom, tabs de especificaciones y caracteristicas, y calculadora de cuotas (`app/vehiculos/[slug]/page.tsx`, `components/vehicles/*`).
- Comparador de hasta 3 vehiculos con barra fija y modal (`components/vehicles/CompareBar.tsx`, `components/vehicles/CompareModal.tsx`).
- Favoritos persistidos en localStorage (`store/useFavorites.ts`).
- Calculadora de credito en tiempo real y formularios de financiamiento, consignacion y contacto (simulan envio).
- Paginas principales: home, servicios con tabs, nosotros, contacto con mapa embebido, y boton flotante de WhatsApp.
- SEO y PWA: metadata, JSON-LD, sitemap, robots, manifest, headers de cache (`lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `public/manifest.json`).
- Analytics GA4 opcional con helper de eventos (helpers disponibles, no wireados en UI).
- Sanity Studio embebido en `/studio` con esquema `vehicle` y Vision plugin.

## En progreso / pendiente (segun claudedocs)
- Poblacion de contenido real en Sanity (vehiculos e imagenes publicadas).
- Integracion de backend real para formularios (actualmente son simulados).
- Configuracion final de deploy (CORS en Sanity, dominio/SSL, CDN, monitoreo).
- Revision de mapa (docs mencionan Leaflet; hoy hay iframe de Google Maps).
- QA final y verificacion de rutas con datos reales.

## Tech stack
- Frontend: Next.js 14 (App Router), React 18, TypeScript.
- UI: Tailwind CSS, shadcn/ui (Radix), Heroicons, Framer Motion.
- Estado: Zustand (favoritos y comparador).
- CMS: Sanity (next-sanity, @sanity/image-url) + Vision.
- Analitica: Google Analytics 4 (opcional).

## Arquitectura y estructura de carpetas
```
app/                     # Rutas y layouts (App Router)
  page.tsx               # Home
  vehiculos/             # Listado y detalle
  servicios/             # Tabs de servicios
  nosotros/              # About
  contacto/              # Contacto + mapa
  studio/[[...tool]]/    # Sanity Studio
  sitemap.ts             # Sitemap
  robots.ts              # Robots
components/              # UI reutilizable, layout, forms, vehicles
lib/                     # Datos, utils, SEO, calculos, Sanity fetch
sanity/                  # Config y schema de Sanity Studio
store/                   # Zustand stores (favoritos, comparador)
public/                  # Assets estaticos (imagenes, icons, manifest)
claudedocs/              # Roadmap, fases y guias internas
config.ts                # Configuracion central del negocio
```

Rutas principales:
- `/` home
- `/vehiculos` listado con filtros
- `/vehiculos/[slug]` detalle
- `/servicios` tabs (financiamiento/consignacion/contacto)
- `/nosotros` historia/equipo
- `/contacto` datos + mapa
- `/studio` Sanity Studio

## Setup local
Requisitos:
- Node.js + npm

Pasos:
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir:
   - `http://localhost:3000`
   - `http://localhost:3000/studio`

Comandos utiles:
```bash
npm run dev
npm run build
npm run start
npm run lint
```
No hay framework de tests configurado actualmente.

## Variables de entorno
Requeridas para Sanity Studio y datos reales:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

Opcionales:
- `NEXT_PUBLIC_SANITY_API_VERSION` (default en `sanity/env.ts`)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (habilita GA4)

Ejemplo de `.env.local` (sin valores reales y sin comillas):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-16
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Notas:
- `NEXT_PUBLIC_*` se embebe en build; si cambias estos valores en deploy, debes reconstruir.
- En algunos VPS, las comillas en env vars provocan fallos; evita `"value"`.

## CMS Sanity
Como correr el Studio:
- Con `npm run dev`, abre `http://localhost:3000/studio`.

Como crear/publicar un vehiculo:
1. En Studio, entra a **Vehiculos**.
2. Crea un documento `vehicle` y completa campos requeridos (name, slug, price, images, brand, model, year, etc).
3. Publica (los drafts no aparecen en el frontend).

Como se consulta desde el frontend (alto nivel):
- `lib/vehicles.ts` ejecuta queries GROQ a `*[_type == "vehicle"]` y mapea campos a `Vehicle`.
- `app/vehiculos` carga los datos en el cliente y filtra localmente.
- `app/vehiculos/[slug]` usa `getVehicleBySlug` y `generateStaticParams`.
- Si faltan env vars o hay error de fetch, se usa `mockVehicles` como fallback.

## Deploy (VPS/containers)
- Build vs runtime: `NEXT_PUBLIC_*` se resuelve en build, por lo que debes reconstruir imagen si cambian.
- Sanity CORS: agrega el dominio de produccion en `manage.sanity.io` -> API -> CORS Origins.
- Imagenes: `next.config.js` permite `cdn.sanity.io`; verifica que las URLs vienen de ahi.
- Evita fallback a mock en produccion si no tienes `public/images/vehicles/*` disponibles.

## Troubleshooting
- **Veo datos mock en `/vehiculos`**: revisa `NEXT_PUBLIC_SANITY_PROJECT_ID`/`DATASET`, sin comillas, rebuild, y publica vehiculos en Sanity.
- **Imagenes no cargan o Next Image falla**: verifica que hay imagenes publicadas en Sanity y que el dominio esta en `next.config.js` (cdn.sanity.io). Si el app cae a mock, aseguran archivos locales o corrige env vars.
- **Studio no abre o falla al crear vehiculos**: asegurate de tener `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET` definidos.
- **Sitemap no refleja datos reales**: `app/sitemap.ts` usa `mockVehicles` actualmente.
- **GA4 no aparece**: define `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- **Formularios no envian datos**: los forms simulan envio; requiere backend para produccion.

## Contribucion y convenciones
- TypeScript/TSX, indentacion 2 espacios.
- Tailwind como estilo principal; evita CSS suelto salvo necesidad.
- Helpers en `lib/` y componentes reutilizables en `components/`.
- Evita exports sin uso.

Licencia: no se encontro archivo de licencia en este repo.

## Docs internos relevantes
- `CONFIG_README.md` (guia de configuracion; el archivo real es `config.ts`)
- `claudedocs/CLAUDE.md` (contexto del proyecto)
- `claudedocs/00-Analysis-Planning/analisis-queirolo-cl.md`
- `claudedocs/00-Analysis-Planning/FRONTEND_DESIGN_PROPOSAL.md`
- `claudedocs/03-Phase3-Enhancement/PHASE3_SUMMARY.md`
- `claudedocs/04-Phase4-Optimization/PHASE4_SUMMARY.md`
- `claudedocs/05-Phase5-LaunchPreparation/PHASE5_IMPLEMENTATION_GUIDE.md`
- `claudedocs/05-Phase5-LaunchPreparation/phase5-implementation-log.md`
- `claudedocs/05-Phase5-LaunchPreparation/phase5-vps-sanity-images-fix.md`
