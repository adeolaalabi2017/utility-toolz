"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_TEXT = `Simple writing connects faster with your readers. When sentences are concise and direct, people understand your message immediately. Dense jargon and passive phrasing slow down comprehension. By editing ruthlessly and favoring familiar vocabulary, your documentation, landing pages, and essays become significantly more persuasive and accessible to a wider audience.`;

function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean || clean.length <= 3) return 1;
  const processed = clean.replace(/(?:[^laeiouy]|ed|es|e)$/, "").replace(/^y/, "");
  const syllables = processed.match(/[aeiouy]{1,2}/g);
  return syllables ? Math.max(1, syllables.length) : 1;
}

export function ReadabilityAnalyzer() {
  const [text, setText] = useState(SAMPLE_TEXT);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { words: 0, sentences: 0, syllables: 0, complexWords: 0, fleschEase: 0, fkGrade: 0, gunningFog: 0 };
    }

    const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
    const wordsArr = trimmed.split(/\s+/).filter(Boolean);
    const words = wordsArr.length || 1;

    let syllables = 0;
    let complexWords = 0;

    for (const w of wordsArr) {
      const syl = countSyllables(w);
      syllables += syl;
      if (syl >= 3) complexWords++;
    }

    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = syllables / words;

    // Flesch Reading Ease = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    const fleschEase = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord));

    // Flesch-Kincaid Grade Level = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
    const fkGrade = Math.max(0, 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59);

    // Gunning Fog = 0.4 * ((words / sentences) + 100 * (complexWords / words))
    const gunningFog = Math.max(0, 0.4 * (avgWordsPerSentence + 100 * (complexWords / words)));

    return {
      words,
      sentences,
      syllables,
      complexWords,
      fleschEase,
      fkGrade,
      gunningFog,
      avgWordsPerSentence,
    };
  }, [text]);

  const level = useMemo(() => {
    if (stats.fleschEase >= 70) return { title: "Easy Reading", desc: "Conversational plain English (7th-8th grade level)", color: "text-deep-green" };
    if (stats.fleschEase >= 50) return { title: "Standard Professional", desc: "High school / professional audience (10th-12th grade)", color: "text-deep-orange" };
    return { title: "Dense & Technical", desc: "College graduate level; consider shortening sentences", color: "text-deep-coral" };
  }, [stats.fleschEase]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Input (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-deep-orange" /> Content text input
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setText(SAMPLE_TEXT)}
              className="h-10 sm:h-7 text-xs"
            >
              Load Sample
            </Button>
          </div>

          <textarea
            aria-label="Text to analyse"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-md border border-input bg-background p-3 text-xs leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Paste your article or copy here..."
          />

          <div className="grid grid-cols-4 gap-2 text-center text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">
              <span className="block font-bold text-foreground">{stats.words}</span>
              <span className="text-[10px]">Words</span>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <span className="block font-bold text-foreground">{stats.sentences}</span>
              <span className="text-[10px]">Sentences</span>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <span className="block font-bold text-foreground">{stats.complexWords}</span>
              <span className="text-[10px]">Complex</span>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <span className="block font-bold text-foreground">{stats.avgWordsPerSentence ? stats.avgWordsPerSentence.toFixed(1) : 0}</span>
              <span className="text-[10px]">Words/Sent</span>
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-sm font-semibold text-muted-foreground">
            Readability index
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Flesch Reading Ease Score</span>
              <p className="tnum font-display text-display-lg text-deep-green mt-1 font-bold">
                {stats.fleschEase.toFixed(1)}
                <span className="text-xs text-muted-foreground font-normal"> / 100</span>
              </p>
              <span className={`text-xs font-semibold mt-1 block ${level.color}`}>
                {level.title}
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">{level.desc}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Grade Level</span>
                <span className="tnum font-display text-display-sm text-foreground font-bold">
                  Grade {stats.fkGrade.toFixed(1)}
                </span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-[11px] text-muted-foreground block">Gunning Fog</span>
                <span className="tnum font-display text-display-sm text-deep-purple font-bold">
                  {stats.gunningFog.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Web copywriting standard:</span>
            <strong className="text-foreground">Aim for 60.0+ Flesch score</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
