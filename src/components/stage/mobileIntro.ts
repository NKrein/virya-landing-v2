/**
 * Intro mobile (funciones puras): para un progreso p (0 → 1), dónde está el
 * celular. Todo se expresa como transform/opacity: la pantalla del celular se
 * renderiza SIEMPRE al tamaño de la pantalla (ancho × 100lvh) y se escala
 * hacia abajo, así no hay layout por cuadro (las celdas no cambian de tamaño).
 *
 * Tramos (continuos, sin pausa):
 *   asoma (debajo del hero, nunca encima) → sube hasta verse completo → sin
 *   detenerse crece hasta pantalla completa (el perfil "scrollea" hacia afuera
 *   y la grilla la llena). La parada es recién en la grilla expandida.
 */

export type MobileIntroGeometry = {
  /** Ancho de la pantalla (px) */
  W: number;
  /** 100lvh y 100svh (px), estables */
  L: number;
  S: number;
  /** Borde inferior del texto del hero, en coordenadas del escenario */
  heroBottom: number;
  /** Alto de la cabecera del perfil, a tamaño completo */
  headerH: number;
  reduced: boolean;
};

export type MobileIntroState = {
  /** Transform del celular (origen arriba a la izquierda) */
  x: number;
  y: number;
  scale: number;
  /** Desplazamiento del contenido de la pantalla (perfil → afuera) */
  contentY: number;
  /** Radio de la pantalla, en px sin escalar */
  radius: number;
  frame: number;
  heroOpacity: number;
  heroY: number;
  /** Aviso "Deslizá para ver más" debajo del celular */
  cue: number;
  cueY: number;
};

/** Marco del celular (px visibles). */
export const MOBILE_FRAME = 10;
const SCREEN_RADIUS = 34;

const T = { rise: [0, 0.45], grow: [0.45, 1], frame: [0.55, 0.9], hero: [0, 0.3], cue: [0.38, 0.5] } as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/**
 * La subida acelera al final y el crecimiento arranca con velocidad: en la
 * unión (celular completo) el movimiento no frena, así no se siente una pausa.
 */
const easeIn = (t: number) => t * t;
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Escala del celular: lo más ancho posible sin pasarse del alto visible. */
export function phoneScale(g: MobileIntroGeometry) {
  const byWidth = (g.W - 32) / g.W;
  const byHeight = (g.S - 128) / g.L;
  return Math.max(0.5, Math.min(byWidth, byHeight));
}

/** Con movimiento reducido cada etapa es un estado fijo (fundidos por CSS). */
function q(p: number, g: MobileIntroGeometry) {
  if (!g.reduced) return p;
  return p < 0.25 ? 0 : p < 0.6 ? 0.45 : 1;
}

export function mobileIntro(pRaw: number, g: MobileIntroGeometry): MobileIntroState {
  const p = q(pRaw, g);
  const s = phoneScale(g);
  const phoneW = g.W * s;
  const phoneH = g.L * s;
  const xMid = (g.W - phoneW) / 2;
  // Completo y centrado en el alto visible, dejando lugar al aviso de abajo.
  const yMid = Math.max(MOBILE_FRAME + 8, Math.min((g.S - phoneH) / 2 - 14, g.S - 44 - phoneH - MOBILE_FRAME));
  // Asoma: perfil + historias + un tercio de la primera fila, siempre debajo del hero.
  const rowH = g.L / 3;
  const visible = s * (g.headerH + rowH / 3) + MOBILE_FRAME;
  const yPeek = Math.max(g.heroBottom + 24 + MOBILE_FRAME, g.S - visible);

  const grow = easeOut(seg(p, T.grow));
  const rise = easeIn(seg(p, T.rise));
  const scale = lerp(s, 1, grow);
  const x = lerp(xMid, 0, grow);
  const y = grow > 0 ? lerp(yMid, 0, grow) : lerp(yPeek, yMid, rise);
  const heroOut = ease(seg(p, T.hero));

  return {
    x,
    y,
    scale,
    contentY: -g.headerH * grow,
    radius: (SCREEN_RADIUS * (1 - grow)) / scale,
    frame: 1 - ease(seg(p, T.frame)),
    heroOpacity: 1 - heroOut,
    heroY: -0.25 * g.S * heroOut,
    cue: 1 - seg(p, T.cue),
    cueY: y + phoneH * (scale / s) + MOBILE_FRAME + 14,
  };
}
