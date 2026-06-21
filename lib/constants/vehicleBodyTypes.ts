// Catálogo de tipos de carrocería del mercado chileno. Fuente única de
// verdad, consumida por el form de /admin (lib/admin/vehicleOptions.ts) y por
// el schema de Sanity (sanity/schemaTypes/vehicle.ts) para mantener ambos
// dropdowns sincronizados.
export const VEHICLE_BODY_TYPES = [
  'SEDÁN',
  'HATCHBACK',
  'SUV',
  'STATION WAGON',
  'COUPÉ',
  'CONVERTIBLE',
  'PICKUP',
  'CAMIONETA',
  'FURGÓN',
  'VAN',
  'TODO TERRENO',
] as const

// Valor especial para carrocerías no listadas. Se muestra siempre al final
// del dropdown, fuera del orden de catálogo, y habilita un input de texto
// libre.
export const OTHER_BODYTYPE_OPTION = 'Otra'
