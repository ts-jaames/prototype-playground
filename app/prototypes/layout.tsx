import { PrototypeInfoProvider } from "@/components/playground/prototype-info";
import { PrototypeHeader } from "@/components/prototype-header";
import { getAllPrototypes } from "@/lib/prototypes";

export default function PrototypesLayout({ children }: LayoutProps<"/prototypes">) {
  const prototypes = Object.fromEntries(
    getAllPrototypes().map((p) => [p.slug, { title: p.title, description: p.description }]),
  );

  return (
    <PrototypeInfoProvider prototypes={prototypes}>
      <PrototypeHeader />
      <div className="flex flex-1 flex-col [--chrome-h:3.5rem]">{children}</div>
    </PrototypeInfoProvider>
  );
}
