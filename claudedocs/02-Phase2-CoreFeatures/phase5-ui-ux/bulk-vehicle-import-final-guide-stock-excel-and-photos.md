# Guia Final: Importacion Masiva de Vehiculos desde Excel STOCK + Fotos por CODIGO (Next.js + Sanity)

## 1) Resumen ejecutivo
La estrategia recomendada (ver `claudedocs/02-Phase2-CoreFeatures/phase5-ui-ux/bulk-vehicle-import-strategy.md`) es un **script Node.js con `@sanity/client`** que (1) lee el Excel `STOCK` exportado a CSV, (2) filtra solo filas con `ESTADO=PUBLICAR`, (3) sube imagenes **directo desde disco** desde carpetas `autos\\{CODIGO}\\` y (4) crea/actualiza documentos `vehicle` en Sanity con el orden de imagenes garantizado por la numeracion **1..N** (foto 1 = principal). Calza perfecto con tu estructura actual porque el `CODIGO` ya mapea 1:1 a la carpeta de fotos y las imagenes ya vienen ordenadas.

---

## 2) Requisitos de compatibilidad con el proyecto (schema + consumo web)

### 2.1 Schema real de Sanity (tipo `vehicle`)
Fuente: `sanity/schemaTypes/vehicle.ts`.

Campos required (validacion en Studio):
- `name` (string) requerido.
- `slug` (slug) requerido, `options.source = name`.
- `price` (number) requerido, `min(0)`.
- `images` (array of `image`) requerido, `min(1)`. Cada item es `{"_type":"image","asset":{"_type":"reference","_ref":"image-..."}}`.
- `brand` (string) requerido.
- `model` (string) requerido.
- `year` (number) requerido, `min(1990)` y `max(2030)`.

Campos relevantes opcionales:
- `version` (string)
- `category` (string con `options.list` en Studio)
- `mileage` (number)
- `plate` (string)
- `description` (text)
- `status` (string con `options.list`: `available` | `reserved` | `sold`, default `available`)
- `bodyType`, `doors`, `fuel`, `transmission`, `color`, `isFeatured`, y arrays de features.

Importante:
- No existe un campo separado para "imagen principal". La galeria completa vive en `images`.
- No existe un campo en schema para `CODIGO` ni para `FECHA PUBLICACION` (si necesitas guardarlos como campos visibles en Studio, eso seria un cambio de schema y no forma parte de este plan).

### 2.2 Como la web consume los datos (que debe venir bien importado)
Fuente: `lib/vehicles.ts` + UI (`app/vehiculos/page.tsx`, `app/vehiculos/[slug]/page.tsx`, `components/vehicles/VehicleDetailGallery.tsx`).

GROQ actual:
- Listado: `*[_type == "vehicle"] | order(_createdAt desc) { ... , "slug": slug.current, "images": images[].asset->url, ... }`
- Detalle: `*[_type == "vehicle" && slug.current == $slug][0] { ... }`

Consecuencias directas para el import:
- El frontend usa `slug.current` como URL (`/vehiculos/[slug]`). Si el slug cambia, la URL cambia.
- El frontend considera **la primera imagen** como principal:
  - `vehicle.image` se toma de `images[0]` (en `lib/vehicles.ts`, `getSafeImageUrl`).
  - La galeria muestra `vehicle.images` en el orden en que llegan.
- Si faltan `brand/model/year/price/mileage`, el UI cae a `N/A` o `0` (se ve mal y afecta filtros). Lo ideal es poblarlos desde el Excel.
- El listado NO filtra por `status` (`available/reserved/sold`). Si no quieres que un vehiculo aparezca, **no lo importes** (o luego habria que cambiar queries, fuera de alcance).

### 2.3 Slug y duplicados (policy recomendada)
El schema marca `slug` como required pero no define un `isUnique` custom. Para evitar colisiones en import masivo:
- Usar `_id` deterministico por `CODIGO` (ej: `vehicle-12`). Esto hace el proceso **idempotente** (re-ejecutar actualiza en vez de duplicar).
- Generar `slug.current` a partir de `name` pero con sufijo `-{CODIGO}` (ej: `toyota-rav4-2021-12`). Esto garantiza unicidad y mantiene una relacion directa con carpeta de fotos.
- `plate` (patente) se importa como dato, pero no se asume unico a nivel dataset (puede repetirse por error humano).

---

## 3) Mapeo EXACTO: Excel `STOCK` -> Sanity `vehicle`

Columnas del Excel (fuente):
`ESTADO, CODIGO, FECHA PUBLICACION, CATEGORIA, MARCA, MODELO, VERSION, DESCRIPCION, PATENTE, AÑO, KMS, PRECIO`

