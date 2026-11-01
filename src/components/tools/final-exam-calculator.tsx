"use client";

import React, { useState, useMemo } from "react";
import { fmtPct, fmtNum } from "@/lib/format";
import { GraduationCap, Award, BookOpen, CheckCircle2 } from "lucide-react";

export function FinalExamCalculator() {
  const [currentGrade, setCurrentGrade] = useState(84);
  const [targetGrade, setTargetGrade] = useState(90);
  const [examWeight, setExamWeight] = useState(30);

  const calc = useMemo(() => {
    const w = Math.max(0.01, examWeight / 100);
    // Target = (Current * (1 - w)) + (Required * w)
    // Required = (Target - (Current * (1 - w))) / w
    const currentContribution = currentGrade * (1 - w);
    const requiredScore = (targetGrade - currentContribution) / w;

    let verdict = "Achievable";
    let color = "text-deep-green";
    if (requiredScore <= 0) {
      verdict = "Guaranteed — target already achieved without final";
      color = "text-deep-green";
    } else if (requiredScore > 100) {
      verdict = "Difficult — requires extra credit (> 100%)";
      color = "text-deep-coral";
    } else if (requiredScore > 85) {
      verdict = "Challenging — requires high test score";
      color = "text-deep-orange";
    }

    // Letter target comparisons
    const letters = [
      { grade: "A (90%)", target: 90 },
      { grade: "B (80%)", target: 80 },
      { grade: "C (70%)", target: 70 },
      { grade: "Passing (60%)", target: 60 },
    ];

    const targetsTable = letters.map((l) => {
      const score = (l.target - currentContribution) / w;
      return {
        label: l.grade,
        needed: score <= 0 ? "0%" : `${score.toFixed(1)}%`,
        status: score <= 0 ? "Locked In" : score > 100 ? "Extra Credit Required" : "Achievable",
      };
    });

    return {
      requiredScore,
      verdict,
      color,
      targetsTable,
    };
  }, [currentGrade, targetGrade, examWeight]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs (7 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-4 lg:col-span-7">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-deep-orange" /> Grade & exam weighting (%)
          </span>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-foreground">
                <label htmlFor="final-exam-calculator-1">Current Course Grade: {currentGrade}%</label>
                <span className="text-muted-foreground font-mono">Pre-final standing</span>
              </div>
              <input id="final-exam-calculator-1"
                type="range"
                min="30"
                max="100"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-foreground">
                <label htmlFor="final-exam-calculator-2">Desired Course Grade Target: {targetGrade}%</label>
                <span className="text-muted-foreground font-mono">Goal letter grade</span>
              </div>
              <input id="final-exam-calculator-2"
                type="range"
                min="50"
                max="100"
                value={targetGrade}
                onChange={(e) => setTargetGrade(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-foreground">
                <label htmlFor="final-exam-calculator-3">Final Exam Weight: {examWeight}%</label>
                <span className="text-muted-foreground font-mono">Syllabus percentage</span>
              </div>
              <input id="final-exam-calculator-3"
                type="range"
                min="5"
                max="70"
                value={examWeight}
                onChange={(e) => setExamWeight(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </div>
          </div>
        </div>

        {/* Results Banner (5 cols) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm flex flex-col justify-between lg:col-span-5">
          <span className="text-sm font-semibold text-muted-foreground">
            Target final exam score
          </span>

          <div className="my-4 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <span className="text-xs text-muted-foreground">Required Exam Score</span>
              <p className={`tnum font-display text-display-lg mt-1 font-bold ${calc.color}`}>
                {calc.requiredScore <= 0 ? "0%" : `${calc.requiredScore.toFixed(1)}%`}
              </p>
              <span className={`text-xs font-semibold mt-1 block ${calc.color}`}>
                {calc.verdict}
              </span>
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <span className="text-[11px] text-muted-foreground block">Current Course Points Secured</span>
              <span className="tnum font-display text-display-sm text-foreground font-bold">
                {(currentGrade * (1 - examWeight / 100)).toFixed(1)}% of total grade
              </span>
            </div>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground flex justify-between">
            <span>Syllabus exam weight:</span>
            <strong className="text-foreground">{examWeight}% of course grade</strong>
          </div>
        </div>
      </div>

      {/* Target Letter Grade Grid */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm space-y-3">
        <h4 className="text-sm font-semibold text-muted-foreground">
          Scores needed for alternative final grades
        </h4>
        <div className="grid gap-3 sm:grid-cols-4 text-xs text-center">
          {calc.targetsTable.map((t) => (
            <div key={t.label} className="rounded-lg bg-muted/50 p-3">
              <span className="text-muted-foreground block">{t.label}</span>
              <span className="text-base font-bold text-foreground mt-1 block">{t.needed}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
