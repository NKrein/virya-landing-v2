import { href } from "./anchors";

/** Menú principal. En mobile solo se ven el wordmark y el CTA. */
export const nav = {
  ariaLabel: "Principal",
  homeAriaLabel: "Virya, inicio",
  links: [
    { label: "Workbook", href: href("workbook") },
    { label: "Marketing en orden", href: href("marketingEnOrden") },
    { label: "Auditoría gratis", href: href("audit") },
  ],
  cta: "Escribinos",
} as const;
