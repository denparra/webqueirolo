'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import siteConfig from '@/config'

const LeafletMap = dynamic(() => import('@/components/maps/LeafletMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-gray-200" />,
})

export default function LazyContactMap() {
    const [isActive, setIsActive] = useState(false)
    const { lat, lng } = siteConfig.contact.address.coordinates

    if (isActive) {
        return (
            <LeafletMap
                center={[lat, lng]}
                zoom={16}
                markerText={siteConfig.contact.address.displayAddress}
                className="h-full w-full"
            />
        )
    }

    return (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <div className="text-center">
                <p className="text-sm text-gray-600">El mapa se carga bajo demanda.</p>
                <button
                    type="button"
                    onClick={() => setIsActive(true)}
                    className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                >
                    Cargar mapa
                </button>
            </div>
        </div>
    )
}
