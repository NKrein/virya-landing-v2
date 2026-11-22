# Agregar, quitar o reordenar secciones

La página tiene dos niveles:

1. **Bloques de la página**, en [`src/lib/sections.ts`](../src/lib/sections.ts). El orden del array es el orden en la página: barra de anuncio → escenario de tiles → "Antes de irte" → footer. `slot` indica dónde va: `top` (antes de `<main>`), `main` o `bottom`.
2. **Tiles del escenario**, en [`src/content/tiles.ts`](../src/content/tiles.ts). El orden del array es el orden de la grilla, del riel y del recorrido con scroll. Cada tile abre una sección, que se conecta en [`src/components/stage/Tiles.tsx`](../src/components/stage/Tiles.tsx).

## Reordenar / quitar una tile
Mover o borrar su entrada en `tiles` (y, si se quita, su sección en `Tiles.tsx`). La grilla está pensada para **6 tiles** (2 × 3 en mobile, 3 × 2 en desktop). Con otro número hay que revisar `.v-grid` en `globals.css` y `cellInset` en `TileStage.tsx`.

Si cambia el número de una tile, actualizar también el folio de su sección (`src/content/<seccion>.ts`).

## Agregar una tile
1. Crear `src/content/mi-seccion.ts` con el copy (folio incluido) y exportarlo en `src/content/index.ts`.
2. Crear `src/components/sections/MiSeccion.tsx` (Server Component) que lea de `@/content`. Patrón típico:
   ```tsx
   <section id={anchors.miSeccion} aria-labelledby="mi-title" className="v-sec">
     <div className="v-wrap">
       <Folio {...c.folio} />
       <h2 id="mi-title" className="v-disp v-h2 m-0">{c.title}</h2>
     </div>
   </section>
   ```
3. Sumar su ancla en `src/content/anchors.ts`.
4. Agregar la tile en `src/content/tiles.ts`:
   - `id`, `n` (número), `label` (riel y barra) y `short` (historias del perfil y etiqueta del riel);
   - `anchor`;
   - `tone`: color de la tapa en la grilla (tonos off, tinta o blanco);
   - `panel`: fondo al abrirse, `"blanco"` o `"tinta"`;
   - `cover`: título y nota de la tapa.
5. Conectar la sección en `Tiles.tsx`: `panels={{ …, miId: <MiSeccion /> }}`.

Los links a la sección (`href("miSeccion")`) abren la tile automáticamente: el escenario intercepta los clicks en `#ancla`, los cambios de hash y el hash al cargar.

En mobile no hay que hacer nada extra: el flujo nativo (`MobileFlow.tsx`) usa las mismas tiles y secciones, con la tile como tapa al principio de cada sección.

## Secciones fuera del escenario
Para algo que no sea una tile (como "Antes de irte"), crear el componente y registrarlo en `sections.ts` con su `slot`. Después del escenario el scroll es libre, sin paradas.

Usar `"use client"` solo para lo interactivo: el escenario (`src/components/stage/`) y `ConversationalForm`. Las secciones siguen siendo Server Components y llegan al escenario ya renderizadas.
