# Contenido (literales)

Todo el copy vive en `src/content/`, un archivo por sección. Los componentes no tienen texto visible hardcodeado.

| Archivo | Contenido |
|---|---|
| `site.ts` | marca, contacto, año, `budgetMailto` |
| `anchors.ts` | ids de ancla (`#workbook`, …) compartidos por menú y CTAs |
| `announcement.ts`, `nav.ts`, `hero.ts` | barra superior, menú, hero y perfil del celular (nombre, bio) |
| `tiles.ts` | las 6 tiles (orden, número, nombres, tapa, tonos) y textos del escenario (riel, pista, "Deslizá para seguir", cerrar) |
| `auditoria.ts`, `workbook.ts`, `marketing-en-orden.ts`, `presupuesto.ts`, `quienes-somos.ts` | secciones N.º 01–05 (contenido de cada tile) |
| `antes-de-irte.ts`, `footer.ts` | "Antes de irte" (reusa el texto de la auditoría) y footer |
| `offers.ts` | los 4 escalones de la oferta (fuente única de datos como el precio de la sesión) |
| `forms.ts` | pasos, preguntas, errores y mensajes finales de los formularios |
| `index.ts` | re-exporta todo: `import { hero } from "@/content"` |

## Cambiar copy
Editá el archivo de la sección. Los textos con variables usan `{clave}` y `fmt()` (`lib/format.ts`), p. ej. `"Listo, {name}."`.

## Convenciones
- Incluir también `aria-label`s y mensajes de error/éxito.
- Contenido que pasa a un Client Component debe ser serializable (sin funciones): por eso se usan plantillas `{n}` en vez de funciones.
- Un dato que aparece en dos lugares (ej. precio de la sesión) se define una vez (`offers.ts`) y se reutiliza con `getOffer()`.
- Links de pago/reserva marcados `PENDIENTE` se reemplazan acá.
