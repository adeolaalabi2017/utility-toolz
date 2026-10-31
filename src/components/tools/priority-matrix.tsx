"use client";

import React, { useState } from "react";
import { Copy, Check, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  text: string;
  quadrant: "q1" | "q2" | "q3" | "q4";
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: "1", text: "Patch critical security advisory in production API", quadrant: "q1", completed: false },
  { id: "2", text: "Refactor core calculating engine and unit tests", quadrant: "q2", completed: false },
  { id: "3", text: "Design quarterly roadmap presentation deck", quadrant: "q2", completed: false },
  { id: "4", text: "Respond to non-urgent general vendor emails", quadrant: "q3", completed: false },
  { id: "5", text: "Browse social media industry drama", quadrant: "q4", completed: false },
];

export function PriorityMatrix() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newText, setNewText] = useState("");
  const [newQuadrant, setNewQuadrant] = useState<"q1" | "q2" | "q3" | "q4">("q1");
  const [copied, setCopied] = useState(false);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        text: newText.trim(),
        quadrant: newQuadrant,
        completed: false,
      },
    ]);
    setNewText("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveTask = (id: string, quadrant: "q1" | "q2" | "q3" | "q4") => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, quadrant } : t))
    );
  };

  const copyMarkdown = () => {
    const q1 = tasks.filter((t) => t.quadrant === "q1");
    const q2 = tasks.filter((t) => t.quadrant === "q2");
    const q3 = tasks.filter((t) => t.quadrant === "q3");
    const q4 = tasks.filter((t) => t.quadrant === "q4");

    const lines: string[] = ["# Eisenhower Priority Matrix\n"];
    lines.push("## Q1: Urgent & Important (Do First)");
    q1.forEach((t) => lines.push(`- [${t.completed ? "x" : " "}] ${t.text}`));
    lines.push("\n## Q2: Important, Not Urgent (Schedule)");
    q2.forEach((t) => lines.push(`- [${t.completed ? "x" : " "}] ${t.text}`));
    lines.push("\n## Q3: Urgent, Not Important (Delegate)");
    q3.forEach((t) => lines.push(`- [${t.completed ? "x" : " "}] ${t.text}`));
    lines.push("\n## Q4: Not Urgent & Not Important (Eliminate)");
    q4.forEach((t) => lines.push(`- [${t.completed ? "x" : " "}] ${t.text}`));

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderQuadrant = (
    qId: "q1" | "q2" | "q3" | "q4",
    title: string,
    actionDesc: string,
    badgeColor: string
  ) => {
    const list = tasks.filter((t) => t.quadrant === qId);
    return (
      <div className="rounded-xl border border-border bg-card p-4 shadow-lark-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div>
              <span className="text-xs font-bold text-foreground block">{title}</span>
              <span className={`text-[11px] font-semibold ${badgeColor}`}>{actionDesc}</span>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {list.length}
            </span>
          </div>

          <div className="mt-3 space-y-2 min-h-[100px]">
            {list.map((t) => (
              <div
                key={t.id}
                className="group flex items-start justify-between gap-2 rounded-lg border border-border/60 bg-background p-2 text-xs"
              >
                <div className="flex items-start gap-2 flex-1">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="mt-0.5 text-muted-foreground hover:text-foreground shrink-0"
                  >
                    {t.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#1f5f45]" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <span className={`leading-snug ${t.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {t.text}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <select
                    value={t.quadrant}
                    onChange={(e) => moveTask(t.id, e.target.value as any)}
                    className="text-[10px] bg-muted rounded border border-border px-1 py-0.5"
                  >
                    <option value="q1">Q1</option>
                    <option value="q2">Q2</option>
                    <option value="q3">Q3</option>
                    <option value="q4">Q4</option>
                  </select>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="text-muted-foreground hover:text-destructive p-0.5"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Add Task Bar */}
      <form onSubmit={addTask} className="rounded-xl border border-border bg-card p-4 shadow-lark-sm flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add a new task or priority..."
          className="w-full flex-1 rounded-md border border-input bg-background p-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <select
          value={newQuadrant}
          onChange={(e) => setNewQuadrant(e.target.value as any)}
          className="w-full sm:w-auto rounded-md border border-input bg-background p-2 text-xs font-semibold text-foreground"
        >
          <option value="q1">Q1: Urgent & Important</option>
          <option value="q2">Q2: Important, Not Urgent</option>
          <option value="q3">Q3: Urgent, Not Important</option>
          <option value="q4">Q4: Neither (Eliminate)</option>
        </select>

        <Button type="submit" size="sm" className="h-8 gap-1 text-xs shrink-0 w-full sm:w-auto">
          <Plus className="h-3.5 w-3.5" />
          <span>Add Task</span>
        </Button>

        <Button
          type="button"
          onClick={copyMarkdown}
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs shrink-0 w-full sm:w-auto"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#1f5f45]" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : "Export List"}</span>
        </Button>
      </form>

      {/* 2x2 Matrix Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {renderQuadrant("q1", "1. Urgent & Important", "DO FIRST — Crisis & Deadlines", "text-[#cf4f43]")}
        {renderQuadrant("q2", "2. Important & Not Urgent", "SCHEDULE — Strategic Value & Focus", "text-[#1f5f45]")}
        {renderQuadrant("q3", "3. Urgent & Not Important", "DELEGATE — Interruptions & Meetings", "text-[#a4502c]")}
        {renderQuadrant("q4", "4. Neither Urgent nor Important", "ELIMINATE — Distractions & Busywork", "text-muted-foreground")}
      </div>
    </div>
  );
}
