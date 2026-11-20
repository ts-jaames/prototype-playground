import type { Metadata } from "next";

import { AmbientField } from "./ambient-field";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function AmbientStateFieldPage() {
  return <AmbientField />;
}
