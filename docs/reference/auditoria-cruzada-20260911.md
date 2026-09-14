# Auditoria cruzada de fallas: `web` vs. los dos repos hermanos

**Fecha**: 2026-09-11. **Alcance**: solo diagnostico. No propone ni ejecuta correcciones.

Toma el catalogo de fallas de `web` (Queirolo Autos) y verifica, una por una, si se repiten en
`control-panel-webs-automotrices` y `taller-demo-web`.

| Repo | Stack | Deploy | Rol |
|------|-------|--------|-----|
| `web` | Next 14.2.35 + Sanity + sharp | VPS / EasyPanel (contenedor) | Sitio de Queirolo en produccion |
| `taller-demo-web` | Next 16.3.3 + `@sanity/client` 7 + sharp + Supabase | Vercel (serverless) | Fork de cliente del template automotriz |
| `control-panel-webs-automotrices` | Next 16.3.3 + Supabase | Sin deploy definido | Panel que administra clientes del template |

Fuentes del catalogo: `docs/implementation/IMP-20260908-003/IMP.md` (incidente cerrado y
verificado en produccion) y `docs/reference/deuda-tecnica.md` (deuda abierta D-001 a D-007).

---

## 1. Catalogo de referencia

Once clases de falla, en dos grupos. **Las resueltas importan tanto o mas que las abiertas**:
son las que un proyecto derivado hereda sin enterarse, porque en el repo original ya no se ven.

### Resueltas en `web` (heredables)

| ID | Falla | Fix aplicado | Evidencia en `web` |
|----|-------|--------------|--------------------|
| R-1 | Starvation del threadpool de libuv: `sharp` en paralelo compite con `dns.lookup()` por los 4 hilos por defecto | `UPLOAD_CONCURRENCY` 3 a 1, `sharp.concurrency(1)` | `lib/admin/vehicles.ts:16,23` |
| R-2 | Trabajo inutil: el servidor recomprime con `mozjpeg` imagenes que el navegador ya redujo | bypass `shouldSkipServerResize()` que respeta orientacion EXIF | `lib/admin/imageResize.ts:50-73`, `lib/admin/vehicles.ts:184` |
| R-3 | Amplificacion de reintentos: `useCdn: false` + retry duplicado sobre el retry del cliente Sanity | `useCdn: true`, `maxRetries: 2`, `timeout: 15000`, retry en una sola capa | `lib/sanity.ts:32-34` |
| R-4 | Ficha sin error boundary, devuelve 500 crudo | `app/vehiculos/[slug]/error.tsx` | archivo nuevo en `5398c87` |
| R-5 | Server Action que falla muda | wrapper `submitVehicle` que relanza digests `NEXT_REDIRECT` / `NEXT_NOT_FOUND` | `components/admin/VehicleForm.tsx` |
| R-6 | Errores de Sanity volcados crudos (~200 lineas por fallo) | `describeSanityError()` resume en una linea | `lib/sanityErrors.ts` |
| R-7 | `engines` fijando un Node incompatible rompe el deploy | corregido | commit `b9bfa92` |
| R-8 | `npm` como PID 1 no reenvia senales: SIGTERM se ve como crash | documentado, no corregido | `IMP-20260908-003` |

### Abiertas en `web`

| ID | Falla |
|----|-------|
| D-001 | Estado `reserved` invisible: la query filtra `status == "available"` |
| D-002 | Sentry instalado y no conectado (falta `withSentryConfig`) |
| D-003 | Logs de Docker sin rotacion en el VPS |
| D-004 | Version skew de Server Actions tras cada deploy |
| D-005 | Sanity Studio viaja a produccion (1.66 MB First Load JS) |
| D-006 | Peer conflict: `next-sanity@11` declara Next 15/16 |
| D-007 | Escaneo React2Shell ensucia el log (header `Next-Action: x`) |

---

## 2. Matriz falla x repo

Leyenda: **HEREDADA** = la falla existe igual. **CORREGIDA** = existia en el linaje y este repo
la resolvio. **N/A** = el repo no tiene esa superficie. **PROPIA** = brecha que no viene de `web`.

