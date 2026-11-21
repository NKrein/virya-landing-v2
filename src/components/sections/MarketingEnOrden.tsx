import { Button } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { Folio } from "@/components/ui/Folio";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { anchors, marketingEnOrden as c } from "@/content";

/** N.º 02 — Marketing en orden: bloque tinta con servicio mensual y sesión estratégica. */
export function MarketingEnOrden() {
  return (
    <section
      id={anchors.marketingEnOrden}
      aria-labelledby="meo-title"
      className="v-tex v-sec on-ink bg-tinta text-blanco"
    >
      <GrainOverlay tone="ink" />
      <div className="v-wrap">
        <Folio {...c.folio} onInk />
        <div className="v-two">
          <div className="flex flex-col gap-[22px]">
            <h2 id="meo-title" className="v-disp v-h2 m-0">{c.title}</h2>
            <div className="flex flex-col gap-2.5">
              <p className="v-disp m-0 text-[22px] leading-[1.25] font-normal">{c.hook}</p>
              <p className="m-0 text-base leading-[1.55]">{c.lead}</p>
            </div>

            <Disclosure
              summary={c.includes.summary}
              className="text-blanco"
              summaryClassName="text-base"
              markerClassName="text-xl font-normal"
            >
              <ol className="m-0 list-none border-t border-on-ink-line-soft p-0">
                {c.includes.items.map((it) => (
                  <li key={it.n} className="flex items-baseline gap-4 border-b border-on-ink-line-soft py-3.5">
                    <span className="min-w-[22px] text-[13px] font-bold text-on-ink-muted">{it.n}</span>
                    <span className="text-base leading-[1.45]">{it.label}</span>
                  </li>
                ))}
              </ol>
            </Disclosure>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3.5 rounded-md border border-on-ink-line-soft bg-on-ink-surface px-5 py-[22px]">
              <div className="flex flex-col gap-1">
                <p className="m-0 text-xl font-bold">{c.budgetCard.title}</p>
                <p className="m-0 text-[15px] leading-normal">{c.budgetCard.text}</p>
              </div>
              <Button href={c.budgetCard.cta.href} variant="light">{c.budgetCard.cta.label}</Button>
            </div>

            <div
              id={anchors.session}
              className="flex flex-col gap-2.5 rounded-md border border-dashed border-on-ink-dashed p-5"
            >
              <p className="m-0 font-hand text-[22px] leading-none">{c.session.note}</p>
              <p className="v-disp m-0 text-[22px] leading-[1.2] font-normal">{c.session.title}</p>
              <p className="m-0 text-sm leading-[1.45]">
                {c.session.meta}
                <b>{c.session.price}</b>
              </p>
              <Button href={c.session.cta.href} variant="outline-light" size="md" className="self-start">
                {c.session.cta.label}
              </Button>
              <p className="m-0 text-[13px] leading-[1.45] text-on-ink-subtle">{c.session.footnote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
