# Setup: Configuracion y Tokens para el Sistema de Reservas

**Enfoque**: Opcion B + C — Formulario custom + API Route + Resend + Sanity CMS
**Proyecto**: Queirolo Autos (Next.js 14)
**Prerequisito**: Tener el proyecto corriendo con `npm run dev`

---

## Resumen: que necesitas obtener

Antes de escribir una sola linea de codigo, necesitas estos 3 elementos:

| # | Que | De donde | Variable en `.env.local` |
|---|-----|---------|--------------------------|
| 1 | Sanity Write Token | manage.sanity.io | `SANITY_API_TOKEN` |
| 2 | Resend API Key | resend.com | `RESEND_API_KEY` |
| 3 | Dominio verificado en Resend | DNS de tu dominio | Habilita `FROM_EMAIL` |

Tiempo estimado para obtener todo: **30-45 minutos**.

---

## PASO 1 — Token de escritura en Sanity

El cliente de Sanity que ya existe en el proyecto (`lib/sanity.ts`) solo tiene permisos de **lectura**. Para guardar reservas necesitas un token con permisos de escritura.

### 1.1 Crear el token

1. Ve a [manage.sanity.io](https://manage.sanity.io)
2. Selecciona tu proyecto (el de Queirolo Autos)
3. En el menu lateral izquierdo → **API**
4. Click en la pestana **Tokens**
5. Click en **Add API token**
6. Rellena el formulario:
   - **Name**: `reservas-write-token` (o cualquier nombre descriptivo)
   - **Permissions**: seleccionar **Editor**
     - *No uses "Administrator" por principio de minimo privilegio*
     - *No uses "Viewer" porque no tiene permisos de escritura*
7. Click **Save**
8. **COPIA EL TOKEN AHORA** — Sanity solo lo muestra una vez

El token tiene este formato: `sk...` (empieza con `sk`, luego letras y numeros, aprox 80 caracteres).

### 1.2 Agregar al proyecto

Abre (o crea) el archivo `.env.local` en la raiz del proyecto y agrega:

```env
# Token de escritura para Sanity - NO compartir, NO subir a git
SANITY_API_TOKEN=skTu_token_aqui
```

### 1.3 Verificar que `.env.local` esta en `.gitignore`

```bash
# Desde la raiz del proyecto
grep ".env.local" .gitignore
```

Si no aparece nada, agregar la linea `.env.local` al `.gitignore` **antes de hacer commit**.

### 1.4 Verificar el token (opcional pero recomendado)

Puedes hacer una prueba rapida en la terminal para confirmar que el token funciona y tiene acceso al dataset correcto:

```bash
# Reemplaza TU_PROJECT_ID, TU_DATASET y TU_TOKEN con los valores reales
curl "https://TU_PROJECT_ID.api.sanity.io/v2026-01-16/data/query/TU_DATASET?query=*[_type == 'vehicle'][0..0]" \
  -H "Authorization: Bearer TU_TOKEN"
```

Si devuelve `{"ms":...,"query":"...","result":[...]}` el token funciona.

---

## PASO 2 — Cuenta y API Key de Resend

Resend es el servicio de emails. Tier gratuito: **3.000 emails/mes, 100/dia**.

### 2.1 Crear cuenta

1. Ve a [resend.com](https://resend.com)
2. Click **Get Started** → registrarse con tu email o GitHub
3. Confirma el email de verificacion

### 2.2 Crear la API Key

1. En el dashboard de Resend, ve a **API Keys** (menu lateral)
2. Click **Create API Key**
3. Rellena:
   - **Name**: `queirolo-reservas`
   - **Permission**: `Full access` (para poder enviar emails)
   - **Domain**: puede quedar en "All domains" por ahora
4. Click **Add**
5. **COPIA LA API KEY AHORA** — Resend tampoco la vuelve a mostrar

El formato es: `re_...` (empieza con `re_`, luego caracteres, aprox 40 caracteres).

### 2.3 Agregar al proyecto

```env
# Resend API Key - NO compartir, NO subir a git
RESEND_API_KEY=re_Tu_api_key_aqui
```

---

## PASO 3 — Verificar el dominio en Resend

Para enviar emails desde `reservas@queiroloautos.cl` (o el dominio real), Resend necesita verificar que eres dueno del dominio. Esto previene que tu dominio sea marcado como spam.

**Importante**: Si aun no tienes dominio propio, puedes saltar este paso y usar el dominio de prueba de Resend (`@resend.dev`) temporalmente para desarrollo.

### 3.1 Agregar tu dominio

1. En Resend → **Domains** (menu lateral)
2. Click **Add Domain**
3. Escribe tu dominio: `queiroloautos.cl` (solo el dominio, sin www ni https)
4. Click **Add**

Resend te mostrara varios **registros DNS** que debes agregar en tu proveedor de dominio.

### 3.2 Agregar registros DNS

Los registros que Resend pide son tipicamente:

| Tipo | Nombre | Valor |
|------|--------|-------|
| MX | `resend._domainkey` | (valor que da Resend) |
| TXT | `resend._domainkey` | `v=DKIM1; k=rsa; p=...` |
| TXT | `_dmarc` | `v=DMARC1; p=none;` |

**Donde agregar los registros segun tu proveedor de dominio**:

- **GoDaddy**: Dominios → DNS → Administrar zonas DNS
- **Namecheap**: Domain List → Manage → Advanced DNS
- **NIC.cl** (dominio .cl chileno): Panel de administracion → Zona DNS
- **Cloudflare**: DNS → Records → Add record

### 3.3 Verificar propagacion

La propagacion DNS puede tardar entre 5 minutos y 24 horas.

1. Volver a Resend → **Domains**
2. El estado cambia de `Pending` a `Verified` cuando los registros propagaron
3. Puedes tambien verificar con: [dnschecker.org](https://dnschecker.org) buscando el registro TXT

### 3.4 Alternativa rapida: usar dominio de prueba de Resend

Mientras esperas la verificacion, puedes usar el dominio de prueba para desarrollo:

```env
# Para desarrollo/pruebas (emails solo llegan a tu cuenta de Resend)
FROM_EMAIL=onboarding@resend.dev
```

Con este FROM_EMAIL los emails funcionan en pruebas pero en produccion debes usar tu dominio verificado.

---

## PASO 4 — Completar `.env.local`

Tu archivo `.env.local` completo debe quedar asi:

```env
# === SANITY CMS (ya existentes) ===
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id_de_sanity
NEXT_PUBLIC_SANITY_DATASET=production

# === NUEVO: Token de escritura Sanity ===
# Obtenido en manage.sanity.io → API → Tokens → Editor
SANITY_API_TOKEN=skTu_token_aqui

# === NUEVO: Resend - Servicio de emails ===
# Obtenido en resend.com → API Keys
RESEND_API_KEY=re_Tu_api_key_aqui

# === NUEVO: Configuracion de emails ===
# Email que RECIBE las notificaciones de nuevas reservas (tu email o del equipo de ventas)
ADMIN_EMAIL=ventas@queiroloautos.cl

# Email DESDE el que se envian los correos (debe estar en dominio verificado en Resend)
# Durante desarrollo puedes usar: onboarding@resend.dev
FROM_EMAIL=reservas@queiroloautos.cl
```

**Verificacion rapida**: Despues de guardar, reinicia el servidor de desarrollo:

```bash
# Detener con Ctrl+C, luego:
npm run dev
```

Las variables de entorno que NO empiezan con `NEXT_PUBLIC_` solo se cargan del lado del servidor, lo cual es correcto para tokens y API keys.

---

## PASO 5 — Instalar dependencias nuevas

El proyecto ya tiene `zod` (usado en `app/api/submit-lead/route.ts`). Las que faltan son:

```bash
npm install resend react-hook-form @hookform/resolvers
```

Paquetes instalados:
- `resend` — cliente oficial de Resend para Node.js
- `react-hook-form` — manejo de formularios con validacion
- `@hookform/resolvers` — adaptador para usar `zod` con `react-hook-form`

Verificar que se instalaron:

```bash
# Debe mostrar las versiones instaladas
npm list resend react-hook-form @hookform/resolvers
```

---

## PASO 6 — Registrar el schema de Reserva en Sanity

El proyecto usa `next-sanity`. El schema index esta en `sanity/schemaTypes/index.ts` con este formato:

```typescript
// Archivo actual: sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import vehicle from './vehicle'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [vehicle],
}
```

Despues de crear el archivo `sanity/schemaTypes/reserva.ts` (ver guia principal), actualizarlo asi:

```typescript
// Archivo modificado: sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import vehicle from './vehicle'
import reserva from './reserva'  // <-- agregar esta linea

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [vehicle, reserva],  // <-- agregar reserva aqui
}
```

**Nota**: El archivo `reserva.ts` debe usar `export default` para ser consistente con el patron del proyecto (ver como `vehicle.ts` exporta con `export default`).

---

## PASO 7 — Crear el cliente Sanity con token de escritura

Para la API route de reservas necesitas un cliente con el token de escritura. No modifiques el cliente existente en `lib/sanity.ts` (ese es de solo lectura para el frontend). Crea uno especifico para escritura en la API route:

```typescript
// Dentro de app/api/agendar-visita/route.ts
import { createClient } from 'next-sanity'

// Cliente exclusivo para escritura - NUNCA usar en componentes del lado del cliente
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-01-16',
  token: process.env.SANITY_API_TOKEN,  // Token de escritura
  useCdn: false,  // IMPORTANTE: false para escritura, siempre
})
```

Por que `useCdn: false` para escritura:
- El CDN de Sanity es una cache de solo lectura
- Las escrituras deben ir directamente a la API, no a la cache
- Si usas `useCdn: true` con escritura, las operaciones de `create` fallaran

---

## PASO 8 — Verificar el flujo completo

Antes de integrar en la UI, probar la API route directamente:

### 8.1 Iniciar el servidor en desarrollo

```bash
npm run dev
```

### 8.2 Probar con curl o cliente HTTP

```bash
curl -X POST http://localhost:3000/api/agendar-visita \
  -H "Content-Type: application/json" \
  -d '{
    "nombreCliente": "Test Cliente",
    "telefono": "+56912345678",
    "email": "tu_email_real@gmail.com",
    "fechaVisita": "2026-03-15",
    "horario": "11:00",
    "comentario": "Prueba del sistema",
    "vehiculoNombre": "Toyota Hilux 2022"
  }'
```

**Respuesta esperada si todo funciona**:
```json
{"success": true, "message": "Visita agendada correctamente"}
```

**Respuestas de error comunes y su causa**:

| Error | Causa probable | Solucion |
|-------|---------------|----------|
| `401 Unauthorized` | Token de Sanity invalido o sin permisos | Verificar `SANITY_API_TOKEN` en `.env.local` |
| `403 Forbidden` | Token de Sanity es Viewer, no Editor | Crear nuevo token con rol Editor |
| `Error sending email` | API Key de Resend invalida | Verificar `RESEND_API_KEY` |
| `Domain not verified` | Dominio `FROM_EMAIL` no verificado en Resend | Usar `onboarding@resend.dev` temporalmente |
| `500 Internal Server Error` | Ver logs en la terminal de `npm run dev` | Revisar consola para el error especifico |

### 8.3 Verificar en Sanity Studio

1. Ir a `http://localhost:3000/studio`
2. En el menu lateral buscar **Reservas / Visitas Agendadas**
3. Debe aparecer el documento de prueba creado

### 8.4 Verificar emails

- Revisar la bandeja de entrada del `ADMIN_EMAIL` — debe llegar la notificacion
- Revisar la bandeja del email que pusiste en la prueba — debe llegar la confirmacion
- Si usas `onboarding@resend.dev`, los emails se pueden ver en el dashboard de Resend → **Emails**

---

## PASO 9 — Configuracion adicional para produccion (deployment)

### Variables en Vercel (o tu proveedor de hosting)

Si el sitio esta en Vercel, las variables de `.env.local` NO se suben automaticamente. Debes agregarlas en el panel:

1. Ve a [vercel.com](https://vercel.com) → Tu proyecto
2. **Settings** → **Environment Variables**
3. Agregar una por una:
   - `SANITY_API_TOKEN` → valor del token
   - `RESEND_API_KEY` → valor de la key
   - `ADMIN_EMAIL` → email del vendedor
   - `FROM_EMAIL` → email verificado en Resend
4. Las variables `NEXT_PUBLIC_*` que ya existen deben seguir ahi
5. Hacer un nuevo deployment para que tomen efecto

### CORS en Sanity para produccion

Si aun no lo hiciste, agregar el dominio de produccion a Sanity CORS:

1. `manage.sanity.io` → Tu proyecto → **API** → **CORS Origins**
2. Click **Add CORS Origin**
3. Agregar `https://queiroloautos.cl` (tu dominio real, con https)
4. Marcar **Allow credentials**: Si
5. Click **Save**

**Nota**: El CORS de Sanity aplica a peticiones del navegador (lado del cliente). Las API routes de Next.js se ejecutan en el servidor, por lo que tecnicamente no requieren CORS para las escrituras. Pero es buena practica tenerlo configurado para lecturas del frontend.

---

## Resumen de archivos y variables

### Archivos nuevos a crear

```
sanity/schemaTypes/reserva.ts        # Schema del tipo "reserva"
app/api/agendar-visita/route.ts      # API route que procesa las reservas
components/forms/ReservaForm.tsx     # Componente del formulario
```

### Archivos existentes a modificar

```
sanity/schemaTypes/index.ts          # Agregar import y registro de reserva
app/vehiculos/[slug]/page.tsx        # Agregar boton "Agendar Visita" + Dialog
.env.local                           # Agregar las 4 nuevas variables
```

### Variables de entorno completas

```env
# Existentes (no cambiar)
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production

# Nuevas
SANITY_API_TOKEN=sk...          # manage.sanity.io → API → Tokens → Editor
RESEND_API_KEY=re_...           # resend.com → API Keys
ADMIN_EMAIL=ventas@...          # Email que recibe notificaciones
FROM_EMAIL=reservas@...         # Email verificado en Resend (o onboarding@resend.dev en dev)
```

### Dependencias nuevas

```bash
npm install resend react-hook-form @hookform/resolvers
# zod ya esta instalado en el proyecto
```

---

## Checklist de verificacion previa a implementar codigo

Antes de empezar a crear los archivos de codigo, confirmar que cada item tiene un checkmark:

- [ ] Token de Sanity creado con rol **Editor** y copiado en `.env.local`
- [ ] Cuenta de Resend creada y API Key copiada en `.env.local`
- [ ] `FROM_EMAIL` es un dominio verificado en Resend (o usar `onboarding@resend.dev` para pruebas)
- [ ] `ADMIN_EMAIL` tiene el email real donde quieres recibir notificaciones
- [ ] `npm install resend react-hook-form @hookform/resolvers` ejecutado sin errores
- [ ] `npm run dev` levanta sin errores despues de agregar las variables
- [ ] Test con `curl` a `/api/agendar-visita` devuelve `{"success": true}` (luego de crear la route)

Con estos 7 puntos verificados, la implementacion de codigo del sistema de reservas puede comenzar sin bloqueos de configuracion.

---

*Para el codigo completo de cada archivo ver: `claudedocs/06-Reservas/guia-implementacion-reservas.md`*
