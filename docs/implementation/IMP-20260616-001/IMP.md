# IMP-20260616-001 - Optimizacion de imagenes en /admin (defensa en profundidad)

## Resumen ejecutivo

El panel `/admin` (carga y edicion de vehiculos) es notoriamente mas lento en produccion que en local cuando se suben fotos pesadas. El analisis de codigo confirmo causa raiz: el pipeline de subida de imagenes (`lib/admin/vehicles.ts`) no redimensiona ni recomprime fotos JPG/PNG/WEBP/GIF — las sube byte a byte tal como llegan del dispositivo — y viajan por un salto de red extra (`browser -> Server Action en el VPS -> Sanity`). Ademas, Next.js 14 limita por defecto el body de los Server Actions a 1MB (`experimental.serverActions.bodySizeLimit`), valor que este repo nunca sobreescribe; hoy no se observan errores explicitos porque las fotos actuales rara vez superan ese umbral combinado, pero es un limite latente que va a empezar a rechazar uploads (HTTP 413) en cuanto las fotos sean un poco mas pesadas.

Se implementa una estrategia de defensa en profundidad en tres capas: compresion/resize en el navegador antes de enviar, recompresion/resize en servidor con `sharp` como red de seguridad, y un margen de `bodySizeLimit` mas realista en `next.config.js`. El front publico (catalogo/ficha) no se toca: ya esta bien optimizado via `next/image` + transformaciones de la CDN de Sanity.

## Metadatos

| Campo | Valor |
|-------|-------|
| ID | IMP-20260616-001 |
| Fecha de apertura | 2026-06-16 |
| Ultima actualizacion documental | 2026-06-16 |
| Owner | Queirolo Autos |
| Estado | Implementado en `main`; pendiente verificacion manual del owner en `npm run dev`/deploy |
| Nombre del frente | `optimizacion-imagenes-admin` |
| Rama git | `main` (el owner solicito implementar directo en main; respaldo via tag `backup-pre-optimizacion-imagenes-20260616`) |
| SOT | Este `IMP.md` |
| Log refs | LOG-20260616-001, LOG-20260616-002, LOG-20260616-003 |
| Commit funcional | pendiente (no se commitea sin solicitud explicita del owner) |
| IMP anterior relacionado | IMP-20260614-001 (admin privado), IMP-20260615-001 (validaciones y quick wins de admin) |

## Decision principal

No se cambia la arquitectura del upload (sigue siendo un Server Action `'use server'` que recibe `FormData` y sube a Sanity con el SDK server-side). Se agregan tres capas independientes y acumulativas:

1. **Cliente**: antes de que el `<input type="file">` entregue los archivos al submit, se interceptan en `onChange`, se redimensionan/recomprimen via `canvas` (sin agregar dependencias nuevas) y se reemplazan en el input usando la API nativa `DataTransfer` — el `<form action={saveVehicleAction}>` sigue intacto, solo cambian los bytes que contiene.
2. **Servidor**: `prepareImageForSanity` (hoy solo convierte HEIC/HEIF/TIFF/BMP) se extiende para redimensionar y recomprimir **todos** los formatos con `sharp`, incluyendo auto-rotacion por EXIF (`.rotate()` sin argumentos). Es la red de seguridad si el navegador del owner no soporta `canvas`/`createImageBitmap` o si el paso 1 falla silenciosamente.
3. **Configuracion**: se sube `experimental.serverActions.bodySizeLimit` en `next.config.js` a un valor con margen real (propuesta: `15mb`) para que un fallo en las capas 1-2 no termine en un 413 que el owner no entiende.

Justificacion del orden: la capa de servidor sola NO alcanza, porque el limite de 1MB de Next.js actua sobre el body que llega al Server Action, *antes* de que `prepareImageForSanity` se ejecute. Si no se sube `bodySizeLimit`, cualquier mejora server-side es irrelevante para archivos que ya vienen pesados desde el navegador.

## Problema original

