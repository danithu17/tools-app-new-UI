"use client";

import { useState } from "react";

export default function SqlFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const formatSql = (minify = false) => {
    if (!input.trim()) return;

    let formatted = input;

    if (minify) {
      formatted = input
        .replace(/\s+/g, " ")
        .replace(/\s*([,()=<>!+*-])\s*/g, "$1")
        .trim();
    } else {
      // Basic SQL Formatter logic
      const keywords = [
        "SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING", 
        "LIMIT", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "UPDATE", "SET", 
        "DELETE", "INSERT INTO", "VALUES", "CREATE TABLE", "DROP TABLE", "ALTER TABLE"
      ];

      // Reset and trim
      formatted = input.replace(/\s+/g, " ").trim();

      // Add newlines before keywords
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, "gi");
        formatted = formatted.replace(regex, `\n${kw}`);
      });

      // Simple indentation for SELECT/FROM etc logic
      formatted = formatted
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join("\n")
        .replace(/\n\s*\n/g, "\n");
    }

    setOutput(formatted);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex gap-2 w-full overflow-x-auto pb-2">
        <button 
          onClick={() => formatSql(false)} 
          className="shrink-0 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-bold text-sm hover:scale-105 transition-transform"
        >
          Format SQL
        </button>
        <button 
          onClick={() => formatSql(true)} 
          className="shrink-0 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-sm hover:scale-105 transition-transform"
        >
          Minify SQL
        </button>
        <div className="flex-1" />
        <button 
          onClick={copyToClipboard} 
          className="shrink-0 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg font-bold text-sm hover:scale-105 transition-transform"
        >
          {copied ? "✓ Copied" : "📋 Copy Output"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Input SQL</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT * FROM users WHERE active = 1 GROUP BY department"
            className="w-full h-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-sm outline-none focus:border-red-500 resize-none transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Formatted Output</label>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted SQL will appear here..."
            className="w-full h-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-sm outline-none resize-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
