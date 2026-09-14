# ROADMAP - IMP-20260913-001

## Fase 0 - Base y aislamiento

- Confirmar rama `fix/admin-request-fanout` desde el `main` actual.
- Mantener fuera del alcance los cambios preexistentes no relacionados.
- Registrar el estado inicial de Git y las pruebas de referencia.

## Fase 1 - Cerrar el fan-out inmediato

- Reemplazar `Link` con `target="_blank"` por `<a>` en admin.
- Anadir `prefetch={false}` a enlaces de edicion.
- Quitar enlace visible a Studio.
- Evaluar `unoptimized` o URL transformada de Sanity para miniaturas admin.
- Crear pruebas de regresion.

## Fase 2 - Retirar Studio

- Eliminar la ruta embebida y su configuracion.
- Verificar si `sanity`, schema y CLI siguen siendo necesarios.
- Eliminar solo dependencias realmente exclusivas de Studio.
- Verificar que el admin propio continua escribiendo en Sanity.

## Fase 3 - Robustez de despliegue

- No fijar `NODE_ENV` en EasyPanel: Next ya lo resuelve y definirlo rompe `npm ci` en build.
- Revisar `UV_THREADPOOL_SIZE=16`.
- Anadir guard para `Next-Action` invalido, con tests.
- No introducir `BUILD_ID` fijo.

## Fase 4 - Validacion

- `npm run lint`.
- `npm run test -- --runInBand`.
- `npx tsc --noEmit --pretty false`.
- Prueba de navegador con inspeccion de requests.
- Deploy de rama y prueba remota con logs separados.

## Fase 5 - Merge

- Revisar diff completo y estado del worktree.
- Confirmar criterios de aceptacion.
- Crear commit convencional solo con archivos de la iniciativa.
- Push de la rama.
- Merge a `main` despues de la validacion.
