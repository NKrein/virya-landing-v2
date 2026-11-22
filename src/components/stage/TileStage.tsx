"use client";

import type { ReactNode } from "react";
import type { TileId } from "@/content";
import { DesktopStage } from "./DesktopStage";
import { MobileFlow } from "./MobileFlow";
import { useStageMode } from "./useStableViewport";

type Props = {
  nav: ReactNode;
  hero: ReactNode;
  panels: Partial<Record<TileId, ReactNode>>;
};

/**
 * Elige la experiencia según el viewport (cambia en vivo al cruzar 900px):
 * - servidor / sin JS / hidratando: DesktopStage en modo flujo (secciones en orden);
 * - desktop (≥ 900px): escenario de tiles;
 * - mobile (< 900px): flujo nativo con la intro del celular (MobileFlow).
 */
export function TileStage(props: Props) {
  const mode = useStageMode();
  return mode === "mobile" ? <MobileFlow {...props} /> : <DesktopStage {...props} />;
}
