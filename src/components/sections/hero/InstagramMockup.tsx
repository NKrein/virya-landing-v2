"use client";

import { useState } from "react";
import { HandArrow } from "@/components/ui/HandArrow";
import { Stamp } from "@/components/ui/Stamp";
import { hero, offers } from "@/content";
import { fmt } from "@/lib/format";

const tileTone = {
  "terracota-off": "bg-terracota-off",
  "tinta-off": "bg-tinta-off",
} as const;

/**
 * Mockup de Instagram: perfil + historias destacadas. Al tocar una se abre
 * una "historia" a pantalla completa con la oferta de ese escalón.
 */
export function InstagramMockup() {
  const [story, setStory] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const { phone, story: labels } = hero;
  const total = offers.length;

  function open(i: number) {
    setSeen((s) => (s.includes(i) ? s : [...s, i]));
    setStory(i);
  }

  if (story !== null) {
    const o = offers[story];
    const secondaryBtn =
      "min-h-11 flex-1 cursor-pointer rounded-md border border-on-ink-outline bg-transparent text-sm text-blanco disabled:cursor-default disabled:opacity-35";
    return (
      <div className="v-phone">
        <div
          className="v-storyin on-ink flex min-h-[620px] flex-col gap-[18px] bg-tinta px-4 pt-3.5 pb-5 text-blanco"
          role="region"
          aria-label={fmt(labels.region, { n: story + 1, total, name: o.name })}
        >
          <div aria-hidden="true" className="flex gap-1">
            {offers.map((_, i) => (
              <span key={i} className="block h-[3px] flex-1 overflow-hidden rounded-[2px] bg-on-ink-track">
                <span
                  className={`block h-full bg-blanco ${i === story ? "v-fill" : ""}`}
                  style={{ transformOrigin: "left", transform: i <= story ? undefined : "scaleX(0)" }}
                />
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Stamp className="size-8 rounded-full" />
              <p className="m-0 text-sm">
                <strong>{phone.profileName}</strong>{" "}
                <span className="pl-1.5">{fmt(labels.step, { n: story + 1, total })}</span>
              </p>
            </div>
            <button
              type="button"
              aria-label={labels.close}
              onClick={() => setStory(null)}
              className="flex size-11 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-blanco"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <p className="mt-1.5 mb-0 font-hand text-[28px] leading-[1.05]">“{o.situ}”</p>

          <div className="flex flex-col gap-2">
            <h3 className="v-disp m-0 text-[34px] leading-[1.05] font-normal">{o.name}</h3>
            <p className="m-0 text-[22px] font-medium">{o.price}</p>
            <p className="m-0 text-base leading-[1.55]">{o.desc}</p>
          </div>

          <ul className="m-0 flex list-none flex-col border-t border-on-ink-line p-0">
            {o.includes.map((inc) => (
              <li key={inc} className="border-b border-on-ink-line py-[11px] text-[15px] leading-[1.45]">
                {inc}
              </li>
            ))}
          </ul>

          <p className="m-0 text-sm leading-normal">{o.note}</p>

          <div className="mt-auto flex flex-col gap-2.5">
            <a
              className="v-btn flex min-h-[54px] items-center justify-center rounded-md bg-blanco text-[17px] font-bold text-tinta no-underline hover:text-tinta"
              href={o.href}
              onClick={() => setStory(null)}
            >
              {o.cta}
            </a>
            <div className="flex justify-between gap-2.5">
              <button type="button" className={secondaryBtn} disabled={story === 0} onClick={() => open(story - 1)}>
                {labels.prev}
              </button>
              <button type="button" className={secondaryBtn} disabled={story === total - 1} onClick={() => open(story + 1)}>
                {labels.next}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="v-phone">
      <div className="flex flex-col gap-[18px] px-4 pt-[22px] pb-5">
        <div className="flex items-center gap-[18px]">
          <Stamp className="size-[76px] flex-none rounded-full" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="m-0 text-lg font-bold">{phone.profileName}</p>
            <p className="m-0 text-sm">{phone.profileRole}</p>
          </div>
        </div>

        <p className="m-0 text-[15px] leading-[1.45]">{phone.bio}</p>

        <div role="group" aria-label={phone.highlightsAriaLabel} className="flex justify-between gap-1.5">
          {offers.map((o, i) => {
            const wasSeen = seen.includes(i);
            return (
              <button
                key={o.id}
                type="button"
                className="v-hl"
                aria-label={fmt(phone.highlightAria, { n: i + 1, situ: o.situ })}
                onClick={() => open(i)}
              >
                <span
                  className={`flex rounded-full border-2 p-[3px] ${wasSeen ? "border-seen-ring" : "border-terracota"} ${!wasSeen && seen.length === 0 ? "v-pulse" : ""}`}
                >
                  <span className="v-disp flex size-[52px] items-center justify-center rounded-full bg-blanco text-2xl font-normal text-terracota">
                    {i + 1}
                  </span>
                </span>
                <span className="text-center text-xs leading-[1.2]">{o.short}</span>
              </button>
            );
          })}
        </div>

        <p className="-mt-1 mb-0 flex items-center justify-center gap-1.5 font-hand text-2xl text-terracota">
          <HandArrow />
          {phone.hint}
        </p>

        <div className="-mx-4 -mb-5 grid grid-cols-3 gap-[3px]">
          {phone.tiles.map((t) => (
            <div key={t.text} className={`flex aspect-square items-end p-2.5 text-tinta ${tileTone[t.tone]}`}>
              <p className="v-disp m-0 text-[15px] leading-[1.15] font-normal">{t.text}</p>
            </div>
          ))}
          <div className="flex aspect-square items-center justify-center bg-crema">
            <Stamp className="h-auto w-[64%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
