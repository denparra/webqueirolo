'use client'

import { useCompare } from '@/store/useCompare'
import { Button } from '@/components/ui/button'
import { XMarkIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState } from 'react'
import { CompareModal } from './CompareModal'
import { AnimatePresence, motion } from 'framer-motion'

export function CompareBar() {
    const { comparisonList, removeFromCompare, clearCompare } = useCompare()
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (comparisonList.length === 0) return null

    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 shadow-lg"
                >
                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-900">
                                Comparando ({comparisonList.length}/3):
                            </span>
                            <div className="flex gap-2">
                                {comparisonList.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        className="relative h-12 w-16 overflow-hidden rounded border border-gray-200"
                                    >
                                        <Image
                                            src={vehicle.image}
                                            alt={vehicle.model}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            onClick={() => removeFromCompare(vehicle.id)}
                                            className="absolute right-0 top-0 bg-black/50 p-0.5 text-white hover:bg-red-500"
                                        >
                                            <XMarkIcon className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={clearCompare}
                                className="text-gray-500 hover:text-red-600"
                            >
                                Limpiar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => setIsModalOpen(true)}
                                disabled={comparisonList.length < 2}
                                className="gap-2"
                            >
                                <ArrowsRightLeftIcon className="h-5 w-5" />
                                Comparar Ahora
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <CompareModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                vehicles={comparisonList}
            />
        </>
    )
}
