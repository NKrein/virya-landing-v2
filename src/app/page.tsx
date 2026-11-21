import { sections } from "@/lib/sections";

export default function Home() {
  const inSlot = (slot: "top" | "main" | "bottom") =>
    sections.filter((s) => s.slot === slot).map(({ id, Component }) => <Component key={id} />);

  return (
    <>
      {inSlot("top")}
      <main>{inSlot("main")}</main>
      {inSlot("bottom")}
    </>
  );
}
