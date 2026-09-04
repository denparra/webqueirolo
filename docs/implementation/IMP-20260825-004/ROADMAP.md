# ROADMAP - IMP-20260825-004

## Secuencia aprobada

| Fase | Resultado | Dependencias | Estado |
|------|-----------|--------------|--------|
| F0 | Contratos de proyecto, marca, auth y secretos | SOT aprobado | Pendiente |
| F1 | Shell seguro del Centro de Control en `app/panel-web-automotoras/` | F0 | Pendiente |
| F2 | CRUD de proyectos y configuracion publica | F1 + persistencia metadata | Pendiente |
| F3 | Conexion Sanity y estado de secretos | F2 + secret manager | Pendiente |
| F4 | Provisionamiento Railway/dominio/deploy | F3 + proveedor elegido | Pendiente |
| F5 | Extraccion de Queirolo a template reusable | F0 + F2 | Pendiente |
| F6 | Onboarding completo de una nueva automotora | F4 + F5 | Pendiente |

## Orden de trabajo recomendado

1. No tocar el `/admin` funcional.
2. Definir los contratos antes de crear formularios.
3. Implementar login y autorizacion separados.
4. Implementar metadata sin secretos.
5. Integrar secretos solo desde server-side.
6. Registrar Queirolo como proyecto `existing`.
7. Probar el flujo con datos de prueba.
8. Automatizar infraestructura despues de validar el modelo.

## Fuera de esta primera entrega

- Migracion de Queirolo a otra base de datos.
- Reemplazo del login del cliente.
- Multiusuario avanzado.
- Facturacion.
- CRM.
- Provisionamiento automatico de todos los proveedores.
