'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassPlusIcon,
} from '@heroicons/react/24/outline'

interface DesignImage {
    src: string
    alt: string
}

interface ConsignmentDesignGalleryProps {
    images: DesignImage[]
}

export function ConsignmentDesignGallery({ images }: ConsignmentDesignGalleryProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const openAt = (index: number) => {
        setCurrentIndex(index)
        setIsOpen(true)
    }

    const showPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }, [images.length])

    const showNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }, [images.length])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                showPrev()
            }

            if (event.key === 'ArrowRight') {
                showNext()
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [isOpen, showNext, showPrev])

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                {images.map((image, index) => (
                    <button
                        key={image.src}
                        type="button"
                        onClick={() => openAt(index)}
                        className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 text-left"
                        aria-label={`Abrir ${image.alt} en vista ampliada`}
                    >
                        <div className="relative aspect-[16/9] w-full">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/55 px-4 py-3 text-white opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                            <span className="text-sm font-medium">Ver en grande</span>
                            <MagnifyingGlassPlusIcon className="h-5 w-5" />
                        </div>
                    </button>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="h-[90vh] max-w-[95vw] border-none bg-black/95 p-0">
                    <div className="relative flex h-full w-full items-center justify-center px-14">
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={showPrev}
                                    className="absolute left-4 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
                                    aria-label="Imagen anterior"
                                >
                                    <ChevronLeftIcon className="h-7 w-7" />
                                </button>
                                <button
                                    type="button"
                                    onClick={showNext}
                                    className="absolute right-4 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
                                    aria-label="Siguiente imagen"
                                >
                                    <ChevronRightIcon className="h-7 w-7" />
                                </button>
                            </>
                        )}

                        <div className="relative h-full w-full">
                            <Image
                                src={images[currentIndex].src}
                                alt={images[currentIndex].alt}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-sm font-medium text-white">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
