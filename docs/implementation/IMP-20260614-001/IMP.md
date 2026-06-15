# IMP-20260614-001 - Admin privado para gestion interactiva de vehiculos

## Resumen ejecutivo

Se implemento un admin privado en `/admin` para que el owner cargue, edite, elimine y ordene vehiculos de forma interactiva, manteniendo Sanity como fuente de verdad y `/studio` como respaldo tecnico.

## Metadatos

| Campo | Valor |
|-------|-------|
| ID | IMP-20260614-001 |
| Fecha de apertura | 2026-06-14 |
| Ultima actualizacion documental | 2026-06-15 |
| Owner | Queirolo Autos |
| Estado | Implementado; pendiente verificacion manual en deploy con env reales |
| Nombre del frente | `admin-vehiculos` |
| SOT | Este `IMP.md` |
| Log refs | LOG-20260614-001 a LOG-20260614-006, LOG-20260615-001 |
| Commit funcional | `9d36085 feat(admin): add vehicle management panel` |

## Decision principal

Crear un admin ligero propio en `/admin` para operar inventario sin obligar al owner a usar bulk o el CMS generico de Sanity Studio.

No se reemplaza Sanity. La arquitectura correcta aqui es una capa operativa encima del CMS existente: Sanity guarda, el sitio publico lee, `/admin` simplifica el flujo diario y `/studio` queda como respaldo tecnico.

## Problema original

- La carga por bulk sirve para lotes, pero es incomoda para operacion diaria.
- `/studio` funciona, pero no esta disenado para el flujo de negocio del owner.
- El estado `available/reserved/sold` existia, pero no estaba expresado de forma clara en el sitio publico.
- La descripcion del vehiculo existia en datos, pero no se mostraba correctamente en la ficha.
- Habia necesidad real de corregir duplicados y controlar que imagen queda como portada.

## Alcance implementado

### Admin privado

- `/admin/login` con credenciales single-owner.
- Sesion firmada en cookie `HttpOnly`.
- Proteccion de `/admin` y subrutas desde `middleware.ts`.
- `/admin/vehiculos` con listado administrativo.
- `/admin/vehiculos/nuevo` para crear vehiculos.
- `/admin/vehiculos/[id]/editar` para editar vehiculos.
- Guardado contra Sanity usando `SANITY_API_WRITE_TOKEN` server-only.
- Eliminacion segura de documentos `vehicle` duplicados con confirmacion.
- Reordenamiento de imagenes existentes: la primera imagen queda como portada publica.

### Imagenes

- JPG, PNG, WEBP y GIF se aceptan directo.
- HEIC/HEIF/TIFF/BMP se intentan convertir a JPG con `sharp`.
- Si una imagen no se puede procesar, el admin devuelve instruccion accionable.
- El borrado de vehiculo elimina el documento `vehicle`, no los assets del asset manager.

### Sitio publico

- Badge de estado en catalogo y ficha.
- `available`, `reserved` y `sold` siguen visibles segun politica vigente.
- La ficha publica muestra descripcion.
- `description` soporta texto antiguo y Portable Text basico.
- Metadata obtiene texto plano desde rich text para SEO.
- Se endurecio hidratacion de `VehicleCard` para no leer Zustand/localStorage antes de montar.

## Variables requeridas

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=replace_with_sha256_hex
ADMIN_SESSION_SECRET=replace_with_long_random_secret
SANITY_API_WRITE_TOKEN=replace_with_server_only_sanity_token
```

Reglas:

- `ADMIN_PASSWORD_HASH` es SHA-256 hex de la contrasena real.
- `SANITY_API_WRITE_TOKEN` debe tener permiso de escritura en Sanity.
- Nunca usar `NEXT_PUBLIC_` para tokens privados.
- No commitear `.env.local` ni secretos.

## Rutas

| Ruta | Proposito |
|------|-----------|
| `/admin` | Entrada privada; redirige al listado o login |
| `/admin/login` | Login del owner |
| `/admin/vehiculos` | Listado y eliminacion |
| `/admin/vehiculos/nuevo` | Alta guiada |
| `/admin/vehiculos/[id]/editar` | Edicion, imagenes, portada y eliminacion |
| `/studio` | Respaldo tecnico Sanity |

## Archivos principales

| Area | Archivos |
|------|----------|
| Auth/sesion | `lib/admin/auth.ts`, `lib/admin/session.ts`, `middleware.ts`, `app/admin/actions.ts` |
| Admin UI | `app/admin/`, `components/admin/AdminShell.tsx`, `components/admin/VehicleForm.tsx` |
| Imagenes/portada | `components/admin/ExistingImagesManager.tsx`, `lib/admin/vehicles.ts` |
| Eliminacion | `components/admin/DeleteVehicleSubmitButton.tsx`, `app/admin/vehiculos/actions.ts` |
| Rich text | `lib/richText.ts`, `components/shared/RichTextRenderer.tsx` |
| Publico | `components/vehicles/VehicleStatusBadge.tsx`, `components/vehicles/VehicleCard.tsx`, `app/vehiculos/[slug]/page.tsx` |
| Schema/tipos | `sanity/schemaTypes/vehicle.ts`, `lib/types.ts` |

## Validacion ejecutada antes del commit funcional

- `npm run lint` OK.
- `npm run test` OK.
- `npx tsc --noEmit --pretty false` OK.
- `git diff --check` OK.
- No se ejecuto build por regla operativa del proyecto.

## Pendiente operativo

- Configurar variables reales en deploy.
- Probar login en entorno real.
- Crear/editar un vehiculo real con imagenes.
- Confirmar que reordenar portada se refleja en catalogo/ficha.
- Confirmar eliminacion del duplicado correcto.
- Confirmar que `/studio` sigue disponible.

## Riesgos y mitigaciones

| Riesgo | Mitigacion |
|--------|------------|
| Token privado expuesto | `SANITY_API_WRITE_TOKEN` server-only, nunca `NEXT_PUBLIC_*` |
| Auth debil | Cookie `HttpOnly`, firma con secreto largo, middleware centralizado |
| Formato de imagen no soportado | Validacion/conversion server-side y mensajes accionables |
| Borrar assets por accidente | El delete solo remueve documento `vehicle`, no assets Sanity |
| Romper descripcion antigua | Fallback string <-> Portable Text |
| Regresion por hidratacion | Lectura Zustand/localStorage despues de `mounted` |

## Definition of Done del frente

- [x] `IMP.md` existe y queda como SOT.
- [x] `/admin` protegido por sesion.
- [x] Alta/edicion contra Sanity implementada.
- [x] Estados visibles en publico.
- [x] Descripcion visible y compatible.
- [x] Gestion de imagenes implementada.
- [x] Portada controlable por orden de imagenes.
- [x] Eliminacion de duplicados desde admin.
- [x] `/studio` sigue como respaldo.
- [x] Validacion tecnica sin build: lint, test y type-check.
- [ ] Verificacion manual post-deploy con env reales.

## Rollback

1. Revertir rutas `app/admin/` y componentes `components/admin/`.
2. Revertir helpers `lib/admin/` y proteccion `/admin` en `middleware.ts`.
3. Si hubiera regresion publica, revertir badge/render de descripcion manteniendo datos Sanity intactos.
4. No borrar assets de Sanity salvo decision explicita.
