# docs/logbook.md â€” BitÃ¡cora de decisiones y cambios

Registra solo cambios relevantes (no ruido operativo cotidiano).

**TaxonomÃ­a:** `DECISION` | `PLAN` | `ACTION` | `TEST` | `RISK` | `BLOCKER` | `SECURITY` | `INCIDENT`

**Formato de ID:** `LOG-YYYYMMDD-XXX` (contador diario, 3 dÃ­gitos)

---

## Entradas

---

### LOG-20260908-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260908-002 |
| **Fecha**       | 2026-09-08 |
| **Tipo**        | ACTION |
| **Contexto**    | El sitio publico caia con `UND_ERR_CONNECT_TIMEOUT` contra `api.sanity.io` y `cdn.sanity.io` cada vez que se guardaba un vehiculo con fotos desde `/admin`. Evidencia: el cliente Sanity pedia `connect: 300000` pero fallaba a `10000ms`, el default de undici, o sea por debajo de la capa HTTP. Causa raiz: `sharp` y `dns.lookup()` comparten el threadpool de libuv (4 hilos por default); 3 conversiones mozjpeg en paralelo dejaban al DNS sin slots. Lo disparaba trabajo inutil: `CLIENT_MAX_EDGE` (2000px) < `SERVER_MAX_EDGE` (2400px), asi que el resize del servidor no cambiaba un pixel pero igual decodificaba y recomprimia. |
| **Acuerdo/resultado** | Bypass de sharp para JPEG que ya cumplen (nueva funcion pura `shouldSkipServerResize`), `sharp.concurrency(1)`, `UPLOAD_CONCURRENCY` 3 a 1. Cliente publico a `useCdn: true` con `maxRetries: 2`/`timeout: 15000`; admin sigue en `useCdn: false`. Eliminado el reintento duplicado de `fetchWithRetry` (ahora `fetchVehicleData`). Nuevo boundary `app/vehiculos/[slug]/error.tsx`. Envoltorio en `VehicleForm` para el version skew de Server Actions. Se evaluo y descarto `generateBuildId`: con el header `immutable` de un anio en `/_next/static/:path*`, un buildId constante envenena la cache del cliente, y ademas no ataca el error reportado (el ID de un Server Action es independiente del buildId). Nuevo `lib/sanityErrors.ts` con `describeSanityError()`: un fallo de Sanity pasa de ~200 lineas de objeto crudo a una linea accionable. |
| **Impacto**     | Guardar fotos deja de bloquear el DNS del proceso y de tumbar la web publica. Lecturas publicas pasan por CDN de borde. Un fallo de Sanity ya no rompe la ficha de vehiculo. No cambian rutas ni el schema de Sanity. |
| **Validacion**  | `npm run lint` OK sin warnings; `npm test -- --runInBand` OK (53 tests / 6 suites, 29 nuevos); `npx tsc --noEmit --pretty false` OK. No se ejecuto build. **La prueba end-to-end en el VPS queda pendiente y es la unica que confirma el diagnostico.** |
| **Siguiente paso** | EasyPanel ya configurado y desplegado en `5398c87`: el warning `SecretsUsedInArgOrEnv` sobre `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` confirma que la clave llego al `next build`. Queda pendiente la prueba e2e: guardar 8+ fotos con `/vehiculos` abierto en otra pestaña y confirmar cero `UND_ERR_CONNECT_TIMEOUT` NUEVOS (un error nuevo dice `apicdn.sanity.io` y `connect: 15000`; uno con `api.sanity.io` y `connect: 300000` es historial). |
| **Referencias** | `docs/implementation/IMP-20260908-003/IMP.md`, `lib/admin/vehicles.ts`, `lib/admin/imageResize.ts`, `lib/sanity.ts`, `lib/vehicles.ts`, `components/admin/VehicleForm.tsx`, `next.config.js`, tag `pre-threadpool-fix-20260908` |

---

