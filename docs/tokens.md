# Tokens

Única fuente: [`src/styles/tokens.css`](../src/styles/tokens.css).

- **`@theme`** (Tailwind v4): colores, familias, escala tipográfica, radios, sombras, easings y el breakpoint `desk` (900px). Generan utilidades: `bg-tinta`, `text-terracota`, `border-line`, `font-display`, `rounded-md`, `shadow-paper`, `desk:…`.
- **`:root`**: espaciado (`--space-1..4`), layout (gutters, ancho máximo, padding de sección), tamaños fluidos de h1/h2, duraciones y opacidad del grano. Se usan con `var(--…)`, sobre todo en `globals.css`.
- **Escenario de tiles**:
  - `--phone-*`: tamaño del celular, con proporción de teléfono (pantalla 9:19,5) y altura fija.
  - `--rail-safe`: espacio que el contenido deja libre para el riel en desktop.
  - `--dur-tile-*` / `--dur-reveal`: tiempos de apertura y cierre. Tienen su espejo en TS en `src/lib/motion.ts` (springs de Motion); si se cambia uno, cambiar el otro.

Colores base: `tinta #292521`, `blanco #FFFFFF`, `terracota #9A4F37`, y los "off" (`crema`, `terracota-off`, `tinta-off`) solo para piezas chicas. Los semánticos (`line`, `on-ink-*`, `ink-muted`…) derivan de ellos.

Reglas:
1. No escribir hex, px de tipografía ni duraciones sueltos en componentes: usar un token (o crearlo).
2. Para cambiar la paleta basta editar los valores en `@theme`; todo se propaga.
3. Las fuentes se cargan en `src/app/layout.tsx` (`next/font`) y se exponen como `--font-fraunces/dm-sans/caveat`, que `tokens.css` mapea a `--font-display/sans/hand`.
4. Los keyframes y patrones repetidos (`.v-wrap`, `.v-folio`, `.v-disp`, `.v-grain`…) están en `src/app/globals.css` y consumen tokens.
