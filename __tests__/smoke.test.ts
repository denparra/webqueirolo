import { render, screen } from '@testing-library/react'
import siteConfig from '@/config'

describe('Site Configuration', () => {
    it('should have valid contact information', () => {
        expect(siteConfig.contact.email).toBeTruthy()
        expect(siteConfig.contact.whatsapp).toBeTruthy()
        expect(siteConfig.contact.address.coordinates.lat).toBeDefined()
        expect(siteConfig.contact.address.coordinates.lng).toBeDefined()
    })

    it('should have valid company information', () => {
        expect(siteConfig.company.name).toBeTruthy()
        expect(siteConfig.company.tagline).toBeTruthy()
    })
})

describe('API Health Check', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ ok: true, timestamp: new Date().toISOString() }),
            })
        ) as jest.Mock
    })

    it('should return ok status', async () => {
        const response = await fetch('http://localhost:3000/api/health')
        const data = await response.json()

        expect(response.ok).toBe(true)
        expect(data.ok).toBe(true)
        expect(data.timestamp).toBeDefined()
    })
})
