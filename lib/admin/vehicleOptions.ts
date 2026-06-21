import { OTHER_BRAND_OPTION, VEHICLE_BRANDS } from '@/lib/constants/vehicleBrands'
import { OTHER_CATEGORY_OPTION, VEHICLE_CATEGORIES } from '@/lib/constants/vehicleCategories'
import { OTHER_BODYTYPE_OPTION, VEHICLE_BODY_TYPES } from '@/lib/constants/vehicleBodyTypes'
import { OTHER_COLOR_OPTION, VEHICLE_COLORS } from '@/lib/constants/vehicleColors'

export const BRAND_OPTIONS = [...VEHICLE_BRANDS, OTHER_BRAND_OPTION]

export const VEHICLE_STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'sold', label: 'Vendido' },
] as const

export const CATEGORY_OPTIONS = [...VEHICLE_CATEGORIES, OTHER_CATEGORY_OPTION]
export const BODYTYPE_OPTIONS = [...VEHICLE_BODY_TYPES, OTHER_BODYTYPE_OPTION]
export const COLOR_OPTIONS = [...VEHICLE_COLORS, OTHER_COLOR_OPTION]

export const FUEL_OPTIONS = ['Bencina', 'Diésel', 'Híbrido', 'Eléctrico', 'Gas']
export const TRANSMISSION_OPTIONS = ['Automática', 'Manual']

export const FEATURE_GROUPS = [
  {
    name: 'comfortFeatures',
    title: 'Comodidad',
    options: [
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
  {
    name: 'safetyFeatures',
    title: 'Seguridad',
    options: [
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
  {
    name: 'entertainmentFeatures',
    title: 'Entretenimiento',
    options: [
      { title: 'Android Auto', value: 'android_auto' },
      { title: 'Apple CarPlay', value: 'apple_carplay' },
      { title: 'Bluetooth', value: 'bluetooth' },
      { title: 'Radio con Pantalla', value: 'radio_pantalla' },
      { title: 'Entrada USB/Aux', value: 'usb_aux' },
      { title: 'Sistema de Audio Premium', value: 'audio_premium' },
    ],
  },
  {
    name: 'otherFeatures',
    title: 'Otros',
    options: [
      { title: 'Caja Transferencia con Reductora', value: 'caja_reductora' },
      { title: 'Catalítico', value: 'catalitico' },
      { title: 'Espejos Eléctricos', value: 'espejos_electricos' },
      { title: 'GPS', value: 'gps' },
      { title: 'Llantas de Aleación', value: 'llantas' },
      { title: 'Neblineros', value: 'neblineros' },
    ],
  },
] as const
