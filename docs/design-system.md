# Sistema de diseño y decisiones de diseño

Documento de referencia del diseño de Virya. La base visual (color, tipografía, logo, textura) es la del diseño original (v10, "landing clásica"); la estructura y las interacciones son las del **escenario de tiles** (v3, ver más abajo). Los valores concretos están en [`src/styles/tokens.css`](../src/styles/tokens.css); el copy, en [`src/content/`](../src/content); el layout, en los componentes.

## Estructura de la página (de arriba a abajo)
1. **Barra superior** (tinta): anuncio del workbook, lleva a su tile.
2. **Escenario de tiles** (un solo bloque fijo mientras se scrollea):
   - **Hero**: menú, titular con tachado y un **celular** con el perfil de Instagram (avatar, bio, historias destacadas) y la **grilla de 6 tiles**.
   - Con el scroll, el celular crece hasta que la grilla ocupa la pantalla.
   - Cada tile es una sección que se abre, se lee y se vuelve a cerrar:
     - **N.º 01 Auditoría gratis** (tinta): newsletter + mini auditoría.
     - **N.º 02 Workbook**: tablet con la tapa, chips, módulos, precio y compra.
     - **N.º 03 Marketing en orden** (tinta): servicio mensual + sesión estratégica.
     - **N.º 04 Proyectos a medida**: chips + formulario conversacional en "hoja de papel".
     - **N.º 05 Quiénes somos**: tres especialidades.
     - **06 virya.**: tile de marca (estampilla); no abre, lleva a "Antes de irte".
3. **Antes de irte** (tinta): newsletter + mini auditoría, para quien llegó al final.
4. **Footer** (tinta, unido al anterior por una línea fina): wordmark y contacto.

Cada sección abre con un **folio** editorial: línea fina, "N.º 0X", nombre y nota en Caveat. Con la tile abierta, arriba del folio va el encabezado de marca (isotipo + wordmark).

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
- Wordmark `virya.`: Fraunces 600, tinta, con el punto en terracota. Como SVG en `public/assets/virya-logo.svg` y como componente [`Wordmark`](../src/components/ui/Wordmark.tsx) (las letras toman el color del texto, así sirve sobre tinta).
- Isotipo (V en círculo terracota, `public/assets/virya-isotipo.svg`): encabezado de las tiles abiertas, junto al wordmark, y marca del 06 en el riel.
- La **estampilla** terracota (`public/assets/estampilla.svg`) es el único logo redondo: foto de perfil, avatar, sello del hero y favicon.
- El wordmark **nunca** va junto a la estampilla.

## Textura de papel
`GrainOverlay`: un SVG con `feTurbulence` usado como **imagen de fondo en mosaico** (data URI en `.v-grain`, `globals.css`), con puntos oscuros sobre claro y claros sobre tinta.
- Se rasteriza una vez: no es un filtro en vivo ni usa `mix-blend-mode`, así que es barato de componer y de scrollear, también en mobile.
- Reemplazó al filtro en vivo con el mismo aspecto (brillo y variación iguales en la comparación).
- Va en el contenedor completo (escenario, panel, sección mobile), no solo en una parte, para que no haya cortes de tono.

## Responsive
- Mobile first a **390px**, gutter lateral de 20px.
- Breakpoint único en **900px** (`desk:`). Cambia también **la experiencia**: desde 900px es el escenario de tiles (abajo); debajo, el **flujo nativo mobile** (ver "Mobile"). Desde 900px:
  - el hero pasa a dos columnas;
  - la grilla de tiles pasa de 2 × 3 a 3 × 2;
  - el testigo pasa de barra superior a riel lateral;
  - el gutter sube a 56px.
- **Alturas estables:** nunca `dvh` para layout, porque cambia con la barra del navegador y hace saltar el scroll. Se usa:
  - `100lvh` para contenedores fijos (escenario, pantalla del celular);
  - `svh` para lo que tiene que verse sí o sí;
  - en JS, `lvh`/`svh` medidos una vez con elementos sonda (`useStableViewport.ts`), que se vuelven a medir solo si cambia el ancho.
- El celular tiene proporción de teléfono (pantalla 9:19,5) y altura fija; se achica solo si la pantalla no alcanza. Dentro, la grilla usa celdas 3:4 como el perfil de Instagram.
- Todos los objetivos táctiles miden **44px o más**.

## Escenario de tiles (v3, desktop ≥ 900px)
Código en [`src/components/stage/`](../src/components/stage) ([`DesktopStage.tsx`](../src/components/stage/DesktopStage.tsx); [`TileStage.tsx`](../src/components/stage/TileStage.tsx) elige entre desktop y mobile). Todo se maneja con el scroll; un click en una tile, una historia, el riel o un link con ancla abre directo esa tile.

