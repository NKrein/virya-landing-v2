import { Button } from "@/components/ui/Button";
import { anchors, budgetMailto, nav, site } from "@/content";

/** Menú: wordmark, links y "Escribinos". En mobile solo wordmark + CTA. */
export function Nav() {
  return (
    <nav
      aria-label={nav.ariaLabel}
      className="v-wrap flex items-center justify-between gap-4 py-3"
    >
      <a
        href={`#${anchors.home}`}
        aria-label={nav.homeAriaLabel}
        className="flex min-h-11 items-center font-display text-[30px] font-semibold tracking-[-0.02em] text-tinta no-underline"
      >
        {site.wordmark.text}
        <span className="text-terracota">{site.wordmark.dot}</span>
      </a>

      <Button
        href={budgetMailto}
        variant="ink"
        size="md"
        className="v-navcta min-h-11 px-4 text-[15px] font-medium"
      >
        {nav.cta}
      </Button>

      <div className="v-navlinks text-base">
        {nav.links.map((l) => (
          <a key={l.href} href={l.href} className="py-3 text-tinta no-underline">
            {l.label}
          </a>
        ))}
        <Button href={budgetMailto} variant="ink" size="md" className="min-h-11 px-[18px] font-medium">
          {nav.cta}
        </Button>
      </div>
    </nav>
  );
}
