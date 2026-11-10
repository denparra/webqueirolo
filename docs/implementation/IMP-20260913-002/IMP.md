# IMP-20260913-002 - Migracion de Next.js 14 a 15/16 y React 19

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260913-002 |
| **Fecha**   | 2026-09-13 |
| **Owner**   | denparra |
| **Estado**  | planning |
| **Log ref** | LOG-20260913-004 |

> **Este documento es SOT del frente. No se toco codigo.**
> Contiene el analisis verificado contra el repo y contra la documentacion oficial de Next.js.
> La decision Next 15 vs Next 16 esta ABIERTA y se registra mas abajo.

## Objetivo

Salir de Next 14 / React 18.2 hacia una linea soportada (Next 15 o Next 16 con React 19),
resolviendo la incompatibilidad declarada de `next-sanity` y dejando el stack fuera de la ventana
de deprecacion de React 18.

## Contexto y disparador

`D-006` en `docs/reference/deuda-tecnica.md` ya registraba que `next-sanity@11.6.12` declara peer
`next ^15.1.0-0 || ^16.0.0-0` mientras el proyecto corre `next@14.2.35`. Durante la investigacion
del incidente `LOG-20260913-003` se confirmo que `npm ci` falla con `ERESOLVE` por ese conflicto en
entornos con npm estricto. El VPS lo viene tolerando, pero es una dependencia declarada como
incompatible, no una advertencia cosmetica.

Hallazgo adicional que refuerza la urgencia: **`react@^18.2.0` tampoco cumple** el peer de
`next-sanity`, que pide `react ^18.3 || ^19`. React se toca en cualquier escenario.

Resultado buscado: build reproducible, arbol de dependencias coherente y un stack cuyo soporte no
vence en el corto plazo.

## Estado actual verificado

Todo lo de esta tabla se leyo de `package-lock.json` en el commit `293ab86`.

| Paquete | Instalado | Peer `react` | Peer `next` | Listo para React 19 |
|---------|-----------|--------------|-------------|---------------------|
| `next` | 14.2.35 | - | - | - |
| `react` / `react-dom` | 18.2.x | - | - | - |
| `next-sanity` | 11.6.12 | `^18.3` o `^19` | `^15.1.0-0` o `^16.0.0-0` | si |
| `@sanity/visual-editing` | 4.0.3 | `^18.3` o `^19` | `>=15.0.0-rc` o `>=16.0.0-0` | si |
| `sanity` | 4.22.0 | `^18` o `^19` | - | si |
| `@sentry/nextjs` | 10.34.0 | - | `^13.2`, `^14`, `^15.0.0-rc.0` o `^16.0.0-0` | si |
| `framer-motion` | 11.18.2 | `^18` o `^19` | - | si |
| `@radix-ui/*` (5 paquetes) | varias | incluye `^19` | - | si |
| `styled-components` | 6.3.8 | `>= 16.8.0` | - | si |
| `zustand` | 5.0.10 | `>=18.0.0` | - | si |
| `@heroicons/react` | 2.2.0 | `>= 16` | - | si |
| `@testing-library/react` | 16.3.1 | `^18` o `^19` | - | si |
| `react-leaflet` | 4.2.1 | `^18.0.0` | - | **no** |

**El unico paquete que bloqueaba React 19 era `react-leaflet`, y resulta ser dependencia muerta.**
`grep -rn "react-leaflet"` sobre todo el repo, excluyendo `node_modules` y el lock, devuelve una
sola coincidencia: la linea 35 de `package.json`. El mapa esta implementado en
`components/maps/LeafletMap.tsx` con la API vanilla (`import L from 'leaflet'` mas `useRef` y
`useEffect`), sin pasar nunca por `react-leaflet`. Se elimina y desaparece el bloqueo.

## Decision pendiente: Next 15 o Next 16

**No decidida.** Se documentan las dos rutas para poder retomar con criterio.

| Dimension | Next 15 | Next 16 |
|-----------|---------|---------|
| APIs de request asincronas | Obligatorias, con compatibilidad sincrona temporal y warning | Acceso sincrono **eliminado** |
| Bundler | webpack por defecto, Turbopack opt-in | **Turbopack por defecto** en `dev` y `build`; escape con `--webpack` |
| `next lint` | Existe | **Eliminado**; hay codemod `next-lint-to-eslint-cli` |
| React 18 | Soportado | **Deprecado**; se remueve en Next 17 |
| `next-sanity@11` | Compatible | Compatible |

