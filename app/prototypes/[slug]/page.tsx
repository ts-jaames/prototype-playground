import { notFound } from "next/navigation";

// Real prototypes are static sibling folders, which always win over this dynamic
// segment. Anything that lands here is an unknown slug.
export default function UnknownPrototype() {
  notFound();
}
