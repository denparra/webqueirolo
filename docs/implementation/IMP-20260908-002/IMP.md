# IMP-20260908-002 - Inventario activo de vehículos

## Objetivo

Mantener el histórico de vehículos en Sanity, pero mostrar y precalentar únicamente los vehículos actualmente disponibles.

## Cambios

- Se marcaron 15 vehículos seleccionados por el owner como `available`.
- Se marcaron los demás vehículos como `sold`, sin modificar nombres, precios, slugs ni imágenes.
- La consulta pública de `getVehicles()` filtra `status == "available"`.
- Las fichas históricas continúan almacenadas en Sanity y su consulta individual no fue eliminada.
- Se creó el tag `pre-active-inventory-20260908` antes del cambio de código.

## Vehículos disponibles

- RAM VAN 700 CITY 1.3 2022
- CHEVROLET COLORADO 2.8 4X4 HIGH COUNTRY 2023
- TOYOTA 4RUNNER LIMITED 4WD 2012
- FORD EXPLORER 2.3 LIMITED 4X4 2022
- VOLKSWAGEN POLO 1.6 COMFORTLINE 2018
- MERCEDES-BENZ GLC 43 AMG 3.0 4WD 2020
- TOYOTA FORTUNER 2.8 SRX DIESEL 4X4 2025
- Kia Morning 1.2 EX 2020
- MG 3 COMFORT 4X2 HB AUT 2022
- MAXUS T60 2.0 GLX DIESEL 4X4 2022
- GREAT WALL POER 2.0T DELUXE 2024
- ALFA ROME STELVIO 2.0 SUPER 2022
- NISSAN XTRAIL SENSE 2.5 AUT 4WD 2018
- SUBARU LEGACY 2.0 XS AWD AUT 2014
- CHEVROLET SILVERADO LTZ 4WD 2020

## Validación

- Consulta posterior en Sanity: 15 `available`, 42 `sold`, 57 documentos visibles en la consulta publicada.
- Pendiente: lint, tests y TypeScript después del filtro público.
- No se ejecuta build local por la regla operativa del repositorio.

## Rollback

- Datos: restaurar los estados desde el historial de Sanity o editar el campo `status`.
- Código: volver al tag `pre-active-inventory-20260908`.
