import { ConversationalForm } from "@/components/forms/ConversationalForm";
import { Folio } from "@/components/ui/Folio";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { anchors, auditForm, auditoria as c } from "@/content";

/** N.º 01 — Auditoría gratis (tinta): newsletter + mini auditoría en un formulario de 2 pasos. */
export function Auditoria() {
  return (
    <section
      id={anchors.audit}
      aria-labelledby="auditoria-title"
      className="v-tex v-sec on-ink bg-tinta text-blanco"
    >
      <GrainOverlay tone="ink" />
      <div className="v-wrap">
        <Folio {...c.folio} onInk />
        {/* Texto arriba, formulario debajo (también en desktop) */}
        <div className="flex flex-col gap-8">
          <div className="flex max-w-[640px] flex-col gap-3.5">
            <p className="m-0 font-hand text-2xl leading-none">{c.kicker}</p>
            <h2 id="auditoria-title" className="v-disp v-h2 m-0">
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
          <div className="w-full max-w-[560px]">
            <ConversationalForm formId="audit" def={auditForm} ariaLabel={c.formAriaLabel} tone="ink" />
          </div>
        </div>
      </div>
    </section>
  );
}
