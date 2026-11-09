"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, ArrowRightLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_PAIRS = `/about-us  /about
/pricing-plans  /pricing
/blog/2023/old-post  /blog/new-post
/contact-support  /contact`;

export function RedirectGenerator() {
  const [inputPairs, setInputPairs] = useState(SAMPLE_PAIRS);
  const [format, setFormat] = useState<"nginx" | "htaccess" | "redirects" | "nextjs">("nginx");
  const [statusCode, setStatusCode] = useState<301 | 302>(301);
  const [copied, setCopied] = useState(false);

  const outputRules = useMemo(() => {
    const lines = inputPairs.split("\n").map((l) => l.trim()).filter(Boolean);
    const rules: string[] = [];

    for (const line of lines) {
      const parts = line.split(/[\t, ]+/);
      if (parts.length >= 2) {
        const from = parts[0];
        const to = parts[1];

        if (format === "nginx") {
          const flag = statusCode === 301 ? "permanent" : "redirect";
          rules.push(`rewrite ^${from}$ ${to} ${flag};`);
        } else if (format === "htaccess") {
          rules.push(`Redirect ${statusCode} ${from} ${to}`);
        } else if (format === "redirects") {
          rules.push(`${from}  ${to}  ${statusCode}`);
        } else if (format === "nextjs") {
          rules.push(`  { source: '${from}', destination: '${to}', permanent: ${statusCode === 301} },`);
        }
      }
    }

    if (format === "nextjs") {
      return `async redirects() {\n  return [\n${rules.join("\n")}\n  ];\n}`;
    }

    return rules.join("\n");
  }, [inputPairs, format, statusCode]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
              <ArrowRightLeft className="h-4 w-4 text-deep-orange" /> URL migration pairs
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputPairs(SAMPLE_PAIRS)}
              className="h-10 sm:h-7 text-xs"
            >
              Load Sample
            </Button>
          </div>

          <textarea
            aria-label="Redirect rules, one per line"
            value={inputPairs}
            onChange={(e) => setInputPairs(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="/old-path  /new-path (one pair per line)"
          />
          <p className="text-[11px] text-muted-foreground">
            Enter one redirect pair per line separated by spaces, tabs, or commas.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <p id="redirect-type-label" className="text-xs font-medium text-foreground">Redirect Type:</p>
            <div role="group" aria-labelledby="redirect-type-label" className="flex gap-2">
              <button aria-pressed={statusCode === 301} type="button"
                onClick={() => setStatusCode(301)}
                className={`rounded px-2.5 py-1 text-xs font-medium ${statusCode === 301 ? "bg-card border border-border font-bold shadow-xs text-foreground" : "text-muted-foreground"}`}
              >
                301 (Permanent)
              </button>
              <button aria-pressed={statusCode === 302} type="button"
                onClick={() => setStatusCode(302)}
                className={`rounded px-2.5 py-1 text-xs font-medium ${statusCode === 302 ? "bg-card border border-border font-bold shadow-xs text-foreground" : "text-muted-foreground"}`}
              >
                302 (Temporary)
              </button>
            </div>
          </div>
        </div>

        {/* Formatted Output */}
        <div className="rounded-xl bg-card p-5 shadow-lark-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div className="flex rounded-md bg-muted/60 p-0.5 text-xs font-medium">
                <button aria-pressed={format === "nginx"} type="button"
                  onClick={() => setFormat("nginx")}
                  className={`rounded px-2.5 py-1 ${format === "nginx" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"}`}
                >
                  Nginx
                </button>
                <button aria-pressed={format === "htaccess"} type="button"
                  onClick={() => setFormat("htaccess")}
                  className={`rounded px-2.5 py-1 ${format === "htaccess" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"}`}
                >
                  Apache
                </button>
                <button aria-pressed={format === "redirects"} type="button"
                  onClick={() => setFormat("redirects")}
                  className={`rounded px-2.5 py-1 ${format === "redirects" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"}`}
                >
                  Cloudflare / Netlify
                </button>
                <button aria-pressed={format === "nextjs"} type="button"
                  onClick={() => setFormat("nextjs")}
                  className={`rounded px-2.5 py-1 ${format === "nextjs" ? "bg-card font-semibold shadow-xs" : "text-muted-foreground"}`}
                >
                  Next.js
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(outputRules);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="h-10 sm:h-7 text-xs gap-1"
              >
                {copied ? <Check className="h-3 w-3 text-deep-green" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy Rules"}</span>
              </Button>
            </div>

            <pre className="mt-2 min-h-[220px] overflow-x-auto rounded bg-muted/50 p-3.5 font-mono text-xs text-foreground leading-relaxed">
              {outputRules || "# No redirect pairs provided"}
            </pre>
          </div>

          <p className="text-[11px] text-muted-foreground mt-3">
            Copy into your web server config, `.htaccess`, or `_redirects` file.
          </p>
        </div>
      </div>
    </div>
  );
}
