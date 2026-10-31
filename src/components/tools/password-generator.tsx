"use client";

import * as React from "react";
import { Copy, RefreshCw, ShieldCheck, KeyRound, Check } from "lucide-react";
import { CalcLayout, ResultHero, StatRow, Verdict } from "./ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "0Oo1lI";

function generateSecurePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNums: boolean,
  useSyms: boolean,
  avoidAmbiguous: boolean
): string {
  let charset = "";
  if (useUpper) charset += UPPERCASE;
  if (useLower) charset += LOWERCASE;
  if (useNums) charset += NUMBERS;
  if (useSyms) charset += SYMBOLS;

  if (avoidAmbiguous) {
    charset = charset
      .split("")
      .filter((c) => !AMBIGUOUS.includes(c))
      .join("");
  }

  if (charset.length === 0) return "";

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);

  return Array.from(array)
    .map((val) => charset[val % charset.length])
    .join("");
}

export function PasswordGenerator() {
  const { toast } = useToast();
  const [length, setLength] = React.useState(24);
  const [useUpper, setUseUpper] = React.useState(true);
  const [useLower, setUseLower] = React.useState(true);
  const [useNums, setUseNums] = React.useState(true);
  const [useSyms, setUseSyms] = React.useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [batch, setBatch] = React.useState<string[]>([]);

  const generate = React.useCallback(() => {
    const pwd = generateSecurePassword(length, useUpper, useLower, useNums, useSyms, avoidAmbiguous);
    setPassword(pwd);

    // generate 4 alternatives
    const alts = Array.from({ length: 4 }).map(() =>
      generateSecurePassword(length, useUpper, useLower, useNums, useSyms, avoidAmbiguous)
    );
    setBatch(alts);
  }, [length, useUpper, useLower, useNums, useSyms, avoidAmbiguous]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  // Pool size calculation for entropy
  const poolSize = React.useMemo(() => {
    let size = 0;
    if (useUpper) size += 26;
    if (useLower) size += 26;
    if (useNums) size += 10;
    if (useSyms) size += SYMBOLS.length;
    if (avoidAmbiguous) size = Math.max(1, size - AMBIGUOUS.length);
    return Math.max(1, size);
  }, [useUpper, useLower, useNums, useSyms, avoidAmbiguous]);

  const entropy = Math.round(length * Math.log2(poolSize));

  const strength =
    entropy < 40
      ? { label: "Weak", tone: "bad" as const, color: "bg-[#cf4f43]" }
      : entropy < 65
      ? { label: "Fair", tone: "warn" as const, color: "bg-[#e07a3c]" }
      : entropy < 90
      ? { label: "Strong", tone: "good" as const, color: "bg-[#308f68]" }
      : { label: "Cryptographic Grade", tone: "good" as const, color: "bg-[#1f5f45]" };

  const copyPwd = (str: string) => {
    navigator.clipboard.writeText(str);
    toast({ title: "Password copied to clipboard" });
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Password Length: {length} characters</Label>
              <Input
                type="number"
                min={8}
                max={64}
                value={length}
                onChange={(e) => setLength(Math.min(64, Math.max(8, Number(e.target.value) || 8)))}
                className="w-16 text-center h-8 font-mono text-sm"
              />
            </div>
            <Slider
              value={[length]}
              min={8}
              max={64}
              step={1}
              onValueChange={([val]) => setLength(val)}
              className="py-2"
            />
          </div>

          <div className="space-y-2.5 rounded-lg border border-border bg-muted/50 p-4 text-xs">
            <p className="font-semibold uppercase tracking-wider text-muted-foreground">
              Character Sets
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={(e) => setUseUpper(e.target.checked)}
                  className="rounded border-input text-primary"
                />
                Uppercase (A–Z)
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={(e) => setUseLower(e.target.checked)}
                  className="rounded border-input text-primary"
                />
                Lowercase (a–z)
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={useNums}
                  onChange={(e) => setUseNums(e.target.checked)}
                  className="rounded border-input text-primary"
                />
                Numbers (0–9)
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={useSyms}
                  onChange={(e) => setUseSyms(e.target.checked)}
                  className="rounded border-input text-primary"
                />
                Symbols (!@#$%)
              </label>
            </div>

            <div className="pt-2 border-t border-border/60">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={avoidAmbiguous}
                  onChange={(e) => setAvoidAmbiguous(e.target.checked)}
                  className="rounded border-input text-primary"
                />
                Exclude ambiguous characters (0, O, 1, l, I)
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generate} size="sm" className="gap-2 text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Re-generate
            </Button>
            <Button variant="outline" size="sm" onClick={() => copyPwd(password)} className="gap-2 text-xs">
              <Copy className="h-3.5 w-3.5" /> Copy Primary
            </Button>
          </div>

          {/* Alternatives / Batch */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Alternative Options
            </p>
            <div className="space-y-1.5 font-mono text-xs">
              {batch.map((pwd, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-1.5 hover:border-primary/50 transition-colors"
                >
                  <span className="truncate max-w-[280px] sm:max-w-md">{pwd}</span>
                  <button
                    onClick={() => copyPwd(pwd)}
                    className="p-1 hover:text-primary text-muted-foreground"
                    title="Copy this password"
                    aria-label="Copy alternative password"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-5">
          <ResultHero
            label="Generated Secret"
            value={password || "—"}
            copyText={password}
            sub={`${entropy} bits of Shannon entropy`}
          />

          <Verdict tone={strength.tone}>
            {strength.label} — {entropy} bits of entropy across {poolSize} available characters.
            {entropy >= 65
              ? " Impenetrable against offline dictionary & brute-force attacks."
              : " Recommended length is ≥ 16 characters for strong security."}
          </Verdict>

          {/* Strength bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Entropy Strength</span>
              <span>{strength.label}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300`}
                style={{ width: `${Math.min(100, (entropy / 100) * 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-border/70 p-3.5 bg-card/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cryptographic Breakdown
            </p>
            <div className="space-y-1.5 text-xs">
              <StatRow label="Length" value={`${length} chars`} />
              <StatRow label="Pool size (N)" value={`${poolSize} characters`} />
              <StatRow label="Calculated entropy" value={`${entropy} bits`} />
              <StatRow label="RNG engine" value="WebCrypto API" />
            </div>
          </div>
        </div>
      }
    />
  );
}
