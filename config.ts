/**
 * CONFIGURACIÓN GENERAL DE LA EMPRESA
 * 
 * Este archivo centraliza toda la información clave de la empresa.
 * Para adaptar el sitio web a otra empresa, simplemente modifica los valores aquí.
 */

const siteConfig = {
    // URL canónica del sitio (host único, sin slash final)
    url: 'https://www.queirolo.cl',

    // Información de la empresa
    company: {
        name: 'Queirolo Autos',
        fullName: 'Queirolo Autos',
        tagline: 'Venta, consignación y más de 60 años acompañándote. Desde Lo Barnechea para todo Chile.',
    },

    // Información de contacto
    contact: {
        address: {
            // En búsqueda de local nuevo: referencia pública solo a la comuna (sin dirección exacta).
            street: '',
            city: 'Lo Barnechea',
            fullAddress: 'Lo Barnechea, Santiago',
            displayAddress: 'Lo Barnechea, Santiago', // Formato para mostrar
            coordinates: {
                // Zona referencial de Lo Barnechea (no dirección exacta).
                lat: -33.3496,
                lng: -70.5176,
            },
        },
        phone1: '+56 2 4367-0362',
        phone2: '+56 9 7214-9979',
        whatsapp: '+56972149979', // Sin espacios ni guiones para URLs
        whatsappDisplay: '+56 9 7214-9979', // Formato para mostrar
        email: 'contacto@queirolo.cl',
    },

    // Redes sociales
    social: {
        instagram: 'https://www.instagram.com/queiroloautos',
        facebook: '', // Agregar si existe
        twitter: '', // Agregar si existe
        linkedin: '', // Agregar si existe
    },

    // Horarios de atención
    businessHours: {
        weekdays: 'Lunes a Viernes: 09:30 - 18:00',
        saturday: 'Sábado: Con cita previa',
        sunday: 'Cerrado',
        weekdaysDetailed: 'Lunes a Viernes: 09:30 - 18:00',
        saturdayDetailed: 'Sábado: Con cita previa',
    },

    // Logos
    logos: {
        // Logo con letras blancas (usar en fondos oscuros)
        white: '/images/logo/LOGOLETRASBLANCASINFONDO.png',
        // Logo con letras negras (usar en fondos claros)
        black: '/images/logo/LOGOLETRASNEGRASINFONDO.png',
    },

    // URLs del sitio
    urls: {
        home: '/',
        vehicles: '/vehiculos',
        services: '/servicios',
        about: '/nosotros',
        contact: '/contacto',
        privacy: '/privacidad',
        terms: '/terminos-y-condiciones',
    },

    // Mensajes predeterminados
    messages: {
        whatsappDefault: 'Hola, me interesa información sobre vehículos',
        whatsappVehicle: (brand: string, model: string) => `Hola, me interesa el ${brand} ${model}`,
    },

    // SEO y metadatos
    seo: {
        title: 'Queirolo Autos - Venta de Vehículos Seminuevos en Lo Barnechea',
        description: 'Más de 60 años vendiendo autos con confianza. Venta, consignación y financiamiento en Lo Barnechea, Santiago. Visítanos sin compromiso.',
        keywords: 'vehículos seminuevos, autos usados, financiamiento con financieras, consignación, parte de pago, Lo Barnechea, Santiago, Chile',
    },
}

export default siteConfig
