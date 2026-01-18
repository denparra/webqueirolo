import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for loan calculation
const loanSchema = z.object({
    price: z.number().min(1000000, 'Precio mínimo: $1.000.000').max(100000000, 'Precio máximo: $100.000.000'),
    downPayment: z.number().min(0).max(100000000),
    term: z.number().min(12, 'Plazo mínimo: 12 meses').max(84, 'Plazo máximo: 84 meses'),
    interestRate: z.number().min(0).max(50).optional(),
})

// Calculate monthly payment using PMT formula
function calculateMonthlyPayment(
    principal: number,
    annualRate: number,
    months: number
): number {
    if (annualRate === 0) {
        return principal / months
    }

    const monthlyRate = annualRate / 12 / 100
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)

    return Math.round(payment)
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = loanSchema.parse(body)

        const { price, downPayment, term, interestRate = 1.5 } = validatedData

        // Calculate loan amount
        const loanAmount = price - downPayment

        if (loanAmount <= 0) {
            return NextResponse.json(
                { error: 'El pie debe ser menor que el precio del vehículo' },
                { status: 400 }
            )
        }

        // Calculate monthly payment
        const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, term)

        // Calculate total to pay
        const totalToPay = monthlyPayment * term

        // Calculate total interest
        const totalInterest = totalToPay - loanAmount

        return NextResponse.json({
            success: true,
            data: {
                price,
                downPayment,
                loanAmount,
                term,
                interestRate,
                monthlyPayment,
                totalToPay,
                totalInterest,
            },
        })

    } catch (error) {
        console.error('[calculate-loan] Error:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Error al calcular el crédito' },
            { status: 500 }
        )
    }
}
