import { announcement } from "@/content";

/** Barra superior (tinta) con el anuncio del workbook. */
export function AnnouncementBar() {
  return (
    <a
      href={announcement.href}
      className="block bg-tinta px-4 py-[9px] text-center text-sm leading-[1.4] text-blanco no-underline hover:text-blanco"
    >
      {announcement.text}
      <span className="underline">{announcement.link}</span>
    </a>
  );
}
