import type { Metadata } from "next";

import { DiffMorph } from "./diff-morph";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function DiffMorphPage() {
  return <DiffMorph />;
}
