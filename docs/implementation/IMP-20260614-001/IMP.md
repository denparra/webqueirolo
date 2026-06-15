# IMP-20260614-001 — Admin privado para gestión interactiva de vehículos

## Metadatos

| Campo | Valor |
|-------|-------|
| **ID** | IMP-20260614-001 |
| **Fecha** | 2026-06-14 |
| **Owner** | Queirolo Autos |
| **Estado** | in-progress |
| **Nombre del frente** | admin-vehiculos |
| **SOT** | Este `IMP.md` es la fuente de verdad del frente |
| **Log ref** | LOG-20260614-001 |

## Decisión principal

Crear un **admin ligero propio en `/admin`** para cargar y editar vehículos de forma interactiva, manteniendo **Sanity como fuente de verdad** y dejando `/studio` como respaldo técnico.

Esto NO reemplaza Sanity en v1. Es una capa de experiencia operativa encima del modelo actual. Como en arquitectura: no estamos cambiando los cimientos de la casa todavía; estamos construyendo una entrada de servicio segura y usable para operar mejor el inventario.

## Contexto verificado

Estado actual del proyecto:

| Área | Estado actual | Evidencia |
|------|---------------|-----------|
| Carga de vehículos | Se hace por bulk o desde `/studio` | Flujo operativo informado por el owner |
| Studio | Existe ruta Sanity Studio en `/studio` | `app/studio/[[...tool]]/page.tsx` |
| Admin propio | No existe ruta `/admin` | No hay carpeta/ruta `app/admin` |
| Autenticación | No hay auth de admin en la app | `middleware.ts` solo redirige apex `queirolo.cl` a `www.queirolo.cl` |
| Estado del vehículo | Ya existe `status` con `available`, `reserved`, `sold` | `sanity/schemaTypes/vehicle.ts` |
| Descripción | Existe `description`, pero no se muestra bien en ficha pública | `lib/vehicles.ts` la mapea; `app/vehiculos/[slug]/page.tsx` no la renderiza como sección visible |

## Problema

El flujo actual de carga y edición de vehículos depende de herramientas que sirven técnicamente, pero no son el mejor flujo operativo diario:

- El bulk es útil para cargas masivas, pero no para edición fina o carga interactiva.
- `/studio` funciona, pero expone una experiencia de CMS genérica, no optimizada para el negocio.
- El estado `vendido/reservado` existe en el schema, pero falta convertirlo en una experiencia visible y consistente en la web pública.
- La descripción del vehículo existe, pero no tiene una presentación pública clara ni formato rico.

El error que NO vamos a cometer: codear `/admin` de inmediato sin entender los límites. CONCEPTOS > CÓDIGO. Primero se fija el contrato del frente, luego se implementa por fases.

## Objetivo

Construir un panel privado `/admin` para que el owner pueda:

- crear vehículos de forma guiada,
- editar vehículos existentes,
- subir y ordenar imágenes,
- marcar autos como disponible, reservado o vendido,
- escribir una descripción enriquecida,
- revisar una vista previa básica antes de publicar/guardar.

## Alcance v1

### Incluye

- Ruta privada `/admin`.
- Login formal para un solo administrador.
- Listado administrativo de vehículos.
- Alta de vehículo.
- Edición de vehículo.
- Gestión de imágenes.
- Gestión del estado:
  - `available` → disponible,
  - `reserved` → reservado,
  - `sold` → vendido.
- Mejora de descripción como texto enriquecido.
- Render público de la descripción en la ficha del vehículo.
- Badge público de estado en catálogo y ficha.
- `/studio` se mantiene como respaldo técnico.

### Excluye

- Multiusuario.
- Roles/permisos avanzados.
- Auditoría completa de cambios.
- Acciones masivas.
- Reemplazo total de `/studio`.
- CMS propio independiente de Sanity.
- Cambios de diseño global fuera de vehículos/admin.
- Build durante la implementación, por regla operativa del proyecto.

## Decisiones acordadas

| Tema | Decisión |
|------|----------|
| Arquitectura | Admin ligero propio |
| Ruta | `/admin` |
| Persistencia | Sanity sigue siendo fuente de verdad |
| Auth | Login formal |
| Usuario v1 | Un solo owner/admin |
| `/studio` | Respaldo interno/técnico |
| Estado público | `reserved` y `sold` siguen visibles con badge |
| Descripción | Texto enriquecido |
| Primera versión | Alta + edición + estado + imágenes + preview básica |

## Diseño funcional

### Rutas previstas

| Ruta | Propósito |
|------|-----------|
| `/admin/login` | Inicio de sesión del owner |
| `/admin` | Redirección o dashboard básico |
| `/admin/vehiculos` | Listado administrativo |
| `/admin/vehiculos/nuevo` | Alta guiada de vehículo |
| `/admin/vehiculos/[id]/editar` | Edición de vehículo existente |

