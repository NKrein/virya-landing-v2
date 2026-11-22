"use client";

import { animate } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

/**
 * Intro mobile "de un movimiento": entre el hero, la grilla expandida y el
 * inicio de la N.º 01 hay tres paradas obligatorias. Cualquier gesto (dedo,
 * rueda, trackpad, teclado) dentro de esa zona lleva a la parada siguiente en
 * su dirección con una transición animada de duración fija, sin importar el
 * largo del gesto; la inercia sobrante se absorbe.
 *
 * Fuera de la zona (de la N.º 01 en adelante) el scroll es 100% nativo. En el
 * hero, hacia arriba no hay parada: el gesto se deja pasar (tirar para recargar).
 *
 * `getStops()` devuelve [hero, grilla, inicio 01] en px absolutos de scroll.
 */

/** Movimiento mínimo (px) para considerar un gesto táctil. */
const TOUCH_THRESHOLD = 18;
/** Silencio de la rueda (ms) que separa un gesto de la inercia del anterior. */
const WHEEL_QUIET_MS = 220;
const EASE = [0.65, 0, 0.35, 1] as const;

export function useIntroPager(getStops: () => readonly number[] | null, enabled: boolean) {
  const anim = useRef<ReturnType<typeof animate> | null>(null);
  const busy = useRef(false);

  /** Transición animada del scroll hasta `to` (duración fija según la distancia). */
  const glideTo = useCallback((to: number) => {
    anim.current?.stop();
    const from = window.scrollY;
    if (Math.abs(to - from) < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    busy.current = true;
    anim.current = animate(from, to, {
      duration: reduced ? 0.01 : Math.min(1.05, 0.55 + Math.abs(to - from) / 2600),
      ease: EASE,
      onUpdate: (v) => window.scrollTo(0, v),
      onComplete: () => {
        busy.current = false;
      },
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    /** Parada siguiente en la dirección `dir` desde la posición actual (o undefined). */
    const targetFor = (dir: number) => {
      const stops = getStops();
      if (!stops) return undefined;
      const y = window.scrollY;
      return dir > 0 ? stops.find((s) => s > y + 2) : [...stops].reverse().find((s) => s < y - 2);
    };
    /** ¿El gesto pertenece a la intro? Antes del inicio de la 01, o justo ahí yendo hacia arriba. */
    const inZone = (dir: number) => {
      const stops = getStops();
      if (!stops) return false;
      const y = window.scrollY;
      const end = stops[stops.length - 1];
      return y < end - 2 || (dir < 0 && Math.abs(y - end) <= 2);
    };
    const go = (dir: number) => {
      const to = targetFor(dir);
      if (to === undefined) return false;
      glideTo(to);
      return true;
    };

    // Táctil: la dirección se decide en el primer movimiento (después iOS ya no deja cancelar).
    let startY = 0;
    let dir = 0;
    let captured = false;
    let fired = false;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      dir = 0;
      captured = false;
      fired = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = startY - e.touches[0].clientY; // > 0: hacia abajo
      if (dir === 0 && dy !== 0) {
        dir = Math.sign(dy);
        captured = busy.current || (inZone(dir) && targetFor(dir) !== undefined);
      }
      if (!captured) return;
      e.preventDefault();
      if (!fired && !busy.current && Math.abs(dy) >= TOUCH_THRESHOLD) fired = go(dir);
    };

    // Rueda / trackpad: un gesto = una parada; la inercia que sigue se absorbe.
    let lastWheel = 0;
    let locked = false;
    const onWheel = (e: WheelEvent) => {
      const d = Math.sign(e.deltaY);
      if (!d) return;
      const now = performance.now();
      const quiet = now - lastWheel > WHEEL_QUIET_MS;
      lastWheel = now;
      if (busy.current || (locked && !quiet)) {
        if (busy.current || inZone(d)) e.preventDefault();
        return;
      }
      locked = false;
      if (inZone(d) && targetFor(d) !== undefined) {
        e.preventDefault();
        locked = go(d);
      }
    };

    // Teclado
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable]")) return;
      const d = ["ArrowDown", "PageDown", " "].includes(e.key)
        ? 1
        : ["ArrowUp", "PageUp"].includes(e.key)
          ? -1
          : 0;
      if (!d || !inZone(d)) return;
      if (busy.current || go(d)) e.preventDefault();
    };

    // Si el scroll nativo (p. ej. inercia desde la 01 hacia arriba) queda entre
    // dos paradas de la intro, se completa hasta la más cercana en su dirección.
    let lastY = window.scrollY;
    let lastDir = 0;
    let idle: number | undefined;
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) lastDir = Math.sign(y - lastY);
      lastY = y;
      if (busy.current) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (busy.current) return;
        const stops = getStops();
        if (!stops) return;
        const yy = window.scrollY;
        const end = stops[stops.length - 1];
        if (yy >= end - 2 || stops.some((s) => Math.abs(s - yy) <= 2)) return;
        const to = targetFor(lastDir || 1) ?? stops.reduce((a, b) => (Math.abs(b - yy) < Math.abs(a - yy) ? b : a));
        glideTo(to);
      }, 160);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(idle);
      anim.current?.stop();
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled, getStops, glideTo]);

  return { glideTo };
}
