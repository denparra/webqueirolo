// Formateo de errores de Sanity/red para logging.
//
// Modulo SIN dependencias a proposito: `lib/sanity.ts` importa `next-sanity`,
// que es ESM y Jest no puede parsear. Mismo criterio que `lib/admin/imageResize.ts`:
// la logica pura vive aparte para poder testearla en aislamiento.

/**
 * Resume un error de Sanity/red en UNA linea legible.
 *
 * El cliente de Sanity adjunta el `request` completo a sus errores: la URL con
 * la query GROQ URL-encoded dos veces, headers y todas las opciones. Loguear el
 * objeto crudo escupe ~200 lineas por fallo y entierra el dato util. Durante el
 * incidente del threadpool (IMP-20260908-003) la evidencia decisiva estaba
 * perdida en ese muro de texto.
 *
 * Se queda con lo accionable:
 * - el mensaje;
 * - el `code` de la causa (`UND_ERR_CONNECT_TIMEOUT`, `ENOTFOUND`, ...), que es
 *   lo que identifica el modo de falla;
 * - el `statusCode` cuando es un ClientError/ServerError de Sanity;
 * - el pathname de la URL, SIN querystring.
 *
 * Nunca lanza: un helper de logging que rompe convierte un fallo ya manejado en
 * un 500.
 */
export function describeSanityError(error: unknown): string {
    try {
        if (error === null || error === undefined) return String(error)
        if (typeof error !== 'object') return String(error)

        const e = error as {
            message?: unknown
            statusCode?: unknown
            cause?: { code?: unknown }
            request?: { url?: unknown }
        }

        const parts: string[] = []

        parts.push(typeof e.message === 'string' && e.message ? e.message : String(error))

        const code = e.cause?.code
        if (typeof code === 'string' && code) parts.push(`code=${code}`)

        if (typeof e.statusCode === 'number') parts.push(`status=${e.statusCode}`)

        // Solo host + pathname. El querystring es la query GROQ completa: es
        // justo lo que infla el log y no aporta nada que el prefijo del call
        // site no diga ya.
        const url = e.request?.url
        if (typeof url === 'string' && url) {
            try {
                const parsed = new URL(url)
                parts.push(`url=${parsed.host}${parsed.pathname}`)
            } catch {
                parts.push(`url=${url.split('?')[0]}`)
            }
        }

        return parts.join(' | ')
    } catch {
        return 'error no serializable'
    }
}