**Recomendacion: etapa 1 hacia Next 15 mas React 19, etapa 2 hacia Next 16.**

El trabajo conceptual pesado (APIs asincronas, React 19, limpieza de `next.config.js`) es identico
en ambas rutas y no se paga dos veces si se hace bien en la etapa 1. Lo que Next 16 agrega encima
es infraestructura de build: Turbopack por defecto y la migracion de `next lint`. Separarlo permite
validar un cambio por vez sobre un sitio en produccion, en lugar de mezclar migracion de framework
con cambio de bundler en el mismo deploy.

Si el owner prefiere una sola migracion, la ruta directa a 16 es viable: la superficie de codigo es
la misma y los pasos extra estan listados en la seccion "Solo si se va a Next 16".

## Inventario de cambios

### 1. APIs de request asincronas

En Next 15 `cookies()`, `headers()`, `draftMode()`, `params` y `searchParams` pasan a ser
asincronos. Sitios afectados en este repo, todos verificados:

| Archivo | Linea | Hoy | Despues |
|---------|-------|-----|---------|
| `lib/admin/auth.ts` | 73 | `cookies().set(...)` | `(await cookies()).set(...)` |
| `lib/admin/auth.ts` | 82-84 | `export function clearAdminSession()` | **pasa a `async`** mas `(await cookies()).delete(...)` |
| `lib/admin/auth.ts` | 88 | `cookies().get(...)` | `(await cookies()).get(...)` |
| `app/admin/actions.ts` | 21 | `clearAdminSession()` | `await clearAdminSession()` |

`setAdminSession` y `getAdminSession` ya son `async`: solo cambia la expresion interna.
`clearAdminSession` es la unica que cambia de firma, y arrastra a su unico llamador.

Paginas con `params` o `searchParams`:

| Archivo | Que recibe | Nota |
|---------|-----------|------|
| `app/admin/login/page.tsx` | `searchParams` | **No es `async` hoy.** Debe pasar a `async` para poder await |
| `app/admin/vehiculos/nuevo/page.tsx` | `searchParams` | ya `async` |
| `app/admin/vehiculos/page.tsx` | `searchParams` con 7 campos | ya `async` |
| `app/admin/vehiculos/[id]/editar/page.tsx` | `params` mas `searchParams` | ya `async` |
| `app/vehiculos/[slug]/page.tsx` | `params` en `generateMetadata`, linea 46 | ya `async` |
| `app/vehiculos/[slug]/page.tsx` | `params` en la pagina, linea 100 | ya `async` |

El patron es uniforme: el tipo pasa de `{ slug: string }` a `Promise<{ slug: string }>` y el cuerpo
hace `const { slug } = await params`. Existe codemod oficial
(`npx @next/codemod@canary upgrade latest`), pero el resultado debe revisarse a mano: son 10 sitios
en total, no vale la pena aceptar el diff a ciegas.

### 2. `next.config.js`

| Opcion actual | Accion | Motivo |
|---------------|--------|--------|
| `experimental.instrumentationHook: true` | **Eliminar** | Estable desde Next 15; la bandera ya no corresponde |
| `experimental.serverComponentsExternalPackages: ['require-in-the-middle']` | **Mover** a `serverExternalPackages` top-level | Renombrada y estabilizada en Next 15 |
| `experimental.serverActions.bodySizeLimit: '15mb'` | **Verificar ubicacion** | No se pudo confirmar en la documentacion consultada si sigue bajo `experimental`. Critico: sostiene la subida de imagenes del admin. Si queda mal ubicada, vuelve el limite default de 1MB y aparecen `413` |

El resto de `next.config.js` (`images`, `redirects`, `headers`, `compress`, `poweredByHeader`,
`reactStrictMode`) no tiene cambios conocidos.

### 3. Dependencias

| Paquete | Hoy | Objetivo | Motivo |
|---------|-----|----------|--------|
| `next` | `^14.1.0` | `^15` o `^16` | decision pendiente |
| `react` / `react-dom` | `^18.2.0` | `^19` | peer de `next-sanity` y deprecacion en Next 16 |
| `@types/react` / `@types/react-dom` | `^18.2.0` | `^19` | acompanan a React |
| `eslint-config-next` | `^14.1.0` | igualar a `next` | evita reglas desalineadas |
| `react-leaflet` | `^4.2.1` | **eliminar** | nunca se importa; era el unico bloqueador de React 19 |

