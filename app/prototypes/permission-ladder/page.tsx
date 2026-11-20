import type { Metadata } from "next";

import meta from "./metadata.json";
import { PermissionLadder } from "./permission-ladder";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function PermissionLadderPage() {
  return <PermissionLadder />;
}