### LOG-20260908-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260908-001 |
| **Fecha**       | 2026-09-08 |
| **Tipo**        | ACTION |
| **Contexto**    | EasyPanel/Nixpacks construía la aplicación con Node 18, mientras las dependencias actuales reportaban `EBADENGINE` y requerían Node 20.19+ o Node 22.12+. |
| **Acuerdo/resultado** | Se creó el tag `pre-node22-20260908` sobre `246ec12`. Se fijaron `engines.node` en `>=22.12.0 <23` y `engines.npm` en `>=10 <12` en `package.json` y `package-lock.json`. No se actualizaron dependencias. |
| **Impacto**     | El siguiente build de Nixpacks debe seleccionar Node 22 y eliminar los avisos de engine incompatibles. El cambio no modifica rutas ni lógica de negocio. |
| **Validacion**  | `npm run lint` OK; `npm test -- --runInBand` OK (24 tests / 4 suites); `npx tsc --noEmit --pretty false` OK; `git diff --check` OK. No se ejecutó build local. |
| **Siguiente paso** | Publicar el cambio y ejecutar un Force Rebuild en EasyPanel. Confirmar `setup | nodejs_22` y ausencia de `EBADENGINE`. |
| **Referencias** | `docs/implementation/IMP-20260908-001/IMP.md`, `package.json`, `package-lock.json`, tag `pre-node22-20260908` |

---

### LOG-20260908-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260908-002 |
| **Fecha**       | 2026-09-08 |
| **Tipo**        | ACTION |
| **Contexto**    | El inventario de Sanity contenía vehículos históricos vendidos mezclados con el stock activo. El owner indicó que solo 15 vehículos mostrados en capturas deben quedar disponibles. |
| **Acuerdo/resultado** | Se actualizaron 58 documentos consultados: los 15 identificados quedaron `available` y los demás quedaron `sold`; se modificó únicamente `status`. La consulta pública `getVehicles()` ahora filtra `status == "available"`. |
| **Impacto**     | El catálogo público y futuros warm-ups trabajarán solo con los 15 vehículos activos. Los registros históricos, sus slugs e imágenes permanecen en Sanity. |
| **Validacion**  | Consulta posterior en Sanity: 15 `available`, 42 `sold`, sin estados inesperados. Validaciones de código pendientes. Se creó el tag `pre-active-inventory-20260908`. |
| **Siguiente paso** | Ejecutar lint, tests y TypeScript; publicar el cambio y validar `/vehiculos`, sitemap y fichas en producción. |
| **Referencias** | `docs/implementation/IMP-20260908-002/IMP.md`, `lib/vehicles.ts`, tag `pre-active-inventory-20260908` |

---

### LOG-20260904-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260904-001 |
| **Fecha**       | 2026-09-04 |
| **Tipo**        | ACTION |
| **Contexto**    | La sección “Autos Destacados” completaba hasta seis vehículos disponibles aunque no estuvieran seleccionados con `isFeatured`. El owner solicitó limpiar todos los actuales y controlar la selección desde cada ficha. |
| **Acuerdo/resultado** | Se creó el tag Git `pre-manual-featured-20260904` sobre el estado previo. Se implementó filtro estricto por `isFeatured`, acción masiva protegida para desmarcar todos, indicador y filtro en el listado admin, y revalidación del home al guardar, limpiar o eliminar. |
| **Impacto**     | El home dejará de mostrar vehículos no seleccionados. La limpieza masiva no elimina documentos ni imágenes; solo cambia el booleano de destacado. |
| **Validacion**  | `npm run lint` OK; `npm run test` OK (24 tests / 4 suites); `npx tsc --noEmit --pretty false` OK; `git diff --check` OK. No se ejecutó build. |
| **Siguiente paso** | Ejecutar desde `/admin/vehiculos` el botón “Quitar todos los destacados” y luego marcar las fichas elegidas. |
| **Referencias** | `docs/implementation/IMP-20260904-001/IMP.md`, `lib/featured-vehicles.ts`, `lib/admin/vehicles.ts`, `app/admin/vehiculos/actions.ts` |

