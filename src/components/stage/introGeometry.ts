/**
 * Geometría de la intro (funciones puras): para un progreso p (0 → 1) de la
 * intro, dónde está la pantalla del celular, cuánto se ve el marco, etc.
 * La intro sigue al scroll; los tiempos están en fracciones de p.
 *
 * Desktop: el celular está en la columna derecha del hero y crece hasta que
 *   su pantalla (la grilla) ocupa todo; el marco se desvanece.
 * Mobile: del celular asoma solo la parte de arriba (perfil, historias y un
 *   tercio de la primera fila de tiles); sube hasta quedar completo y
 *   centrado, se detiene ahí (parada intermedia) y después pasa a pantalla
 *   completa; el marco se desvanece.
 */

export type Rect = { x: number; y: number; w: number; h: number };

export type IntroGeometry = {
  mobile: boolean;
  /** Tamaño del escenario (pantalla) */
  stageW: number;
  stageH: number;
  /** Desktop: rect del celular en el hero. Mobile: solo se usan w y h. */
  phone: Rect;
  /** Alto natural de la cabecera del perfil */
  headerH: number;
  /** Separación de la grilla (px) */
  gridGap: number;
  /** Lo que el escenario está corrido hacia abajo al cargar (barra de anuncio) */
  stageOffset: number;
  /** prefers-reduced-motion: cada etapa es un estado fijo (sin escalar). */
  reduced: boolean;
};

/** Tiempos (fracciones de p) */
const T = {
  desk: { grow: [0.1, 1], header: [0.3, 0.6], frame: [0.5, 0.85], hero: [0, 0.4] },
  mobile: { rise: [0, 0.45], grow: [0.52, 1], header: [0.52, 0.76], frame: [0.6, 0.92], hero: [0, 0.4] },
} as const;

/** Mobile: parada intermedia con el celular completo y centrado (entre rise y grow). */
const MOBILE_REST = 0.48;

/** Paradas dentro de la intro, en fracciones de p (para useStepScroll). */
export const introStops = (g: IntroGeometry) => (g.mobile ? [MOBILE_REST] : []);

/** Radio de la pantalla dentro del marco (marco de 10px con radio 46). */
export const SCREEN_RADIUS = 36;
export const FRAME = 10;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));
/** ease in-out cúbica: arranca y llega suave, predecible */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

/**
 * Con movimiento reducido no hay estados intermedios: cada etapa (celular en
 * el hero, celular completo en mobile, grilla) es fija y se pasa de una a otra
 * con un fundido corto (CSS).
 */
function q(p: number, g: IntroGeometry) {
  if (!g.reduced) return p;
  if (!g.mobile) return p < 0.5 ? 0 : 1;
  return p < 0.24 ? 0 : p < 0.74 ? MOBILE_REST : 1;
}

/** Progreso de crecimiento hacia pantalla completa (0 = celular, 1 = completa). */
export function growth(p: number, g: IntroGeometry) {
  return ease(seg(q(p, g), g.mobile ? T.mobile.grow : T.desk.grow));
}

export function screenRect(pRaw: number, g: IntroGeometry): Rect {
  const p = q(pRaw, g);
  const full = { x: 0, y: 0, w: g.stageW, h: g.stageH };
  if (!g.mobile) return lerpRect(g.phone, full, growth(p, g));
  const mid = { x: (g.stageW - g.phone.w) / 2, y: (g.stageH - g.phone.h) / 2, w: g.phone.w, h: g.phone.h };
  if (p <= T.mobile.grow[0]) {
    // Asoma: perfil + historias + un tercio de la primera fila de tiles.
    const rowH = (g.phone.h - g.headerH - 2 * g.gridGap) / 3;
    const peek = Math.min(g.phone.h, g.headerH + rowH / 3) + FRAME + g.stageOffset;
    const below = { ...mid, y: Math.max(mid.y, g.stageH - peek) };
    return lerpRect(below, mid, ease(seg(p, T.mobile.rise)));
  }
  return lerpRect(mid, full, growth(p, g));
}

/** Radio de la pantalla: del radio del celular a 0. */
export const screenRadius = (p: number, g: IntroGeometry) => SCREEN_RADIUS * (1 - growth(p, g));

/** Opacidad del marco del celular. */
export const frameOpacity = (p: number, g: IntroGeometry) =>
  1 - ease(seg(q(p, g), g.mobile ? T.mobile.frame : T.desk.frame));

/** Cabecera del perfil: 1 = abierta, 0 = plegada. */
export const headerOpen = (p: number, g: IntroGeometry) =>
  1 - ease(seg(q(p, g), g.mobile ? T.mobile.header : T.desk.header));

/** Texto del hero: 0 = visible, 1 = se fue. */
export const heroOut = (p: number, g: IntroGeometry) =>
  ease(seg(q(p, g), g.mobile ? T.mobile.hero : T.desk.hero));

/**
 * Aviso "Deslizá para ver más" debajo del celular. Desktop: visible en el hero.
 * Mobile: visible con el celular completo (parada intermedia). Se va cuando el
 * celular empieza a crecer.
 */
export const phoneCueOpacity = (p: number, g: IntroGeometry) =>
  1 - seg(q(p, g), g.mobile ? [T.mobile.grow[0], T.mobile.grow[0] + 0.08] : [0, 0.12]);

/** Testigo (riel / barra): aparece cuando la grilla ya ocupa la pantalla. */
export const railIn = (p: number, g: IntroGeometry) => seg(q(p, g), [0.86, 0.98]);
