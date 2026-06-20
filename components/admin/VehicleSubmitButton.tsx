'use client'

import { useFormStatus } from 'react-dom'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export function VehicleSubmitButton({
  isEditing,
  processingImages,
}: {
  isEditing: boolean
  processingImages: boolean
}) {
  const { pending } = useFormStatus()
  const showSpinner = pending || processingImages

  const label = processingImages
    ? 'Optimizando imágenes…'
    : pending
      ? 'Guardando…'
      : isEditing
        ? 'Guardar cambios'
        : 'Crear vehículo'

  return (
    <Button type="submit" disabled={showSpinner}>
      {showSpinner && <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />}
      {label}
    </Button>
  )
}