---

### LOG-20260825-005

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260825-005 |
| **Fecha**       | 2026-08-25 |
| **Tipo**        | DECISION |
| **Contexto**    | Se aclaro que `/panel-web-automotoras` identifica la carpeta/módulo donde vivirá el Centro de Control, no una superficie operativa del sitio de Queirolo. |
| **Acuerdo/resultado** | El Centro de Control se planifica en `app/panel-web-automotoras/`; su ruta UI futura será `/panel-web-automotoras`. El Centro de Control incluirá a Queirolo Autos como la primera empresa ya funcionando que será registrada y administrada junto con las futuras webs automotrices. |
| **Impacto**     | Se elimina la ambigüedad entre estructura de código, ruta futura y proyecto administrado. `/admin` continúa siendo el panel operativo de Queirolo y no se reemplaza. |
| **Validacion**  | Se actualizaron el SOT, roadmap, evidencia, índice documental, README y registro de iniciativas para usar la distinción carpeta/módulo versus ruta UI. |
| **Siguiente paso** | Definir el contrato de persistencia, autenticación y secretos del Centro de Control antes de crear `app/panel-web-automotoras/`. |
| **Referencias** | `docs/implementation/IMP-20260825-004/IMP.md`, `ROADMAP.md`, `EVIDENCE.md`, `docs/INDEX.md`, `README.md` |

---

### LOG-20260825-004

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260825-004 |
| **Fecha**       | 2026-08-25 |
| **Tipo**        | PLAN |
| **Contexto**    | El owner definio que `/admin` debe conservarse como panel operativo de cada cliente y que se necesita un dashboard separado para administrar la plataforma reusable de webs automotrices. |
| **Acuerdo/resultado** | Se creo `docs/implementation/IMP-20260825-004/IMP.md` como SOT de `/panel-web-automotoras`, con `ROADMAP.md`, `EVIDENCE.md` y `ROLLBACK.md`. El panel de plataforma tendra auth, cookie, permisos, metadata, configuracion de marca, referencias de secretos, proyectos Sanity, despliegues, dominios, checklist y auditoria separados del `/admin`. Queirolo se registra como primer proyecto existente sin tocar su runtime, dataset ni panel funcional. |
| **Impacto**     | Se establece una frontera clara entre operacion del cliente y provisionamiento de la plataforma. Se evita exponer API keys en el navegador o guardar secretos en texto plano. |
| **Validacion**  | SOT revisado contra `app/admin/`, `middleware.ts`, `lib/admin/auth.ts`, `lib/admin/session.ts`, `lib/admin/vehicles.ts`, `config.ts` y la especificacion tecnica reusable. No se agrego codigo runtime en esta fase. |
| **Siguiente paso** | Aprobar contratos de proyecto, autenticacion separada, persistencia de metadata y estrategia de secretos antes de implementar el shell de `/panel-web-automotoras`. |
| **Referencias** | `docs/implementation/IMP-20260825-004/IMP.md`, `ROADMAP.md`, `EVIDENCE.md`, `ROLLBACK.md`, `docs/reference/automotive-platform-specification.md` |

---

