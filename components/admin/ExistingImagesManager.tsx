'use client'

import * as React from 'react'
import Image from 'next/image'
import type { AdminVehicleImage } from '@/lib/admin/vehicles'

function moveItem<T>(items: T[], from: number, to: number): T[] {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function ExistingImagesManager({ images }: { images: AdminVehicleImage[] }) {
  const [orderedImages, setOrderedImages] = React.useState(images)

  if (orderedImages.length === 0) return null

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">Galería actual</p>
      <p className="mb-3 text-xs text-gray-500">
        La primera imagen será la portada del catálogo y la ficha. Puedes mover cualquier imagen al inicio.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {orderedImages.map((image, index) => (
          <div key={image.assetId} className="rounded-lg border bg-white p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-gray-50">
              <Image src={image.url} alt={`Imagen ${index + 1} del vehículo`} fill className="object-contain" />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-primary-600 px-2 py-1 text-xs font-semibold text-white shadow">
                  Portada
                </span>
              )}
            </div>
            <input type="hidden" name="existingAssetIds" value={image.assetId} />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={index === 0}
                onClick={() => setOrderedImages((current) => moveItem(current, index, index - 1))}
              >
                Subir
              </button>
              <button
                type="button"
                className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={index === orderedImages.length - 1}
                onClick={() => setOrderedImages((current) => moveItem(current, index, index + 1))}
              >
                Bajar
              </button>
              <button
                type="button"
                className="col-span-2 rounded-md border border-primary-200 px-2 py-1 text-xs font-semibold text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={index === 0}
                onClick={() => setOrderedImages((current) => moveItem(current, index, 0))}
              >
                Usar como portada
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
