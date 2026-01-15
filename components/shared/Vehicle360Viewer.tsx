'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface Vehicle360ViewerProps {
    imageFolder?: string
    totalFrames?: number
}

export function Vehicle360Viewer({ imageFolder, totalFrames = 36 }: Vehicle360ViewerProps) {
    const [isLoaded, setIsLoaded] = useState(false)

    // This is a placeholder since we don't have actual 360 assets yet
    // In a real implementation, this would load images from imageFolder/1.jpg...36.jpg
    // and allow dragging to rotate

    return (
        <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden flex flex-col items-center justify-center border border-gray-200">
            <div className="text-center p-6">
                <ArrowPathIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Vista 360°</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto mb-4">
                    La vista de 360 grados no está disponible para este vehículo en este momento.
                </p>
                <Button variant="outline" disabled>
                    Cargar Vista 360°
                </Button>
            </div>

            {/* Badge */}
            <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded text-xs font-semibold shadow-sm">
                BETA
            </div>
        </div>
    )
}
