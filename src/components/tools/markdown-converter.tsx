"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, ArrowRightLeft, FileText, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_MD = `# Launch Strategy 2026

We are releasing the **Utility Toolz** platform across **12 domains**.

## Key Objectives
- Complete client-side calculation
- Zero cookies or external trackers
- Lightning-fast interactive response

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

Check the [documentation](https://utilitytoolz.example) for more details.`;

function mdToHtml(md: string): string {
  let html = md
    // Escape raw HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Blockquotes
  html = html.replace(/^&gt; (.*$)/gim, "<blockquote>$1</blockquote>");

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

  // Lists
  html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>)/gm, "<ul>$1</ul>");

  // Paragraphs
  html = html
    .split(/\n\n+/)
    .map((block) => {
      if (
        block.startsWith("<h1>") ||
        block.startsWith("<h2>") ||
        block.startsWith("<h3>") ||
        block.startsWith("<blockquote>") ||
        block.startsWith("<ul>")
      ) {
        return block;
      }
      return `<p>${block.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n\n");

  return html;
}

function htmlToMd(html: string): string {
  let md = html;
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n\n");
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
  md = md.replace(/<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  md = md.replace(/<ul[^>]*>|<\/ul>/gi, "\n");
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
  md = md.replace(/<br\s*[\/]?>/gi, "\n");
  return md.trim();
}

export function MarkdownConverter() {
  const [direction, setDirection] = useState<"md2html" | "html2md">("md2html");
  const [input, setInput] = useState(SAMPLE_MD);
  const [copied, setCopied] = useState(false);

  const converted = useMemo(() => {
    if (!input.trim()) return "";
    return direction === "md2html" ? mdToHtml(input) : htmlToMd(input);
  }, [input, direction]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg bg-muted/60 p-0.5 text-xs font-medium">
          <button
            onClick={() => {
              setDirection("md2html");
              setInput(SAMPLE_MD);
            }}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              direction === "md2html" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground"
            }`}
          >
            Markdown → HTML
          </button>
          <button
            onClick={() => {
              setDirection("html2md");
              setInput(mdToHtml(SAMPLE_MD));
            }}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              direction === "html2md" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground"
            }`}
          >
            HTML → Markdown
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(converted);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="h-8 text-xs gap-1"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#1f5f45]" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : "Copy Output"}</span>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2">
            {direction === "md2html" ? "Input Markdown" : "Input Raw HTML"}
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            className="w-full flex-1 resize-y rounded-md border border-input bg-background p-3 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder={direction === "md2html" ? "# Heading\n\nWrite markdown here..." : "<p>Paste HTML here...</p>"}
          />
        </div>

        {/* Output */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2">
            {direction === "md2html" ? "Generated HTML" : "Generated Markdown"}
          </span>
          <textarea
            readOnly
            value={converted}
            rows={12}
            className="w-full flex-1 resize-y rounded-md border border-border bg-[#faf5ea] p-3 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
