# IMP-20260913-001 - Estabilizar carga del admin y eliminar Studio no utilizado

**Estado: EN IMPLEMENTACION**

## Objetivo

Evitar que una visita a `/admin` dispare consultas y procesamiento innecesarios de
fichas publicas, paginas de edicion, Studio e imagenes, reduciendo la probabilidad
de saturar el proceso Node y provocar timeouts intermitentes hacia Sanity.

## Contexto

El VPS mostro una rafaga en la que una misma IP solicito simultaneamente el admin,
varias fichas, varias paginas de edicion, `/studio` y numerosas imagenes mediante
`/_next/image`. Durante esa ventana aparecieron `UND_ERR_CONNECT_TIMEOUT` contra
Sanity. Las pruebas posteriores desde el mismo contenedor respondieron correctamente,
por lo que el problema es intermitente y esta asociado a la carga concurrente.

## Diagnostico confirmado

- `app/admin/page.tsx` redirige a `/admin/vehiculos`.
- `app/admin/vehiculos/page.tsx` crea un `Link` publico y un `Link` de edicion por vehiculo.
- Los `Link` pueden ser prefetcheados por Next; `target="_blank"` no desactiva el prefetch.
- No existe `app/admin/layout.tsx`; el admin hereda el layout publico completo.
- El layout publico incluye Navbar, Footer, Analytics, WhatsApp y CompareBar.
- Cada fila del listado administrativo usa `next/image` y puede pasar por `/_next/image`.
- `AdminShell` mantiene un enlace explicito a `/studio` aunque el owner no lo utiliza.
- `generateStaticParams` pertenece al build y no explica el fan-out al entrar al admin.
- `NODE_ENV` vacio en el contenedor **no es un defecto**. `next/dist/bin/next` ejecuta
  `process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv` con `defaultEnv = "production"`
  para todo comando que no sea `dev`, asi que `next build` y `next start` ya corren en
  produccion. Verlo vacio con `docker exec env` es cosmetico.

## Alcance

Incluido:

- Desactivar prefetch en enlaces administrativos de edicion.
- Usar enlaces HTML normales para destinos que abren una pestana nueva.
- Retirar el enlace visible a Studio.
- Retirar la ruta embebida de Studio porque no forma parte del flujo operativo.
- Revisar dependencias y archivos exclusivos de Studio antes de eliminarlos.
- Reducir trafico del optimizador de imagenes en miniaturas administrativas.
- Anadir pruebas de render y regresion para el fan-out.
- Documentar por que `NODE_ENV` NO debe fijarse en EasyPanel (ver `LOG-20260913-003`).
- Implementar el filtro de `Next-Action` invalido si las pruebas confirman que no rompe acciones reales.

Excluido:

- Cambios al schema de Sanity.
- Cambios a las queries publicas de vehiculos.
- Cambios al flujo de subida o compresion de imagenes salvo los necesarios para
  evitar carga innecesaria desde el listado.
- Fijar `BUILD_ID` o introducir `deploymentId` sin una version de despliegue confiable.

## Criterios de aceptacion

- Entrar a `/admin` no solicita automaticamente fichas publicas ni paginas de edicion.
- Entrar a `/admin` no solicita `/studio`.
- Los enlaces Ver y Editar siguen funcionando al hacer clic.
- El listado no genera una rafaga descontrolada de `/_next/image`.
- Login, alta, edicion, eliminacion, destacados y logout siguen funcionando.
- No aparecen nuevos timeouts Sanity durante una prueba administrativa normal.
- `NODE_ENV` NO queda definido como variable del servicio en EasyPanel.
- Lint, tests y TypeScript pasan.
- El cambio puede revertirse con la rama y el rollback documentados.

## Riesgos

- `prefetch={false}` puede aumentar ligeramente la latencia percibida al abrir Editar,
  a cambio de eliminar consultas anticipadas y no visibles.
- Eliminar Studio quita una via de recuperacion tecnica; el acceso directo a Sanity
  sigue siendo posible desde el proyecto de Sanity si se necesita una emergencia.
- Separar layouts mediante route groups seria mas limpio, pero aumenta el alcance y
  se mantiene como fase posterior si la correccion minima no alcanza.
- Fijar `NODE_ENV` en EasyPanel rompe el build: Nixpacks inyecta las variables del servicio
  como `ARG`/`ENV` en tiempo de build, npm deriva `omit=dev` y `npm ci` saltea las
  devDependencies (`autoprefixer`, `typescript`, `tailwindcss-animate`). Ocurrio el
  2026-09-13; mitigado con `.npmrc` (`include=dev`). Ver `LOG-20260913-003`.

## Validacion

La validacion local y remota se registrara en `EVIDENCE.md`. No se considera la
iniciativa lista para merge hasta completar pruebas de navegador y una prueba
post-deploy con logs separados por un reinicio limpio.

## Referencias

- `docs/reference/deuda-tecnica.md` D-004, D-005 y D-007.
- `docs/implementation/IMP-20260908-003/IMP.md`.
- `app/admin/vehiculos/page.tsx`.
- `components/admin/AdminShell.tsx`.
- `app/layout.tsx`.
- `app/studio/[[...tool]]/page.tsx`.
