import type { Ref } from "react";
import { Stamp } from "@/components/ui/Stamp";
import { anchors, hero as heroCopy, tiles } from "@/content";
import { fmt } from "@/lib/format";

/**
 * Cabecera del perfil dentro del celular: avatar, nombre, bio e historias
 * destacadas (diseño original: cada historia abre su tile). Compartida por el
 * escenario de desktop, el flujo mobile y el render sin JS.
 */
export function PhoneProfile({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="v-profile-in">
      <div className="flex items-center gap-3.5">
        <Stamp className="v-profile-avatar flex-none rounded-full" />
        <div className="flex min-w-0 flex-col">
          <p className="v-profile-name">{heroCopy.phone.profileName}</p>
          <p className="v-profile-role">{heroCopy.phone.profileRole}</p>
        </div>
      </div>
      <p className="v-profile-bio">{heroCopy.phone.bio}</p>
      <div role="group" aria-label={heroCopy.phone.highlightsAria} className="v-hls">
        {heroCopy.phone.highlights.map((h, i) => {
          const tile = tiles.find((t) => t.id === h.tile)!;
          return (
            <a
              key={h.tile}
              href={`#${anchors[tile.anchor]}`}
              aria-label={fmt(heroCopy.phone.highlightAria, { n: i + 1, label: h.label })}
              className="v-hl"
            >
              <span className="v-hl-ring">
                <span className="v-disp v-hl-n">{i + 1}</span>
              </span>
              <span className="v-hl-label">{h.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
