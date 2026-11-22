import { ConversationalForm } from "@/components/forms/ConversationalForm";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { anchors, antesDeIrte as c, auditForm } from "@/content";

/**
 * "Antes de irte" (tinta): newsletter + mini auditoría, justo antes del footer
 * y unida a él (mismo bloque tinta, separados por una línea fina).
 */
export function AntesDeIrte() {
  return (
    <section id={anchors.farewell} aria-labelledby="antes-title" className="v-tex on-ink bg-tinta text-blanco">
      <GrainOverlay tone="ink" />
      <div className="v-wrap v-two pt-14 pb-10 desk:pt-20 desk:pb-14">
        <div className="flex flex-col gap-3.5">
          <p className="m-0 font-hand text-2xl leading-none">{c.kicker}</p>
          <h2 id="antes-title" className="v-disp m-0 text-[2rem] leading-[1.08] font-normal desk:text-[2.6rem]">
            {c.titleLine1}
            <br />
            <span className="mt-1 inline-block origin-left -rotate-2 font-hand text-[1.15em] leading-none tracking-normal">
              {c.titleAccent}
            </span>
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-[1.45]">
            {c.bullets.map((b) => (
              <li key={b} className="flex gap-2.5">
                <span aria-hidden="true" className="text-on-ink-faint">→</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="desk:pt-9">
          <ConversationalForm formId="audit" def={auditForm} ariaLabel={c.formAriaLabel} tone="ink" />
        </div>
      </div>
    </section>
  );
}