### Flujo principal

1. Owner entra a `/admin`.
2. Si no tiene sesión, se redirige a `/admin/login`.
3. Tras login válido, entra al listado de vehículos.
4. Puede crear o editar un vehículo.
5. Completa datos principales, especificaciones, imágenes, features, estado y descripción.
6. Revisa preview básica.
7. Guarda en Sanity.
8. El sitio público refleja los datos mediante los flujos actuales de lectura/revalidación.

## Diseño técnico preliminar

### Auth

Implementar login formal sin proveedor externo en v1:

- credenciales administradas por variables de entorno,
- validación server-side,
- cookie de sesión `HttpOnly`,
- expiración de sesión,
- logout explícito,
- protección centralizada en `middleware.ts` para `/admin` y subrutas.

Variables propuestas:

```env
ADMIN_USERNAME=...
ADMIN_PASSWORD_HASH=...
ADMIN_SESSION_SECRET=...
SANITY_API_WRITE_TOKEN=...
```

> Nota: no guardar password plano en el repo. Si se usa hash, documentar cómo generarlo.
> `ADMIN_PASSWORD_HASH` usa SHA-256 hex de la contraseña. `SANITY_API_WRITE_TOKEN` es server-only y nunca debe ser `NEXT_PUBLIC_*`.

## Avance implementado — 2026-06-14

Implementación funcional base completada:

- `/admin/login` con login formal single-owner.
- Sesión privada con cookie `HttpOnly` firmada.
- Middleware protege `/admin` y subrutas.
- `/admin/vehiculos` lista vehículos desde Sanity.
- `/admin/vehiculos/nuevo` permite crear vehículos.
- `/admin/vehiculos/[id]/editar` permite editar vehículos.
- Subida de imágenes a Sanity vía `SANITY_API_WRITE_TOKEN`.
- Preservación o reemplazo de galería existente.
- Validación/normalización de imágenes antes del upload: JPG, PNG, WEBP y GIF directos; HEIC/HEIF/TIFF/BMP se intentan convertir a JPG.
- Reordenamiento de galería en edición: la primera imagen del array queda como portada pública.
- Eliminación segura de documentos `vehicle` duplicados desde `/admin` con confirmación. No se eliminan assets de imagen del asset manager.
- Descripción enriquecida mediante bloques básicos compatibles con texto antiguo.
- Ficha pública renderiza descripción.
- Cards y ficha pública muestran badge de estado.
- `/studio` sigue disponible como respaldo técnico.

Pendiente fuera de código:

- Configurar env vars reales en el entorno.
- Verificar manualmente con token real de Sanity creando/editando un vehículo.

### Sanity

Sanity sigue siendo el backend de contenido:

- leer vehículos desde Sanity para listado admin,
- crear/actualizar documentos `vehicle`,
- subir imágenes como assets Sanity,
- mantener compatibilidad con queries públicas actuales.

### Descripción enriquecida

Evolucionar `description` desde texto simple hacia un formato renderizable como rich text.

Requisitos:

- soportar párrafos,
- soportar listas,
- soportar énfasis básico,
- renderizar en la ficha pública,
- mantener fallback para vehículos existentes con descripción antigua.

### Estado público

Política definida:

| Estado | Catálogo | Ficha | Sitemap |
|--------|----------|-------|---------|
| `available` | Visible normal | Visible normal | Candidato a sitemap |
| `reserved` | Visible con badge | Visible con badge | Candidato a sitemap |
| `sold` | Visible con badge | Visible con badge | Mantener política actual: fuera del sitemap si ya está así |

> No cambiar la política de sitemap sin revisar `app/sitemap.ts`, porque hoy ya existe una decisión SEO previa sobre vendidos.

## Fases propuestas

### Fase 0 — Preparación segura

- Confirmar env vars necesarias.
- Crear helpers de auth.
- Proteger `/admin` sin tocar rutas públicas.
- Documentar rollback.

### Fase 1 — Admin shell + login

- Crear `/admin/login`.
- Crear layout privado.
- Crear dashboard/listado placeholder.
- Validar protección de rutas.

### Fase 2 — Listado administrativo

- Consultar vehículos desde Sanity.
- Mostrar tabla/listado con estado, marca, modelo, año, precio e imagen principal.
- Agregar búsqueda y filtro por estado.

### Fase 3 — Alta y edición

- Crear formulario guiado.
- Guardar documentos `vehicle`.
- Editar documentos existentes.
- Validar campos obligatorios según schema actual.

### Fase 4 — Imágenes y preview

- Subir imágenes a Sanity.
- Definir orden de galería.
- Mostrar preview básica antes de guardar.

