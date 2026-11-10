/**
 * @jest-environment node
 */
import { renderToStaticMarkup } from 'react-dom/server'
import siteConfig from '@/config'
import { LoanCalculator } from '@/components/forms/LoanCalculator'
import { FeaturedVehicleCard } from '@/components/home/FeaturedVehicleCard'
import { calculateLoan } from '@/lib/calculations'

// Server rendering avoids depending on @testing-library/dom (not installed in this repo)
// and on browser-only APIs the Radix Slider needs in jsdom.

describe('LoanCalculator', () => {
    it('shows the configured rate and the full disclaimer', () => {
        const html = renderToStaticMarkup(<LoanCalculator initialPrice={10_000_000} />)
        expect(html).toContain('value="24% anual"')
        expect(html).toContain(siteConfig.loanSimulation.disclaimer)
    })

    it('keeps its structure and computes the payment with the configured rate', () => {
        const html = renderToStaticMarkup(<LoanCalculator initialPrice={10_000_000} />)
        const expected = calculateLoan(10_000_000, 20, 48).monthlyPayment
        const formatted = expected.toLocaleString('es-CL')
        expect(html).toContain('Simula tu Cuota')
        expect(html).toContain('Cuota mensual referencial')
        expect(html).toContain('Solicitar Evaluación')
        expect(html).toContain(formatted)
    })
})

describe('FeaturedVehicleCard', () => {
    const vehicle = {
        id: '1',
        slug: 'demo',
        brand: 'Marca',
        model: 'Modelo',
        year: 2020,
        price: 10_000_000,
        monthlyPayment: 260_815,
        km: 50_000,
        transmission: 'Manual',
        image: '',
        isNew: false,
    }

    it('keeps the "Desde aprox." line and adds the short legend', () => {
        const html = renderToStaticMarkup(<FeaturedVehicleCard vehicle={vehicle} />)
        expect(html).toContain('Desde aprox.')
        expect(html).toContain(siteConfig.loanSimulation.disclaimerShort)
    })
})