| ID | `taller-demo-web` | `control-panel-webs-automotrices` |
|----|-------------------|-----------------------------------|
| R-1 | **HEREDADA** - `lib/admin/vehicles.ts:192-195` | N/A - sin `sharp` ni uploads |
| R-2 | **HEREDADA y agravada** - `lib/admin/vehicles.ts:195`, sin pre-resize en navegador | N/A |
| R-3 | **HEREDADA y agravada** - `lib/sanity/client.ts:12` mas 12 fetch con `cache: "no-store"` | N/A - no usa Sanity |
| R-4 | No verificado (fuera de foco) | N/A |
| R-5 | **CORREGIDA** - cada action con su `try/catch`, `redirect()` fuera del bloque | Parcial: sin `try/catch`, pero errores mapeados a query string |
| R-6 | **CORREGIDA para leads, NO para Sanity** - `lib/leads/error-summary.ts` | Parcial: `throw new Error(...)` de una linea, sin logging |
| R-7 | N/A - sin `engines`, deploy a Vercel | N/A |
| R-8 | N/A - serverless | N/A |
| D-001 | **CORREGIDA** - `lib/vehicles/repository.ts:50,64` | N/A - queries sin filtro de status |
| D-002 | **HEREDADA en peor forma** - variable sin libreria (`.env.example:38`) | **PROPIA** - observabilidad cero |
| D-003 | N/A - serverless | N/A - sin deploy |
| D-004 | Sin `deploymentId` | Sin `deploymentId` |
| D-005 | **CORREGIDA** - solo `@sanity/client`, sin Studio | N/A |
| D-006 | N/A - versiones alineadas | N/A |
| D-007 | **HEREDADA** - sin guarda sobre `Next-Action` | **HEREDADA** - sin guarda sobre `Next-Action` |

---

## 3. Hallazgo principal: `taller-demo-web` tiene armada la cadena causal completa

La causa raiz del incidente del 2026-09-08 no era un bug puntual: era una **cadena** de tres
factores que se potencian. Los tres estan presentes en `taller-demo-web`, sin modificar.

### El codigo

`lib/admin/vehicles.ts:189-204`:

```js
async function uploadImages(files: File[]) {
  const client = createSanityAdminClient();
  const result: StoredVehicleImage[] = [];
  for (let index = 0; index < files.length; index += 3) {
    const batch = files.slice(index, index + 3);
    result.push(...await Promise.all(batch.map(async (file) => {
      const buffer = await sharp(Buffer.from(await file.arrayBuffer())).rotate()
        .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true }).toBuffer();
```

`lib/sanity/client.ts:12`:

```js
return createClient({ ...config, useCdn: false, perspective: "published" });
```

### Comparacion ingrediente por ingrediente

| Factor | `web` ANTES del fix | `web` HOY | `taller-demo-web` |
|--------|---------------------|-----------|-------------------|
| Imagenes en paralelo | 3 | **1** (`vehicles.ts:23`) | **3** (`vehicles.ts:193`) |
| `sharp.concurrency()` | sin fijar | **1** (`vehicles.ts:16`) | **sin fijar** |
| Encoder | `mozjpeg: true` | `mozjpeg: true` | `mozjpeg: true` |
| Bypass si la imagen ya cumple | no | **si** (`shouldSkipServerResize`) | **no** |
| Pre-resize en navegador | si, 2000px | si, `CLIENT_MAX_EDGE = 2000` | **no existe** |
| `useCdn` publico | `false` | **`true`** (`sanity.ts:32`) | **`false`** |
| `maxRetries` / `timeout` | default (5 reintentos) | **2 / 15000** | **default** |
| Cache de fetch | default de Next | default de Next | **`cache: "no-store"` en 12 llamadas** |

### Por que importa, y por que es facil leerlo mal

**Un lote de 3 no es un limite protector. 3 es el numero que causo el incidente.** El fix de
causa raiz fue bajarlo a 1, y `web` lo documenta en el propio codigo
(`lib/admin/vehicles.ts:19-23`): *Se bajo de 3 a 1: en un VPS de 1-2 vCPU tres conversiones
mozjpeg...*

