type Props = {
  number?: string;
  label: string;
  note?: string;
  /** Sobre fondo tinta: línea y nota en blanco. */
  onInk?: boolean;
  className?: string;
};

/** Folio editorial: línea fina, "N.º 0X", nombre y nota a mano en Caveat. */
export function Folio({ number, label, note, onInk, className = "" }: Props) {
  return (
    <div className={`v-folio ${onInk ? "border-t-blanco" : ""} ${className}`}>
      {number && <b>{number}</b>}
      <span>{label}</span>
      {note && <span className={`v-note ${onInk ? "text-blanco" : ""}`}>{note}</span>}
    </div>
  );
}
