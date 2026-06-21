# docs/logbook.md â€” BitÃ¡cora de decisiones y cambios

Registra solo cambios relevantes (no ruido operativo cotidiano).

**TaxonomÃ­a:** `DECISION` | `PLAN` | `ACTION` | `TEST` | `RISK` | `BLOCKER` | `SECURITY` | `INCIDENT`

**Formato de ID:** `LOG-YYYYMMDD-XXX` (contador diario, 3 dÃ­gitos)

---

## Entradas

---

### LOG-20260620-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260620-001 |
| **Fecha**       | 2026-06-20 |
| **Tipo**        | ACTION |
| **Contexto**    | Tras el fix de catalogo fijo de marcas (`aa2e18a`), el owner pidio replicar el mismo patron para `category` (Categoria) y `bodyType` (Carroceria), mas normalizar lo ya cargado en Sanity. Verificacion previa via Sanity MCP (`query_documents`) sobre 46 vehiculos: solo 9 tenian `category` y 11 `bodyType`, con valores inconsistentes en mayuscula/minuscula y con/sin tilde (`AUTOMOVIL`, `COUPE`, `STATION WAGON` vs `Coupe`, `Camioneta`). El owner pidio ademas que el catalogo de ambos campos se guarde en MAYUSCULAS, igual que `VEHICLE_BRANDS`. |
| **Acuerdo/resultado** | (1) Nuevos catalogos fuente unica `lib/constants/vehicleCategories.ts` (`VEHICLE_CATEGORIES` + `OTHER_CATEGORY_OPTION = 'Otra'`) y `lib/constants/vehicleBodyTypes.ts` (`VEHICLE_BODY_TYPES` + `OTHER_BODYTYPE_OPTION = 'Otra'`), ambos en mayusculas. (2) `lib/admin/vehicleOptions.ts`: `CATEGORY_OPTIONS` y nuevo `BODYTYPE_OPTIONS` derivados de esos catalogos. (3) `sanity/schemaTypes/vehicle.ts`: campos `category` y `bodyType` ahora usan `options.list` con el catalogo + "Otra" (antes `bodyType` era texto libre sin lista). (4) `components/admin/VehicleForm.tsx`: select controlado + fallback de texto libre para Categoria y Carroceria, mismo patron que Marca (estado `categorySelection`/`bodyTypeSelection`, cae en "Otra" si el valor guardado no esta en el catalogo). (5) Normalizacion de datos existentes via Sanity MCP (`patch_documents` + `publish_documents`) sobre 6 documentos: `SEDÁN`/`COUPÉ`/`CAMIONETA`/`PICKUP` reemplazan a `Sedán`/`Coupé`/`Camioneta`/`Pickup`/`AUTOMOVIL`/`COUPE` segun mapeo legacy->catalogo. Verificado con `array::unique` post-publish: solo quedan valores del catalogo fijo o `null`. El filtro publico de `/vehiculos` no se modifico (fuera de alcance, acordado con el owner). |
| **Impacto**     | Categoria y Carroceria dejan de ser texto libre/inconsistente en altas nuevas desde `/admin`; datos historicos quedan alineados al catalogo. Sin cambios en el front publico ni en `lib/vehicles.ts`/`lib/types.ts`. |
| **Validacion**  | `npx tsc --noEmit --pretty false` exit 0 (dos veces, antes y despues de pasar catalogos a mayusculas) · `npm run lint` sin warnings/errores · verificacion de datos en Sanity con `query_documents` antes/despues del patch. No se ejecuto build (regla operativa). |
| **Siguiente paso** | Owner revisa en `/studio` y en `/admin/vehiculos/[id]/editar` que los dropdowns muestren los valores correctos. Commit/push solo bajo solicitud explicita. |
| **Referencias** | `lib/constants/vehicleCategories.ts`, `lib/constants/vehicleBodyTypes.ts`, `lib/admin/vehicleOptions.ts`, `sanity/schemaTypes/vehicle.ts`, `components/admin/VehicleForm.tsx`, proyecto Sanity `4124jngl`/dataset `production` |

---

### LOG-20260616-003

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260616-003 |
| **Fecha**       | 2026-06-16 |
| **Tipo**        | ACTION |
| **Contexto**    | Iteracion 2 del frente `IMP-20260616-001`. Tras verificar la iteracion 1, el owner reporto guardado aun lento (POST /editar con fotos ~39,5s en log de dev) e interfaz /admin pesada al navegar. Analisis del log + codigo: no era "solo conexion con Sanity" sino subida secuencial de imagenes + sobre-fetch del listado + round-trips en serie + ruido de compilacion de dev. |
| **Acuerdo/resultado** | 5 mejoras aplicadas en `main`: (5.1) `uploadImages` ahora sube en paralelo con limite de concurrencia 3 via nuevo helper `lib/admin/concurrency.ts` (`mapWithConcurrency`, preserva orden -> portada intacta); (5.2) listado usa proyeccion liviana `ADMIN_VEHICLE_LIST_FIELDS` + tipo `AdminVehicleListItem` (solo `images[0...1]` y campos visibles), el query pesado queda solo para editar; (5.3) `ensureUniqueSlug` y `uploadImages` corren con `Promise.all` en `saveAdminVehicle`; (5.4) `lib/sanity.ts` ya no imprime el log de exito en cada render, solo warning si falta projectId; (5.5) aclaracion documental: medir en `build`/deploy, no en dev (el `✓ Compiling` es costo unico de dev; la latencia por navegacion es en parte inherente al `force-dynamic`+`useCdn:false` que da datos frescos). |
| **Impacto**     | Guardado con varias fotos ~3x mas rapido esperado (paralelizacion). Listado mas liviano por menos datos traidos de Sanity. Log del servidor mas limpio. Front publico sin cambios. Sintaxis GROQ `images[0...1]` verificada contra doc oficial via context7 (/sanity-io/groq). |
| **Validacion**  | `npx tsc --noEmit` exit 0 · `npx next lint` sin warnings/errores · `npx jest` 24 tests / 4 suites OK (18 previos + 6 nuevos de concurrency). No se ejecuto build (regla operativa). |
| **Siguiente paso** | Owner mide el guardado con varias fotos tras la paralelizacion, idealmente en `npm run build && npm run start` o en deploy para descartar el costo de compilacion de dev. Commit/push solo bajo solicitud explicita. |
| **Referencias** | `docs/implementation/IMP-20260616-001/IMP.md` (seccion Iteracion 2), `lib/admin/concurrency.ts`, `__tests__/concurrency.test.ts`, `lib/admin/vehicles.ts`, `lib/sanity.ts` |

---

