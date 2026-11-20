import type { Metadata } from "next";

import { CallLedger } from "./call-ledger";
import meta from "./metadata.json";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function McpCallLedgerPage() {
  return <CallLedger />;
}
