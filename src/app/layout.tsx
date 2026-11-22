import type { Metadata } from "next";
import { Caveat, DM_Sans, Fraunces } from "next/font/google";
import { site } from "@/content";
import "./globals.css";

// Fraunces: solo titulares. DM Sans: todo lo que se lee. Caveat: notas al margen.
// Las variables CSS se consumen desde src/styles/tokens.css (--font-display/sans/hand).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  // PENDIENTE: imagen Open Graph para compartir.
  openGraph: {
    title: site.name,
    description: site.description,
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable}`}
    >
      <body>
        {/* El recorte horizontal va en un wrapper, no en <body>: en <body> se propaga al viewport y bloquea el scroll. */}
        <div className="flex min-h-screen flex-col overflow-x-clip">{children}</div>
      </body>
    </html>
  );
}
