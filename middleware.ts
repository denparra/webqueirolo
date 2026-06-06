import { NextRequest, NextResponse } from 'next/server'

/**
 * Redirige el dominio apex (queirolo.cl) al canónico con www (www.queirolo.cl).
 *
 * Hoy ambos hosts responden 200 → contenido duplicado que diluye la autoridad SEO.
 * Este 308 permanente consolida todo en www. Solo actúa sobre el host apex exacto,
 * por lo que no afecta localhost, previews ni el propio www.
 *
 * Si en el futuro se prefiere resolver el redirect a nivel hosting/DNS, este archivo
 * puede eliminarse sin otros cambios.
 */
export function middleware(request: NextRequest) {
    const host = request.headers.get('host')

    if (host === 'queirolo.cl') {
        const url = request.nextUrl.clone()
        url.protocol = 'https'
        url.hostname = 'www.queirolo.cl'
        url.port = ''
        return NextResponse.redirect(url, 308)
    }

    return NextResponse.next()
}

export const config = {
    // Excluye assets estáticos para no procesarlos en cada request.
    matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
