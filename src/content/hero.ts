import { site } from "./site";

/** Hero: titular + mockup de Instagram con historias destacadas. */
export const hero = {
  folio: "Virya Marketing Studio",
  title: {
    before: "Ordenamos tu marketing. Lo ponemos en ",
    struck: "un documento lindo",
    strong: "acción.",
  },
  subtitle: "Elegí dónde estás hoy y te mostramos por dónde empezar.",
  stampAlt: site.name,

  phone: {
    profileName: site.wordmark.text,
    profileRole: site.tagline,
    bio: "Mirá las historias destacadas: hay una para cada momento de tu negocio",
    highlightsAriaLabel: "Historias destacadas: elegí tu situación",
    highlightAria: "Escalón {n}: {situ}",
    hint: "tocá una historia",
    tiles: [
      { tone: "terracota-off", text: "No necesitás publicar más." },
      { tone: "tinta-off", text: "Necesitás un sistema: sostenible y que convierta." },
    ],
  },

  story: {
    region: "Historia: escalón {n} de {total}, {name}",
    step: "Escalón {n} de {total}",
    close: "Cerrar historia",
    prev: "Escalón anterior",
    next: "Escalón siguiente",
  },
} as const;
