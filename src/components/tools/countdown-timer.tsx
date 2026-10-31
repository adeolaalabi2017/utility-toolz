"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Clock, Calendar, Sparkles, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CountdownTimer() {
  const [eventName, setEventName] = useState("Product Launch 2.0");
  const [targetDateStr, setTargetDateStr] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    d.setHours(9, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = useMemo(() => {
    const target = new Date(targetDateStr).getTime();
    if (isNaN(target)) return null;

    const diffMs = target - now;
    const isPast = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const totalSeconds = Math.floor(absDiff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      isPast,
      days,
      hours,
      minutes,
      seconds,
    };
  }, [targetDateStr, now]);

  const setPreset = (daysAhead: number, title: string) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(9, 0, 0, 0);
    setTargetDateStr(d.toISOString().slice(0, 16));
    setEventName(title);
  };

  return (
    <div className="space-y-6">
      {/* Target configuration */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#a4502c]" /> Target Event & Milestone Date
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreset(1, "Tomorrow Morning")}
              className="h-7 text-xs"
            >
              Tomorrow
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreset(7, "Next Week Sprint")}
              className="h-7 text-xs"
            >
              1 Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreset(30, "Monthly Milestone")}
              className="h-7 text-xs"
            >
              30 Days
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-foreground">Event Title</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">Date & Time</label>
            <input
              type="datetime-local"
              value={targetDateStr}
              onChange={(e) => setTargetDateStr(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background p-2 font-mono text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Main Real-Time Ticker Display */}
      {time && (
        <div className="rounded-xl border border-border bg-card p-8 shadow-lark text-center space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {time.isPast ? "Time Elapsed Since" : "Time Remaining Until"}
            </span>
            <h2 className="font-display text-display-md tracking-tight text-foreground mt-1">
              {eventName || "Milestone Target"}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="rounded-xl bg-[#faf5ea] p-4 shadow-lark-sm">
              <span className="tnum font-display text-display-lg text-[#1f5f45] font-bold block">
                {time.days}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1 block">
                {time.days === 1 ? "Day" : "Days"}
              </span>
            </div>

            <div className="rounded-xl bg-[#faf5ea] p-4 shadow-lark-sm">
              <span className="tnum font-display text-display-lg text-[#1f5f45] font-bold block">
                {String(time.hours).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1 block">
                Hours
              </span>
            </div>

            <div className="rounded-xl bg-[#faf5ea] p-4 shadow-lark-sm">
              <span className="tnum font-display text-display-lg text-[#1f5f45] font-bold block">
                {String(time.minutes).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1 block">
                Minutes
              </span>
            </div>

            <div className="rounded-xl bg-[#faf5ea] p-4 shadow-lark-sm">
              <span className="tnum font-display text-display-lg text-[#a4502c] font-bold block">
                {String(time.seconds).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1 block">
                Seconds
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Target: {new Date(targetDateStr).toLocaleString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      )}
    </div>
  );
}
