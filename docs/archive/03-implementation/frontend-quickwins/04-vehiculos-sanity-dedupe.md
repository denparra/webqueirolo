# Quick Win 04 - Dedupe de Sanity en /vehiculos

## Que se cambio
- Se agrego una proteccion contra doble fetch en dev/StrictMode.
- Esto evita la segunda llamada identica a Sanity en `/vehiculos`.

## Archivos / rutas
- `app/vehiculos/page.tsx`

## Checklist de verificacion
- [ ] Abrir `/vehiculos` en dev y revisar Network.
- [ ] Confirmar una sola request a Sanity por carga inicial.
- [ ] Verificar que la lista sigue renderizando correctamente.
