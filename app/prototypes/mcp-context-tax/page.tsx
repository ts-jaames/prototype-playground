import type { Metadata } from "next";

import { ContextTax } from "./context-tax";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function McpContextTaxPage() {
  return <ContextTax />;
}
