import { Metadata } from 'next'
import config from '@/config'

export const metadata: Metadata = {
  title: 'Vehículos Disponibles - Queirolo Autos',
  description: 'Explora nuestro stock de vehículos seminuevos certificados. Financiamiento disponible y parte de pago. Lo Barnechea, Santiago.',
  // Canonical fijo a la URL limpia: consolida las variantes con filtros (?brand=…) sin volver dinámica la ruta.
  alternates: { canonical: `${config.url}/vehiculos` },
}

export default function VehiculosLayout({ children }: { children: React.ReactNode }) {
  return children
}
