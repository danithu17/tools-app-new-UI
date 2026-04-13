"use client";

import { useState, useMemo } from "react";

export default function JwtDecoderClient() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const decoded = useMemo(() => {
    if (!token.trim()) {
      setError(null);
      return null;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format: A JWT must have 3 parts separated by dots.");
      }

      const decodePart = (part: string) => {
        try {
          // Add padding if needed
          const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          return JSON.parse(jsonPayload);
        } catch (e) {
          throw new Error("Could not decode part: Base64 string is invalid.");
        }
      };

      setError(null);
      return {
        header: decodePart(parts[0]),
        payload: decodePart(parts[1]),
        signature: parts[2],
      };
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [token]);

  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Encoded Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT here (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
          className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-sm outline-none focus:border-red-500 resize-none transition-all"
        />
      </div>

      {error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 font-medium text-sm">
          ⚠️ {error}
        </div>
      ) : decoded ? (
        <div className="grid md:grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Header (Algorithm & Type)</label>
              <button
                onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), "header")}
                className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                {copiedSection === "header" ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 overflow-auto font-mono text-xs md:text-sm">
              <pre className="text-pink-600 dark:text-pink-400">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>
          </div>

          {/* Payload */}
          <div className="flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Payload (Data)</label>
              <button
                onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), "payload")}
                className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                {copiedSection === "payload" ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 overflow-auto font-mono text-xs md:text-sm">
              <pre className="text-indigo-600 dark:text-indigo-400">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40 grayscale">
          <div className="text-6xl mb-4">🎫</div>
          <p className="text-slate-500 font-medium">Enter a valid JWT to see the decoded content</p>
        </div>
      )}
    </div>
  );
}