`@types/leaflet` se conserva: `components/maps/LeafletMap.tsx` usa la API vanilla y necesita esos
tipos. Nota lateral fuera de alcance: hoy vive en `dependencies` y conceptualmente corresponde a
`devDependencies`.

### 4. Lo que NO cambia, verificado

Esta seccion existe para no volver a revisar lo mismo en la implementacion.

- `useFormStatus` (`components/admin/VehicleSubmitButton.tsx` y
  `components/admin/VehicleFormSecondaryActions.tsx`) **sigue existiendo** en React 19. El
  renombrado fue `useFormState` hacia `useActionState`, y este repo no usa `useFormState`.
- `forwardRef` en los 7 componentes de `components/ui/` sigue soportado en React 19.
- No hay `defaultProps` ni `propTypes` en componentes de funcion, removidos en React 19: cero
  coincidencias en `app`, `components` y `lib`.
- No hay `ReactDOM.render` ni `ReactDOM.hydrate`.
- No se usan `serverRuntimeConfig` ni `publicRuntimeConfig`, removidos en Next 16.
- No se usa `experimental.dynamicIO`, renombrado a `cacheComponents` en Next 16.
- El cacheo de datos no depende del default de `fetch`. Next 15 dejo de cachear `fetch` por
  defecto, pero este repo siempre pasa la opcion explicita: `next: { revalidate: 60 }` en
  `lib/vehicles.ts` y `lib/featured-vehicles.ts`, y `next: { revalidate: 0 }` en los cuatro
  clientes del admin (`lib/admin/vehicles.ts`). Aun asi debe confirmarse en pruebas que
  `next-sanity` propaga la opcion igual en la version nueva.
- `export const dynamic = 'force-dynamic'` en las 3 paginas admin y `export const revalidate = 60`
  en `app/vehiculos/page.tsx` y `app/sitemap.ts` mantienen su semantica.

### 5. Solo si se va a Next 16

- **Turbopack por defecto** en `next dev` y `next build`. Impacto a verificar: subida de source
  maps de Sentry (`@sentry/nextjs` 10.34), `sharp` como paquete externo de servidor, y el CSS de
  Leaflet importado desde el componente cliente. Existe `--webpack` como escape, pero usarlo es
  deuda, no solucion.
- **`next lint` eliminado.** `package.json` declara `"lint": "next lint"`: ese script deja de
  funcionar y hay que migrarlo a ESLint CLI. La opcion `eslint` en `next.config.js` tampoco se
  soporta. Codemod disponible: `npx @next/codemod@canary next-lint-to-eslint-cli .`
- **Sin ventana de compatibilidad sincrona.** En Next 15 un `params` sin await avisa y sigue
  funcionando; en Next 16 rompe. La migracion de la seccion 1 debe estar completa, no parcial.

### 6. Riesgo especifico: el guard de Server Actions

`lib/admin/serverActionId.ts` valida el header `Next-Action` con `/^[0-9a-f]{40,}$/i`, y
`middleware.ts` devuelve `400` si no matchea. Ese regex depende del **formato interno** de los IDs
de Server Action que genera Next, que no es API publica.

`D-006` ya anticipaba exactamente esto. Si el formato cambia en 15 o 16, el guard empieza a
rechazar acciones legitimas y el admin deja de guardar, editar y eliminar. **Sintoma esperado si
ocurre:** el formulario no responde y el log muestra `400 Invalid Server Action`.

Verificacion obligatoria antes de mergear: capturar un header `Next-Action` real generado por la
version nueva y contrastarlo contra el regex. `__tests__/serverActionId.test.ts` cubre la forma
actual pero no puede anticipar un cambio de formato: es una prueba de contrato contra un detalle
interno del framework.

## Pasos de implementacion

- [ ] Decidir Next 15 o Next 16 y registrar la decision en `docs/logbook.md`
- [ ] Crear rama desde `main`
- [ ] Eliminar `react-leaflet` de `package.json` y confirmar que el mapa sigue renderizando
- [ ] Subir `react`, `react-dom`, `@types/react` y `@types/react-dom` a 19
- [ ] Subir `next` y `eslint-config-next` a la version elegida
- [ ] Correr el codemod oficial y **revisar el diff a mano**, sin aceptarlo a ciegas
- [ ] Migrar los 4 sitios de `cookies()` y la firma de `clearAdminSession`
- [ ] Migrar los 6 sitios de `params` y `searchParams`, incluyendo pasar `AdminLoginPage` a `async`
- [ ] Limpiar `next.config.js`: `instrumentationHook`, `serverExternalPackages` y verificar `bodySizeLimit`
- [ ] Verificar que `npm ci` deja de emitir `ERESOLVE` y cerrar `D-006`
- [ ] Capturar un `Next-Action` real y validar el guard del middleware
- [ ] Solo Next 16: migrar `next lint` a ESLint CLI y validar el build con Turbopack
- [ ] Ejecutar la validacion completa y documentarla en este IMP
- [ ] Desplegar y verificar en produccion antes de dar el frente por cerrado

