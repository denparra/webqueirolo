# Deuda tecnica

Registro unico de deuda conocida. Cada item dice que pasa, donde, por que importa y que hace
falta para cerrarlo. Si un item se resuelve, se borra de aca y se registra en `docs/logbook.md`.

D-001 a D-007 son deuda de ESTE repo. D-008 en adelante es deuda de los repos hermanos
(`taller-demo-web`, `control-panel-webs-automotrices`), que no tienen registro propio: se
centraliza aca hasta que lo tengan. Cada item de esa seccion declara su repo en la primera
linea.

Ultima revision: 2026-09-11.

---

## D-001 - Los vehiculos "Reservado" son invisibles en el sitio publico

**Prioridad: alta.** Es la deuda con mas probabilidad de morder.

**Que pasa**: `lib/vehicles.ts` filtra `*[_type == "vehicle" && status == "available"]`. Eso
excluye tambien los `reserved`, no solo los `sold`.

**Por que importa**: el schema (`sanity/schemaTypes/vehicle.ts`) ofrece tres estados
—Disponible, Reservado, Vendido— y los componentes de `components/vehicles/` renderizan el badge
de "Reservado". Es decir: la UI esta preparada para mostrarlos y la query nunca se los entrega.

El dia que el owner marque un auto como Reservado desde `/admin`, **el auto desaparece del sitio
sin ningun aviso**. No hay error, no hay log: simplemente deja de estar. Es el peor tipo de bug,
el que no se manifiesta como falla.

**Estado hoy**: sin impacto. Verificado en Sanity el 2026-09-08: 58 vehiculos totales, 15
`available`, 43 `sold`, 0 `reserved`, 0 sin campo `status`.

**Decision pendiente del owner**, dos caminos:

- **Mostrarlo con badge** (recomendado): cambiar la query a `status != "sold"`. El auto sigue en
  el catalogo con su badge de Reservado. Es para lo que el estado existe, y genera urgencia
  comercial: "este ya lo estan por comprar".
- **Ocultarlo, como el vendido**: dejar la query como esta, pero entonces hay que sacar
  "Reservado" del schema y borrar los badges muertos. Un estado que existe en el editor y no
  hace nada es una trampa para el proximo que lo toque.

Lo que no es opcion es dejarlo como esta: hoy el sistema promete algo que no cumple.

**Como retomarlo**: decidir con el owner, cambiar la query en `lib/vehicles.ts`, verificar que
los badges de `components/vehicles/` reflejen el estado, y probar marcando un auto como Reservado
en `/admin`.

---

## D-002 - Sentry esta instalado y no funciona

**Prioridad: media.** Costo pagado, beneficio cero.

**Que pasa**: `@sentry/nextjs` es dependencia de produccion. Existen y estan bien escritos
`sentry.client.config.ts`, `sentry.server.config.ts` y `sentry.edge.config.ts` (con sample rates,
`ignoreErrors` y `beforeSend` filtrando ruido de extensiones). `instrumentation.ts` carga los de
server y edge.

Pero **`withSentryConfig` no se invoca en `next.config.js`**. Sin ese wrapper no hay source maps
y el config de cliente nunca llega a cargarse. Ademas el DSN sale de `NEXT_PUBLIC_SENTRY_DSN`, que
no aparece documentado en `CLAUDE.md`, `AGENTS.md` ni `README.md`: es casi seguro que tampoco esta
seteado en EasyPanel.

**Por que importa**: se paga el peso del bundle sin recibir nada a cambio. Y el costo real se ve
en incidentes: el del 2026-09-08 (ver `IMP-20260908-003`) obligo a diagnosticar leyendo volcados
crudos de log pegados a mano. Con Sentry activo habria llegado agrupado, fechado, con stack trace
y asociado a una release.

**Como retomarlo**: crear proyecto en Sentry, obtener DSN, envolver la config con
`withSentryConfig` en `next.config.js`, setear `NEXT_PUBLIC_SENTRY_DSN` y un auth token de build
para subir source maps, y documentar ambas variables en `CLAUDE.md` y `AGENTS.md`.