### 3.1 Tabla de mapeo

| Columna Excel | Campo Sanity | Transformacion / normalizacion | Requerido para importar | Notes |
|---|---|---|---:|---|
| `ESTADO` | (regla de filtro) | Solo importar si `trim(ESTADO).toUpperCase() === "PUBLICAR"` | si | No se guarda en Sanity; es gating de import.
| `CODIGO` | `_id` (document id) | `vehicle-{CODIGO}` donde `CODIGO` es entero >= 1 | si | No hay campo `codigo` en schema. `_id` estable evita duplicados.
| `CODIGO` | (fotos) | Se usa para folder: `autos\\{CODIGO}\\` | si | Ver seccion 4.
| `CODIGO` | `slug.current` (sufijo) | `slugify(name) + "-" + CODIGO` | si | Garantiza unicidad.
| `FECHA PUBLICACION` | (sin campo) | Ignorar o usar solo para orden/registro en manifest | no | No hay campo equivalente en `vehicle.ts`.
| `CATEGORIA` | `category` | Normalizar a uno de: `SUV`, `Camioneta`, `Sedán`, `Hatchback`, `Coupé`, `Convertible`, `Comercial`, `Moto` | no | En Studio es dropdown (string con list). Si no calza, dejar vacio y revisar manual.
| `MARCA` | `brand` | `trim(MARCA)`; ideal: Title Case consistente | si | Afecta filtros de marca.
| `MODELO` | `model` | `trim(MODELO)` | si | Se muestra en card y detalle.
| `VERSION` | `version` | `trim(VERSION)`; si vacio -> omit/undefined | no | Se muestra si existe.
| `DESCRIPCION` | `description` | `trim(DESCRIPCION)`; mantener saltos de linea si el CSV los preserva | no | Se usa en detalle (si lo renderizan).
| `PATENTE` | `plate` | Normalizar: `trim`, uppercase, remover espacios y guiones (ej: `ABCD12`) | no | Uso interno.
| `AÑO` | `year` | Parse int (1990..2030). Si viene como texto, remover espacios. | si | Required en schema.
| `KMS` | `mileage` | Parse int >= 0. Aceptar separadores miles (puntos/espacios). | no (pero recomendado) | Afecta UI (km y badge "recien llegado").
| `PRECIO` | `price` | Parse int >= 0. Aceptar separadores miles (puntos/espacios). | si | Required en schema.
| (derivado) | `name` | `"{MARCA} {MODELO}{VERSION? ' ' + VERSION : ''} {AÑO}"` | si | Required; base para slug.
| (derivado) | `images` | Array ordenado por numeracion interna 1..N (foto 1 primero) | si | Required; ver seccion 4.

### 3.2 Normalizacion recomendada (determinista)
- `trim` a todos los strings.
- `brand/model/version`: colapsar multiples espacios a uno.
- `plate`: `AB CD-12` -> `ABCD12` (uppercase + sin espacios/guiones). Si viene vacia, no setear.
- Numericos (`year/mileage/price`): remover todo excepto digitos antes de `parseInt`.
- `category`: aplicar tabla de equivalencias (ejemplos):
  - `SEDAN`, `Sedan` -> `Sedán`
  - `COUPE`, `Coupe` -> `Coupé`
  - `CAMIONETA`, `PICKUP` -> `Camioneta`
  - Si no hay match confiable: dejar `category` vacio (para evitar valores "fuera del dropdown").

---

## 4) Estrategia CRITICA de fotos (CODIGO + ORDEN por numeracion 1..N)

### 4.1 Regla obligatoria (source of truth)
- Las fotos viven en `C:\\Users\\denny\\OneDrive\\Documentos\\AUTOMOTORA\\SUBIR AUTOS A NUEVA PAGINA\\autos\\{CODIGO}\\`.
- Dentro de cada carpeta, las fotos ya estan numeradas desde 1:
  - `1.jpg` (o `1.png`, `1.jpeg`, `1.webp`) = **imagen principal** (primera en `images[]`).
  - `2..N` = galeria, en ese orden (siguientes items en `images[]`).

### 4.2 Extensiones validas y como ordenar (para evitar bug tipico "10 antes que 2")
Extensiones aceptadas (case-insensitive):
- `.jpg`, `.jpeg`, `.png`, `.webp`

Ordenamiento recomendado:
- Para cada archivo valido, extraer el indice numerico desde el nombre (sin extension):
  - Caso esperado: `1.jpg`, `2.jpg`...
  - Casos tolerados: `01.jpg`, `001.jpg` (leading zeros), o `1 (1).jpg` si aun comienza con numero.
