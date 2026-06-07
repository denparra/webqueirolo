# IMP-20260606-001 — Entrega de leads vía WhatsApp (canal transitorio pre-lanzamiento)

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260606-001 |
| **Fecha**   | 2026-06-06 |
| **Owner**   | denparra |
| **Estado**  | in-progress |
| **Log ref** | LOG-20260606-001 |
| **Rama**    | `fix/leads-whatsapp-prelaunch` |

## Objetivo

Resolver el bloqueante de negocio detectado en la auditoría pre-producción: el endpoint `/api/submit-lead` validaba y aplicaba rate-limit pero **no entregaba los leads a ningún lado** (solo `console.log` + `TODO`), por lo que toda solicitud de contacto/financiamiento/consignación se perdía mientras el usuario veía "¡Enviado!". Se habilita WhatsApp como **canal transitorio** para llegar al lanzamiento (lunes), dejando el endpoint **preparado** para la integración server-side futura con n8n.

## Decisión (origen)

- **Canal inmediato:** WhatsApp. Al enviar, el formulario abre `wa.me` con el mensaje pre-cargado (todos los datos). El lead llega al WhatsApp del negocio.
- **Canal futuro:** n8n → correo con la solicitud. Será integración server-side vía `/api/submit-lead` + webhook.
- Esta implementación es **explícitamente transitoria**.

## Alcance

**Incluye:**
- Nuevo `lib/leads.ts`: contrato `Lead`, `formatLeadMessage` y `getLeadWhatsAppUrl` (punto único de formateo y entrega).
- `components/forms/ContactForm.tsx`, `FinancingForm.tsx`, `ConsignmentForm.tsx`: `handleSubmit` pasa a abrir WhatsApp con el lead completo; textos de botón/estado a "Enviar por WhatsApp".
- `app/api/submit-lead/route.ts`: schema expandido al contrato `Lead` completo (recupera RUT/comuna que antes Zod descartaba) + reenvío a `N8N_LEAD_WEBHOOK_URL` (env-gated, preparado para n8n).
- `app/robots.ts`: `/studio` agregado al `disallow` (el CMS de Sanity quedaba indexable).

**Excluye:**
- La integración n8n real (queda preparada, no activada).
- El campo honeypot oculto en los forms (el spam de entrega no aplica al canal WhatsApp; se retoma con n8n).
- Tanda 3 (env.example, withSentryConfig, CSP, tasa de calculate-loan): follow-up post-lanzamiento.

## Pasos de implementación

- [x] Crear `lib/leads.ts` con contrato `Lead` + formateo + builder `wa.me` (reusa `getWhatsAppUrl` y `config.contact.whatsapp`).
- [x] `ContactForm`: entrega vía WhatsApp.
- [x] `FinancingForm`: entrega vía WhatsApp con RUT y comuna (antes se perdían).
- [x] `ConsignmentForm`: entrega vía WhatsApp con datos estructurados del vehículo.
- [x] `/api/submit-lead`: schema completo + reenvío a n8n env-gated (preparado).
- [x] `robots.ts`: bloquear `/studio`.
- [ ] Verificación manual del deep link en local (forms abren WhatsApp con el texto correcto).

## Impacto esperado

- **Negocio:** los leads dejan de perderse; llegan al WhatsApp del negocio con todos los datos.
- **Privacidad/datos:** RUT y comuna del financiamiento ya no se pierden.
- **SEO:** el panel `/studio` deja de ser crawleable.
- **UX:** el botón comunica el canal real ("Enviar por WhatsApp"); el usuario confirma el envío en el chat.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| El usuario no presiona "enviar" en WhatsApp y el lead no llega | media | Es inherente al canal `wa.me`; el botón y el estado lo explican. Mitigación definitiva = integración n8n server-side. |
| Bloqueo de pop-ups al abrir WhatsApp | baja | `window.open` se dispara desde el submit (gesto del usuario); navegadores lo permiten. |
| El número de WhatsApp cambia | baja | Centralizado en `config.contact.whatsapp`. |

## Rollback

- `git revert` del commit de la rama, o volver a `handleSubmit` con `fetch('/api/submit-lead')`. El endpoint sigue existiendo y funcional.

## Evidencia de validación

- [x] `npx tsc --noEmit` → sin errores en archivos modificados (único error preexistente y ajeno: `__tests__/smoke.test.ts`).
- [x] `npx next lint` sobre archivos modificados → `✔ No ESLint warnings or errors`.
- [ ] Verificación manual en local: cada form abre WhatsApp con el mensaje completo y correcto.

## Definition of Done

- [x] Carpeta `IMP-20260606-001/` con `IMP.md`.
- [x] Registrado en `docs/logbook.md` (LOG-20260606-001).
- [x] Impacto, riesgos, rollback y naturaleza transitoria documentados.
- [ ] Verificación manual del deep link.
- [ ] Commit/merge (cuando el usuario lo indique).

## Pendientes / follow-up

- **Integración n8n (reemplazo de este canal):** setear `N8N_LEAD_WEBHOOK_URL` + volver los forms a `POST /api/submit-lead`. El endpoint ya reenvía al webhook.
- **Honeypot:** agregar el `<input hidden>` en los forms cuando vuelva el canal server-side.
- **Tanda 3 post-lanzamiento:** `.env.example`, `withSentryConfig` en `next.config.js`, `Content-Security-Policy`, verificar tasa por defecto de `/api/calculate-loan` (1.5 vs 12% anual).

## Referencias

- `claudedocs/00-Analysis-Planning/2026-06-05-performance-audit.md` (contexto pre-prod)
- `lib/leads.ts`, `components/forms/{ContactForm,FinancingForm,ConsignmentForm}.tsx`, `app/api/submit-lead/route.ts`, `app/robots.ts`
- `config.ts` (`contact.whatsapp`), `lib/utils.ts` (`getWhatsAppUrl`)
