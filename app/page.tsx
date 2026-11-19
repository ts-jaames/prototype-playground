import { Gallery } from "@/components/gallery/gallery";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAllPrototypes } from "@/lib/prototypes";

export default function Home() {
  const prototypes = getAllPrototypes();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Prototype Playground</h1>
        <ThemeToggle />
      </header>
      <Gallery prototypes={prototypes} />
    </main>
  );
}
