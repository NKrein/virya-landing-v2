import { stage as copy } from "@/content";

type Props = { className?: string; label?: string };

/**
 * Aviso animado de "seguí scrolleando": un mouse con la rueda que baja.
 * La rueda es un <span> HTML (no un <rect> SVG): su animación de transform
 * corre en la GPU sin provocar layout en cada cuadro.
 * Con movimiento reducido queda quieto (ver .v-cue en globals.css).
 */
export function ScrollCue({ className = "", label = copy.scrollCue }: Props) {
  return (
    <p className={`v-cue ${className}`}>
      <span aria-hidden="true" className="v-cue-icon">
        <svg viewBox="0 0 20 30" width="18" height="27">
          <rect x="1.5" y="1.5" width="17" height="27" rx="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="v-cue-wheel" />
      </span>
      <span>{label}</span>
    </p>
  );
}