**Alcance transversal** (2026-09-11): esta es la unica falla que los TRES repos comparten sin
excepcion. `taller-demo-web` declara `NEXT_PUBLIC_SENTRY_DSN` en `.env.example:38` sin ninguna
dependencia `@sentry/*` instalada: variable fantasma, peor que no tenerla porque sugiere
monitoreo inexistente. `control-panel-webs-automotrices` no tiene tracker ni un solo `console.*`
en `app/`, `lib/` o `components/`. Los tres dependen de leer logs crudos a mano, que es como se
diagnostico el incidente del 2026-09-08 y por que costo lo que costo. Si se resuelve, conviene
resolverlo para los tres de una. Ver `docs/reference/auditoria-cruzada-20260911.md`.

---

## D-003 - Docker sin rotacion de logs en el VPS

**Prioridad: media.** Riesgo de disco lleno.

**Que pasa**: el host no tiene `log-opts` configurado, asi que los logs `json-file` de cada
contenedor crecen sin techo.

**Por que importa**: el incidente del 2026-09-08 generaba volcados de ~200 lineas por fallo,
repetidos. Un disco lleno no falla de forma prolija: tira el servidor abajo. (El logging compacto
del commit `2dfb8b3` reduce mucho el volumen, pero no pone un techo.)

**Como retomarlo**: en el host, `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}
```

Requiere `systemctl restart docker`, que **reinicia todos los contenedores del VPS**, no solo esta
app. Hacerlo en ventana de bajo trafico. Solo aplica a contenedores creados despues del restart.

Alternativa acotada sin reiniciar el daemon:
`docker service update --log-opt max-size=10m --log-opt max-file=3 <servicio>`, aunque EasyPanel
puede sobrescribirla al redesplegar desde el panel.

**Nota operativa**: un Restart desde EasyPanel NO limpia los logs viejos. EasyPanel corre sobre
Docker Swarm y su visor agrega los logs de todas las tasks del servicio, incluidas las muertas.
Para vaciarlos hay que truncar el archivo en el host (`truncate -s 0 "$(docker inspect
--format='{{.LogPath}}' <container>)"`), nunca borrarlo con `rm`: Docker mantiene el descriptor
abierto y borrarlo rompe el logging hasta el proximo recreate. En la practica alcanza con poner un
divider en el visor de EasyPanel y leer de ahi para abajo.

---

## D-004 - Version skew de Server Actions tras cada deploy

**Prioridad: baja hoy. Sube si entra otra persona a administrar el inventario.**

**Que pasa**: los IDs de Server Action se generan en build time y **cambian en cada deploy**, por
diseno de Next. Una pestana de `/admin` abierta desde antes de un deploy manda un ID que el
servidor nuevo no conoce, y se loguea `Failed to find Server Action`.

Aclaracion importante, porque es facil confundirse: `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` **no
arregla esto**. Esa clave protege las variables de closure para que instancias del mismo build
puedan descifrarse entre si; no estabiliza los IDs. Segun la documentacion oficial
(`docs/01-app/02-guides/server-actions.mdx`): *"New deployments typically generate new IDs"*. La
clave sigue siendo necesaria y no debe sacarse, pero no ataca este problema.

El `Cannot read properties of undefined (reading 'workers')` que acompana al mensaje sale del
Proxy `createServerModuleMap` (`next/dist/server/app-render/action-utils.js:30`), que indexa
`serverActionsManifest.node[id].workers` sin chequear si el ID existe. Pasa con **cualquier** ID
desconocido, venga de donde venga. Es la mascara, no la causa.

**Como distinguirlo del escaneo (D-007)**: mirar el ID entre comillas del mensaje. Un ID real de
este build es un hash hexadecimal de 40 caracteres (ej. `7b1a0eece425124b20a59688f5aa1ef9e540a47e`).
Si aparece uno asi, es skew y aplica esta seccion. Si aparece `"x"` u otro valor corto o no
hexadecimal, no es skew: es un bot escaneando (ver D-007). El 2026-09-10 se verifico que las
lineas que persisten en produccion traen `"x"`, o sea que son escaneo. El ID de las lineas vistas
el 2026-09-08 no quedo registrado, asi que no se puede saber cual de los dos casos eran.

**Estado hoy**: sin impacto funcional. Verificado el 2026-09-08: el guardado del vehiculo
funciono, no hubo aviso en pantalla, la linea quedo solo en el log. Es el servidor rechazando
correctamente una entrada invalida.

**Mitigacion parcial ya implementada**: `components/admin/VehicleForm.tsx` envuelve
`saveVehicleAction` en `submitVehicle()`, que captura el fallo y muestra un aviso accionable en
vez de morir mudo. Relanza los errores con digest `NEXT_REDIRECT` / `NEXT_NOT_FOUND`, porque
`redirect()` de Next se implementa lanzando y tragarlo romperia el camino feliz.

