# Quick Win 05 - Lazy-load del mapa en /contacto

## Que se cambio
- Se creo un wrapper que carga Leaflet solo bajo demanda.
- El mapa y sus tiles no se descargan hasta que el usuario hace click en "Cargar mapa".

## Archivos / rutas
- `components/maps/LazyContactMap.tsx`
- `app/contacto/page.tsx`

## Checklist de verificacion
- [ ] Abrir `/contacto` y revisar Network al cargar (sin tiles OSM).
- [ ] Hacer click en "Cargar mapa" y confirmar que se descargan los tiles.
- [ ] Confirmar que el mapa funciona y el marcador aparece.
