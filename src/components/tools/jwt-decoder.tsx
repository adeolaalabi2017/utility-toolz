"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, ShieldAlert, ShieldCheck, Clock, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiJ1c3JfMHg4OTRhZGY5MSIsIm5hbWUiOiJBbGV4IENoZW4iLCJlbWFpbCI6ImFsZXhAY29tcGFueS5jb20iLCJyb2xlIjoiZW5naW5lZXIiLCJpYXQiOjE3MzAzNzA0MDAsImV4cCI6MTgwMDAwMDAwMCwiaXNzIjoiYXV0aC51dGlsaXR5dG9vbHoiLCJhdWQiOiJhcGkudXRpbGl0eXRvb2x6In0." +
  "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function base64UrlDecode(str: string): string {
  try {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

export function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const parsed = useMemo(() => {
    const trimmed = token.trim();
    if (!trimmed) {
      return { error: "Please enter a JWT token", header: null, payload: null, signature: null };
    }
    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      return {
        error: "Invalid JWT format. A valid token consists of three parts separated by dots (header.payload.signature).",
        header: null,
        payload: null,
        signature: null,
      };
    }

    try {
      const headerStr = base64UrlDecode(parts[0]);
      const payloadStr = base64UrlDecode(parts[1]);
      if (!headerStr || !payloadStr) {
        return { error: "Failed to base64url decode token parts.", header: null, payload: null, signature: null };
      }
      const header = JSON.parse(headerStr);
      const payload = JSON.parse(payloadStr);

      return {
        error: null,
        header,
        payload,
        signature: parts[2],
        rawHeader: headerStr,
        rawPayload: payloadStr,
      };
    } catch {
      return {
        error: "Failed to parse decoded JSON from token headers or payload.",
        header: null,
        payload: null,
        signature: null,
      };
    }
  }, [token]);

  const expInfo = useMemo(() => {
    if (!parsed.payload || typeof parsed.payload.exp !== "number") return null;
    const expSec = parsed.payload.exp;
    const expDate = new Date(expSec * 1000);
    const nowSec = Math.floor(Date.now() / 1000);
    const isExpired = nowSec > expSec;
    const deltaSec = Math.abs(expSec - nowSec);
    const days = Math.floor(deltaSec / 86400);
    const hours = Math.floor((deltaSec % 86400) / 3600);
    const minutes = Math.floor((deltaSec % 3600) / 60);

    let relative = "";
    if (days > 0) relative = `${days}d ${hours}h`;
    else if (hours > 0) relative = `${hours}h ${minutes}m`;
    else relative = `${minutes}m`;

    return {
      dateStr: expDate.toUTCString(),
      localStr: expDate.toLocaleString(),
      isExpired,
      relative,
    };
  }, [parsed.payload]);

  const iatInfo = useMemo(() => {
    if (!parsed.payload || typeof parsed.payload.iat !== "number") return null;
    const iatDate = new Date(parsed.payload.iat * 1000);
    return {
      dateStr: iatDate.toUTCString(),
      localStr: iatDate.toLocaleString(),
    };
  }, [parsed.payload]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input section */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-deep-orange" />
              Encoded JSON Web Token
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setToken(SAMPLE_JWT)}
              className="h-10 text-xs sm:h-7"
            >
              Load Sample
            </Button>
          </div>
          <textarea
            aria-label="JWT token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={10}
            placeholder="Paste eyJhbGciOi... here"
            className="w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-muted-foreground">Token parts:</span>
            <span className="rounded bg-lf-coral/15 px-2 py-0.5 font-mono text-deep-coral font-semibold">
              Header
            </span>
            <span>·</span>
            <span className="rounded bg-lf-purple/15 px-2 py-0.5 font-mono text-deep-purple font-semibold">
              Payload
            </span>
            <span>·</span>
            <span className="rounded bg-lf-green/15 px-2 py-0.5 font-mono text-deep-green font-semibold">
              Signature
            </span>
          </div>

          {parsed.error && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{parsed.error}</span>
            </div>
          )}

          {expInfo && (
            <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Token Expiration Status
                </span>
                {expInfo.isExpired ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> Expired ({expInfo.relative} ago)
                  </Badge>
                ) : (
                  <Badge className="bg-lf-green/15 text-deep-green hover:bg-lf-green/15 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Valid (Expires in {expInfo.relative})
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                Expires: <strong className="text-foreground">{expInfo.localStr}</strong> (UTC: {expInfo.dateStr})
              </p>
              {iatInfo && (
                <p className="text-muted-foreground">
                  Issued: <strong className="text-foreground">{iatInfo.localStr}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Decoded inspection section */}
      <div className="space-y-4">
        {/* Header */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-deep-coral">
              Header: Algorithm & Token Type
            </span>
            {parsed.header && (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 sm:h-7 px-2 text-xs"
                onClick={() => copyText(JSON.stringify(parsed.header, null, 2), "header")}
              >
                {copiedSection === "header" ? (
                  <Check className="h-3 w-3 text-deep-green" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="ml-1">Copy</span>
              </Button>
            )}
          </div>
          <pre className="mt-3 overflow-x-auto rounded-md bg-muted/60 p-3 font-mono text-xs text-foreground">
            {parsed.header ? JSON.stringify(parsed.header, null, 2) : "—"}
          </pre>
        </div>

        {/* Payload */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lark-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-deep-purple">
              Payload: Claims & Data
            </span>
            {parsed.payload && (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 sm:h-7 px-2 text-xs"
                onClick={() => copyText(JSON.stringify(parsed.payload, null, 2), "payload")}
              >
                {copiedSection === "payload" ? (
                  <Check className="h-3 w-3 text-deep-green" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="ml-1">Copy</span>
              </Button>
            )}
          </div>
          <pre className="mt-3 overflow-x-auto rounded-md bg-muted/60 p-3 font-mono text-xs text-foreground max-h-72">
            {parsed.payload ? JSON.stringify(parsed.payload, null, 2) : "—"}
          </pre>
        </div>

        {/* Signature note */}
        <div className="rounded-xl border border-border bg-muted/50 p-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>Client-side decoder — your tokens never leave your browser.</span>
          <span className="font-mono text-[11px] text-deep-green font-semibold">100% Private</span>
        </div>
      </div>
    </div>
  );
}