### LOG-20260825-003

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260825-003 |
| **Fecha**       | 2026-08-25 |
| **Tipo**        | DECISION |
| **Contexto**    | Se definio que la documentacion base debe centrarse en la construccion tecnica y operacion de una plataforma web automotriz reusable, sin incluir modelo comercial, precios ni condiciones de suscripcion. Tambien se evaluo como mantener el sitio siempre disponible sin cambiar prematuramente el flujo actual de uploads. |
| **Acuerdo/resultado** | Se creo `docs/reference/automotive-platform-specification.md`. Sanity queda como CMS y proveedor inicial de imagenes; Cloudflare R2 queda como alternativa futura que requiere una capa completa de media. Railway queda recomendado como despliegue primario para la implementacion actual porque conserva Server Actions de hasta 15 MB y procesamiento `sharp`; Vercel queda condicionado a rediseñar el upload por su limite documentado de 4.5 MB en Functions; VPS queda como alternativa de mayor control con mayor carga operativa. Se documentaron dominio, DNS, SSL, health checks, backups, seguridad, observabilidad, escalamiento y proceso para nuevas webs. |
| **Impacto**     | Existe una especificacion tecnica reusable y separada del estado factual de Queirolo Autos. No se modifico codigo de runtime ni infraestructura. |
| **Validacion**  | Contraste con `next.config.js`, `lib/admin/vehicles.ts`, `lib/admin/imageResize.ts`, `lib/vehicles.ts`, `middleware.ts`, `package.json`, rutas y documentacion oficial de Sanity, Next.js, Vercel, Railway y Cloudflare. |
| **Siguiente paso** | Revisar la especificacion con el owner y convertir sus decisiones adoptadas en iniciativas de implementacion solo cuando corresponda. |
| **Referencias** | `docs/reference/automotive-platform-specification.md`, `docs/reference/project-reference.md`, `README.md`, `docs/INDEX.md`, `next.config.js`, `lib/admin/vehicles.ts` |

---

### LOG-20260825-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260825-002 |
| **Fecha**       | 2026-08-25 |
| **Tipo**        | ACTION |
| **Contexto**    | La documentacion activa tenia desfases respecto del codigo actual: validacion ligada a un commit antiguo, iniciativas con estados viejos y ausencia de un panorama unico de arquitectura, APIs, Sanity y almacenamiento de imagenes. |
| **Acuerdo/resultado** | Se creo `docs/reference/project-reference.md` como referencia tecnica integral y se enlazo desde `README.md`, `docs/INDEX.md` y `CLAUDE.md`. Se actualizaron `README.md`, `AGENTS.md`, `CLAUDE.md` y `docs/INDEX.md` con rutas, endpoints, tecnologias, fuente de inventario, ubicacion de fotos y estado operativo actual. Se agregaron practicas concretas y agnosticas al modelo para agentes IA: inspeccion previa, no inventar, cambios minimos, proteccion de secretos, verificacion, trazabilidad y limites explicitos. |
| **Impacto**     | La documentacion distingue claramente frontend, backend dentro de Next.js, CMS Sanity, APIs, assets locales de fallback y fotos reales en Sanity. No se modifico codigo de runtime ni contratos publicos. |
| **Validacion**  | Revision cruzada contra `package.json`, rutas de `app/`, `lib/`, `sanity/`, `config.ts`, `middleware.ts`, schema `vehicle` y arbol de `public/images/`. `npm run lint` sin warnings/errores; `npm run test` 24 tests / 4 suites OK; `npx tsc --noEmit --pretty false` exit 0; `git diff --check` exit 0. No se ejecuto build. |
| **Siguiente paso** | Mantener `docs/reference/project-reference.md` actualizado cuando cambien rutas, integraciones, pipeline de imagenes o variables de entorno. |
| **Referencias** | `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/INDEX.md`, `docs/reference/project-reference.md`, `package.json`, `lib/vehicles.ts`, `lib/admin/vehicles.ts`, `sanity/schemaTypes/vehicle.ts` |

---

