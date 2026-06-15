import {
  validateVehicleForm,
  YEAR_MIN,
  YEAR_MAX,
  type VehicleFormValues,
} from '@/lib/admin/vehicleFormValidation'

const validValues: VehicleFormValues = {
  name: 'Toyota RAV4 2.0 Lujo',
  brand: 'Toyota',
  model: 'RAV4',
  year: '2022',
  price: '18990000',
}

describe('validateVehicleForm', () => {
  it('returns no errors for a fully valid form', () => {
    expect(validateVehicleForm(validValues)).toEqual({})
  })

  it('flags empty required text fields', () => {
    const errors = validateVehicleForm({
      ...validValues,
      name: '   ',
      brand: '',
      model: '',
    })
    expect(errors.name).toBeDefined()
    expect(errors.brand).toBeDefined()
    expect(errors.model).toBeDefined()
  })

  it('rejects an empty price', () => {
    expect(validateVehicleForm({ ...validValues, price: '' }).price).toBeDefined()
  })

  it('rejects a price of zero (HTML5 min="0" no lo bloquea)', () => {
    expect(validateVehicleForm({ ...validValues, price: '0' }).price).toBeDefined()
  })

  it('rejects a negative price', () => {
    expect(validateVehicleForm({ ...validValues, price: '-100' }).price).toBeDefined()
  })

  it('accepts a positive price', () => {
    expect(validateVehicleForm({ ...validValues, price: '1' }).price).toBeUndefined()
  })

  it('rejects years outside the allowed range', () => {
    expect(validateVehicleForm({ ...validValues, year: String(YEAR_MIN - 1) }).year).toBeDefined()
    expect(validateVehicleForm({ ...validValues, year: String(YEAR_MAX + 1) }).year).toBeDefined()
    expect(validateVehicleForm({ ...validValues, year: '' }).year).toBeDefined()
    expect(validateVehicleForm({ ...validValues, year: 'abc' }).year).toBeDefined()
  })

  it('accepts years at the range boundaries', () => {
    expect(validateVehicleForm({ ...validValues, year: String(YEAR_MIN) }).year).toBeUndefined()
    expect(validateVehicleForm({ ...validValues, year: String(YEAR_MAX) }).year).toBeUndefined()
  })
})
