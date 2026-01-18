'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface LeafletMapProps {
    center: [number, number]
    zoom?: number
    markerText?: string
    className?: string
}

export default function LeafletMap({
    center,
    zoom = 15,
    markerText = 'Ubicación',
    className = 'w-full h-96 rounded-lg',
}: LeafletMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return

        // Initialize map
        const map = L.map(mapRef.current).setView(center, zoom)

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map)

        // Add marker
        const marker = L.marker(center).addTo(map)

        if (markerText) {
            marker.bindPopup(markerText).openPopup()
        }

        mapInstanceRef.current = map

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [center, zoom, markerText])

    return <div ref={mapRef} className={className} />
}
