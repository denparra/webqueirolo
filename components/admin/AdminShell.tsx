import Link from 'next/link'
import { logoutAction } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/admin/vehiculos" className="text-xl font-bold text-gray-900">
              Admin Queirolo Autos
            </Link>
            <p className="text-sm text-gray-500">Gestión privada del inventario</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/vehiculos" target="_blank">
                Ver sitio público
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/studio" target="_blank">
                Abrir Studio
              </Link>
            </Button>
            <form action={logoutAction}>
              <Button variant="secondary" size="sm" type="submit">
                Salir
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
