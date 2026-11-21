type Props = { children: React.ReactNode; accent?: boolean };

/** Pastilla de etiqueta (servicios, características). */
export function Chip({ children, accent }: Props) {
  return (
    <span className={`v-chip ${accent ? "border-terracota text-terracota" : ""}`}>
      {children}
    </span>
  );
}
