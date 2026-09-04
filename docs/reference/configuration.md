# Guia de configuracion del negocio

Este documento explica donde cambiar datos visibles de Queirolo Autos sin tocar componentes innecesariamente.

## Fuente de verdad

El archivo real es `config.ts` en la raiz del proyecto. No existe `config.js` como fuente activa.

## Que vive en `config.ts`

| Area | Ejemplos |
|------|----------|
| Empresa | nombre, nombre completo, tagline |
| Contacto | direccion publica, telefono, WhatsApp, email |
| Horarios | dias habiles, sabado, mensajes visibles |
| Redes | Instagram y enlaces sociales |
| SEO base | title, description, keywords, baseUrl |
| Logos | rutas bajo `public/images/logo/` |
| URLs legales | privacidad, terminos |

## Reglas

- Cambiar contenido de negocio en `config.ts`, no hardcodearlo en paginas.
- Mantener telefonos/WhatsApp en formato consistente.
- Si cambia un `NEXT_PUBLIC_*` en deploy, reconstruir.
- No guardar secretos en `config.ts`; secretos van en `.env.local` o variables del proveedor.

## Admin e inventario

Los vehiculos no se editan en `config.ts`.

- Flujo recomendado: `/admin`.
- Respaldo tecnico: `/studio`.
- Fuente de verdad de inventario: Sanity `vehicle`.
- Schema: `sanity/schemaTypes/vehicle.ts`.
- Mutaciones admin: `lib/admin/vehicles.ts`.

## Verificacion rapida

Despues de cambiar `config.ts`:

- Revisar navbar/footer.
- Revisar boton flotante de WhatsApp.
- Revisar `/contacto`.
- Revisar metadata si cambio SEO/baseUrl.
- Ejecutar `npm run lint` si se toco TypeScript.