### LOG-20260616-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260616-002 |
| **Fecha**       | 2026-06-16 |
| **Tipo**        | ACTION |
| **Contexto**    | Implementacion del frente `IMP-20260616-001` (optimizacion de imagenes en /admin). El owner pidio crear primero un punto de restauracion, implementar las mejoras directo en `main`, resguardar lo funcional y correr los tests. |
| **Acuerdo/resultado** | (0) Tag de respaldo `backup-pre-optimizacion-imagenes-20260616` creado en HEAD pre-cambios. (1) Capa cliente: `components/admin/VehicleForm.tsx` ahora comprime/redimensiona imagenes en el navegador (canvas) al seleccionarlas via `onChange`, reemplaza `input.files` con `DataTransfer`, muestra "Optimizando imagenes..." y deshabilita el submit mientras procesa. Logica en `lib/admin/clientImageCompression.ts` (solo APIs nativas, sin deps nuevas). (2) Capa servidor: `prepareImageForSanity` en `lib/admin/vehicles.ts` ahora redimensiona (max 2400px, fit inside, sin agrandar) + recomprime a JPEG q82 mozjpeg + auto-rotacion EXIF para JPG/PNG/WEBP/HEIC/HEIF/TIFF/BMP; GIF pasa sin tocar para no aplanar animaciones; si sharp falla en un raster directo, sube el original (no bloquea). (3) Config: `experimental.serverActions.bodySizeLimit: '15mb'` en `next.config.js`. (4) Helper puro `lib/admin/imageResize.ts` (`computeTargetDimensions` + constantes) con 7 tests nuevos. |
| **Impacto**     | Reduce drasticamente los bytes que viajan en la subida desde /admin (cuello de botella en produccion sobre VPS Hostinger). Defensa en profundidad: si la capa cliente no corre (navegador sin soporte), el servidor optimiza igual; el `bodySizeLimit` evita 413 latente. Front publico sin cambios. Desviacion vs plan: GIF se preserva sin convertir a JPEG por seguridad de comportamiento. |
| **Validacion**  | `npx tsc --noEmit` exit 0 · `npx next lint` sin warnings/errores · `npx jest` 18 tests / 3 suites OK (11 previos + 7 nuevos de imageResize). No se ejecuto build (regla operativa). |
| **Siguiente paso** | Verificacion manual del owner en `npm run dev`: subir foto pesada (>5MB) y medir mejora, probar foto rotada de celular, HEIC de iPhone, edicion agregando foto sin reemplazar galeria, y revisar peso del payload en el inspector de red. Commit/push solo bajo solicitud explicita del owner. |
| **Referencias** | `docs/implementation/IMP-20260616-001/IMP.md`, `lib/admin/imageResize.ts`, `lib/admin/clientImageCompression.ts`, `lib/admin/vehicles.ts`, `components/admin/VehicleForm.tsx`, `next.config.js`, `__tests__/imageResize.test.ts`, tag `backup-pre-optimizacion-imagenes-20260616` |

---

### LOG-20260616-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260616-001 |
| **Fecha**       | 2026-06-16 |
| **Tipo**        | PLAN |
| **Contexto**    | Owner reporto /admin lento en produccion (VPS Hostinger + EasyPanel) vs local al editar/crear vehiculos y subir imagenes, sospechando que fotos mas pesadas eran la causa. Analisis de codigo confirmo: `prepareImageForSanity` (`lib/admin/vehicles.ts`) no redimensiona ni recomprime JPG/PNG/WEBP/GIF, solo convierte HEIC/HEIF/TIFF/BMP a JPEG q90 sin resize; el upload viaja por Server Action (`'use server'`) duplicando el salto de red. Se verifico ademas contra documentacion oficial de Next.js 14 que `experimental.serverActions.bodySizeLimit` por defecto es 1MB y este repo no lo sobreescribe — limite latente, no causante de errores hoy segun confirmo el owner ("solo lento, siempre termina guardando"), pero riesgo de 413 con fotos mas pesadas. |
| **Acuerdo/resultado** | Owner elige estrategia "defensa en profundidad": (1) compresion/resize client-side en `VehicleForm.tsx` via canvas antes de enviar, (2) resize+recompresion+auto-rotacion EXIF server-side con `sharp` en `prepareImageForSanity` para todos los formatos (no solo convertibles), (3) subir `bodySizeLimit` a `15mb` en `next.config.js` como red de seguridad. Se crea `IMP-20260616-001` con el plan completo; el front publico (catalogo/ficha) queda fuera de alcance porque ya esta bien optimizado via `next/image` + CDN de Sanity. Reprocesar imagenes ya existentes en Sanity queda fuera de alcance para una iteracion futura. |
| **Impacto**     | Documento de planificacion unicamente; no se modifico codigo todavia. Define alcance, archivos a tocar, riesgos y plan de validacion para la siguiente sesion de implementacion. |
| **Validacion**  | No aplica (no hay codigo nuevo en esta entrada). |
| **Siguiente paso** | Implementar las 3 capas descritas en `IMP-20260616-001`, crear rama `feat/optimizacion-imagenes-admin`, correr `npm run lint`, `npm run test`, `npx tsc --noEmit` y pasar la verificacion manual de 6 puntos antes de pedir aprobacion del owner. |
| **Referencias** | `docs/implementation/IMP-20260616-001/IMP.md`, `lib/admin/vehicles.ts`, `components/admin/VehicleForm.tsx`, `next.config.js` |

---

### LOG-20260615-003

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260615-003 |
| **Fecha**       | 2026-06-15 |
| **Tipo**        | ACTION |
| **Contexto**    | Implementacion del frente `IMP-20260615-001` en rama `feat/validaciones-compartir-quick-wins`. Validacion client-side en admin, boton compartir por WhatsApp, fix de CTAs muertos, acentos en home, metadata titles y escaping XSS en JSON-LD. |
| **Acuerdo/resultado** | (1) `VehicleForm` ahora es client component con `onSubmit`+`noValidate`; valida nombre/marca/modelo/ano(1990-2030)/precio(>0) con mensajes inline y foco al primer error, sin tocar el server action. Logica extraida a `lib/admin/vehicleFormValidation.ts` + 8 tests. (2) Nuevo `ShareWhatsAppButton` reutilizable en ficha publica y admin (modo edicion). (3) CTAs "Agendar Visita" (WhatsApp) y "Consultar Financiamiento" (`/servicios#financiamiento`) ahora funcionan. (4) Acentos corregidos en Hero/Categorias. (5) Metadata titles: se detecto causa raiz en `app/layout.tsx` que sobrescribia el objeto `title` con un string y mataba el template `%s | Queirolo Autos`; se restauro el objeto con `template` y se simplificaron los titulos de nosotros/servicios/contacto. (6) `SchemaScript` escapa `<` como `<`. |
| **Impacto**     | Mejora UX del admin (no se pierde edicion por campos vacios), nuevo canal de comparticion por WhatsApp, CTAs funcionales, branding consistente en titles de TODO el sitio (no solo 3 paginas) y endurecimiento del JSON-LD. Sin nuevas env vars ni rutas. |
| **Validacion**  | `npx tsc --noEmit` OK · `npm run lint` OK (0 warnings) · `npm run test` OK (2 suites, 11 tests). No se ejecuto build (regla operativa). |
| **Siguiente paso** | Verificacion manual en `npm run dev` por el owner (ver IMP). Si aprueba, commitear/pushear bajo solicitud explicita. Quick wins restantes (loading.tsx, filtros de categoria, CSP, etc.) quedan para siguiente iteracion. |
| **Referencias** | `docs/implementation/IMP-20260615-001/IMP.md`, `components/admin/VehicleForm.tsx`, `lib/admin/vehicleFormValidation.ts`, `__tests__/vehicleFormValidation.test.ts`, `components/vehicles/ShareWhatsAppButton.tsx`, `app/vehiculos/[slug]/page.tsx`, `app/layout.tsx`, `components/shared/SchemaScript.tsx` |

---

### LOG-20260615-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260615-002 |
| **Fecha**       | 2026-06-15 |
| **Tipo**        | PLAN |
| **Contexto**    | El owner identifico que el formulario admin no da feedback cuando hay campos vacios y que no existe boton para compartir vehiculos por WhatsApp. Se realizo analisis del codigo y se detectaron ademas quick wins de alto valor/bajo riesgo. |
| **Acuerdo/resultado** | Se crea frente `IMP-20260615-001` con tres mejoras principales: (1) validacion client-side en `VehicleForm` para mostrar errores inline sin redirigir, (2) boton "Compartir por WhatsApp" en ficha publica de cada vehiculo, (3) acceso "Ver en sitio" desde el admin en modo edicion. Ademas se incluyen quick wins: CTAs muertos en ficha, acentos en home, metadata titles duplicados, escaping XSS en SchemaScript. |
| **Impacto**     | Sin impacto de runtime hasta implementacion. El frente queda documentado como SOT. |
| **Siguiente paso** | Implementar segun plan en `docs/implementation/IMP-20260615-001/IMP.md`. |
| **Referencias** | `docs/implementation/IMP-20260615-001/IMP.md`, `components/admin/VehicleForm.tsx`, `app/vehiculos/[slug]/page.tsx` |

