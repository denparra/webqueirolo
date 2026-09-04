# Especificacion tecnica y arquitectonica de la plataforma web automotriz

Este documento define la base reutilizable para construir sitios web automotrices con identidad propia por cliente, manteniendo un nucleo tecnico comun. Describe que se construye, que tecnologia se usa, como se administran los vehiculos, como se almacenan y entregan las imagenes, como se configura el dominio y como se despliega la plataforma.

La implementacion de referencia es Queirolo Autos Web. Cuando una seccion indique **actual**, describe lo que existe en este repositorio. Cuando indique **objetivo**, describe la regla que debe seguir una nueva web basada en esta plataforma.

## 1. Objetivo y principios

### Objetivo

Construir sitios automotrices mantenibles y repetibles que permitan:

- Publicar inventario de vehiculos.
- Administrar altas, ediciones, eliminaciones y galerias.
- Mostrar fichas optimizadas para movil, tablet y escritorio.
- Personalizar marca, contenido, dominio y estilo sin duplicar logica innecesariamente.
- Operar con un CMS externo y almacenamiento de imagenes especializado.
- Desplegarse con HTTPS, health checks, reinicio automatico y observabilidad.

### Principios no negociables

| Principio | Regla |
|-----------|-------|
| Fuente de verdad | El inventario vive en el CMS; no se mantiene como datos de negocio dentro del frontend |
| Separacion | La marca y contenido del cliente se separan de la logica reusable |
| Rendimiento | No se entrega la imagen original si la interfaz necesita una variante menor |
| Seguridad | Los tokens de escritura y secretos nunca llegan al navegador |
| Portabilidad | El dominio, hosting y proveedor de imagenes se encapsulan en configuracion y adaptadores |
| Trazabilidad | Las decisiones tecnicas y cambios relevantes se registran en `docs/logbook.md` |
| Verificacion | No se declara una integracion como operativa sin probarla en el entorno correspondiente |

## 2. Alcance de la plataforma

### Incluido en el nucleo

- Home comercial configurable.
- Catalogo de vehiculos.
- Filtros y sincronizacion de filtros con URL.
- Fichas individuales por slug.
- Galeria y portada configurable.
- Comparador y favoritos.
- Badges de estado: disponible, reservado y vendido.
- Panel privado de inventario.
- Login single-owner para la implementacion actual.
- Alta, edicion, eliminacion y reordenamiento de vehiculos.
- Carga y normalizacion de imagenes.
- Formularios de contacto, financiamiento y consignacion.
- WhatsApp como canal publico inicial.
- Endpoint preparado para una integracion futura con n8n.
- Calculadora de credito referencial.
- SEO, metadata, sitemap y robots.
- Paginas institucionales y legales.
- Google Analytics y Sentry como integraciones opcionales.
- Tests, lint, TypeScript y documentacion operativa.

### Fuera del nucleo inicial

- CRM completo.
- Dashboard avanzado de ventas o metricas comerciales.
- Multi-tenant en una misma instancia con aislamiento complejo.
- Marketplace de terceros.
- Aplicacion movil nativa.
- Automatizaciones n8n como canal obligatorio.
- Servicio externo de fotos con IA.
- Base de datos SQL como requisito de la plataforma.

Estas capacidades pueden agregarse como iniciativas independientes y no deben presentarse como existentes sin implementacion y evidencia.

## 3. Arquitectura de referencia

```txt
                    +----------------------+
                    | Dominio del cliente  |
                    +----------+-----------+
                               |
                    DNS / SSL / CDN opcional
                               |
                    +----------v-----------+
                    | App Next.js          |
                    | Frontend + Backend   |
                    +----+-------------+---+
                         |             |
               consultas |             | acciones/API
                         |             |
             +-----------v--+     +----v----------------+
             | Sanity CMS   |     | Servicios externos  |
             | datos/assets |     | WhatsApp / n8n      |
             +-----------+--+     +---------------------+
                         |
                 Sanity Image CDN
                         |
                    Navegador
```

### Capas

