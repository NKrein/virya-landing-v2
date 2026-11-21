import type { ComponentType } from "react";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/hero/Hero";
import { MarketingEnOrden } from "@/components/sections/MarketingEnOrden";
import { Presupuesto } from "@/components/sections/Presupuesto";
import { QuienesSomos } from "@/components/sections/QuienesSomos";
import { Workbook } from "@/components/sections/Workbook";

export type SectionEntry = {
  id: string;
  /** top = antes del <main>, main = dentro del <main>, bottom = después (footer) */
  slot: "top" | "main" | "bottom";
  Component: ComponentType;
};

/**
 * Registro de secciones: el ORDEN de este array es el orden en la página.
 * Para agregar una sección: crear su componente + su archivo en src/content/
 * y sumar una entrada acá. Ver docs/sections.md.
 */
export const sections: readonly SectionEntry[] = [
  { id: "announcement", slot: "top", Component: AnnouncementBar },
  { id: "hero", slot: "top", Component: Hero },
  { id: "workbook", slot: "main", Component: Workbook },
  { id: "marketing-en-orden", slot: "main", Component: MarketingEnOrden },
  { id: "presupuesto", slot: "main", Component: Presupuesto },
  { id: "quienes-somos", slot: "main", Component: QuienesSomos },
  { id: "footer", slot: "bottom", Component: Footer },
];