- Parsear el numero en base 10 y ordenar por ese numero (asc).
- Ignorar archivos que no parten con numero (o marcarlos como warning) para no contaminar el orden.

### 4.3 Politica ante problemas (clara y repetible)
- Si **falta la foto 1**: el vehiculo **NO se importa** (se marca como error) hasta que exista `1.(ext)`.
- Si hay saltos (ej: `1,3,4` sin `2`):
  - Se importa igual.
  - Se mantiene el orden por numero.
  - Se registra warning para que se corrija si se desea.
- Si hay duplicados de indice (ej: `1.jpg` y `1.png`):
  - Se marca como error y se requiere dejar solo uno.
- Si una carpeta no existe para un `CODIGO` que se va a PUBLICAR:
  - Se marca como error y se omite ese vehiculo (hasta corregir).

### 4.4 Estructura de carpetas (ejemplo)
```
autos/
  1/
    1.jpg
    2.jpg
    3.jpg
  2/
    1.png
    2.png
```

---

## 5) Pipeline paso a paso (documentado, sin ejecutar aqui)

> Objetivo operacional: terminar con documentos `vehicle` publicados en Sanity, con `images[]` en el orden correcto (1..N) y campos requeridos completos.

### 5.1 Preparar el Excel y exportar a CSV
1) Abrir el Excel `STOCK` (tu archivo en `C:\\Users\\denny\\OneDrive\\Documentos\\AUTOMOTORA\\SUBIR AUTOS A NUEVA PAGINA\\autos`).
2) Verificar:
   - Columnas exactamente: `ESTADO, CODIGO, FECHA PUBLICACION, CATEGORIA, MARCA, MODELO, VERSION, DESCRIPCION, PATENTE, AÑO, KMS, PRECIO`.
   - `CODIGO` es entero, sin duplicados, y coincide con carpetas existentes.
   - `PRECIO` y `AÑO` no estan vacios en filas `PUBLICAR`.
3) Filtrar `ESTADO=PUBLICAR` y revisar rapidamente outliers (precios 0, ano fuera de rango, kms negativos).
4) Exportar a `CSV UTF-8` (recomendado) para evitar problemas de tildes y separadores.

### 5.2 Validar carpetas de fotos (antes de tocar Sanity)
Para cada fila `PUBLICAR`:
1) Existe carpeta `autos\\{CODIGO}\\`.
2) Existe archivo `1.(jpg|jpeg|png|webp)`.
3) Las fotos 2..N siguen la numeracion (no importa si faltan numeros, pero es mejor que sea consecutivo).

### 5.3 Generar un "manifest" normalizado (recomendado)
Antes de subir, generar un archivo auditable (ej: `vehicles.manifest.ndjson` o `vehicles.manifest.json`) con:
- `codigo`
- `estado`
- datos ya normalizados (`brand/model/...`)
- `name`
- `slug.current`
- lista ordenada de rutas de imagenes (foto 1 primero)

Este manifest es el insumo ideal para:
- revision rapida (diff / conteo)
- logs y trazabilidad
- rollback manual (saber exactamente que se intento subir)

### 5.4 Carga a Sanity (metodo recomendado: script Node + @sanity/client)
La idea es replicar el enfoque del documento base (`bulk-vehicle-import-strategy.md`), adaptado a CODIGO y fotos 1..N.

**Configuracion minima del cliente** (conceptual):
- `projectId`: mismo que usa el proyecto (ver env vars del repo)
- `dataset`: ideal correr primero en `staging` y luego `production`
- `token`: `SANITY_API_TOKEN` con permisos de escritura (Editor)
- `useCdn: false`
- `apiVersion`: `2024-01-01` (alineado con `sanity/env-utils.ts`)

**Recomendacion clave (idempotencia):**
- Crear/actualizar usando `createOrReplace` (o `transaction`) con `_id = vehicle-{CODIGO}`.

**Construccion del documento `vehicle` (conceptual):**
- `_type: "vehicle"`
- `_id: "vehicle-{CODIGO}"`
- `name` derivado
- `slug: { _type: "slug", current: "{slugify(name)}-{CODIGO}" }`
- `brand/model/version/year/price/mileage/category/plate/description`
- `status: "available"` (si no hay columna en Excel)
- `images: [...]` donde cada item es un objeto `image` referenciando el asset subido, respetando el orden 1..N

