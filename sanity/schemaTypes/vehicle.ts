import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'vehicle',
    title: 'Vehículo',
    type: 'document',
    fieldsets: [
        { name: 'main', title: 'Información Principal', options: { collapsible: true, collapsed: false } },
        { name: 'specs', title: 'Especificaciones Técnicas', options: { collapsible: true, collapsed: false } },
        { name: 'features', title: 'Equipamiento y Accesorios', options: { collapsible: true, collapsed: true } },
    ],
    fields: [
        // --- Identificación ---
        defineField({
            name: 'name',
            title: 'Nombre Publicado',
            type: 'string',
            description: 'Ej: Toyota RAV4 2.0 Lujo (Se usa para el título visual)',
            validation: (Rule) => Rule.required(),
            fieldset: 'main',
        }),
        defineField({
            name: 'slug',
            title: 'URL (Slug)',
            type: 'slug',
            options: { source: 'name' },
            validation: (Rule) => Rule.required(),
            fieldset: 'main',
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
            fieldset: 'main',
        }),
        defineField({
            name: 'price',
            title: 'Precio (CLP)',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
            fieldset: 'main',
        }),
        defineField({
            name: 'images',
            title: 'Galería de Imágenes',
            type: 'array',
            of: [{
                type: 'image',
                options: { hotspot: true }
            }],
            options: { layout: 'grid' },
            validation: (Rule) => Rule.required().min(1),
            fieldset: 'main',
        }),

        // --- Detalles Técnicos Básicos ---
        defineField({
            name: 'brand',
            title: 'Marca',
            type: 'string', // Podría ser un dropdown si prefieres estandarizar
            validation: (Rule) => Rule.required(),
            fieldset: 'specs',
        }),
        defineField({
            name: 'model',
            title: 'Modelo',
            type: 'string',
            validation: (Rule) => Rule.required(),
            fieldset: 'specs',
        }),
        defineField({
            name: 'version',
            title: 'Versión',
            type: 'string',
            description: 'Ej: GLX 4x4',
            fieldset: 'specs',
        }),
        defineField({
            name: 'year',
            title: 'Año',
            type: 'number',
            validation: (Rule) => Rule.required().min(1990).max(2030),
            fieldset: 'specs',
        }),
        defineField({
            name: 'category',
            title: 'Categoría',
            type: 'string',
            options: {
                list: ['SUV', 'Camioneta', 'Sedán', 'Hatchback', 'Coupé', 'Convertible', 'Comercial', 'Moto'],
            },
            fieldset: 'specs',
        }),
        defineField({
            name: 'bodyType',
            title: 'Carrocería',
            type: 'string',
            description: 'Ej: Station Wagon, Pickup, etc.',
            fieldset: 'specs',
        }),
        defineField({
            name: 'mileage',
            title: 'Kilometraje',
            type: 'number',
            fieldset: 'specs',
        }),
        defineField({
            name: 'doors',
            title: 'Puertas',
            type: 'number',
            fieldset: 'specs',
        }),
        defineField({
            name: 'fuel',
            title: 'Combustible',
            type: 'string',
            options: {
                list: ['Bencina', 'Diésel', 'Híbrido', 'Eléctrico', 'Gas'],
            },
            fieldset: 'specs',
        }),
        defineField({
            name: 'transmission',
            title: 'Transmisión',
            type: 'string',
            options: {
                list: ['Automática', 'Manual'],
            },
            fieldset: 'specs',
        }),
        defineField({
            name: 'color',
            title: 'Color',
            type: 'string',
            fieldset: 'specs',
        }),
        defineField({
            name: 'plate',
            title: 'Patente',
            type: 'string',
            description: 'Uso interno o validación. Puede ocultarse en el frontend.',
            fieldset: 'specs',
        }),
        defineField({
            name: 'description',
            title: 'Descripción Adicional',
            type: 'text',
            fieldset: 'specs',
        }),

        // --- Equipamiento (Checkboxes) ---
        // COMODIDAD
        defineField({
            name: 'comfortFeatures',
            title: 'Comodidad',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Aire Acondicionado', value: 'aire_acondicionado' },
                    { title: 'Alzavidrios Eléctricos', value: 'alzavidrios_electricos' },
                    { title: 'Asientos Calefaccionados', value: 'asientos_calefaccionados' },
                    { title: 'Asientos Eléctricos', value: 'asientos_electricos' },
                    { title: 'Cierre Centralizado', value: 'cierre_centralizado' },
                    { title: 'Climatizador', value: 'climatizador' },
                    { title: 'Computador a Bordo', value: 'computador_bordo' },
                    { title: 'Control Crucero', value: 'control_crucero' },
                    { title: 'Controles en Manubrio', value: 'controles_manubrio' },
                    { title: 'Cuero', value: 'cuero' },
                    { title: 'Sensor de Retroceso', value: 'sensor_retroceso' },
                    { title: 'Cámara de Retroceso', value: 'camara_retroceso' },
                    { title: 'Techo Corredizo (Sunroof)', value: 'techo_corredizo' },
                    { title: 'Tercera corrida de asientos', value: 'tercera_fila' },
                    { title: 'Volante Altura Regulable', value: 'volante_regulable' },
                ],
            },
            fieldset: 'features',
        }),

        // SEGURIDAD
        defineField({
            name: 'safetyFeatures',
            title: 'Seguridad',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: '4x4', value: '4x4' },
                    { title: 'Airbag Conductor', value: 'airbag_conductor' },
                    { title: 'Airbag Acompañante', value: 'airbag_acompanante' },
                    { title: 'Airbag Cortina', value: 'airbag_cortina' },
                    { title: 'Airbag Lateral', value: 'airbag_lateral' },
                    { title: 'Airbag Rodillas', value: 'airbag_rodillas' },
                    { title: 'Alarma', value: 'alarma' },
                    { title: 'Anclaje sillas niños (Isofix)', value: 'isofix' },
                    { title: 'Apoya cabeza traseros', value: 'apoya_cabeza_traseros' },
                    { title: 'Control dinámico estabilidad', value: 'control_estabilidad' },
                    { title: 'Frenos ABS', value: 'frenos_abs' },
                ],
            },
            fieldset: 'features',
        }),

        // ENTRETENIMIENTO
        defineField({
            name: 'entertainmentFeatures',
            title: 'Entretenimiento',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Android Auto', value: 'android_auto' },
                    { title: 'Apple CarPlay', value: 'apple_carplay' },
                    { title: 'Bluetooth', value: 'bluetooth' },
                    { title: 'Radio con Pantalla', value: 'radio_pantalla' },
                    { title: 'Entrada USB/Aux', value: 'usb_aux' },
                    { title: 'Sistema de Audio Premium', value: 'audio_premium' },
                ],
            },
            fieldset: 'features',
        }),

        // OTROS
        defineField({
            name: 'otherFeatures',
            title: 'Otros',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Caja Transferencia con Reductora', value: 'caja_reductora' },
                    { title: 'Catalítico', value: 'catalitico' },
                    { title: 'Espejos Eléctricos', value: 'espejos_electricos' },
                    { title: 'GPS', value: 'gps' },
                    { title: 'Llantas de Aleación', value: 'llantas' },
                    { title: 'Neblineros', value: 'neblineros' },
                ],
            },
            fieldset: 'features',
        }),

        defineField({
            name: 'isFeatured',
            title: '¿Destacado en Home?',
            type: 'boolean',
            initialValue: false,
            fieldset: 'main',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'price',
            media: 'images.0',
        },
        prepare(selection) {
            const { title, subtitle, media } = selection
            return {
                title: title,
                subtitle: subtitle ? `$${subtitle.toLocaleString('es-CL')}` : 'Sin precio',
                media: media,
            }
        },
    },
})
