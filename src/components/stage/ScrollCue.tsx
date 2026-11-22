import { stage as copy } from "@/content";

type Props = { className?: string; label?: string };

/**
 * Aviso animado de "seguí scrolleando": un mouse con la rueda que baja.
 * Con movimiento reducido queda quieto (ver .v-cue en globals.css).
 */
export function ScrollCue({ className = "", label = copy.scrollCue }: Props) {
  return (
    <p className={`v-cue ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 20 30" width="18" height="27" className="v-cue-icon">
        <rect x="1.5" y="1.5" width="17" height="27" rx="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect className="v-cue-wheel" x="8.8" y="6" width="2.4" height="6" rx="1.2" fill="currentColor" />
      </svg>
      <span>{label}</span>
    </p>
  );
}
