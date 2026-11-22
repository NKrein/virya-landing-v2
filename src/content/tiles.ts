import type { anchors } from "./anchors";

/** Tono de la tapa en la grilla (piezas chicas: acá sí van los tonos "off"). */
export type TileTone = "terracota-off" | "crema" | "tinta" | "tinta-off" | "blanco";

/** Fondo del panel abierto. La tapa interpola de su tono a este fondo al abrirse. */
export type PanelTone = "blanco" | "tinta";

export type TileId = "audit" | "workbook" | "marketing" | "projects" | "about" | "brand";

export type Tile = {
  id: TileId;
  /** Número del folio y del riel: "01"… */
  n: string;
  /** Nombre: riel lateral y barra mobile */
  label: string;
  /** Etiqueta corta bajo la historia destacada del perfil */
  short: string;
  /** Ancla de la sección que abre (o del footer, en la tile de marca) */
  anchor: keyof typeof anchors;
  tone: TileTone;
  /** null = tile "de marca": no abre, lleva a "Antes de irte" (newsletter + contacto) */
  panel: PanelTone | null;
  cover: { title: string; note: string } | null;
};

/**
 * Las 6 tiles de la grilla. El ORDEN de este array es el orden de la grilla,
 * del riel y del recorrido con scroll. Ver docs/sections.md.
 */
export const tiles: readonly Tile[] = [
  {
    id: "audit",
    n: "01",
    label: "Auditoría gratis",
    short: "Auditoría",
    anchor: "audit",
    tone: "terracota-off",
    panel: "tinta",
    cover: { title: "Mini auditoría gratis", note: "empezá por acá" },
  },
  {
    id: "workbook",
    n: "02",
    label: "Workbook",
    short: "Workbook",
    anchor: "workbook",
    tone: "crema",
    panel: "blanco",
    cover: { title: "Engagement en Instagram que vende", note: "a tu ritmo" },
  },
  {
    id: "marketing",
    n: "03",
    label: "Marketing en orden",
    short: "Marketing",
    anchor: "marketingEnOrden",
    tone: "tinta",
    panel: "tinta",
    cover: { title: "Marketing en orden", note: "mes a mes" },
  },
  {
    id: "projects",
    n: "04",
    label: "Proyectos a medida",
    short: "Proyectos",
    anchor: "budget",
    tone: "tinta-off",
    panel: "blanco",
    cover: { title: "Proyectos a medida", note: "más allá de Instagram" },
  },
  {
    id: "about",
    n: "05",
    label: "Quiénes somos",
    short: "Nosotros",
    anchor: "about",
    tone: "blanco",
    panel: "blanco",
    cover: { title: "Quiénes somos", note: "tres especialidades" },
  },
  {
    id: "brand",
    n: "06",
    label: "Contacto",
    short: "Contacto",
    anchor: "farewell",
    tone: "crema",
    panel: null,
    cover: null,
  },
];

/** Textos del escenario: riel, barra mobile, pista y botones. */
export const stage = {
  railAriaLabel: "Secciones",
  tileAria: "Abrir N.º {n}: {label}",
  brandAria: "Ir al final: newsletter y contacto",
  close: "Volver a la grilla",
  scrollCue: "Deslizá para seguir",
  hint: "deslizá o tocá una",
  current: "N.º {n} · {label}",
} as const;
