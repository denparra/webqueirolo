'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { VehicleFilters as Filters, Vehicle } from '@/lib/types'
import { mockVehicles } from '@/lib/data'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import { VehicleFilters } from '@/components/vehicles/VehicleFilters'

function VehicleListingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize filters from URL params
    const [filters, setFilters] = useState<Filters>(() => ({
        brands: searchParams.getAll('brand'),
        priceMin: Number(searchParams.get('priceMin')) || 5000000,
        priceMax: Number(searchParams.get('priceMax')) || 50000000,
        yearMin: Number(searchParams.get('yearMin')) || 2010,
        yearMax: Number(searchParams.get('yearMax')) || 2024,
        kmMax: Number(searchParams.get('kmMax')) || 200000,
        transmissions: searchParams.getAll('transmission'),
        fuelTypes: searchParams.getAll('fuel'),
    }))

    // Filter vehicles based on current filters
    const filteredVehicles = mockVehicles.filter((vehicle) => {
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
        if (filters.priceMin !== 5000000) params.set('priceMin', String(filters.priceMin))
        if (filters.priceMax !== 50000000) params.set('priceMax', String(filters.priceMax))
        if (filters.yearMin !== 2010) params.set('yearMin', String(filters.yearMin))
        if (filters.yearMax !== 2024) params.set('yearMax', String(filters.yearMax))
        if (filters.kmMax !== 200000) params.set('kmMax', String(filters.kmMax))
        filters.transmissions.forEach((trans) => params.append('transmission', trans))
        filters.fuelTypes.forEach((fuel) => params.append('fuel', fuel))

        const queryString = params.toString()
        router.push(`/vehiculos${queryString ? `?${queryString}` : ''}`, { scroll: false })
    }, [filters, router])

    return (
        <div className="flex flex-col gap-6 md:flex-row">
            {/* Filters Sidebar */}
            <VehicleFilters
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredVehicles.length}
            />

            {/* Vehicle Grid */}
            <div className="flex-1">
                {/* Results Count */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Mostrando {filteredVehicles.length} de {mockVehicles.length} vehículos
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
                            No se encontraron vehículos con los filtros seleccionados
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            Intenta ajustar los filtros para ver más resultados
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
                        Vehículos Disponibles
                    </h1>
                    <p className="text-lg text-gray-600">
                        Encuentra tu próximo 4x4 entre nuestros {mockVehicles.length} vehículos certificados
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