## Impacto esperado

Sin cambios visibles para el visitante. El sitio publico, el catalogo, la ficha y el flujo de
WhatsApp mantienen su comportamiento. El admin mantiene su flujo completo. El beneficio es
estructural: arbol de dependencias coherente, `npm ci` sin conflicto de peers y un stack con
soporte vigente.

## Riesgos

| Riesgo | Probabilidad | Mitigacion |
|--------|-------------|------------|
| El guard de `Next-Action` rechaza acciones validas y el admin deja de guardar | media | Capturar un header real de la version nueva y contrastarlo antes de mergear; rollback es revertir la rama |
| `bodySizeLimit` queda mal ubicado y vuelven los `413` al subir fotos | media | Verificar la ubicacion en la documentacion de la version elegida y probar una subida real de imagen pesada |
| Turbopack rompe la subida de source maps de Sentry, solo Next 16 | media | Validar el build completo antes de desplegar; `--webpack` como escape temporal, documentado como deuda |
| `next-sanity` cambia como propaga `next: { revalidate }` y se degrada el cacheo | baja | Verificar tiempos de respuesta y frescura de `/vehiculos` tras el deploy |
| React 19 cambia el comportamiento de hidratacion en componentes cliente | baja | Hay 30 archivos con `'use client'`; revisar consola del navegador en las rutas clave |
| El deploy vuelve a fallar por entorno y no por codigo | baja | `.npmrc` con `include=dev` ya blinda las devDependencies, ver `LOG-20260913-003` |

## Rollback

1. No mergear la rama si falla cualquier flujo del admin o una ruta publica.
2. Si ya se desplego: volver a desplegar el commit estable anterior desde EasyPanel.
3. Revertir el commit de la iniciativa. No toca Sanity, ni el schema, ni datos, asi que el rollback
   es puramente de codigo.
4. No reponer `NODE_ENV` en EasyPanel ni borrar `.npmrc` durante el rollback, ver `LOG-20260913-003`.

## Evidencia de validacion

Pendiente. Se completa durante la implementacion.

- [ ] `npm ci` limpio, sin `ERESOLVE`
- [ ] `npm run lint`, o ESLint CLI si se fue a Next 16
- [ ] `npm run test`
- [ ] `npx tsc --noEmit --pretty false`
- [ ] `npm run build` explicito antes del deploy
- [ ] `/`, `/vehiculos`, `/vehiculos/[slug]`, `/servicios`, `/nosotros` y `/contacto` responden 200
- [ ] El mapa de `/contacto` renderiza tras eliminar `react-leaflet`
- [ ] Admin: login, listado, alta, edicion, eliminacion, destacados y logout
- [ ] Subida de una imagen pesada sin `413`
- [ ] Header `Next-Action` real capturado y validado contra el guard
- [ ] Consola del navegador sin errores de hidratacion en las rutas clave
- [ ] Logs post-deploy sin nuevos timeouts a Sanity

## Definition of Done

- [x] Carpeta `IMP-20260913-002/` con `IMP.md` existe
- [ ] Decision Next 15 vs Next 16 registrada en `docs/logbook.md`
- [ ] Evidencia de validacion documentada en este IMP
- [x] Impacto, riesgos y rollback documentados
- [ ] `D-006` actualizado o cerrado segun resultado
- [ ] Referencias cruzadas log, IMP y artefactos completas

## Referencias

- `docs/reference/deuda-tecnica.md` - `D-006`, peer de `next-sanity`, y anti-deuda de `NODE_ENV`
- `docs/logbook.md` - `LOG-20260913-003` incidente de deploy, `LOG-20260913-004` este frente
- `docs/implementation/IMP-20260913-001/` - retirada de Studio y guard de `Next-Action`
- `lib/admin/auth.ts`, `lib/admin/serverActionId.ts`, `middleware.ts`
- `next.config.js`, `package.json`, `components/maps/LeafletMap.tsx`
- Guias oficiales de Next.js: `docs/01-app/02-guides/upgrading/version-15.mdx` y `version-16.mdx`
