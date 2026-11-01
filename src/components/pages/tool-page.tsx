"use client";

import * as React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/site/bookmarks";
import type { Tool, ToolContent } from "@/lib/registry/types";
import { domainBySlug, relatedTools, toolBySlug } from "@/lib/registry";
import { TOOL_COMPONENTS } from "@/lib/registry/tool-components";
import { ToolCard } from "@/components/site/tool-card";
import { AdSlot } from "@/components/site/ad-slot";

/**
 * The standard tool page template (build plan §3.3):
 * breadcrumb → H1 + value prop → working tool above the fold → AdSlot (§7.1)
 * → how it works → worked example → FAQ + beside-FAQ AdSlot → related tools → tags.
 * Every tool URL is a complete, unique page — never a bare widget.
 */
export function ToolPage({
  tool: toolProp,
  toolSlug,
  content,
}: {
  tool?: Tool;
  toolSlug?: string;
  content: ToolContent;
}) {
  const tool = toolProp || (toolSlug ? toolBySlug(toolSlug) : undefined);
  // Hooks run before the early return so their order never changes between renders.
  const [resetKey, setResetKey] = React.useState(0);
  if (!tool) return null;
  const domain = domainBySlug(tool.domain);
  const Icon = domain?.icon;
  const related = relatedTools(tool, 6);
  const ToolWidget = TOOL_COMPONENTS[tool.slug];

  // Every tool gets the same "start over": clear any inputs saved in the URL
  // and remount the tool so it returns to its worked-example defaults.
  const resetTool = () => {
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    setResetKey((k) => k + 1);
  };

  return (
    <article>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${tool.domain}`}>{domain?.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{tool.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* H1 + value proposition */}
        <div className="flex items-start gap-4">
          {Icon && (
            <span className="mt-1 hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-[#7fbb92] sm:flex">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-display-lg tracking-tight">{tool.name}</h1>
            <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {tool.tagline}
            </p>
          </div>
          <div className="no-print flex shrink-0 items-center gap-1">
            <BookmarkButton slug={tool.slug} name={tool.name} />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetTool}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* Working tool above the fold */}
        <div className="mt-8">
          {ToolWidget && <ToolWidget key={resetKey} />}
        </div>

        {/* Section 7.1: Ad placement strictly between result and explanation */}
        <AdSlot slot="below-tool" className="mt-8" />

        {/* How it works */}
        <section className="mt-12 max-w-3xl" aria-labelledby="how">
          <h2 id="how" className="font-display text-display-md tracking-tight">
            {tool.name.includes("Calculator")
              ? `How the ${tool.name.replace(" Calculator", "").replace(" & ", " and ")} calculation works`
              : `How ${tool.name} works`}
          </h2>
          <div className="mt-5 space-y-4">
            {content.howItWorks.map((p, i) => (
              <p key={i} className="leading-relaxed text-foreground/85">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Worked example */}
        <section className="mt-10 max-w-3xl" aria-labelledby="example">
          <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm sm:p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-deep-orange">
              <Lightbulb className="h-4 w-4" /> Worked example
            </p>
            <p className="mt-3 leading-relaxed text-foreground/85">{content.example}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              The tool above opens with these numbers — change them to run your own scenario, or
              press Reset to come back to this example.
            </p>
          </div>
        </section>

        {/* FAQ with Beside-FAQ Ad Slot (§7.1) */}
        <section className="mt-12" aria-labelledby="faq">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 id="faq" className="font-display text-display-md tracking-tight">
                Frequently asked questions
              </h2>
              <Accordion type="single" collapsible className="mt-5">
                {content.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-foreground/85">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="flex flex-col justify-start">
              <AdSlot slot="beside-faq" className="my-0 h-full" />
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="mt-10" aria-label="Tags">
          <div className="flex flex-wrap items-center gap-2">
            {tool.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-muted-foreground">
                {t}
              </Badge>
            ))}
          </div>
          <Link
            href={`/${tool.domain}`}
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-deep-orange hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to {domain?.name}
          </Link>
        </section>

        {/* Related tools */}
        <section className="mt-12 border-t pt-10" aria-labelledby="related">
          <h2 id="related" className="font-display text-display-md tracking-tight">
            Related tools
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sibling tools in {domain?.shortName.toLowerCase()} and the metrics that travel with them.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} compact />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
