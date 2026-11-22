"use client";

import {
  LazyMotion,
  MotionConfig,
  domMax,
  m,
  motionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Wordmark } from "@/components/ui/Wordmark";
import { anchors, hero as heroCopy, stage as copy, tiles, type TileId } from "@/content";
import { fmt } from "@/lib/format";
import * as mo from "@/lib/motion";
import {
  FRAME,
  frameOpacity,
  headerOpen,
  heroOut,
  introStops,
  phoneCueOpacity,
  railIn,
  screenRadius,
  screenRect,
  type IntroGeometry,
} from "./introGeometry";
import {
  buildSegments,
  gridAfter,
  openTarget,
  resolveStage,
  stepStops,
  type StageSegments,
} from "./resolveStage";
import { ScrollCue } from "./ScrollCue";
import { PhoneProfile } from "./PhoneProfile";
import { SectionRail } from "./SectionRail";
import { TileCover, toneBg, toneInk } from "./TileCover";
import { onViewportWidthChange, useMediaQuery } from "./useStableViewport";
import { useStepScroll, type StepMap } from "./useStepScroll";

type Props = {
  nav: ReactNode;
  hero: ReactNode;
  panels: Partial<Record<TileId, ReactNode>>;
};

/** Tiles que abren un panel (todas menos la de marca), en orden. */
const openable = tiles.filter((t) => t.panel !== null);
/** Índice de panel para cada tile (-1 = no abre). */
const panelOf = tiles.map((t) => openable.indexOf(t));
/** Índice en la grilla de cada panel. */
const cellOf = openable.map((t) => tiles.indexOf(t));

/** Largo de la intro, en pantallas. */
const INTRO_VH = { desk: 1.2, mobile: 1.5 };
/** Separación de la grilla (= gap de .v-grid). */
const GRID_GAP = 3;
/** Recorte del panel abierto (pantalla completa). */
const CLIP_FULL = "inset(0px 0px 0px 0px round 0px)";

type Layout = { top: number; vh: number; width: number; seg: StageSegments; steps: StepMap };
type View = { trackH: number; insets: string[] };

const EMPTY_GEO: IntroGeometry = {
  mobile: false,
  stageW: 0,
  stageH: 0,
  phone: { x: 0, y: 0, w: 0, h: 0 },
  headerH: 0,
  gridGap: GRID_GAP,
  stageOffset: 0,
  reduced: false,
};

const noopSubscribe = () => () => {};

/** Posición de `el` relativa a `ancestor`, sin transforms (offsets de layout). */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/** Recorte (clip-path) que coincide con la celda `cell` de la grilla a pantalla completa. */
function cellInset(cell: number, mobile: boolean, w: number, h: number) {
  const cols = mobile ? 2 : 3;
  const rows = mobile ? 3 : 2;
  const cw = (w - GRID_GAP * (cols - 1)) / cols;
  const ch = (h - GRID_GAP * (rows - 1)) / rows;
  const left = (cell % cols) * (cw + GRID_GAP);
  const top = Math.floor(cell / cols) * (ch + GRID_GAP);
  const px = (v: number) => `${Math.max(0, Math.round(v * 10) / 10)}px`;
  return `inset(${px(top)} ${px(w - left - cw)} ${px(h - top - ch)} ${px(left)} round 8px)`;
}

/**
 * Escenario de tiles (desktop, ≥ 900px): hero + celular + grilla + secciones,
 * en un track alto con un panel sticky de 100lvh. En mobile se usa MobileFlow.
 *
 * - Intro (sigue al scroll): la pantalla del celular, que ES la grilla, crece
 *   hasta ocupar todo y el marco desaparece. Ver introGeometry.
 * - Tiles (por umbral): el scroll decide qué tile está abierta (resolveStage);
 *   la apertura/cierre es un morph de layout compartido (layoutId) con
 *   duración fija, y el contenido se revela con un recorte que crece al mismo
 *   ritmo. Mientras está abierta, el contenido se desplaza 1:1 con el scroll.
 * - "Un gesto, una parada" (useStepScroll): un scroll largo no saltea tiles.
 *
 * Sin JS (o antes de hidratar) todo se renderiza en flujo normal.
 */