### LOG-20260825-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260825-001 |
| **Fecha**       | 2026-08-25 |
| **Tipo**        | ACTION |
| **Contexto**    | La raiz del repositorio mezclaba la documentacion auxiliar con configuraciones requeridas por Next.js, Jest, PostCSS y Sanity, ademas de un script manual de placeholders. El owner pidio reducir el ruido visual sin afectar el funcionamiento. |
| **Acuerdo/resultado** | Se movieron `CONFIG_README.md` y `ProyectoWeb.md` a `docs/reference/` con nombres descriptivos, y `create-placeholders.js` a `scripts/`. El script conserva su comportamiento ajustando la ruta relativa a `public/images/vehicles`. Se mantuvieron en la raiz `README.md`, `AGENTS.md`, `CLAUDE.md`, manifiestos y archivos de configuracion que las herramientas descubren automaticamente. |
| **Impacto**     | Orden organizacional de la raiz, sin cambios de rutas publicas, imports de runtime ni contratos de Next.js/Sanity/Jest. |
| **Validacion**  | No quedaron referencias activas a las rutas antiguas; `node --check scripts/create-placeholders.js` exit 0; `npm run lint` sin warnings/errores; `npm run test` 24 tests / 4 suites OK; `npx tsc --noEmit --pretty false` exit 0. No se ejecuto build por regla del proyecto. |
| **Siguiente paso** | Revisar visualmente la raiz y usar `scripts/create-placeholders.js` solo cuando se necesiten assets de prueba. |
| **Referencias** | `docs/reference/configuration.md`, `docs/reference/project-overview.md`, `scripts/create-placeholders.js`, `README.md`, `docs/INDEX.md` |

---

### LOG-20260620-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260620-002 |
| **Fecha**       | 2026-06-20 |
| **Tipo**        | ACTION |
| **Contexto**    | El owner pidio replicar el mismo fix (catalogo fijo + normalizacion) tambien para `color`, que era texto libre en schema/admin. Verificacion previa via Sanity MCP (`query_documents`) sobre 46 vehiculos: solo 11 tenian `color` cargado, valores `BLANCO`, `CAFE`, `GRIS`, `PLATA` ya en mayuscula salvo un documento (`vehicle-47`) con `Plata` (minuscula inicial). |
| **Acuerdo/resultado** | (1) Nuevo catalogo fuente unica `lib/constants/vehicleColors.ts` (`VEHICLE_COLORS`: BLANCO, NEGRO, GRIS, PLATA, AZUL, ROJO, VERDE, AMARILLO, NARANJO, CAFE, BEIGE, DORADO, VINO + `OTHER_COLOR_OPTION = 'Otra'`), mismo patron en mayusculas que marca/categoria/carroceria. (2) `lib/admin/vehicleOptions.ts`: nuevo `COLOR_OPTIONS`. (3) `sanity/schemaTypes/vehicle.ts`: campo `color` pasa de texto libre a `options.list` con el catalogo + "Otra". (4) `components/admin/VehicleForm.tsx`: select controlado + fallback de texto libre para Color, mismo patron que Marca/Categoria/Carroceria (`colorSelection`, cae en "Otra" si el valor guardado no esta en el catalogo). (5) Normalizacion de dato existente via Sanity MCP (`patch_documents` + `publish_documents`): `vehicle-47` color `Plata` -> `PLATA`. Verificado con `array::unique` post-publish: solo quedan `BLANCO`/`CAFE`/`GRIS`/`PLATA`/`null`. |
| **Impacto**     | Color deja de ser texto libre en altas nuevas desde `/admin`; el unico dato historico inconsistente queda alineado al catalogo. Sin cambios en el front publico ni en `lib/vehicles.ts`/`lib/types.ts`. |
| **Validacion**  | `npx tsc --noEmit --pretty false` exit 0 · `npm run lint` sin warnings/errores · verificacion de datos en Sanity con `query_documents` antes/despues del patch. No se ejecuto build (regla operativa). |
| **Siguiente paso** | Owner revisa en `/studio` y en `/admin/vehiculos/[id]/editar` que el dropdown de Color muestre los valores correctos. Commit/push solo bajo solicitud explicita. |
| **Referencias** | `lib/constants/vehicleColors.ts`, `lib/admin/vehicleOptions.ts`, `sanity/schemaTypes/vehicle.ts`, `components/admin/VehicleForm.tsx`, proyecto Sanity `4124jngl`/dataset `production` |

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