---

### LOG-20260615-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260615-001 |
| **Fecha**       | 2026-06-15 |
| **Tipo**        | ACTION |
| **Contexto**    | El owner pidio actualizar toda la documentacion para dejar claras las ultimas mejoras del frente admin de vehiculos. Se verifico que `README.md`, `ProyectoWeb.md`, `CONFIG_README.md`, `CLAUDE.md`, `docs/INDEX.md`, `docs/implementation/README.md` y el SOT `IMP-20260614-001` tenian referencias desactualizadas o insuficientes. |
| **Acuerdo/resultado** | Documentacion actualizada para reflejar `/admin`, auth single-owner, Sanity como fuente de verdad, carga/conversion de imagenes, eliminacion de duplicados, orden de portada, badges de estado, descripcion rich text, validaciones ejecutadas y pendientes de verificacion manual en deploy. Tambien se alinearon `AGENTS.md` y `CLAUDE.md` en los puntos criticos. |
| **Impacto**     | La fuente documental ahora coincide con el estado funcional reciente y reduce riesgo de operar con instrucciones viejas como `config.js`, `claudedocs`, forms simulados o sitemap mock. No hay cambios funcionales de runtime. |
| **Siguiente paso** | Revisar visualmente la documentacion si se quiere pulir redaccion; si el owner lo solicita, commitear y pushear estos cambios documentales. |
| **Referencias** | `README.md`, `ProyectoWeb.md`, `CONFIG_README.md`, `CLAUDE.md`, `AGENTS.md`, `docs/INDEX.md`, `docs/implementation/README.md`, `docs/implementation/IMP-20260614-001/IMP.md` |

---

### LOG-20260614-006

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260614-006 |
| **Fecha**       | 2026-06-14 |
| **Tipo**        | ACTION |
| **Contexto**    | El owner reportó error de hidratación de React/Next tras usar el admin. Se revisaron los componentes cliente recién agregados y el `VehicleCard`. |
| **Acuerdo/resultado** | Se endureció el patrón cliente/servidor: el formulario con server action de eliminación queda en Server Component y solo el botón de confirmación queda como Client Component (`DeleteVehicleSubmitButton`). Además, `VehicleCard` ya no calcula `isInCompare()` desde Zustand/localStorage antes de montar; usa `false` hasta `mounted`, igual que favoritos. |
| **Impacto**     | Reduce fuentes probables de mismatch SSR/cliente sin cambiar UX. La eliminación y la comparación siguen funcionando igual después de hidratación. |
| **Siguiente paso** | Reiniciar `npm run dev`, recargar sin caché y confirmar la ruta donde aparecía el error. |
| **Referencias** | `components/admin/DeleteVehicleSubmitButton.tsx`, `components/admin/VehicleForm.tsx`, `app/admin/vehiculos/page.tsx`, `components/vehicles/VehicleCard.tsx` |

---

### LOG-20260614-005

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260614-005 |
| **Fecha**       | 2026-06-14 |
| **Tipo**        | ACTION |
| **Contexto**    | El owner publicó un vehículo duplicado y pidió poder eliminarlo desde `/admin`; además pidió poder mover imágenes en edición para escoger cuál queda como portada. |
| **Acuerdo/resultado** | Implementado borrado seguro de documentos `vehicle` con confirmación desde listado y edición. El borrado elimina el documento del inventario, no los assets de imagen de Sanity. Implementado reordenamiento client-side de galería existente: los hidden inputs `existingAssetIds` se envían en el orden elegido, por lo que `images[0]` queda como portada pública. |
| **Impacto**     | El owner puede corregir duplicados sin entrar a Studio y controlar la portada del catálogo/ficha desde el admin. No cambia el modelo de datos: se aprovecha el orden existente del array `images`. |
| **Siguiente paso** | Probar en `/admin/vehiculos`: editar un vehículo, usar “Usar como portada”, guardar y verificar en `/vehiculos`; eliminar el duplicado con el botón “Eliminar”. |
| **Referencias** | `app/admin/vehiculos/actions.ts`, `lib/admin/vehicles.ts`, `components/admin/DeleteVehicleButton.tsx`, `components/admin/ExistingImagesManager.tsx`, `components/admin/VehicleForm.tsx`, `app/admin/vehiculos/page.tsx` |

---

### LOG-20260614-004

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260614-004 |
| **Fecha**       | 2026-06-14 |
| **Tipo**        | ACTION |
| **Contexto**    | Al cargar imágenes desde `/admin`, Sanity devolvía `Unprocessable Entity - Invalid image, could not process`. El uploader aceptaba cualquier `image/*` y enviaba el MIME del navegador sin normalizar, lo que deja pasar HEIC/iPhone u otros formatos que Sanity puede rechazar. |
| **Acuerdo/resultado** | Se agregó preparación server-side antes del upload: JPG/PNG/WEBP/GIF se suben directo con MIME inferido por extensión si hace falta; HEIC/HEIF/TIFF/BMP se intentan convertir a JPG con `sharp`; formatos no soportados devuelven un mensaje claro. El input del admin ahora comunica formatos recomendados. |
| **Impacto**     | Reduce fallos crudos de Sanity y mejora la carga desde celulares/cámaras. Si `sharp` no puede convertir un HEIC específico, el owner recibe instrucción directa para convertirlo a JPG/PNG. |
| **Siguiente paso** | Reintentar carga con las mismas imágenes. Si son HEIC y falla conversión, convertirlas a JPG antes de subir. |
| **Referencias** | `lib/admin/vehicles.ts`, `components/admin/VehicleForm.tsx`, `docs/implementation/IMP-20260614-001/IMP.md` |

---

### LOG-20260614-003

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260614-003 |
| **Fecha**       | 2026-06-14 |
| **Tipo**        | TEST |
| **Contexto**    | Validación posterior a implementar el frente funcional `/admin` para gestión de vehículos. |
| **Acuerdo/resultado** | `npm run lint` OK. `npm run test` OK (3 tests). `npx tsc --noEmit --pretty false` inicialmente detectó un import no usado/incompatible en `__tests__/smoke.test.ts` (`screen` desde `@testing-library/react`); se eliminó el import y el type-check quedó OK. No se ejecutó build por regla del proyecto. |
| **Impacto**     | La implementación queda validada por lint, tests y type-check sin emitir build. El ajuste del test no cambia comportamiento runtime. |
| **Siguiente paso** | Configurar env vars reales (`ADMIN_*`, `SANITY_API_WRITE_TOKEN`) y hacer verificación manual creando/editando un vehículo en Sanity. |
| **Referencias** | `__tests__/smoke.test.ts`, `app/admin/`, `lib/admin/`, `components/admin/`, `middleware.ts` |

---

