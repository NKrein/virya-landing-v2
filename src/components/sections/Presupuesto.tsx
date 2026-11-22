import { ConversationalForm } from "@/components/forms/ConversationalForm";
import { Chip } from "@/components/ui/Chip";
import { Folio } from "@/components/ui/Folio";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { anchors, budgetForm, presupuesto as c } from "@/content";

/** N.º 04 — Proyectos a medida: chips de servicios + formulario en "hoja de papel" con cinta. */
export function Presupuesto() {
  return (
    <section id={anchors.budget} aria-labelledby="presupuesto-title" className="v-sec">
      <div className="v-wrap">
        <Folio {...c.folio} />
        {/* Texto arriba, formulario debajo (también en desktop) */}
        <div className="flex flex-col gap-8">
          <div className="flex max-w-[640px] flex-col gap-3.5">
            <h2 id="presupuesto-title" className="v-disp v-h2 m-0">{c.title}</h2>
            <div className="v-chips">
              {c.chips.map((chip) => (
                <Chip key={chip}>{chip}</Chip>
              ))}
            </div>
            <p className="m-0 text-[15px] leading-normal">{c.text}</p>
          </div>

          <div className="v-paper v-rv box-border flex w-full max-w-[560px] flex-col gap-3 rounded-sm px-[18px] pt-7 pb-[22px]">
            <GrainOverlay />
            <span
              aria-hidden="true"
              className="v-tape absolute -top-3 left-[18px] h-6 w-[78px] -rotate-6 bg-terracota-tape"
            />
            <ConversationalForm formId="budget" def={budgetForm} ariaLabel={c.formAriaLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
