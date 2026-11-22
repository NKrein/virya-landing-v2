import { href } from "./anchors";
import { budgetMailto } from "./site";
import { getOffer } from "./offers";

/** N.º 03 — Marketing en orden (servicio mensual, bloque tinta). */
export const marketingEnOrden = {
  folio: { number: "N.º 03", label: "Servicio mensual", note: "cupos limitados" },
  title: "Marketing en orden.",
  hook: "¿Tus redes te piden más tiempo del que tenés? ¿No sabés bien qué publicar?",
  lead: "Armamos tu estrategia y la llevamos adelante con vos, mes a mes.",

  includes: {
    summary: "Qué incluye",
    items: [
      { n: "01", label: "Reunión de arranque para entender tu negocio" },
      { n: "02", label: "Objetivos, cliente ideal y mapa de tu embudo" },
      { n: "03", label: "Estrategia de contenido mensual y ajustes de perfil" },
      { n: "04", label: "Sugerencias de historias para cada publicación" },
    ],
  },

  budgetCard: {
    title: "Presupuesto a medida",
    text: "Según lo que necesita tu negocio. Cupos limitados.",
    cta: { label: "Pedir presupuesto", href: budgetMailto },
  },

  session: {
    note: "¿solo un tema puntual?",
    title: "Una hora para destrabar tus redes.",
    meta: "Sesión estratégica 1:1 · ",
    price: getOffer("session").price,
    // PENDIENTE: link de reserva (Calendly o similar).
    cta: { label: "Reservar mi sesión", href: href("session") },
    footnote: "Si después contratás Marketing en orden, tenés un descuento.",
  },
} as const;
