import { notFound } from 'next/navigation'
import { requireAdminSession } from '@/lib/admin/auth'
import { getAdminVehicleById } from '@/lib/admin/vehicles'
import { AdminShell } from '@/components/admin/AdminShell'
import { VehicleForm } from '@/components/admin/VehicleForm'

export const dynamic = 'force-dynamic'

export default async function EditVehiclePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { error?: string }
}) {
  await requireAdminSession()

  const vehicle = await getAdminVehicleById(decodeURIComponent(params.id))
  if (!vehicle) {
    notFound()
  }

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar vehículo</h1>
        <p className="text-gray-600">{vehicle.name}</p>
      </div>
      <VehicleForm vehicle={vehicle} error={searchParams.error} />
    </AdminShell>
  )
}