Quien lea `files.slice(index, index + 3)` sin conocer la historia concluye que hay un limite
protector y sigue de largo. Por eso este documento explica el MECANISMO y no solo marca la
casilla.

El mecanismo, resumido: `dns.lookup()` de Node resuelve nombres en el threadpool de libuv
(4 hilos por defecto), y `sharp` usa **ese mismo threadpool**. Tres conversiones `mozjpeg`
simultaneas ocupan 3 de 4 hilos; todo `getaddrinfo` queda encolado; ningun fetch a Sanity
resuelve el dominio y muere a los 10s (`connectTimeout` por defecto de undici). El sitio
publico se cae en el mismo instante en que alguien guarda un vehiculo con fotos.

### Dos agravantes respecto de `web`

1. **Sin pre-resize en el navegador.** En `web`, el cliente reduce a 2000px antes de subir
   (`lib/admin/clientImageCompression.ts:55`). En `taller-demo-web` no existe equivalente
   (busqueda de `createImageBitmap`, `toBlob`, `OffscreenCanvas`: sin resultados). El servidor
   recibe el original completo, hasta **10 MB por archivo y 60 MB por carga**
   (`lib/admin/vehicles.ts:144-145`), con hasta 12 imagenes (`:54`). Es mas CPU por imagen,
   no menos.
2. **Cero cache en las lecturas publicas.** `useCdn: false` manda todo al origen, y ademas las
   12 llamadas de `lib/` usan `cache: "no-store"`. No hay cache en ninguna capa: ni borde de
   Sanity, ni cache de fetch de Next. Cada visita golpea `api.sanity.io` directo. Es el factor
   de amplificacion R-3, mas fuerte que en `web` antes del fix.

### El atenuante: es el hosting, no el codigo

`taller-demo-web` despliega a **Vercel** (`README.md:78-107`; usa `VERCEL_ENV` / `VERCEL_URL`
en `config/env.ts:14-20`). En serverless cada invocacion corre aislada: el hambre de threadpool
del upload no alcanza a los renders publicos, que viven en otras instancias. Por eso es
probable que nunca hayan visto el sintoma.

Pero el atenuante lo aporta la infraestructura, no el codigo. **El dia que este template se
despliegue en un contenedor de proceso unico, que es exactamente lo que hace `web` en
EasyPanel, la cadena causal se reactiva sin cambiar una sola linea.** Y
`docs/template-update-policy.md` de ese repo declara que deriva de `automotive-web-template`:
lo que este ahi se propaga a los forks que vengan.

Riesgo residual independiente del hosting: `useCdn: false` mas `no-store` significa que cada
visita consume cuota de la API de Sanity sin cache alguno. Eso escala mal por si solo.

---

## 4. Lo que `taller-demo-web` SI corrigio

No es un clon ciego. Varias deudas se resolvieron a proposito, con test y documentacion:

- **D-001 resuelta.** `lib/vehicles/repository.ts:50` filtra
  `status in ["available", "reserved"]`, y `:64` hace lo mismo en la ficha. El badge
  "Reservado" se renderiza (`components/vehicle-card.tsx:7-10`, con un comentario que explica
  que excluir `sold` es intencional). Documentado en `docs/inventory-contract.md:19,53-54`.
  **Es la falla de mayor prioridad abierta en `web` y aca ya esta cerrada.**
- **R-5 resuelta.** Ninguna Server Action usa un wrapper generico que pueda tragarse el digest
  de `redirect()`. Cada una maneja su `try/catch` local y deja el `redirect()` fuera del bloque
  (`app/admin/vehiculos/actions.ts:10-41`).
- **R-6 resuelta a medias.** `lib/leads/error-summary.ts` (`safeErrorSummary`) con lista blanca
  de campos y tope de 300 caracteres, con 68 lineas de test en `tests/error-summary.test.ts`
  que cubren filtrado de PII real. **Pero cubre Supabase/Resend, no Sanity**: los errores del
  cliente de Sanity no se atrapan en ningun lado.
