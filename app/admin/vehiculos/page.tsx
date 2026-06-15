import Image from 'next/image'
import Link from 'next/link'
import { requireAdminSession } from '@/lib/admin/auth'
import { getAdminConfigStatus } from '@/lib/admin/auth'
import { getAdminVehicles } from '@/lib/admin/vehicles'
import { getVehicleStatusLabel, VehicleStatusBadge } from '@/components/vehicles/VehicleStatusBadge'
import { AdminShell } from '@/components/admin/AdminShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatKilometers } from '@/lib/utils'
import { deleteVehicleAction } from './actions'
import { DeleteVehicleSubmitButton } from '@/components/admin/DeleteVehicleSubmitButton'

export const dynamic = 'force-dynamic'

export default async function AdminVehiclesPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; saved?: string; deleted?: string; error?: string }
}) {
  await requireAdminSession()

  const config = getAdminConfigStatus()
  const vehicles = await getAdminVehicles()
  const query = (searchParams.q || '').toLowerCase().trim()
  const statusFilter = searchParams.status || ''
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesQuery =
      !query ||
      [vehicle.name, vehicle.brand, vehicle.model, vehicle.version, vehicle.slug]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    const matchesStatus = !statusFilter || vehicle.status === statusFilter
    return matchesQuery && matchesStatus
  })

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-gray-600">Alta, edición y estado del inventario publicado.</p>
        </div>
        <Button asChild>
          <Link href="/admin/vehiculos/nuevo">Nuevo vehículo</Link>
        </Button>
      </div>

      {!config.writeTokenConfigured && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Falta <code>SANITY_API_WRITE_TOKEN</code>. Puedes listar vehículos, pero no guardar cambios.
        </div>
      )}

      {searchParams.saved && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Vehículo guardado correctamente.
        </div>
      )}

      {searchParams.deleted && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Vehículo eliminado correctamente.
        </div>
      )}

      {searchParams.error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {searchParams.error}
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="p-4">
          <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]" action="/admin/vehiculos">
            <input
              name="q"
              defaultValue={searchParams.q || ''}
              placeholder="Buscar por marca, modelo, versión o slug"
              className="h-11 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              name="status"
              defaultValue={statusFilter}
              className="h-11 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="reserved">Reservado</option>
              <option value="sold">Vendido</option>
            </select>
            <Button type="submit" variant="secondary">
              Filtrar
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3 text-sm text-gray-600">
          Mostrando {filteredVehicles.length} de {vehicles.length} vehículos
        </div>
        <div className="divide-y divide-gray-200">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="grid gap-4 p-4 md:grid-cols-[96px_1fr_auto] md:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
                {vehicle.images[0]?.url ? (
                  <Image src={vehicle.images[0].url} alt={vehicle.name} fill className="object-contain" />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-gray-400">
                    Sin imagen
                  </span>
                )}
              </div>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-gray-900">{vehicle.name}</h2>
                  <VehicleStatusBadge status={vehicle.status} showAvailable />
                </div>
                <p className="text-sm text-gray-600">
                  {vehicle.brand} {vehicle.model} {vehicle.version ? `· ${vehicle.version}` : ''} · {vehicle.year}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {formatCurrency(vehicle.price)}
                  {vehicle.mileage ? ` · ${formatKilometers(vehicle.mileage)}` : ''}
                  {` · ${getVehicleStatusLabel(vehicle.status)}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {vehicle.slug && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/vehiculos/${vehicle.slug}`} target="_blank">
                      Ver
                    </Link>
                  </Button>
                )}
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/admin/vehiculos/${encodeURIComponent(vehicle.id)}/editar`}>
                    Editar
                  </Link>
                </Button>
                <form action={deleteVehicleAction}>
                  <input type="hidden" name="id" value={vehicle.id} />
                  <input type="hidden" name="slug" value={vehicle.slug} />
                  <DeleteVehicleSubmitButton />
                </form>
              </div>
            </div>
          ))}
          {filteredVehicles.length === 0 && (
            <div className="p-8 text-center text-gray-500">No hay vehículos con esos criterios.</div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
