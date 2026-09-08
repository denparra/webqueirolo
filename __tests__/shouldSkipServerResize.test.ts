import {
  shouldSkipServerResize,
  CLIENT_MAX_EDGE,
  SERVER_MAX_EDGE,
} from '@/lib/admin/imageResize'

describe('shouldSkipServerResize', () => {
  // Invariante que sostiene todo el bypass: si el cliente redujera MÁS allá del
  // límite del servidor, el resize del servidor sí haría trabajo útil y saltearlo
  // sería un bug. Si alguien sube CLIENT_MAX_EDGE por encima de SERVER_MAX_EDGE,
  // este test avisa antes que producción.
  it('el límite del cliente no supera al del servidor', () => {
    expect(CLIENT_MAX_EDGE).toBeLessThanOrEqual(SERVER_MAX_EDGE)
  })

  it('saltea el resize en el caso normal: JPEG del cliente, dentro del límite', () => {
    expect(
      shouldSkipServerResize({
        contentType: 'image/jpeg',
        width: CLIENT_MAX_EDGE,
        height: 1333,
      })
    ).toBe(true)
  })

  it('saltea el resize justo en el límite del servidor', () => {
    expect(
      shouldSkipServerResize({
        contentType: 'image/jpeg',
        width: SERVER_MAX_EDGE,
        height: SERVER_MAX_EDGE,
      })
    ).toBe(true)
  })

  it('NO saltea cuando la imagen excede el límite por un píxel', () => {
    expect(
      shouldSkipServerResize({
        contentType: 'image/jpeg',
        width: SERVER_MAX_EDGE + 1,
        height: 100,
      })
    ).toBe(false)
  })

  it('NO saltea cuando el lado excedido es el alto', () => {
    expect(
      shouldSkipServerResize({
        contentType: 'image/jpeg',
        width: 100,
        height: SERVER_MAX_EDGE + 1,
      })
    ).toBe(false)
  })

  it.each(['image/png', 'image/webp', 'image/gif', 'image/heic'])(
    'NO saltea %s: hay que convertir el formato igual',
    (contentType) => {
      expect(shouldSkipServerResize({ contentType, width: 800, height: 600 })).toBe(false)
    }
  )

  it('NO saltea cuando falta alguna dimensión', () => {
    expect(shouldSkipServerResize({ contentType: 'image/jpeg', width: 800 })).toBe(false)
    expect(shouldSkipServerResize({ contentType: 'image/jpeg', height: 600 })).toBe(false)
    expect(shouldSkipServerResize({ contentType: 'image/jpeg' })).toBe(false)
  })

  it('saltea con orientación EXIF normal o ausente', () => {
    expect(
      shouldSkipServerResize({ contentType: 'image/jpeg', width: 800, height: 600 })
    ).toBe(true)
    expect(
      shouldSkipServerResize({ contentType: 'image/jpeg', width: 800, height: 600, orientation: 1 })
    ).toBe(true)
  })

  it.each([2, 3, 4, 5, 6, 7, 8])(
    'NO saltea con orientación EXIF %i: sharp debe hornear la rotación',
    (orientation) => {
      expect(
        shouldSkipServerResize({
          contentType: 'image/jpeg',
          width: 800,
          height: 600,
          orientation,
        })
      ).toBe(false)
    }
  )
})
