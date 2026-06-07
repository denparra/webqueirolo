# IMP-20260607-002 — SEO follow-ups: OG por vehículo + micro-fixes

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260607-002 |
| **Fecha**   | 2026-06-07 |
| **Owner**   | Denny |
| **Estado**  | planning (frente abierto, sin implementar) |
| **Log ref** | LOG-20260607-004 |
| **Continúa**| IMP-20260605-004 (F5 diferida), IMP-20260607-001 (F3 diferida) |

## Objetivo

Cerrar los pendientes SEO restantes: (a) **migración de dominio** — limpiar las referencias a la web antigua "Queirolo Mundo 4x4" que Google aún muestra (Fase 4, P0); (b) mejorar el OG por vehículo (dims mal declaradas); (c) micro-deudas. Documentar el camino recomendado **antes** de tocar código.

## Análisis del estado actual (verificado)

| Pieza | Estado hoy | Evidencia |
|---|---|---|
| OG por vehículo | Usa la **foto real** de Sanity, pero declara `width:1200, height:630` que **no coinciden** con la foto (4:3) | `app/vehiculos/[slug]/page.tsx:82` |
| Helper de imagen Sanity | `urlFor()` disponible; `cdn.sanity.io` acepta `?w&h&fit=crop` | `lib/sanity.ts:27` |
| `next/og` | **Nativo en Next 14** (no requiere instalar `@vercel/og`) | `package.json` (next ^14.1.0) |
| Bug previo OG dinámica | `@vercel/og` crasheaba en **Windows dev** al cargar su fuente por defecto | `IMP-20260605-004` F5 |
| `noindex` en filtros | No implementado; solo canonical fijo a `/vehiculos` | `app/vehiculos/layout.tsx` |
| `title.template` | Muerto: el layout sobreescribe `title` con string y anula el `template` | `app/layout.tsx:22` |
| `og:title` home | Genérico: "Queirolo Autos" a secas (no el título descriptivo) | `lib/seo.ts:64` |

## Recomendación

**Priorizar el arreglo barato y de alto valor (Fase 1) y NO empezar por la OG dinámica.** El intento que falló era la tarjeta generada con `next/og`; pero el 95% del valor (foto real, dimensiones correctas al compartir) se logra recortando la imagen de Sanity a 1200×630, sin runtime ni riesgo. La tarjeta branded con precio queda como mejora opcional, solo si se quiere logo+precio incrustados.

---

## Fase 1 — OG por vehículo a 1200×630 real ✅ recomendada (P1, bajo riesgo)

**Problema:** se declara `1200×630` pero se sirve la foto cruda (4:3) → al compartir un auto, la preview se recorta/deforma según la red.

**Solución:** generar una URL de la foto recortada a 1200×630 vía transformación de Sanity.

**Pasos:**
1. En `app/vehiculos/[slug]/page.tsx` (`generateMetadata`), derivar la `ogImage` recortada:
   - Si la URL es de `cdn.sanity.io`, anexar `?w=1200&h=630&fit=crop&auto=format` (o usar `urlFor(ref).width(1200).height(630).fit('crop').url()` si se ajusta la proyección GROQ para traer el ref del asset, no solo la URL).
2. Pasar esa URL a `openGraph.images[0].url` y `twitter.images`, manteniendo `width:1200, height:630` (ahora sí coherentes).
3. Fallback: si no hay foto, usar `/og-image.jpg` (el branded por defecto).

**Validación:** compartir un link de vehículo → preview 1200×630 con la foto del auto, sin deformación. `curl` de la ficha → `og:image` apunta a la URL con params de crop.

**Riesgo:** bajo. Sin `next/og`, sin runtime nuevo. Solo string/helper sobre una URL.

---

## Fase 2 — Micro-fixes SEO (P2, pulido)

