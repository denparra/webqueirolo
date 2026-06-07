# Bulk Vehicle Import Strategy
## Importación Masiva de 24+ Vehículos con Fotos

**Fecha**: 2026-01-22
**Proyecto**: Automotora BOTH
**Sanity Project ID**: `4124jngl`
**Dataset**: `production`

---

## 1. ANÁLISIS DEL SCHEMA ACTUAL

### 1.1 Campos Obligatorios (Required)
| Campo | Tipo | Validación |
|-------|------|------------|
| `name` | string | Required |
| `slug` | slug | Required (source: name) |
| `price` | number | Required, min: 0 |
| `images` | array[image] | Required, min: 1 |
| `brand` | string | Required |
| `model` | string | Required |
| `year` | number | Required, min: 1990, max: 2030 |

### 1.2 Campos Opcionales Importantes
| Campo | Tipo | Opciones Válidas |
|-------|------|------------------|
| `version` | string | Libre |
| `status` | string | `available`, `reserved`, `sold` |
| `category` | string | `SUV`, `Camioneta`, `Sedán`, `Hatchback`, `Coupé`, `Convertible`, `Comercial`, `Moto` |
| `fuel` | string | `Bencina`, `Diésel`, `Híbrido`, `Eléctrico`, `Gas` |
| `transmission` | string | `Automática`, `Manual` |
| `mileage` | number | Kilometraje |
| `doors` | number | Puertas |
| `color` | string | Libre |
| `bodyType` | string | Libre |
| `plate` | string | Patente (interno) |
| `description` | text | Descripción larga |
| `isFeatured` | boolean | Destacado en home |

### 1.3 Campos de Features (Arrays de strings)
- `comfortFeatures`: Array de valores predefinidos (aire_acondicionado, cuero, etc.)
- `safetyFeatures`: Array de valores predefinidos (4x4, airbag_conductor, etc.)
- `entertainmentFeatures`: Array de valores predefinidos (bluetooth, android_auto, etc.)
- `otherFeatures`: Array de valores predefinidos (gps, llantas, etc.)

---

## 2. COMPARACIÓN DE MÉTODOS DE IMPORTACIÓN

### 2.1 Opción A: Sanity Studio Manual

| Aspecto | Evaluación |
|---------|------------|
| **Tiempo estimado** | ~15-20 min/vehículo = 6-8 horas para 24 |
| **Complejidad** | Baja |
| **Riesgo de errores** | Medio (typos, inconsistencias) |
| **Manejo de imágenes** | Drag & drop nativo |
| **Escalabilidad** | ❌ No viable para +50 vehículos |

**Pros**:
- Sin conocimientos técnicos
- Validación en tiempo real
- Hotspot de imágenes disponible

**Contras**:
- Muy lento para 24+ vehículos
- Propenso a inconsistencias
- Sin backup del proceso

---

### 2.2 Opción B: CSV → NDJSON + `sanity dataset import`

| Aspecto | Evaluación |
|---------|------------|
| **Tiempo estimado** | 2-3 horas (preparación + ejecución) |
| **Complejidad** | Media |
| **Riesgo de errores** | Bajo (validación previa) |
| **Manejo de imágenes** | ⚠️ Requiere URLs públicas o upload separado |
| **Escalabilidad** | ✅ Excelente |

**Flujo**:
```
Excel/CSV → Script conversión → NDJSON → sanity dataset import
```

**Pros**:
- Datos estructurados y revisables
- Import atómico
- Fácil rollback

**Contras**:
- Imágenes requieren estar en URL pública primero
- O se suben manualmente después

---

### 2.3 Opción C: Node Script con @sanity/client 🏆 RECOMENDADO

| Aspecto | Evaluación |
|---------|------------|
| **Tiempo estimado** | 3-4 horas (desarrollo) + minutos (ejecución) |
| **Complejidad** | Media-Alta |
| **Riesgo de errores** | Muy bajo (validación programática) |
| **Manejo de imágenes** | ✅ Upload directo desde carpeta local |
| **Escalabilidad** | ✅ Excelente, reutilizable |

