import { Button } from '@/components/ui/button'
import { ShareIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import siteConfig from '@/config'

interface ShareWhatsAppButtonProps {
  vehicleName: string
  vehicleUrl: string
  className?: string
  label?: string
}

/**
 * Botón para compartir el link público de un vehículo por WhatsApp.
 * Usa wa.me sin número destino para que el usuario elija el contacto;
 * el texto incluye el nombre del vehículo y su URL pública.
 */
export function ShareWhatsAppButton({
  vehicleName,
  vehicleUrl,
  className,
  label = 'Compartir por WhatsApp',
}: ShareWhatsAppButtonProps) {
  const message = `Mira este auto en ${siteConfig.company.fullName}: ${vehicleName} - ${vehicleUrl}`
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`

  return (
    <Button variant="outline" className={cn(className)} asChild>
      <a href={shareUrl} target="_blank" rel="noopener noreferrer">
        <ShareIcon className="mr-2 h-5 w-5" />
        {label}
      </a>
    </Button>
  )
}