### Fase 5 — Descripción enriquecida + frontend público

- Ajustar schema/modelo de descripción.
- Renderizar descripción en ficha.
- Mantener fallback para texto antiguo.

### Fase 6 — Badges públicos de estado

- Badge en cards del catálogo.
- Badge en ficha.
- Revisar copy y accesibilidad.

## Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Auth débil en `/admin` | Media | Alto | Middleware + cookie `HttpOnly` + secreto fuerte + no exponer acciones sin sesión |
| Divergencia entre `/admin` y `/studio` | Media | Medio | Sanity como única fuente de verdad; `/admin` no duplica modelo |
| Romper vehículos existentes por migrar descripción | Media | Alto | Fallback compatible para `description` antigua |
| Cambiar semántica SEO de vendidos | Media | Medio | No tocar sitemap sin decisión explícita |
| Subida de imágenes incompleta | Media | Medio | Fase separada y validación por vehículo |
| Afectar rutas públicas | Baja | Alto | Cambios aislados a `/admin`, luego ajustes públicos mínimos y testeados |

## Guardrails de implementación

- No tocar `.next/`.
- No hacer refactors masivos.
- No cambiar `config.ts` salvo necesidad directa.
- No cambiar rutas públicas no relacionadas.
- No tocar formularios de contacto/financiamiento/consignación.
- No cambiar política de leads.
- No ejecutar build después de cambios.
- Registrar avances relevantes en `docs/logbook.md`.
- Si se cambia una regla operativa, actualizar `AGENTS.md` y `CLAUDE.md` en la misma sesión.

## Criterios de aceptación

### Admin

- [ ] `/admin` no es accesible sin sesión.
- [ ] `/admin/login` permite entrar con credenciales válidas.
- [ ] Login inválido no crea sesión.
- [ ] Logout invalida sesión.
- [ ] Se puede listar vehículos.
- [ ] Se puede crear vehículo.
- [ ] Se puede editar vehículo.
- [ ] Se puede cambiar estado.
- [ ] Se pueden gestionar imágenes.
- [ ] Si una imagen no es procesable por Sanity, el admin muestra un mensaje accionable en vez del error crudo.
- [ ] En edición se puede mover una imagen a portada.
- [ ] Se puede eliminar un vehículo duplicado con confirmación.
- [ ] Se puede guardar descripción enriquecida.

### Público

- [ ] Catálogo muestra badge para reservado/vendido.
- [ ] Ficha muestra badge para reservado/vendido.
- [ ] Ficha muestra descripción correctamente.
- [ ] Vehículos existentes sin rich text no rompen.
- [ ] Filtros actuales del catálogo siguen funcionando.

### Seguridad

- [ ] Acciones admin rechazan requests sin sesión.
- [ ] Secretos quedan solo en env vars.
- [ ] Cookies de sesión son `HttpOnly`.

## Validación

No ejecutar build durante la implementación, por regla del proyecto.

Validaciones permitidas/recomendadas:

- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npx tsc --noEmit --pretty false`
- [ ] revisión manual de `/admin/login`
- [ ] revisión manual de `/admin/vehiculos`
- [ ] revisión manual de `/vehiculos`
- [ ] revisión manual de una ficha `/vehiculos/[slug]`
- [ ] verificación de que `/studio` sigue cargando como respaldo

## Rollback

Rollback por fases:

1. Revertir rutas nuevas bajo `/admin`.
2. Revertir cambios de auth/middleware asociados a `/admin`.
3. Revertir cambios públicos de badges/render de descripción si generan regresión.
4. Mantener datos Sanity intactos salvo migración explícita documentada.

Rollback documental:

- Este frente puede volver a estado `cancelled` si se decide no ejecutar.
- Registrar la cancelación en `docs/logbook.md`.

## Referencias técnicas

- `sanity/schemaTypes/vehicle.ts` — schema real del vehículo.
- `lib/vehicles.ts` — queries/mapping desde Sanity.
- `lib/types.ts` — contrato TypeScript público.
- `app/vehiculos/[slug]/page.tsx` — ficha pública.
- `components/vehicles/VehicleCard.tsx` — card del catálogo.
- `app/studio/[[...tool]]/page.tsx` — Studio actual.
- `middleware.ts` — punto actual para protección/redirects.

## Definition of Done del frente

- [ ] `IMP.md` existe y se mantiene como SOT.
- [ ] Cada fase ejecutada deja evidencia en logbook.
- [ ] Auth privada validada.
- [ ] Alta/edición funcionando contra Sanity.
- [ ] Descripción visible y compatible.
- [ ] Badges de estado visibles.
- [ ] `/studio` sigue disponible como respaldo.
- [ ] Sin regresiones en rutas públicas.
- [ ] Rollback documentado.
