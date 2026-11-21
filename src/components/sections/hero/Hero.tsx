import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Folio } from "@/components/ui/Folio";
import { Stamp } from "@/components/ui/Stamp";
import { anchors, hero } from "@/content";
import { InstagramMockup } from "./InstagramMockup";
import { Nav } from "./Nav";

/** <header>: menú + hero (titular y mockup de Instagram). */
export function Hero() {
  return (
    <header id={anchors.home} className="v-tex">
      <GrainOverlay />
      <Nav />
      <div id={anchors.start} className="v-wrap v-hero">
        <div className="flex min-w-0 flex-col gap-3.5">
          <Folio label={hero.folio} className="mb-1" />
          <h1 className="v-disp v-h1 m-0">
            {hero.title.before}
            <s className="text-ink-faint decoration-terracota decoration-[0.07em]">
              {hero.title.struck}
            </s>{" "}
            <span className="font-bold">{hero.title.strong}</span>
          </h1>
          <p className="m-0 max-w-[28em] text-[17px] leading-normal">{hero.subtitle}</p>
          <Stamp className="v-stamp v-spin" alt={hero.stampAlt} />
        </div>
        <InstagramMockup />
      </div>
    </header>
  );
}
