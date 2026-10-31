"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Clock, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TimestampConverter() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [epochInput, setEpochInput] = useState<string>(() => String(Math.floor(Date.now() / 1000)));
  const [dateInput, setDateInput] = useState<string>(() => new Date().toISOString().slice(0, 16));
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyVal = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Convert epoch input to dates
  const parsedFromEpoch = React.useMemo(() => {
    const n = Number(epochInput.trim());
    if (isNaN(n) || n <= 0) return null;
    // Check if seconds or milliseconds
    const ms = epochInput.trim().length <= 10 ? n * 1000 : n;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;

    const now = Date.now();
    const diffSec = Math.floor((ms - now) / 1000);
    const absDiff = Math.abs(diffSec);
    const days = Math.floor(absDiff / 86400);
    const hours = Math.floor((absDiff % 86400) / 3600);
    const minutes = Math.floor((absDiff % 3600) / 60);

    let relative = "";
    if (days > 0) relative = `${days} days ${hours} hours`;
    else if (hours > 0) relative = `${hours} hours ${minutes} mins`;
    else relative = `${minutes} mins`;

    relative = diffSec < 0 ? `${relative} ago` : `in ${relative}`;

    return {
      iso: d.toISOString(),
      utc: d.toUTCString(),
      local: d.toLocaleString(),
      relative,
      seconds: Math.floor(ms / 1000),
      millis: ms,
    };
  }, [epochInput]);

  // Convert human date input to epoch
  const parsedFromDate = React.useMemo(() => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    const ms = d.getTime();
    return {
      sec: Math.floor(ms / 1000),
      ms: ms,
      utc: d.toUTCString(),
    };
  }, [dateInput]);

  return (
    <div className="space-y-6">
      {/* Current Live Epoch Banner */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#308f68]/15 text-[#1f5f45]">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Unix Timestamp
              </span>
              <div className="flex items-baseline gap-2">
                <span className="tnum font-display text-display-md text-foreground">
                  {currentEpoch}
                </span>
                <span className="text-xs text-muted-foreground">seconds</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyVal(String(currentEpoch), "live")}
              className="h-8 gap-1 text-xs"
            >
              {copiedField === "live" ? <Check className="h-3.5 w-3.5 text-[#1f5f45]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedField === "live" ? "Copied" : "Copy Epoch"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEpochInput(String(currentEpoch))}
              className="h-8 gap-1 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Use as Input</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Two-Column Converters */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Epoch -> Human Date */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Convert Epoch to Human Date
          </span>
          <div>
            <label className="text-xs font-medium text-foreground">Unix Timestamp (seconds or ms)</label>
            <input
              type="text"
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              placeholder="e.g. 1730380000"
              className="mt-1 w-full rounded-md border border-input bg-background p-2.5 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {parsedFromEpoch ? (
            <div className="space-y-3 rounded-lg bg-muted/50 p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Local Time:</span>
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <span>{parsedFromEpoch.local}</span>
                  <button onClick={() => copyVal(parsedFromEpoch.local, "local")} className="text-muted-foreground hover:text-foreground">
                    {copiedField === "local" ? <Check className="h-3 w-3 text-[#1f5f45]" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">UTC Time:</span>
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <span>{parsedFromEpoch.utc}</span>
                  <button onClick={() => copyVal(parsedFromEpoch.utc, "utc")} className="text-muted-foreground hover:text-foreground">
                    {copiedField === "utc" ? <Check className="h-3 w-3 text-[#1f5f45]" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ISO 8601:</span>
                <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground">
                  <span>{parsedFromEpoch.iso}</span>
                  <button onClick={() => copyVal(parsedFromEpoch.iso, "iso")} className="text-muted-foreground hover:text-foreground">
                    {copiedField === "iso" ? <Check className="h-3 w-3 text-[#1f5f45]" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2 text-muted-foreground">
                <span>Relative:</span>
                <span className="font-medium text-[#1f5f45]">{parsedFromEpoch.relative}</span>
              </div>
            </div>
          ) : (
            <p className="rounded-lg bg-muted/40 p-4 text-xs text-muted-foreground">Enter a valid integer timestamp to see formatted date.</p>
          )}
        </div>

        {/* Human Date -> Epoch */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Convert Date & Time to Epoch
          </span>
          <div>
            <label className="text-xs font-medium text-foreground">Select Date and Time</label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background p-2.5 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {parsedFromDate ? (
            <div className="space-y-3 rounded-lg bg-muted/50 p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Epoch (Seconds):</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-base text-[#1f5f45]">
                  <span>{parsedFromDate.sec}</span>
                  <button onClick={() => copyVal(String(parsedFromDate.sec), "sec")} className="text-muted-foreground hover:text-foreground">
                    {copiedField === "sec" ? <Check className="h-3 w-3 text-[#1f5f45]" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Epoch (Milliseconds):</span>
                <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground">
                  <span>{parsedFromDate.ms}</span>
                  <button onClick={() => copyVal(String(parsedFromDate.ms), "ms")} className="text-muted-foreground hover:text-foreground">
                    {copiedField === "ms" ? <Check className="h-3 w-3 text-[#1f5f45]" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2 text-muted-foreground">
                <span>Interpreted UTC:</span>
                <span className="font-medium text-foreground">{parsedFromDate.utc}</span>
              </div>
            </div>
          ) : (
            <p className="rounded-lg bg-muted/40 p-4 text-xs text-muted-foreground">Select a valid date above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