- **D-005 resuelta.** Solo `@sanity/client` en dependencias; sin `sanity` ni `@sanity/vision`,
  sin ruta `/studio`. El Studio no viaja a produccion.
- **Higiene de tests.** Los 16 archivos de `tests/` coinciden 1:1 con el script `test` de
  `package.json:8`. No hay tests huerfanos que nunca corran.
- **Limites de carga explicitos** donde `web` no los tenia: 12 imagenes, 10 MB por archivo,
  60 MB por carga, con `bodySizeLimit: "64mb"` por encima (`next.config.mjs:5`).

## 5. Brechas propias de `taller-demo-web`

- **`lib/sanity/admin-client.ts:1` no importa `server-only`**, mientras
  `lib/sanity/client.ts:1` si lo hace. El modulo que sostiene `SANITY_API_WRITE_TOKEN` es
  justamente el que carece de la guarda que si tiene el cliente publico de solo lectura.
  Es una inconsistencia respecto del propio patron del repo.
- **Sentry fantasma.** `NEXT_PUBLIC_SENTRY_DSN=` declarada en `.env.example:38` sin ninguna
  dependencia `@sentry/*` instalada (0 menciones en `package.json`). Es peor que D-002 de
  `web`: alli al menos la libreria existe. Aca la variable sugiere monitoreo que no existe en
  ninguna forma.
- **Sin rate limiting** en ningun punto. La unica mitigacion de spam es un honeypot
  (`lib/leads/shared.ts`). La validacion de input si es solida.
- **D-007 sin mitigar**: sin guarda sobre el header `Next-Action`, sin `deploymentId`.

---

## 6. `control-panel-webs-automotrices`: otra familia de problemas

Casi no comparte fallas con `web` porque no comparte superficie: sin imagenes, sin `sharp`,
sin uploads, sin `next/image`. R-1, R-2, R-7, R-8, D-003, D-005 y D-006 no aplican.

**D-001 tampoco aplica**: `getProjects()` y `getProject()` (`lib/control-panel.ts:40-61`) no
filtran por `status`; traen todo y el filtrado ocurre en cliente solo para contar. El badge
cubre los 14 valores de los enums (`components/status-badge.tsx:3-18`). No hay desalineacion
schema / UI / query.

### Fortaleza que vale registrar

**RLS habilitado en las 13 tablas**, verificado sobre las migraciones: 11 en
`supabase/migrations/20260825234513_create_control_plane_schema.sql`, mas `design_profiles` y
`project_environment_variables` en sus migraciones respectivas. Con contratos pgTAP corriendo
via `npm run db:test`. Esto esta por encima del promedio y no tiene equivalente en los otros
dos repos.

### Fallas propias

- **No se puede desplegar.** `package.json` no tiene script `build` ni `start` (los scripts son
  `db:*`, `dev`, `lint`, `test:e2e`, `typecheck`). Sin Dockerfile, sin `nixpacks.toml`, sin
  `output: 'standalone'`. Es deuda **declarada**, no oculta: `README.md:20` dice
  "Provisioning y deployment | Pendientes" y `docs/product/mvp-scope.md:36` lo pone fuera del
  MVP. Aun asi, hoy este panel solo corre en `npm run dev`.
- **Observabilidad cero.** Sin Sentry y **sin un solo `console.*`** en `app/`, `lib/` o
  `components/` (0 coincidencias). Las Server Actions convierten el error en un codigo corto de
  query string (`app/actions.ts:43-44,67-69`, `app/login/actions.ts:12`): accionable para el
  usuario, pero el error real no queda registrado en ningun lado. Tampoco hay `error.tsx` ni
  `global-error.tsx`.
- **Sin validacion de env al arranque.** Solo `process.env.X!` (`lib/supabase/server.ts:8`,
  `lib/supabase/proxy.ts:7`, `proxy.ts:7`). Falla en la primera peticion con un `TypeError`
  generico de "Invalid URL", no con "falta la variable X".
