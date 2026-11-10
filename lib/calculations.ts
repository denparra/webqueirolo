import siteConfig from '@/config'
import { LoanResult } from './types'

const loanSimulation = siteConfig.loanSimulation

/**
 * Calculate loan payment details
 * @param price - Vehicle price
 * @param downPaymentPercent - Down payment as percentage (10-50)
 * @param termMonths - Loan term in months (12-60)
 * @param annualRate - Annual interest rate (default: config.ts loanSimulation.annualRatePercent)
 * @returns Loan calculation results
 */
export function calculateLoan(
    price: number,
    downPaymentPercent: number,
    termMonths: number,
    annualRate: number = loanSimulation.annualRatePercent
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
 * Uses the reference assumptions from config.ts (loanSimulation): 20% down, 48 months, 24% annual rate
 */
export function estimateMonthlyPayment(price: number): number {
    const result = calculateLoan(
        price,
        loanSimulation.downPaymentPercent,
        loanSimulation.termMonths,
        loanSimulation.annualRatePercent
    )
    return result.monthlyPayment
}
