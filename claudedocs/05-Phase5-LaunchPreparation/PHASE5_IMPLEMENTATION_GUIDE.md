# Phase 5: Launch Preparation - Implementation Guide

**Status:** 🔄 IN PROGRESS
**Timeframe:** Week 9-10
**Reference:** [FRONTEND_DESIGN_PROPOSAL.md](../00-Analysis-Planning/FRONTEND_DESIGN_PROPOSAL.md)

---

## Overview

Esta guía detalla el paso a paso para transformar el desarrollo actual en una aplicación lista para producción, integrando **Sanity.io** como CMS (Sistema de Gestión de Contenido) Headless. Esto permitirá a los propietarios administrar el inventario de vehículos, precios e imágenes desde un panel profesional sin tocar código.

**Objetivo:** Obtener lo mejor de dos mundos: la velocidad de un sitio estático (Next.js) + la flexibilidad de una base de datos con admin panel (Sanity.io).

---

## 🏗️ 1. Configuración de Sanity (El Backend)

El primer paso es crear el "cerebro" donde vivirán los datos de los autos.

### 1.1 Crear el Proyecto Sanity
Ejecuta este comando en la carpeta raíz de tu proyecto (`web/`). Esto creará una carpeta llamada `cms` que contendrá la configuración de tu panel de administración.

```bash
# En la raíz del proyecto (web/)
npm create sanity@latest -- --template clean --create-project "Queirolo Autos" --dataset production
```

**Respuestas a las preguntas del instalador:**
- **Output path:** `cms`
- **Use TypeScript?** Yes
- **PackageManager:** npm

### 1.2 Definir el Esquema del Vehículo
Ahora le diremos a Sanity qué información tiene un "Auto".

1.  Ve a la nueva carpeta: `web/cms/schemaTypes/`
2.  Crea un archivo llamado `vehicle.ts`
3.  Copia y pega este código:

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'vehicle',
  title: 'Vehículo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del Vehículo',
      type: 'string', // Ej: Toyota 4Runner
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (Slug)',
      type: 'slug',
      options: { source: 'name' }, // Genera la URL automáticamente desde el nombre
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Precio (CLP)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      validation: (Rule) => Rule.required().min(2000).max(2030),
    }),
    defineField({
      name: 'mileage',
      title: 'Kilometraje',
      type: 'number',
    }),
    defineField({
      name: 'transmission',
      title: 'Transmisión',
      type: 'string',
      options: {
        list: [
          { title: 'Automática', value: 'Automática' },
          { title: 'Manual', value: 'Manual' },
        ],
      },
    }),
    defineField({
      name: 'fuel',
      title: 'Combustible',
      type: 'string',
      options: {
        list: [
          { title: 'Bencina', value: 'Bencina' },
          { title: 'Diésel', value: 'Diésel' },
          { title: 'Híbrido', value: 'Híbrido' },
          { title: 'Eléctrico', value: 'Eléctrico' },
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Galería de Imágenes',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        layout: 'grid',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'features',
      title: 'Características (Equipamiento)',
      type: 'array',
      of: [{ type: 'string' }], // Lista simple: "Aire Acondicionado", "Cuero", etc.
    }),
    defineField({
      name: 'description',
      title: 'Descripción Detallada',
      type: 'text', // Campo de texto largo
    }),
    defineField({
      name: 'isFeatured',
      title: '¿Destacado en Home?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Disponible', value: 'available' },
          { title: 'Reservado', value: 'reserved' },
          { title: 'Vendido', value: 'sold' },
        ],
      },
      initialValue: 'available',
    }),
  ],
})
```

### 1.3 Registrar el Esquema
Abre `web/cms/schemaTypes/index.ts` y regístralo:

```typescript
import vehicle from './vehicle'

export const schemaTypes = [vehicle]
```

### 1.4 Ver el Panel Admin (Localmente)
Para probar que funciona:

```bash
cd cms
npm run dev
```
Entra a `http://localhost:3333` y verás tu panel. ¡Crea un auto de prueba!

---

## 🔗 2. Conectar la Web con Sanity (El Frontend)

Ahora haremos que la página web muestre los autos que creaste en el panel.

### 2.1 Instalar librerías en la web
Vuelve a la raíz (`cd ..`) y asegúrate de estar en `web/`.

```bash
npm install next-sanity @sanity/image-url
```

