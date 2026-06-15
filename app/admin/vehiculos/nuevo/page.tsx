import { requireAdminSession } from '@/lib/admin/auth'
import { AdminShell } from '@/components/admin/AdminShell'
import { VehicleForm } from '@/components/admin/VehicleForm'

export const dynamic = 'force-dynamic'

export default async function NewVehiclePage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  await requireAdminSession()

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo vehículo</h1>
        <p className="text-gray-600">Carga guiada del inventario que se publicará en la web.</p>
      </div>
      <VehicleForm error={searchParams.error} />
    </AdminShell>
  )
}
