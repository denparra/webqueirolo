# IMP-20260908-003 - Estabilizar produccion: threadpool y timeouts a Sanity

## Objetivo

Cortar la cadena que hacia caer el sitio publico cada vez que el owner guardaba un
vehiculo con fotos desde `/admin`, y evitar que un redeploy rompa un formulario abierto.

## Diagnostico

Los tres sintomas reportados eran una sola cadena causal, no fallas independientes.

**Evidencia clave** (dump de error del cliente Sanity en el VPS):

```
timeout: { connect: 300000, socket: 300000 }   <- lo que pidio el cliente
ConnectTimeoutError (attempted address: 4124jngl.api.sanity.io:443, timeout: 10000ms)
```

El cliente pidio 300s de connect timeout y fallo a los 10s, que es el `connectTimeout`
por defecto de undici. El fallo ocurre por debajo de la capa HTTP: en `getaddrinfo`/TCP.
Fallaban `api.sanity.io` y `cdn.sanity.io` a la vez: dos hosts, un punto compartido (DNS).

**Mecanismo:**

- `dns.lookup()` de Node corre en el threadpool de libuv (getaddrinfo es sincronico y se
  despacha a hilos). Default: 4 hilos.
- `sharp` usa ese mismo threadpool.
- `uploadImages` procesaba 3 imagenes en paralelo con `mozjpeg: true`, el encoder JPEG
  mas costoso disponible.

Al guardar, sharp ocupaba 3 de 4 hilos, todo `getaddrinfo` quedaba encolado, ningun fetch
a Sanity resolvia el dominio y moria a los 10s. Por eso la web publica y el Image Optimizer
caian en el mismo instante en que el owner guardaba.

**Trabajo inutil que lo disparaba:** `CLIENT_MAX_EDGE` (2000px) < `SERVER_MAX_EDGE` (2400px).
El navegador ya reducia a 2000px y comprimia a JPEG; el resize del servidor, con
`withoutEnlargement: true`, no cambiaba un solo pixel, pero igual decodificaba y
recomprimia con mozjpeg. CPU y threadpool quemados a cambio de cero pixeles, ademas de
degradar calidad por doble compresion.

**Amplificacion:** `useCdn: false` en el cliente publico mandaba toda lectura al origen sin
cache de borde, y `fetchWithRetry` reintentaba encima de los reintentos propios del cliente
Sanity (`attemptNumber: 5` en los logs). Una carga de pagina podia encadenar ~10 intentos de
10s cada uno: ~100s colgada ocupando slots del threadpool. Bucle auto-sostenido.

**Los otros dos sintomas:**

- `npm error signal SIGTERM` no era un crash. `Ready in 750ms` seguido de SIGTERM es una
  parada limpia (redeploy/restart). Se veia como error porque el contenedor corre
  `sh -c "npm start"`: npm queda como PID 1 y no reenvia señales correctamente al hijo.
- `Failed to find Server Action` es version skew. Los IDs de Server Action de Next 14 son un
  hash atado al build. Documentacion oficial de Next (`docs/01-app/02-guides/data-security.mdx`):
  "a new private key is generated for each build, these actions are only valid for the specific
  build in which they were created". Fijar `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` es lo que extiende
  esa validez entre builds. El `Cannot read properties of undefined (reading 'workers')` es un
  bug de Next 14 en su propio manejador de error: es la mascara, no la causa.

## Cambios

### Causa raiz (threadpool)

- `lib/admin/imageResize.ts`: nueva funcion pura `shouldSkipServerResize()`.
- `lib/admin/vehicles.ts`: `prepareImageForSanity` saltea sharp cuando la imagen ya es JPEG,
  no supera `SERVER_MAX_EDGE` y no trae orientacion EXIF pendiente. Solo lee metadata de
  cabecera (`.metadata()`), que no decodifica el bitmap.
- `lib/admin/vehicles.ts`: `sharp.concurrency(1)` acota los hilos internos de libvips.
- `lib/admin/vehicles.ts`: `UPLOAD_CONCURRENCY` de 3 a 1.

### Amplificacion de reintentos

- `lib/sanity.ts`: cliente publico pasa a `useCdn: true` (apicdn.sanity.io, cacheado en borde)
  con `maxRetries: 2` y `timeout: 15000`.
