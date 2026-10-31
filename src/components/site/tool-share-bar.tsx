"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ToolShareBarProps {
  onReset?: () => void;
  className?: string;
  label?: string;
}

export function ToolShareBar({
  onReset,
  className,
  label = "Share Scenario",
}: ToolShareBarProps) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Scenario link copied to clipboard",
        description: "Anyone opening this link will see your exact calculations pre-filled.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL directly from your browser bar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("no-print flex items-center gap-1.5", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="h-8 gap-1.5 text-xs font-medium text-foreground hover:bg-accent"
        title="Copy shareable link with current inputs"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-600" />
        ) : (
          <Share2 className="h-3.5 w-3.5 text-primary" />
        )}
        <span>{copied ? "Link Copied" : label}</span>
      </Button>

      {onReset && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          title="Reset to default values"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      )}
    </div>
  );
}