- Las fotos subidas desde celulares modernos pesan varios MB cada una; el pipeline actual no las toca antes de mandarlas a Sanity.
- El owner reporta /admin lento en produccion (VPS Hostinger + EasyPanel) vs local, sin errores explicitos hasta ahora — confirmado por el owner que "solo es lento, siempre termina guardando".
- El deploy es VPS propio (no Vercel), por lo que no hay un techo de payload de plataforma salvando la situacion; el unico limite activo hoy es el default de Next.js de 1MB para Server Actions, no configurado en este repo.
- El front publico (catalogo, ficha) ya esta optimizado (`next.config.js:12-24` genera AVIF/WEBP con `deviceSizes`, `urlFor()` delega a la CDN de Sanity) y queda fuera de alcance.
- Las imagenes ya existentes en Sanity (subidas antes de este frente) no se reprocesan; quedan pesadas hasta que se reemplacen manualmente o se planifique una migracion aparte.

## Alcance

### Capa 1 — Compresion client-side en `VehicleForm.tsx`

- El input de imagenes (`components/admin/VehicleForm.tsx:284-292`) pasa de un `<Input type="file" multiple>` sin handler a uno con `onChange` que:
  1. Lee cada `File` seleccionado.
  2. Lo decodifica con `createImageBitmap(file, { imageOrientation: 'from-image' })` (fallback a `new Image()` + `<canvas>` si el navegador no soporta `createImageBitmap` con esa opcion).
  3. Redimensiona manteniendo aspect ratio si el lado mayor supera ~2000px.
  4. Re-encodea a JPEG calidad ~0.82 con `canvas.toBlob()`.
  5. Reemplaza los archivos del input original con los comprimidos usando `new DataTransfer()` + `input.files = dataTransfer.files`, preservando el `name="images"` que el Server Action espera.
- Mientras se procesa, se muestra un estado breve ("Optimizando imagenes...") para que el owner no piense que el form esta colgado.
- Si la compresion de un archivo falla (formato no soportado por canvas, ej. HEIC en navegadores sin soporte), se deja el archivo original sin tocar — la capa de servidor lo va a manejar igual que hoy.

### Capa 2 — Resize/recompresion server-side en `lib/admin/vehicles.ts`

- `prepareImageForSanity` (linea 128) deja de limitar `sharp` a los formatos convertibles. Nueva logica:
  - Para cualquier imagen valida (JPG/PNG/WEBP/GIF/HEIC/HEIF/TIFF/BMP): `sharp(buffer).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer()`.
  - Se normaliza la salida a JPEG para todos los casos (las fotos de vehiculos no requieren transparencia; simplifica el pipeline y reduce peso vs PNG).
  - Mensajes de error existentes para formatos no soportados se mantienen igual.
- `uploadImages` (linea 267) no cambia su firma; solo consume el buffer ya optimizado.

### Capa 3 — Margen de `bodySizeLimit`

- `next.config.js`: agregar

  ```js
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ['require-in-the-middle'],
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
  ```

- El valor `15mb` da margen para ~8-10 fotos sin comprimir en el peor caso (si la capa 1 fallo en el navegador del owner) sin abrir la puerta a payloads desproporcionados.

## Archivos a modificar

| Archivo | Tipo | Cambio |
|---------|------|--------|
| `components/admin/VehicleForm.tsx` | Modificar | Handler `onChange` en el input de imagenes con compresion client-side via canvas + reemplazo de `input.files` con `DataTransfer` |
| `lib/admin/vehicles.ts` | Modificar | `prepareImageForSanity` resize+recompresion con `sharp` para todos los formatos, salida normalizada a JPEG, auto-rotacion EXIF |
| `next.config.js` | Modificar | Agregar `experimental.serverActions.bodySizeLimit: '15mb'` |
| `lib/admin/imageResize.ts` | Crear | Helper puro `computeTargetDimensions` + constantes compartidas (CLIENT/SERVER max edge y calidad) |
| `lib/admin/clientImageCompression.ts` | Crear | `compressImageFile`/`compressImageFiles` via canvas, solo APIs nativas |
| `__tests__/imageResize.test.ts` | Crear | 7 tests de la logica pura de resize (aspect ratio, no-enlarge, redondeo, input invalido, constantes) |

