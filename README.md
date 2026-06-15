# Queirolo Autos Web

Sitio web Next.js para Queirolo Autos, enfocado en inventario de vehiculos, ficha publica con SEO, contacto por WhatsApp y administracion privada de vehiculos sobre Sanity.

## Estado actual

| Area | Estado |
|------|--------|
| Sitio publico | Funcional: home, catalogo, ficha, servicios, nosotros, contacto |
| Inventario | Sanity es la fuente de verdad; mock data solo como fallback de desarrollo |
| Admin privado | Implementado en `/admin` para crear, editar, eliminar y ordenar vehiculos |
| Studio tecnico | Disponible en `/studio` como respaldo CMS |
| Leads | Formularios abren WhatsApp con mensaje precargado; endpoint n8n queda preparado pero no es canal activo |
| Validacion reciente | `npm run lint`, `npm run test`, `npx tsc --noEmit --pretty false` OK antes del commit `9d36085` |

## Ultimas mejoras importantes

### Admin privado de vehiculos (`IMP-20260614-001`)

- Nueva ruta privada `/admin` con login single-owner.
- Proteccion por `middleware.ts` y sesion firmada en cookie `HttpOnly`.
- Listado administrativo de vehiculos desde Sanity.
- Alta y edicion interactiva de documentos `vehicle`.
- Carga de imagenes a Sanity con `SANITY_API_WRITE_TOKEN` server-only.
- Validacion/conversion de imagenes antes del upload:
  - JPG, PNG, WEBP y GIF se suben directo.
  - HEIC/HEIF/TIFF/BMP se intentan convertir a JPG con `sharp`.
  - Formatos invalidos muestran mensaje accionable, no error crudo de Sanity.
- Eliminacion de vehiculos duplicados desde `/admin` con confirmacion.
- Reordenamiento de imagenes existentes: `images[0]` queda como portada publica.
- `/studio` sigue siendo respaldo tecnico, no fue reemplazado.

### Mejoras publicas del catalogo y ficha

- Badge de estado para `available`, `reserved` y `sold` en cards/ficha.
- Descripcion visible en ficha publica.
- `description` soporta texto antiguo y bloques basicos de Sanity rich text.
- Metadata usa texto plano derivado de la descripcion para evitar HTML/Portable Text en SEO.
- Se endurecio hidratacion en `VehicleCard` para evitar mismatch con Zustand/localStorage.

## Rutas principales

| Ruta | Proposito |
|------|-----------|
| `/` | Home |
| `/vehiculos` | Catalogo con filtros y sync a URL |
| `/vehiculos/[slug]` | Ficha publica con galeria, specs, calculadora y SEO |
| `/servicios` | Financiamiento, consignacion y compra/contacto |
| `/nosotros` | Historia/equipo |
| `/contacto` | Datos de contacto y mapa |
| `/admin` | Admin privado de vehiculos |
| `/studio` | Sanity Studio tecnico |
| `/sitemap.xml` | Sitemap desde Sanity; excluye vendidos segun politica SEO vigente |
| `/robots.txt` | Robots |

## Stack

- Next.js 14 App Router, React 18, TypeScript.
- Tailwind CSS, Radix/shadcn UI, Heroicons, Framer Motion.
- Zustand para favoritos y comparador.
- Sanity CMS + `next-sanity` + `@sanity/image-url`.
- `sharp` para normalizacion/conversion de imagenes en admin.
- Jest para smoke tests.

## Estructura util

```txt
app/
  admin/                  # Login y CRUD privado de vehiculos
  vehiculos/              # Catalogo y ficha publica
  studio/[[...tool]]/     # Sanity Studio
components/
  admin/                  # Shell/formulario/orden de imagenes/boton eliminar
  vehicles/               # Cards, galeria, badges, comparador
  shared/                 # Render rich text y UI compartida
lib/
  admin/                  # Auth, sesion, queries/mutaciones admin Sanity
  vehicles.ts             # Queries publicas Sanity + fallback dev
  richText.ts             # Conversion portable text/texto plano
sanity/schemaTypes/
  vehicle.ts              # Schema fuente de verdad del vehiculo
store/                    # Zustand
config.ts                 # Datos de negocio, contacto y SEO base
docs/                     # Trazabilidad, analisis e implementaciones formales
```

## Setup local

```bash
npm install
npm run dev
```

Abrir:

- `http://localhost:3000`
- `http://localhost:3000/vehiculos`
- `http://localhost:3000/studio`
- `http://localhost:3000/admin` si las variables `ADMIN_*` estan configuradas.

## Comandos

```bash
npm run dev      # desarrollo
npm run lint     # ESLint
npm run test     # Jest smoke tests
npm run build    # build de deploy; no ejecutarlo automaticamente despues de cambios por regla del proyecto
npm run start    # servir build existente
```

## Variables de entorno

### Sanity publico/Studio

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### Admin privado

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=replace_with_sha256_hex
ADMIN_SESSION_SECRET=replace_with_long_random_secret
SANITY_API_WRITE_TOKEN=replace_with_server_only_sanity_token
```

### Opcionales

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
N8N_LEAD_WEBHOOK_URL=https://...
```

Notas criticas:

- `NEXT_PUBLIC_*` se embebe en build; si cambia en deploy, reconstruir.
- No usar comillas alrededor de valores en `.env.local` o VPS.
- `SANITY_API_WRITE_TOKEN` nunca debe ser `NEXT_PUBLIC_*`.
- `ADMIN_PASSWORD_HASH` es SHA-256 hex de la contrasena real, no la contrasena plana.
- En desarrollo, si faltan env vars de Sanity, el frontend puede usar `mockVehicles`; en produccion debe fallar rapido para no publicar datos falsos.

## Flujo de uso del admin

1. Entrar a `/admin`.
2. Iniciar sesion con `ADMIN_USERNAME` y la contrasena cuyo hash esta en `ADMIN_PASSWORD_HASH`.
3. Ir a **Vehiculos**.
4. Crear, editar o eliminar un vehiculo.
5. En edicion, usar el control de imagenes para mover la portada.
6. Guardar; el dato queda en Sanity y el sitio publico lo consume por los flujos existentes.

## CMS Sanity

- `/admin` es el flujo de negocio recomendado para alta/edicion diaria.
- `/studio` sigue disponible para operaciones tecnicas o recuperacion.
- El schema real del vehiculo esta en `sanity/schemaTypes/vehicle.ts`.
- Las queries publicas estan en `lib/vehicles.ts`.
- Las mutaciones admin estan en `lib/admin/vehicles.ts`.

## Verificacion recomendada

Para cambios de codigo, sin ejecutar build automaticamente:

```bash
npm run lint
npm run test
npx tsc --noEmit --pretty false
```

Checklist manual:

- `/admin/login` bloquea credenciales invalidas.
- `/admin/vehiculos` lista vehiculos reales.
- Crear/editar vehiculo guarda en Sanity.
- Subir imagen JPG/PNG/WEBP funciona.
- Reordenar portada se refleja en `/vehiculos` y ficha.
- Eliminar duplicado remueve el documento `vehicle` correcto.
- `/vehiculos` y `/vehiculos/[slug]` mantienen filtros, comparador y descripcion.
- `/studio` sigue cargando.

## Troubleshooting

| Problema | Revision |
|----------|----------|
| `/admin` no deja entrar | Configurar `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` |
| `/admin` lista pero no guarda | Revisar `SANITY_API_WRITE_TOKEN` y permisos de escritura en Sanity |
| Sanity dice `Invalid image, could not process` | Subir JPG/PNG/WEBP/GIF o convertir la imagen; HEIC se intenta convertir con `sharp`, pero algunos archivos pueden requerir conversion manual |
| Quiero cambiar portada | Entrar a editar vehiculo y mover la imagen deseada al primer lugar |
| Publique duplicado | Usar eliminar desde listado/edicion en `/admin`; se borra el documento, no los assets del asset manager |
| Veo mock data | Revisar `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, sin comillas, y rebuild en deploy |
| Sitemap no cambia | `app/sitemap.ts` consume Sanity; verificar datos publicados y entorno de deploy |
| Formularios no envian por backend | Hoy el canal activo es WhatsApp; n8n esta preparado pero no activado como flujo principal |

## Documentacion fuente

- `docs/INDEX.md` - mapa de lectura.
- `docs/logbook.md` - bitacora obligatoria.
- `docs/implementation/IMP-20260614-001/IMP.md` - SOT del admin privado.
- `AGENTS.md` y `CLAUDE.md` - reglas operativas co-gobernadas.
- `CONFIG_README.md` - guia para ajustar datos de negocio en `config.ts`.
