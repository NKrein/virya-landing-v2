import { href } from "./anchors";

export type OfferId = "audit" | "workbook" | "session" | "marketing";

export type Offer = {
  id: OfferId;
  /** Etiqueta corta bajo el círculo de la historia */
  short: string;
  /** Situación del cliente, en primera persona */
  situ: string;
  name: string;
  price: string;
  desc: string;
  includes: readonly string[];
  cta: string;
  href: string;
  note: string;
};

/**
 * Los 4 escalones de la oferta. Alimentan las historias destacadas del
 * mockup de Instagram. El orden define el número (1–4) de cada historia.
 */
export const offers: readonly Offer[] = [
  {
    id: "audit",
    short: "Empiezo",
    situ: "Publico, pero no sé qué arreglar primero",
    name: "Mini auditoría de Instagram",
    price: "Gratis",
    desc: "Un PDF de 10 minutos para mirar tu perfil con ojos de cliente.",
    includes: [
      "10 afirmaciones para revisar tu perfil",
      "Un puntaje que te muestra dónde estás",
      "Una acción concreta para esta semana",
    ],
    cta: "Pedir la auditoría",
    href: href("audit"),
    note: "Te llega de regalo al suscribirte a nuestro newsletter mensual.",
  },
  {
    id: "workbook",
    short: "A mi ritmo",
    situ: "Quiero ordenar mi Instagram yo, a mi ritmo",
    name: "Workbook “Engagement en Instagram que vende”",
    price: "$35.000 (lanzamiento, antes $55.000)",
    desc: "Todo lo que necesitás para ordenar tu Instagram por tu cuenta.",
    includes: [
      "Workbook en PDF de 8 módulos",
      "Ganchos para captar a tu audiencia",
      "Plan de 30 días",
      "Bonus: 30 ideas para implementar hoy",
    ],
    cta: "Ver el workbook",
    href: href("workbook"),
    note: "Descarga inmediata.",
  },
  {
    id: "session",
    short: "Un problema",
    situ: "Tengo un problema puntual de marketing",
    name: "Sesión estratégica",
    price: "$95.000",
    desc: "Una mirada experta sobre un problema concreto, con próximos pasos claros.",
    includes: [
      "Formulario previo, así llegamos con tu caso estudiado",
      "Videollamada de 1 hora",
      "Resumen por escrito con 3 prioridades y próximos pasos",
    ],
    cta: "Reservar una sesión",
    href: href("session"),
    note: "Si contratás Marketing en orden dentro de los 30 días, se descuenta del precio.",
  },
  {
    id: "marketing",
    short: "Sin tiempo",
    situ: "No tengo tiempo ni sé cómo manejar mis redes",
    name: "Marketing en orden",
    price: "Presupuesto a medida",
    desc: "Tu estrategia de marketing y acompañamiento mes a mes. Servicio personalizado.",
    includes: [
      "Reunión de arranque, objetivos, cliente ideal y embudo",
      "Estrategia de contenido mensual",
      "Producción de piezas, según lo que necesites",
    ],
    cta: "Ver el servicio",
    href: href("marketingEnOrden"),
    note: "Según lo que necesita tu negocio. Cupos limitados.",
  },
];

export const getOffer = (id: OfferId): Offer => {
  const offer = offers.find((o) => o.id === id);
  if (!offer) throw new Error(`Oferta desconocida: ${id}`);
  return offer;
};
