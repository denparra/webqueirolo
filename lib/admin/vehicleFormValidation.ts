// Validación pura y reutilizable del formulario de vehículos del admin.
// Se mantiene separada del componente para poder testearla de forma aislada
// y para que client (VehicleForm) y, si se quiere, el server action compartan
// las mismas reglas.

export interface VehicleFormValues {
  name: string
  brand: string
  model: string
  year: string
  price: string
}

export const YEAR_MIN = 1990
export const YEAR_MAX = 2030

/**
 * Devuelve un mapa { campo: mensaje } con los errores encontrados.
 * Un objeto vacío significa que el formulario es válido.
 */
export function validateVehicleForm(values: VehicleFormValues): Record<string, string> {
  const errors: Record<string, string> = {}

  const name = values.name.trim()
  const brand = values.brand.trim()
  const model = values.model.trim()
  const yearRaw = values.year.trim()
  const priceRaw = values.price.trim()

  if (!name) errors.name = 'El nombre del vehículo es requerido'
  if (!brand) errors.brand = 'La marca es requerida'
  if (!model) errors.model = 'El modelo es requerido'

  const year = Number(yearRaw)
  if (!yearRaw || Number.isNaN(year) || year < YEAR_MIN || year > YEAR_MAX) {
    errors.year = `El año debe estar entre ${YEAR_MIN} y ${YEAR_MAX}`
  }

  const price = Number(priceRaw)
  if (!priceRaw || Number.isNaN(price) || price <= 0) {
    errors.price = 'El precio debe ser mayor a 0'
  }

  return errors
}
