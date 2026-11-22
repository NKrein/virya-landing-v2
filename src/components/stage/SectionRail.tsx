"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import { anchors, site, stage as copy, tiles } from "@/content";
import { fmt } from "@/lib/format";
import { ScrollCue } from "./ScrollCue";

const openable = tiles.filter((t) => t.panel !== null);
const brand = tiles.find((t) => t.panel === null);

type Props = {
  /** Tile (índice de panel) donde está parado el usuario, o null en la grilla */
  active: number | null;
  /** Tiles que ya abrió */
  visited: readonly number[];
  /** Progreso de lectura de la tile activa (0 → 1) */
  read: MotionValue<number>;
  /** Visibilidad del testigo (aparece cuando la grilla ocupa la pantalla) */
  shown: MotionValue<number>;
  /** El panel activo es tinta (el riel va claro, la barra mobile oscura) */
  onInk: boolean;
  /** Mostrar la pista "deslizá o tocá una" (hasta la primera apertura) */
  hint: boolean;
  onGo: (k: number) => void;
};

/**
 * Testigo de posición. Desktop: riel lateral con una marca por tile (la activa
 * se alarga, muestra su nombre y se llena con la lectura), del color opuesto
 * al fondo del panel, con el aviso de scroll debajo. Mobile: barra superior a
 * todo el ancho, con segmentos tipo historias + "N.º 02 · Workbook".
 */
export function SectionRail({ active, visited, read, shown, onInk, hint, onGo }: Props) {
  const visibility = useTransform(shown, (v) => (v <= 0.01 ? "hidden" : "visible"));
  const fill = useTransform(read, (v) => Math.max(0.04, v));
  const current = active !== null ? openable[active] : null;

  return (
    <m.nav
      aria-label={copy.railAriaLabel}
      className="v-rail"
      data-ink={onInk || undefined}
      style={{ opacity: shown, visibility }}
    >
      {/* Mobile: segmentos + etiqueta de la tile actual. */}
      <div className="v-railbar" aria-hidden="true" data-open={current ? "" : undefined}>
        <div className="v-railbar-segs">
          {openable.map((t, k) => (
            <span key={t.id} className="v-railbar-seg" data-done={visited.includes(k) || undefined}>
              {k === active && <m.span className="v-railbar-fill" style={{ scaleX: fill }} />}
            </span>
          ))}
        </div>
        {/* En la grilla solo los segmentos (la pista ya está en la bio del perfil). */}
        {current && <p className="v-railbar-label">{fmt(copy.current, { n: current.n, label: current.label })}</p>}
      </div>

      {/* Desktop: riel lateral, con el aviso de scroll en el mismo contenedor. */}
      <div className="v-railbox">
        <ol className="v-railist">
          {hint && active === null && (
            <li aria-hidden="true" className="v-rail-hint">
              {copy.hint}
            </li>
          )}
          {openable.map((t, k) => {
            const on = k === active;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  className="v-rail-item"
                  aria-current={on ? "step" : undefined}
                  data-done={visited.includes(k) || undefined}
                  onClick={() => onGo(k)}
                >
                  <span className="v-rail-n">{t.n}</span>
                  <span className="v-rail-line">
                    {on && <m.span className="v-rail-fill" style={{ scaleX: fill }} />}
                  </span>
                  <span className="v-rail-label">{t.short}</span>
                </button>
              </li>
            );
          })}
          {brand && (
            <li>
              <a href={`#${anchors[brand.anchor]}`} className="v-rail-item v-rail-brand" aria-label={copy.brandAria}>
                <span className="v-rail-n">{brand.n}</span>
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático */}
                <img src="/assets/virya-isotipo.svg" alt="" className="v-rail-iso" />
                <span className="v-rail-label">
                  {site.wordmark.text}
                  <span className="text-terracota">{site.wordmark.dot}</span>
                </span>
              </a>
            </li>
          )}
        </ol>
        {/*
          El aviso entra y sale desplegándose con CSS (grid-template-rows + opacidad).
          No con height "auto" de Motion: para medirlo, Motion restaura el scroll y
          cancelaría un scroll suave en curso (p. ej. el de la 06 hacia "Antes de irte").
        */}
        <div className="v-cue-wrap" data-on={current ? "" : undefined} aria-hidden={!current}>
          <div className="v-cue-wrap-in">
            <ScrollCue className="v-cue--rail" />
          </div>
        </div>
      </div>
    </m.nav>
  );
}
