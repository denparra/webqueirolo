import siteConfig from '@/config'
import { calculateLoan, estimateMonthlyPayment } from '@/lib/calculations'

describe('loan simulation config', () => {
    it('uses a 24% annual reference rate with 20% down and 48 months', () => {
        expect(siteConfig.loanSimulation.annualRatePercent).toBe(24)
        expect(siteConfig.loanSimulation.downPaymentPercent).toBe(20)
        expect(siteConfig.loanSimulation.termMonths).toBe(48)
    })

    it('exposes a disclaimer that says it is approximate and depends on the lender', () => {
        const { disclaimer, disclaimerShort } = siteConfig.loanSimulation
        expect(disclaimer).toMatch(/aproximada/i)
        expect(disclaimer).toMatch(/financiera/i)
        expect(disclaimerShort).toMatch(/aproximada/i)
        expect(disclaimerShort).toMatch(/financiera/i)
    })
})

describe('calculateLoan', () => {
    it('keeps the amortization formula unchanged for an explicit rate (12% annual)', () => {
        const result = calculateLoan(10_000_000, 20, 48, 12)
        expect(result.downPayment).toBe(2_000_000)
        expect(result.financingAmount).toBe(8_000_000)
        expect(result.monthlyPayment).toBe(210_671)
        // totalToPay uses the unrounded payment, so it can differ from payment*48 by under 1 CLP per month
        expect(Math.abs(result.totalToPay - (210_671 * 48 + 2_000_000))).toBeLessThanOrEqual(48)
        expect(result.totalInterest).toBe(result.totalToPay - 10_000_000)
    })

    it('defaults to the configured annual rate (24%)', () => {
        const withDefault = calculateLoan(10_000_000, 20, 48)
        const explicit = calculateLoan(10_000_000, 20, 48, 24)
        expect(withDefault).toEqual(explicit)
        expect(withDefault.monthlyPayment).toBe(260_815)
    })

    it('charges a higher payment at the new default than at the old 12%', () => {
        const oldRate = calculateLoan(10_000_000, 20, 48, 12).monthlyPayment
        const newRate = calculateLoan(10_000_000, 20, 48).monthlyPayment
        expect(newRate).toBeGreaterThan(oldRate)
    })
})

describe('estimateMonthlyPayment', () => {
    it('uses the configured down payment, term and rate', () => {
        const { downPaymentPercent, termMonths, annualRatePercent } = siteConfig.loanSimulation
        const expected = calculateLoan(15_000_000, downPaymentPercent, termMonths, annualRatePercent).monthlyPayment
        expect(estimateMonthlyPayment(15_000_000)).toBe(expected)
    })

    it('returns the 24% figure for a $10M vehicle', () => {
        expect(estimateMonthlyPayment(10_000_000)).toBe(260_815)
    })
})
