# EVIDENCE - IMP-20260825-004

## Evidencia inicial

### Estado actual confirmado

- `/admin` existe y opera sobre inventario Sanity.
- `middleware.ts` protege `/admin` mediante la cookie `qa_admin_session`.
- `lib/admin/auth.ts` obtiene credenciales desde variables de entorno.
- `lib/admin/vehicles.ts` utiliza `SANITY_API_WRITE_TOKEN` server-only.
- `config.ts` contiene configuracion de marca y negocio de Queirolo.
- `docs/reference/automotive-platform-specification.md` define la plataforma reusable.
- No existe aun la carpeta/módulo `app/panel-web-automotoras/` ni su ruta UI `/panel-web-automotoras`.
- No existe aun un modelo persistente de proyectos de plataforma.
- No existe aun integracion del repositorio con Railway para provisionamiento.

## Evidencia pendiente

- [ ] Diseño de auth separada.
- [ ] Contrato de `AutomotiveProject`.
- [ ] Persistencia del Control Plane.
- [ ] Estrategia de secretos.
- [ ] Primer shell del Centro de Control en `app/panel-web-automotoras/`.
- [ ] Registro de Queirolo como proyecto existente.
- [ ] Pruebas de aislamiento `/admin` vs `/panel-web-automotoras`.
- [ ] Validacion de dominio y health check.