- **Un solo API route sin Zod ni rate limiting HTTP.**
  `app/api/projects/[projectId]/environment-copy/route.ts` valida solo formato UUID del param.
  El unico rate limiting vive en la base, sobre la RPC `reveal_project_env_bundle`
  (`supabase/migrations/20260826144543_rate_limit_environment_revelation.sql:92`), no sobre
  este endpoint.
- **Residuo local**: `.env.example` tiene una linea `CLAVE=...` sin commitear que no se usa en
  ningun lado del codigo. Revisar y limpiar antes de commitear.

Punto a favor en lo que `web` si falla: no hay caida silenciosa a datos mock, y la
`service_role` key de Supabase no se usa en codigo accesible desde cliente.

---

## 7. Patron transversal a los tres

**Ninguno de los tres tiene error tracking funcionando.**

| Repo | Estado |
|------|--------|
| `web` | Sentry instalado, configs escritas, `withSentryConfig` nunca invocado (D-002) |
| `taller-demo-web` | Variable declarada, libreria ausente |
| `control-panel` | Nada: ni tracker ni un solo `console.*` |

Los tres dependen de leer logs crudos a mano. Que es exactamente como se diagnostico el
incidente del 2026-09-08, leyendo volcados de ~200 lineas pegados a mano, y por que costo lo
que costo. Es la unica falla que los tres comparten sin excepcion.

Segunda coincidencia: **ninguno de los tres mitiga D-007** (guarda sobre `Next-Action`), y
ninguno usa `deploymentId`.

---

## 8. Nota metodologica

Distingo lo verificado en esta sesion de lo delegado, porque no es lo mismo.

**Verificado leyendo el archivo en esta sesion** (cita directa):

- `taller-demo-web`: `lib/admin/vehicles.ts` (uploadImages, sharp, limites),
  `lib/sanity/client.ts`, `lib/sanity/admin-client.ts`, `lib/vehicles/repository.ts:45-70`,
  `package.json`, `.env.example:38`, ausencia de pre-resize en cliente, conteo de
  `cache: "no-store"`.
- `control-panel`: `package.json` completo, `lib/control-panel.ts:38-62`, conteo de `console.*`,
  RLS en migraciones, `README.md:15-24`.
- `web`: `lib/admin/vehicles.ts`, `lib/admin/imageResize.ts`, `lib/sanity.ts`,
  `lib/vehicles.ts:99`, `docs/reference/deuda-tecnica.md`,
  `docs/implementation/IMP-20260908-003/IMP.md`, git log.

**Reportado por exploracion delegada y NO verificado de segunda mano**: detalle de las Server
Actions de `control-panel` (`app/actions.ts`, `app/login/actions.ts`), contenido de
`components/status-badge.tsx`, contratos pgTAP en `supabase/tests/`, cobertura exacta de
`tests/error-summary.test.ts` en `taller-demo-web`, y el detalle de
`docs/inventory-contract.md`. Son plausibles y consistentes con lo que si verifique, pero
conviene confirmarlos antes de tomar una decision que dependa de ellos.

**Correccion registrada**: la exploracion delegada reporto el lote de 3 de `taller-demo-web`
como "mitigacion del riesgo de threadpool". Es al reves, y se corrigio tras leer el codigo y
contrastarlo con `IMP-20260908-003`. Queda anotado porque es el error de lectura mas probable
para cualquiera que revise ese archivo sin conocer el incidente.

**Fuera de alcance**: no se ejecuto `npm install`, `npm ls` ni ningun build en los repos
hermanos, asi que no se verificaron peer conflicts en tiempo real. Tampoco se audito R-4
(error boundaries) en `taller-demo-web`. No se reviso `web` buscando fallas nuevas: se tomo su
catalogo documentado como dado.

---

## Referencias

- `docs/reference/deuda-tecnica.md` - deuda abierta de `web` (D-001 a D-007)
- `docs/implementation/IMP-20260908-003/IMP.md` - incidente cerrado (R-1 a R-8)
- `docs/logbook.md` - entrada `LOG-20260911-001`
