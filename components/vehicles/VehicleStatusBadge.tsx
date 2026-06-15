import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  available: 'Disponible',
  reserved: 'Reservado',
  sold: 'Vendido',
}

const STATUS_CLASSES: Record<string, string> = {
  available: 'bg-green-50 text-green-700 ring-green-600/20',
  reserved: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  sold: 'bg-gray-900 text-white ring-gray-900/20',
}

export function getVehicleStatusLabel(status?: string): string {
  return STATUS_LABELS[status || 'available'] || 'Disponible'
}

export function VehicleStatusBadge({
  status,
  className,
  showAvailable = false,
}: {
  status?: string
  className?: string
  showAvailable?: boolean
}) {
  const normalizedStatus = status || 'available'

  if (normalizedStatus === 'available' && !showAvailable) {
    return null
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset',
        STATUS_CLASSES[normalizedStatus] || STATUS_CLASSES.available,
        className
      )}
    >
      {getVehicleStatusLabel(normalizedStatus)}
    </span>
  )
}
