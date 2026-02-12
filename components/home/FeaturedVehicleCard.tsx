'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import type { FeaturedVehicle } from '@/lib/featured-vehicles'

interface FeaturedVehicleCardProps {
  vehicle: FeaturedVehicle
  priority?: boolean
}

function formatPrice(price: number): string {
  return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
}

function formatKm(km: number): string {
  return km.toLocaleString('es-CL') + ' km'
}

export function FeaturedVehicleCard({ vehicle, priority = false }: FeaturedVehicleCardProps) {
  const badge = vehicle.isNew
    ? 'RECIEN LLEGADO'
    : vehicle.category || null

  return (
    <Link
      href={`/vehiculos/${vehicle.slug}`}
      className="group block overflow-hidden rounded-xl border-2 border-gray-100 bg-white transition-all duration-300 hover:border-primary-500 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder={vehicle.lqip ? 'blur' : undefined}
            blurDataURL={vehicle.lqip}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-sm text-gray-400">Sin imagen</span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
            vehicle.isNew
              ? 'bg-primary-500 text-white'
              : 'bg-white/90 text-gray-700 backdrop-blur-sm'
          }`}>
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900">
          {vehicle.brand} {vehicle.model}
        </h3>
        {vehicle.version && (
          <p className="mb-3 text-sm text-gray-500">{vehicle.version} - {vehicle.year}</p>
        )}
        {!vehicle.version && (
          <p className="mb-3 text-sm text-gray-500">{vehicle.year}</p>
        )}

        {/* Specs row */}
        <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            {vehicle.year}
          </span>
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-3.5 w-3.5" />
            {formatKm(vehicle.km)}
          </span>
          <span className="capitalize">{vehicle.transmission}</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-primary-600">{formatPrice(vehicle.price)}</p>
            <p className="text-xs text-gray-400">Desde {formatPrice(vehicle.monthlyPayment)}/mes</p>
          </div>
          <span className="text-sm font-medium text-primary-500 transition-colors group-hover:text-primary-600">
            Ver detalle &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