### LOG-20260614-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260614-002 |
| **Fecha**       | 2026-06-14 |
| **Tipo**        | ACTION |
| **Contexto**    | Implementación de las fases funcionales del frente `IMP-20260614-001` para dejar operativo un admin privado de vehículos sin reemplazar Sanity Studio. |
| **Acuerdo/resultado** | Implementado `/admin` con login formal single-owner, cookie `HttpOnly` firmada, protección en `middleware.ts`, listado admin, alta/edición de vehículos contra Sanity, subida de imágenes con `SANITY_API_WRITE_TOKEN`, descripción enriquecida compatible con texto antiguo y badges públicos para `available/reserved/sold`. En edición, los campos opcionales borrados se limpian en Sanity con `null` para evitar valores fantasma. Se documentaron env vars nuevas en `AGENTS.md` y `CLAUDE.md`. |
| **Impacto**     | El owner obtiene flujo privado de gestión de inventario sobre Sanity. El frontend público mantiene rutas existentes y ahora muestra descripción/estado. `/studio` queda como respaldo técnico. |
| **Siguiente paso** | Configurar secrets reales en `.env.local`/deploy y probar manualmente `/admin/login`, creación, edición, cambio de estado e imágenes. |
| **Referencias** | `docs/implementation/IMP-20260614-001/IMP.md`, `app/admin/`, `components/admin/VehicleForm.tsx`, `lib/admin/`, `lib/richText.ts`, `components/shared/RichTextRenderer.tsx`, `components/vehicles/VehicleStatusBadge.tsx`, `app/vehiculos/[slug]/page.tsx`, `components/vehicles/VehicleCard.tsx`, `sanity/schemaTypes/vehicle.ts`, `middleware.ts`, `AGENTS.md`, `CLAUDE.md` |

---

### LOG-20260614-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260614-001 |
| **Fecha**       | 2026-06-14 |
| **Tipo**        | PLAN |
| **Contexto**    | El owner pidió estructurar e implementar un nuevo frente documental/SOT para mejorar la interfaz donde carga vehículos. Hoy la operación depende de bulk o `/studio`; se quiere una ruta privada tipo `/admin` para alta/edición interactiva, manejo de estados (`vendido`, `reservado`) y mejora de la descripción de la ficha. |
| **Acuerdo/resultado** | Creado `IMP-20260614-001` como fuente de verdad del frente `admin-vehiculos`. Decisiones registradas: admin ligero propio en `/admin`, Sanity sigue como fuente de verdad, `/studio` queda como respaldo técnico, login formal single-owner, v1 incluye alta + edición + imágenes + estado + preview básica, `reserved`/`sold` visibles con badge, y `description` evoluciona a texto enriquecido con fallback. |
| **Impacto**     | Sin cambios funcionales ni de runtime. Se establece guía implementable y límites para avanzar sin dañar rutas públicas, SEO, leads ni Studio. |
| **Siguiente paso** | Ejecutar el frente por fases: F0 auth/preparación segura, F1 shell/login, F2 listado admin, F3 alta/edición, F4 imágenes/preview, F5 descripción enriquecida, F6 badges públicos. |
| **Referencias** | `docs/implementation/IMP-20260614-001/IMP.md`, `sanity/schemaTypes/vehicle.ts`, `lib/vehicles.ts`, `app/vehiculos/[slug]/page.tsx`, `middleware.ts`, `app/studio/[[...tool]]/page.tsx` |

---

### LOG-20260607-005

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260607-005 |
| **Fecha**       | 2026-06-07 |
| **Tipo**        | ACTION |
| **Contexto**    | Ejecución de los 2 fixes de código de la Fase 4 de `IMP-20260607-002` (migración de dominio): Google aún mostraba la marca antigua "Queirolo Mundo 4x4". |
| **Acuerdo/resultado** | `public/manifest.json`: `name`/`short_name` → "Queirolo Autos" + `description` actualizada (el manifest PWA reinyectaba el nombre viejo). `next.config.js`: `async redirects()` con `/stock` y `/stock/:path*` → `/vehiculos` (301 permanente). JSON válido + `npm run lint` OK. |
| **Impacto**     | Se corta la fuente de código que alimentaba el nombre antiguo; las URLs viejas redirigen al equivalente nuevo. El resto (favicon/título viejos en el SERP) es recrawl de Google + acciones en GSC (Removals, Solicitar indexación, propiedad de dominio). |
| **Siguiente paso** | Owner: en GSC agregar propiedad de dominio, enviar sitemap, Solicitar indexación del home, usar Eliminaciones para URLs viejas. Verificar post-deploy: `curl /manifest.json` (nombre nuevo), `curl -I /stock` (301). |
| **Referencias** | `public/manifest.json`, `next.config.js`, `docs/implementation/IMP-20260607-002/IMP.md` |

---

### LOG-20260607-004

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260607-004 |
| **Fecha**       | 2026-06-07 |
| **Tipo**        | PLAN |
| **Contexto**    | El owner pidió abrir un frente para los pendientes SEO diferidos (OG dinámica por vehículo en Linux + micro-fixes) con análisis del proyecto y recomendación antes de implementar. |
| **Acuerdo/resultado** | Creado `IMP-20260607-002`. Fase 1: OG por vehículo a 1200×630 recortando la foto de Sanity (`@sanity/image-url` ya instalado, `cdn.sanity.io` acepta `?w&h&fit=crop`) **sin `next/og`** (bajo riesgo). Fase 2: micro-fixes (`title.template` muerto, `og:title` home, `noindex` filtros = dejar). Fase 3: OG dinámica branded (`next/og` nativo Next 14) opcional, verificar en Linux. **Fase 4 (P0) agregada**: migración de dominio — Google muestra "Queirolo Mundo 4x4" viejo. Diagnóstico: ~80% caché + 2 fixes reales (`manifest.json` con nombre viejo → "Queirolo Autos"; redirect `/stock`→`/vehiculos` en `next.config`). El resto (favicon/título viejos) es recrawl de Google + GSC (Removals, Solicitar indexación, propiedad de dominio). |
| **Impacto**     | Camino claro y priorizado para cerrar la deuda SEO restante sin repetir el bug de `@vercel/og` en Windows. Sin cambios de código aún (frente en planning). |
| **Siguiente paso** | El owner decide qué fases ejecutar. Recomendado: Fase 1 (+ Fase 2 como pulido); Fase 3 solo si se quiere branding en el share. |
| **Referencias** | `docs/implementation/IMP-20260607-002/IMP.md`, `app/vehiculos/[slug]/page.tsx`, `lib/sanity.ts`, `lib/seo.ts`, `app/layout.tsx` |

---

### LOG-20260607-003

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260607-003 |
| **Fecha**       | 2026-06-07 |
| **Tipo**        | ACTION |
| **Contexto**    | Análisis SEO detallado (continuación de IMP-20260605-004) detectó 2 quick wins sueltos: la imagen Open Graph por defecto (`/og-image.jpg`) referenciada pero nunca creada → preview rota al compartir el sitio por WhatsApp/redes; y rutas legales que enlazaban URLs con 301. Se aclaró que el bug previo de OG fue por `@vercel/og` en Windows (dinámica), no aplica a una imagen estática. |
| **Acuerdo/resultado** | **F1:** creado `public/og-image.jpg` (1200×630, branded, logo blanco sobre fondo oscuro + franja roja) con `sharp` (estático, sin `next/og`). Sin cambio de código (ya estaba referenciado). **F2:** sitemap y footer apuntan a `/privacidad` (no al redirect `/politica-de-privacidad`); `config.urls.terms` → `/terminos-y-condiciones`. Creado `IMP-20260607-001`. |
| **Impacto**     | Share del sitio muestra tarjeta con logo (antes preview rota); URLs legales sin saltos 301. `npm run lint` OK; sin build. |
| **Siguiente paso** | Post-deploy: validar `og-image.jpg` (200) en Facebook Sharing Debugger / WhatsApp. Diferido: OG dinámica por vehículo en Linux; micro-fixes (dims OG, noindex filtros, title.template). |
| **Referencias** | `public/og-image.jpg`, `lib/seo.ts`, `app/sitemap.ts`, `components/layout/Footer.tsx`, `config.ts`, `docs/implementation/IMP-20260607-001/IMP.md` |