## Notas de implementacion

- **Por que canvas y no una libreria de compresion client-side**: el proyecto evita dependencias nuevas cuando hay una via nativa razonable (regla de scope discipline). `canvas` + `createImageBitmap` cubre el caso sin agregar peso al bundle del admin.
- **Por que normalizar todo a JPEG en servidor**: simplifica `prepareImageForSanity` (hoy ya tiene una rama JPEG-only para convertibles) y las fotos de vehiculos no necesitan canal alfa. Si en el futuro se necesitara PNG/WEBP con transparencia para otro tipo de contenido, esta decision se revisaria en un frente aparte.
- **Por que `.rotate()` sin argumentos en servidor y no solo en cliente**: `sharp().rotate()` sin argumentos auto-orienta segun el tag EXIF y lo elimina del archivo final. Resolverlo en la capa de servidor garantiza la correccion independientemente de si la capa de cliente corrio o no, evitando el bug clasico de fotos "de costado" cuando canvas no preserva la orientacion EXIF al decodificar.
- **Reprocesar imagenes existentes queda fuera de este frente**: requeriria un script que recorra los documentos `vehicle` en Sanity, descargue cada asset, lo reprocese y lo vuelva a subir, mas decidir si se reemplaza la referencia o se crea un asset nuevo. Se anota como candidato a iteracion futura, no bloquea este frente.
- **Desviacion respecto al plan original (GIF)**: el plan decia "normalizar todo a JPEG", pero en implementacion se decidio dejar pasar GIF sin tocar tanto en cliente como en servidor, para no aplanar animaciones ni cambiar el comportamiento funcional actual de ese formato. Las fotos de vehiculos son JPEG/HEIC, asi que el impacto es nulo y se preserva lo que ya funcionaba.
- **Estructura final del codigo**: la logica pura de calculo de dimensiones vive en `lib/admin/imageResize.ts` (testeable, compartida); la compresion de navegador en `lib/admin/clientImageCompression.ts` (solo APIs nativas, sin dependencias nuevas); el resize de servidor se agrego como helper `resizeToOptimizedJpeg` dentro de `lib/admin/vehicles.ts`.

## Iteracion 2 — Rendimiento de la interfaz /admin

Tras la verificacion manual de la iteracion 1, el owner reporto que el guardado seguia lento (un POST de `/editar` con fotos nuevas tardo ~39,5s en el log de dev) y que la interfaz de /admin se sentia pesada al navegar (clic en "Editar" tardaba segundos). El analisis del log + codigo identifico que la causa no era "solo conexion con Sanity" sino una combinacion. Se aplican 5 mejoras.

### Mejora 5.1 — Subida de imagenes en paralelo (mayor impacto)

- **Causa raiz**: `uploadImages` (`lib/admin/vehicles.ts`) subia las imagenes una por una con un `for ... await`, sumando secuencialmente `sharp` + round-trip a Sanity por cada foto. Con varias fotos eso explicaba los ~39s.
- **Fix**: nuevo helper `lib/admin/concurrency.ts` (`mapWithConcurrency`) que procesa y sube con limite de concurrencia (`UPLOAD_CONCURRENCY = 3`) **preservando el orden** del array (por lo que `images[0]` sigue siendo la portada). `uploadImages` pasa a usarlo.
- **Efecto esperado**: de N×T secuencial a ~ceil(N/3) tandas; con 6 fotos, aproximadamente 3x mas rapido.

### Mejora 5.2 — Proyeccion liviana para el listado