### Recorrido
Un track alto con un escenario `sticky` de 100lvh. Las paradas, en orden, son:
1. **Hero.**
2. **Grilla a pantalla completa** (solo al principio).
3. Por cada tile:
   - **inicio de lectura**;
   - **final del contenido** (si es más largo que la pantalla).
4. **Final de la página** ("Antes de irte" + footer).

Entre tile y tile **no hay parada en la grilla**: un gesto pasa directo de una sección a la siguiente, mostrando el cierre de una (la grilla se ve un instante) y la apertura de la otra. La × y Esc llevan a la grilla entre esa tile y la siguiente; desde ahí, el próximo gesto va a la tile de arriba o de abajo.

La lógica es pura y está en [`resolveStage.ts`](../src/components/stage/resolveStage.ts) (qué tile está abierta según el scroll, con histéresis) y en [`introGeometry.ts`](../src/components/stage/introGeometry.ts) (dónde está el celular en cada momento de la intro).

### Movimiento
- **Intro (sigue al scroll):** el celular crece desde la columna derecha hasta que su pantalla, que **es** la grilla, ocupa todo. El texto del hero se va, el perfil se pliega y el marco se desvanece.
- **Apertura (duración fija, ~0,5 s):** la tile crece desde su celda hasta la pantalla (layout compartido de Motion). El color va del tono de la tapa al fondo del panel y el título viaja. El contenido real entra al mismo ritmo, revelado por un recorte que crece con la tile.
- **Cierre (~0,42 s, más corto que la apertura):** el contenido se va y la tile vuelve a su celda, sin pasarse. Si se saltean varias tiles, el cierre es corto (0,25 s) y no se reproducen las intermedias.
- **Lectura:** el contenido de la tile abierta se desplaza 1:1 con el scroll nativo; no hay scroll interno.
- Curvas y duraciones: tokens `--dur-tile-*` y su espejo en [`src/lib/motion.ts`](../src/lib/motion.ts). Aperturas y cierres son springs sin rebote: orgánicos y predecibles.

### Scroll "un gesto, una parada"
[`useStepScroll.ts`](../src/components/stage/useStepScroll.ts):
- El scroll es nativo (inercia, teclado, barra), pero un gesto no pasa de largo la parada siguiente.
- Si el usuario suelta entre dos paradas, el recorrido termina en la dirección en que venía; si se movió menos de ~6% de pantalla, vuelve.
- Varios gestos seguidos avanzan una parada cada uno.
- Dentro de una lectura larga y después del escenario, el scroll es libre.
- Reemplaza a `scroll-snap` (`mandatory` + `snap-stop`), que en la práctica no garantiza detenerse en cada parada.
- **Solo con mouse o trackpad (`pointer: fine`).** En táctil (por ejemplo, un iPad horizontal, que ve el escenario de desktop) queda apagado y el scroll es nativo, porque llamar a `scrollTo` durante la inercia del dedo pelea con iOS. Limitación conocida: ahí un gesto largo puede pasar más de una tile.

### Testigo de posición
- **Desktop: riel lateral derecho.**
  - Una marca por tile; la activa se alarga y muestra su nombre, y se llena con la lectura.
  - El 06 lleva el isotipo.
  - Es del **color opuesto** al panel abierto: oscuro sobre blanco, claro sobre tinta.
  - Debajo de la lista, en el mismo contenedor, va el aviso "Deslizá para seguir".
  - El contenido deja libre a la derecha `--rail-safe` (232px) para que el riel y su etiqueta nunca lo tapen.
- **Cerrar:** círculo con fondo de contraste (× o Esc) que vuelve a la grilla.

### Tapas
- Tipográficas: número, título en Fraunces y nota en Caveat.
- Escalan con la celda (container queries).
- En la grilla usan los tonos off (son piezas chicas); al abrirse, el color interpola al fondo del panel (blanco o tinta). Así los tonos off nunca son fondo de una sección.
- Dentro de un panel, el fondo y el grano son del panel completo, no de la sección (reglas fuera de `@layer` al final de `globals.css`).

### Accesibilidad
- Los paneles cerrados son `inert`.
- Con click, el foco pasa al panel; con Tab, el elemento enfocado se trae a la vista.
- Con **`prefers-reduced-motion`**: misma estructura, pero cada etapa es un estado fijo con fundidos cortos (sin escalar ni morph).
- **Sin JS** la página se renderiza en flujo normal (hero con el celular quieto + secciones) y las tiles son links a cada sección.

## Mobile (< 900px): flujo nativo
Código en [`MobileFlow.tsx`](../src/components/stage/MobileFlow.tsx). En táctil, un escenario fijo que abre y cierra tiles con el scroll choca con la inercia nativa y con la barra del navegador. Por eso en mobile solo la intro tiene paradas obligatorias (ver abajo); desde la N.º 01 el **scroll es 100% nativo**.

