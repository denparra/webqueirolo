# ROLLBACK - IMP-20260913-001

## Codigo

- No hacer merge de `fix/admin-request-fanout` si falla cualquier flujo del admin.
- Revertir el commit de la iniciativa, sin tocar cambios previos de `main`.
- Restaurar la ruta de Studio y sus dependencias desde el commit anterior si se
  determina que son necesarias para recuperacion.

## Despliegue

- Volver a desplegar el commit anterior conocido como estable.
- Restaurar el start command y variables solo si fueron modificados en EasyPanel.
- Mantener `NODE_ENV=production`; no revertir esta correccion operacional.

## Criterio de rollback

- Login, guardar, eliminar o editar falla.
- La ficha publica deja de responder `200`.
- Aparecen nuevos timeouts Sanity en una prueba sin carga extraordinaria.
- El guard rechaza IDs validos de Server Actions.
