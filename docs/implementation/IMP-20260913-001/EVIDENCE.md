# EVIDENCE - IMP-20260913-001

## Baseline previo

- VPS: Node `22.14.0`, Next `14.2.35`.
- Un contenedor de `web-queirolo`, sin reinicios.
- `UV_THREADPOOL_SIZE=16`.
- `NODE_ENV` vacio (esperado: `next start` lo fija a `production` dentro del proceso;
  ver `next/dist/bin/next`). No es un defecto y no debe definirse en EasyPanel.
- Consulta Sanity directa desde contenedor: `200` en `282 ms`.
- Rutas publicas comprobadas: todas `200`, entre `49 ms` y `260 ms`.
- En la rafaga observada: respuestas RSC de hasta `40 s`, imagenes `499` y timeouts
  Sanity entre `23:38:09` y `23:38:54` UTC.

## Evidencia de causa

- Una misma IP abrio admin, seis fichas, cinco ediciones y Studio en la misma ventana.
- `app/admin/vehiculos/page.tsx` renderiza enlaces a cada destino.
- `components/admin/AdminShell.tsx` enlaza `/studio` explicitamente.
- `/admin` hereda el layout publico por ausencia de `app/admin/layout.tsx`.

## Validacion posterior

Estado tras la implementacion local:

- [x] Playwright: login real y carga de `/admin/vehiculos`; 27 solicitudes y cero solicitudes a Studio, fichas, ediciones o `/_next/image` por prefetch.
- [x] Verificacion de retirada de `/studio`: HTTP 404.
- [x] Tests del guard `Next-Action`.
- [x] Lint.
- [x] Jest: 7 suites, 56 tests.
- [x] TypeScript.
- [x] Flujo local autenticado de `/admin`.
- [ ] Prueba de flujo de alta y edicion.
- [ ] Deploy de rama.
- [ ] Logs post-restart sin fan-out ni nuevos timeouts.
