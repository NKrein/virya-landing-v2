import { Folio } from "@/components/ui/Folio";
import { anchors, quienesSomos as c } from "@/content";

/** N.º 05 — Quiénes somos: tres especialidades numeradas. */
export function QuienesSomos() {
  return (
    <section id={anchors.about} aria-labelledby="quienes-title" className="v-sec">
      <div className="v-wrap">
        <Folio {...c.folio} />
        <div className="flex max-w-[640px] flex-col gap-[18px]">
          <h2 id="quienes-title" className="v-disp v-h2 m-0">{c.title}</h2>
          <ol className="m-0 list-none border-t border-tinta p-0">
            {c.items.map((it) => (
              <li
                key={it.n}
                className="v-rv grid grid-cols-[32px_minmax(0,1fr)] gap-x-3 gap-y-0.5 border-b border-line-soft py-4"
              >
                <span className="pt-1.5 text-[13px] font-bold text-terracota">{it.n}</span>
                <p className="v-disp m-0 text-[26px] leading-[1.1] font-normal">{it.title}</p>
                <p className="col-start-2 m-0 text-[15px] leading-normal">{it.text}</p>
              </li>
            ))}
          </ol>
          <p className="m-0 text-base leading-[1.55]">{c.closing}</p>
        </div>
      </div>
    </section>
  );
}
