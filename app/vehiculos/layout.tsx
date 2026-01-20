import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vehículos Disponibles - Queirolo Autos',
  description: 'Explora nuestro stock de vehículos seminuevos certificados. Financiamiento disponible y parte de pago. Las Condes, Santiago.',
}

export default function VehiculosLayout({ children }: { children: React.ReactNode }) {
  return children
}