Los otros cinco formularios NO estan envueltos: `logoutAction` (`AdminShell.tsx:27`),
`deleteVehicleAction` (`VehicleForm.tsx:554` y `app/admin/vehiculos/page.tsx:182`),
`clearFeaturedVehiclesAction` (`app/admin/vehiculos/page.tsx:58`) y `loginAction`
(`app/admin/login/page.tsx:44`). Fue deliberado: son acciones de un clic sin datos que perder. El
caso que justifico el envoltorio era el formulario largo con fotos.

**Solucion completa si algun dia se justifica**: `deploymentId` en `next.config.js`. No evita el
skew; lo detecta y dispara un hard reload del cliente, que arregla los seis formularios de una.

```js
module.exports = { deploymentId: process.env.DEPLOYMENT_VERSION }
```

**Por que NO se hizo**: `deploymentId` exige un valor unico por deploy, identico en build y en
runtime. EasyPanel no expone un SHA de commit automatico, asi que habria que actualizar la
variable a mano antes de cada deploy. Si se olvida, el valor queda constante y la opcion no
detecta nada: pasa a ser configuracion que aparenta proteger sin proteger, que es peor que no
tenerla.

**Cuando volver sobre esto** (cualquiera de estas tres):

- El error aparece con una pestana **cargada despues** del deploy. Eso ya no seria skew esperado
  y hay que investigar en serio.
- Un guardado real falla y muestra el aviso ambar mas de una vez por deploy.
- Entra otra persona a administrar el inventario: con mas usuarios sube la probabilidad de
  pestanas viejas y `deploymentId` empieza a pagar su costo operativo.

---

## D-005 - Peso del contenedor: Sanity Studio viaja a produccion

**Estado: CERRADA en IMP-20260913-001.**

**Que pasaba**: `/studio` pesaba 1.66 MB de First Load JS (dato del build del 2026-09-08) y
agregaba `@sanity/vision` al despliegue.

**Resultado**: se retiro la ruta embebida, la configuracion de Studio y `@sanity/vision`.
`sanity` se conserva porque sigue siendo utilizado por schemas y CLI.

La optimizacion restante del contenedor y la separacion del CMS, si se necesitan, son iniciativas
distintas.

---

## D-006 - `next-sanity@11` declara peer de Next 15/16

**Prioridad: baja. Solo vigilar.**

El proyecto usa `next@14.2.35` y `next-sanity@11.6.12`, que declara peer `next ^15.1.0-0 ||
^16.0.0-0`. Funciona, pero es una incompatibilidad declarada. Ya anotado en
`IMP-20260908-001`. No tocar sin una migracion validada de Next 14 a 15.

Si esa migracion ocurre y D-007 ya tiene su guard implementado, revisar el guard dentro de la
misma migracion (depende del formato interno de los IDs de Server Action).

---

## D-007 - Escaneo automatizado de Server Actions (React2Shell) ensucia el log

**Prioridad: baja. Ruido, no riesgo.** Fix anotado en el to-do como
`[SEC-SCAN] Filtrar Next-Action invalido en middleware` (etiqueta `webqueirolo`).

**Que pasa**: el log de produccion muestra, repetido y a cualquier hora:

```
Error: Failed to find Server Action "x". This request might be from an older or newer deployment.
Original error: Cannot read properties of undefined (reading 'workers')
```

Son bots que escanean internet buscando React2Shell (CVE-2025-55182, RCE en React Server
Components, diciembre 2025). Mandan un POST con header `Next-Action: x`. Para detectar la
vulnerabilidad sirve cualquier valor, porque el bug estaba en la deserializacion, antes de validar
el ID.

**Evidencia**: los IDs reales de este build son SHA-1 hexadecimales de 40 caracteres
(`.next/server/server-reference-manifest.json`, ej. `7b1a0eece425124b20a59688f5aa1ef9e540a47e`).
`"x"` no puede salir de ningun formulario del sitio.

**Mecanismo** (Next 14.2.35):

1. Llega el POST con `Next-Action: x` y Next lo trata como invocacion de Server Action.
2. `createServerModuleMap` (`node_modules/next/dist/server/app-render/action-utils.js:30`) hace
   `serverActionsManifest.node["x"].workers`. Como `node["x"]` es `undefined`, sale el TypeError.
3. `getActionNotFoundError` (`action-handler.js:653`) lo envuelve y lo loguea.

