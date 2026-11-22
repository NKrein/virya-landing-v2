import { site } from "./site";

/** Hero: titular + celular con el perfil y la grilla de tiles (ver tiles.ts). */
export const hero = {
  folio: "Virya Marketing Studio",
  title: {
    before: "Ordenamos tu marketing. Lo ponemos en ",
    struck: "un documento lindo",
    strong: "acción.",
  },
  subtitle: "Elegí dónde estás hoy y te mostramos por dónde empezar.",
  stampAlt: site.name,

  /** Cabecera del perfil dentro del celular; se pliega cuando el celular crece. */
  phone: {
    profileName: site.wordmark.text,
    profileRole: site.tagline,
    bio: "Cada post es una parte de lo que hacemos. Deslizá o tocá uno.",
    ariaLabel: "Perfil de Virya: grilla de secciones",
  },
} as const;