- `lib/admin/vehicles.ts`: `adminReadClient` mantiene `useCdn: false` (el panel necesita lectura
  fresca post-escritura) con `maxRetries: 2`, `timeout: 15000`. El cliente de escritura usa
  `timeout: 60000` porque `assets.upload` manda varios MB.
- `lib/vehicles.ts`: `fetchWithRetry` renombrada a `fetchVehicleData` y despojada del reintento
  duplicado. El reintento vive en una sola capa: la del cliente.

### Degradacion elegante

- `app/vehiculos/[slug]/error.tsx` (nuevo): boundary de la ficha. `getVehicleBySlug` relanza en
  produccion y `app/vehiculos/[slug]/page.tsx:101` no tenia try/catch; ese era el
  `digest: '542444009'` de los logs. `/vehiculos` ya degradaba bien via `loadError`.
- `components/admin/VehicleForm.tsx`: envoltorio `submitVehicle` que captura el fallo del server
  action y muestra un aviso accionable. Relanza los errores con digest `NEXT_REDIRECT` /
  `NEXT_NOT_FOUND`, porque `redirect()` de Next se implementa lanzando: tragarlos romperia el
  camino feliz del guardado.

### Deploy

- `next.config.js`: sin cambios. Se evaluo y se DESCARTO un `generateBuildId` determinista.

  Motivo: el mismo archivo sirve `/_next/static/:path*` con `Cache-Control: public,
  max-age=31536000, immutable`. Un buildId constante deja `/_next/static/<id>/_buildManifest.js`
  y `_ssgManifest.js` cacheados un anio como inmutables mientras su contenido cambia en cada
  deploy: envenenamiento de cache del cliente.

  Ademas no ataca el problema reportado. El buildId afecta las URLs de los chunks, cuya falla
  es `ChunkLoadError`, que el owner nunca reporto. El ID de un Server Action es independiente
  del buildId. El ID aleatorio por build que Next genera por defecto es el comportamiento
  correcto aca, y con un solo contenedor no hay skew entre replicas que justifique fijarlo.

### Legibilidad de logs

- `lib/sanityErrors.ts` (nuevo): `describeSanityError()` resume un fallo de Sanity/red en UNA
  linea (mensaje + `code` de la causa + `statusCode` + host/pathname sin querystring). Antes se
  logueaba el objeto crudo, y el cliente de Sanity le adjunta el `request` completo con la query
  GROQ URL-encoded: ~200 lineas por fallo. Durante este mismo incidente la evidencia decisiva
  quedo enterrada en ese muro de texto.

  Ejemplo de salida:
  `fetch failed | code=UND_ERR_CONNECT_TIMEOUT | url=4124jngl.api.sanity.io/v2025-01-01/data/query/production`

  Es un modulo SIN dependencias a proposito: `lib/sanity.ts` importa `next-sanity`, que es ESM y
  Jest no puede parsear. Mismo criterio que `lib/admin/imageResize.ts`.

- Call sites actualizados: `lib/vehicles.ts:129` y `:178`, `app/vehiculos/page.tsx:18`,
  `app/sitemap.ts:87`.

## Confirmaciones del deploy 5398c87 (2026-09-08 22:07 UTC)

- `setup | nodejs_22, npm-9_x, openssl`: runtime correcto.
- `start | node_modules/.bin/next start`: el Start Command tomo efecto; npm dejo de ser PID 1.
- El warning de Docker `SecretsUsedInArgOrEnv: ... ENV "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY"`
  **prueba que la clave llego al `next build`**. Queda respondida la duda abierta: EasyPanel SI
  propaga las variables de Environment al build de Nixpacks.
- `Generating static pages (37/37)`: los fetches a Sanity en build funcionaron.

### Como datar un error en el log de runtime

Los `UND_ERR_CONNECT_TIMEOUT` visibles tras el deploy eran del contenedor viejo. Tres señales:

| Señal | Build viejo | Build nuevo |
|---|---|---|
| Host | `4124jngl.api.sanity.io` | `apicdn.sanity.io` (por `useCdn: true`) |
| `timeout` | `{ connect: 300000 }` | `{ connect: 15000 }` |
| Posicion | antes de `Ready in ...` | despues |

Un error con `api.sanity.io` y `connect: 300000` es historial, no un fallo nuevo.

## Validacion

