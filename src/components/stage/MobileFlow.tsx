"use client";

import {
  LazyMotion,
  animate,
  domAnimation,
  m,
  motionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { anchors, hero as heroCopy, stage as copy, tiles, type TileId } from "@/content";
import { fmt } from "@/lib/format";
import * as mo from "@/lib/motion";
import { MOBILE_FRAME, mobileIntro, phoneScale, type MobileIntroGeometry } from "./mobileIntro";
import { PhoneProfile } from "./PhoneProfile";
import { ScrollCue } from "./ScrollCue";
import { SectionRail } from "./SectionRail";
import { TileCover } from "./TileCover";
import { useIntroPager } from "./useIntroPager";
import { measureViewport, onViewportWidthChange, type StableViewport } from "./useStableViewport";

type Props = {
  nav: ReactNode;
  hero: ReactNode;
  panels: Partial<Record<TileId, ReactNode>>;
};

const openable = tiles.filter((t) => t.panel !== null);

/** Largo de la intro y tramo en que la grilla expandida queda quieta, en pantallas (lvh). */
const INTRO_LVH = 1.4;
const GRID_HOLD_LVH = 0.2;
/** Alto de la barra superior: las anclas caen debajo (scroll-padding-top). */
const BAR_H = 76;

type Section = { top: number; height: number };
type Layout = { trackTop: number; introLen: number; svh: number; sections: Section[] };
type View = { trackH: number; introLen: number };

const EMPTY: MobileIntroGeometry = { W: 0, L: 0, S: 0, heroBottom: 0, headerH: 0, reduced: false };

/** Posición de `el` relativa a `ancestor`, sin transforms. */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

/**
 * Mobile (< 900px): flujo nativo.
 *
 * - Intro de un movimiento (useIntroPager): hero → grilla expandida → inicio
 *   de la 01, cada paso con un solo gesto y una transición animada. El celular
 *   asoma debajo del hero (nunca encima) y crece hasta que la grilla ocupa la
 *   pantalla. Solo transform/opacity: la pantalla se escala, no cambia de tamaño.
 * - Después, las secciones van una debajo de la otra con scroll 100% nativo:
 *   sin controlador de paradas ni scrollTo durante el gesto. Cada una abre con
 *   su tapa (la tile), que "se abre" al entrar (CSS, animation-timeline).
 *   Sin aviso de scroll al final: en flujo nativo el scroll se descubre solo.
 * - Alturas estables: 100lvh/100svh medidos una vez; solo se re-mide si cambia
 *   el ancho. La barra del navegador no mueve nada.
 */
export function MobileFlow({ nav, hero, panels }: Props) {
  const [view, setView] = useState<View | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [visited, setVisited] = useState<number[]>([]);

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const secRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layoutRef = useRef<Layout | null>(null);
  const geoRef = useRef<MobileIntroGeometry>(EMPTY);
  const activeRef = useRef<number | null>(null);
  /** Viewport estable: se lee al cargar y solo se vuelve a leer si cambia el ancho. */
  const vpRef = useRef<StableViewport | null>(null);

  const [introRaw] = useState(() => motionValue(0));
  const [geoVersion] = useState(() => motionValue(0));
  const [read] = useState(() => motionValue(0));
  const [barShown] = useState(() => motionValue(0));
  const intro = useSpring(introRaw, mo.introSpring);
  const { scrollY } = useScroll();

  /* ── Intro: valores derivados (sin re-render, solo transform/opacity) ── */
  const useIntro = <T,>(fn: (s: ReturnType<typeof mobileIntro>) => T) =>
    useTransform([intro, geoVersion], ([p]) => fn(mobileIntro(p as number, geoRef.current)));
  const phX = useIntro((s) => s.x);
  const phY = useIntro((s) => s.y);
  const phScale = useIntro((s) => s.scale);
  const contentY = useIntro((s) => s.contentY);
  const radius = useIntro((s) => s.radius);
  const frameRadius = useIntro((s) => s.radius + MOBILE_FRAME / s.scale);
  const frameO = useIntro((s) => s.frame);
  const heroO = useIntro((s) => s.heroOpacity);
  const heroY = useIntro((s) => s.heroY);
  const heroV = useIntro((s) => (s.heroOpacity <= 0.001 ? "hidden" : "visible"));
  const cueO = useIntro((s) => s.cue);
  const cueY = useIntro((s) => s.cueY);
  const cueV = useIntro((s) => (s.cue <= 0.01 ? "hidden" : "visible"));

  /* ── Scroll → intro, sección activa y progreso de lectura ───── */
  const apply = useCallback(
    (sy: number) => {
      const L = layoutRef.current;
      if (!L) return;
      introRaw.set(Math.min(1, Math.max(0, (sy - L.trackTop) / L.introLen)));
      // Activa: la sección que cruza el 45% de la pantalla.
      const line = sy + L.svh * 0.45;
      let k: number | null = null;
      L.sections.forEach((s, i) => {
        if (line >= s.top && line < s.top + s.height) k = i;
      });
      if (k !== null) {
        const s = L.sections[k];
        read.set(Math.min(1, Math.max(0, (sy - s.top) / Math.max(1, s.height - L.svh))));
      }
      if (k !== activeRef.current) {
        activeRef.current = k;
        setActive(k);
        if (k !== null) {
          const idx = k;
          setVisited((v) => (v.includes(idx) ? v : [...v, idx]));
        }
        animate(barShown, k !== null ? 1 : 0, { duration: 0.25, ease: mo.easeOutSoft });
      }
    },
    [introRaw, read, barShown],
  );
  useMotionValueEvent(scrollY, "change", apply);

  /* ── Medición (estable: solo al cargar y si cambia el ancho) ── */
  const measure = useCallback(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    // Nunca re-leer el alto por un cambio de contenido o de la barra del navegador.
    const width = document.documentElement.clientWidth;
    if (!vpRef.current || vpRef.current.width !== width) vpRef.current = measureViewport();
    const vp = vpRef.current;
    const heroText = heroRef.current?.querySelector<HTMLElement>(".v-hero-text");
    geoRef.current = {
      W: vp.width,
      L: vp.lvh,
      S: vp.svh,
      heroBottom: heroText ? offsetWithin(heroText, stage) + heroText.offsetHeight : vp.svh * 0.6,
      headerH: profileRef.current?.offsetHeight ?? 0,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
    geoVersion.set(geoVersion.get() + 1);
    // Marco del celular: grosor visible constante aunque el celular esté escalado.
    phoneRef.current?.style.setProperty("--mframe", `${MOBILE_FRAME / phoneScale(geoRef.current)}px`);

    const introLen = INTRO_LVH * vp.lvh;
    const trackH = introLen + GRID_HOLD_LVH * vp.lvh + vp.lvh;
    // Se aplica ya en el DOM para que las posiciones de las secciones salgan correctas.
    track.style.height = `${trackH}px`;
    setView({ trackH, introLen });
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const sections = secRefs.current.map((el) =>
      el ? { top: el.getBoundingClientRect().top + window.scrollY, height: el.offsetHeight } : { top: 0, height: 0 },
    );
    layoutRef.current = { trackTop, introLen, svh: vp.svh, sections };
    apply(window.scrollY);
  }, [apply, geoVersion]);

  useLayoutEffect(() => {
    measure();
    // Las secciones cambian de alto solo por su contenido (formularios, desplegables).
    const ro = new ResizeObserver(() => measure());
    secRefs.current.forEach((el) => el && ro.observe(el));
    const off = onViewportWidthChange(measure);
    // Las anclas caen debajo de la barra superior.
    const root = document.documentElement;
    root.style.scrollPaddingTop = `${BAR_H}px`;
    return () => {
      ro.disconnect();
      off();
      root.style.scrollPaddingTop = "";
    };
  }, [measure]);

  /* ── Intro de un movimiento: hero → grilla expandida → inicio de la 01 ── */
  const getStops = useCallback(() => {
    const L = layoutRef.current;
    if (!L || !L.sections[0]) return null;
    return [0, L.trackTop + L.introLen, L.sections[0].top - BAR_H];
  }, []);
  const { glideTo } = useIntroPager(getStops, view !== null);

  /* ── Navegación (de la 01 en adelante el scroll es nativo) ── */
  const behavior = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  const goTo = useCallback((k: number) => {
    secRefs.current[k]?.scrollIntoView({ behavior: behavior(), block: "start" });
  }, []);

  const toGrid = useCallback(() => {
    const L = layoutRef.current;
    if (!L) return;
    glideTo(L.trackTop + L.introLen);
  }, [glideTo]);

  const navigateHash = useCallback(
    (hash: string, smooth: boolean) => {
      const el = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (!el) return false;
      const sec = el.closest<HTMLElement>("[data-msec]");
      if (sec && el.matches("section")) {
        sec.scrollIntoView({ behavior: smooth ? behavior() : "auto", block: "start" });
      } else if (stageRef.current?.contains(el)) {
        window.scrollTo({ top: 0, behavior: smooth ? behavior() : "auto" });
      } else {
        el.scrollIntoView({ behavior: smooth ? behavior() : "auto", block: "start" });
      }
      return true;
    },
    [],
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href^='#']");
      if (!a) return;
      if (navigateHash(a.getAttribute("href") ?? "", true)) e.preventDefault();
    };
    const onHash = () => navigateHash(location.hash, false);
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    if (location.hash) requestAnimationFrame(onHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, [navigateHash]);

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="v-mflow">
        {/* Intro: hero + celular que crece hasta la grilla */}
        <div ref={trackRef} className="v-mintro" style={{ height: view?.trackH }}>
          {/* El grano cubre todo el escenario (no solo el hero): sin cortes de tono */}
          <div ref={stageRef} className="v-mstage">
            <GrainOverlay />
            <m.header
              ref={heroRef}
              id={anchors.home}
              className="v-hero-layer"
              style={{ opacity: heroO, y: heroY, visibility: heroV }}
            >
              {nav}
              <div id={anchors.start} className="v-wrap v-hero">
                {hero}
              </div>
            </m.header>

            <m.div
              ref={phoneRef}
              className="v-mphone"
              style={{ x: phX, y: phY, scale: phScale, originX: 0, originY: 0 }}
            >
              <m.div aria-hidden="true" className="v-mframe" style={{ opacity: frameO, borderRadius: frameRadius }} />
              <m.div
                className="v-mscreen"
                role="group"
                aria-label={heroCopy.phone.ariaLabel}
                style={{ borderRadius: radius }}
              >
                <m.div className="v-mcontent" style={{ y: contentY }}>
                  <div className="v-profile v-mprofile">
                    <PhoneProfile ref={profileRef} />
                  </div>
                  <div className="v-grid v-mgrid">
                    {tiles.map((t) => (
                      <div key={t.id} className="v-cell">
                        <a
                          href={`#${anchors[t.anchor]}`}
                          aria-label={t.cover ? fmt(copy.tileAria, { n: t.n, label: t.label }) : copy.brandAria}
                          className={`v-tile v-tone-${t.tone}`}
                        >
                          <TileCover tile={t} size="tile" still />
                        </a>
                      </div>
                    ))}
                  </div>
                </m.div>
              </m.div>
            </m.div>

            <m.div
              aria-hidden="true"
              className="v-phone-cue v-mphone-cue"
              style={{ y: cueY, opacity: cueO, visibility: cueV }}
            >
              <ScrollCue label={heroCopy.phone.cue} />
            </m.div>
          </div>
        </div>

        {/* Secciones en flujo nativo: tapa (la tile) + contenido + aviso */}
        {openable.map((t, k) => (
          <div
            key={t.id}
            ref={(el) => {
              secRefs.current[k] = el;
            }}
            data-msec={k}
            className={`v-msec v-tex v-tone-${t.panel}`}
          >
            {t.panel === "tinta" && <GrainOverlay tone="ink" />}
            <div className="v-wrap v-mcover-wrap" aria-hidden="true">
              <div className={`v-mcover v-tone-${t.tone}`}>
                <TileCover tile={t} size="tile" still />
              </div>
            </div>
            {panels[t.id]}
          </div>
        ))}

        {/* Testigo: barra superior fija */}
        <div className="v-mbar">
          <SectionRail
            active={active}
            visited={visited}
            read={read}
            shown={barShown}
            onInk={active !== null && openable[active].panel === "tinta"}
            hint={false}
            onGo={goTo}
            onGrid={toGrid}
          />
        </div>
      </div>
    </LazyMotion>
  );
}
