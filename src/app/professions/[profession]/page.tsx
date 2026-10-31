import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROFESSIONS, professionBySlug } from "@/lib/registry";
import { ProfessionHub } from "@/components/pages/profession-hub";

export function generateStaticParams() {
  return PROFESSIONS.map((p) => ({
    profession: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profession: string }>;
}): Promise<Metadata> {
  const { profession: slug } = await params;
  const p = professionBySlug(slug);

  if (!p) {
    return {
      title: "Profession Not Found | Utility Toolz",
    };
  }

  const title = `Tools for ${p.name}`;
  const description = p.blurb;
  const canonicalUrl = `/professions/${p.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} — Utility Toolz`,
      description,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Utility Toolz`,
      description,
    },
  };
}

export default async function ProfessionRoutePage({
  params,
}: {
  params: Promise<{ profession: string }>;
}) {
  const { profession: slug } = await params;
  const p = professionBySlug(slug);

  if (!p) {
    notFound();
  }

  return <ProfessionHub professionSlug={slug} />;
}
