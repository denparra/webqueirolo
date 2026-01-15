'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Vehicle } from '@/lib/types'
import { VehicleGalleryLightbox } from './VehicleGalleryLightbox'
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline'

interface VehicleDetailGalleryProps {
    vehicle: Vehicle
}

export function VehicleDetailGallery({ vehicle }: VehicleDetailGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index)
        setLightboxOpen(true)
    }

    return (
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
            {/* Main Image */}
            <div
                className="relative aspect-video cursor-pointer hover:opacity-95 transition-opacity group"
                onClick={() => openLightbox(0)}
            >
                <Image
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Overlay Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <MagnifyingGlassPlusIcon className="w-12 h-12 text-white drop-shadow-lg" />
                </div>

                {vehicle.isNew && (
                    <span className="absolute left-4 top-4 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white z-10">
                        RECIÉN LLEGADO
                    </span>
                )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2 p-4">
                {vehicle.images.slice(0, 4).map((img, idx) => (
                    <div
                        key={idx}
                        className="relative aspect-video overflow-hidden rounded cursor-pointer hover:ring-2 ring-primary-500 transition-all"
                        onClick={() => openLightbox(idx)}
                    >
                        <Image
                            src={img}
                            alt={`Vista ${idx + 1}`}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                ))}

                {vehicle.images.length > 4 && (
                    <div
                        className="relative aspect-video overflow-hidden rounded cursor-pointer bg-black/80 flex items-center justify-center group"
                        onClick={() => openLightbox(4)}
                    >
                        <span className="text-white font-bold group-hover:scale-110 transition-transform">
                            +{vehicle.images.length - 4} más
                        </span>
                    </div>
                )}
            </div>

            <VehicleGalleryLightbox
                images={vehicle.images}
                isOpen={lightboxOpen}
                initialIndex={currentImageIndex}
                onClose={() => setLightboxOpen(false)}
            />
        </div>
    )
}
