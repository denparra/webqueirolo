'use client'

import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShareWhatsAppButton } from '@/components/vehicles/ShareWhatsAppButton'
import { cn } from '@/lib/utils'

export function VehicleFormSecondaryActions({
  vehicleSlug,
  vehicleName,
  shareUrl,
}: {
  vehicleSlug?: string
  vehicleName?: string
  shareUrl: string
}) {
  const { pending } = useFormStatus()

  return (
    <div
      className={cn('flex flex-col gap-3 md:flex-row', pending && 'pointer-events-none opacity-50')}
      aria-disabled={pending}
      onClickCapture={(event) => {
        if (pending) event.preventDefault()
      }}
    >
      <Button variant="outline" asChild>
        <Link href="/admin/vehiculos">Cancelar</Link>
      </Button>
      {vehicleSlug && (
        <Button variant="secondary" asChild>
          <Link href={`/vehiculos/${vehicleSlug}`} target="_blank">
            Preview público
          </Link>
        </Button>
      )}
      {vehicleSlug && vehicleName && (
        <ShareWhatsAppButton vehicleName={vehicleName} vehicleUrl={shareUrl} label="Compartir" />
      )}
    </div>
  )
}
