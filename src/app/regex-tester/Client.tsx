"use client";

import { useState, useMemo } from "react";

export default function RegexTesterClient() {
  const [regex, setRegex] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!regex) {
      setError(null);
      return null;
    }

    try {
      const re = new RegExp(regex, flags);
      setError(null);
      
      const matches = Array.from(testString.matchAll(re));
      return {
        matches,
        count: matches.length,
      };
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [regex, flags, testString]);

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Regular Expression</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400 font-mono">/</span>
            <input
              type="text"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              placeholder="e.g. [a-z0-9._%+-]+@[a-z0-9.-]+"
              className="w-full pl-6 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-sm outline-none focus:border-red-500 transition-all font-bold"
            />
            <span className="absolute right-4 text-slate-400 font-mono">/{flags}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Flags</label>
          <div className="flex gap-2">
            {[
              { id: "g", label: "global" },
              { id: "i", label: "insensitive" },
              { id: "m", label: "multiline" },
              { id: "s", label: "single-line" },
              { id: "u", label: "unicode" }
            ].map(flag => (
              <button
                key={flag.id}
                onClick={() => toggleFlag(flag.id)}
                title={flag.label}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  flags.includes(flag.id)
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 scale-105"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {flag.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 font-medium text-sm font-mono">
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-col gap-2 flex-1 min-h-0">
        <div className="flex items-center justify-between ml-1">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Test String</label>
          {results && (
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {results.count} matches found
            </span>
          )}
        </div>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Paste text here to test against the regex..."
          className="w-full flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-sm outline-none focus:border-red-500 resize-none transition-all scrollbar-thin"
        />
      </div>

      {results && results.count > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Match Details</label>
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-32 p-1">
            {results.matches.slice(0, 10).map((match, i) => (
              <div key={i} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono shadow-sm">
                <span className="text-slate-400 mr-2">#{i+1}</span>
                <span className="text-red-600 dark:text-red-400 font-bold">{match[0]}</span>
                <span className="text-slate-400 ml-2">[{match.index}, {match.index! + match[0].length}]</span>
              </div>
            ))}
            {results.count > 10 && (
              <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-500">
                + {results.count - 10} more matches
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
