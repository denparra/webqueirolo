// Vehicle Types
export interface Vehicle {
  id: string
  slug: string
  brand: string
  model: string
  year: number
  price: number
  monthlyPayment: number
  km: number
  transmission: 'Automático' | 'Manual' | string
  fuelType: 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico' | string
  image: string
  images: string[]
  isNew: boolean
  specs: VehicleSpecs
  features: string[]
  // Sanity specific fields (can be optional or mapped)
  category?: string
  version?: string
  status?: string
  comfortFeatures?: string[]
  safetyFeatures?: string[]
  entertainmentFeatures?: string[]
  otherFeatures?: string[]
  description?: string
  plate?: string
}

export interface VehicleSpecs {
  engine: string
  power: string
  torque: string
  drivetrain: string
  seating: number
  color: string
  doors: number
  vin?: string
}

// Filter Types
export interface VehicleFilters {
  brands: string[]
  priceMin: number
  priceMax: number
  yearMin: number
  yearMax: number
  kmMax: number
  transmissions: string[]
  fuelTypes: string[]
}

export interface FilterOption {
  id: string
  name: string
  count?: number
}

// Form Types
export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export interface FinancingFormData {
  // Personal Data
  name: string
  rut: string
  email: string
  phone: string
  comuna: string

  // Vehicle Data
  vehicleId?: string
  vehicleBrand?: string
  vehicleModel?: string
  vehicleYear?: number
  vehiclePrice?: number

  // Credit Data
  downPayment: number
  term: number
}

export interface ConsignmentFormData {
  name: string
  phone: string
  email: string
  brand: string
  model: string
  year: number
  km: number
  price: number
  message?: string
}

// Loan Calculation Types
export interface LoanResult {
  downPayment: number
  financingAmount: number
  monthlyPayment: number
  totalToPay: number
  totalInterest: number
}
