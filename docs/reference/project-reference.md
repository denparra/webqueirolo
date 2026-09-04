# Referencia tecnica del proyecto

Este documento es el panorama tecnico del sitio Queirolo Autos. Describe el estado que existe en el codigo actual: arquitectura, tecnologias, rutas, datos, imagenes, configuracion y documentacion. Si este archivo contradice el codigo, prevalece el codigo fuente indicado en cada seccion.

## Lectura rapida

1. Leer `README.md` para arrancar el proyecto.
2. Leer esta referencia para entender arquitectura, datos e integraciones.
3. Leer `AGENTS.md` o `CLAUDE.md` antes de modificar el repositorio con asistencia de IA.
4. Consultar `docs/logbook.md` y `docs/implementation/` para decisiones e iniciativas historicas.

## Identidad y alcance

| Area | Estado actual |
|------|---------------|
| Producto | Catalogo publico de vehiculos para Queirolo Autos, Chile |
| Dominio canonico | `https://www.queirolo.cl` y redireccion apex -> `www` en `middleware.ts` |
| Fuente de inventario | Sanity, tipo de documento `vehicle` |
| Canal publico de leads | WhatsApp desde los formularios |
| Canal futuro preparado | `POST /api/submit-lead` puede reenviar a n8n si existe `N8N_LEAD_WEBHOOK_URL` |
| Administracion | `/admin` privado para crear, editar, eliminar y ordenar vehiculos |
| CMS tecnico | `/studio`, Sanity Studio montado con `basePath: '/studio'` |

## Tecnologias

| Capa | Tecnologia | Evidencia |
|------|-----------|-----------|
| Framework | Next.js 14, App Router | `package.json`, `app/` |
| UI | React 18, TypeScript | `package.json`, `app/`, `components/` |
| Estilos | Tailwind CSS, PostCSS, `tailwindcss-animate` | `tailwind.config.ts`, `postcss.config.js` |
| Componentes UI | Radix UI, patrones shadcn/ui, Heroicons | `components/ui/`, `package.json` |
| Animacion | Framer Motion | `components/animations/`, `components/vehicles/` |
| Estado cliente | Zustand | `store/`, comparador y favoritos |
| CMS y datos | Sanity, `next-sanity`, GROQ | `sanity/`, `lib/sanity.ts`, `lib/vehicles.ts` |
| Imagenes | Sanity CDN, `@sanity/image-url`, `sharp` | `lib/vehicles.ts`, `lib/admin/vehicles.ts` |
| Validacion | Zod en endpoints y validadores admin | `app/api/`, `lib/admin/vehicleFormValidation.ts` |
| Observabilidad | Sentry y Google Analytics opcional | `sentry.*.config.ts`, `components/analytics/` |
| Calidad | ESLint/Next lint, Jest, Testing Library, TypeScript | `package.json`, `__tests__/` |

## Arquitectura por capas

### Frontend

- `app/` contiene rutas, layouts, metadata, Server Components y endpoints.
- `components/` contiene UI reutilizable agrupada por dominio: `home`, `vehicles`, `admin`, `forms`, `layout`, `maps`, `services`, `shared` y `ui`.
- `store/` contiene estado cliente persistente o interactivo: favoritos y comparador.
- `config.ts` contiene datos de negocio visibles, contacto, horarios, redes, logos y SEO base.

### Backend dentro de Next.js

- `lib/vehicles.ts` consulta Sanity, transforma documentos al tipo `Vehicle` y usa `mockVehicles` solo como fallback de desarrollo.
- `lib/admin/vehicles.ts` lee y escribe vehiculos en Sanity con un cliente sin CDN y `SANITY_API_WRITE_TOKEN` server-only.
- `lib/admin/auth.ts` y `lib/admin/session.ts` implementan autenticacion single-owner y sesion firmada.
- `middleware.ts` protege `/admin` y redirige `queirolo.cl` al host canonico `www.queirolo.cl`.
- `app/admin/actions.ts` y `app/admin/vehiculos/actions.ts` exponen acciones de login, logout y operaciones del inventario.
- `app/api/` contiene endpoints HTTP para health check, leads y calculo de credito.

### CMS Sanity

- Configuracion Studio: `sanity.config.ts`, `sanity/env.ts`, `sanity/structure.ts`.
- Schema principal: `sanity/schemaTypes/vehicle.ts`.
- El documento `vehicle` incluye identidad, precio, estado, galeria, especificaciones, descripcion Portable Text y equipamiento.
- Los catalogos de marca, categoria, carroceria y color viven en `lib/constants/` y se reutilizan en el schema y admin.
- Dataset por defecto en el cliente publico: `production`; Studio exige explicitamente `NEXT_PUBLIC_SANITY_DATASET`.

## Rutas publicas y privadas

| Ruta | Implementacion | Funcion |
|------|----------------|---------|
| `/` | `app/page.tsx` | Home, destacados, categorias y CTAs |
| `/vehiculos` | `app/vehiculos/page.tsx` | Catalogo, filtros y comparador |
| `/vehiculos/[slug]` | `app/vehiculos/[slug]/page.tsx` | Ficha, galeria, metadata y SEO del vehiculo |
| `/servicios` | `app/servicios/page.tsx` | Financiamiento, consignacion y contacto |
| `/nosotros` | `app/nosotros/page.tsx` | Historia y equipo |
| `/contacto` | `app/contacto/page.tsx` | Contacto y mapa |
| `/privacidad` | `app/privacidad/page.tsx` | Politica legal |
| `/politica-de-privacidad` | `app/politica-de-privacidad/page.tsx` | Variante legal existente |
| `/terminos` | `app/terminos/page.tsx` | Terminos existentes |
| `/terminos-y-condiciones` | `app/terminos-y-condiciones/page.tsx` | Terminos publicados |
| `/eliminacion-de-datos` | `app/eliminacion-de-datos/page.tsx` | Solicitud de eliminacion |
| `/admin/login` | `app/admin/login/page.tsx` | Login del owner |
| `/admin/vehiculos` | `app/admin/vehiculos/page.tsx` | Listado privado |
| `/admin/vehiculos/nuevo` | `app/admin/vehiculos/nuevo/page.tsx` | Alta de vehiculo |
| `/admin/vehiculos/[id]/editar` | `app/admin/vehiculos/[id]/editar/page.tsx` | Edicion, galeria y eliminacion |
| `/studio/[[...tool]]` | `app/studio/[[...tool]]/page.tsx` | Sanity Studio |

