import { Auditoria } from "@/components/sections/Auditoria";
import { Hero } from "@/components/sections/hero/Hero";
import { Nav } from "@/components/sections/hero/Nav";
import { MarketingEnOrden } from "@/components/sections/MarketingEnOrden";
import { Presupuesto } from "@/components/sections/Presupuesto";
import { QuienesSomos } from "@/components/sections/QuienesSomos";
import { Workbook } from "@/components/sections/Workbook";
import { TileStage } from "./TileStage";

/**
 * Hero + celular + grilla de tiles + secciones, en un solo escenario.
 * Las secciones siguen siendo Server Components: se renderizan acá y pasan al
 * escenario (cliente) como contenido ya resuelto. La tile de marca (06) no
 * tiene sección: lleva al footer.
 */
export function Tiles() {
  return (
    <TileStage
      nav={<Nav />}
      hero={<Hero />}
      panels={{
        audit: <Auditoria />,
        workbook: <Workbook />,
        marketing: <MarketingEnOrden />,
        projects: <Presupuesto />,
        about: <QuienesSomos />,
      }}
    />
  );
}