**Exposicion: ninguna.** Verificado en los avisos oficiales el 2026-09-10:

- RCE CVE-2025-66478 (downstream de CVE-2025-55182): Next 14.x estable no esta afectado.
- DoS CVE-2025-55184 y su fix completo CVE-2025-67779: corregido en `14.2.35`, que es la version
  en produccion y en el lockfile. **No bajar de 14.2.35.**

Fuentes: https://nextjs.org/blog/security-update-2025-12-11 y
https://nextjs.org/blog/CVE-2025-66478

**Por que importa igual**: no rompe nada, pero es la misma linea que produce un version skew real
(D-004). Mientras el escaneo llene el log, un skew real queda tapado.

**Fix propuesto**: guard en `middleware.ts`. Si la request trae `Next-Action` y el valor no
matchea `/^[0-9a-f]{40,}$/i`, responder 400 antes de que llegue al manejador de actions. Son unas
6 lineas mas su test. Beneficio extra: el body del scanner nunca llega al decodificador Flight de
React (defensa en profundidad).

**Riesgo del fix**: acopla el middleware al formato interno de los IDs de Next. `{40,}` (en vez de
`{40}`) tolera IDs mas largos en versiones futuras, pero si Next cambiara a un formato no
hexadecimal, el guard rechazaria TODOS los formularios del admin. Por eso va con test y hay que
revisarlo en cualquier migracion de Next (ver D-006).

**Para cerrar**: guard + test Jest, probar login/guardar/eliminar/logout del admin en local,
desplegar y confirmar que desaparece la linea con `"x"`. Luego borrar este item y registrarlo en
`docs/logbook.md`.

**Alcance transversal** (2026-09-11): ninguno de los tres repos mitiga esto ni usa
`deploymentId`. Si el guard se implementa aca, vale portarlo a los hermanos en la misma pasada.
Ojo: en Next 16 el archivo se llama `proxy.ts`, no `middleware.ts`.

---

## Deuda en repos hermanos

Detectada en la auditoria cruzada del 2026-09-11
(`docs/reference/auditoria-cruzada-20260911.md`). Ninguno de los dos repos tiene registro de
deuda propio, por eso vive aca. Al moverlos a su repo, borrar el item de este archivo.

---

## D-008 - `taller-demo-web` tiene armada entera la cadena causal del incidente del 2026-09-08

**Repo: `taller-demo-web`. Prioridad: alta como riesgo latente, cero impacto hoy.**
Es el hallazgo mas importante de la auditoria.

**Que pasa**: `lib/admin/vehicles.ts:189-204` reproduce, ingrediente por ingrediente, la
configuracion que tumbaba el sitio publico de Queirolo cada vez que el owner guardaba un
vehiculo con fotos:

```js
for (let index = 0; index < files.length; index += 3) {
  const batch = files.slice(index, index + 3);
  result.push(...await Promise.all(batch.map(async (file) => {
    const buffer = await sharp(...).rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true }).toBuffer();
```

| Factor | `web` antes del fix | `web` hoy | `taller-demo-web` |
|--------|---------------------|-----------|-------------------|
| Imagenes en paralelo | 3 | 1 | **3** |
| `sharp.concurrency()` | sin fijar | 1 | **sin fijar** |
| Encoder | `mozjpeg` | `mozjpeg` | `mozjpeg` |
| Bypass si ya cumple | no | `shouldSkipServerResize` | **no** |
| Pre-resize en navegador | si, 2000px | si, 2000px | **no existe** |
| `useCdn` publico | `false` | `true` | **`false`** |
| `maxRetries` / `timeout` | default | 2 / 15000 | **default** |
| Cache de fetch | default de Next | default de Next | **`no-store`, 12 llamadas** |

**Trampa de lectura, leer antes de tocar**: un lote de 3 PARECE una mitigacion. No lo es. **3 es
el numero que causo el incidente**; el fix de causa raiz fue bajarlo a 1, y
`lib/admin/vehicles.ts:19-23` de este repo lo documenta en el propio codigo. Una exploracion
automatizada de ese archivo lo reporto como "riesgo mitigado". Cualquiera que lo lea sin conocer
`IMP-20260908-003` va a concluir lo mismo.

**El mecanismo**: `dns.lookup()` de Node resuelve nombres en el threadpool de libuv (4 hilos por
defecto) y `sharp` usa ESE MISMO threadpool. Tres conversiones `mozjpeg` simultaneas ocupan 3 de
4 hilos, todo `getaddrinfo` queda encolado, ningun fetch a Sanity resuelve el dominio y muere a
los 10s (`connectTimeout` por defecto de undici).

