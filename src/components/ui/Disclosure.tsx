type Props = {
  summary: string;
  /** Símbolo previo al texto (el "+" terracota). */
  marker?: string;
  children: React.ReactNode;
  className?: string;
  summaryClassName?: string;
  markerClassName?: string;
};

/** Desplegable nativo (<details>), sin JS. */
export function Disclosure({
  summary,
  marker = "+",
  children,
  className = "",
  summaryClassName = "",
  markerClassName = "text-terracota",
}: Props) {
  return (
    <details className={`v-more ${className}`}>
      <summary className={summaryClassName}>
        <span className={markerClassName}>{marker}</span> {summary}
      </summary>
      {children}
    </details>
  );
}
