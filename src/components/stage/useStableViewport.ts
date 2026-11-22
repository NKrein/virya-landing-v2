"use client";

import { useSyncExternalStore } from "react";

/**
 * Viewport estable y modo de la página.
 *
 * En teléfonos la barra del navegador aparece y desaparece mientras se
 * scrollea: `innerHeight` y `dvh` cambian a cada rato. Para que nada salte,
 * las medidas de layout salen de `lvh`/`svh` (que no cambian con la barra) y
 * solo se vuelven a medir si cambia el ancho (rotación, ventana).
 */

const noop = () => () => {};

/** Escucha un media query. En el servidor y al hidratar devuelve `server`. */
export function useMediaQuery(query: string, server = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => server,
  );
}

export type StageMode = "flow" | "desktop" | "mobile";

/**
 * Modo de la página:
 * - `flow`: servidor / sin JS / hidratando (secciones en flujo normal).
 * - `desktop`: escenario de tiles (≥ 900px).
 * - `mobile`: flujo nativo con intro del celular (< 900px).
 */
export function useStageMode(): StageMode {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const desk = useMediaQuery("(width >= 900px)");
  if (!hydrated) return "flow";
  return desk ? "desktop" : "mobile";
}

export type StableViewport = {
  /** Ancho del viewport (px) */
  width: number;
  /** Alto con la barra del navegador oculta: 100lvh (px) */
  lvh: number;
  /** Alto con la barra visible: 100svh (px) */
  svh: number;
};

let probe: { l: HTMLDivElement; s: HTMLDivElement } | null = null;

/** Lee 100lvh y 100svh en px con dos elementos sonda (no dependen de la barra). */
export function measureViewport(): StableViewport {
  if (!probe) {
    const make = (h: string) => {
      const el = document.createElement("div");
      el.setAttribute("aria-hidden", "true");
      el.style.cssText = `position:fixed;top:0;left:0;width:0;height:${h};visibility:hidden;pointer-events:none`;
      document.body.appendChild(el);
      return el;
    };
    probe = { l: make("100lvh"), s: make("100svh") };
  }
  return {
    width: document.documentElement.clientWidth,
    lvh: probe.l.offsetHeight || window.innerHeight,
    svh: probe.s.offsetHeight || window.innerHeight,
  };
}

/**
 * Llama a `onChange` cuando cambia el ancho del viewport (rotación, ventana).
 * Los cambios solo de alto (barra del navegador, teclado) se ignoran.
 * Con `anyResize` (desktop con mouse) también reacciona a cambios de alto.
 */
export function onViewportWidthChange(onChange: () => void, anyResize = false) {
  let w = document.documentElement.clientWidth;
  let h = window.innerHeight;
  const handler = () => {
    const nw = document.documentElement.clientWidth;
    const nh = window.innerHeight;
    if (nw !== w || (anyResize && nh !== h)) {
      w = nw;
      h = nh;
      onChange();
    }
  };
  window.addEventListener("resize", handler);
  window.addEventListener("orientationchange", handler);
  return () => {
    window.removeEventListener("resize", handler);
    window.removeEventListener("orientationchange", handler);
  };
}
