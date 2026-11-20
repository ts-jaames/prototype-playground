import type { Metadata } from "next";

import meta from "./metadata.json";
import { ProvenanceChips } from "./provenance-chips";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function ProvenanceChipsPage() {
  return <ProvenanceChips />;
}
