type Props = { className?: string; alt?: string; style?: React.CSSProperties };

/** Estampilla terracota: el único logo redondo de la marca. */
export function Stamp({ className, alt = "", style }: Props) {
  // eslint-disable-next-line @next/next/no-img-element -- SVG estático, no necesita optimización
  return <img src="/assets/estampilla.svg" alt={alt} className={className} style={style} />;
}