---

### LOG-20260607-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260607-002 |
| **Fecha**       | 2026-06-07 |
| **Tipo**        | ACTION |
| **Contexto**    | Fase 4 del frente `IMP-20260606-002`: la tarjeta de equipo en `/nosotros` usaba un placeholder `<div>` y nunca renderizaba la imagen. El owner decidió no usar retrato de la persona sino una foto de un auto antiguo de su época de Turismo Carretera. |
| **Acuerdo/resultado** | Se cableó la tarjeta con `<Image>` condicional (cae a placeholder si el archivo no existe) y se agregó `imageAlt` descriptivo al array `team` en `app/nosotros/page.tsx`. `banner.jpg` de consignación ya estaba resuelto en sesión previa. Quedan por subir los assets `mario.jpg` (3:4) y `history.jpg` (1:1). |
| **Impacto**     | F4 código completo; el frente queda a la espera solo de subir 2 imágenes (F3). `npm run lint` sin errores; sin build (regla del proyecto). |
| **Siguiente paso** | Owner sube `public/images/team/mario.jpg` y `public/images/history.jpg`; verificar en `/nosotros`. |
| **Referencias** | `app/nosotros/page.tsx`, `docs/implementation/IMP-20260606-002/IMAGES-SOT.md`, `docs/implementation/IMP-20260606-002/ROADMAP.md` |

---

### LOG-20260607-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260607-001 |
| **Fecha**       | 2026-06-07 |
| **Tipo**        | ACTION |
| **Contexto**    | Ejecución de las fases 1 y 2 del frente institucional `IMP-20260606-002`, más mejoras de copy pedidas por el owner: consistencia de "+10.000" vehículos vendidos, eliminación del "100%" de financiamiento (no aplica), rediseño de 2 tarjetas de "¿Por qué elegir?", y corrección de tildes/ñ en "años" en toda la web. |
| **Acuerdo/resultado** | **F1 (localización):** `Lo Barnechea` como referencia pública; mapa degradado a vista de zona (zoom 13) con coordenadas referenciales; `streetAddress` del JSON-LD vuelto condicional. **F2 (crédito):** "Cuota mensual referencial", "Desde aprox. $X/mes" en cards y ficha; "100%" → "Financieras" en home y StatsBar. **Extras:** StatsBar "500+" → "+10.000"; tarjeta "60+/Revisión Técnica" reemplazada (stat "✓"); tildes/ñ corregidas en home, StatsBar y privacidad; `RECIEN`→`RECIÉN`. |
| **Impacto**     | Baja el riesgo legal/comercial (sin promesa de 100% ni dirección exacta desactualizada) y elimina incoherencias visibles (conteo de ventas, tildes). `npm run lint` sin errores; no se ejecutó build (regla del proyecto). |
| **Siguiente paso** | Fase 3: subir `history.jpg` (1:1) y `mario.jpg` (3:4). Fase 4: habilitar la tarjeta de equipo en `/nosotros` cuando exista `mario.jpg`. |
| **Referencias** | `config.ts`, `lib/seo.ts`, `app/contacto/page.tsx`, `app/vehiculos/layout.tsx`, `components/maps/LazyContactMap.tsx`, `app/page.tsx`, `components/home/StatsBar.tsx`, `components/home/FeaturedVehicleCard.tsx`, `components/vehicles/VehicleCard.tsx`, `components/forms/LoanCalculator.tsx`, `app/vehiculos/[slug]/page.tsx`, `app/privacidad/page.tsx`, `docs/implementation/IMP-20260606-002/ROADMAP.md` |

---

### LOG-20260606-005

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260606-005 |
| **Fecha**       | 2026-06-06 |
| **Tipo**        | PLAN |
| **Contexto**    | El owner decidió ampliar el frente abierto para no tratar imágenes de forma aislada. Además del bloque visual, pidió estructurar por fases dos ajustes institucionales sensibles: (1) ubicación pública transitoria mientras buscan local y (2) mensajes de crédito para dejar explícito que la cuota es aproximada y depende de la financiera, evitando compromisos o riesgos legales. |
| **Acuerdo/resultado** | Se reestructuró `IMP-20260606-002` como frente institucional por fases. Quedó definido un roadmap de 4 fases: F1 localización pública transitoria (`Lo Barnechea` y revisión de mapa/metadata), F2 crédito referencial/legal (cuotas y disclaimers consistentes), F3 assets institucionales (según `IMAGES-SOT.md`) y F4 ajuste visual final de consignación/equipo. |
| **Impacto**     | El frente deja de ser solo un listado de imágenes y pasa a ordenar primero los riesgos más delicados: inconsistencia de ubicación y promesas de financiamiento. Esto baja probabilidad de errores de comunicación antes de tocar UI. |
| **Siguiente paso** | Ejecutar primero Fase 1 en documentación/plan de cambio y luego pasar a implementación controlada. Después, Fase 2 antes de tocar assets visuales. |
| **Referencias** | `docs/implementation/IMP-20260606-002/IMP.md`, `docs/implementation/IMP-20260606-002/ROADMAP.md`, `docs/implementation/IMP-20260606-002/IMAGES-SOT.md`, `config.ts`, `app/servicios/page.tsx`, `components/forms/LoanCalculator.tsx`, `app/contacto/page.tsx` |

---

### LOG-20260606-004

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260606-004 |
| **Fecha**       | 2026-06-06 |
| **Tipo**        | PLAN |
| **Contexto**    | Auditoría enfocada en imágenes de páginas institucionales (`/servicios`, `/nosotros`, `/contacto`) para definir exactamente qué assets conviene subir y cómo corregir el bloque “Diseños de Consignación” sin improvisar. |
| **Acuerdo/resultado** | Se creó la iniciativa `IMP-20260606-002` con un SOT documental de imágenes institucionales. El documento separa assets reutilizables vs. pendientes, fija formato/tamaño/ratio por uso, y propone como opción recomendada reemplazar las 2 imágenes de consignación por piezas verticales 4:5 en vez de forzar el componente actual con assets horizontales/cuadrados. |
| **Impacto**     | Reduce ambigüedad antes de subir nuevos archivos. Permite decidir uploads con criterio visual y técnico, evitando más placeholders o recortes incorrectos en páginas institucionales. |
| **Siguiente paso** | Owner decide qué assets subir según el SOT: mínimo recomendado `history`, `mario` y 2 nuevas imágenes de consignación; opcionalmente una nueva `showroom` en mayor resolución. |
| **Referencias** | `docs/implementation/IMP-20260606-002/IMP.md`, `docs/implementation/IMP-20260606-002/IMAGES-SOT.md`, `app/nosotros/page.tsx`, `app/contacto/page.tsx`, `app/servicios/page.tsx`, `components/services/ConsignmentDesignGallery.tsx` |

