import { ConversationalForm } from "@/components/forms/ConversationalForm";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { anchors, auditForm, footer as c, site } from "@/content";
import { fmt } from "@/lib/format";

/** Footer (tinta): newsletter + mini auditoría gratis, wordmark y contacto. */
export function Footer() {
  return (
    <footer id={anchors.audit} className="v-tex on-ink flex-auto bg-tinta text-blanco">
      <GrainOverlay tone="ink" />
      <div className="v-wrap flex flex-col gap-7 pt-11 pb-7">
        <div className="v-two">
          <div className="flex flex-col gap-3.5">
            <p className="m-0 font-hand text-2xl leading-none">{c.kicker}</p>
            <p className="v-disp m-0 text-3xl leading-[1.1] font-normal">
              {c.titleLine1}
              <br />
              <span className="mt-1 inline-block origin-left -rotate-2 font-hand text-4xl leading-none tracking-normal">
                {c.titleAccent}
              </span>
            </p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-[1.45]">
              {c.bullets.map((b) => (
                <li key={b} className="flex gap-2.5">
                  <span aria-hidden="true" className="text-on-ink-faint">→</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-1.5">
            <ConversationalForm formId="audit" def={auditForm} ariaLabel={c.formAriaLabel} tone="ink" />
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-on-ink-line pt-5">
          <p className="m-0 font-display text-[56px] leading-[0.85] font-semibold tracking-[-0.03em]">
            {site.wordmark.text}
            {site.wordmark.dot}
          </p>
          <p className="m-0 text-[13px] leading-[1.6]">
            {site.contact.email}
            <br />
            Instagram {site.contact.instagramHandle}
            <br />
            {fmt(c.copyright, { year: site.year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
