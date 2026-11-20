import type { Metadata } from "next";

import { CaseGrid } from "./case-grid";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function EvalCaseGridPage() {
  return <CaseGrid />;
}
