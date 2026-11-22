/**
 * Máquina de estados del escenario de tiles (función pura, sin DOM).
 *
 * El escenario es un "track" alto con un panel sticky de 100lvh. La posición
 * de scroll dentro del track (y, en px) decide QUÉ se muestra; las animaciones
 * de apertura/cierre (con duración fija) deciden CÓMO. Ver docs/design-system.md.
 *
 *  INTRO ─ REPOSO ─ [abrir · lectura · final] × N ─ salida
 */

/** Zonas en fracciones del alto de pantalla (vh). */
export const ZONES = {
  /** Reposo con la grilla a pantalla completa, antes de la primera tile */
  rest: 0.3,
  /** Zona abrir: el contenido queda arriba mientras termina la animación */
  open: 0.3,
  /** Zona final: el contenido queda en su final antes de cerrar */
  end: 0.3,
  /** Histéresis. Bajando: abre a +8vh y cierra a +20vh de la zona final. */
  openEnter: 0.08,
  openStay: 0.02,
  closeEnter: 0.14,
  closeStay: 0.2,
} as const;

export type StageLayout = {
  /** Alto de pantalla en px */
  vh: number;
  /** Largo de la intro en px (0 si no hay intro) */
  introLen: number;
  /** Zona de lectura de cada tile que abre: alto del contenido − vh (≥ 0) */
  readLens: readonly number[];
};

export type TileSegment = {
  openStart: number;
  readStart: number;
  readEnd: number;
  endEnd: number;
};

export type StageSegments = {
  introLen: number;
  restEnd: number;
  tiles: TileSegment[];
  /** Largo total del recorrido (sin el vh del panel sticky) */
  total: number;
};

export function buildSegments({ vh, introLen, readLens }: StageLayout): StageSegments {
  let cursor = introLen + ZONES.rest * vh;
  const restEnd = cursor;
  const tiles = readLens.map((readLen) => {
    const openStart = cursor;
    const readStart = openStart + ZONES.open * vh;
    const readEnd = readStart + Math.max(0, readLen);
    const endEnd = readEnd + ZONES.end * vh;
    cursor = endEnd;
    return { openStart, readStart, readEnd, endEnd };
  });
  return { introLen, restEnd, tiles, total: cursor };
}

export type StagePhase = "intro" | "grid" | "open" | "after";

export type StageState = {
  phase: StagePhase;
  /** Índice (en readLens) de la tile abierta, o null */
  active: number | null;
  /** Progreso de la intro, 0 → 1 */
  intro: number;
  /** Desplazamiento del contenido de la tile abierta, en px (0 → readLen) */
  readOffset: number;
  /** Progreso de lectura de la tile abierta, 0 → 1 (para el riel) */
  read: number;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Resuelve el estado para la posición `y` (px desde el inicio del track).
 * `prevActive` aplica la histéresis: una tile ya abierta tiene un intervalo
 * un poco más amplio que una que está por abrirse, así no titila en el borde.
 */
export function resolveStage(
  y: number,
  seg: StageSegments,
  vh: number,
  prevActive: number | null,
): StageState {
  const intro = seg.introLen > 0 ? clamp(y / seg.introLen, 0, 1) : 1;

  let active: number | null = null;
  for (let i = 0; i < seg.tiles.length; i++) {
    const t = seg.tiles[i];
    const staying = prevActive === i;
    const from = t.openStart + (staying ? ZONES.openStay : ZONES.openEnter) * vh;
    const to = t.readEnd + (staying ? ZONES.closeStay : ZONES.closeEnter) * vh;
    if (y >= from && y < to) {
      active = i;
      break;
    }
  }

  if (active !== null) {
    const t = seg.tiles[active];
    const readLen = t.readEnd - t.readStart;
    const readOffset = clamp(y - t.readStart, 0, readLen);
    const read = readLen > 0 ? readOffset / readLen : y >= t.readStart ? 1 : 0;
    return { phase: "open", active, intro, readOffset, read };
  }

  const phase: StagePhase = y < seg.introLen ? "intro" : y >= seg.total ? "after" : "grid";
  return { phase, active: null, intro, readOffset: 0, read: 0 };
}

/**
 * Posición de scroll (px en el track) para abrir directamente la tile `i`:
 * el inicio de su lectura, que además es su punto de anclaje (scroll snap).
 */
export const openTarget = (seg: StageSegments, i: number) => seg.tiles[i].readStart;

/** Posición de scroll para volver a la grilla después de la tile `i` (× / Esc). */
export const gridAfter = (seg: StageSegments, i: number) => {
  const t = seg.tiles[i];
  // Entre el cierre de la tile i y la apertura de la siguiente: la grilla está visible.
  return t.endEnd - 0.04 * (t.endEnd - t.readEnd);
};

/** Grilla en reposo, después de la intro. */
export const gridRest = (seg: StageSegments) => seg.introLen + (seg.restEnd - seg.introLen) / 2;

/**
 * Paradas del recorrido (px en el track) para el scroll "un gesto, una
 * parada" (useStepScroll): las paradas de la intro (fracciones de su largo),
 * la grilla en reposo y, por tile, el inicio de su
 * lectura, el final de su contenido y la grilla después de cerrarla. Entre el
 * inicio y el final de una lectura larga el scroll es libre (`ranges`).
 */
export function stepStops(seg: StageSegments, introStops: readonly number[] = []) {
  const stops = [...introStops.map((p) => p * seg.introLen), gridRest(seg)];
  const ranges: [number, number][] = [];
  seg.tiles.forEach((t, i) => {
    stops.push(t.readStart);
    if (t.readEnd > t.readStart) {
      stops.push(t.readEnd);
      ranges.push([t.readStart, t.readEnd]);
    }
    stops.push(gridAfter(seg, i));
  });
  return { stops, ranges };
}
