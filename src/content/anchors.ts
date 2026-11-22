/** IDs de ancla de cada sección. Los links del menú y de las ofertas los usan. */
export const anchors = {
  home: "inicio",
  start: "empezar",
  workbook: "workbook",
  marketingEnOrden: "marketing-en-orden",
  session: "sesion",
  budget: "presupuesto",
  about: "quienes-somos",
  audit: "auditoria",
  contact: "contacto",
  farewell: "antes-de-irte",
} as const;

export const href = (id: keyof typeof anchors) => `#${anchors[id]}`;
