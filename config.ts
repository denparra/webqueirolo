/**
 * CONFIGURACIÓN GENERAL DE LA EMPRESA
 * 
 * Este archivo centraliza toda la información clave de la empresa.
 * Para adaptar el sitio web a otra empresa, simplemente modifica los valores aquí.
 */

const siteConfig = {
    // Información de la empresa
    company: {
        name: 'Queirolo Autos',
        fullName: 'Queirolo Autos',
        tagline: 'Vehículos seminuevos certificados con financiamiento directo y sin complicaciones. Desde Las Condes para todo Chile.',
    },

    // Información de contacto
    contact: {
        address: {
            street: 'Av. Las Condes 12461, L4. ShowRoom -3',
            city: 'Las Condes',
            fullAddress: 'Av. Las Condes 12461, L4. ShowRoom -3, Las Condes',
            displayAddress: 'Av. Las Condes 12461, Las Condes, Santiago', // Formato para mostrar
            coordinates: {
                lat: -33.4128,
                lng: -70.5772,
            },
        },
        phone1: '+56 2 4367-0362',
        phone2: '+56 9 7214-9979',
        whatsapp: '+56972149979', // Sin espacios ni guiones para URLs
        whatsappDisplay: '+56 9 7214 9979', // Formato para mostrar
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
        weekdays: 'Lun-Vie: 9:30-18:00',
        saturday: 'Previa Cita',
        sunday: 'Cerrado',
        weekdaysDetailed: 'Lun-Vie: 9:30 - 18:00',
        saturdayDetailed: 'Previa Cita',
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
        terms: '/terminos',
    },

    // Mensajes predeterminados
    messages: {
        whatsappDefault: 'Hola, me interesa información sobre vehículos',
        whatsappVehicle: (brand: string, model: string) => `Hola, me interesa el ${brand} ${model}`,
    },

    // SEO y metadatos
    seo: {
        title: 'Queirolo Autos - Vehículos Seminuevos Certificados',
        description: 'Vehículos seminuevos certificados con financiamiento directo y sin complicaciones. Desde Las Condes para todo Chile.',
        keywords: 'vehículos seminuevos, autos usados, financiamiento directo, Las Condes, Chile, 4x4',
    },
}

export default siteConfig
