'use client'

import { useState } from 'react'
import { calculateLoan } from '@/lib/calculations'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

interface LoanCalculatorProps {
    initialPrice?: number
    onRequestCredit?: () => void
}

export function LoanCalculator({ initialPrice = 25000000, onRequestCredit }: LoanCalculatorProps) {
    const [price, setPrice] = useState(initialPrice)
    const [downPaymentPercent, setDownPaymentPercent] = useState(20)
    const [term, setTerm] = useState(48)

    const result = calculateLoan(price, downPaymentPercent, term, 12)

    return (
        <div className="rounded-xl bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Calcula Tu Cuota en Tiempo Real
            </h3>

            <div className="grid gap-8 md:grid-cols-2">
                {/* LEFT: Inputs */}
                <div className="space-y-6">
                    {/* Vehicle Price */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Precio del Vehículo
                        </label>
                        <Slider
                            value={[price]}
                            onValueChange={([value]) => setPrice(value)}
                            min={5000000}
                            max={50000000}
                            step={100000}
                            className="mb-2"
                        />
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="text-right"
                        />
                    </div>

                    {/* Down Payment */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Pie (Inicial)
                        </label>
                        <div className="mb-2 flex items-center gap-4">
                            <Slider
                                value={[downPaymentPercent]}
                                onValueChange={([value]) => setDownPaymentPercent(value)}
                                min={10}
                                max={50}
                                step={5}
                                className="flex-1"
                            />
                            <span className="w-16 text-right text-lg font-semibold text-primary-600">
                                {downPaymentPercent}%
                            </span>
                        </div>
                        <Input
                            type="number"
                            value={result.downPayment}
                            readOnly
                            className="bg-gray-50 text-right"
                        />
                    </div>

                    {/* Term */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Plazo
                        </label>
                        <Slider
                            value={[term]}
                            onValueChange={([value]) => setTerm(value)}
                            min={12}
                            max={60}
                            step={6}
                            className="mb-2"
                        />
                        <div className="text-right text-lg font-semibold text-gray-900">
                            {term} meses
                        </div>
                    </div>

                    {/* Interest Rate (Read-only) */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Tasa de Interés (Referencial)
                        </label>
                        <Input type="text" value="12% anual" readOnly className="bg-gray-50" />
                    </div>
                </div>

                {/* RIGHT: Results */}
                <div className="space-y-4 rounded-lg bg-primary-50 p-6">
                    {/* Financing Amount */}
                    <div>
                        <p className="mb-1 text-sm text-gray-600">Monto a Financiar</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(result.financingAmount)}
                        </p>
                    </div>

                    {/* Monthly Payment (Primary Result) */}
                    <div className="rounded-lg border-2 border-primary-500 bg-white p-6">
                        <p className="mb-1 text-sm text-gray-600">Cuota Mensual</p>
                        <p className="text-5xl font-bold text-primary-600">
                            {formatCurrency(result.monthlyPayment)}
                        </p>
                    </div>

                    {/* Total to Pay */}
                    <div>
                        <p className="mb-1 text-sm text-gray-600">Total a Pagar</p>
                        <p className="text-xl font-semibold text-gray-900">
                            {formatCurrency(result.totalToPay)}
                        </p>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1 border-t border-gray-300 pt-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Capital:</span>
                            <span className="font-medium">{formatCurrency(result.financingAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Intereses:</span>
                            <span className="font-medium">{formatCurrency(result.totalInterest)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
                <Button
                    variant="default"
                    size="lg"
                    className="w-full md:w-auto"
                    onClick={onRequestCredit}
                >
                    Solicitar Este Crédito
                </Button>
                <p className="mt-4 text-xs text-gray-500">
                    Valores referenciales. Cuota final sujeta a evaluación crediticia.
                    CAE informado al momento de la solicitud.
                </p>
            </div>
        </div>
    )
}
