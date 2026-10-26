import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRelated, getCategory, getTool, tools } from "@/lib/registry";
import { JsonLd, ToolPageShell } from "@/shared";
import AppCalculator from "@/components/AppCalculator";
import AdSenseSlot from "@/components/AdSenseSlot";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.metaDescription,
    alternates: { canonical: `/tools/${tool.slug}` },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const category = getCategory(tool.category);
  const related = getRelated(tool);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yardcalc.pages.dev";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.h1,
          url: `${siteUrl}/tools/${tool.slug}`,
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          description: tool.metaDescription,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            {
              "@type": "ListItem",
              position: 2,
              name: category?.name ?? "Calculators",
              item: `${siteUrl}/category/${tool.category}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: tool.h1,
              item: `${siteUrl}/tools/${tool.slug}`,
            },
          ],
        }}
      />
      <ToolPageShell
        tool={tool}
        categoryName={category?.name ?? "Calculators"}
        categoryHref={`/category/${tool.category}`}
        related={related}
        calculator={<AppCalculator slug={tool.slug} fields={tool.fields} />}
      />
      <AdSenseSlot />
    </>
  );
}
