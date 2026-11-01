"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, FileCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_FILENAME = "Q4 Financial Report (v2.1) — Final Draft #2 & Notes!.pdf";

function removeDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function FilenameSanitizer() {
  const [input, setInput] = useState(SAMPLE_FILENAME);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const outputs = useMemo(() => {
    let name = input.trim();
    let ext = "";

    const lastDot = name.lastIndexOf(".");
    if (lastDot > 0 && lastDot > name.length - 8) {
      ext = name.slice(lastDot).toLowerCase();
      name = name.slice(0, lastDot);
    }

    const normalized = removeDiacritics(name)
      .replace(/[^a-zA-Z0-9\s-_]/g, " ")
      .trim();

    const words = normalized.split(/[\s-_]+/).filter(Boolean);

    if (words.length === 0) {
      return { kebab: "", snake: "", camel: "", pascal: "", cleanExt: ext };
    }

    const kebab = words.map((w) => w.toLowerCase()).join("-") + ext;
    const snake = words.map((w) => w.toLowerCase()).join("_") + ext;

    const camel =
      words[0].toLowerCase() +
      words
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("") +
      ext;

    const pascal =
      words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("") + ext;

    return { kebab, snake, camel, pascal, cleanExt: ext };
  }, [input]);

  const copyVal = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedType(id);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4">
        <div className="flex items-center justify-between">
          <span id="filename-sanitizer-heading-1" className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <FileCheck className="h-4 w-4 text-deep-orange" /> Original string or filename
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput(SAMPLE_FILENAME)}
            className="h-10 sm:h-7 text-xs"
          >
            Load Sample
          </Button>
        </div>

        <input aria-labelledby="filename-sanitizer-heading-1"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter dirty filename or title..."
          className="w-full rounded-md border border-input bg-background p-2.5 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-[11px] text-muted-foreground">
          Strips emojis, accents, illegal OS characters, and normalizes spacing while preserving file extensions.
        </p>
      </div>

      {/* Output Formats */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "kebab-case (Web URLs & Assets)", val: outputs.kebab, id: "kebab" },
          { label: "snake_case (Databases & Python)", val: outputs.snake, id: "snake" },
          { label: "camelCase (JavaScript Variables)", val: outputs.camel, id: "camel" },
          { label: "PascalCase (React Components)", val: outputs.pascal, id: "pascal" },
        ].map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-lark-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyVal(item.val, item.id)}
                className="h-10 sm:h-7 text-xs gap-1"
              >
                {copiedType === item.id ? <Check className="h-3 w-3 text-deep-green" /> : <Copy className="h-3 w-3" />}
                <span>{copiedType === item.id ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <div className="rounded bg-muted/50 p-2.5 font-mono text-xs text-foreground font-medium break-all">
              {item.val || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
