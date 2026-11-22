"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Paradas del recorrido, en px absolutos de scroll (ordenadas). Entre los
 * extremos de un `range` el scroll es libre (lectura de una sección larga).
 */
export type StepMap = { stops: number[]; ranges: [number, number][]; vh: number };

/** Después de este silencio (sin scroll ni rueda) se considera que el gesto terminó. */
const IDLE_MS = 160;
/** Movimientos menores a esto (fracción de pantalla) vuelven a la parada anterior. */
const ADVANCE_THRESHOLD = 0.06;
/**
 * Inercia vs. gesto nuevo (rueda/trackpad): la inercia son eventos seguidos
 * (~16 ms) con delta que decae. Una pausa mayor a esto, o un delta que vuelve
 * a crecer, es un gesto nuevo del usuario.
 */
const NEW_GESTURE_GAP_MS = 90;
const NEW_GESTURE_GROWTH = 1.4;
const NEW_GESTURE_MIN_DELTA = 6;

/**
 * "Un gesto, una parada": el scroll sigue siendo nativo (inercia, teclado,
 * barra), pero un gesto no puede pasar de largo la parada siguiente, y si el
 * usuario suelta entre dos paradas, el recorrido termina en la dirección en
 * que venía. Varios gestos seguidos avanzan una parada cada uno (para ir
 * rápido a otra sección); un solo fling largo se frena en la primera. Reemplaza a scroll-snap mandatory + snap-stop, que en la práctica
 * no garantiza detenerse en cada parada.
 *
 * Devuelve `jump(y, smooth)` para los scrolls programáticos del escenario
 * (clicks, anclas, ×): no se frenan y dejan la parada actualizada.
 */
export function useStepScroll(getMap: () => StepMap | null, enabled: boolean) {
  const anchor = useRef<number | null>(null);
  const locked = useRef<number | null>(null);
  const programmatic = useRef(false);
  const lastPos = useRef(0);
  const touching = useRef(false);
  const pressed = useRef(false);
  const idleTimer = useRef<number | undefined>(undefined);
  const lastWheelAt = useRef(0);
  const lastWheelAbs = useRef(0);
  const progTimer = useRef<number | undefined>(undefined);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const endProgrammaticSoon = useCallback(() => {
    window.clearTimeout(progTimer.current);
    progTimer.current = window.setTimeout(() => {
      programmatic.current = false;
    }, IDLE_MS + 40);
  }, []);

  const jump = useCallback(
    (target: number, smooth = false) => {
      // El destino nunca pasa del scroll posible (ej. un ancla al footer, al final de la página).
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const y = Math.min(Math.max(0, target), maxScroll);
      programmatic.current = true;
      locked.current = null;
      anchor.current = y;
      lastPos.current = y;
      window.scrollTo({ top: y, behavior: smooth && !reduced() ? "smooth" : "instant" });
      endProgrammaticSoon();
    },
    [endProgrammaticSoon],
  );

  useEffect(() => {
    if (!enabled) return;

    const inRange = (map: StepMap, y: number) => map.ranges.find(([a, b]) => y >= a - 1 && y <= b + 1);
    const isStop = (map: StepMap, y: number) => map.stops.some((s) => Math.abs(s - y) <= 2);
    const nearest = (map: StepMap, y: number) =>
      map.stops.reduce((best, s) => (Math.abs(s - y) < Math.abs(best - y) ? s : best), map.stops[0]);
    /** Primera parada más allá de `from` en la dirección `dir`. */
    const barrier = (map: StepMap, from: number, dir: number) =>
      dir > 0 ? map.stops.find((s) => s > from + 1) : [...map.stops].reverse().find((s) => s < from - 1);

    const ensureAnchor = (map: StepMap) => {
      if (anchor.current === null) anchor.current = inRange(map, scrollY) ? scrollY : nearest(map, scrollY);
      return anchor.current;
    };

    /** Fin del gesto: soltar el freno y terminar el recorrido si quedó entre paradas. */
    const settle = () => {
      const map = getMap();
      if (!map || touching.current || pressed.current) return;
      locked.current = null;
      if (programmatic.current) return;
      const y = scrollY;
      if (inRange(map, y) || isStop(map, y)) {
        anchor.current = y;
        return;
      }
      const from = ensureAnchor(map);
      const d = y - from;
      const to = Math.abs(d) < ADVANCE_THRESHOLD * map.vh ? from : (barrier(map, from, Math.sign(d)) ?? from);
      jump(to, true);
    };

    const scheduleSettle = () => {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(settle, IDLE_MS);
    };

    const onScroll = () => {
      if (programmatic.current) {
        endProgrammaticSoon();
        return;
      }
      const map = getMap();
      if (!map) return;
      const y = scrollY;
      const dir = Math.sign(y - lastPos.current);
      lastPos.current = y;

      // Frenado en una parada: el resto de la inercia no mueve la página.
      if (locked.current !== null) {
        if (Math.abs(y - locked.current) > 1) window.scrollTo({ top: locked.current, behavior: "instant" });
        lastPos.current = locked.current;
        scheduleSettle();
        return;
      }

      if (!pressed.current && dir !== 0) {
        const from = ensureAnchor(map);
        const range = inRange(map, y);
        if (range && inRange(map, from) === range) {
          // Lectura libre dentro de la sección.
          anchor.current = y;
        } else {
          const b = barrier(map, from, dir);
          if (b !== undefined && (dir > 0 ? y > b : y < b)) {
            locked.current = b;
            anchor.current = b;
            lastPos.current = b;
            window.scrollTo({ top: b, behavior: "instant" });
          }
        }
      }
      scheduleSettle();
    };

    /** El usuario retoma el control: suelta el freno y corta un recorrido automático. */
    const userTakesOver = () => {
      locked.current = null;
      if (programmatic.current) {
        programmatic.current = false;
        window.clearTimeout(progTimer.current);
        lastPos.current = scrollY;
      }
    };

    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const abs = Math.abs(e.deltaY);
      const isNewGesture =
        now - lastWheelAt.current > NEW_GESTURE_GAP_MS ||
        (abs > lastWheelAbs.current * NEW_GESTURE_GROWTH && abs >= NEW_GESTURE_MIN_DELTA);
      lastWheelAt.current = now;
      lastWheelAbs.current = abs;
      if (isNewGesture) userTakesOver();
      // Durante el frenado, la inercia del gesto anterior no mueve la página.
      else if (locked.current !== null) e.preventDefault();
      scheduleSettle();
    };
    const onTouchStart = () => {
      touching.current = true;
      userTakesOver();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key)) userTakesOver();
    };
    const onTouchEnd = () => {
      touching.current = false;
      scheduleSettle();
    };
    const onDown = () => {
      pressed.current = true;
    };
    const onUp = () => {
      pressed.current = false;
      scheduleSettle();
    };

    lastPos.current = scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(idleTimer.current);
      window.clearTimeout(progTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled, getMap, jump, endProgrammaticSoon]);

  return { jump };
}