| Capa | Responsabilidad | Ubicacion actual |
|------|-----------------|------------------|
| Presentacion | Rutas, layouts, Server Components y Client Components | `app/`, `components/` |
| Estado cliente | Favoritos y comparador | `store/` |
| Dominio | Tipos, transformaciones, filtros, calculos y validaciones | `lib/` |
| Integracion CMS | Consultas GROQ, mapeo y cliente Sanity | `lib/sanity.ts`, `lib/vehicles.ts`, `sanity/` |
| Administracion | Auth, sesiones, Server Actions y mutaciones | `app/admin/`, `lib/admin/` |
| Media | Upload, resize, conversion, CDN y galerias | `lib/admin/vehicles.ts`, `lib/admin/imageResize.ts` |
| Configuracion | Marca, contacto, SEO y variables de entorno | `config.ts`, `.env.local` |
| Operacion | Logs, errores, health check y despliegue | `app/api/health`, Sentry, plataforma de hosting |

## 4. Stack tecnologico

| Area | Tecnologia base | Decision |
|------|-----------------|----------|
| Framework | Next.js 14 App Router | Mantener para la implementacion de referencia |
| Lenguaje | TypeScript | Obligatorio para codigo nuevo salvo configuracion requerida por una herramienta |
| UI | React 18 | Componentes reutilizables por dominio |
| Estilos | Tailwind CSS y PostCSS | Tokens y estilos centralizados en configuracion |
| UI primitives | Radix UI y patrones shadcn/ui | Reusar antes de crear componentes paralelos |
| CMS | Sanity | Proveedor inicial recomendado |
| Consulta | GROQ y `next-sanity` | Consultas centralizadas en `lib/vehicles.ts` |
| Imagenes | Sanity Image CDN + `@sanity/image-url` | Transformaciones bajo demanda |
| Procesamiento upload | `sharp` | Normalizacion servidor |
| Estado cliente | Zustand | Solo para estado interactivo necesario |
| Validacion | Zod y validadores de dominio | Validar en limites de entrada |
| Testing | Jest, Testing Library y TypeScript | Checks obligatorios antes de integrar |
| Observabilidad | Sentry y Google Analytics opcionales | No bloquear el funcionamiento si estan deshabilitados |

## 5. Frontend

### Estructura reusable

```txt
app/
  page.tsx                    # Home
  vehiculos/                  # Catalogo y detalle
  servicios/                  # Servicios comerciales
  nosotros/                   # Institucional
  contacto/                   # Contacto y mapa
  admin/                      # Panel privado
  studio/[[...tool]]/         # Sanity Studio
  api/                        # Endpoints HTTP
components/
  layout/                     # Navbar, footer y navegacion movil
  home/                       # Hero, destacados y categorias
  vehicles/                   # Cards, filtros, galeria y comparador
  admin/                      # Formularios y acciones de inventario
  forms/                      # Contacto, credito y consignacion
  shared/                     # WhatsApp, schema y rich text
  ui/                         # Primitives visuales
store/                        # Estado cliente
```

### Reglas de interfaz

- Cada pagina debe funcionar en movil, tablet y escritorio.
- Cada imagen debe tener `alt`, dimensiones o `fill` correctamente configurado y `sizes` cuando use layout responsive.
- Solo la imagen LCP o las primeras imagenes realmente visibles deben usar `priority`.
- El resto de galerias y cards debe cargarse de forma diferida.
- La identidad visual se configura por cliente; no se hardcodea en componentes compartidos.
- Las rutas publicas existentes no se renombran sin una estrategia de redireccion y validacion SEO.
- Las fichas deben representar estados de inventario sin ocultar inconsistencias del CMS.

## 6. Backend y datos

Next.js funciona como frontend y backend de la plataforma. No existe un backend separado obligatorio para la implementacion de referencia.

### Sanity como CMS inicial

Sanity es la decision base porque ofrece en la misma plataforma:

- Documento estructurado `vehicle`.
- Studio para edicion.
- API GROQ.
- Assets de imagen.
- CDN de imagenes.
- Transformaciones de tamano, formato, calidad, crop y hotspot.
- Integracion directa con el modelo actual.

