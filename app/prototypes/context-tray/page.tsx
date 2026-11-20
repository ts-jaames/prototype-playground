import type { Metadata } from "next";

import { ContextTray } from "./context-tray";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function ContextTrayPage() {
  return <ContextTray />;
}
