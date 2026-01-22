'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Vehicle } from '@/lib/types'
import { useState, useEffect } from 'react'
import { formatCurrency, formatKilometers, getWhatsAppUrl } from '@/lib/utils'
import siteConfig from '@/config'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    CalendarIcon,
    CogIcon,
    TruckIcon,
    HeartIcon,
    ArrowsRightLeftIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid' // Added
import { useFavorites } from '@/store/useFavorites' // Added
import { useCompare } from '@/store/useCompare' // Added
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'

interface VehicleCardProps {
    vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
    const whatsappUrl = getWhatsAppUrl(
        siteConfig.contact.whatsapp,
        `Hola, me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.year}`
    )

    // Favorites Store
    const { isFavorite, toggleFavorite } = useFavorites()
    const [isFav, setIsFav] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Compare Store
    const { isInCompare, toggleCompare } = useCompare()
    const isComparing = isInCompare(vehicle.id)

    // Handle hydration mismatch for local storage
    useEffect(() => {
        setMounted(true)
        setIsFav(isFavorite(vehicle.id))
    }, [isFavorite, vehicle.id])

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(vehicle)
        setIsFav(!isFav)
    }

    const handleCompareClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleCompare(vehicle)
    }

    return (
        <Card className="group overflow-hidden border-2 transition-all duration-300 hover:border-primary-500 hover:shadow-xl">
            {/* Image Section */}
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Badge */}
                {vehicle.isNew && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary-500 px-3 py-1 text-sm font-semibold text-white">
                        RECIÉN LLEGADO
                    </span>
                )}

                {/* Quick Actions (show on hover) */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleFavoriteClick}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:text-red-500 transition-colors"
                        aria-label="Agregar a favoritos"
                    >
                        {mounted && isFav ? (
                            <HeartIconSolid className="w-6 h-6 text-red-500" />
                        ) : (
                            <HeartIcon className="w-6 h-6" />
                        )}
                    </button>
                    <button
                        onClick={handleCompareClick}
                        className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors ${isComparing ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-white/90 hover:text-primary-600'
                            }`}
                        aria-label="Comparar vehículo"
                    >
                        <ArrowsRightLeftIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <CardContent className="p-6">
                {/* Brand */}
                <p className="mb-1 text-xs font-medium uppercase text-gray-600">
                    {vehicle.brand}
                </p>

                {/* Title */}
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    {vehicle.model}
                </h3>

                {/* Specs */}
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {vehicle.year}
                    </span>
                    <span className="flex items-center gap-1">
                        <TruckIcon className="h-4 w-4" />
                        {formatKilometers(vehicle.km)}
                    </span>
                    <div className="flex items-center gap-1">
                        <CogIcon className="h-4 w-4" />
                        <span>{vehicle.transmission}</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    {/* Price */}
                    <p className="mb-1 text-2xl font-bold text-primary-600">
                        {formatCurrency(vehicle.price)}
                    </p>

                    {/* Monthly Payment */}
                    <p className="mb-4 text-sm text-gray-600">
                        o desde {formatCurrency(vehicle.monthlyPayment)}/mes
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button variant="primary" className="flex-1" asChild>
                            <Link href={`/vehiculos/${vehicle.slug}`}>Conocer este Vehículo</Link>
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            asChild
                            className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                        >
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp">
                                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                            </a>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card >
    )
}
