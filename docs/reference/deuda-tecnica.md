# Deuda tecnica

Registro unico de deuda conocida. Cada item dice que pasa, donde, por que importa y que hace
falta para cerrarlo. Si un item se resuelve, se borra de aca y se registra en `docs/logbook.md`.

Ultima revision: 2026-09-08.

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

El `Cannot read properties of undefined (reading 'workers')` que acompana al mensaje es un bug de
Next 14 en su propio manejador de error. Es la mascara, no la causa.

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

**Prioridad: baja.**

**Que pasa**: `/studio` pesa 1.66 MB de First Load JS (dato del build del 2026-09-08). Como no se
usa `output: 'standalone'`, todo `node_modules` viaja al VPS, incluidos `sanity` y
`@sanity/vision`.

**Por que importa**: imagen mas pesada, `npm ci` mas lento en cada deploy (~104s medidos) y mas
memoria residente. No es urgente, pero es peso muerto en un VPS chico.

**Como retomarlo**: evaluar `output: 'standalone'` en `next.config.js`, o separar el Studio a su
propio deploy.

---

## D-006 - `next-sanity@11` declara peer de Next 15/16

**Prioridad: baja. Solo vigilar.**

El proyecto usa `next@14.2.35` y `next-sanity@11.6.12`, que declara peer `next ^15.1.0-0 ||
^16.0.0-0`. Funciona, pero es una incompatibilidad declarada. Ya anotado en
`IMP-20260908-001`. No tocar sin una migracion validada de Next 14 a 15.

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
