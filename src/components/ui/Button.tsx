import type { ComponentProps } from "react";

type Variant = "primary" | "ink" | "light" | "outline-light";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-terracota text-blanco",
  ink: "bg-tinta text-blanco",
  light: "bg-blanco text-tinta",
  "outline-light": "border border-blanco text-blanco",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-5",
  lg: "min-h-[54px] px-6",
};

type Props = ComponentProps<"a"> & { variant?: Variant; size?: Size };

/** Botón-link con hover sutil. Los links del diseño siempre son <a>. */
export function Button({ variant = "primary", size = "lg", className = "", ...props }: Props) {
  return (
    <a
      {...props}
      className={`v-btn inline-flex items-center justify-center rounded-md font-bold no-underline hover:text-current ${variants[variant]} ${sizes[size]} ${className}`}
    />
  );
}
