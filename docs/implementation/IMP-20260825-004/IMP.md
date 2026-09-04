# IMP-20260825-004 - Panel de plataforma para webs automotrices

## Metadatos

| Campo | Valor |
|-------|-------|
| **ID** | IMP-20260825-004 |
| **Fecha** | 2026-08-25 |
| **Owner** | Denny |
| **Estado** | planning |
| **Tipo** | SOT / arquitectura / implementacion incremental |
| **Log ref** | LOG-20260825-004 |
| **Carpeta/módulo objetivo** | `app/panel-web-automotoras/` |
| **Ruta UI futura** | `/panel-web-automotoras` |
| **Panel existente preservado** | `/admin` |

## 1. Decision principal

El sistema tendra dos superficies con responsabilidades distintas:

| Panel | Usuario | Responsabilidad | Estado |
|-------|---------|-----------------|--------|
| `/admin` | Cliente/owner de una automotora | Operar inventario, vehiculos, galerias y acciones comerciales del sitio | Existente y funcional; no se reemplaza |
| `app/panel-web-automotoras/` | Operador de la plataforma | Centro de Control para registrar, configurar, provisionar y monitorear webs automotrices | Nuevo; se implementara por fases |

El nuevo panel no debe reutilizar la sesion, cookie ni permisos del `/admin` actual. Son superficies de seguridad distintas y deben tener autenticacion, autorizacion, auditoria y secretos separados.

## 2. Objetivo

Crear un Centro de Control dentro de `app/panel-web-automotoras/` desde el cual el owner de la plataforma pueda incluir y administrar la empresa ya funcionando, Queirolo Autos, crear nuevas instancias automotrices, configurar datos de marca, asociar proyectos Sanity, preparar despliegues y controlar el ciclo de vida de cada proyecto sin romper el `/admin` operativo del cliente.

El panel sera el punto de control de la plataforma, no el CMS de inventario del cliente.

## 3. Contexto actual

La implementacion de referencia ya cuenta con:

- Catalogo publico de vehiculos.
- Fichas por slug.
- Sanity como fuente de inventario y assets.
- `/admin` para alta, edicion, eliminacion y orden de vehiculos.
- Procesamiento de imagenes cliente/servidor con `sharp`.
- Server Actions y endpoints HTTP.
- SEO, sitemap, robots y metadata.
- Autenticacion single-owner para el admin de la automotora.
- Documentacion tecnica reusable en `docs/reference/automotive-platform-specification.md`.

El repositorio todavia contiene acoplamientos de Queirolo en branding, legal, dominio, manifest, redirects, estructura de Sanity, claves de almacenamiento local y textos de paginas. El nuevo panel no elimina esos acoplamientos por si solo; primero debe existir un contrato de configuracion por proyecto.

## 4. Alcance

### Incluye

- Carpeta/módulo interno `app/panel-web-automotoras/`.
- Ruta UI futura `/panel-web-automotoras` cuando se implemente la interfaz.
- Autenticacion separada para el operador de plataforma.
- Registro de proyectos automotrices.
- Registro de Queirolo como primer proyecto existente.
- Estados del proyecto: draft, configuring, staging, production, suspended, archived.
- Configuracion de marca y dominio.
- Asociacion de proyecto/dataset Sanity.
- Registro de proveedor de despliegue.
- Estado de variables requeridas sin mostrar secretos.
- Validacion de configuracion.
- Checklist de onboarding.
- Registro de eventos y auditoria.
- Referencias a repositorio, ambiente, dominio y despliegue.
- Base para provisionar futuras webs desde la plantilla.

### No incluye en la primera fase

- Reemplazar `/admin`.
- Administrar inventario desde el panel de plataforma.
- Mostrar tokens privados despues de guardarlos.
- Guardar API keys en texto plano en una tabla comun.
- Crear automaticamente todos los proyectos externos sin evaluar sus APIs y permisos.
- Multi-tenant publico para clientes finales.
- CRM, facturacion o soporte comercial.
- Modificar el runtime funcional de Queirolo.
- Migrar inmediatamente el repositorio actual a una plantilla limpia.

## 5. Modelo conceptual

```txt
Panel de plataforma
  |
  +-- PlatformUser
  +-- AutomotiveProject
  +-- BrandConfig
  +-- DomainConfig
  +-- SanityConnection
  +-- DeploymentTarget
  +-- SecretReference
  +-- ProvisioningJob
  +-- AuditEvent
           |
           +--> repositorio del cliente
           +--> proyecto/dataset Sanity
           +--> servicio Railway/Vercel/VPS
           +--> dominio y DNS

Sitio del cliente
  |
  +-- frontend publico
  +-- /admin operativo del cliente
  +-- Sanity Studio
  +-- APIs y Server Actions
```

