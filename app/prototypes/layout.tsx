import { PrototypeHeader } from "@/components/prototype-header";
import { getAllPrototypes } from "@/lib/prototypes";

export default function PrototypesLayout({ children }: LayoutProps<"/prototypes">) {
  const titles = Object.fromEntries(getAllPrototypes().map((p) => [p.slug, p.title]));

  return (
    <>
      <PrototypeHeader titles={titles} />
      <div className="flex flex-1 flex-col [--chrome-h:3.5rem]">{children}</div>
    </>
  );
}
