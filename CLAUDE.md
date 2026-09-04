# CLAUDE.md

Guia ejecutable para trabajar en este repo.

> Co-gobierno: `CLAUDE.md` y `AGENTS.md` son co-base entrelazada. Toda regla critica nueva o cambiada debe actualizarse en ambos en la misma sesion. Si hay conflicto, aplicar la opcion mas segura y registrar `DECISION` en `docs/logbook.md`.

## Estado actual

Queirolo Autos Web es un sitio Next.js 14 para catalogo de vehiculos, SEO, contacto por WhatsApp y administracion privada de inventario. El panorama tecnico completo esta en `docs/reference/project-reference.md`.

Ultimas mejoras relevantes:

- `/admin` implementado para crear, editar, eliminar y ordenar vehiculos sobre Sanity.
- Portada publica controlada por el orden de imagenes (`images[0]`).
- Carga de imagenes endurecida: JPG/PNG/WEBP/GIF directo; HEIC/HEIF/TIFF/BMP se intentan convertir con `sharp`.
- Estados `available/reserved/sold` visibles con badge en catalogo/ficha.
- Descripcion de ficha visible y compatible con texto antiguo + Portable Text basico.
- Leads publicos siguen usando WhatsApp como canal activo; n8n esta preparado pero no activado como flujo principal.
- APIs existentes: `/api/health`, `/api/calculate-loan` y `/api/submit-lead`.
- Fotos reales de inventario viven en assets de Sanity; `public/images/vehicles/` es fallback de desarrollo.

## Reglas criticas

- Responder en el idioma del usuario.
- Verificar antes de afirmar.
- No ejecutar build automaticamente despues de cambios.
- No agregar `Co-Authored-By` ni atribucion AI a commits.
- No commitear sin solicitud explicita del owner.
- Registrar cambios relevantes en `docs/logbook.md`.
- Para frentes formales, usar `docs/implementation/IMP-YYYYMMDD-XXX/IMP.md`.
- Secretos solo en env vars; nunca en repo.
- La fuente de verdad tecnica prevalece sobre documentos narrativos: schema Sanity, queries, tipos y `config.ts`.

## Comandos

```bash
npm run dev
npm run lint
npm run test
npx tsc --noEmit --pretty false
npm run build   # solo para deploy/verificacion explicita; no automatico tras cambios
npm run start
```

## Rutas

| Ruta | Proposito |
|------|-----------|
| `/` | Home |
| `/vehiculos` | Catalogo con filtros |
| `/vehiculos/[slug]` | Ficha publica |
| `/servicios` | Servicios |
| `/nosotros` | Institucional |
| `/contacto` | Contacto/mapa |
| `/admin` | Admin privado del owner |
| `/studio` | Sanity Studio tecnico |
| `/sitemap.xml` | Sitemap desde Sanity |
| `/robots.txt` | Robots |
| `/api/health` | Health check |
| `/api/calculate-loan` | Calculo de credito validado con Zod |
| `/api/submit-lead` | Validacion/rate limit y webhook n8n opcional |

## Estructura clave

```txt
app/admin/                 # login y CRUD privado
components/admin/          # UI admin
lib/admin/                 # auth, sesion, Sanity writes
middleware.ts              # proteccion /admin + redirects
sanity/schemaTypes/vehicle.ts
lib/vehicles.ts            # lectura publica Sanity
lib/richText.ts            # descripcion rich text/texto plano
components/vehicles/       # catalogo/ficha/badges
config.ts                  # datos de negocio
docs/                      # gobernanza, IMPs, logbook
docs/reference/project-reference.md # panorama tecnico completo
scripts/                   # utilidades manuales fuera del runtime
```

## Variables de entorno

Sanity publico/Studio:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

Admin privado:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=replace_with_sha256_hex
ADMIN_SESSION_SECRET=replace_with_long_random_secret
SANITY_API_WRITE_TOKEN=replace_with_server_only_sanity_token
```

Opcional:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
N8N_LEAD_WEBHOOK_URL=https://...
```

Notas:

- `NEXT_PUBLIC_*` se resuelve en build.
- `SANITY_API_WRITE_TOKEN` es server-only.
- `ADMIN_PASSWORD_HASH` es SHA-256 hex, no password plano.
- Sin env vars de Sanity, desarrollo puede caer a mock; produccion debe fallar rapido.

## Troubleshooting rapido

| Problema | Accion |
|----------|--------|
| `/admin` login deshabilitado | Configurar `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` |
| `/admin` no guarda | Revisar `SANITY_API_WRITE_TOKEN` y permisos Sanity |
| Imagen invalida en admin | Usar JPG/PNG/WEBP/GIF; si es HEIC y falla, convertir manualmente a JPG |
| Portada incorrecta | Editar vehiculo y mover la imagen deseada al primer lugar |
| Duplicado publicado | Eliminar el documento desde `/admin`; los assets quedan en Sanity |
| Mock data en catalogo | Revisar `NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET`, sin comillas, y rebuild en deploy |
| Formularios no llegan por backend | Canal activo es WhatsApp; n8n esta preparado pero no activo |

## Practicas para agentes IA

Estas reglas aplican igual a Claude, GPT, Gemini, Copilot u otro modelo:

1. **Inspeccionar antes de editar:** leer codigo, configuracion, tests y referencias; buscar usos antes de mover o borrar.
2. **No inventar:** confirmar rutas, integraciones, variables y reglas en el repo; declarar incertidumbre.
3. **Cambiar lo minimo:** preservar contratos, imports, rutas publicas, Sanity, imagenes y comportamiento existente.
4. **Proteger secretos:** no exponer tokens server-only ni incluir valores reales en documentacion o commits.
5. **Verificar:** revisar diff y referencias; ejecutar lint, tests y TypeScript cuando aplique.
6. **No construir por defecto:** `npm run build` solo con solicitud explicita del owner.
7. **Trazar:** registrar decisiones, cambios documentales, pruebas y riesgos en `docs/logbook.md`.
8. **No ocultar limites:** informar que se verifico, que no se verifico y cualquier riesgo residual.

## Documentos fuente

- `README.md` - estado funcional actual.
- `docs/INDEX.md` - mapa de lectura.
- `docs/logbook.md` - trazabilidad.
- `docs/implementation/IMP-20260614-001/IMP.md` - admin privado.
- `docs/reference/project-reference.md` - panorama tecnico integral.
- `docs/reference/configuration.md` - datos de negocio en `config.ts`.
- `docs/reference/automotive-platform-specification.md` - especificacion reusable de construccion y despliegue.
- `AGENTS.md` - reglas completas del repo.
