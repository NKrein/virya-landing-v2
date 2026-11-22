"use client";

import { m } from "motion/react";
import { Stamp } from "@/components/ui/Stamp";
import type { PanelTone, Tile, TileTone } from "@/content";

/** Valores de color como variables CSS (Motion las resuelve al animar). */
export const toneBg = (tone: TileTone | PanelTone) => `var(--color-${tone})`;
export const toneInk = (tone: TileTone | PanelTone) =>
  tone === "tinta" ? "var(--color-blanco)" : "var(--color-tinta)";

type Props = {
  tile: Tile;
  size: "tile" | "full";
  /** Solo re-medir el título en aperturas/cierres (no durante la intro). */
  layoutDependency?: unknown;
};

/**
 * Tapa tipográfica de una tile: la misma composición en la grilla y a
 * pantalla completa. El título comparte layoutId para viajar en el morph.
 * En la grilla, los tamaños salen del ancho de la celda (container queries),
 * así crecen de forma continua con el celular.
 */
export function TileCover({ tile, size, layoutDependency }: Props) {
  if (!tile.cover) {
    return (
      <div className="v-cover v-cover--brand">
        <Stamp className="v-cover-stamp" />
      </div>
    );
  }
  return (
    <div className={`v-cover v-cover--${size}`} data-ink={tile.tone === "tinta" || undefined}>
      <span className="v-cover-n">N.º {tile.n}</span>
      <div className="v-cover-foot">
        <m.p
          layoutId={`tile-title-${tile.id}`}
          layoutDependency={layoutDependency}
          className="v-disp v-cover-title"
        >
          {tile.cover.title}
        </m.p>
        <p className="v-cover-note">{tile.cover.note}</p>
      </div>
    </div>
  );
}
