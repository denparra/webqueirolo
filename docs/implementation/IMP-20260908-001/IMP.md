# IMP-20260908-001 - Fijar runtime Node compatible

## Objetivo

Evitar que EasyPanel construya y ejecute la aplicación con Node 18, versión incompatible con las dependencias actuales de Sanity y otras dependencias transitivas.

## Cambios

- `package.json` declara Node `>=22.12.0 <23` y npm `>=10 <12`.
- `package-lock.json` replica la metadata `engines` del paquete raíz.
- Se creó el tag `pre-node22-20260908` sobre el commit `246ec12` para rollback.

## Validación

- `npm run lint` OK.
- `npm test -- --runInBand` OK: 24 tests en 4 suites.
- `npx tsc --noEmit --pretty false` OK.
- No se ejecutó `npm run build` localmente por la regla operativa del repositorio.
- La validación local se ejecutó con Node 20.19.3; queda pendiente confirmar el build con Node 22.12+ en EasyPanel.

## Riesgos y pendientes

- `next-sanity@11.6.12` declara un peer de Next 15/16, mientras el proyecto usa Next 14.2.35. No se resolvió en esta iniciativa para evitar una actualización mayor no validada.
- El cambio de Node no resuelve por sí solo timeouts hacia `cdn.sanity.io`, reinicios `SIGTERM` ni errores de desalineación de Server Actions.
- Las 51 vulnerabilidades npm y las advertencias de secretos en ARG/ENV requieren revisiones separadas.

## Rollback

Restaurar la imagen o el código al tag `pre-node22-20260908` si el despliegue con Node 22 presenta regresiones.