**Flujo**:
```
CSV/JSON + Carpeta Fotos → Script Node → Sanity API (documents + assets)
```

**Pros**:
- Upload de imágenes desde disco local
- Validación completa antes de subir
- Logs de progreso y errores
- Reutilizable para futuras importaciones
- Genera slugs automáticamente
- Control total del proceso

**Contras**:
- Requiere desarrollo inicial
- Necesita token de API con permisos de escritura

---

## 3. ESTRATEGIA RECOMENDADA: Script Node.js

### 3.1 Justificación
Para 24+ vehículos con múltiples fotos cada uno, el script es la única opción que:
1. Sube imágenes locales directamente
2. Mantiene consistencia de datos
3. Es reutilizable para futuras cargas
4. Permite validación previa
5. Genera logs de auditoría

### 3.2 Arquitectura del Script

```
scripts/
├── import-vehicles/
│   ├── index.ts              # Script principal
│   ├── validate.ts           # Validación de datos
│   ├── upload-images.ts      # Subida de imágenes
│   └── create-documents.ts   # Creación de documentos
├── data/
│   └── vehicles.csv          # Datos de vehículos
└── images/
    ├── ford-f150-2022/
    │   ├── 01-exterior-frontal.jpg
    │   ├── 02-exterior-lateral.jpg
    │   └── 03-interior.jpg
    └── toyota-rav4-2023/
        ├── 01-exterior.jpg
        └── 02-interior.jpg
```

---

## 4. FORMATO DE DATOS REQUERIDO

### 4.1 Estructura CSV
```csv
name,brand,model,version,year,price,mileage,fuel,transmission,category,color,doors,status,isFeatured,comfortFeatures,safetyFeatures,entertainmentFeatures,otherFeatures,description,imageFolder
"Ford F-150 3.5 Platinum 2022",Ford,F-150,3.5 PLATINUM AUTO ECOBOOST 4WD,2022,45990000,15000,Bencina,Automática,Camioneta,Blanco,4,available,true,"cuero,climatizador,asientos_calefaccionados","4x4,airbag_conductor,airbag_acompanante,frenos_abs","android_auto,apple_carplay,bluetooth","llantas,gps","Impecable estado, único dueño",ford-f150-2022
```

### 4.2 Convención de Nombres para Imágenes

**Estructura de carpetas**:
```
images/
└── {slug-simplificado}/
    ├── 01-{descripcion}.jpg    # Primera imagen = principal
    ├── 02-{descripcion}.jpg
    └── ...
```

**Ejemplos**:
```
ford-f150-2022/
├── 01-exterior-frontal.jpg     ← Imagen principal
├── 02-exterior-lateral.jpg
├── 03-exterior-trasera.jpg
├── 04-interior-dashboard.jpg
├── 05-interior-asientos.jpg
└── 06-motor.jpg

toyota-rav4-2023/
├── 01-frontal.jpg
├── 02-lateral.jpg
└── 03-interior.jpg
```

**Reglas**:
- Prefijo numérico `01-`, `02-`, etc. define el orden
- Primera imagen (`01-`) será la imagen principal
- Nombres descriptivos para referencia
- Formatos aceptados: `.jpg`, `.jpeg`, `.png`, `.webp`
- Resolución recomendada: 1920x1080 o mayor
- Tamaño máximo por imagen: 12MB

---

## 5. PLAN DE EJECUCIÓN PASO A PASO

### Fase 1: Preparación de Datos (1-2 horas)

#### Paso 1.1: Crear archivo CSV
```bash
# Crear estructura
mkdir -p scripts/import-vehicles/data
touch scripts/import-vehicles/data/vehicles.csv
```

#### Paso 1.2: Completar CSV con datos de los 24 vehículos
- Usar Excel/Google Sheets para mayor comodidad
- Validar que todos los campos obligatorios estén completos
- Usar valores exactos de los dropdowns (case-sensitive)