- `npm run lint` OK, sin warnings.
- `npm test -- --runInBand` OK: 53 tests en 6 suites (24 previos + 18 del bypass + 11 del logger).
- `npx tsc --noEmit --pretty false` OK.
- No se ejecuto `npm run build` por la regla operativa del repositorio.
- **Pendiente y no verificado**: la prueba end-to-end en el VPS. Es la unica que confirma el
  diagnostico; ver "Pendientes".

## Pendientes (requieren acceso al VPS, no se hicieron en esta sesion)

Confirmar el diagnostico desde una shell dentro del contenedor, en reposo y durante un guardado
con 5+ fotos:

```bash
time node -e "require('dns').lookup('api.sanity.io',(e,a)=>console.log(e||a))"
getent ahosts api.sanity.io
ip -6 route show default
```

Si en reposo resuelve en <100ms y durante el guardado se va a >10s, el diagnostico queda
confirmado. Si ademas hay registro AAAA sin ruta IPv6 por defecto, agregar
`require('dns').setDefaultResultOrder('ipv4first')` en `instrumentation.ts`.

Configurar en EasyPanel:

- `UV_THREADPOOL_SIZE=16` (defensa en profundidad; da aire al DNS aunque sharp este ocupado).
- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`: base64 cuyo valor decodificado mida 16, 24 o 32 bytes
  (`openssl rand -base64 32`), generado UNA sola vez y nunca rotado. Es la causa estructural del
  `Failed to find Server Action`.

  IMPORTANTE: es una variable de BUILD, no solo de runtime. La documentacion oficial la muestra
  como `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=your-generated-key next build`. Si no llega al
  `next build` no sirve de nada, asi que despues de setearla hay que disparar un Deploy completo,
  no un restart. Si EasyPanel no propagara las variables de Environment al build de Nixpacks,
  moverla al campo Build Command como `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=<clave> npm run build`.

- NO setear `BUILD_ID`: ver la nota en "Cambios > Deploy".
- Comando de arranque: `node_modules/.bin/next start` en lugar de `npm start`. Saca a npm de
  PID 1, hace que SIGTERM llegue limpio a Next y elimina el ruido `npm error command failed`.

Prueba end-to-end: con el sitio publico abierto en otra pestaña navegando `/vehiculos`, guardar
un vehiculo con 8+ fotos desde `/admin`. Criterio de exito: cero `UND_ERR_CONNECT_TIMEOUT` en
los logs y la web publica respondiendo durante todo el guardado.

## Riesgos y notas

- `useCdn: true` introduce cache de borde en lecturas publicas. Con `revalidate: 60` ya vigente
  en `/vehiculos` y `app/sitemap.ts` la frescura no deberia degradarse de forma perceptible,
  pero un cambio en Sanity puede tardar un poco mas en verse en la web publica. El admin no se
  ve afectado: mantiene `useCdn: false`.
- El bypass de sharp deja de normalizar a JPEG las imagenes que ya son JPEG y cumplen. Los PNG y
  WEBP se siguen convirtiendo como antes.
- El envoltorio `submitVehicle` es un mitigante, no una cura: solo
  `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` evita el version skew de raiz. Su comportamiento exacto
  ante el error real todavia no se verifico contra produccion.
- Deuda registrada, fuera de alcance: `status == "available"` en `lib/vehicles.ts` excluye tambien
  `reserved` (hoy sin impacto: 58 vehiculos / 15 available / 43 sold / 0 reserved, verificado en
  Sanity); `output: 'standalone'` para bajar el peso del contenedor; `withSentryConfig` nunca se
  invoca en `next.config.js` pese a que `@sentry/nextjs` esta instalado y `instrumentation.ts`
  carga los configs.

## Rollback

Tag `pre-threadpool-fix-20260908` sobre el commit `d20f7a7`. Los cambios de codigo son locales a
`lib/sanity.ts`, `lib/vehicles.ts`, `lib/admin/vehicles.ts`, `lib/admin/imageResize.ts`,
`components/admin/VehicleForm.tsx`, `lib/sanityErrors.ts`, `app/sitemap.ts`,
`app/vehiculos/page.tsx` y `app/vehiculos/[slug]/error.tsx`. `next.config.js` queda
sin cambios respecto de `main`. Las
variables de entorno son reversibles desde EasyPanel sin redeploy de codigo.
