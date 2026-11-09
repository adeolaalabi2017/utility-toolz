"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Terminal, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_CURL = `curl -X POST https://api.utilitytoolz.example/v1/projects \\
  -H "Authorization: Bearer sec_tok_984123" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Growth Sprint", "budget": 5000, "active": true}'`;

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data: string | null;
}

function parseCurl(curlText: string): ParsedCurl {
  const clean = curlText.replace(/\\\n/g, " ").replace(/\\\r\n/g, " ").trim();
  const tokens: string[] = [];
  let current = "";
  let inQuote: "'" | '"' | null = null;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (inQuote) {
      if (char === inQuote && clean[i - 1] !== "\\") {
        inQuote = null;
      } else {
        current += char;
      }
    } else {
      if (char === "'" || char === '"') {
        inQuote = char;
      } else if (/\s/.test(char)) {
        if (current) {
          tokens.push(current);
          current = "";
        }
      } else {
        current += char;
      }
    }
  }
  if (current) tokens.push(current);

  let url = "https://api.example.com";
  let method = "GET";
  const headers: Record<string, string> = {};
  let data: string | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "-X" || t === "--request") {
      method = (tokens[++i] || "GET").toUpperCase();
    } else if (t === "-H" || t === "--header") {
      const hStr = tokens[++i] || "";
      const colonIdx = hStr.indexOf(":");
      if (colonIdx > 0) {
        const k = hStr.slice(0, colonIdx).trim();
        const v = hStr.slice(colonIdx + 1).trim();
        headers[k] = v;
      }
    } else if (t === "-d" || t === "--data" || t === "--data-raw" || t === "--data-binary") {
      data = tokens[++i] || "";
      if (method === "GET") method = "POST";
    } else if (t.startsWith("http://") || t.startsWith("https://")) {
      url = t;
    }
  }

  return { url, method, headers, data };
}

function generateFetch(p: ParsedCurl): string {
  const hasHeaders = Object.keys(p.headers).length > 0;
  const lines: string[] = [];
  lines.push(`const response = await fetch("${p.url}", {`);
  lines.push(`  method: "${p.method}",`);
  if (hasHeaders) {
    lines.push(`  headers: {`);
    for (const [k, v] of Object.entries(p.headers)) {
      lines.push(`    "${k}": "${v}",`);
    }
    lines.push(`  },`);
  }
  if (p.data) {
    try {
      const parsedJson = JSON.parse(p.data);
      lines.push(`  body: JSON.stringify(${JSON.stringify(parsedJson, null, 4).replace(/\n/g, "\n  ")}),`);
    } catch {
      lines.push(`  body: ${JSON.stringify(p.data)},`);
    }
  }
  lines.push(`});`);
  lines.push(`const data = await response.json();`);
  lines.push(`console.log(data);`);
  return lines.join("\n");
}

function generateAxios(p: ParsedCurl): string {
  const lines: string[] = [];
  lines.push(`import axios from "axios";\n`);
  lines.push(`const { data } = await axios({`);
  lines.push(`  url: "${p.url}",`);
  lines.push(`  method: "${p.method.toLowerCase()}",`);
  if (Object.keys(p.headers).length > 0) {
    lines.push(`  headers: {`);
    for (const [k, v] of Object.entries(p.headers)) {
      lines.push(`    "${k}": "${v}",`);
    }
    lines.push(`  },`);
  }
  if (p.data) {
    try {
      const parsedJson = JSON.parse(p.data);
      lines.push(`  data: ${JSON.stringify(parsedJson, null, 4).replace(/\n/g, "\n  ")},`);
    } catch {
      lines.push(`  data: ${JSON.stringify(p.data)},`);
    }
  }
  lines.push(`});`);
  lines.push(`console.log(data);`);
  return lines.join("\n");
}

function generatePython(p: ParsedCurl): string {
  const lines: string[] = [];
  lines.push(`import requests\n`);
  lines.push(`url = "${p.url}"`);
  if (Object.keys(p.headers).length > 0) {
    lines.push(`headers = {`);
    for (const [k, v] of Object.entries(p.headers)) {
      lines.push(`    "${k}": "${v}",`);
    }
    lines.push(`}`);
  }
  if (p.data) {
    try {
      const parsedJson = JSON.parse(p.data);
      lines.push(`payload = ${JSON.stringify(parsedJson, null, 4)}`);
    } catch {
      lines.push(`payload = ${JSON.stringify(p.data)}`);
    }
  }
  const args = [`url`];
  if (p.data) args.push(`json=payload`);
  if (Object.keys(p.headers).length > 0) args.push(`headers=headers`);

  lines.push(`response = requests.${p.method.toLowerCase()}(${args.join(", ")})`);
  lines.push(`print(response.json())`);
  return lines.join("\n");
}

