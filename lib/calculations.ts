import { LoanResult } from './types'

/**
 * Calculate loan payment details
 * @param price - Vehicle price
 * @param downPaymentPercent - Down payment as percentage (10-50)
 * @param termMonths - Loan term in months (12-60)
 * @param annualRate - Annual interest rate (default 12%)
 * @returns Loan calculation results
 */
export function calculateLoan(
    price: number,
    downPaymentPercent: number,
    termMonths: number,
    annualRate: number = 12
): LoanResult {
    const downPayment = price * (downPaymentPercent / 100)
    const financingAmount = price - downPayment
    const monthlyRate = annualRate / 12 / 100

    // Monthly payment formula: PMT = P * (r * (1+r)^n) / ((1+r)^n - 1)
    const monthlyPayment =
        financingAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)

    const totalToPay = monthlyPayment * termMonths + downPayment
    const totalInterest = totalToPay - price

    return {
        downPayment: Math.round(downPayment),
        financingAmount: Math.round(financingAmount),
        monthlyPayment: Math.round(monthlyPayment),
        totalToPay: Math.round(totalToPay),
        totalInterest: Math.round(totalInterest),
    }
}

/**
 * Calculate estimated monthly payment for a vehicle
 * Uses standard assumptions: 20% down, 48 months, 12% annual rate
 */
export function estimateMonthlyPayment(price: number): number {
    const result = calculateLoan(price, 20, 48, 12)
    return result.monthlyPayment
}
