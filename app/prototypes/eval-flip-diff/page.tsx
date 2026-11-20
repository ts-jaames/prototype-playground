import type { Metadata } from "next";

import { FlipDiff } from "./flip-diff";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function EvalFlipDiffPage() {
  return <FlipDiff />;
}
