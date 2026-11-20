import type { Metadata } from "next";

import { ChangesetReview } from "./changeset-review";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function ChangesetReviewPage() {
  return <ChangesetReview />;
}