## APIs y acciones

| Endpoint | Metodo | Estado y responsabilidad |
|----------|--------|--------------------------|
| `/api/health` | GET | Health check de la aplicacion |
| `/api/calculate-loan` | POST | Valida y calcula cuota, total e intereses con Zod |
| `/api/submit-lead` | POST | Valida leads, aplica honeypot y rate limit en memoria; reenvia a n8n si esta configurado o registra en logs |

Los formularios publicos actualmente abren WhatsApp con mensajes precargados. No documentar n8n como canal activo mientras los componentes no hayan sido cambiados para usar el endpoint.

## Flujo del inventario

### Consulta publica

1. Una pagina llama `getVehicles()` o `getVehicleBySlug()` desde `lib/vehicles.ts`.
2. GROQ consulta documentos `vehicle` publicados en Sanity.
3. Las URLs de imagen se proyectan desde `images[].asset->url`.
4. El mapper construye `Vehicle`, aplica transformaciones del CDN y calcula datos derivados.
5. Si falta configuracion o falla Sanity en desarrollo, se usa `lib/data.ts`.
6. En produccion, la falta de `NEXT_PUBLIC_SANITY_PROJECT_ID` o un fallo de consulta no se oculta con datos mock.

### Alta y edicion en admin

1. `middleware.ts` exige una sesion valida para las rutas privadas.
2. El formulario valida campos y prepara imagenes en cliente.
3. `lib/admin/vehicles.ts` valida configuracion, normaliza datos y procesa imagenes con concurrencia maxima de 3.
4. Las imagenes JPG, PNG y WEBP se redimensionan hasta 2400 px y se recomprimen a JPEG calidad 82; GIF se conserva; HEIC, HEIF, TIFF y BMP intentan convertirse a JPEG.
5. Sanity recibe los assets y el documento `vehicle` con la galeria ordenada.
6. `images[0]` es la portada publica. Eliminar un vehiculo no elimina automaticamente assets del asset manager de Sanity.

## Donde se guardan las fotos

| Tipo | Ubicacion | Uso |
|------|-----------|-----|
| Fotos reales de vehiculos | Assets de imagen de Sanity | Fuente de verdad para catalogo y fichas en produccion |
| Fotos fallback de desarrollo | `public/images/vehicles/` | Solo `mockVehicles` cuando Sanity no esta configurado o falla en desarrollo |
| Fotos institucionales | `public/images/` y subcarpetas (`logo`, `team`, `consignacion`) | Assets versionados del sitio: logos, historia, equipo y consignacion |
| Iconos y PWA | `public/icons/`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/manifest.json` | Identidad y manifest del sitio |
| Imagen OG | `public/og-image.jpg` | Compartir/social metadata |

No subir fotos reales de inventario a Git como mecanismo de negocio. La galeria administrable debe vivir en Sanity; `public/images/vehicles/` es fallback y material local controlado.

## Configuracion y secretos

Variables publicas requeridas para datos reales y Studio:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION` opcional, con valor por defecto en `sanity/env-utils.ts`

Variables privadas del admin:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`
- `SANITY_API_WRITE_TOKEN`

Integraciones opcionales:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `N8N_LEAD_WEBHOOK_URL`

Nunca documentar valores reales de secretos, incluir `.env.local` en commits ni convertir tokens server-only en `NEXT_PUBLIC_*`. Los cambios `NEXT_PUBLIC_*` requieren rebuild porque se resuelven en build time.

## Documentacion y fuentes de verdad

| Documento | Responsabilidad |
|-----------|-----------------|
| `README.md` | Arranque y estado funcional resumido |
| `docs/reference/project-reference.md` | Panorama tecnico integral de este documento |
| `docs/reference/configuration.md` | Edicion segura de datos de negocio en `config.ts` |
| `docs/reference/automotive-platform-specification.md` | Arquitectura reusable y reglas de dominio, despliegue y operacion |
| `docs/implementation/IMP-20260825-004/IMP.md` | SOT del panel de plataforma separado del `/admin` cliente |
| `AGENTS.md` | Reglas completas para agentes y contribuyentes |
| `CLAUDE.md` | Guia ejecutable y compacta para agentes |
| `docs/INDEX.md` | Mapa de lectura documental |
| `docs/logbook.md` | Decisiones, acciones, pruebas, riesgos e incidentes |
| `docs/implementation/` | Iniciativas formales con alcance y evidencia |
| `docs/analysis/` | Analisis y propuestas tecnicas |
| `docs/archive/` | Documentacion historica de solo lectura |

## Regla de mantenimiento

Actualizar este documento cuando cambien rutas, fuentes de datos, pipeline de imagenes, variables de entorno, integraciones o estructura relevante. Registrar el cambio en `docs/logbook.md`. Mantener `AGENTS.md` y `CLAUDE.md` alineados en sus reglas criticas, pero no duplicar aqui sus instrucciones operativas.
