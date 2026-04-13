"use client";

import { useState } from "react";

export default function SvgOptimizerClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ original: number; optimized: number } | null>(null);

  const optimizeSvg = () => {
    if (!input.trim()) return;

    let optimized = input;

    // 1. Remove comments
    optimized = optimized.replace(/<!--[\s\S]*?-->/g, "");

    // 2. Remove metadata/doctype/xml declaration
    optimized = optimized.replace(/<\?xml[\s\S]*?\?>/gi, "");
    optimized = optimized.replace(/<!DOCTYPE[\s\S]*?>/gi, "");

    // 3. Remove unnecessary whitespace
    optimized = optimized.replace(/>\s+</g, "><").trim();
    
    // 4. Round coordinates (very simple regex approach)
    // This can be complex, so we'll stick to basic minification for the "bring to life" phase

    setOutput(optimized);
    setStats({
      original: input.length,
      optimized: optimized.length
    });
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reduction = stats ? Math.round((1 - stats.optimized / stats.original) * 100) : 0;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <button 
          onClick={optimizeSvg} 
          className="w-full md:w-auto px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
        >
          Optimize SVG
        </button>
        {stats && (
          <div className="flex gap-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Reduction: <span className="text-red-500">{reduction}%</span>
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Saving: <span className="text-red-500">{stats.original - stats.optimized} bytes</span>
            </div>
          </div>
        )}
        <div className="flex-1" />
        <button 
          onClick={copyToClipboard} 
          className="shrink-0 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg font-bold text-sm hover:scale-105 transition-transform"
        >
          {copied ? "✓ Copied" : "📋 Copy SVG"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Input SVG Code</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste <svg>...</svg> code here"
            className="w-full h-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-xs outline-none focus:border-red-500 resize-none transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Preview & Code</label>
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
             <div className="h-1/3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center p-4 relative">
                <div className="absolute top-2 left-2 text-[8px] font-bold text-slate-300 uppercase">Preview</div>
                {output ? (
                  <div className="max-w-full max-h-full" dangerouslySetInnerHTML={{ __html: output }} />
                ) : (
                  <span className="text-slate-300 text-xs">No output yet</span>
                )}
             </div>
             <textarea
                value={output}
                readOnly
                placeholder="Optimized SVG code will appear here..."
                className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-xs outline-none resize-none transition-all"
              />
          </div>
        </div>
      </div>
    </div>
  );
}