## 6. Regla de secretos

### Datos que el panel puede guardar como configuracion

- Nombre comercial y legal.
- Dominio canonico.
- Datos de contacto.
- Redes sociales.
- Horarios.
- Textos SEO.
- Theme tokens.
- Rutas de logos y assets.
- `NEXT_PUBLIC_SANITY_PROJECT_ID`.
- `NEXT_PUBLIC_SANITY_DATASET`.
- Identificadores de servicios externos.
- IDs de proyecto, ambiente y servicio del proveedor de despliegue.

### Datos que nunca deben quedar expuestos al navegador

- `SANITY_API_WRITE_TOKEN`.
- `ADMIN_SESSION_SECRET`.
- `ADMIN_PASSWORD_HASH`.
- `RAILWAY_API_TOKEN`.
- Tokens de Sentry.
- Secretos de webhooks.
- Credenciales de proveedores.

### Regla de implementacion

El formulario del panel puede recibir un secreto, pero el valor debe:

1. Viajar solo por HTTPS.
2. Procesarse en un handler server-only.
3. Guardarse en Railway Variables, un secret manager o una tabla cifrada con claves fuera de la base de datos.
4. No devolverse en respuestas posteriores.
5. Mostrarse solo como configurado/no configurado.
6. Permitir rotacion y revocacion.
7. Generar un evento de auditoria sin registrar el valor.

La primera version puede comenzar con referencias a secretos y configuracion manual documentada. La escritura automatica hacia Railway requiere un token maestro del Control Plane almacenado fuera del codigo.

## 7. Separacion de autenticacion

### `/admin`

- Auth actual del cliente.
- Cookie actual `qa_admin_session` mientras no se migre.
- Permisos sobre documentos `vehicle`.
- No puede leer secretos de la plataforma.
- No puede crear otros proyectos.

### Centro de Control (`app/panel-web-automotoras/`)

- Cookie y nombre de sesion propios.
- Usuario de plataforma separado.
- Autorizacion por rol desde el inicio aunque inicialmente exista un solo owner.
- Auditoria de cambios.
- Reautenticacion para operaciones sensibles.
- Rate limit de login.
- No reutilizar `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` ni `ADMIN_SESSION_SECRET` del cliente.

La autenticacion actual usa SHA-256 para la contrasena del `/admin`; antes de reutilizar el patron en el panel de plataforma debe migrarse a Argon2id, bcrypt o scrypt.

## 8. Entidades iniciales

### AutomotiveProject

```txt
id
slug
name
legalName
status
templateVersion
repositoryUrl
defaultBranch
createdAt
updatedAt
```

### BrandConfig

```txt
projectId
companyName
legalName
tagline
canonicalUrl
phone
whatsapp
email
address
coordinates
socialLinks
businessHours
seoTitle
seoDescription
locale
themeTokens
assetManifest
```

### SanityConnection

```txt
projectId
sanityProjectId
dataset
apiVersion
environment
secretReference
status
lastValidatedAt
```

`secretReference` apunta al secreto externo. No contiene el token en texto plano.

### DeploymentTarget

```txt
projectId
provider
providerProjectId
environmentId
serviceId
canonicalDomain
healthcheckPath
status
lastDeploymentId
lastDeploymentAt
```

### ProvisioningJob

```txt
id
projectId
type
status
startedAt
finishedAt
errorCode
safeMessage
initiatedBy
```

### AuditEvent

```txt
id
projectId
actorId
action
resourceType
resourceId
metadataSafe
createdAt
```

Nunca guardar secretos dentro de `metadataSafe`.

## 9. Ciclo de vida de un proyecto

```txt
draft
  -> configuring
  -> provisioned
  -> staging
  -> production
  -> suspended
  -> archived
```

Transiciones validas:

- `draft -> configuring`: existe ficha minima del proyecto.
- `configuring -> provisioned`: Sanity, dominio, proveedor y variables validadas.
- `provisioned -> staging`: existe despliegue de prueba.
- `staging -> production`: checklist y aprobacion manual completados.
- `production -> suspended`: se detiene el servicio sin borrar datos.
- `suspended -> production`: se valida configuracion y se reactiva.
- `production -> archived`: requiere confirmacion y procedimiento de rollback.

No borrar un proyecto desde una accion simple del dashboard.

## 10. Flujo para Queirolo actual

Queirolo sera el primer registro de `AutomotiveProject` con modo `existing`.

### Registro inicial

