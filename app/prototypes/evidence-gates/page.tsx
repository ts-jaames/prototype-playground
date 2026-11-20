import type { Metadata } from "next";

import { EvidenceGates } from "./evidence-gates";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function EvidenceGatesPage() {
  return <EvidenceGates />;
}
