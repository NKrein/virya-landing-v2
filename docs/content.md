# Contenido (literales)

Todo el copy vive en `src/content/`, un archivo por sección. Los componentes no tienen texto visible hardcodeado.

| Archivo | Contenido |
|---|---|
| `site.ts` | marca, contacto, año, `budgetMailto` |
| `anchors.ts` | ids de ancla (`#workbook`, …) compartidos por menú y CTAs |
| `announcement.ts`, `nav.ts`, `hero.ts` | barra superior, menú, hero y textos del mockup / historias |
| `offers.ts` | los 4 escalones (historias): nombre, precio, incluye, CTA |
| `workbook.ts`, `marketing-en-orden.ts`, `presupuesto.ts`, `quienes-somos.ts`, `footer.ts` | secciones N.º 01–04 y footer |
| `forms.ts` | pasos, preguntas, errores y mensajes finales de los formularios |
| `index.ts` | re-exporta todo: `import { hero } from "@/content"` |

## Cambiar copy
Editá el archivo de la sección. Los textos con variables usan `{clave}` y `fmt()` (`lib/format.ts`), p. ej. `"Listo, {name}."`.

## Convenciones
- Incluir también `aria-label`s y mensajes de error/éxito.
- Contenido que pasa a un Client Component debe ser serializable (sin funciones): por eso se usan plantillas `{n}` en vez de funciones.
- Un dato que aparece en dos lugares (ej. precio de la sesión) se define una vez (`offers.ts`) y se reutiliza con `getOffer()`.
- Links de pago/reserva marcados `PENDIENTE` se reemplazan acá.