El frontend consulta `lib/vehicles.ts`. El admin escribe mediante `lib/admin/vehicles.ts` usando `SANITY_API_WRITE_TOKEN`, que es exclusivamente server-side.

### Modelo de vehiculo

La fuente de verdad del modelo es `sanity/schemaTypes/vehicle.ts`. El documento incluye:

- Nombre y slug.
- Estado.
- Precio.
- Galeria.
- Marca, modelo, version y ano.
- Categoria y carroceria.
- Kilometraje, puertas, combustible, transmision y color.
- Descripcion Portable Text.
- Equipamiento de comodidad, seguridad, entretenimiento y otros.
- Indicador de destacado.

Los catalogos de marca, categoria, carroceria y color se mantienen en `lib/constants/` y se reutilizan en Studio y admin.

### Fallback de desarrollo

- Con Sanity correctamente configurado, el inventario sale del dataset configurado.
- En desarrollo, si falta configuracion o falla la consulta, se usa `lib/data.ts`.
- En produccion, la falta de `NEXT_PUBLIC_SANITY_PROJECT_ID` o un fallo de consulta debe fallar de forma visible; no se debe publicar inventario falso.

## 7. Sistema de imagenes

### Decision base

Las fotos reales de vehiculos se almacenan como assets de Sanity. `public/images/vehicles/` solo contiene imagenes fallback para desarrollo y datos mock.

Sanity es preferible para la primera version porque resuelve CMS, assets, CDN y transformaciones sin construir una plataforma de media desde cero.

### Pipeline de subida

```txt
Archivo del navegador
        |
Compresion cliente: max 2000 px, JPEG quality 0.82
        |
Server Action protegida
        |
sharp: max 2400 px, JPEG quality 82, auto-rotate
        |
Sanity Asset
        |
Documento vehicle con orden de galeria
```

Reglas actuales:

- JPG, PNG y WEBP se optimizan a JPEG cuando `sharp` puede procesarlos.
- GIF se conserva para no aplanar animaciones.
- HEIC, HEIF, TIFF y BMP intentan convertirse a JPEG.
- El procesamiento servidor tiene concurrencia maxima de 3.
- `images[0]` representa la portada publica.
- Eliminar el documento no elimina automaticamente assets historicos de Sanity.

### Entrega publica

- Sanity entrega desde `cdn.sanity.io`.
- El codigo actual aplica variantes aproximadas de 800 px para cards y 1200 px para galerias.
- La URL puede usar `w`, `q`, `auto=format` y `fit=max`.
- Next.js entrega WebP o AVIF cuando corresponde y mantiene cache de imagen configurado.
- Debe medirse si la doble optimizacion Sanity + Next Image aporta valor o agrega procesamiento innecesario.

### Regla de variantes

No existe un peso universal correcto de 150-250 KB para todas las fotos. La variante debe depender de:

- Uso: card, hero, detalle o lightbox.
- Ancho visual real.
- Densidad de pantalla.
- Formato aceptado por el navegador.
- Calidad visual del vehiculo.

Los objetivos de peso y velocidad se validan con Lighthouse, DevTools y datos reales; no se presentan como garantia sin medicion.

### Alternativa futura: R2

Cloudflare R2 puede ser una alternativa cuando se necesite mayor control de almacenamiento o una estrategia de costos distinta. R2 por si solo es object storage; no reemplaza automaticamente el CMS, la transformacion, el CDN, los metadatos ni el panel.

Una migracion a R2 requeriria definir:

- Contrato `MediaProvider`.
- Upload firmado o endpoint seguro.
- Variantes generadas por `sharp`, Cloudflare Images o Workers.
- Metadata de assets.
- Relacion entre vehiculo y archivos.
- Eliminacion, reordenamiento y limpieza de huerfanos.
- CDN, cache y invalidacion.
- Migracion y rollback.

No migrar a R2 antes de demostrar una necesidad tecnica, economica o de control operativo.

