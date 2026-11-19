import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { loadPrototypePage } from "@/lib/load-prototype";
import { getPrototype, getPublicPrototypes } from "@/lib/prototypes";
import { siteUrl } from "@/lib/site-url";

// Only slugs flagged `"public": true` are generated; anything else is a plain 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicPrototypes().map((p) => ({ slug: p.slug }));
}

function getPublic(slug: string) {
  const prototype = getPrototype(slug);
  return prototype?.public ? prototype : null;
}

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const prototype = getPublic((await params).slug);
  if (!prototype) return {};

  const { title, description, og } = prototype;
  const base = siteUrl();
  const abs = (p: string) => new URL(p, base).toString();
  const images = og ? [{ url: abs(og.image), width: 1200, height: 630, alt: title }] : undefined;
  const videos = og?.video
    ? [{ url: abs(og.video), secureUrl: abs(og.video), width: 1200, height: 630, type: "video/mp4" }]
    : undefined;

  return {
    title,
    description,
    metadataBase: base,
    alternates: { canonical: abs(`/p/${prototype.slug}`) },
    robots: { index: true, follow: true },
    openGraph: { title, description, type: "website", url: abs(`/p/${prototype.slug}`), images, videos },
    twitter: { card: "summary_large_image", title, description, images: og ? [abs(og.image)] : undefined },
  };
}

export default async function PublicPrototypePage({ params }: PageProps<"/p/[slug]">) {
  const { slug } = await params;
  if (!getPublic(slug)) notFound();

  const Prototype = await loadPrototypePage(slug);
  return (
    <div className="flex flex-1 flex-col">
      <Prototype />
    </div>
  );
}