export function DesktopStage({ nav, hero, panels }: Props) {
  // false en el servidor y al hidratar; true después: activa el modo escenario.
  const enhanced = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const fine = useMediaQuery("(pointer: fine)", true);
  const [view, setView] = useState<View | null>(null);

  // Estado que pide el scroll (target) y estado visual que lo persigue.
  const [target, setTarget] = useState<number | null>(null);
  const [shown, setShown] = useState<number | null>(null);
  const [returning, setReturning] = useState<number | null>(null);
  const [quickClose, setQuickClose] = useState(false);
  const [tick, setTick] = useState(0);
  const [visited, setVisited] = useState<number[]>([]);
  const reduced = useReducedMotion() ?? false;

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layoutRef = useRef<Layout | null>(null);
  const geoRef = useRef<IntroGeometry>(EMPTY_GEO);
  const activeRef = useRef<number | null>(null);
  const suppressRef = useRef(false);
  const focusRef = useRef<number | null>(null);
  const closingUntil = useRef(0);

  const [readYs] = useState(() => openable.map(() => motionValue(0)));
  const [readProgress] = useState(() => motionValue(0));
  const [introRaw] = useState(() => motionValue(0));
  /** Cambia cuando se re-mide: fuerza a recalcular la geometría de la intro. */
  const [geoVersion] = useState(() => motionValue(0));
  const intro = useSpring(introRaw, mo.introSpring);

  const { scrollY } = useScroll();

  /* ── Intro: valores derivados del progreso (sin re-render) ───── */
  const useGeo = <T,>(fn: (p: number, g: IntroGeometry) => T) =>
    useTransform([intro, geoVersion], ([p]) => fn(p as number, geoRef.current));

  const scrX = useGeo((p, g) => screenRect(p, g).x);
  const scrY = useGeo((p, g) => screenRect(p, g).y);
  const scrW = useGeo((p, g) => screenRect(p, g).w);
  const scrH = useGeo((p, g) => screenRect(p, g).h);
  const scrR = useGeo((p, g) => screenRadius(p, g));
  const bezX = useGeo((p, g) => screenRect(p, g).x - FRAME);
  const bezY = useGeo((p, g) => screenRect(p, g).y - FRAME);
  const bezW = useGeo((p, g) => screenRect(p, g).w + FRAME * 2);
  const bezH = useGeo((p, g) => screenRect(p, g).h + FRAME * 2);
  const bezR = useGeo((p, g) => screenRadius(p, g) + FRAME);
  const bezO = useGeo((p, g) => frameOpacity(p, g));
  const profH = useGeo((p, g) => g.headerH * headerOpen(p, g));
  const profO = useGeo((p, g) => headerOpen(p, g));
  const heroO = useGeo((p, g) => 1 - heroOut(p, g));
  const heroX = useGeo((p, g) => (g.mobile ? 0 : -0.06 * g.stageW * heroOut(p, g)));
  const heroY = useGeo((p, g) => (g.mobile ? -0.3 * g.stageH * heroOut(p, g) : 0));
  const heroV = useGeo((p, g) => (heroOut(p, g) >= 0.999 ? "hidden" : "visible"));
  const railO = useGeo((p, g) => railIn(p, g));
  const cueX = useGeo((p, g) => screenRect(p, g).x);
  const cueY = useGeo((p, g) => { const r = screenRect(p, g); return r.y + r.h + FRAME + 14; });
  const cueW = useGeo((p, g) => screenRect(p, g).w);
  const cueO = useGeo((p, g) => phoneCueOpacity(p, g));
  const cueV = useGeo((p, g) => (phoneCueOpacity(p, g) <= 0.01 ? "hidden" : "visible"));

  /* ── Scroll → estado ─────────────────────────────────────────── */
  const apply = useCallback(
    (sy: number) => {
      const L = layoutRef.current;
      if (!L) return;
      const s = resolveStage(sy - L.top, L.seg, L.vh, activeRef.current);
      activeRef.current = s.active;
      introRaw.set(s.intro);
      if (s.active !== null) {
        readYs[s.active].set(-s.readOffset);
        readProgress.set(s.read);
      }
      setTarget(suppressRef.current ? null : s.active);
    },
    [readYs, introRaw, readProgress],
  );

  useMotionValueEvent(scrollY, "change", apply);

  /* ── Medición: celular, cabecera y alto de cada panel → track ── */
  const measure = useCallback(
    () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      const slot = slotRef.current;
      if (!track || !stage || !slot) return;
      const width = window.innerWidth;
      // El escenario mide 100lvh: su alto no cambia con la barra del navegador.
      const vh = stage.clientHeight;
      const mobile = !window.matchMedia("(width >= 900px)").matches;

      const stageW = stage.clientWidth;
      const stageH = stage.clientHeight;
      const at = offsetWithin(slot, stage);
      // Grilla dentro del celular con celdas 3:4 (como el perfil de Instagram): la
      // cabecera del perfil toma el resto del alto (nunca menos que su contenido).
      const cols = mobile ? 2 : 3;
      const rows = mobile ? 3 : 2;
      const cellW = (slot.offsetWidth - GRID_GAP * (cols - 1)) / cols;
      const gridH = rows * cellW * (4 / 3) + GRID_GAP * (rows - 1);
      const headerNatural = profileRef.current?.offsetHeight ?? 0;
      geoRef.current = {
        mobile,
        stageW,
        stageH,
        phone: { x: at.x, y: at.y, w: slot.offsetWidth, h: slot.offsetHeight },
        headerH: Math.max(headerNatural, slot.offsetHeight - gridH),
        gridGap: GRID_GAP,
        stageOffset: Math.max(0, track.getBoundingClientRect().top + window.scrollY),
        reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      };
      geoVersion.set(geoVersion.get() + 1);

      const readLens = openable.map((_, k) => Math.max(0, (contentRefs.current[k]?.offsetHeight ?? vh) - vh));
      const seg = buildSegments({ vh, introLen: (mobile ? INTRO_VH.mobile : INTRO_VH.desk) * vh, readLens });
      const top = track.getBoundingClientRect().top + window.scrollY;
      const trackH = seg.total + vh;
      // Paradas absolutas: arriba de todo, las del recorrido y el final de la página (footer).
      const rel = stepStops(seg, introStops(geoRef.current));
      const pageEnd = top + trackH + (document.documentElement.scrollHeight - (top + track.offsetHeight)) - vh;
      // Después del escenario ("Antes de irte" + footer) el scroll es libre hasta el final.
      // Si lo que sigue es más corto que una pantalla, el final de la página es la última parada.
      const end = Math.max(pageEnd, top + rel.stops.at(-1)! + 1);
      const trackEnd = Math.min(top + trackH, end);
      const steps: StepMap = {
        stops: [0, ...rel.stops.map((y) => top + y), trackEnd, ...(end > trackEnd + 1 ? [end] : [])],
        ranges: [...rel.ranges.map(([a, b]): [number, number] => [top + a, top + b]), [trackEnd, end]],
        vh,
      };
      layoutRef.current = { top, vh, width, seg, steps };
      setView({ trackH, insets: cellOf.map((cell) => cellInset(cell, mobile, stageW, stageH)) });
      apply(window.scrollY);
    },
    [apply, geoVersion],
  );

  useLayoutEffect(() => {
    if (!enhanced) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    contentRefs.current.forEach((el) => el && ro.observe(el));
    ro.observe(document.body);
    // Cambios solo de alto (barra del navegador) no re-miden; con mouse, cualquier resize sí.
    const off = onViewportWidthChange(measure, fine);
    return () => {
      ro.disconnect();
      off();
    };
  }, [enhanced, measure, fine]);

  /* ── Director: persigue `target` con apertura/cierre secuenciados ── */
  useEffect(() => {
    if (target === shown) return;
    let timer: number | undefined;
    const later = (fn: () => void, ms: number) => {
      timer = window.setTimeout(fn, Math.max(0, ms));
    };

    if (shown !== null) {
      // Cerrar la actual: la tile vuelve a su celda y el contenido se va con ella.
      later(() => {
        const quick = target !== null;
        const spring = quick ? mo.quickCloseSpring : mo.closeSpring;
        const ms = reduced ? mo.reducedFade.duration * 1000 : spring.visualDuration * 1000;
        closingUntil.current = performance.now() + ms;
        setQuickClose(quick);
        setReturning(shown);
        setShown(null);
      }, 0);
    } else if (target !== null) {
      if (intro.get() < 0.995 && !reduced) {
        // Click durante la intro: primero termina de crecer la grilla
        // (con movimiento reducido la grilla ya saltó a su estado final).
        later(() => setTick((t) => t + 1), 60);
      } else {
        // Abrir la pedida, cuando terminó el cierre anterior (cola de 1).
        later(() => {
          setReturning(null);
          setShown(target);
          setVisited((v) => (v.includes(target) ? v : [...v, target]));
        }, closingUntil.current - performance.now());
      }
    }
    return () => window.clearTimeout(timer);
  }, [target, shown, tick, intro, reduced]);

  // La tile que vuelve queda por encima de las demás solo mientras dura el cierre.
  useEffect(() => {
    if (returning === null) return;
    const t = window.setTimeout(() => setReturning(null), 600);
    return () => window.clearTimeout(t);
  }, [returning]);

  /* ── Navegación ──────────────────────────────────────────────── */
  const getSteps = useCallback(() => layoutRef.current?.steps ?? null, []);
  // "Un gesto, una parada" solo con mouse/trackpad: en táctil pelea con la inercia nativa.
  const { jump } = useStepScroll(getSteps, enhanced && fine);

  const goTo = useCallback(
    (k: number, focus = true) => {
      const L = layoutRef.current;
      if (!L) return;
      suppressRef.current = false;
      focusRef.current = focus ? k : null;
      jump(L.top + openTarget(L.seg, k));
    },
    [jump],
  );

  const backToGrid = useCallback(() => {
    const L = layoutRef.current;
    const k = activeRef.current;
    if (!L || k === null) return;
    jump(L.top + gridAfter(L.seg, k));
  }, [jump]);

  /** Scroll suave fuera del recorrido de tiles, sin abrir las que atraviesa. */
  const glideTo = useCallback(
    (top: number) => {
      suppressRef.current = true;
      setTarget(null);
      const done = () => {
        if (!suppressRef.current) return;
        suppressRef.current = false;
        apply(window.scrollY);
      };
      window.addEventListener("scrollend", done, { once: true });
      window.setTimeout(done, 1500);
      jump(top, true);
    },
    [apply, jump],
  );

  /** Resuelve un hash: si cae dentro de un panel, abre esa tile. */
  const navigateHash = useCallback(
    (hash: string, smooth: boolean) => {
      const el = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (!el) return false;
      const panel = el.closest<HTMLElement>("[data-panel]");
      if (panel) {
        goTo(Number(panel.dataset.panel));
        return true;
      }
      // Hero / menú (dentro del escenario): volver arriba de todo.
      const top = stageRef.current?.contains(el) ? 0 : el.getBoundingClientRect().top + window.scrollY;
      if (smooth) glideTo(top);
      else jump(top);
      return true;
    },
    [goTo, glideTo, jump],
  );

  useEffect(() => {
    if (!enhanced) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href^='#']");
      if (!a) return;
      if (navigateHash(a.getAttribute("href") ?? "", true)) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeRef.current !== null) backToGrid();
    };
    // Hash cambiado desde afuera (link pegado, atrás/adelante): mismo destino que un click.
    const onHash = () => navigateHash(location.hash, false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    if (location.hash) requestAnimationFrame(onHash);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [enhanced, navigateHash, backToGrid]);

  /** Con Tab dentro del panel: si el foco quedó fuera de pantalla, traerlo. */
  const onPanelFocus = (k: number) => (e: React.FocusEvent) => {
    const L = layoutRef.current;
    const content = contentRefs.current[k];
    if (!L || !content || activeRef.current !== k) return;
    const el = e.target as HTMLElement;
    requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      if (r.top >= 64 && r.bottom <= L.vh - 32) return;
      const t = L.seg.tiles[k];
      const elTop = r.top - content.getBoundingClientRect().top;
      const offset = Math.min(t.readEnd - t.readStart, Math.max(0, elTop - L.vh * 0.3));
      jump(L.top + t.readStart + offset);
    });
  };

  /* ── Render ──────────────────────────────────────────────────── */
  const grid = (interactive: boolean) => (
    <div className="v-grid" inert={interactive && shown !== null}>
      {tiles.map((t, i) => {
        const k = panelOf[i];
        const isShown = k !== -1 && k === shown;
        const dim = interactive && shown !== null && !isShown;
        const label = t.cover ? fmt(copy.tileAria, { n: t.n, label: t.label }) : copy.brandAria;
        const back = interactive && k !== -1 && returning === k ? t.panel : null;
        return (
          <div key={t.id} className="v-cell" style={{ zIndex: back ? 2 : undefined }}>
            {!isShown && (
              <m.a
                layoutId={interactive && k !== -1 ? `tile-${t.id}` : undefined}
                // Solo se mide en aperturas y cierres, no mientras la intro cambia el tamaño.
                layoutDependency={shown}
                href={`#${anchors[t.anchor]}`}
                aria-label={label}
                className={`v-tile v-tone-${t.tone}`}
                onClick={
                  interactive && k !== -1
                    ? (e) => {
                        e.preventDefault();
                        goTo(k);
                      }
                    : undefined
                }
                initial={back ? { backgroundColor: toneBg(back), color: toneInk(back) } : false}
                animate={{
                  backgroundColor: toneBg(t.tone),
                  color: toneInk(t.tone),
                  opacity: dim ? 0.55 : 1,
                  scale: dim ? 0.98 : 1,
                }}
                transition={{
                  layout: quickClose ? mo.quickCloseSpring : mo.closeSpring,
                  backgroundColor: mo.closeSpring,
                  color: mo.closeSpring,
                  default: mo.lift,
                }}
              >
                <TileCover tile={t} size="tile" layoutDependency={shown} />
              </m.a>
            )}
          </div>
        );
      })}
    </div>
  );

  const profile = <PhoneProfile ref={profileRef} />;

  if (!enhanced) {
    return (
      <LazyMotion features={domMax} strict>
        <div className="v-flow">
          <header id={anchors.home} className="v-tex v-hero-layer v-hero-layer--flow">
            <GrainOverlay />
            {nav}
            <div id={anchors.start} className="v-wrap v-hero">
              {hero}
              <div className="v-phone-slot">
                <div className="v-phone-static" role="group" aria-label={heroCopy.phone.ariaLabel}>
                  <div className="v-profile">{profile}</div>
                  {grid(false)}
                </div>
              </div>
            </div>
          </header>
          {openable.map((t) => (
            <div key={t.id}>{panels[t.id]}</div>
          ))}
        </div>
      </LazyMotion>
    );
  }

  const shownTile = shown !== null ? openable[shown] : null;

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <div ref={trackRef} className="v-track" style={{ height: view?.trackH }}>
          <div ref={stageRef} className="v-stage">
            <m.header
              id={anchors.home}
              className="v-tex v-hero-layer"
              style={{ opacity: heroO, x: heroX, y: heroY, visibility: heroV }}
            >
              <GrainOverlay />
              {nav}
              <div id={anchors.start} className="v-wrap v-hero">
                {hero}
                {/* Lugar del celular en el hero: se mide, el celular se dibuja aparte. */}
                <div ref={slotRef} aria-hidden="true" className="v-phone-slot" />
              </div>
            </m.header>

            {/* Marco del celular: detrás de la pantalla, se desvanece al crecer. */}
            <m.div
              aria-hidden="true"
              className="v-bezel"
              style={{ x: bezX, y: bezY, width: bezW, height: bezH, borderRadius: bezR, opacity: bezO }}
            />

            {/* Aviso debajo del celular: se va cuando el celular empieza a crecer. */}
            <m.div
              aria-hidden="true"
              className="v-phone-cue"
              style={{ x: cueX, y: cueY, width: cueW, opacity: cueO, visibility: cueV }}
            >
              <ScrollCue label={heroCopy.phone.cue} />
            </m.div>

            {/* Pantalla del celular = la grilla de tiles. */}
            <m.div
              className="v-screen"
              role="group"
              aria-label={heroCopy.phone.ariaLabel}
              style={{ x: scrX, y: scrY, width: scrW, height: scrH, borderRadius: scrR }}
            >
              <m.div className="v-profile" style={{ height: profH, opacity: profO }}>
                {profile}
              </m.div>
              {grid(true)}
            </m.div>

            {/* Cáscara: la tile a pantalla completa (mismo layoutId que en la grilla). */}
            {shownTile && (
              <m.div
                key={shownTile.id}
                layoutId={`tile-${shownTile.id}`}
                className="v-shell"
                initial={{
                  backgroundColor: toneBg(shownTile.tone),
                  color: toneInk(shownTile.tone),
                  borderRadius: 8,
                }}
                animate={{
                  backgroundColor: toneBg(shownTile.panel!),
                  color: toneInk(shownTile.panel!),
                  borderRadius: 0,
                }}
                transition={reduced ? mo.reducedFade : { default: mo.openSpring, layout: mo.openSpring }}
              >
                {/* La tapa se va mientras entra el contenido: mismo ritmo que la apertura. */}
                <m.div
                  className="h-full"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={reduced ? mo.reducedFade : mo.contentIn}
                >
                  <TileCover tile={shownTile} size="full" />
                </m.div>
              </m.div>
            )}

            {/* Paneles: el contenido real, revelado por un recorte que crece con la tile. */}
            {openable.map((t, k) => {
              const on = shown === k;
              const closed = view?.insets[k] ?? CLIP_FULL;
              return (
                <m.div
                  key={t.id}
                  ref={(el) => {
                    panelRefs.current[k] = el;
                  }}
                  data-panel={k}
                  tabIndex={-1}
                  inert={!on}
                  className="v-panel"
                  onFocus={onPanelFocus(k)}
                  initial={false}
                  animate={
                    on
                      ? { opacity: 1, clipPath: CLIP_FULL, visibility: "visible" }
                      : { opacity: 0, clipPath: closed, transitionEnd: { visibility: "hidden" } }
                  }
                  transition={
                    reduced
                      ? { clipPath: { duration: 0 }, opacity: mo.reducedFade }
                      : on
                        ? { clipPath: mo.openSpring, opacity: mo.contentIn }
                        : { clipPath: quickClose ? mo.quickCloseSpring : mo.closeSpring, opacity: mo.contentOut }
                  }
                  onAnimationComplete={() => {
                    // Foco al panel solo si se abrió con click (no con scroll). Va al final de
                    // la entrada: antes el panel todavía tiene visibility: hidden.
                    if (on && focusRef.current === k) {
                      focusRef.current = null;
                      panelRefs.current[k]?.focus({ preventScroll: true });
                    }
                  }}
                >
                  <m.div
                    ref={(el) => {
                      contentRefs.current[k] = el;
                    }}
                    className={`v-panel-content v-tex v-tone-${t.panel}`}
                    style={{ y: readYs[k] }}
                  >
                    {/* El grano va en todo el panel (no solo en la sección): sin cortes de textura */}
                    {t.panel === "tinta" && <GrainOverlay tone="ink" />}
                    {/* Encabezado de marca de la tile abierta */}
                    <div className="v-wrap v-panel-head" aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático */}
                      <img src="/assets/virya-isotipo.svg" alt="" className="v-panel-iso" />
                      <Wordmark className="v-panel-wordmark" />
                    </div>
                    {panels[t.id]}
                    {/* Mobile: aviso de scroll al final del contenido (desktop: debajo del riel) */}
                    <ScrollCue className="v-cue--panel" />
                  </m.div>
                </m.div>
              );
            })}

            {shownTile && (
              <m.button
                type="button"
                className="v-close"
                data-ink={shownTile.panel === "tinta" || undefined}
                aria-label={copy.close}
                onClick={backToGrid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={reduced ? mo.reducedFade : mo.contentIn}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </m.button>
            )}

            <SectionRail
              active={target}
              visited={visited}
              read={readProgress}
              shown={railO}
              onInk={target !== null && openable[target].panel === "tinta"}
              hint={visited.length === 0}
              onGo={(k) => goTo(k)}
            />
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