#### Paso 1.3: Organizar imágenes
```bash
mkdir -p scripts/import-vehicles/images
# Crear subcarpetas por vehículo con convención de nombres
```

### Fase 2: Configuración (30 min)

#### Paso 2.1: Crear token de API
1. Ir a [manage.sanity.io](https://manage.sanity.io)
2. Seleccionar proyecto `4124jngl`
3. Settings → API → Tokens
4. Add API Token:
   - Name: `bulk-import-script`
   - Permissions: `Editor` (necesita write)
5. Guardar token en `.env.local`:
```env
SANITY_API_TOKEN=sk...
```

#### Paso 2.2: Instalar dependencias
```bash
npm install @sanity/client csv-parse slugify dotenv
# O para TypeScript:
npm install -D @types/node tsx
```

### Fase 3: Desarrollo del Script (2-3 horas)

#### Paso 3.1: Script principal
El script debe:
1. Leer CSV
2. Validar datos contra schema
3. Para cada vehículo:
   - Subir imágenes y obtener asset IDs
   - Generar slug desde name
   - Crear documento con referencias a imágenes
4. Reportar progreso y errores

### Fase 4: Validación y Ejecución (1 hora)

#### Paso 4.1: Dry-run (sin escribir)
```bash
npx tsx scripts/import-vehicles/index.ts --dry-run
```

#### Paso 4.2: Importar a dataset de prueba
```bash
# Crear dataset de prueba primero
npx sanity dataset create staging
npx tsx scripts/import-vehicles/index.ts --dataset staging
```

#### Paso 4.3: Verificar en Studio
- Abrir `/studio`
- Revisar 3-5 vehículos aleatorios
- Verificar imágenes, campos, features

#### Paso 4.4: Importar a producción
```bash
npx tsx scripts/import-vehicles/index.ts --dataset production
```

---

## 6. CHECKLIST DE VALIDACIÓN

### Pre-Import
- [ ] CSV tiene todos los campos obligatorios
- [ ] Valores de dropdowns son exactos (case-sensitive)
- [ ] Cada vehículo tiene carpeta de imágenes
- [ ] Al menos 1 imagen por vehículo (01-*.jpg)
- [ ] Imágenes nombradas con prefijo numérico
- [ ] Token de API creado con permisos de Editor
- [ ] Dataset de prueba (staging) creado

### Post-Import
- [ ] Cantidad de documentos creados coincide
- [ ] Imágenes se muestran correctamente
- [ ] Slugs generados son únicos y válidos
- [ ] Features arrays contienen valores correctos
- [ ] Frontend `/vehiculos` muestra los nuevos
- [ ] Detalle de vehículo carga correctamente

---

## 7. ESTRUCTURA DE CÓDIGO DEL SCRIPT

### 7.1 Pseudocódigo Principal

```typescript
// scripts/import-vehicles/index.ts

import { createClient } from '@sanity/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import slugify from 'slugify'

const client = createClient({
  projectId: '4124jngl',
  dataset: process.env.DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function importVehicles() {
  // 1. Leer CSV
  const csvContent = fs.readFileSync('data/vehicles.csv', 'utf-8')
  const records = parse(csvContent, { columns: true })

  // 2. Procesar cada vehículo
  for (const record of records) {
    console.log(`Processing: ${record.name}`)

    // 3. Subir imágenes
    const imageFolder = path.join('images', record.imageFolder)
    const imageFiles = fs.readdirSync(imageFolder)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort()

    const imageAssets = []
    for (const file of imageFiles) {
      const filePath = path.join(imageFolder, file)
      const asset = await client.assets.upload('image',
        fs.createReadStream(filePath),
        { filename: file }
      )
      imageAssets.push({
        _type: 'image',
        _key: `img-${imageAssets.length}`,
        asset: { _type: 'reference', _ref: asset._id }
      })
    }

    // 4. Crear documento
    const slug = slugify(record.name, { lower: true, strict: true })

    const doc = {
      _type: 'vehicle',
      name: record.name,
      slug: { _type: 'slug', current: slug },
      brand: record.brand,
      model: record.model,
      version: record.version || undefined,
      year: parseInt(record.year),
      price: parseInt(record.price),
      mileage: record.mileage ? parseInt(record.mileage) : undefined,
      fuel: record.fuel || undefined,
      transmission: record.transmission || undefined,
      category: record.category || undefined,
      color: record.color || undefined,
      doors: record.doors ? parseInt(record.doors) : undefined,
      status: record.status || 'available',
      isFeatured: record.isFeatured === 'true',
      description: record.description || undefined,
      images: imageAssets,
      comfortFeatures: parseFeatures(record.comfortFeatures),
      safetyFeatures: parseFeatures(record.safetyFeatures),
      entertainmentFeatures: parseFeatures(record.entertainmentFeatures),
      otherFeatures: parseFeatures(record.otherFeatures)
    }

    await client.create(doc)
    console.log(`✅ Created: ${record.name}`)
  }
}

function parseFeatures(str: string): string[] | undefined {
  if (!str) return undefined
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

importVehicles().catch(console.error)
```

---

## 8. CONSIDERACIONES DE ROLLBACK

### Si algo sale mal durante la importación:

#### Opción 1: Eliminar por query
```groq
// En Vision tool del Studio
*[_type == "vehicle" && _createdAt > "2026-01-22T00:00:00Z"]
```
```bash
# Eliminar con CLI
npx sanity documents delete $(npx sanity documents query '*[_type == "vehicle" && _createdAt > "2026-01-22T00:00:00Z"]._id')
```

#### Opción 2: Restaurar dataset desde backup
```bash
# Sanity mantiene backups automáticos
# Contactar soporte o usar manage.sanity.io
```

#### Opción 3: Script de cleanup
```typescript
// Agregar _id tracking durante import
const createdIds = []
// ... durante import
createdIds.push(result._id)
// ... si falla
for (const id of createdIds) {
  await client.delete(id)
}
```

---

## 9. TIMELINE ESTIMADO

| Fase | Duración | Acumulado |
|------|----------|-----------|
| Preparar CSV | 1-2 horas | 2 horas |
| Organizar imágenes | 1-2 horas | 4 horas |
| Crear token API | 15 min | 4.25 horas |
| Desarrollar script | 2-3 horas | 7 horas |
| Testing (staging) | 30 min | 7.5 horas |
| Import producción | 15 min | 7.75 horas |
| Verificación final | 30 min | **8 horas total** |

---

## 10. ALTERNATIVA SIMPLIFICADA

Si el tiempo para desarrollar el script es limitado, existe una **opción híbrida**:

### CSV + NDJSON + Imágenes manuales

1. Crear CSV sin columna imageFolder
2. Convertir a NDJSON con script simple
3. Importar documentos: `sanity dataset import vehicles.ndjson`
4. Subir imágenes manualmente en Studio (drag & drop)

**Tiempo**: ~4-5 horas total
**Desventaja**: Las imágenes se suben manualmente

---

## 11. RECOMENDACIÓN FINAL

**Para 24+ vehículos con fotos: Script Node.js con @sanity/client**

Razones:
1. ✅ Sube imágenes desde carpeta local
2. ✅ Validación automática de datos
3. ✅ Reutilizable para futuras cargas
4. ✅ Logs de auditoría completos
5. ✅ Control total del proceso
6. ✅ Rollback programático si falla

El tiempo de desarrollo inicial (2-3 horas) se amortiza con:
- Consistencia de datos garantizada
- Capacidad de repetir el proceso
- Menor riesgo de errores humanos
- Documentación del proceso en código

---

**Documento generado para análisis READ-ONLY**
**Siguiente paso**: Decisión del usuario sobre método a implementar