- **Causa**: `getAdminVehicles` traia `ADMIN_VEHICLE_FIELDS` completo (descripcion, las 4 listas de equipamiento, toda la galeria) para cada vehiculo, cuando el listado solo muestra nombre, marca, modelo, version, ano, estado, precio, kilometraje y la portada.
- **Fix**: nuevo tipo `AdminVehicleListItem`, proyeccion `ADMIN_VEHICLE_LIST_FIELDS` (solo `images[0...1]` y campos visibles) y mapper `mapAdminVehicleListItem`. `getAdminVehicles` ahora devuelve `AdminVehicleListItem[]`. El query pesado se conserva solo para la edicion (`getAdminVehicleById`).
- **Nota**: el unico consumidor de `getAdminVehicles` es `app/admin/vehiculos/page.tsx`, que solo usa campos presentes en el tipo liviano; no requiere cambios.

### Mejora 5.3 — Chequeo de slug en paralelo con la subida

- **Causa**: en `saveAdminVehicle`, `ensureUniqueSlug` (round-trip a Sanity) corria antes de `uploadImages`, sumando su latencia en serie.
- **Fix**: ambos son independientes, ahora corren con `Promise.all([ensureUniqueSlug(...), uploadImages(...)])`.

### Mejora 5.4 — Quitar el log ruidoso de Sanity

- **Causa**: `lib/sanity.ts` imprimia `[Sanity] Sanity configured: ...` en cada evaluacion server-side del modulo (se veia repetido decenas de veces en el log).
- **Fix**: se conserva solo la advertencia cuando falta `projectId` (señal util) y se elimina el log de exito.

### Mejora 5.5 — Medir en build de produccion, no en dev

- **Aclaracion (no es codigo)**: parte de la lentitud observada en el log es `✓ Compiling /...` de webpack, un costo unico de `npm run dev` que NO existe en produccion. Para medir performance real hay que usar `npm run build && npm run start` o medir directamente en el deploy. Ademas, la latencia por navegacion en /admin es en parte inherente: las paginas son `force-dynamic` y leen datos frescos de Sanity (`useCdn: false`, `revalidate: 0`) a proposito, para no mostrar inventario desactualizado tras editar.

### Archivos de la iteracion 2

| Archivo | Tipo | Cambio |
|---------|------|--------|
| `lib/admin/concurrency.ts` | Crear | `mapWithConcurrency` con limite de concurrencia y orden preservado |
| `__tests__/concurrency.test.ts` | Crear | 6 tests (orden, tope de concurrencia, vacio, limite > items, limite invalido) |
| `lib/admin/vehicles.ts` | Modificar | `uploadImages` en paralelo; `AdminVehicleListItem` + proyeccion liviana en `getAdminVehicles`; slug y subida con `Promise.all` |
| `lib/sanity.ts` | Modificar | Quitar log de exito; conservar solo warning de config faltante |

## Variables requeridas

Sin variables nuevas. No se modifica ninguna env var existente.

## Rutas afectadas

| Ruta | Cambio |
|------|--------|
| `/admin/vehiculos/nuevo` | Imagenes se comprimen antes de enviarse y se vuelven a optimizar en servidor |
| `/admin/vehiculos/[id]/editar` | Idem para imagenes nuevas agregadas en edicion (las existentes en la galeria no se tocan) |

## Validacion a ejecutar (cuando se implemente)

```bash
npm run lint
npm run test
npx tsc --noEmit --pretty false
```

Verificacion manual:

1. Subir una foto pesada (>5MB, formato JPG de camara/celular real) en `/admin/vehiculos/nuevo` y confirmar que el guardado es notoriamente mas rapido que antes del frente.
2. Subir una foto en orientacion vertical/rotada (tipica de celular) y confirmar que se ve derecha en el catalogo despues de guardar.
3. Subir una foto HEIC de iPhone y confirmar que sigue funcionando igual que hoy (conversion + ahora tambien resize).
4. Editar un vehiculo existente agregando una foto nueva sin marcar "Reemplazar galeria" y confirmar que las imagenes viejas no se alteran.
5. Confirmar en el inspector de red del navegador que el tamano del payload subido bajo significativamente respecto a la foto original.
6. Si es posible, probar con varias fotos pesadas a la vez (5+) para validar que no se dispara el limite de `bodySizeLimit` ni un timeout del VPS.