---
### LOG-20260606-003

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260606-003 |
| **Fecha**       | 2026-06-06 |
| **Tipo**        | DECISION |
| **Contexto**    | El repositorio tenÃ­a dos carpetas de documentaciÃ³n (`/claudedocs` y `/docs`) con roles solapados. `/claudedocs` acumulaba fases terminadas (01â€“08), propuestas viejas y backups que generaban ruido. `claudedocs/CLAUDE.md` era el archivo de contexto del proyecto, pero al estar dentro de una subcarpeta no se cargaba automÃ¡ticamente por Claude Code. |
| **Acuerdo/resultado** | **DECISIÃ“N:** consolidar en `/docs` como Ãºnica carpeta activa. `claudedocs/CLAUDE.md` movido a `CLAUDE.md` (raÃ­z) â€” Claude Code lo carga automÃ¡ticamente. AnÃ¡lisis activos de junio 2026 movidos a `docs/analysis/`. Frentes terminados (fases 01â€“08, propuesta-web, backups, etc.) archivados en `docs/archive/` (solo lectura). Carpeta `claudedocs/` eliminada. `AGENTS.md`, `docs/INDEX.md` y `CLAUDE.md` actualizados con nuevas referencias. CorrecciÃ³n de referencia stale en `AGENTS.md` (sitemap usaba mockVehicles â†’ ya usa Sanity desde IMP-20260605-003). |
| **Impacto**     | Una sola carpeta activa de docs. Contexto Claude Code cargado automÃ¡ticamente desde `CLAUDE.md` raÃ­z. Frentes obsoletos fuera del path activo. ConvenciÃ³n clara para nuevos frentes. |
| **Siguiente paso** | Para nuevos anÃ¡lisis/propuestas: `docs/analysis/YYYY-MM-DD-tema.md`. Para implementaciones formales: `docs/implementation/IMP-YYYYMMDD-XXX/`. `docs/archive/` es solo lectura. |
| **Referencias** | `CLAUDE.md`, `AGENTS.md`, `docs/INDEX.md`, `docs/analysis/`, `docs/archive/` |

---

