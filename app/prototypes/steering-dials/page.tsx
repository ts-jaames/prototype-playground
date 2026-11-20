import type { Metadata } from "next";

import meta from "./metadata.json";
import { SteeringDials } from "./steering-dials";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function SteeringDialsPage() {
  return <SteeringDials />;
}
