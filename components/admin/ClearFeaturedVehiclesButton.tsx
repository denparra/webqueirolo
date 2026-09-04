'use client'

import { Button } from '@/components/ui/button'

export function ClearFeaturedVehiclesButton() {
  return (
    <Button
      type="submit"
      variant="outline"
      size="sm"
      className="border-amber-300 text-amber-800 hover:bg-amber-50"
      onClick={(event) => {
        const confirmed = window.confirm(
          '¿Quitar el destacado de todos los vehículos? Después podrás seleccionar nuevos destacados desde cada ficha.'
        )

        if (!confirmed) event.preventDefault()
      }}
    >
      Quitar todos los destacados
    </Button>
  )
}
