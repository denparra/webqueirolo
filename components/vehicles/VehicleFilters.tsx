'use client'

import { useState, useMemo } from 'react'
import { VehicleFilters as Filters, Vehicle } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface VehicleFiltersProps {
    filters: Filters
    onFiltersChange: (filters: Filters) => void
    resultCount: number
    allVehicles: Vehicle[]
}

export function VehicleFilters({ filters, onFiltersChange, resultCount, allVehicles = [] }: VehicleFiltersProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Compute filter options dynamically from actual vehicles
    const brandOptions = useMemo(() => {
        if (!allVehicles || !allVehicles.length) return []
        const brands = Array.from(new Set(allVehicles.map((v) => v.brand)))
        return brands.map((brand) => ({
            id: brand.toLowerCase(),
            name: brand,
            count: allVehicles.filter((v) => v.brand.toLowerCase() === brand.toLowerCase()).length,
        }))
    }, [allVehicles])

    const transmissionOptions = useMemo(() => {
        if (!allVehicles || !allVehicles.length) return []
        const options = [
            { id: 'automatico', name: 'Automático', aliases: ['automático', 'automatica', 'automática', 'auto'] },
            { id: 'manual', name: 'Manual', aliases: ['manual'] },
        ]
        return options
            .map((opt) => ({
                ...opt,
                count: allVehicles.filter((v) =>
                    opt.aliases.some(alias => v.transmission.toLowerCase().includes(alias))
                ).length,
            }))
            .filter((opt) => opt.count > 0)
    }, [allVehicles])

    const fuelTypeOptions = useMemo(() => {
        if (!allVehicles || !allVehicles.length) return []
        const options = [
            { id: 'gasolina', name: 'Gasolina', aliases: ['gasolina', 'bencina', 'nafta'] },
            { id: 'diesel', name: 'Diésel', aliases: ['diesel', 'diésel', 'petroleo'] },
            { id: 'hibrido', name: 'Híbrido', aliases: ['hibrido', 'híbrido', 'hybrid'] },
            { id: 'electrico', name: 'Eléctrico', aliases: ['electrico', 'eléctrico', 'electric'] },
        ]
        return options
            .map((opt) => ({
                ...opt,
                count: allVehicles.filter((v) =>
                    opt.aliases.some(alias => v.fuelType.toLowerCase().includes(alias))
                ).length,
            }))
            .filter((opt) => opt.count > 0)
    }, [allVehicles])

    const toggleBrand = (brandId: string) => {
        const newBrands = filters.brands.includes(brandId)
            ? filters.brands.filter((b) => b !== brandId)
            : [...filters.brands, brandId]
        onFiltersChange({ ...filters, brands: newBrands })
    }

    const toggleTransmission = (transId: string) => {
        const newTrans = filters.transmissions.includes(transId)
            ? filters.transmissions.filter((t) => t !== transId)
            : [...filters.transmissions, transId]
        onFiltersChange({ ...filters, transmissions: newTrans })
    }

    const toggleFuelType = (fuelId: string) => {
        const newFuel = filters.fuelTypes.includes(fuelId)
            ? filters.fuelTypes.filter((f) => f !== fuelId)
            : [...filters.fuelTypes, fuelId]
        onFiltersChange({ ...filters, fuelTypes: newFuel })
    }

    const clearAllFilters = () => {
        onFiltersChange({
            brands: [],
            priceMin: 5000000,
            priceMax: 50000000,
            yearMin: 2010,
            yearMax: 2024,
            kmMax: 200000,
            transmissions: [],
            fuelTypes: [],
        })
    }

    const hasActiveFilters =
        filters.brands.length > 0 ||
        filters.transmissions.length > 0 ||
        filters.fuelTypes.length > 0 ||
        filters.priceMin !== 5000000 ||
        filters.priceMax !== 50000000 ||
        filters.yearMin !== 2010 ||
        filters.yearMax !== 2024 ||
        filters.kmMax !== 200000

    const filterContent = (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Filtrar Resultados</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        Limpiar Todo
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Brand Filter */}
                <div>
                    <label className="mb-3 block font-medium text-gray-900">Marca</label>
                    <div className="space-y-2">
                        {brandOptions.map((brand) => (
                            <label key={brand.id} className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.brands.includes(brand.id)}
                                    onChange={() => toggleBrand(brand.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">{brand.name}</span>
                                <span className="text-xs text-gray-500">({brand.count})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <label className="mb-3 block font-medium text-gray-900">Precio (CLP)</label>
                    <Slider
                        value={[filters.priceMin, filters.priceMax]}
                        onValueChange={([min, max]) =>
                            onFiltersChange({ ...filters, priceMin: min, priceMax: max })
                        }
                        min={5000000}
                        max={50000000}
                        step={500000}
                        className="mb-3"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{formatCurrency(filters.priceMin)}</span>
                        <span>{formatCurrency(filters.priceMax)}</span>
                    </div>
                </div>

                {/* Year Range */}
                <div>
                    <label className="mb-3 block font-medium text-gray-900">Año</label>
                    <Slider
                        value={[filters.yearMin, filters.yearMax]}
                        onValueChange={([min, max]) =>
                            onFiltersChange({ ...filters, yearMin: min, yearMax: max })
                        }
                        min={2010}
                        max={2024}
                        step={1}
                        className="mb-3"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{filters.yearMin}</span>
                        <span>{filters.yearMax}</span>
                    </div>
                </div>

                {/* Kilometers */}
                <div>
                    <label className="mb-3 block font-medium text-gray-900">Kilometraje Máximo</label>
                    <Slider
                        value={[filters.kmMax]}
                        onValueChange={([max]) => onFiltersChange({ ...filters, kmMax: max })}
                        min={0}
                        max={200000}
                        step={10000}
                        className="mb-3"
                    />
                    <div className="text-sm text-gray-600">
                        Hasta {filters.kmMax.toLocaleString('es-CL')} km
                    </div>
                </div>

                {/* Transmission */}
                <div>
                    <label className="mb-3 block font-medium text-gray-900">Transmisión</label>
                    <div className="space-y-2">
                        {transmissionOptions.map((trans) => (
                            <label key={trans.id} className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.transmissions.includes(trans.id)}
                                    onChange={() => toggleTransmission(trans.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">{trans.name}</span>
                                <span className="text-xs text-gray-500">({trans.count})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Fuel Type */}
                <div>
                    <label className="mb-3 block font-medium text-gray-900">Combustible</label>
                    <div className="space-y-2">
                        {fuelTypeOptions.map((fuel) => (
                            <label key={fuel.id} className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.fuelTypes.includes(fuel.id)}
                                    onChange={() => toggleFuelType(fuel.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">{fuel.name}</span>
                                <span className="text-xs text-gray-500">({fuel.count})</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Apply Button (Mobile) */}
            <div className="mt-6 md:hidden">
                <Button variant="default" className="w-full" onClick={() => setIsOpen(false)}>
                    Ver {resultCount} Vehículos
                </Button>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="mb-4 md:hidden">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FunnelIcon className="mr-2 h-5 w-5" />
                    Filtros {hasActiveFilters && `(${resultCount})`}
                </Button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden w-full rounded-lg bg-white p-6 shadow md:block md:w-80">
                {filterContent}
            </aside>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
                    <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Filtros</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-2 hover:bg-gray-100"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        {filterContent}
                    </div>
                </div>
            )}
        </>
    )
}
