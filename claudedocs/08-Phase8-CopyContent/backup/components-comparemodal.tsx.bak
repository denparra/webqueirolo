'use client'

import { Vehicle } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatKilometers } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface CompareModalProps {
    isOpen: boolean
    onClose: () => void
    vehicles: Vehicle[]
}

export function CompareModal({ isOpen, onClose, vehicles }: CompareModalProps) {
    if (!isOpen || vehicles.length === 0) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl overflow-x-auto">
                <DialogHeader>
                    <DialogTitle>Comparación de Vehículos</DialogTitle>
                </DialogHeader>

                <div className="mt-6 min-w-[800px]">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr>
                                <th className="w-1/4 p-4"></th>
                                {vehicles.map((v) => (
                                    <th key={v.id} className="w-1/4 p-4 align-top">
                                        <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                                            <Image
                                                src={v.image}
                                                alt={v.model}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">{v.brand}</h3>
                                        <p className="text-gray-600 font-medium">{v.model}</p>
                                        <p className="mt-2 text-xl font-bold text-primary-600">
                                            {formatCurrency(v.price)}
                                        </p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* Basic Specs */}
                            <tr>
                                <td className="p-4 font-semibold bg-gray-50">Año</td>
                                {vehicles.map((v) => (
                                    <td key={v.id} className="p-4">{v.year}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-gray-50">Kilometraje</td>
                                {vehicles.map((v) => (
                                    <td key={v.id} className="p-4">{formatKilometers(v.km)}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-gray-50">Transmisión</td>
                                {vehicles.map((v) => (
                                    <td key={v.id} className="p-4">{v.transmission}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-gray-50">Combustible</td>
                                {vehicles.map((v) => (
                                    <td key={v.id} className="p-4">{v.fuelType}</td>
                                ))}
                            </tr>

                            {/* Technical Specs */}
                            <tr>
                                <td className="p-4 font-semibold bg-gray-50">Motor</td>
                                {vehicles.map((v) => (
                                    <td key={v.id} className="p-4">{v.specs.engine}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-gray-50">Potencia</td>
                                {vehicles.map((v) => (
                                    <td key={v.id} className="p-4">{v.specs.power}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-gray-50">Tracción</td>
                                {vehicles.map((v) => (
                                    <td key={v.id} className="p-4">{v.specs.drivetrain}</td>
                                ))}
                            </tr>

                            {/* Actions */}
                            <tr>
                                <td className="p-4 bg-gray-50"></td>
                                {vehicles.map((v) => (
                                    <td key={v.id} className="p-4">
                                        <Button variant="primary" className="w-full" asChild>
                                            <Link href={`/vehiculos/${v.slug}`}>Ver Detalles</Link>
                                        </Button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    )
}
