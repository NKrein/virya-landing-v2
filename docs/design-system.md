# Sistema de diseño y decisiones de diseño

Documento de referencia del diseño original de Virya (v10, "landing clásica"), que reemplaza al prototipo que vivía en `src/web-design-reference/`. Los valores concretos están en [`src/styles/tokens.css`](../src/styles/tokens.css); el copy, en [`src/content/`](../src/content); el layout, en los componentes.

## Estructura de la página (de arriba a abajo)
1. **Barra superior** (tinta): anuncio del workbook, lleva a su sección.
2. **Menú**: wordmark, links a Workbook, Marketing en orden y Auditoría gratis, botón "Escribinos" (`mailto`). En mobile solo wordmark + "Escribinos".
3. **Hero**: titular con tachado y mockup de Instagram con historias destacadas y grilla decorativa de 3 cuadros.
4. **N.º 01 Workbook**: tablet con la tapa, chips, desplegable de módulos, precio de lanzamiento y botón de compra.
5. **N.º 02 Marketing en orden** (bloque tinta): gancho, "Qué incluye", tarjeta de presupuesto y tarjeta de sesión estratégica.
6. **N.º 03 Proyectos a medida**: chips y formulario conversacional en "hoja de papel" con cinta.
7. **N.º 04 Quiénes somos**: tres especialidades numeradas.
8. **Footer** (tinta): newsletter + mini auditoría (formulario de 2 pasos), wordmark y contacto.

Cada sección abre con un **folio** editorial: línea fina, "N.º 0X", nombre y nota en Caveat.

## Color
Paleta mínima de tres: **blanco** (base, ~75%), **tinta** (protagonista oscura, ~17%) y **terracota** (acento, ~8%). Más tres tonos "off" para piezas chicas.

| Token | Hex | Uso |
|---|---|---|
| `blanco` | `#FFFFFF` | Fondo base, con textura de papel muy sutil. Tinta encima ≈15:1. |
| `tinta` | `#292521` | Texto, botones secundarios, barra superior, historias, una sección destacada, footer. Texto blanco encima. |
| `terracota` | `#9A4F37` | Botones principales, punto del logo, estampilla, subrayados y círculos a mano, notas en Caveat, numeraciones, errores. Texto blanco encima ≈6:1. **Nunca** como fondo de secciones enteras. |
| `crema` | `#F6EEE6` | Fondos de piezas chicas (recortes, mosaicos, tarjetas pequeñas). No es fondo de página ni de secciones. |
| `terracota-off` | `#EFDCD3` | Fondos de piezas chicas. Tinta encima ≈12:1. **Nunca** para texto. |
| `tinta-off` | `#E7E4E0` | Fondos de piezas chicas. Tinta encima ≈12:1. **Nunca** para texto. |

Reglas:
- Las secciones se separan con espacio y líneas finas (`--color-line`), no con bloques de color.
- No hay navy.
- Todo el texto cumple contraste AA.

## Tipografía
- **Fraunces**: solo titulares. Liviana (300–400), `"SOFT" 50, "WONK" 1`. El 600 queda únicamente para el wordmark `virya.`.
- **DM Sans**: todo lo que se lee (cuerpo, botones, etiquetas, números).
- **Caveat**: solo notas cortas al margen ("una voz que comenta").

Escala del design system (`--text-*` en tokens): display-xl 72/76, display-l 48/54, display-m 32/38, body-l 18/28, body 16/26, label 12/16 (700), annotation 26/30 (500). Espaciado: 8 / 16 / 24 / 48. Radios: 4 (etiquetas, inputs), 8 (tarjetas, botones, imágenes), 999 (pills, isotipo).

## Logo
- Wordmark `virya.`: Fraunces 600, tinta, con el punto en terracota.
- La **estampilla** terracota (`public/assets/estampilla.svg`) es el único logo redondo: foto de perfil, avatar, sello del hero y favicon.
- El wordmark **nunca** va junto a la estampilla.

## Textura de papel
Filtro SVG `feTurbulence` aplicado con `mix-blend-mode: multiply` sobre blanco y `screen` sobre tinta (`GrainFilters` / `GrainOverlay`). Es muy sutil; si afecta el rendimiento, reemplazar por un PNG de ruido.

## Responsive
- Mobile first a **390px**, gutter lateral de 20px.
- Breakpoint único en **900px** (`desk:`): el hero pasa a dos columnas, el celular se enmarca como teléfono de 390px y el gutter sube a 56px.
- Todos los objetivos táctiles miden **44px o más**.

## Interacciones
**Historias destacadas** (mockup de Instagram): 4 círculos numerados, uno por escalón de la oferta (auditoría, workbook, sesión, Marketing en orden). Al tocar uno se abre una "historia" a pantalla completa dentro del celular con barra de progreso que se llena, navegación al escalón anterior/siguiente y botón de cerrar. Las vistas quedan con aro gris. El primer círculo late suavemente hasta que se toca alguno.

**Formularios conversacionales**: una pregunta por vez, con animación corta entre pasos. Se puede volver al paso anterior. El email se valida con una regex simple. Al terminar, confirmación personalizada con el nombre.

**Animaciones**: el trazo a mano del titular se dibuja al cargar; la estampilla gira lento; las cintas "se pegan" al aparecer; algunos elementos suben al entrar en pantalla (`animation-timeline: view()`, sin soporte quedan quietos y visibles). Todo respeta `prefers-reduced-motion`.

## Qué cambió respecto del prototipo original
- Estilos inline → clases Tailwind y tokens; clases `vw-*` → `v-*` (solo las usadas).
- Footer: se omitieron `height:652px; width:481px` y el tamaño fijo del wordmark (artefactos del export); layout fluido.
- Formularios: foco automático al avanzar de paso y `aria-invalid` en error.
- El foco visible en bloques tinta es blanco.

## Pendientes de negocio
- **Newsletter / mini auditoría:** conectar Substack u otro servicio → `src/lib/submit-form.ts` (`"audit"`). Al suscribirse se entrega el PDF de la mini auditoría.
- **Formulario de presupuesto:** definir destino (email o herramienta) → `submit-form.ts` (`"budget"`).
- **Comprar y descargar:** link de Mercado Pago con entrega automática del PDF (ej. webhook MP → n8n → email) → `content/workbook.ts`.
- **Reservar mi sesión:** link de Calendly o similar → `content/marketing-en-orden.ts`.
- **Escribinos / Pedir presupuesto:** hoy `mailto:support@virya.ar` (`content/site.ts`); confirmar que la casilla exista.
- **SEO:** meta description final, imagen Open Graph y favicons en varios tamaños (`src/app/layout.tsx`).
