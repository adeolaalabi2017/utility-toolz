"use client";

import * as React from "react";
import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalcLayout, CopyButton, ResultHero, SelectField, Verdict } from "./ui";
import { useToolState } from "@/hooks/use-tool-state";
import { ToolShareBar } from "@/components/site/tool-share-bar";
import { cn } from "@/lib/utils";
import { MathError, evaluate, formatResult, toggleLastSign, type AngleMode } from "@/lib/math";

/* ================================================================== */
/* Shared keypad calculator (basic + scientific)                       */
/* ================================================================== */

interface Key {
  label: string;
  /** Text inserted into the expression; omitted for command keys. */
  insert?: string;
  command?: "clear" | "back" | "sign" | "equals";
  kind?: "digit" | "op" | "fn";
  aria?: string;
}

const BASIC_KEYS: Key[] = [
  { label: "AC", command: "clear", kind: "fn", aria: "Clear" },
  { label: "⌫", command: "back", kind: "fn", aria: "Delete last character" },
  { label: "%", insert: "%", kind: "op", aria: "Percent" },
  { label: "÷", insert: "÷", kind: "op", aria: "Divide" },
  { label: "7", insert: "7" },
  { label: "8", insert: "8" },
  { label: "9", insert: "9" },
  { label: "×", insert: "×", kind: "op", aria: "Multiply" },
  { label: "4", insert: "4" },
  { label: "5", insert: "5" },
  { label: "6", insert: "6" },
  { label: "−", insert: "−", kind: "op", aria: "Subtract" },
  { label: "1", insert: "1" },
  { label: "2", insert: "2" },
  { label: "3", insert: "3" },
  { label: "+", insert: "+", kind: "op", aria: "Add" },
  { label: "±", command: "sign", kind: "fn", aria: "Change sign" },
  { label: "0", insert: "0" },
  { label: ".", insert: ".", aria: "Decimal point" },
  { label: "=", command: "equals", aria: "Equals" },
];

const SCIENTIFIC_KEYS: Key[] = [
  { label: "sin", insert: "sin(", kind: "fn" },
  { label: "cos", insert: "cos(", kind: "fn" },
  { label: "tan", insert: "tan(", kind: "fn" },
  { label: "(", insert: "(", kind: "fn", aria: "Open bracket" },
  { label: ")", insert: ")", kind: "fn", aria: "Close bracket" },
  { label: "sin⁻¹", insert: "asin(", kind: "fn", aria: "Inverse sine" },
  { label: "cos⁻¹", insert: "acos(", kind: "fn", aria: "Inverse cosine" },
  { label: "tan⁻¹", insert: "atan(", kind: "fn", aria: "Inverse tangent" },
  { label: "x²", insert: "^2", kind: "fn", aria: "Square" },
  { label: "xʸ", insert: "^", kind: "fn", aria: "Power" },
  { label: "ln", insert: "ln(", kind: "fn", aria: "Natural log" },
  { label: "log", insert: "log(", kind: "fn", aria: "Log base 10" },
  { label: "√", insert: "√(", kind: "fn", aria: "Square root" },
  { label: "π", insert: "π", kind: "fn", aria: "Pi" },
  { label: "e", insert: "e", kind: "fn", aria: "Euler's number" },
  { label: "|x|", insert: "abs(", kind: "fn", aria: "Absolute value" },
  { label: "mod", insert: " mod ", kind: "fn", aria: "Modulo" },
  { label: "n!", insert: "!", kind: "fn", aria: "Factorial" },
  { label: "EXP", insert: "E", kind: "fn", aria: "Times ten to the power" },
  { label: "Ans", insert: "Ans", kind: "fn", aria: "Last answer" },
];

interface HistoryEntry {
  expr: string;
  result: string;
}

/** Keys that continue a finished result ("= then × 2") rather than replace it. */
const CONTINUES = /^[+\-−×÷*/^%!]|^ mod $/;

