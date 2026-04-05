'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPinIcon } from '@heroicons/react/24/outline'
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
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-primary-400 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
            fill
            priority={priority}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder={vehicle.lqip ? 'blur' : undefined}
            blurDataURL={vehicle.lqip}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-sm text-gray-400">Sin imagen</span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide shadow ${
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
        {/* Title + version/year */}
        <h3 className="text-base font-bold text-gray-900 leading-snug">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="mb-3 text-sm text-gray-500">
          {vehicle.version ? `${vehicle.version} · ` : ''}{vehicle.year}
        </p>

        {/* Specs row — km + transmisión (año ya está arriba) */}
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
            {formatKm(vehicle.km)}
          </span>
          {vehicle.transmission && (
            <>
              <span className="text-gray-300">·</span>
              <span className="capitalize">{vehicle.transmission}</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-xl font-bold text-primary-600 leading-none">{formatPrice(vehicle.price)}</p>
            <p className="mt-0.5 text-xs text-gray-400">Desde {formatPrice(vehicle.monthlyPayment)}/mes</p>
          </div>
          <span className="text-sm font-medium text-primary-500 transition-colors group-hover:text-primary-600 shrink-0 ml-2">
            Ver &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