- Asociar el repositorio actual.
- Registrar `https://www.queirolo.cl`.
- Registrar el proyecto/dataset Sanity existente sin copiar secretos al panel.
- Registrar Railway/VPS cuando se confirme el proveedor real.
- Marcar `/admin` como panel cliente existente.
- Marcar el inventario y assets como datos ya operativos.
- Documentar acoplamientos pendientes de extraer.

### Restricciones

- No cambiar el funcionamiento actual del `/admin`.
- No mover el dataset existente.
- No rotar secretos automaticamente durante el alta del registro.
- No modificar el dominio desde el panel hasta tener rollback.
- No ejecutar migraciones de branding sobre Queirolo como parte del MVP.

## 11. Flujo para una nueva web

1. Crear `AutomotiveProject` en estado `draft`.
2. Completar analisis de marca.
3. Definir sistema visual y contenido.
4. Crear repositorio desde la plantilla versionada.
5. Crear proyecto y dataset Sanity independientes.
6. Crear credenciales con minimo privilegio.
7. Crear servicio y ambiente de despliegue.
8. Guardar configuracion publica y referencias de secretos.
9. Provisionar variables server-side.
10. Ejecutar validaciones de entorno.
11. Desplegar staging.
12. Revisar frontend, `/admin`, Sanity, imagenes y dominio.
13. Aprobar produccion.
14. Registrar rollback, backups y accesos.

## 12. Analisis de marca antes del diseño

El panel debe permitir registrar o enlazar un brief que contenga:

- Personalidad de marca.
- Publico objetivo.
- Posicionamiento.
- Diferenciadores.
- Competidores.
- Tono de voz.
- Cobertura geografica.
- Tipo de inventario.
- Objetivo principal de conversion.
- Referencias visuales.

El flujo recomendado es:

```txt
Analisis de marca
  -> arquitectura de contenido
  -> moodboard y direccion visual
  -> tokens de tema
  -> wireframes
  -> implementacion
  -> validacion
```

No empezar por cambiar colores en componentes sin haber definido el brief y los tokens.

## 13. Modulos del panel de plataforma

### MVP

- Resumen de proyectos.
- Crear/editar proyecto.
- Estado del proyecto.
- Configuracion de marca.
- Dominio y ambiente.
- Conexion Sanity.
- Estado de variables requeridas.
- Checklist de onboarding.
- Logs de auditoria.
- Enlaces de acceso al sitio, `/admin`, `/studio` y despliegue.

### Fase posterior

- Integracion Railway para variables y deploys.
- Integracion Sanity Management API.
- Provisionamiento de repositorios.
- Validacion automatica de dominios.
- Health checks programados.
- Rollback de despliegue.
- Versionado de template.
- Comparacion de configuracion entre proyectos.
- Backups iniciados desde el panel.

## 14. Arquitectura de implementacion

### Opcion recomendada

Implementar primero el panel dentro del repositorio actual como una superficie server-side separada, pero con limites claros:

- Carpeta/módulo: `app/panel-web-automotoras/`.
- Ruta UI futura: `/panel-web-automotoras`.
- Layout y componentes propios.
- Middleware propio para esa ruta.
- Cookie propia.
- Modulos de dominio propios bajo `lib/platform/`.
- Persistencia del Control Plane independiente del dataset de vehiculos.

Antes de guardar proyectos y secretos se debe elegir una persistencia adecuada. Sanity no debe ser el almacen de secretos del panel. Para metadata del Control Plane se puede usar PostgreSQL/Supabase u otra base dedicada; para secretos se debe usar Railway Variables o un secret manager.

### Limite de responsabilidad

El panel no debe importar componentes del `/admin` salvo primitives visuales totalmente neutros. `components/admin/` pertenece al flujo del cliente; `components/platform/` pertenecera al operador de la plataforma.

## 15. Seguridad minima del MVP

- Auth separada del `/admin`.
- Cookie separada.
- HTTPS obligatorio.
- No mostrar secretos despues de guardarlos.
- No guardar tokens en logs.
- Validar permisos en servidor, no solo ocultar botones.
- Rate limit de login y operaciones sensibles.
- Reautenticacion para rotar secretos o cambiar dominio.
- Auditoria de cambios.
- Proteccion CSRF mediante patrones nativos de Server Actions y validacion de origen cuando corresponda.
- Mensajes de error sin credenciales ni respuestas completas de proveedores.
- Backups de metadata del panel.

## 16. Criterios de aceptacion del SOT