### LOG-20260606-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260606-002 |
| **Fecha**       | 2026-06-06 |
| **Tipo**        | ACTION |
| **Contexto**    | Reemplazo controlado de los iconos pÃºblicos del sitio usando los assets preparados en `docs/img` para favicon, Apple Touch Icon y PWA manifest. |
| **Acuerdo/resultado** | Completado sin tocar cÃ³digo de rutas ni metadata. Se copiaron los 4 archivos verificados por tamaÃ±o/nombre a sus destinos ya referenciados por la app: `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icons/icon-192x192.png` y `public/icons/icon-512x512.png`. |
| **Impacto**     | El sitio ahora sirve los iconos finales esperados para pestaÃ±a del navegador, atajos iOS y manifest PWA. Sin cambios funcionales en pÃ¡ginas, formularios ni integraciones. |
| **Siguiente paso** | VerificaciÃ³n visual manual en navegador: pestaÃ±a, recarga dura y acceso desde dispositivo mÃ³vil/iOS si se quiere validar el icono agregado a pantalla de inicio. |
| **Referencias** | `docs/img/`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icons/icon-192x192.png`, `public/icons/icon-512x512.png`, `app/layout.tsx`, `public/manifest.json` |

---

### LOG-20260606-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260606-001 |
| **Fecha**       | 2026-06-06 |
| **Tipo**        | DECISION |
| **Contexto**    | AuditorÃ­a pre-producciÃ³n (lanzamiento el lunes). Bloqueante de negocio: `app/api/submit-lead/route.ts` validaba con Zod + rate-limit pero NO entregaba los leads (solo `console.log` + `TODO`) â†’ toda solicitud de contacto/financiamiento/consignaciÃ³n se perdÃ­a mientras el usuario veÃ­a "Â¡Enviado!". AdemÃ¡s, el schema Zod descartaba RUT y comuna del financiamiento, y `/studio` (CMS Sanity) quedaba indexable. |
| **Acuerdo/resultado** | **DECISIÃ“N:** habilitar WhatsApp como canal de entrega **TRANSITORIO** para llegar al lanzamiento; el futuro serÃ¡ integraciÃ³n server-side **n8n â†’ correo**. Implementado en rama `fix/leads-whatsapp-prelaunch`: nuevo `lib/leads.ts` (contrato `Lead` + formateo + builder `wa.me`); los 3 forms abren WhatsApp con el lead completo (recupera RUT/comuna); `/api/submit-lead` queda **preparado** para n8n (schema completo + reenvÃ­o env-gated a `N8N_LEAD_WEBHOOK_URL`); `/studio` agregado al `disallow` de robots. Lint + type-check OK. |
| **Impacto**     | Los leads dejan de perderse (llegan al WhatsApp del negocio con todos los datos); RUT/comuna ya no se pierden; CMS fuera del Ã­ndice. UX: botÃ³n "Enviar por WhatsApp". |
| **Siguiente paso** | VerificaciÃ³n manual del deep link en local. Commit/merge cuando se indique. **MigraciÃ³n futura (solo config):** setear `N8N_LEAD_WEBHOOK_URL` + volver los forms a `POST /api/submit-lead`. Tanda 3 post-lanzamiento (`.env.example`, `withSentryConfig`, CSP, tasa calculate-loan). |
| **Referencias** | `IMP-20260606-001/IMP.md`, `lib/leads.ts`, `components/forms/{ContactForm,FinancingForm,ConsignmentForm}.tsx`, `app/api/submit-lead/route.ts`, `app/robots.ts`, `claudedocs/00-Analysis-Planning/2026-06-05-performance-audit.md` |

---

### LOG-20260605-005

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260605-005 |
| **Fecha**       | 2026-06-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Plan SEO fases 5-8 (amplificaciÃ³n y mediciÃ³n): OG por vehÃ­culo, FAQ+tildes, patente/canonical, GSC/dominio. |
| **Acuerdo/resultado** | Completado en rama `feat/seo-fase5-8-polish`. F6: FAQ schema en `/servicios` + tildes del home desde `config.seo`. F7: `plate` removido de GROQ/mapper/tipo (ya no viaja al cliente) + canonical estÃ¡tico del listado a `/vehiculos`. F8: GSC vÃ­a env `NEXT_PUBLIC_GSC_VERIFICATION` + `middleware.ts` redirect 308 apexâ†’www. F5 (OG dinÃ¡mica next/og): BLOQUEADA por bug de `@vercel/og` en Windows (ERR_INVALID_URL al cargar su fuente por defecto, crash en import del mÃ³dulo, no sorteable) â†’ revertida a OG estÃ¡tica con la foto real del vehÃ­culo (Fase 1). Build 60/60 OK + runtime de producciÃ³n verificado. |
| **Impacto**     | Rich result FAQ; canonical consolida filtros; redirect de dominio elimina contenido duplicado (mayor impacto del diagnÃ³stico); patente fuera del payload. OG mantiene foto por vehÃ­culo (sin regresiÃ³n). |
| **Siguiente paso** | Commit + merge a main con tag. Follow-ups: OG dinÃ¡mica en Linux, confirmar 308 en hosting, activar GSC, consolidar rutas legales duplicadas. |
| **Referencias** | `IMP-20260605-004/IMP.md`, `app/servicios/page.tsx`, `app/page.tsx`, `app/vehiculos/layout.tsx`, `lib/seo.ts`, `lib/types.ts`, `lib/vehicles.ts`, `middleware.ts` |

---

### LOG-20260605-004

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260605-004 |
| **Fecha**       | 2026-06-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Plan SEO Fase 4. `app/sitemap.ts` usaba `mockVehicles` (datos mock) en vez del inventario real de Sanity â†’ declaraba URLs falsas/viejas a Google y ocultaba el stock real. |
| **Acuerdo/resultado** | Completado en rama `feat/seo-fase4-sitemap-sanity`. `sitemap()` pasa a `async` con `getVehicles()` (try/catch), filtra `sold` y registros sin slug/imÃ¡genes, `revalidate=60`. Se agregÃ³ `/contacto` a las estÃ¡ticas. Verificado: `/sitemap.xml` con 50 URLs (8 estÃ¡ticas + 42 fichas con slugs reales de Sanity), coincide con el listado. |
| **Impacto**     | Crawleo: Google recibe el inventario real (42 vehÃ­culos). Vendidos excluidos del sitemap (siguen indexables). Sin cambios funcionales en la web. |
| **Siguiente paso** | Commit + merge a main con tag. Continuar con fases 5-7. |
| **Referencias** | `IMP-20260605-003/IMP.md`, `app/sitemap.ts`, `lib/vehicles.ts` |

---

### LOG-20260605-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260605-002 |
| **Fecha**       | 2026-06-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Plan SEO fases 2-3. Fase 2: el listado `/vehiculos` era `'use client'` con fetch en `useEffect` â†’ Googlebot veÃ­a "Cargando vehÃ­culosâ€¦" (sin autos ni enlaces en el HTML). Fase 3: el JSON-LD (`Car`/`ItemList`/`Breadcrumb`) estaba escrito en `lib/seo.ts` pero sin usar. |
| **Acuerdo/resultado** | Completado en rama `feat/seo-fase2-3-listado-server-jsonld`. Fase 2: `app/vehiculos/page.tsx` pasa a Server Component (`getVehicles()` server + `revalidate=60`); lÃ³gica de filtros movida a nuevo `components/vehicles/VehicleListingClient.tsx` que recibe `initialVehicles` por props. Fase 3: `generateVehicleSchema` ajustado (availability dinÃ¡mica por status, sin VIN/patente, imagen absoluta) y `generateVehicleListSchema` recibe la lista real; render de `Car`+`Breadcrumb` en ficha e `ItemList` en listado. |
| **Impacto**     | SEO: 42 autos + enlaces internos en HTML inicial; rich results habilitados. Sin cambios de UX (filtros preservados). |
| **Siguiente paso** | Commit a main + tag. Continuar con fases 5-7 (OG dinÃ¡mica, FAQ/tildes, patente/filtros noindex). |
| **Referencias** | `IMP-20260605-002/IMP.md`, `app/vehiculos/page.tsx`, `components/vehicles/VehicleListingClient.tsx`, `lib/seo.ts`, `app/vehiculos/[slug]/page.tsx` |

---

### TEST-20260605 â€” VerificaciÃ³n de build y runtime (asociado a LOG-20260605-002)

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260605-003 |
| **Fecha**       | 2026-06-05 |
| **Tipo**        | TEST |
| **Contexto**    | En `dev` apareciÃ³ `TypeError: Cannot read properties of undefined (reading 'call')` (error de carga de chunk) al hidratar `/vehiculos` tras convertirla a Server Component. |
| **Acuerdo/resultado** | Diagnosticado como bug conocido de Next 14.2 con `experimental.instrumentationHook` + HMR (dev-only): el SSR devolvÃ­a 200 con los 42 autos, y el home â€”sin cambiosâ€” tambiÃ©n mostraba mismatches de hidrataciÃ³n preexistentes. `npm run build` pasÃ³ limpio (`60/60` pÃ¡ginas) y el runtime de producciÃ³n (`next start`) renderizÃ³ `/vehiculos` sin errores, con filtros funcionando (BMW â†’ 2 de 42) y JSON-LD presente. |
| **Impacto**     | Confirma que las fases 2-3 funcionan en producciÃ³n; el error de dev no es bloqueante ni real para prod. |
| **Siguiente paso** | Proceder con commit. |
| **Referencias** | `IMP-20260605-002/IMP.md`, `next.config.js` (instrumentationHook) |

---

### LOG-20260605-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260605-001 |
| **Fecha**       | 2026-06-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Inicio de implementaciÃ³n del plan SEO por fases. Fase 0: la URL canÃ³nica estaba hardcodeada en 3 archivos. Fase 1: las fichas `/vehiculos/[slug]` no tenÃ­an `generateMetadata` â†’ todo el catÃ¡logo heredaba el mismo `<title>`/`description` genÃ©rico (tÃ­tulos duplicados, el daÃ±o SEO #1). |
| **Acuerdo/resultado** | Completado en rama `feat/seo-fase0-1-metadata-vehiculo`. Fase 0: `config.url` agregado y consumido en `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`. Fase 1: `generateMetadata` por vehÃ­culo con tÃ­tulo `{Marca} {Modelo} {VersiÃ³n} {AÃ±o} usado | Queirolo Autos` (sin precio/km), description de Sanity con fallback autogenerado, `canonical` absoluto, Open Graph + Twitter con la foto del auto. Lint âœ…, type-check sin errores en archivos modificados. |
| **Impacto**     | SEO: fin de tÃ­tulos duplicados en el catÃ¡logo; canonical por ficha; share con foto real. TÃ©cnico: `config.url` como fuente Ãºnica del host. Sin cambios visuales ni de rutas/negocio. |
| **Siguiente paso** | VerificaciÃ³n visual en local (View Source de fichas). Continuar con Fase 2 (listado a Server Component) y Fase 3-4 segÃºn plan. |
| **Referencias** | `IMP-20260605-001/IMP.md`, `config.ts`, `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/vehiculos/[slug]/page.tsx`, `claudedocs/00-Analysis-Planning/2026-06-05-seo-plan-tecnico-implementacion.md` |

---

### LOG-20260422-004

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260422-004 |
| **Fecha**       | 2026-04-22 |
| **Tipo**        | TEST |
| **Contexto**    | ValidaciÃ³n de build de producciÃ³n tras correcciÃ³n de tipado en `lib/vehicles.ts` que fallaba en VPS. |
| **Acuerdo/resultado** | `npm run build` completado exitosamente (compilaciÃ³n, type-check y generaciÃ³n estÃ¡tica sin errores). |
| **Impacto**     | Reduce riesgo de fallo en deploy por TypeScript estricto en entorno Docker/VPS. |
| **Siguiente paso** | Reintentar deploy en VPS con el nuevo commit. |
| **Referencias** | `lib/vehicles.ts` |

---

### LOG-20260422-003

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260422-003 |
| **Fecha**       | 2026-04-22 |
| **Tipo**        | ACTION |
| **Contexto**    | Error de deploy en VPS: `Type error: Parameter 'url' implicitly has an 'any' type` en `lib/vehicles.ts:56`. |
| **Acuerdo/resultado** | Completado. Se tiparon explÃ­citamente `safeImages` y `rawImages` como `string[]`, se filtrÃ³ `images` con type guard (`unknown -> string`) y se tipÃ³ el parÃ¡metro `url` en `map` para compatibilidad con `strict: true`. |
| **Impacto**     | Sin cambios funcionales en negocio/UI; solo endurecimiento de tipos para evitar falla de compilaciÃ³n en producciÃ³n. |
| **Siguiente paso** | Mantener este patrÃ³n de type guard cuando se mapeen datos provenientes de Sanity tipados como `any`. |
| **Referencias** | `lib/vehicles.ts` |

---

### LOG-20260422-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260422-002 |
| **Fecha**       | 2026-04-22 |
| **Tipo**        | TEST |
| **Contexto**    | VerificaciÃ³n posterior a la inclusiÃ³n de galerÃ­a con lightbox en la secciÃ³n de consignaciÃ³n. |
| **Acuerdo/resultado** | `npm run lint` ejecutado con resultado exitoso (`âœ” No ESLint warnings or errors`). |
| **Impacto**     | Confirma consistencia de tipado/estilo sin afectar funcionalidad existente de formularios ni API. |
| **Siguiente paso** | Validar visualmente `/servicios#consignacion` en desktop y mÃ³vil. |
| **Referencias** | `app/servicios/page.tsx`, `components/services/ConsignmentDesignGallery.tsx` |

---

