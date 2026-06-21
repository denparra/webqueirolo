// Catálogo de categorías de vehículo del mercado chileno. Fuente única de
// verdad, consumida por el form de /admin (lib/admin/vehicleOptions.ts) y por
// el schema de Sanity (sanity/schemaTypes/vehicle.ts) para mantener ambos
// dropdowns sincronizados.
export const VEHICLE_CATEGORIES = [
  'SUV',
  'CAMIONETA',
  'SEDÁN',
  'HATCHBACK',
  'COUPÉ',
  'CONVERTIBLE',
  'COMERCIAL',
  'MOTO',
] as const

// Valor especial para categorías no listadas. Se muestra siempre al final del
// dropdown, fuera del orden de catálogo, y habilita un input de texto libre.
export const OTHER_CATEGORY_OPTION = 'Otra'
