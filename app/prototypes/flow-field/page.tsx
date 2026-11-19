import type { Metadata } from "next";

import { FlowField } from "./flow-field";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function FlowFieldPage() {
  return <FlowField />;
}