function generateGo(p: ParsedCurl): string {
  const lines: string[] = [];
  lines.push(`package main\n`);
  lines.push(`import (\n\t"fmt"\n\t"net/http"\n\t"io"\n\t"strings"\n)\n`);
  lines.push(`func main() {`);
  if (p.data) {
    lines.push(`\tpayload := strings.NewReader(\`${p.data}\`)`);
    lines.push(`\treq, err := http.NewRequest("${p.method}", "${p.url}", payload)`);
  } else {
    lines.push(`\treq, err := http.NewRequest("${p.method}", "${p.url}", nil)`);
  }
  lines.push(`\tif err != nil {\n\t\tpanic(err)\n\t}`);
  for (const [k, v] of Object.entries(p.headers)) {
    lines.push(`\treq.Header.Add("${k}", "${v}")`);
  }
  lines.push(`\tres, err := http.DefaultClient.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer res.Body.Close()`);
  lines.push(`\tbody, _ := io.ReadAll(res.Body)\n\tfmt.Println(string(body))\n}`);
  return lines.join("\n");
}

export function CurlToCode() {
  const [curl, setCurl] = useState(SAMPLE_CURL);
  const [tab, setTab] = useState<"fetch" | "axios" | "python" | "go">("fetch");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseCurl(curl), [curl]);

  const outputCode = useMemo(() => {
    switch (tab) {
      case "fetch":
        return generateFetch(parsed);
      case "axios":
        return generateAxios(parsed);
      case "python":
        return generatePython(parsed);
      case "go":
        return generateGo(parsed);
    }
  }, [parsed, tab]);

  const copyCode = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input */}
      <div className="rounded-xl bg-card p-5 shadow-lark-sm">
        <div className="flex items-center justify-between pb-3">
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Terminal className="h-4 w-4 text-deep-orange" />
            cURL Command
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurl(SAMPLE_CURL)}
            className="h-10 text-xs sm:h-7"
          >
            Load Sample
          </Button>
        </div>
        <textarea
            aria-label="cURL command"
          value={curl}
          onChange={(e) => setCurl(e.target.value)}
          rows={12}
          className="w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Paste curl command here..."
        />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Detected Method: <strong className="font-mono text-foreground">{parsed.method}</strong></span>
          <span>Headers: <strong className="font-mono text-foreground">{Object.keys(parsed.headers).length}</strong></span>
        </div>
      </div>

      {/* Output */}
      <div className="rounded-xl bg-card p-5 shadow-lark-sm flex flex-col">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex rounded-lg bg-muted/60 p-0.5 text-xs font-medium">
            <button aria-pressed={tab === "fetch"} type="button"
              onClick={() => setTab("fetch")}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                tab === "fetch" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground"
              }`}
            >
              JS Fetch
            </button>
            <button aria-pressed={tab === "axios"} type="button"
              onClick={() => setTab("axios")}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                tab === "axios" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground"
              }`}
            >
              Node Axios
            </button>
            <button aria-pressed={tab === "python"} type="button"
              onClick={() => setTab("python")}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                tab === "python" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground"
              }`}
            >
              Python
            </button>
            <button aria-pressed={tab === "go"} type="button"
              onClick={() => setTab("go")}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                tab === "go" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground"
              }`}
            >
              Go
            </button>
          </div>

          <Button onClick={copyCode} variant="outline" size="sm" className="h-10 sm:h-7 gap-1 text-xs">
            {copied ? <Check className="h-3 w-3 text-deep-green" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy Code"}</span>
          </Button>
        </div>

        <pre className="mt-4 flex-1 overflow-x-auto rounded-md bg-muted/60 p-4 font-mono text-xs leading-relaxed text-foreground">
          <code>{outputCode}</code>
        </pre>
      </div>
    </div>
  );
}
