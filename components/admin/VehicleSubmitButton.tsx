'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export function VehicleSubmitButton({
  isEditing,
  processingImages,
}: {
  isEditing: boolean
  processingImages: boolean
}) {
  const { pending } = useFormStatus()

  const label = processingImages
    ? 'Optimizando imágenes…'
    : pending
      ? 'Guardando…'
      : isEditing
        ? 'Guardar cambios'
        : 'Crear vehículo'

  return (
    <Button type="submit" disabled={pending || processingImages}>
      {label}
    </Button>
  )
}
