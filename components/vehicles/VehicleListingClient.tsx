'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { VehicleFilters as Filters, Vehicle } from '@/lib/types'
import { DEFAULT_VEHICLE_FILTERS } from '@/lib/constants/vehicleFilters'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import { VehicleFilters } from '@/components/vehicles/VehicleFilters'

interface VehicleListingClientProps {
    /** Vehículos resueltos en el servidor — ya vienen en el HTML inicial (SEO). */
    initialVehicles: Vehicle[]
    /** true si la carga en el servidor falló; muestra el mensaje de error. */
    loadError?: boolean
}

function VehicleListingContent({ initialVehicles, loadError }: VehicleListingClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize filters from URL params
    const [filters, setFilters] = useState<Filters>(() => ({
        brands: searchParams.getAll('brand'),
        priceMin: Number(searchParams.get('priceMin')) || DEFAULT_VEHICLE_FILTERS.priceMin,
        priceMax: Number(searchParams.get('priceMax')) || DEFAULT_VEHICLE_FILTERS.priceMax,
        yearMin: Number(searchParams.get('yearMin')) || DEFAULT_VEHICLE_FILTERS.yearMin,
        yearMax: Number(searchParams.get('yearMax')) || DEFAULT_VEHICLE_FILTERS.yearMax,
        kmMax: Number(searchParams.get('kmMax')) || DEFAULT_VEHICLE_FILTERS.kmMax,
        transmissions: searchParams.getAll('transmission'),
        fuelTypes: searchParams.getAll('fuel'),
    }))

    // Datos provistos por el servidor (sin fetch en cliente)
    const allVehicles = initialVehicles

    // Filter vehicles based on current filters
    const filteredVehicles = allVehicles.filter((vehicle) => {
        // Brand filter
        if (filters.brands.length > 0 && !filters.brands.includes(vehicle.brand.toLowerCase())) {
            return false
        }

        // Price filter
        if (vehicle.price < filters.priceMin || vehicle.price > filters.priceMax) {
            return false
        }

        // Year filter
        if (vehicle.year < filters.yearMin || vehicle.year > filters.yearMax) {
            return false
        }

        // Kilometers filter
        if (vehicle.km > filters.kmMax) {
            return false
        }

        // Transmission filter
        if (
            filters.transmissions.length > 0 &&
            !filters.transmissions.includes(vehicle.transmission.toLowerCase().replace('á', 'a'))
        ) {
            return false
        }

        // Fuel type filter
        if (
            filters.fuelTypes.length > 0 &&
            !filters.fuelTypes.includes(vehicle.fuelType.toLowerCase().replace('é', 'e'))
        ) {
            return false
        }

        return true
    })

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams()

        filters.brands.forEach((brand) => params.append('brand', brand))
        if (filters.priceMin !== DEFAULT_VEHICLE_FILTERS.priceMin)
            params.set('priceMin', String(filters.priceMin))
        if (filters.priceMax !== DEFAULT_VEHICLE_FILTERS.priceMax)
            params.set('priceMax', String(filters.priceMax))
        if (filters.yearMin !== DEFAULT_VEHICLE_FILTERS.yearMin)
            params.set('yearMin', String(filters.yearMin))
        if (filters.yearMax !== DEFAULT_VEHICLE_FILTERS.yearMax)
            params.set('yearMax', String(filters.yearMax))
        if (filters.kmMax !== DEFAULT_VEHICLE_FILTERS.kmMax)
            params.set('kmMax', String(filters.kmMax))
        filters.transmissions.forEach((trans) => params.append('transmission', trans))
        filters.fuelTypes.forEach((fuel) => params.append('fuel', fuel))

        const queryString = params.toString()
        router.push(`/vehiculos${queryString ? `?${queryString}` : ''}`, { scroll: false })
    }, [filters, router])

    if (loadError) {
        return (
            <div className="flex flex-col gap-6 md:flex-row">
                <VehicleFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    resultCount={0}
                    allVehicles={[]}
                />
                <div className="flex-1">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm font-medium text-red-600">
                            No pudimos cargar el inventario. Refresca la página o vuelve en unos minutos.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 md:flex-row">
            {/* Filters Sidebar */}
            <VehicleFilters
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredVehicles.length}
                allVehicles={allVehicles}
            />

            {/* Vehicle Grid */}
            <div className="flex-1">
                {/* Results Count */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Mostrando {filteredVehicles.length} de {allVehicles.length} vehículos
                    </p>
                </div>

                {/* Grid */}
                {filteredVehicles.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {filteredVehicles.map((vehicle, idx) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} priority={idx < 4} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg bg-white p-12 text-center shadow">
                        <p className="text-lg font-medium text-gray-900">
                            No encontramos vehículos con esos filtros.
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            Prueba con otros criterios o explora todo nuestro stock.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export function VehicleListingClient(props: VehicleListingClientProps) {
    return (
        <Suspense fallback={<div className="text-center py-12">Cargando vehículos...</div>}>
            <VehicleListingContent {...props} />
        </Suspense>
    )
}