### 2.2 Configuración del Cliente
Crea el archivo `web/lib/sanity.ts`. Este archivo es el puente entre tu código y Sanity.

**Necesitarás tu Project ID:** Lo encuentras en el archivo `web/cms/sanity.cli.ts` o `sanity.config.ts`.

```typescript
// web/lib/sanity.ts
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Configuración
export const projectId = 'TU_PROJECT_ID_AQUI' // Copiar de cms/sanity.config.ts
export const dataset = 'production'
export const apiVersion = '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // False en desarrollo para ver cambios al instante
})

// Helper para las imágenes
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
```

### 2.3 Reemplazar Datos Estáticos por Dinámicos

Ahora modificamos `web/lib/vehicles.ts` para que ya no use datos falsos, sino que los pida a Sanity.

```typescript
// web/lib/vehicles.ts
import { client } from './sanity'
import { Vehicle } from '@/types/vehicle' // Asegúrate de tener este tipo definido

// Consulta GROQ (Lenguaje de consulta de Sanity)
export async function getVehicles() {
  const query = `*[_type == "vehicle"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    year,
    mileage,
    transmission,
    fuel,
    "images": images[].asset->url, // Trae las URLs de todas las imágenes
    features,
    description,
    isFeatured,
    status
  }`

  // ISR: Revalidar cada 60 segundos
  return await client.fetch(query, {}, { next: { revalidate: 60 } })
}

export async function getVehicleBySlug(slug: string) {
  const query = `*[_type == "vehicle" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    price,
    year,
    mileage,
    transmission,
    fuel,
    "images": images[].asset->url,
    features,
    description,
    status
  }`

  return await client.fetch(query, { slug }, { next: { revalidate: 60 } })
}
```

---

## 🚀 3. Despliegue (Production)

Para que el cliente final pueda usar el panel en internet.

### 3.1 Desplegar el Panel Admin (Studio)
Subiremos el panel a los servidores de Sanity (es gratis).

```bash
cd cms
npm run deploy
```
Te pedirá un nombre, por ejemplo: `queirolo-admin`.
Tu panel quedará disponible en: `https://queirolo-admin.sanity.studio`.
**¡Esta es la URL que le darás a tu cliente!**

### 3.2 Desplegar la Web (Vercel)
Cuando subas tu web a Vercel, necesitas configurar las **Variables de Entorno** si decidiste usarlas (aunque el `projectId` es público, es buena práctica).

1. Sube tu código a GitHub.
2. Conecta Vercel a tu repo.
3. Vercel detectará la app Next.js.
4. **IMPORTANTE:** Debes agregar el dominio de tu web (`https://tu-web.vercel.app`) en la configuración de **CORS** de tu proyecto en `manage.sanity.io` -> API -> CORS Origins. Si no haces esto, la web no tendrá permiso para pedir los autos.

---

## 📝 4. Lista de Tareas Final

### CMS
- [ ] Crear proyecto Sanity.
- [ ] Definir Schema `vehicle` completo.
- [ ] Probar creando 2-3 autos localmente.
- [ ] Desplegar Studio (`npm run deploy`).

### Frontend
- [ ] Instalar `next-sanity`.
- [ ] Configurar `lib/sanity.ts`.
- [ ] Reemplazar `features/vehicles` con consultas reales.
- [ ] Adaptar componentes (`VehicleCard`, `VehicleDetail`) para usar los datos de Sanity.
  - *Nota:* Asegúrate de usar `urlFor(image).width(800).url()` en el frontend para optimizar las fotos automáticamente.

### Configuración
- [ ] Agregar URL de Vercel a CORS en Sanity.io.

---

## 💡 Tips Pro

1.  **Imágenes Optimizadas:** Sanity nos permite pedir la imagen del tamaño exacto que necesitamos.
    En tu componente:
    ```tsx
    <Image 
      src={urlFor(vehicle.images[0]).width(400).height(300).url()} 
      alt={vehicle.name} 
      ... 
    />
    ```
    Esto hace que la web vuele, aunque el cliente suba una foto de 10MB.

2.  **Precios:** Guarda el precio como número puro (ej: `25000000`) en Sanity. Formatea a pesos (`$25.000.000`) en el frontend.

3.  **Filtrados:** Sanity es muy rápido filtrando. Puedes hacer filtros directamente en la consulta GROQ si el catálogo crece mucho (`*[_type == "vehicle" && price < 10000000]`).
