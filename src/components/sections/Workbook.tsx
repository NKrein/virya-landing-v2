import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Disclosure } from "@/components/ui/Disclosure";
import { Folio } from "@/components/ui/Folio";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { HandUnderline } from "@/components/ui/HandUnderline";
import { Stamp } from "@/components/ui/Stamp";
import { anchors, workbook as c } from "@/content";

/** N.º 01 — Workbook: tablet con la tapa, textos, módulos y precio de lanzamiento. */
export function Workbook() {
  return (
    <section
      id={anchors.workbook}
      aria-labelledby="workbook-title"
      className="v-sec border-t border-line"
    >
      <div className="v-wrap">
        <Folio {...c.folio} />
        <div className="v-two items-center">
          <div className="flex flex-col items-center gap-[22px] pt-2 pb-1">
            <div className="v-tab v-rv" role="img" aria-label={c.cover.ariaLabel}>
              <div className="v-tabscr">
                <GrainOverlay />
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold tracking-[0.12em] uppercase">{c.cover.tag}</span>
                  <Stamp className="size-[46px]" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <p className="v-disp m-0 text-[30px] leading-[0.98] font-normal">
                    {c.cover.titleBefore}
                    <span className="text-terracota">{c.cover.titleAccent}</span>
                  </p>
                  <HandUnderline />
                  <p className="m-0 text-[11px] leading-[1.4]">{c.cover.meta}</p>
                </div>
              </div>
            </div>
            <p aria-hidden="true" className="m-0 -rotate-3 pl-24 font-hand text-2xl text-terracota">
              {c.cover.handNote}
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <h2 id="workbook-title" className="v-disp v-h2 m-0">{c.title}</h2>
            <p className="m-0 text-base leading-normal">{c.intro}</p>
            <div className="v-chips">
              {c.chips.map((chip) => (
                <Chip key={chip.label} accent={"accent" in chip && chip.accent}>{chip.label}</Chip>
              ))}
            </div>

            <Disclosure summary={c.modules.summary}>
              <ol className="m-0 mb-2 list-none border-t border-line p-0 text-[15px] leading-normal">
                {c.modules.items.map((m) => (
                  <li key={m.n} className="flex gap-3 border-b border-line py-[7px]">
                    <span className="font-bold text-terracota">{m.n}</span>
                    {m.label}
                  </li>
                ))}
              </ol>
            </Disclosure>

            <p className="m-0 text-[15px] leading-normal">
              <b>{c.outcome.lead}</b>
              {c.outcome.text}
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-hand text-[22px] leading-none text-terracota">{c.price.note}</span>
                <p className="m-0 flex items-baseline gap-2.5">
                  <span className="text-[26px] font-medium">{c.price.current}</span>
                  <s className="text-base text-ink-muted">{c.price.original}</s>
                </p>
              </div>
              <Button href={c.cta.href} className="flex-[1_1_200px]">{c.cta.label}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
