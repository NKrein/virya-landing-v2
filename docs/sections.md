# Agregar, quitar o reordenar secciones

El orden de la página lo define el array de [`src/lib/sections.ts`](../src/lib/sections.ts). `slot` indica dónde va: `top` (antes de `<main>`), `main`, `bottom` (footer).

## Reordenar / quitar
Mover o borrar la entrada en `sections`.

## Agregar
1. Crear `src/content/mi-seccion.ts` con el copy y exportarlo en `src/content/index.ts`.
2. Crear `src/components/sections/MiSeccion.tsx` (Server Component) que lea de `@/content`. Patrón típico:
   ```tsx
   <section id={anchors.miSeccion} aria-labelledby="mi-title" className="v-sec">
     <div className="v-wrap">
       <Folio {...c.folio} />
       <h2 id="mi-title" className="v-disp v-h2">{c.title}</h2>
     </div>
   </section>
   ```
3. Si necesita ancla, sumarla en `src/content/anchors.ts` (y al menú en `nav.ts` si corresponde).
4. Registrar: `{ id: "mi-seccion", slot: "main", Component: MiSeccion }`.

Usar `"use client"` solo para lo interactivo (hoy: `InstagramMockup` y `ConversationalForm`).
