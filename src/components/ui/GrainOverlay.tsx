type Props = { tone?: "light" | "ink" };

/** Capa de grano de papel. Va como primer hijo de un contenedor `.v-tex` o `.v-paper`. */
export function GrainOverlay({ tone = "light" }: Props) {
  const ink = tone === "ink";
  return (
    <svg aria-hidden="true" className={`v-grain${ink ? " v-grain-on-ink" : ""}`}>
      <rect width="100%" height="100%" filter={`url(#v-grain-${ink ? "l" : "f"})`} />
    </svg>
  );
}
