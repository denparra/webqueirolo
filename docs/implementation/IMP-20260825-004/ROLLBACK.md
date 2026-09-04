# ROLLBACK - IMP-20260825-004

## Principio

El nuevo panel no debe ser una dependencia del frontend publico ni del `/admin` del cliente. Si falla, ambos deben continuar funcionando con su configuracion existente.

## Antes de implementar codigo

- Crear tag o punto de restauracion solicitado por el owner.
- Exportar metadata del Control Plane si ya existe.
- Confirmar que no se modificara el dataset Sanity de Queirolo.
- Confirmar variables actuales del `/admin` sin imprimir secretos.

## Si falla el panel

1. Deshabilitar la ruta o protegerla con maintenance flag.
2. Mantener `/admin` y las rutas publicas sin cambios.
3. Revocar cualquier token creado durante la prueba.
4. Restaurar la metadata del panel desde el backup.
5. Eliminar solo los registros de prueba que no tengan dependencias.
6. Registrar el incidente en `docs/logbook.md`.

## Si falla una provision

- Marcar el `ProvisioningJob` como `failed`.
- No repetir automaticamente operaciones no idempotentes.
- Revocar recursos parciales cuando sea seguro.
- Mantener el proyecto en estado `configuring`.
- Mostrar un mensaje seguro sin credenciales ni respuestas completas del proveedor.

## Que no se debe revertir automaticamente

- Documentos reales de vehiculos.
- Assets de imagen de Sanity.
- Dominio productivo.
- Variables productivas sin una orden explicita.
- Cambios no relacionados del worktree.
