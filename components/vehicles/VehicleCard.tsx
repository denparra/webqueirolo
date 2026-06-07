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
    CogIcon,
    TruckIcon,
    HeartIcon,
    ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid' // Added
import { useFavorites } from '@/store/useFavorites' // Added
import { useCompare } from '@/store/useCompare' // Added
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'

interface VehicleCardProps {
    vehicle: Vehicle
    priority?: boolean
}

export function VehicleCard({ vehicle, priority = false }: VehicleCardProps) {
    const whatsappUrl = getWhatsAppUrl(
        siteConfig.contact.whatsapp,
        `Hola, me interesa el ${vehicle.brand} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ''} ${vehicle.year}`
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
        <Card className="group overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:border-primary-400 hover:shadow-lg">
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                <Image
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ''} ${vehicle.year}`}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={priority}
                    placeholder={vehicle.lqip ? 'blur' : undefined}
                    blurDataURL={vehicle.lqip}
                />

                {/* Badge */}
                {vehicle.isNew && (
                    <span className="absolute left-3 top-3 rounded-md bg-primary-500 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
                        RECIÉN LLEGADO
                    </span>
                )}

                {/* Quick Actions (show on hover) */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={handleFavoriteClick}
                        className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white hover:text-red-500 transition-colors"
                        aria-label="Agregar a favoritos"
                    >
                        {mounted && isFav ? (
                            <HeartIconSolid className="w-5 h-5 text-red-500" />
                        ) : (
                            <HeartIcon className="w-5 h-5" />
                        )}
                    </button>
                    <button
                        onClick={handleCompareClick}
                        className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors ${isComparing ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-white/95 hover:text-primary-600'}`}
                        aria-label="Comparar vehículo"
                    >
                        <ArrowsRightLeftIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <CardContent className="p-4">
                {/* Brand + Model */}
                <h3 className="mb-0.5 text-base font-bold text-gray-900 leading-snug">
                    {vehicle.brand} {vehicle.model}
                </h3>

                {/* Version + Year */}
                <p className="mb-3 text-sm text-gray-500">
                    {vehicle.version ? `${vehicle.version} · ` : ''}{vehicle.year}
                </p>

                {/* Specs — km + transmisión (año ya está arriba) */}
                <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <TruckIcon className="h-3.5 w-3.5 shrink-0" />
                        {formatKilometers(vehicle.km)}
                    </span>
                    {vehicle.transmission && (
                        <>
                            <span className="text-gray-300">·</span>
                            <span className="flex items-center gap-1">
                                <CogIcon className="h-3.5 w-3.5 shrink-0" />
                                {vehicle.transmission}
                            </span>
                        </>
                    )}
                </div>

                <div className="border-t border-gray-100 pt-3">
                    {/* Price */}
                    <p className="text-xl font-bold text-primary-600 leading-none">
                        {formatCurrency(vehicle.price)}
                    </p>
                    <p className="mt-0.5 mb-3 text-xs text-gray-400">
                        Desde aprox. {formatCurrency(vehicle.monthlyPayment)}/mes
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button variant="primary" className="flex-1 text-sm" asChild>
                            <Link href={`/vehiculos/${vehicle.slug}`}>Ver Vehículo</Link>
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            asChild
                            className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white shrink-0"
                        >
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp">
                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
