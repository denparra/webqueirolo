# IMP-20260615-001 - Validaciones admin, boton compartir WhatsApp y quick wins

## Resumen ejecutivo

Se mejora el panel `/admin` con validacion client-side que protege la sesion de edicion cuando faltan campos requeridos (precio, nombre, marca, modelo, ano). Se agrega un boton "Compartir por WhatsApp" en la ficha publica de cada vehiculo y un acceso directo "Ver en sitio" desde el admin en modo edicion. Se corrigen ademas un conjunto de quick wins de alto valor y bajo riesgo detectados en analisis: CTAs muertos, acentos faltantes en H1/H2, metadata titles que bypasean el template del layout, y escaping XSS en el schema script.

## Metadatos

| Campo | Valor |
|-------|-------|
| ID | IMP-20260615-001 |
| Fecha de apertura | 2026-06-15 |
| Ultima actualizacion documental | 2026-06-15 |
| Owner | Queirolo Autos |
| Estado | Implementado; pendiente verificacion manual en dev/deploy |
| Nombre del frente | `validaciones-compartir-quick-wins` |
| Rama git | `feat/validaciones-compartir-quick-wins` |
| SOT | Este `IMP.md` |
| Log refs | LOG-20260615-002, LOG-20260615-003 |
| Commit funcional | pendiente (no se commitea sin solicitud del owner) |
| IMP anterior relacionado | IMP-20260614-001 (admin privado) |

## Decision principal

Agregar validacion client-side en `VehicleForm` sin cambiar la arquitectura de datos ni el server action. El formulario sigue enviando al mismo server action `saveVehicleAction`; la capa client solo previene el submit cuando hay errores y muestra mensajes inline para que el usuario corrija sin perder su trabajo.

Para el boton de compartir se crea un componente client reutilizable `ShareWhatsAppButton` que construye un link `wa.me/?text=...` (sin numero destino, para seleccion libre de contacto) con el nombre del vehiculo y su URL publica.

## Problema original

- Si el usuario borra el precio (u otro campo requerido) y presiona "Guardar", el server action redirige con error y se pierde toda la edicion en curso.
- No existe forma de compartir el link de un vehiculo especifico por WhatsApp desde la ficha publica ni desde el admin.
- Dos botones de la ficha publica ("Agendar Visita", "Consultar Financiamiento") no tienen accion, son elementos muertos en una zona de alta intencion.
- H1 y secciones del home tienen errores ortograficos visibles e indexados por Google.
- Tres paginas (`/nosotros`, `/servicios`, `/contacto`) duplican el nombre del sitio en el title porque no usan el template del layout.
- El JSON-LD no escapa secuencias `</script>` en el output del `JSON.stringify`.

## Alcance

### Mejora 1 — Validacion client-side en admin

- `components/admin/VehicleForm.tsx` pasa a Client Component (`'use client'`).
- Se agrega `useState<Record<string, string>>({})` para manejar errores por campo.
- Se agrega `onSubmit={handleSubmit}` al `<form>`. El handler valida antes de dejar continuar el submit nativo al server action.
- Si hay errores: `e.preventDefault()` + `setErrors(errs)`.
- Si es valido: el form sigue su `action={saveVehicleAction}` sin cambios.
- Mensajes de error se muestran inline debajo de cada campo afectado.
- Los errores de un campo se limpian con el primer `onChange` del input.

**Campos y reglas:**

| Campo | Regla | Mensaje |
|-------|-------|---------|
| `name` | requerido, no vacio | "El nombre del vehiculo es requerido" |
| `brand` | requerido, no vacio | "La marca es requerida" |
| `model` | requerido, no vacio | "El modelo es requerido" |
| `year` | numero entre 1990 y 2030 | "El ano debe estar entre 1990 y 2030" |
| `price` | numero > 0 | "El precio debe ser mayor a 0" |

El server action `app/admin/vehiculos/actions.ts` no se modifica; su validacion sigue como respaldo.

### Mejora 2 — Boton "Compartir por WhatsApp" en ficha publica

- Se crea `components/vehicles/ShareWhatsAppButton.tsx` como Client Component.
- Recibe `{ vehicleName: string; vehicleUrl: string }`.
- Construye `https://wa.me/?text=${encodeURIComponent(mensaje)}` donde el mensaje incluye nombre del vehiculo y URL publica.
- Se inserta en `app/vehiculos/[slug]/page.tsx` debajo del boton "Consultar por WhatsApp" existente.
- La URL publica del vehiculo se arma como `${siteConfig.url}/vehiculos/${vehicle.slug.current}`, patron ya usado en el metadata de la pagina.

