// Catálogo de colores de vehículo del mercado chileno. Fuente única de
// verdad, consumida por el form de /admin (lib/admin/vehicleOptions.ts) y por
// el schema de Sanity (sanity/schemaTypes/vehicle.ts) para mantener ambos
// dropdowns sincronizados.
export const VEHICLE_COLORS = [
  'BLANCO',
  'NEGRO',
  'GRIS',
  'PLATA',
  'AZUL',
  'ROJO',
  'VERDE',
  'AMARILLO',
  'NARANJA',
  'CAFE',
  'BEIGE',
  'DORADO',
  'VINO',
] as const

// Valor especial para colores no listados. Se muestra siempre al final del
// dropdown, fuera del orden de catálogo, y habilita un input de texto libre.
export const OTHER_COLOR_OPTION = 'Otra'