## 8. Dominio, DNS y certificados

### Regla de dominio

Cada cliente debe tener:

- Dominio registrado bajo control del cliente o con acceso transferible.
- Host canonico definido.
- Host alternativo redirigido al canonico.
- HTTPS activo.
- Variables publicas actualizadas.
- `config.ts` con la URL canonica correcta.

La implementacion actual usa `https://www.queirolo.cl` como canonico y `middleware.ts` redirige `queirolo.cl` hacia `www.queirolo.cl` con 308.

### DNS recomendado

Cloudflare DNS es una opcion recomendada para centralizar DNS, proxy, SSL, cache y proteccion basica. El origen puede ser Railway, Vercel o un VPS.

El proveedor de hosting sigue siendo responsable de validar su procedimiento de dominio. No asumir que los registros A o CNAME son iguales entre plataformas.

Checklist por dominio:

1. Confirmar quien controla el registrador.
2. Configurar zona DNS.
3. Apuntar `www` al proveedor de despliegue.
4. Configurar redireccion del apex.
5. Verificar certificado SSL.
6. Verificar `http` -> `https`.
7. Verificar `www` -> host canonico.
8. Actualizar `config.ts` y variables publicas.
9. Rebuild y revisar metadata, sitemap y robots.

## 9. Despliegue y disponibilidad

### Recomendacion para la implementacion actual: Railway

Railway es la opcion primaria recomendada para este repositorio porque:

- Ejecuta el servidor Node/Next.js como servicio persistente.
- Es compatible con el flujo actual de Server Actions y procesamiento `sharp`.
- Permite dominio personalizado.
- Permite health checks.
- Permite politica de reinicio ante fallos.
- Permite escalar replicas si se requiere.
- Reduce la operacion manual frente a un VPS.
- No exige almacenar las fotos en el filesystem local, porque las fotos viven en Sanity.

Comandos de produccion esperados:

```bash
npm ci
npm run build
npm run start
```

El servicio debe escuchar el puerto entregado por `PORT`. El health check inicial debe consultar `/api/health`.

### Vercel

Vercel es una excelente opcion para Next.js cuando se priorizan CDN, previews y despliegue administrado. Sin embargo, la documentacion de Vercel establece un limite de 4.5 MB para request y response de Vercel Functions.

El repositorio actual configura Server Actions con `bodySizeLimit: '15mb'` porque el admin recibe imagenes y las procesa con `sharp`. Por eso Vercel no es la opcion primaria mientras se mantenga este flujo de upload server-side.

Vercel podria ser viable si se rediseña la subida para:

- Subir directamente desde el navegador a Sanity mediante un flujo seguro.
- Usar URLs firmadas.
- Reducir el payload antes de alcanzar la Function.
- Separar completamente el procesamiento pesado del request.

Esa migracion debe ser una iniciativa especifica, no una suposicion del documento base.

### VPS

Un VPS es adecuado cuando se necesita:

- Control completo del sistema operativo.
- Costos previsibles a escala pequeña.
- Procesos largos o personalizados.
- Configuracion propia de Nginx, Caddy, Docker o systemd.

El costo es mayor carga operativa. Un VPS requiere gestionar:

- Parches del sistema.
- Firewall.
- SSH seguro.
- TLS y renovacion de certificados.
- Reverse proxy.
- Reinicio del proceso.
- Backups.
- Monitoreo.
- Logs y rotacion.
- Recuperacion ante fallo del disco o proveedor.

La recomendacion es no usar un VPS como primera opcion para cada cliente salvo que exista una razon concreta de control, costo o integracion.

### Significado de siempre en linea

Ningun proveedor garantiza disponibilidad absoluta. Para aproximarse a una operacion robusta:

- Usar hosting administrado con reinicio automatico.
- Mantener datos e imagenes fuera del filesystem local.
- Configurar health check.
- Mantener dominio y DNS documentados.
- Tener deploy reproducible desde Git.
- Tener rollback de la version anterior.
- Monitorear errores y disponibilidad.
- Mantener backups independientes del proveedor de ejecucion.

