/**
 * Filtros SVG de la textura de papel. Se montan una sola vez en el layout;
 * <GrainOverlay /> los referencia por id. `f` = sobre claro (multiply),
 * `l` = sobre tinta (screen).
 */
export function GrainFilters() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <filter id="v-grain-f">
        <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 .16  0 0 0 0 .14  0 0 0 0 .13  0 0 0 .09 0" />
      </filter>
      <filter id="v-grain-l">
        <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .07 0" />
      </filter>
    </svg>
  );
}