function Calculator({ scientific, defaultExpr }: { scientific: boolean; defaultExpr: string }) {
  const [params, setParams] = useToolState({ expr: defaultExpr, angle: "deg" });
  const { expr } = params;
  const angle = params.angle as AngleMode;
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [ans, setAns] = React.useState(0);
  const [error, setError] = React.useState("");
  // After "=", the next digit starts a new sum and the next operator continues it.
  const [fresh, setFresh] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputId = React.useId();

  let preview = "";
  try {
    preview = expr.trim() ? formatResult(evaluate(expr, { angle, ans })) : "";
  } catch {
    preview = "";
  }

  const setExpr = (next: string, caret?: number) => {
    setParams({ expr: next });
    setError("");
    setFresh(false);
    if (caret !== undefined) {
      requestAnimationFrame(() => inputRef.current?.setSelectionRange(caret, caret));
    }
  };

  const insert = (text: string) => {
    const el = inputRef.current;
    if (fresh && !CONTINUES.test(text)) {
      setExpr(text, text.length);
      return;
    }
    // Insert at the caret when the field has focus, otherwise at the end.
    const focused = el && document.activeElement === el;
    const start = focused ? (el.selectionStart ?? expr.length) : expr.length;
    const end = focused ? (el.selectionEnd ?? expr.length) : expr.length;
    setExpr(expr.slice(0, start) + text + expr.slice(end), start + text.length);
  };

  const equals = () => {
    if (!expr.trim()) return;
    try {
      const v = evaluate(expr, { angle, ans });
      const shown = formatResult(v);
      setHistory((h) => [{ expr, result: shown }, ...h].slice(0, 12));
      setAns(v);
      setParams({ expr: shown });
      setError("");
      setFresh(true);
    } catch (e) {
      setError(e instanceof MathError ? e.message : "That expression can't be worked out");
    }
  };

  const press = (k: Key) => {
    if (k.insert !== undefined) return insert(k.insert);
    switch (k.command) {
      case "clear":
        return setExpr("");
      case "back":
        return setExpr(expr.slice(0, -1));
      case "sign":
        return setExpr(toggleLastSign(expr));
      default:
        return equals();
    }
  };

  const keyButton = (k: Key) => (
    <Button
      key={k.label}
      type="button"
      variant={k.command === "equals" ? "default" : k.kind === "op" ? "secondary" : "outline"}
      aria-label={k.aria}
      // Keep focus (and the caret) in the expression field.
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => press(k)}
      className={cn(
        // The default button size shrinks to h-9 from sm up; keypad keys stay tall.
        "tnum h-12 text-lg sm:h-12",
        k.kind === "fn" && "text-base text-muted-foreground",
        scientific && k.kind === "fn" && "h-10 px-1 text-sm sm:h-10"
      )}
    >
      {k.label === "⌫" ? <Delete className="h-5 w-5" /> : k.label}
    </Button>
  );

  return (
    <CalcLayout
      actions={<ToolShareBar />}
      inputs={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={inputId} className="text-sm font-medium">
              Expression
            </Label>
            <Input
              ref={inputRef}
              id={inputId}
              value={expr}
              // The basic keypad covers every key, so phones don't need their own keyboard.
              inputMode={scientific ? "text" : "none"}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder={scientific ? "2sin(30) + √16" : "0"}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
              onChange={(e) => setExpr(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "=") {
                  e.preventDefault();
                  equals();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setExpr("");
                } else if (fresh && e.key.length === 1 && !CONTINUES.test(e.key)) {
                  e.preventDefault();
                  setExpr(e.key, 1);
                }
              }}
              className="tnum h-14 text-right font-mono text-2xl"
            />
            {error ? (
              <p id={`${inputId}-error`} role="alert" className="text-xs font-medium text-deep-coral">
                {error}
              </p>
            ) : (
              <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
                Type or tap. Enter works out the answer, Esc clears.
              </p>
            )}
          </div>

          {scientific && (
            <div className="flex items-end gap-3">
              <SelectField
                label="Angles"
                value={angle}
                onChange={(v) => setParams({ angle: v })}
                options={[
                  { value: "deg", label: "Degrees" },
                  { value: "rad", label: "Radians" },
                ]}
                className="w-40"
              />
            </div>
          )}

          {scientific && <div className="grid grid-cols-5 gap-1.5">{SCIENTIFIC_KEYS.map(keyButton)}</div>}
          <div className="grid grid-cols-4 gap-2">{BASIC_KEYS.map(keyButton)}</div>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label={fresh ? "Answer" : "Result so far"}
            value={preview || "—"}
            sub={fresh && history[0] ? `${history[0].expr} =` : expr ? undefined : "Start typing a sum"}
          />
          {preview && <CopyButton text={preview} label="Copy result" />}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">History</p>
              {history.length > 0 && (
                <Button type="button" variant="ghost" size="sm" className="h-8" onClick={() => setHistory([])}>
                  Clear
                </Button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Answers appear here after you press = or Enter. Tap one to use it again.
              </p>
            ) : (
              <ul className="divide-y divide-border/70">
                {history.map((h, i) => (
                  <li key={`${i}-${h.expr}`}>
                    <button
                      type="button"
                      onClick={() => insert(h.result)}
                      className="tnum flex w-full items-baseline justify-between gap-4 rounded-md px-1 py-2 text-left hover:bg-muted"
                      aria-label={`Use ${h.result}, from ${h.expr}`}
                    >
                      <span className="truncate text-sm text-muted-foreground">{h.expr}</span>
                      <span className="shrink-0 text-sm font-semibold">{h.result}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {scientific && (
            <Verdict tone="neutral">
              {angle === "deg" ? "Trig works in degrees: sin(30) = 0.5." : "Trig works in radians: sin(π/6) = 0.5."}{" "}
              Write 1.5E3 for 1.5 × 10³, and use Ans for the last answer.
            </Verdict>
          )}
        </div>
      }
    />
  );
}

export function BasicCalculator() {
  return <Calculator scientific={false} defaultExpr="1250 + 15%" />;
}

export function ScientificCalculator() {
  return <Calculator scientific defaultExpr="2sin(30) + √16" />;
}
