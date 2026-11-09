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
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/site/bookmarks";
import { useCurrency } from "@/components/site/currency";
import { ToolToolbarContext } from "@/components/site/tool-toolbar";
import type { Tool, ToolContent } from "@/lib/registry/types";
import { domainBySlug, relatedTools, toolBySlug } from "@/lib/registry";
import { TOOL_COMPONENTS } from "@/lib/registry/tool-components";
import { ToolCard } from "@/components/site/tool-card";
import { AdSlot } from "@/components/site/ad-slot";

/**
 * The tool shell every tool shares: breadcrumb, title and one toolbar, then
 * the working tool, then explanation. Ads sit below the tool and beside the
 * FAQ, never between its input and output.
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
  const [toolbar, setToolbar] = React.useState<HTMLDivElement | null>(null);
  // Re-renders the tool with the new symbol when the display currency changes.
  useCurrency();
  if (!tool) return null;
  const domain = domainBySlug(tool.domain);
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
    <article className="mx-auto max-w-7xl px-4 pb-14 pt-3 sm:px-6">
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

      <header className="mt-4">
        <h1 className="text-display-lg">{tool.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{tool.tagline}</p>
        {/* One row that scrolls, never wraps: tools add actions after hydration, and they must not move the tool. */}
        <div
          role="group"
          aria-label="Tool actions"
          className="no-print -m-1 mt-2 flex items-center gap-2 overflow-x-auto p-1 [scrollbar-width:none]"
        >
          <BookmarkButton
            slug={tool.slug}
            name={tool.name}
            className="shrink-0 rounded-md border-[1.5px] border-input sm:h-10 sm:w-10"
          />
          <Button type="button" variant="outline" size="sm" onClick={resetTool} className="shrink-0 gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
          <div ref={setToolbar} className="contents [&>*]:shrink-0" />
        </div>
      </header>

      <div className="mt-5">
        <ToolToolbarContext.Provider value={toolbar}>
          {ToolWidget && <ToolWidget key={resetKey} />}
        </ToolToolbarContext.Provider>
      </div>

      <AdSlot slot="below-tool" className="mb-0 mt-2" />

      <section className="mt-14" aria-labelledby="how">
        <h2 id="how" className="text-display-md">
          {tool.name.includes("Calculator")
            ? `How the ${tool.name.replace(" Calculator", "").replace(" & ", " and ")} calculation works`
            : `How ${tool.name} works`}
        </h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {content.howItWorks.map((p, i) => (
            <p key={i} className="rounded-xl bg-card p-5 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-2 rounded-xl bg-muted p-5">
          <h3 className="font-sans font-semibold tracking-normal">Worked example</h3>
          <p className="mt-1 max-w-4xl text-lg leading-snug">{content.example}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The tool above opens with these numbers. Change them to run your own scenario, or press Reset to
            come back to this example.
          </p>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="faq">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 id="faq" className="text-display-md">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="mt-4 flex flex-col gap-2">
              {content.faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-md border-[1.5px] border-input px-4 last:border-b-[1.5px]"
                >
                  <AccordionTrigger className="text-left text-lg font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <AdSlot slot="beside-faq" className="my-0 h-full" />
        </div>
      </section>

      <section className="mt-14" aria-labelledby="related">
        <h2 id="related" className="text-display-md">
          Related tools
        </h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((t) => (
            <ToolCard key={t.slug} tool={t} compact />
          ))}
        </div>
      </section>

      <ul aria-label="Tags" className="mt-10 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {tool.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </article>
  );
}