- `/admin` continua operando igual para el cliente.
- Existe el módulo planificado `app/panel-web-automotoras/` sin mezclar permisos.
- La ruta UI `/panel-web-automotoras` se implementa sobre ese módulo cuando corresponda.
- Queirolo aparece como primer proyecto existente.
- El modelo de proyecto diferencia `existing` y `new`.
- La configuracion publica se puede editar sin tocar inventario.
- Los secretos se representan por referencias y estados, no por valores visibles.
- Existe checklist de alta de nuevo proyecto.
- Se documentan Sanity, dominio, despliegue y rollback.
- El panel registra auditoria sin secretos.
- Una nueva web obtiene proyecto Sanity y credenciales independientes.
- Las decisiones de infraestructura quedan asociadas al proyecto.

## 17. Fases de implementacion

### Fase 0 - Contrato y aislamiento

- [ ] Definir `TenantConfig`/`BrandConfig`.
- [ ] Definir modelo de `AutomotiveProject`.
- [ ] Definir auth separada.
- [ ] Definir almacenamiento de metadata.
- [ ] Definir estrategia de secretos.
- [ ] Registrar Queirolo como proyecto `existing`.

### Fase 1 - Shell seguro del Centro de Control

- [ ] Crear carpeta/módulo `app/panel-web-automotoras/`.
- [ ] Exponer la ruta UI `/panel-web-automotoras`.
- [ ] Crear layout de plataforma.
- [ ] Crear login separado.
- [ ] Crear middleware y cookie separados.
- [ ] Crear dashboard sin persistencia sensible.

### Fase 2 - Configuracion de proyectos

- [ ] CRUD de proyectos.
- [ ] Configuracion de marca.
- [ ] Configuracion de dominio.
- [ ] Asociacion de Sanity.
- [ ] Estados y checklist.
- [ ] Auditoria.

### Fase 3 - Provisionamiento

- [ ] Integrar variables sensibles del proveedor elegido.
- [ ] Validar conexion Sanity server-side.
- [ ] Validar dominio y health check.
- [ ] Registrar despliegues.
- [ ] Documentar rollback.

### Fase 4 - Plantilla reusable

- [ ] Extraer branding Queirolo.
- [ ] Separar assets.
- [ ] Tokenizar tema.
- [ ] Crear bootstrap de nueva web.
- [ ] Añadir validaciones de clone.
- [ ] Crear pruebas de aislamiento.

## 18. Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigacion |
|--------|--------------|------------|
| Filtracion de API keys | Alta | Secret manager, write-only, auditoria y no retorno del valor |
| Panel toma control del `/admin` | Media | Auth, cookie, middleware y modulos separados |
| Reutilizar dataset de Queirolo | Alta | Proyecto Sanity obligatorio por cliente y validacion de IDs |
| Branding anterior visible | Alta | Bootstrap con grep de identidad y asset manifest |
| Crear deploy parcial | Media | ProvisioningJob idempotente, estados y rollback |
| Escalar con rate limit local | Media | Una replica documentada o store compartido |
| Cambiar dominio sin rollback | Media | Confirmacion, auditoria y doble validacion |
| Control Plane como punto unico de fallo | Media | Backups, health checks y export de metadata |

## 19. Rollback

El rollback del panel debe poder:

- Suspender un proyecto sin borrar sus datos.
- Deshabilitar una integracion.
- Revertir configuracion publica a una version anterior.
- Revocar un secreto comprometido.
- Restaurar metadata del Control Plane.
- Mantener operativo el `/admin` del cliente aunque el panel de plataforma este fuera de servicio.

El panel nunca debe ser una dependencia runtime obligatoria para que la web publica o el `/admin` funcionen.

## 20. Definition of Done

- [ ] Esta iniciativa tiene SOT, roadmap, evidencia y rollback.
- [ ] `/admin` continua preservado como panel del cliente.
- [ ] Existe diseño aprobado del Centro de Control en `app/panel-web-automotoras/`.
- [ ] Auth y cookie de plataforma son independientes.
- [ ] Queirolo esta registrado como proyecto existente.
- [ ] Se definio contrato de configuracion por proyecto.
- [ ] Se definio manejo de secretos sin texto plano.
- [ ] Se documentaron fases y limites del MVP.
- [ ] Existen pruebas de autorizacion y aislamiento.
- [ ] `npm run lint`, `npm run test` y TypeScript pasan cuando exista codigo nuevo.
- [ ] Se actualizo `docs/logbook.md`.

## Referencias

- `docs/reference/automotive-platform-specification.md`
- `docs/reference/project-reference.md`
- `config.ts`
- `lib/admin/auth.ts`
- `lib/admin/session.ts`
- `lib/admin/vehicles.ts`
- `middleware.ts`
- `app/admin/`
- `sanity/schemaTypes/vehicle.ts`
- `next.config.js`
