import type { ComponentType } from "react";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { AntesDeIrte } from "@/components/sections/AntesDeIrte";
import { Footer } from "@/components/sections/Footer";
import { Tiles } from "@/components/stage/Tiles";

export type SectionEntry = {
  id: string;
  /** top = antes del <main>, main = dentro del <main>, bottom = después (footer) */
  slot: "top" | "main" | "bottom";
  Component: ComponentType;
};

/**
 * Registro de bloques de la página: el ORDEN de este array es el orden en la página.
 * El hero y las secciones de contenido viven dentro del escenario de tiles: el
 * orden y la tapa de cada tile se definen en src/content/tiles.ts y se conectan
 * en src/components/stage/Tiles.tsx.
 * Ver docs/sections.md.
 */
export const sections: readonly SectionEntry[] = [
  { id: "announcement", slot: "top", Component: AnnouncementBar },
  { id: "tiles", slot: "main", Component: Tiles },
  { id: "antes-de-irte", slot: "bottom", Component: AntesDeIrte },
  { id: "footer", slot: "bottom", Component: Footer },
];
