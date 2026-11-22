import { href } from "./anchors";

/** N.º 02 — Workbook (producto digital). */
export const workbook = {
  folio: { number: "N.º 02", label: "Producto digital", note: "descarga inmediata" },

  cover: {
    ariaLabel: "Tapa del workbook Engagement en Instagram que vende, en una tablet",
    tag: "Workbook · 01",
    titleBefore: "Engagement en Instagram que ",
    titleAccent: "vende",
    meta: "8 módulos · plan de 30 días",
    handNote: "PDF para completar",
  },

  title: "Aprendé a hacerlo vos, con un método claro.",
  intro:
    "Si publicás seguido pero no te escriben ni te compran, y querés resolverlo por tu cuenta, el workbook “Engagement en Instagram que vende” es para vos.",

  chips: [
    { label: "8 módulos en PDF" },
    { label: "Ganchos para tu audiencia" },
    { label: "Plan de 30 días" },
    { label: "Bonus: 30 ideas para implementar hoy", accent: true },
  ],

  modules: {
    summary: "Ver los 8 módulos",
    items: [
      { n: "01", label: "Punto de partida" },
      { n: "02", label: "Tu cliente ideal" },
      { n: "03", label: "Tu propuesta de valor" },
      { n: "04", label: "Tu mensaje y pilares" },
      { n: "05", label: "Contenido que genera interacción" },
      { n: "06", label: "Conversaciones" },
      { n: "07", label: "Sistema de conversión" },
      { n: "08", label: "Plan de 30 días" },
      { n: "+", label: "Bonus: 30 ideas de contenido" },
    ],
  },

  outcome: {
    lead: "Al terminarlo tenés:",
    text: " tu mensaje claro, contenido que invita a interactuar y un plan para convertir esas conversaciones en ventas durante los próximos 30 días.",
  },

  price: { note: "precio de lanzamiento", current: "$35.000", original: "$55.000" },

  // PENDIENTE: reemplazar por el link de pago (Mercado Pago) con entrega automática del PDF.
  cta: { label: "Comprar y descargar", href: href("workbook") },
} as const;
