'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { VehicleFilters as Filters, Vehicle } from '@/lib/types'
import { DEFAULT_VEHICLE_FILTERS } from '@/lib/constants/vehicleFilters'
import { getVehicles } from '@/lib/vehicles'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import { VehicleFilters } from '@/components/vehicles/VehicleFilters'

let vehiclesPromise: Promise<Vehicle[]> | null = null

function VehicleListingContent() {
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

    // Data State
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Initial Fetch
    useEffect(() => {
        async function fetchData() {
            try {
                setError(null)
                if (!vehiclesPromise) {
                    vehiclesPromise = getVehicles()
                }
                const data = await vehiclesPromise
                setAllVehicles(data)
            } catch (error) {
                console.error("Failed to fetch vehicles", error)
                setAllVehicles([])
                setError('No pudimos cargar el inventario. Refresca la página o vuelve en unos minutos.')
                vehiclesPromise = null
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    // Filter vehicles based on current filters logic (adapted to use state)
    const filteredVehicles = (allVehicles.length > 0 ? allVehicles : []).filter((vehicle) => {
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

    if (error && !isLoading) {
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
                            {error}
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
                        {filteredVehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
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

export default function VehiculosPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
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

                {/* Main Content wrapped in Suspense */}
                <Suspense fallback={<div className="text-center py-12">Cargando vehículos...</div>}>
                    <VehicleListingContent />
                </Suspense>
            </div>
        </div>
    )
}
