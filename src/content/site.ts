import { buildMailto } from "@/lib/mailto";

/** Datos globales de la marca y el sitio. */
export const site = {
  name: "Virya Marketing Studio",
  wordmark: { text: "virya", dot: "." },
  tagline: "Estudio de marketing",
  description:
    "Ordenamos tu marketing y lo ponemos en acción: workbook, marketing mensual y proyectos a medida para tu negocio.",
  locale: "es-AR",
  contact: {
    email: "support@virya.ar",
    instagramHandle: "@viryamarketing",
  },
  year: 2026,
} as const;

/** Mailto de "Escribinos" / "Pedir presupuesto". */
export const budgetMailto = buildMailto({
  to: site.contact.email,
  subject: "Quiero un presupuesto",
  body: "Hola, les cuento sobre mi negocio:\n\n¿Qué vendo?\n\n¿Qué me gustaría mejorar?\n\n",
});
