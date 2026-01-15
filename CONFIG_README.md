# Guía de Configuración de la Empresa

Este documento explica cómo adaptar el sitio web a otra empresa modificando únicamente el archivo de configuración centralizado.

## Archivo de Configuración

**Ubicación:** `config.js` (en la raíz del proyecto)

Este archivo contiene toda la información clave de la empresa que se utiliza en todo el sitio web.

## Cómo Adaptar el Sitio a Otra Empresa

Para adaptar este sitio web a otra empresa, sigue estos pasos:

### 1. Editar el archivo `config.js`

Abre el archivo `config.js` y modifica los siguientes valores:

#### Información de la Empresa
```javascript
company: {
  name: 'Nombre de tu Empresa',           // Nombre corto
  fullName: 'Nombre Completo de la Empresa', // Nombre completo
  tagline: 'Tu descripción de la empresa...', // Descripción breve
}
```

#### Información de Contacto
```javascript
contact: {
  address: {
    street: 'Tu dirección completa',
    city: 'Tu ciudad',
    fullAddress: 'Dirección completa con ciudad',
    displayAddress: 'Formato para mostrar en el sitio',
  },
  phone1: '+56 X XXXX-XXXX',           // Teléfono principal
  phone2: '+56 X XXXX-XXXX',           // Teléfono secundario
  whatsapp: '+56XXXXXXXXX',            // WhatsApp (sin espacios)
  whatsappDisplay: '+56 X XXXX XXXX',  // WhatsApp (formato visual)
  email: 'contacto@tuempresa.cl',      // Email de contacto
}
```

#### Redes Sociales
```javascript
social: {
  instagram: 'https://www.instagram.com/tuempresa',
  facebook: 'https://www.facebook.com/tuempresa',  // Opcional
  twitter: 'https://twitter.com/tuempresa',        // Opcional
  linkedin: 'https://linkedin.com/company/tuempresa', // Opcional
}
```

#### Horarios de Atención
```javascript
businessHours: {
  weekdays: 'Lun-Vie: 9:00-18:00',
  saturday: 'Sáb: 10:00-14:00',
  sunday: 'Cerrado',
  weekdaysDetailed: 'Lun-Vie: 9:00 - 18:00',
  saturdayDetailed: 'Sábado: 10:00 - 14:00',
}
```

#### Logos
```javascript
logos: {
  white: '/images/logo/TU_LOGO_BLANCO.png',  // Logo para fondos oscuros
  black: '/images/logo/TU_LOGO_NEGRO.png',   // Logo para fondos claros
}
```

**Importante:** Asegúrate de colocar tus logos en la carpeta `public/images/logo/` con los nombres especificados.

### 2. Reemplazar los Logos

1. Coloca tu logo con letras blancas en: `public/images/logo/LOGOLETRASBLANCASINFONDO.png`
2. Coloca tu logo con letras negras en: `public/images/logo/LOGOLETRASNEGRASINFONDO.png`

O actualiza las rutas en el archivo `config.js` si usas nombres diferentes.

### 3. Actualizar SEO (Opcional)

Si deseas personalizar el SEO, edita la sección `seo` en `config.js`:

```javascript
seo: {
  title: 'Tu Empresa - Título SEO',
  description: 'Descripción para motores de búsqueda',
  keywords: 'palabras, clave, relevantes',
}
```

## Componentes que Usan la Configuración

Los siguientes componentes y páginas utilizan automáticamente los valores del archivo `config.js`:

### Componentes de Layout
- ✅ `components/layout/Navbar.tsx` - Barra de navegación
- ✅ `components/layout/Footer.tsx` - Pie de página
- ✅ `components/layout/MobileNav.tsx` - Menú móvil

### Componentes Compartidos
- ✅ `components/shared/WhatsAppButton.tsx` - Botón flotante de WhatsApp

### Páginas
- ✅ `app/page.tsx` - Página de inicio
- ✅ `app/servicios/page.tsx` - Página de servicios
- ✅ `app/vehiculos/[slug]/page.tsx` - Página de detalle de vehículo
- ✅ `app/layout.tsx` - Layout principal

### Configuración
- ✅ `lib/seo.ts` - Configuración SEO y Schema.org

## Verificación

Después de realizar los cambios:

1. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Verifica los siguientes elementos:**
   - [ ] El nombre de la empresa aparece correctamente en el navbar y footer
   - [ ] Los números de teléfono y WhatsApp funcionan correctamente
   - [ ] La dirección se muestra correctamente
   - [ ] Los horarios de atención son correctos
   - [ ] Los logos se muestran apropiadamente según el fondo
   - [ ] Los enlaces a redes sociales funcionan
   - [ ] El botón flotante de WhatsApp abre con el número correcto

## Notas Importantes

- **No modifiques los componentes directamente** - Todos los valores se toman del archivo `config.js`
- **Formato de WhatsApp:** El número de WhatsApp debe estar sin espacios ni guiones en `whatsapp`, pero con formato legible en `whatsappDisplay`
- **Logos:** Usa el logo blanco en fondos oscuros y el logo negro en fondos claros para mejor visibilidad
- **Rutas de logos:** Las rutas deben comenzar con `/images/` (relativas a la carpeta `public`)

## Soporte

Si necesitas ayuda adicional para personalizar el sitio, revisa los archivos mencionados o contacta al desarrollador.
