"use client";

import { useState } from "react";

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const [copied, setCopied] = useState(false);

  const handleFormat = (indent: number) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };
  
  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex gap-2 w-full overflow-x-auto pb-2 md:pb-0">
        <button onClick={() => handleFormat(2)} className="shrink-0 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:scale-105 transition-transform">Format (2 Spaces)</button>
        <button onClick={() => handleFormat(4)} className="shrink-0 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-sm hover:scale-105 transition-transform">Format (4 Spaces)</button>
        <button onClick={() => handleFormat(0)} className="shrink-0 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-sm hover:scale-105 transition-transform">Minify</button>
        <div className="flex-1" />
        <button onClick={copyToClipboard} className="shrink-0 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg font-semibold text-sm hover:scale-105 transition-transform">
          {copied ? "✓ Copied" : "📋 Copy Output"}
        </button>
      </div>
      
      {error && (
        <div className="w-full p-4 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 font-medium text-sm">
          Invalid JSON: {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-4 flex-1 min-h-[400px]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON here..."
          className="w-full h-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-sm outline-none focus:border-red-500 resize-none"
        />
        <textarea
          value={output}
          readOnly
          placeholder="Formatted JSON..."
          className="w-full h-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-sm outline-none resize-none"
        />
      </div>
    </div>
  );
}
