import type { Metadata } from "next";

import { AttentionQueue } from "./attention-queue";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function AgentAttentionQueuePage() {
  return <AttentionQueue />;
}