### LOG-20260422-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260422-001 |
| **Fecha**       | 2026-04-22 |
| **Tipo**        | ACTION |
| **Contexto**    | Solicitud de incluir diseÃ±os de consignaciÃ³n en `/servicios` sin romper la funcionalidad existente. |
| **Acuerdo/resultado** | Completado. Se aÃ±adiÃ³ una galerÃ­a de consignaciÃ³n con vista ampliada (lightbox), navegaciÃ³n entre imÃ¡genes y accesos por clic/teclado, limitada al tab de consignaciÃ³n. Se mantuvo intacta la lÃ³gica de `ConsignmentForm` y `POST /api/submit-lead`. |
| **Impacto**     | Cambio solo de presentaciÃ³n dentro de la secciÃ³n de consignaciÃ³n. No hay cambios en rutas, backend ni payload de leads. |
| **Siguiente paso** | Si se agregan mÃ¡s diseÃ±os, solo actualizar el arreglo `images` en `app/servicios/page.tsx`. |
| **Referencias** | `app/servicios/page.tsx`, `components/services/ConsignmentDesignGallery.tsx`, `public/images/consignacion/c1.png`, `public/images/consignacion/c2.png` |

---

### LOG-20260405-005

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260405-005 |
| **Fecha**       | 2026-04-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Delay visible al cargar imÃ¡genes de autos. Causa: Next.js Image Optimizer descargaba imÃ¡genes full-res (~2-5 MB) desde Sanity CDN en cada cold-cache hit. |
| **Acuerdo/resultado** | Completado. P1: `applySanityTransform()` en `vehicles.ts` y `featured-vehicles.ts` â€” URLs con `?w=800/1200&q=80&auto=format&fit=max` reducen payload 80-90%. P2: LQIP `blurDataURL` aÃ±adido a `VehicleCard` (ya existÃ­a en `FeaturedVehicleCard`). P3: `sizes` aÃ±adido a `VehicleDetailGallery` main + thumbnails â€” elimina warnings de consola. P4: `priority={idx < 4}` en primeras 4 cards de `/vehiculos`. Lint: âœ…. |
| **Impacto**     | Solo cambios en data-fetching (GROQ + mapper) y props de `next/image`. Sin cambios a rutas, lÃ³gica de negocio ni UI visual. |
| **Siguiente paso** | Verificar en producciÃ³n que Sanity CDN responde los params de transformaciÃ³n correctamente. |
| **Referencias** | `IMP-20260405-005/IMP.md`, `lib/vehicles.ts`, `lib/featured-vehicles.ts`, `lib/types.ts`, `VehicleCard.tsx`, `VehicleDetailGallery.tsx` |

---

### LOG-20260405-004

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260405-004 |
| **Fecha**       | 2026-04-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Valores N/A aparecÃ­an en la pÃ¡gina de detalle `/vehiculos/[slug]` â€” Motor, Potencia, Torque siempre N/A; TransmisiÃ³n/Combustible/Color N/A para la mayorÃ­a de vehÃ­culos. |
| **Acuerdo/resultado** | Completado. Tres causas resueltas: (1) Filas Motor/Potencia/Torque removidas â€” no hay datos en Sanity. (2) Fallbacks `'N/A'` â†’ `''`/`undefined` + render condicional para transmission/fuelType/color/bodyType. (3) `bodyType` agregado a queries GROQ. Se creÃ³ `lib/constants/featureLabels.ts` con 40+ mapeos para que las caracterÃ­sticas del tab muestren labels legibles en espaÃ±ol. Lint: âœ…. |
| **Impacto**     | Solo cambios de presentaciÃ³n y mapper. Sin cambios a rutas, schema de Sanity ni lÃ³gica de negocio. |
| **Siguiente paso** | Owner ingresa datos opcionales (transmisiÃ³n, combustible, color, categorÃ­a, carrocerÃ­a) en Sanity Studio para cada vehÃ­culo que los requiera. |
| **Referencias** | `IMP-20260405-004/IMP.md`, `lib/constants/featureLabels.ts`, `lib/vehicles.ts`, `lib/types.ts`, `app/vehiculos/[slug]/page.tsx` |

---

### LOG-20260405-003

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260405-003 |
| **Fecha**       | 2026-04-05 |
| **Tipo**        | ACTION |
| **Contexto**    | ImplementaciÃ³n de mejoras de diseÃ±o basadas en IMP-20260405-002. P1: fix crop imÃ¡genes. P2: rediseÃ±o cards con Magic. P3/P4: hero y espaciado. |
| **Acuerdo/resultado** | Completado. P1 (crop fix): `aspect-video`â†’`aspect-[4/3]` + `object-contain` + `bg-gray-50` en `VehicleCard.tsx` y `FeaturedVehicleCard.tsx`. P2 (rediseÃ±o card): border fino, shadow-sm, specs sin aÃ±o duplicado, CTA "Ver VehÃ­culo", padding compacto. P4 (espaciado): `py-16 lg:py-24`â†’`py-10 lg:py-16`. Lint: âœ…. Validado con Chrome DevTools â€” autos completamente visibles. |
| **Impacto**     | Solo cambios de presentaciÃ³n (CSS/layout). Sin cambios a lÃ³gica, rutas, datos o APIs. |
| **Siguiente paso** | P3 (hero con auto real) queda pendiente para prÃ³xima iteraciÃ³n. |
| **Referencias** | `IMP-20260405-003/IMP.md`, `v1-pre-redesign` tag |

---

### LOG-20260405-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260405-002 |
| **Fecha**       | 2026-04-05 |
| **Tipo**        | PLAN |
| **Contexto**    | AnÃ¡lisis de diseÃ±o completo del sitio para mejoras con Magic MCP. Se identificÃ³ causa raÃ­z del recorte de autos en cards y mÃºltiples mejoras de UX/UI. |
| **Acuerdo/resultado** | Tag de respaldo `v1-pre-redesign` creado. AnÃ¡lisis documentado con Playwright screenshots (8 capturas). Issue principal: `aspect-video` (16:9) en `VehicleCard.tsx:65` y `FeaturedVehicleCard.tsx:32` causa crop de autos. Plan de mejoras P1-P4 definido. **Sin cambios aplicados al cÃ³digo.** |
| **Impacto**     | Ninguno aÃºn. Solo anÃ¡lisis y planificaciÃ³n. |
| **Siguiente paso** | Owner confirma opciÃ³n de soluciÃ³n para P1. Abrir IMP-20260405-003 para implementaciÃ³n. |
| **Referencias** | `IMP-20260405-002/IMP.md`, `docs/implementation/IMP-20260405-002/screenshots/`, tag `v1-pre-redesign` |

---

### LOG-20260405-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260405-001 |
| **Fecha**       | 2026-04-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Bootstrap del estÃ¡ndar de orden y trazabilidad (Prompt Maestro Universal v1 adaptado al stack Next.js/Sanity). |
| **Acuerdo/resultado** | Se creÃ³ la estructura mÃ­nima obligatoria: `docs/logbook.md`, `docs/INDEX.md`, `docs/implementation/README.md`, `docs/implementation/IMP-template.md`, y la iniciativa `IMP-20260405-001`. Se actualizaron `AGENTS.md` y `claudedocs/CLAUDE.md` con co-gobierno y reglas de trazabilidad. |
| **Impacto**     | NingÃºn cambio funcional. Solo archivos de gobernanza y documentaciÃ³n. El proyecto funciona igual. |
| **Siguiente paso** | Usar `IMP-YYYYMMDD-XXX/` para toda iniciativa futura. Registrar en logbook cualquier cambio relevante. |
| **Referencias** | `IMP-20260405-001/IMP.md`, `AGENTS.md`, `claudedocs/CLAUDE.md`, `docs/implementation/README.md` |

---


