/** Mapa de valores internos de Sanity → etiquetas legibles para el frontend */
export const FEATURE_LABELS: Record<string, string> = {
  // Comodidad
  aire_acondicionado: 'Aire Acondicionado',
  alzavidrios_electricos: 'Alzavidrios Eléctricos',
  asientos_calefaccionados: 'Asientos Calefaccionados',
  asientos_electricos: 'Asientos Eléctricos',
  cierre_centralizado: 'Cierre Centralizado',
  climatizador: 'Climatizador',
  computador_bordo: 'Computador a Bordo',
  control_crucero: 'Control Crucero',
  controles_manubrio: 'Controles en Manubrio',
  cuero: 'Cuero',
  sensor_retroceso: 'Sensor de Retroceso',
  camara_retroceso: 'Cámara de Retroceso',
  techo_corredizo: 'Techo Corredizo (Sunroof)',
  tercera_fila: 'Tercera corrida de asientos',
  volante_regulable: 'Volante Altura Regulable',
  // Seguridad
  '4x4': '4x4',
  airbag_conductor: 'Airbag Conductor',
  airbag_acompanante: 'Airbag Acompañante',
  airbag_cortina: 'Airbag Cortina',
  airbag_lateral: 'Airbag Lateral',
  airbag_rodillas: 'Airbag Rodillas',
  alarma: 'Alarma',
  isofix: 'Anclaje sillas niños (Isofix)',
  apoya_cabeza_traseros: 'Apoya cabeza traseros',
  control_estabilidad: 'Control dinámico estabilidad',
  frenos_abs: 'Frenos ABS',
  // Entretenimiento
  android_auto: 'Android Auto',
  apple_carplay: 'Apple CarPlay',
  bluetooth: 'Bluetooth',
  radio_pantalla: 'Radio con Pantalla',
  usb_aux: 'Entrada USB/Aux',
  audio_premium: 'Sistema de Audio Premium',
  // Otros
  caja_reductora: 'Caja Transferencia con Reductora',
  catalitico: 'Catalítico',
  espejos_electricos: 'Espejos Eléctricos',
  gps: 'GPS',
  llantas: 'Llantas de Aleación',
  neblineros: 'Neblineros',
}

export function getFeatureLabel(value: string): string {
  return FEATURE_LABELS[value] ?? value
}
