# Virya — Landing v2

Landing de **Virya Marketing Studio**. Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript.
Sobre la base visual del diseño original, la página es un **escenario de tiles**: un celular con el perfil de Instagram cuya grilla crece con el scroll, y cada tile se abre como una sección (ver [docs/design-system.md](docs/design-system.md)). Las transiciones usan [Motion](https://motion.dev).

## Comandos

```bash
npm run dev     # desarrollo en http://localhost:3000
npm run build   # build de producción (la página es 100% estática)
npm run lint
```

> Este Next.js tiene cambios respecto de versiones anteriores: ante la duda, leé `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Estructura

```
src/
  app/                 layout (fuentes, metadata), page (compone secciones), globals.css, icon.svg
  styles/tokens.css    TOKENS: colores, tipografía, radios, sombras, espaciado, movimiento
  content/             LITERALES: un archivo por sección (+ site, nav, offers, forms)
  components/
    ui/                piezas reutilizables (Button, Chip, Folio, GrainOverlay, Stamp…)
    sections/          una carpeta/archivo por sección de la página
    stage/             escenario de tiles: celular, grilla, apertura/cierre, scroll, riel
    forms/             ConversationalForm (formulario de una pregunta por vez)
  lib/                 sections.ts (registro/orden), mailto, format, submit-form
docs/                  guías: tokens, content, sections, design-system
```

## Cambios habituales

| Quiero… | Dónde |
|---|---|
| Cambiar un color, tipografía, radio, duración | `src/styles/tokens.css` → [docs/tokens.md](docs/tokens.md) |
| Cambiar copy de una sección | `src/content/<seccion>.ts` → [docs/content.md](docs/content.md) |
| Agregar, quitar o reordenar una tile / sección | `src/content/tiles.ts` y `src/lib/sections.ts` → [docs/sections.md](docs/sections.md) |
| Ajustar transiciones o el recorrido con scroll | `src/components/stage/` → [docs/design-system.md](docs/design-system.md#escenario-de-tiles-v3) |
| Conectar formularios / pagos / reservas | [docs/design-system.md](docs/design-system.md#pendientes-de-negocio) |