1. **`title.template` muerto** (`app/layout.tsx`): o se restaura un esquema `title: { default, template: '%s | Queirolo Autos' }` coherente, o se elimina el `template` de `defaultMetadata` para no dejar código muerto. Decidir uno.
2. **`og:title`/`twitter:title` del home** (`lib/seo.ts:64,76`): hoy es `siteConfig.name` ("Queirolo Autos"). Subirlo al título descriptivo (`siteConfig.seo.title`) para un share más rico.
3. **`noindex` en listado filtrado** (decisión #3 de la auditoría): evaluar si vale la pena. El canonical fijo ya consolida los `?brand=…`; el `noindex` extra exigiría leer `searchParams` y perder el render estático del listado. **Recomendación: dejarlo como está** salvo que aparezcan filtros indexados en Search Console.

**Validación:** `curl` del home → `og:title` descriptivo; revisar que no haya `title` duplicado/raro en las páginas.

---

## Fase 3 — OG dinámica branded por vehículo (opcional, diferida)

Solo si se quiere una tarjeta con **foto + precio + logo** incrustados (más vendedora que la foto sola).

**Pasos:**
1. `app/vehiculos/[slug]/opengraph-image.tsx` con `ImageResponse` de `next/og` (nativo en Next 14).
2. **Bundlear una fuente** propia (`.ttf`/`.woff` en el repo, leída con `fs`/`fetch`) y pasarla explícita en `fonts: [...]` → evita el crash por la fuente por defecto.
3. `export const runtime = 'nodejs'` (Railway es Node; no edge).
4. **Verificar en Linux** (deploy/preview), NO en Windows dev — ahí está el bug conocido.

**Riesgo:** medio (el que ya falló una vez). Por eso va al final y solo si se decide el branding. La Fase 1 ya cubre el caso de uso principal.

---

## Fase 4 — Migración de dominio: desindexar la web antigua ("Queirolo Mundo 4x4") 🔴 P0

**Síntoma:** al buscar "queirolo.cl" / la empresa en Google, todavía aparece info de la web antigua (nombre "Queirolo Mundo 4x4", favicon rojo viejo, URLs como `/stock`), aunque al hacer clic abre la web nueva.

**Diagnóstico (verificado): ~80% caché/indexación de Google + 2 fixes técnicos reales.**

### Contexto de infraestructura (del owner)
- Dominio en **Cloudflare** (queirolo.cl A → 72.62.137.18; www CNAME → queirolo.cl). Ambos **DNS only** (sin proxy/caché de Cloudflare → no hay caché CF que purgar). SSL OK.
- Web nueva en **VPS EasyPanel/Traefik** (Next.js). Apex y www llegan a la app; `middleware.ts` hace 308 apex→www.

### Fixes técnicos en la web (lo único que es código) — ✅ IMPLEMENTADO (2026-06-07)
1. ✅ **`public/manifest.json`**: `name` y `short_name` → "Queirolo Autos"; `description` actualizada a la del sitio. *Por qué importaba:* el manifest PWA reinyectaba el nombre antiguo a Google/navegadores.
2. ✅ **Redirect de URLs viejas** en `next.config.js` (`async redirects()`):
   ```js
   { source: '/stock', destination: '/vehiculos', permanent: true }
   { source: '/stock/:path*', destination: '/vehiculos', permanent: true }
   ```
   301 permanente: recupera autoridad y señala el movimiento. **Pendiente:** revisar en GSC ("Páginas") si hay otras rutas viejas para mapear.

### Lo que NO es código (caché/indexación — la mayor parte)
- **Favicon rojo viejo / nombre / descripción vieja en el SERP** = Google no recrawleó aún. La web nueva ya sirve el favicon nuevo, el nombre "Queirolo Autos" y la metadata correcta (verificado en el HTML de prod). Es esperar + acelerar.

### Acciones en Google Search Console
1. **Propiedad de dominio** (`queirolo.cl`, tipo *Domain*) además de la URL-prefix `www` — cubre todos los subdominios/protocolos y consolida señales. Verificación por DNS (TXT en Cloudflare).
2. **Enviar `sitemap.xml`** (ya apunta a www, inventario real).
3. **Inspección de URL** → `https://www.queirolo.cl/` y páginas clave → "Solicitar indexación".
4. **Herramienta de Eliminaciones (Removals)**: ocultar temporalmente las URLs viejas más visibles (`/stock`, etc.) mientras Google las recrawlea — efecto rápido (oculta ~6 meses), no es desindexación definitiva pero limpia el SERP ya.
5. Confirmar en GSC que la **versión canónica** detectada es `https://www.queirolo.cl` (vía canonical + redirect 308).

### Para que los resultados viejos caigan más rápido
- Las URLs viejas que ya no existen: que devuelvan **301** (a su equivalente nuevo) o, si no hay equivalente, **410 Gone** (Google las dropea más rápido que un 404).
- No bloquear con robots.txt las URLs viejas que querés desindexar (si están bloqueadas, Google no puede ver el 301/410). Dejarlas rastreables hasta que caigan.
- Cuando se active el proxy de Cloudflare (naranja) más adelante: purgar caché de Cloudflare. Hoy (DNS only) no aplica.

### Verificación
- `curl https://www.queirolo.cl/manifest.json` → nombre "Queirolo Autos".
- `curl -I https://www.queirolo.cl/stock` → 301 a `/vehiculos`.
- `curl -I https://queirolo.cl/` → 308 a `https://www.queirolo.cl/`.
- GSC: sitemap "Correcto", inspección del home "La URL está en Google" tras recrawl.

### Expectativa realista
- Cambios de código (manifest, redirects): efecto cuando Google recrawlee.
- Favicon/nombre/desc en el SERP: **días a semanas**. La herramienta de Eliminaciones + Solicitar indexación lo aceleran, pero el favicon es lo más lento.

---

## Secuencia recomendada

1. **Fase 4** primero (P0) — es lo que más molesta hoy (marca vieja en Google) y tiene fixes de código baratos.
2. **Fase 1** — OG por vehículo correcto (alto valor, bajo riesgo).
3. **Fase 2** como pulido en el mismo PR o uno chico.
4. **Fase 3** solo si el cliente quiere la tarjeta branded; verificar en Linux.

## Impacto esperado

- Share de vehículos con preview correcta (foto bien encuadrada 1200×630).
- Metadata más limpia (sin template muerto, og:title rico).
- Camino claro y de bajo riesgo para la OG branded si se decide.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Repetir el crash de `next/og` en Windows | media (solo Fase 3) | Fase 3 usa fuente bundleada + se verifica en Linux; Fase 1 no usa `next/og` |
| Crop de Sanity recorta mal autos con encuadre raro | baja | `fit=crop` centra; revisar algunos casos reales |

## Definition of Done (del frente, no de la implementación)

- [x] Carpeta `IMP-20260607-002/` con `IMP.md` y fases claras.
- [x] Análisis del estado actual verificado en código.
- [x] Registrado en `docs/logbook.md` (LOG-20260607-004).
- [ ] Implementación (pendiente de decisión del owner sobre qué fases ejecutar).

## Referencias

- `app/vehiculos/[slug]/page.tsx`, `lib/sanity.ts`, `lib/seo.ts`, `app/layout.tsx`, `app/vehiculos/layout.tsx`
- `docs/analysis/2026-06-05-seo-audit-recomendacion.md`, `IMP-20260605-004`, `IMP-20260607-001`
