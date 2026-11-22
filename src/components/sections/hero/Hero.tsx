import { Folio } from "@/components/ui/Folio";
import { Stamp } from "@/components/ui/Stamp";
import { hero } from "@/content";

/**
 * Texto del hero (titular, bajada y sello). El escenario de tiles lo ubica junto
 * al celular, que vive en src/components/stage porque es el que crece con el scroll.
 */
export function Hero() {
  return (
    <div className="v-hero-text flex min-w-0 flex-col gap-3.5">
      <Folio label={hero.folio} className="mb-1" />
      <h1 className="v-disp v-h1 m-0">
        {hero.title.before}
        <s className="text-ink-faint decoration-terracota decoration-[0.07em]">{hero.title.struck}</s>{" "}
        <span className="font-bold">{hero.title.strong}</span>
      </h1>
      <p className="m-0 max-w-[28em] text-[17px] leading-normal">{hero.subtitle}</p>
      <Stamp className="v-stamp v-spin" alt={hero.stampAlt} />
    </div>
  );
}