### Mejora 3 — "Ver en sitio" desde el admin (modo edicion)

- En `components/admin/VehicleForm.tsx`, cuando el prop `vehicle` tiene valor (modo edicion), se muestra en el header un link "Ver en sitio" que abre `${siteConfig.url}/vehiculos/${vehicle.slug.current}` en nueva pestana.
- Opcionalmente, al lado, un boton "Compartir" que reutiliza el mismo link `wa.me/?text=...` del componente anterior.
- Solo visible en edicion; en creacion no existe slug definitivo aun.

### Quick win 4a — Fix CTAs muertos en ficha publica

- **Archivo:** `app/vehiculos/[slug]/page.tsx`
- "Agendar Visita" → `<a>` con WhatsApp URL: `Hola, quiero agendar una visita para ver el ${brand} ${model} ${year}`.
- "Consultar Financiamiento" → `<Link href="/servicios">` (o anchor `#financiamiento` si existe).

### Quick win 4b — Acentos en H1/H2 del home

- **Archivos:** `components/home/HeroSection.tsx`, `components/home/CategoriesSection.tsx`
- Corregir: `"Tu próximo auto"`, `"Categoría"`, `"vehículo"`, `"según"`.

### Quick win 4c — Metadata titles que bypasean el template

- **Causa raiz detectada en implementacion:** `app/layout.tsx` hacia `title: siteConfig.seo.title` (un string), lo que sobrescribia el objeto `{ default, template }` de `defaultMetadata` y eliminaba el template `%s | Queirolo Autos` para TODO el sitio. Quitar la marca de los titulos hijos sin arreglar esto los habria dejado sin branding.
- **Fix real:** en `app/layout.tsx` se define `title` como objeto `{ default: siteConfig.seo.title, template: \`%s | ${siteConfig.company.fullName}\` }`.
- **Archivos hijos:** `app/nosotros/page.tsx` (`'Nuestra Historia'`), `app/servicios/page.tsx` (`'Servicios - Financiamiento y Consignación'`), `app/contacto/page.tsx` (`'Contacto en Lo Barnechea'`). El layout agrega `| Queirolo Autos` automaticamente.

### Quick win 4d — Escaping XSS en SchemaScript

- **Archivo:** `components/shared/SchemaScript.tsx`
- Reemplazar `</` con `<\/` en el output de `JSON.stringify` antes de insertar en `dangerouslySetInnerHTML`.

## Archivos a modificar

| Archivo | Tipo | Cambio |
|---------|------|--------|
| `components/admin/VehicleForm.tsx` | Modificar | `'use client'`, validacion client-side, boton "Compartir" en edit mode |
| `lib/admin/vehicleFormValidation.ts` | Crear | Funcion pura `validateVehicleForm` (testeable, reutilizable) |
| `__tests__/vehicleFormValidation.test.ts` | Crear | 8 tests de las reglas de validacion |
| `components/vehicles/ShareWhatsAppButton.tsx` | Crear | Boton share (publico + admin) |
| `app/vehiculos/[slug]/page.tsx` | Modificar | Insertar ShareWhatsAppButton, fix CTAs muertos |
| `app/layout.tsx` | Modificar | Restaurar objeto title con `template` (causa raiz 4c) |
| `components/home/HeroSection.tsx` | Modificar | Acentos en H1 y boton "Ver Vehículos" |
| `components/home/CategoriesSection.tsx` | Modificar | Acentos en H2/texto |
| `app/nosotros/page.tsx` | Modificar | Metadata title sin marca duplicada |
| `app/servicios/page.tsx` | Modificar | Metadata title sin marca duplicada |
| `app/contacto/page.tsx` | Modificar | Metadata title sin marca duplicada |
| `components/shared/SchemaScript.tsx` | Modificar | Escaping `<` → `<` en JSON-LD |

## Notas de implementacion

- **"Ver en sitio" ya existia:** `VehicleForm` ya tenia un boton "Preview público" que apunta a la ficha. En vez de duplicarlo, se agrego el boton "Compartir" al lado (solo en modo edicion con slug).
- **Validacion extraida a modulo puro:** la logica vive en `lib/admin/vehicleFormValidation.ts` y no dentro del componente, para testearla sin montar el form completo (que importa server actions). El `handleSubmit` la consume.
- **Mecanismo de validacion:** el `<form>` mantiene `action={saveVehicleAction}`; se agrega `onSubmit` + `noValidate`. Si hay errores, `event.preventDefault()` bloquea el server action (comportamiento verificado en docs de Next.js 14) y se muestran mensajes inline; el primer campo con error recibe foco.
- **Escaping JSON-LD:** se escapan todos los `<` como `<` (mas seguro que solo `</`), patron canonico para JSON-LD inline.

