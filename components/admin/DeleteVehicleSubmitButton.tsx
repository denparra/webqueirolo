'use client'

import { Button } from '@/components/ui/button'

export function DeleteVehicleSubmitButton({ label = 'Eliminar' }: { label?: string }) {
  return (
    <Button
      type="submit"
      variant="outline"
      size="sm"
      className="border-red-300 text-red-700 hover:bg-red-50"
      onClick={(event) => {
        const confirmed = window.confirm(
          '¿Seguro que quieres eliminar este vehículo? Esta acción borra el documento del inventario, pero no elimina los archivos de imagen del asset manager de Sanity.'
        )

        if (!confirmed) {
          event.preventDefault()
        }
      }}
    >
      {label}
    </Button>
  )
}