**Dos agravantes respecto de `web`**:

1. Sin pre-resize en el navegador. El servidor recibe el original completo: hasta 10 MB por
   archivo, 60 MB por carga, 12 imagenes (`lib/admin/vehicles.ts:54,144-145`). Mas CPU por
   imagen, no menos.
2. Cero cache en las lecturas publicas: `useCdn: false` (`lib/sanity/client.ts:12`) mas
   `cache: "no-store"` en las 12 llamadas de `lib/`. Ni borde de Sanity ni cache de fetch de
   Next. Peor que `web` antes del fix.

**Por que no explota hoy**: despliega a Vercel (serverless), donde cada invocacion corre
aislada, asi que el hambre de threadpool del upload no alcanza a los renders publicos. **El
atenuante lo aporta el hosting, no el codigo.** Se reactiva entero el dia que ese template se
despliegue en un contenedor de proceso unico, que es exactamente lo que hace este repo en
EasyPanel. Y `docs/template-update-policy.md` de ese repo declara que deriva de
`automotive-web-template`: lo que este ahi se propaga a los forks que vengan.

**Riesgo independiente del hosting**: `useCdn: false` mas `no-store` hace que cada visita
consuma cuota de la API de Sanity sin cache alguno. Eso escala mal por si solo.

**Como retomarlo**: portar los cuatro cambios de `5398c87` a `taller-demo-web` — concurrencia de
subida a 1, `sharp.concurrency(1)`, bypass tipo `shouldSkipServerResize()` con sus tests de
orientacion EXIF, y `maxRetries`/`timeout` explicitos en los clientes Sanity. El `useCdn: false`
merece decision aparte: `lib/sanity/client.ts:8-11` lo declara deliberado por frescura de datos,
asi que cambiarlo es una decision de producto, no un fix mecanico.

**Lo que ese repo SI corrigio y no hay que tocar**: D-001 esta cerrada alli
(`lib/vehicles/repository.ts:50` filtra `status in ["available", "reserved"]`, con badge y
documentacion en `docs/inventory-contract.md`), R-5 tambien, y el Studio no viaja a produccion.
No es un clon ciego.

---

## D-009 - `taller-demo-web`: el modulo con el token de escritura no tiene `server-only`

**Repo: `taller-demo-web`. Prioridad: media.**

**Que pasa**: `lib/sanity/admin-client.ts:1` no importa `server-only`, mientras
`lib/sanity/client.ts:1` si lo hace. El modulo que sostiene `SANITY_API_WRITE_TOKEN` es
justamente el que carece de la guarda que si tiene el cliente publico de solo lectura.

**Por que importa**: `server-only` es lo que convierte un import accidental desde un Client
Component en un error de build, en vez de un token filtrado al bundle. Hoy nada lo importa mal,
asi que no hay filtracion: la deuda es que la unica proteccion es que nadie se equivoque. Ademas
es una inconsistencia contra el propio patron del repo.

**Como retomarlo**: agregar `import "server-only";` como primera linea de
`lib/sanity/admin-client.ts` y correr `npm run typecheck`. Es una linea.

---

## D-010 - `taller-demo-web`: sin rate limiting en los formularios publicos

**Repo: `taller-demo-web`. Prioridad: media.**

**Que pasa**: no hay rate limiting en ningun punto. La unica mitigacion de spam es un honeypot
(`lib/leads/shared.ts`). La validacion y sanitizacion de input si es solida: limites de longitud
por campo, `escapeHtml`, `stripControlChars`, y fallo explicito en vez de truncar en silencio.

**Por que importa**: los leads se persisten en Supabase y disparan correo via Resend. Sin techo
de tasa, un bot que pase el honeypot consume cuota de ambos servicios.

**Como retomarlo**: decidir la capa (Server Action, o limite en la propia base como ya hace
`control-panel` con `reveal_project_env_bundle`) y el criterio de clave (IP mas endpoint).

---

## D-011 - `control-panel-webs-automotrices` no se puede desplegar

**Repo: `control-panel-webs-automotrices`. Prioridad: media. Deuda declarada, no oculta.**

**Que pasa**: `package.json` no tiene script `build` ni `start` — los scripts son `db:*`, `dev`,
`lint`, `test:e2e` y `typecheck`. Sin Dockerfile, sin `nixpacks.toml`, sin `output: 'standalone'`
en `next.config.ts`.

