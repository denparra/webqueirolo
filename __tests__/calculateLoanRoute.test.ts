/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/calculate-loan/route'

function makeRequest(body: unknown): NextRequest {
    return new NextRequest('http://localhost/api/calculate-loan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    })
}

describe('POST /api/calculate-loan', () => {
    it('uses the configured 24% annual rate when interestRate is omitted', async () => {
        const res = await POST(makeRequest({ price: 10_000_000, downPayment: 2_000_000, term: 48 }))
        const json = await res.json()
        expect(res.status).toBe(200)
        expect(json.data.interestRate).toBe(24)
        expect(json.data.monthlyPayment).toBe(260_815)
    })

    it('still honors an explicit interestRate', async () => {
        const res = await POST(
            makeRequest({ price: 10_000_000, downPayment: 2_000_000, term: 48, interestRate: 12 })
        )
        const json = await res.json()
        expect(res.status).toBe(200)
        expect(json.data.interestRate).toBe(12)
        expect(json.data.monthlyPayment).toBe(210_671)
    })

    it('still rejects invalid input with 400', async () => {
        const res = await POST(makeRequest({ price: 10, downPayment: 0, term: 48 }))
        expect(res.status).toBe(400)
    })

    it('still rejects a down payment that covers the whole price', async () => {
        const res = await POST(makeRequest({ price: 10_000_000, downPayment: 10_000_000, term: 48 }))
        expect(res.status).toBe(400)
    })
})