**Carga de assets (imagenes):**
- Listar archivos en `autos\\{CODIGO}\\`, filtrar extensiones validas.
- Ordenar por numero (seccion 4.2).
- Subir en ese orden y construir `images[]` en el mismo orden.
- Setear `_key` por cada item en `images[]` (recomendado por Sanity para arrays), por ejemplo: `img-{CODIGO}-{index}`.

### 5.5 Verificacion (Studio + Web)
1) En Sanity Studio (`/studio`):
   - Revisar 3-5 vehiculos aleatorios: `name`, `slug`, `price`, `brand/model/year`, `images`.
   - Confirmar que la foto 1 quedo como `images[0]`.
2) En la web:
   - `/vehiculos`: aparece el vehiculo y la imagen principal correcta.
   - `/vehiculos/{slug}`: galeria respeta orden; detalle no hace `notFound()`.

---

## 6) Checklists (pre y post)

### 6.1 Pre-import
- [ ] Excel exportado a CSV UTF-8.
- [ ] Solo filas con `ESTADO=PUBLICAR` se consideran.
- [ ] Para cada `CODIGO` a importar existe carpeta `autos\\{CODIGO}\\`.
- [ ] Cada carpeta tiene `1.(jpg|jpeg|png|webp)`.
- [ ] No hay indices duplicados (ej: `1.jpg` y `1.png`).
- [ ] `AÑO` dentro de 1990..2030 en filas PUBLICAR.
- [ ] `PRECIO` > 0 en filas PUBLICAR.
- [ ] `SANITY_API_TOKEN` creado (Editor) y guardado fuera del repo.
- [ ] Dataset `staging` disponible para prueba (recomendado).

### 6.2 Post-import
- [ ] Cantidad de documentos creados/actualizados coincide con filas `PUBLICAR` validas.
- [ ] Cada documento tiene `images` >= 1 y `images[0]` es la foto 1.
- [ ] Slugs son unicos y navegables.
- [ ] `/vehiculos` lista los nuevos vehiculos.
- [ ] `/vehiculos/[slug]` abre detalle sin 404.

---

## 7) Riesgos y mitigacion

- Token expuesto: nunca commitear `.env.local`; usar placeholders en docs.
- Slug duplicado: sufijo `-{CODIGO}` + `_id` deterministico elimina colisiones.
- Orden incorrecto de imagenes: ordenar numericamente (no alfabetico) y exigir foto 1.
- Categoria fuera del dropdown: normalizar a lista permitida; si no calza, dejar vacio.
- Campos faltantes que degradan UI (transmision/combustible): si el Excel no los trae, el sitio mostrara `N/A` y filtros tendran menos utilidad; considerar agregar columnas extra antes del import o completar luego en Studio.
- Rollback: al usar `_id` fijo, re-ejecutar corrige; para borrar masivo, se puede listar por prefijo `_id` (`vehicle-`) y eliminar (documentado en el doc base).

---

## 8) Apendices

### 8.1 Ejemplo de fila (CSV) y objeto normalizado (manifest)

Ejemplo CSV (headers reales del Excel):
```csv
ESTADO,CODIGO,FECHA PUBLICACION,CATEGORIA,MARCA,MODELO,VERSION,DESCRIPCION,PATENTE,AÑO,KMS,PRECIO
PUBLICAR,12,2026-01-10,SUV,Toyota,RAV4,2.0 Lujo,"Impecable estado",AB-CD12,2021,45000,17990000
```

Ejemplo manifest (1 vehiculo):
```json
{
  "codigo": 12,
  "estado": "PUBLICAR",
  "sanity": {
    "_type": "vehicle",
    "_id": "vehicle-12",
    "name": "Toyota RAV4 2.0 Lujo 2021",
    "slug": { "_type": "slug", "current": "toyota-rav4-2-0-lujo-2021-12" },
    "brand": "Toyota",
    "model": "RAV4",
    "version": "2.0 Lujo",
    "year": 2021,
    "price": 17990000,
    "mileage": 45000,
    "category": "SUV",
    "plate": "ABCD12",
    "description": "Impecable estado"
  },
  "imagesOrdered": [
    "...\\autos\\12\\1.jpg",
    "...\\autos\\12\\2.jpg",
    "...\\autos\\12\\3.jpg"
  ]
}
```

### 8.2 Recordatorio: como debe quedar `images[]` en Sanity
Orden final deseado:
- `images[0]` = upload de `1.(ext)`
- `images[1]` = upload de `2.(ext)`
- ...

Esto es lo que consume la web via GROQ (`"images": images[].asset->url`) y lo que determina la imagen principal en `lib/vehicles.ts`.
