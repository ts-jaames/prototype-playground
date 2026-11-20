import type { Metadata } from "next";

import meta from "./metadata.json";
import { PlanSpine } from "./plan-spine";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function PlanSpinePage() {
  return <PlanSpine />;
}