### Recorrido
1. **Intro de un movimiento** ([`useIntroPager.ts`](../src/components/stage/useIntroPager.ts)). Tres paradas obligatorias: **hero → grilla expandida → inicio de la N.º 01**.
   - Cualquier gesto en esa zona (dedo, rueda, trackpad, teclado) lleva a la parada siguiente en su dirección con una transición animada de ~1s, sin importar el largo del gesto; la inercia sobrante se absorbe.
   - Hacia arriba es igual: de la 01 a la grilla, de la grilla al hero. En el hero, hacia arriba no hay parada: el gesto se deja pasar ("tirar para recargar").
   - Si el scroll nativo deja la página a medio camino de la intro (por ejemplo, volviendo desde la 01), se completa hasta la parada más cercana en su dirección.
   - Durante la transición, el celular asoma **siempre debajo del texto del hero** (se mide; nunca se superpone), sube sin detenerse y crece hasta que la grilla llena la pantalla.
2. **Grilla** a pantalla completa: es una parada; el gesto siguiente la lleva hacia arriba y abre la 01.
3. **Secciones una debajo de la otra**, en el orden de las tiles, con scroll nativo. Cada una abre con su **tapa** (una tarjeta igual a la tile) que "se abre" al entrar en pantalla: escala y opacidad con `animation-timeline: view()`, en la GPU y sin JS.
4. **"Antes de irte" + footer.**

### Intro sin layout por cuadro
La geometría pura está en [`mobileIntro.ts`](../src/components/stage/mobileIntro.ts):
- La pantalla del celular se renderiza **siempre** a tamaño de pantalla completa (ancho × 100lvh) y se **escala** para el estado "celular": solo `transform`/`opacity`, sin cambios de tamaño ni recálculo de container queries.
- El celular es lo más grande que entra (ancho − 32px, sin pasarse del alto visible).
- El perfil no se pliega: el contenido de la pantalla es [perfil][grilla], y al crecer se traslada hacia arriba, como scrollear un perfil de Instagram.
- La última fila de la grilla reserva abajo la diferencia `100lvh − 100svh`, así su texto nunca queda debajo de la barra del navegador.

### Navegación y testigo
- Tocar una tile, una historia o un link con ancla hace scroll suave a esa sección (con `scroll-padding-top` igual a la barra).
- **Barra superior fija** (aparece al pasar la grilla):
  - segmentos tipo historias que se llenan con la lectura;
  - "N.º 02 · Workbook";
  - botón **"Ver todas"** (ícono de grilla), que vuelve a la grilla.
- La sección activa es la que cruza el 45% de la pantalla.

### Rendimiento
- Medido con la CPU 4× y 6× más lenta: 60fps estables en la intro, las tapas y la lectura.
- Con la página quieta: cero layouts por cuadro.
- Las animaciones infinitas tienen que ser de elementos HTML con `transform`/`opacity`. Por ejemplo, la ruedita del aviso de scroll es un `<span>`: animar un `<rect>` SVG provocaba un layout por cuadro todo el tiempo.

## Interacciones
**Formularios conversacionales**:
- Una pregunta por vez, con animación corta entre pasos. Se puede volver al paso anterior.
- El email se valida con una regex simple.
- Al terminar, confirmación personalizada con el nombre.
- Cada instancia usa ids propios (`useId`): el formulario de auditoría está dos veces, en la tile 01 y en "Antes de irte".

**Animaciones**:
- El trazo a mano del titular se dibuja al cargar y la estampilla gira lento.
- Las cintas "se pegan" al aparecer.
- Todo respeta `prefers-reduced-motion`.

## Qué cambió respecto del prototipo original
- Estilos inline → clases Tailwind y tokens; clases `vw-*` → `v-*` (solo las usadas).
- Footer: se omitieron `height:652px; width:481px` y el tamaño fijo del wordmark (artefactos del export); layout fluido.
- Formularios: foco automático al avanzar de paso y `aria-invalid` en error.
- El foco visible en bloques tinta es blanco.

## Pendientes de negocio
- **Newsletter / mini auditoría** (tile 01 y "Antes de irte"): conectar Substack u otro servicio → `src/lib/submit-form.ts` (`"audit"`). Al suscribirse se entrega el PDF de la mini auditoría.
- **Formulario de presupuesto:** definir destino (email o herramienta) → `submit-form.ts` (`"budget"`).
- **Comprar y descargar:** link de Mercado Pago con entrega automática del PDF (ej. webhook MP → n8n → email) → `content/workbook.ts`.
- **Reservar mi sesión:** link de Calendly o similar → `content/marketing-en-orden.ts`.
- **Escribinos / Pedir presupuesto:** hoy `mailto:support@virya.ar` (`content/site.ts`); confirmar que la casilla exista.
- **SEO:** meta description final, imagen Open Graph y favicons en varios tamaños (`src/app/layout.tsx`).
