import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { anchors, footer as c, site } from "@/content";
import { fmt } from "@/lib/format";

/**
 * Footer (tinta): wordmark y contacto, unido a "Antes de irte" por una línea
 * fina. La tile 06 ("virya.") lleva hasta acá.
 */
export function Footer() {
  return (
    <footer
      id={anchors.contact}
      aria-label={c.ariaLabel}
      className="v-tex on-ink flex-auto bg-tinta text-blanco"
    >
      <GrainOverlay tone="ink" />
      <div className="v-wrap">
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-on-ink-line pt-6 pb-7">
          <p className="m-0 font-display text-[56px] leading-[0.85] font-semibold tracking-[-0.03em]">
            {site.wordmark.text}
            {site.wordmark.dot}
          </p>
          <p className="m-0 text-[13px] leading-[1.6]">
            <a className="text-blanco hover:text-blanco" href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>
            <br />
            {c.instagramLabel} {site.contact.instagramHandle}
            <br />
            {fmt(c.copyright, { year: site.year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
