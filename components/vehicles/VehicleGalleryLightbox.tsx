'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassPlusIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface VehicleGalleryLightboxProps {
    images: string[]
    isOpen: boolean
    initialIndex: number
    onClose: () => void
}

export function VehicleGalleryLightbox({
    images,
    isOpen,
    initialIndex,
    onClose
}: VehicleGalleryLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [isZoomed, setIsZoomed] = useState(false)

    // Update index when initialIndex changes
    if (initialIndex !== currentIndex && !isOpen) {
        setCurrentIndex(initialIndex)
    }

    const showNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
        setIsZoomed(false)
    }

    const showPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        setIsZoomed(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] h-[90vh] p-0 border-none bg-black/95">
                <div className="relative w-full h-full flex items-center justify-center">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 text-white/70 hover:text-white"
                    >
                        <XMarkIcon className="w-8 h-8" />
                    </button>

                    {/* Navigation */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={showPrev}
                                className="absolute left-4 z-50 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeftIcon className="w-8 h-8" />
                            </button>
                            <button
                                onClick={showNext}
                                className="absolute right-4 z-50 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                                aria-label="Siguiente imagen"
                            >
                                <ChevronRightIcon className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Main Image */}
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className={`relative w-full h-full ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                                onClick={() => setIsZoomed(!isZoomed)}
                            >
                                <Image
                                    src={images[currentIndex]}
                                    alt={`Imagen ${currentIndex + 1}`}
                                    fill
                                    className={`object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls / Info */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-6 text-white/80">
                        <span className="text-sm font-medium">
                            {currentIndex + 1} / {images.length}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/10"
                            onClick={() => setIsZoomed(!isZoomed)}
                        >
                            <MagnifyingGlassPlusIcon className="w-5 h-5 mr-2" />
                            {isZoomed ? 'Alejar' : 'Acercar'}
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}
