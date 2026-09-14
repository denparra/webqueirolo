# ROLLBACK - IMP-20260913-001

## Codigo

- No hacer merge de `fix/admin-request-fanout` si falla cualquier flujo del admin.
- Revertir el commit de la iniciativa, sin tocar cambios previos de `main`.
- Restaurar la ruta de Studio y sus dependencias desde el commit anterior si se
  determina que son necesarias para recuperacion.

## Despliegue

- Volver a desplegar el commit anterior conocido como estable.
- Restaurar el start command y variables solo si fueron modificados en EasyPanel.
- No reponer `NODE_ENV` en EasyPanel: fue la causa del build roto del 2026-09-13.
- No borrar `.npmrc`; sin `include=dev` el build vuelve a quedar expuesto al mismo fallo.

## Criterio de rollback

- Login, guardar, eliminar o editar falla.
- La ficha publica deja de responder `200`.
- Aparecen nuevos timeouts Sanity en una prueba sin carga extraordinaria.
- El guard rechaza IDs validos de Server Actions.
