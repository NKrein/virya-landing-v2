/** Tilde dentro de círculo terracota (confirmación de formulario). */
export function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" className="mt-0.5 flex-none">
      <circle cx="12" cy="12" r="11" fill="var(--color-terracota)" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        fill="none"
        stroke="var(--color-blanco)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