## Variables requeridas

Sin variables nuevas. Se reutiliza `siteConfig.url` y `siteConfig.contact.whatsapp` de `config.ts`.

## Rutas afectadas

| Ruta | Cambio |
|------|--------|
| `/admin/vehiculos/nuevo` | Validacion client-side |
| `/admin/vehiculos/[id]/editar` | Validacion client-side + link "Ver en sitio" |
| `/vehiculos/[slug]` | Boton compartir, CTAs funcionales |
| `/` (home) | Correcciones ortograficas |
| `/nosotros`, `/servicios`, `/contacto` | Metadata titles corregidos |

## Quick wins recomendados para siguiente iteracion

No se incluyen en esta IMP por requerir mayor coordinacion o riesgo de regresion:

| # | Mejora | Valor | Esfuerzo estimado |
|---|--------|-------|-------------------|
| 1 | `loading.tsx` para `/vehiculos` y `/vehiculos/[slug]` | Alto — UX streaming | ~20 min |
| 2 | Category pills con `?categoria=` para filtrar catalogo real | Alto — conversion | ~15 min |
| 3 | Logo `unoptimized` → activar optimizacion de Next.js | Medio — performance | ~10 min |
| 4 | Testimoniales placeholder → reales o eliminar | Medio — confianza | ~15 min |
| 5 | Content-Security-Policy header en `next.config.js` | Alto — seguridad | ~25 min |
| 6 | `manifest.json` split `"any"` / `"maskable"` en entradas separadas | Bajo — PWA audit | ~5 min |

## Validacion a ejecutar post-implementacion

```bash
npm run lint
npm run test
npx tsc --noEmit --pretty false
```

Verificacion manual:

1. `/admin/vehiculos/nuevo` — guardar con precio vacio → error inline sin redirigir. Llenar todo → guarda normal.
2. `/admin/vehiculos/[id]/editar` — link "Ver en sitio" visible y apunta a URL correcta del vehiculo.
3. `/vehiculos/[slug]` — boton "Compartir por WhatsApp" abre WhatsApp con mensaje que incluye URL del auto. Botones "Agendar Visita" y "Consultar Financiamiento" funcionan.
4. Home — acentos correctos en H1 y seccion categorias.
5. `/nosotros`, `/servicios`, `/contacto` — title en `<head>` no duplica "Queirolo Autos".

## Riesgos y mitigaciones

| Riesgo | Mitigacion |
|--------|------------|
| Convertir VehicleForm a Client rompe algo del server action | El `action` del `<form>` sigue igual; solo se agrega `onSubmit`. El server action no se toca. |
| Conflicto de hidratacion en VehicleForm | No hay estado del servidor que deba coincidir con el cliente; el formulario ya recibe `vehicle` como prop serializado. |
| URL publica incorrecta en el boton compartir | Se construye igual que el metadata de la pagina, que ya esta verificado en produccion. |
| Link "Ver en sitio" en modo creacion (sin slug aun) | Solo se renderiza cuando `vehicle?.slug?.current` existe. |
| Metadata title rompe SEO existente | El template del layout ya aplicaba el patron; solo se elimina la duplicacion manual. |

## Definition of Done

- [x] `IMP.md` creado y es SOT del frente.
- [x] Validacion client-side en VehicleForm implementada y probada (8 tests).
- [x] Boton "Compartir por WhatsApp" funcional en ficha publica.
- [x] Acceso "Ver en sitio" en admin (boton "Preview público" preexistente) + "Compartir" en edit mode.
- [x] CTAs muertos en ficha publica corregidos.
- [x] Acentos corregidos en home.
- [x] Metadata titles corregidos (causa raiz en layout + tres paginas).
- [x] SchemaScript con escaping XSS.
- [x] Lint, type-check y tests OK.
- [ ] Verificacion manual completada (pendiente: el owner prueba en `npm run dev`).
- [x] Entrada en `docs/logbook.md`.
- [ ] `README.md` actualizado si corresponde (no requiere cambios; sin nuevas env vars ni rutas).

## Rollback

1. Revertir `components/admin/VehicleForm.tsx` al estado Server Component sin validacion.
2. Eliminar `components/vehicles/ShareWhatsAppButton.tsx`.
3. Revertir `app/vehiculos/[slug]/page.tsx` a version sin boton compartir ni fix de CTAs.
4. Revertir textos en HeroSection y CategoriesSection.
5. Revertir metadata titles en nosotros/servicios/contacto.
6. Revertir SchemaScript.
7. No hay cambios de datos ni de Sanity; rollback es puramente de codigo.
