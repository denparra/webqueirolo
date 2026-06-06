import { getVehicles } from '@/lib/vehicles'
import { Vehicle } from '@/lib/types'
import { VehicleListingClient } from '@/components/vehicles/VehicleListingClient'
import { SchemaScript } from '@/components/shared/SchemaScript'
import { generateVehicleListSchema } from '@/lib/seo'

// ISR: el listado se revalida con la misma cadencia que el fetch de Sanity.
export const revalidate = 60

export default async function VehiculosPage() {
    let vehicles: Vehicle[] = []
    let loadError = false

    try {
        vehicles = await getVehicles()
    } catch (error) {
        console.error('[VehiculosPage] Error cargando vehículos:', error)
        loadError = true
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* JSON-LD: lista de vehículos (datos estructurados para Google) */}
            {!loadError && vehicles.length > 0 && (
                <SchemaScript schema={generateVehicleListSchema(vehicles)} />
            )}

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 lg:text-4xl">
                        Nuestros Vehículos
                    </h1>
                    <p className="text-lg text-gray-600">
                        Explora nuestro stock actual, seleccionado con estándares de calidad.
                    </p>
                </div>

                <VehicleListingClient initialVehicles={vehicles} loadError={loadError} />
            </div>
        </div>
    )
}
