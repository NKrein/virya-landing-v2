type Props = { tone?: "light" | "ink" };

/**
 * Capa de grano de papel. Va como primer hijo de un contenedor `.v-tex` o `.v-paper`.
 * Es una imagen de fondo (SVG con feTurbulence, rasterizado una vez y en mosaico):
 * mucho más barata que un filtro en vivo, sobre todo en mobile. Ver .v-grain en globals.css.
 */
export function GrainOverlay({ tone = "light" }: Props) {
  return <span aria-hidden="true" className={`v-grain${tone === "ink" ? " v-grain-on-ink" : ""}`} />;
}