**Por que importa**: hoy ese panel solo corre en `npm run dev`. No es un descuido: el propio
`README.md:20` dice "Provisioning y deployment | Pendientes" y `docs/product/mvp-scope.md:36` lo
pone explicitamente fuera del MVP. Se registra para que la decision sea consciente cuando llegue
el momento de publicarlo, no para tratarlo como bug.

**Como retomarlo**: agregar `build` y `start`, decidir destino (contenedor o Vercel) y, si es
contenedor, evaluar `output: 'standalone'`, que alli resolveria de entrada lo que en este repo
quedo como D-005.

---

## D-012 - `control-panel-webs-automotrices`: errores que no quedan registrados en ningun lado

**Repo: `control-panel-webs-automotrices`. Prioridad: media.**

**Que pasa**: las Server Actions convierten el error en un codigo corto de query string
(`app/actions.ts:43-44,67-69`, `app/login/actions.ts:12`). Es accionable para el usuario —la UI
muestra un mensaje especifico— pero el error real no se loguea: no hay tracker, no hay un solo
`console.*` en `app/`, `lib/` ni `components/`, y no existe `error.tsx` ni `global-error.tsx`.

Ademas no hay validacion de env al arranque: solo `process.env.X!` (`lib/supabase/server.ts:8`,
`lib/supabase/proxy.ts:7`, `proxy.ts:7`), que falla en la primera peticion con un `TypeError`
generico de "Invalid URL" en vez de "falta la variable X".

**Por que importa**: un error inesperado —timeout de red, RPC caida, excepcion no relacionada a
Supabase— no tiene manejo ni deja rastro. El diagnostico depende de reproducirlo a mano.

**Como retomarlo**: es la contracara de D-002; si se resuelve observabilidad para la familia,
este item se cierra con ella. Aparte, un modulo de validacion de env al arranque que falle
nombrando la variable faltante.

**Nota de higiene**: el `.env.example` de ese repo tiene una linea `CLAVE=...` sin commitear que
no se usa en ningun lado del codigo. Revisar y limpiar antes de commitear.

**Fortaleza que NO hay que romper**: ese repo tiene RLS habilitado en las 13 tablas
(`supabase/migrations/`) con contratos pgTAP corriendo via `npm run db:test`. Esta por encima de
los otros dos: conviene tomarlo como referencia, no tocarlo.

---

## Anti-deuda: decisiones tomadas que NO hay que revertir

Estas se evaluaron y se descartaron con motivo. Si a alguien se le ocurre "mejorarlas", leer
primero por que no.

### `generateBuildId` fijo: NO agregar

Se probo y se revirtio el 2026-09-08. `next.config.js` sirve `/_next/static/:path*` con
`Cache-Control: public, max-age=31536000, immutable`. Un buildId constante deja
`/_next/static/<id>/_buildManifest.js` cacheado un ano como inmutable mientras su contenido cambia
en cada deploy: envenenamiento de cache del cliente.

Ademas no resuelve el error de Server Actions (el ID de una action es independiente del buildId) y
con un solo contenedor no hay skew entre replicas que lo justifique. El ID aleatorio por build que
Next genera por defecto es el comportamiento correcto aca. **No setear `BUILD_ID` en EasyPanel.**

Si algun dia hace falta identificar la version desplegada, la opcion correcta es `deploymentId`
(ver D-004), no `generateBuildId`.

### Bypass de sharp: no "simplificarlo"

`lib/admin/vehicles.ts` saltea sharp cuando la imagen ya cumple. La condicion incluye que **no
tenga orientacion EXIF pendiente**, porque `resizeToOptimizedJpeg()` usa `.rotate()` para hornear
la orientacion en los pixeles. Saltear esa validacion dejaria fotos de celular giradas. La logica
esta en `shouldSkipServerResize()` (`lib/admin/imageResize.ts`) con tests que cubren los ocho
valores de orientacion EXIF.

### `describeSanityError` vive en `lib/sanityErrors.ts`, no en `lib/sanity.ts`

Es un modulo sin dependencias a proposito. `lib/sanity.ts` importa `next-sanity`, que es ESM, y
Jest falla con `SyntaxError: Cannot use import statement outside a module`. Mismo criterio que
`lib/admin/imageResize.ts`. **No mover el helper a `lib/sanity.ts`**: rompe los tests.
