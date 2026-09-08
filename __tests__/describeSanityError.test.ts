import { describeSanityError } from '@/lib/sanityErrors'

// URL real del incidente: la query GROQ va URL-encoded y sola ocupa ~1500 chars.
// Es exactamente el ruido que este helper existe para no loguear.
const REAL_URL =
  'https://4124jngl.api.sanity.io/v2025-01-01/data/query/production' +
  '?query=*%5B_type+%3D%3D+%22vehicle%22+%26%26+status+%3D%3D+%22available%22%5D' +
  '+%7C+order%28_createdAt+desc%29+%7B%0A++++_id%2C%0A++++name%2C%0A++++price%0A++%7D' +
  '&returnQuery=false'

function connectTimeoutError() {
  const error: any = new Error('fetch failed')
  error.isNetworkError = true
  error.cause = { code: 'UND_ERR_CONNECT_TIMEOUT' }
  error.request = { url: REAL_URL }
  return error
}

describe('describeSanityError', () => {
  it('extrae mensaje, code y host+path de un connect timeout', () => {
    const out = describeSanityError(connectTimeoutError())
    expect(out).toContain('fetch failed')
    expect(out).toContain('code=UND_ERR_CONNECT_TIMEOUT')
    expect(out).toContain('url=4124jngl.api.sanity.io/v2025-01-01/data/query/production')
  })

  // La aserción que sostiene todo el cambio: si alguien vuelve a loguear el
  // objeto crudo o arma la URL sin recortar, este test lo frena.
  it('NUNCA incluye el querystring de la query GROQ', () => {
    const out = describeSanityError(connectTimeoutError())
    expect(out).not.toContain('query=')
    expect(out).not.toContain('returnQuery')
    expect(out).not.toContain('%5B_type')
  })

  it('mantiene la salida en una sola linea y acotada', () => {
    const out = describeSanityError(connectTimeoutError())
    expect(out).not.toContain('\n')
    expect(out.length).toBeLessThan(200)
  })

  it('incluye statusCode en errores HTTP de Sanity', () => {
    const error: any = new Error('Unauthorized - Session not found')
    error.statusCode = 401
    error.request = { url: 'https://4124jngl.api.sanity.io/v2025-01-01/data/mutate/production' }
    const out = describeSanityError(error)
    expect(out).toContain('status=401')
    expect(out).toContain('url=4124jngl.api.sanity.io/v2025-01-01/data/mutate/production')
  })

  it('recorta el querystring aun si la URL es invalida para new URL()', () => {
    const error: any = new Error('boom')
    error.request = { url: 'no-es-una-url?query=*%5B_type%5D&returnQuery=false' }
    const out = describeSanityError(error)
    expect(out).toContain('url=no-es-una-url')
    expect(out).not.toContain('query=')
  })

  it('sobrevive a un Error pelado sin request ni cause', () => {
    expect(describeSanityError(new Error('algo se rompio'))).toBe('algo se rompio')
  })

  it.each([
    [null, 'null'],
    [undefined, 'undefined'],
    ['string suelto', 'string suelto'],
    [42, '42'],
  ])('no rompe ante %p', (input, expected) => {
    expect(describeSanityError(input)).toBe(expected)
  })

  it('no lanza ante un objeto con getters hostiles', () => {
    const hostile = {
      get message() {
        throw new Error('getter explosivo')
      },
    }
    expect(() => describeSanityError(hostile)).not.toThrow()
  })
})