La primera instancia puede operar con una replica. Para alta disponibilidad real se requieren replicas, estrategia de cache compartida y pruebas de failover.

## 10. Restricciones de escalamiento

El rate limit actual de `/api/submit-lead` vive en memoria del proceso. Con varias replicas, cada replica tendria un contador distinto. Antes de escalar horizontalmente, se debe migrar el rate limit a un almacenamiento compartido o aceptar explicitamente esa limitacion.

La cache interna de Next.js tambien debe revisarse cuando existan varias instancias. Si se necesita cache compartida, Next.js documenta el uso de un cache handler externo.

No agregar replicas solo por disponibilidad teorica sin revisar sesiones, rate limit, cache e idempotencia.

## 11. Variables de entorno

### Sanity y datos publicos

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### Administracion

```env
ADMIN_USERNAME=...
ADMIN_PASSWORD_HASH=...
ADMIN_SESSION_SECRET=...
SANITY_API_WRITE_TOKEN=...
```

### Integraciones opcionales

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=...
N8N_LEAD_WEBHOOK_URL=...
```

Reglas:

- Nunca subir `.env.local`.
- Nunca exponer `SANITY_API_WRITE_TOKEN` como `NEXT_PUBLIC_*`.
- No escribir secretos reales en documentacion.
- Cambiar cualquier `NEXT_PUBLIC_*` requiere rebuild.
- Cada cliente debe tener variables y proyecto Sanity separados.
- No reutilizar tokens de produccion entre clientes.

## 12. Seguridad

- Proteger `/admin` con middleware y sesion firmada.
- Usar cookie HttpOnly para la sesion.
- Aplicar rate limit en endpoints publicos.
- Mantener honeypot y validacion Zod en leads.
- Validar archivos por MIME y extension antes de procesarlos.
- No ejecutar comandos provenientes de formularios.
- No exponer datos internos del documento `vehicle` sin necesidad.
- Mantener HTTPS obligatorio.
- Revisar cabeceras de seguridad del hosting y `next.config.js`.
- Usar tokens con minimo privilegio.
- Rotar secretos cuando cambie el equipo o proveedor.

## 13. Backups y recuperacion

### Que respaldar

- Codigo fuente en Git.
- Variables de entorno en un gestor seguro.
- Dataset de Sanity.
- Referencias de assets y politica de imagenes.
- Configuracion DNS.
- Configuracion del proveedor de despliegue.
- Configuracion de Sentry, Analytics y n8n si aplica.

### Regla de recuperacion

Un backup no es suficiente hasta comprobar que puede restaurarse. Cada proyecto debe definir:

- Frecuencia.
- Retencion.
- Responsable.
- Ubicacion independiente.
- Procedimiento de restauracion.
- Tiempo objetivo de recuperacion.
- Punto objetivo de recuperacion.

Sanity es la fuente de inventario, pero el equipo debe documentar como exportar y recuperar los datos y como verificar la disponibilidad de assets.

## 14. Observabilidad y operacion

Minimo operativo:

- `/api/health` devuelve estado y timestamp.
- El proveedor reinicia el servicio si falla.
- Los errores server-side se registran sin incluir secretos.
- Sentry se habilita cuando el proyecto lo requiera.
- Se monitorizan respuestas 4xx/5xx, tiempo de respuesta y fallos de Sanity.
- Se revisan Core Web Vitals con Lighthouse y herramientas reales.
- Se mantiene una lista de contactos y accesos de emergencia.

## 15. Proceso para crear una nueva web

1. Copiar el repositorio base en un repositorio nuevo.
2. Crear un proyecto y dataset de Sanity independientes.
3. Definir dominio y proveedor de despliegue.
4. Configurar variables de entorno sin reutilizar secretos.
5. Personalizar `config.ts` y assets de marca.
6. Revisar colores, tipografias, metadata y textos.
7. Verificar el schema `vehicle` y los catalogos necesarios.
8. Configurar el canal de leads aprobado.
9. Cargar y probar imagenes reales.
10. Ejecutar lint, tests y TypeScript.
11. Desplegar en entorno de prueba.
12. Verificar rutas, admin, CMS, dominio, SSL, sitemap, robots e imagenes.
13. Ejecutar checklist de produccion.
14. Registrar configuracion, riesgos y rollback.

No copiar el dataset de produccion directamente a otro cliente. La migracion de inventario debe ser explicita, autorizada y reversible.

## 16. Criterios de calidad

Una web basada en esta plataforma no se considera lista hasta verificar:

- Home, catalogo y ficha funcionan en movil y escritorio.
- El inventario real se consulta desde el CMS correcto.
- Una ficha inexistente responde con `notFound()`.
- Las imagenes tienen variantes y no descargan originales innecesariamente.
- La portada corresponde a `images[0]`.
- El admin bloquea usuarios no autenticados.
- Crear, editar, ordenar y eliminar vehiculos funciona.
- Los uploads validan formatos y no exponen tokens.
- Los formularios validan entradas y respetan el canal configurado.
- Sitemap y robots corresponden al dominio real.
- HTTPS y redirecciones canonicas funcionan.
- Health check, logs y rollback estan documentados.
- `npm run lint`, `npm run test` y `npx tsc --noEmit --pretty false` pasan.
- Build y prueba de produccion pasan cuando el owner solicita verificacion de deploy.

## 17. Decisiones registradas

| Decision | Estado | Motivo |
|----------|--------|--------|
| Sanity como CMS inicial | Adoptada | Ya integra documentos, Studio, assets, CDN y transformaciones |
| R2 como alternativa futura | No adoptada | Requiere construir media pipeline y CMS complementario |
| Railway como despliegue primario recomendado | Recomendada | Compatible con Server Actions de 15 MB y `sharp` sin rediseño inmediato |
| Vercel como alternativa condicionada | Condicionada | Su limite documentado de Functions exige rediseñar uploads o reducir payload |
| VPS como alternativa de control | Condicionada | Requiere mayor operacion, seguridad, backups y monitoreo |
| Cloudflare DNS como capa DNS/SSL opcional | Recomendada | Centraliza dominio, proxy y certificados sin acoplar el runtime |

## 18. Mantenimiento de este documento

Actualizar esta especificacion cuando cambien:

- Framework o dependencias base.
- Proveedor de CMS o imagenes.
- Pipeline de upload.
- Modelo de datos.
- Rutas publicas o privadas.
- Variables de entorno.
- Hosting, DNS o estrategia de certificados.
- Backups, monitoreo o seguridad.
- Contrato de configuracion por cliente.

Registrar cada cambio relevante en `docs/logbook.md`. Si una nueva web se aparta de esta arquitectura, documentar el motivo, impacto, migracion y rollback antes de implementarla.

## Referencias tecnicas

- `docs/reference/project-reference.md` - estado actual de Queirolo Autos Web.
- `sanity/schemaTypes/vehicle.ts` - schema fuente de verdad del inventario.
- `lib/vehicles.ts` - consultas publicas y transformaciones.
- `lib/admin/vehicles.ts` - uploads, mutaciones y procesamiento de imagenes.
- `lib/admin/imageResize.ts` - limites de procesamiento.
- `next.config.js` - Server Actions, imagenes y cabeceras.
- `middleware.ts` - dominio canonico y proteccion de admin.
- `app/api/health/route.ts` - health check.
- `package.json` - scripts y dependencias.

Fuentes de plataforma consultadas:

- [Sanity Image URLs](https://www.sanity.io/docs/apis-and-sdks/image-urls)
- [Sanity Image CDN and assets](https://www.sanity.io/docs/content-lake/assets)
- [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [Vercel Functions limitations](https://vercel.com/docs/functions/limitations)
- [Vercel Next.js image optimization](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Railway healthchecks](https://docs.railway.com/deployments/healthchecks)
- [Railway custom domains](https://docs.railway.com/networking/domains)
- [Cloudflare SSL/TLS](https://developers.cloudflare.com/ssl/)
