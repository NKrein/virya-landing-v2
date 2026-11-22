/**
 * Movimiento del escenario de tiles. Espejo en TS de las duraciones de
 * src/styles/tokens.css (--dur-tile-*), para usarlas con Motion.
 * Criterios: docs/design-system.md → "Escenario de tiles".
 */

/** Curva de salida suave de la marca (= --ease-out-soft). */
export const easeOutSoft = [0.22, 1, 0.36, 1] as const;

/** Despegue de la tile antes del morph (= --dur-tile-lift). */
export const lift = { duration: 0.15, ease: easeOutSoft } as const;

/**
 * Apertura: desaceleración orgánica, sin rebote (= --dur-tile-open). Un rebote,
 * aunque imperceptible, alarga el asentamiento y demora la aparición del contenido.
 */
export const openSpring = { type: "spring", visualDuration: 0.5, bounce: 0 } as const;

/** Cierre: más corto que la apertura y sin pasarse (= --dur-tile-close). */
export const closeSpring = { type: "spring", visualDuration: 0.42, bounce: 0 } as const;

/** Cierre rápido cuando se saltan varias tiles de golpe. */
export const quickCloseSpring = { type: "spring", visualDuration: 0.25, bounce: 0 } as const;

/**
 * Tapa → contenido: el contenido aparece mientras la tile se abre, al mismo
 * ritmo (= --dur-tile-open), revelado por un recorte que crece con la tile.
 */
export const contentIn = { duration: 0.5, ease: [0.4, 0, 0.2, 1] } as const;
/** Al cerrar el contenido se va antes que la tile (= --dur-reveal). */
export const contentOut = { duration: 0.24, ease: easeOutSoft } as const;

/** Con prefers-reduced-motion: fundidos cortos en lugar de morphs (= --dur-fade-reduced). */
export const reducedFade = { duration: 0.15, ease: "linear" } as const;

/** Suavizado de la intro que sigue al scroll (absorbe los saltos de la rueda). */
export const introSpring = { stiffness: 300, damping: 40, restDelta: 0.0005 } as const;
