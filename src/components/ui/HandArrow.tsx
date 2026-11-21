/** Flecha dibujada a mano; el trazo se dibuja al entrar en pantalla. */
export function HandArrow() {
  return (
    <svg
      className="v-draw-v overflow-visible"
      aria-hidden="true"
      viewBox="0 0 40 30"
      width="34"
      height="26"
    >
      <path
        pathLength="1"
        d="M4 26 C 14 24, 24 18, 30 6 M22 9 L30 5 L32 14"
        fill="none"
        stroke="var(--color-terracota)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