## Riesgos y mitigaciones

| Riesgo | Mitigacion |
|--------|------------|
| `createImageBitmap` con `imageOrientation: 'from-image'` no soportado en navegador viejo del owner | Fallback a `Image()`+`canvas` sin esa opcion; la capa de servidor corrige rotacion igual via `sharp().rotate()` |
| Compresion client-side tarda visiblemente con fotos muy pesadas o muchos archivos | Mostrar estado "Optimizando imagenes..." mientras se procesa; el resize en servidor de todos modos acota el peor caso |
| Normalizar todo a JPEG pierde transparencia de algun PNG/GIF subido por error | Las fotos de vehiculos no requieren transparencia; si aparece un caso real se trata como excepcion en un frente aparte |
| `bodySizeLimit: 15mb` abre superficie a payloads grandes si alguien hostil llega al form (requiere sesion admin autenticada) | El endpoint ya esta detras de `requireAdminSession()`; no es superficie publica |
| Cambiar `prepareImageForSanity` rompe el manejo de errores actual para formatos no soportados | Se mantiene la misma logica de deteccion de formato/extension; solo se agrega el paso de resize sobre el buffer ya validado |

## Definition of Done

- [x] `IMP.md` creado y es SOT del frente (este documento).
- [x] Punto de restauracion creado (tag `backup-pre-optimizacion-imagenes-20260616`) en lugar de rama; owner pidio implementar en `main`.
- [x] Compresion client-side implementada en `VehicleForm.tsx` (handler `onChange`, estado "Optimizando imagenes...", submit deshabilitado mientras procesa).
- [x] `prepareImageForSanity` extendido con resize+recompresion+auto-rotacion para JPG/PNG/WEBP/HEIC/HEIF/TIFF/BMP (GIF pasa sin tocar).
- [x] `bodySizeLimit: '15mb'` configurado en `next.config.js`.
- [x] Lint, type-check y tests OK iteracion 1 (`next lint` sin warnings · `tsc --noEmit` exit 0 · `jest` 18 tests / 3 suites).
- [x] Iteracion 2 (rendimiento admin): subida en paralelo, proyeccion liviana del listado, slug+subida en `Promise.all`, log de Sanity silenciado.
- [x] Lint, type-check y tests OK iteracion 2 (`next lint` sin warnings · `tsc --noEmit` exit 0 · `jest` 24 tests / 4 suites).
- [ ] Verificacion manual completada por el owner (puntos de iteracion 1 + medir guardado con varias fotos tras la paralelizacion, idealmente en `build`/deploy).
- [x] Entrada en `docs/logbook.md` con resultado de la implementacion (LOG-20260616-002 iteracion 1, LOG-20260616-003 iteracion 2).
- [x] `README.md` actualizado si corresponde (no requiere cambios; sin nuevas env vars ni rutas).

## Rollback

1. Revertir `components/admin/VehicleForm.tsx` al input de imagenes sin handler `onChange`.
2. Revertir `prepareImageForSanity` en `lib/admin/vehicles.ts` a la version que solo convierte HEIC/HEIF/TIFF/BMP.
3. Quitar `serverActions.bodySizeLimit` de `next.config.js`.
4. Iteracion 2: revertir `uploadImages` al `for ... await` secuencial y eliminar `lib/admin/concurrency.ts`; restaurar `getAdminVehicles` para usar `ADMIN_VEHICLE_FIELDS` y devolver `AdminVehicle[]`; volver `ensureUniqueSlug`+`uploadImages` a llamadas secuenciales; restaurar el log de `lib/sanity.ts`.
5. No hay cambios de datos ni de schema de Sanity; rollback es puramente de codigo.
6. Restauracion total al estado previo a todo el frente: `git reset --hard backup-pre-optimizacion-imagenes-20260616`.
