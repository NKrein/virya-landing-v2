import { auditoria } from "./auditoria";

/**
 * "Antes de irte" (tinta, justo antes del footer): newsletter + mini auditoría.
 * Repite la oferta de la tile N.º 01 para quien llegó al final sin abrirla.
 */
export const antesDeIrte = {
  kicker: "antes de irte",
  titleLine1: auditoria.titleLine1,
  titleAccent: auditoria.titleAccent,
  bullets: auditoria.bullets,
  formAriaLabel: auditoria.formAriaLabel,
} as const;
