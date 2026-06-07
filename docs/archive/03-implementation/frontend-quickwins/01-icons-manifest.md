# Quick Win 01 - Icons + Manifest

## Que se cambio
- Se agrego `public/favicon.ico`.
- Se agregaron `public/icons/icon-192x192.png` y `public/icons/icon-512x512.png`.
- `public/manifest.json` ya referenciaba estos paths, por lo que no se modifico.

## Archivos / rutas
- `public/favicon.ico`
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`
- `public/manifest.json` (sin cambios)

## Checklist de verificacion
- [ ] Abrir `http://localhost:3000/favicon.ico` y validar carga.
- [ ] Abrir `http://localhost:3000/icons/icon-192x192.png` y validar carga.
- [ ] Abrir `http://localhost:3000/icons/icon-512x512.png` y validar carga.
- [ ] Revisar Network en Home y confirmar sin 404 de iconos.
