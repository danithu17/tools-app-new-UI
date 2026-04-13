"use client";

import { useState, useMemo } from "react";

export default function DataVisualizerClient() {
  const [csv, setCsv] = useState("Month,Sales\nJan,400\nFeb,600\nMar,800\nApr,500\nMay,900\nJun,700");
  
  const data = useMemo(() => {
    try {
      const lines = csv.split("\n").filter(l => l.trim().length > 0);
      if (lines.length < 2) return null;
      
      const labels = lines.slice(1).map(l => l.split(",")[0]);
      const values = lines.slice(1).map(l => parseFloat(l.split(",")[1]) || 0);
      const max = Math.max(...values);
      
      return { labels, values, max };
    } catch (e) {
      return null;
    }
  }, [csv]);

  return (
    <div className="grid md:grid-cols-12 gap-8 h-full">
      <div className="md:col-span-4 flex flex-col gap-4">
        <label className="text-xs font-black uppercase text-slate-400 ml-1">Paste CSV Data</label>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder="Label,Value\nItem A,100\nItem B,200"
          className="flex-1 w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-sm outline-none focus:border-red-500 resize-none transition-all shadow-inner"
        />
        <p className="text-[10px] text-slate-400 px-2">First line is header, second column must be numeric.</p>
      </div>

      <div className="md:col-span-8 flex flex-col gap-4">
        <label className="text-xs font-black uppercase text-slate-400 ml-1">Chart Preview</label>
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center shadow-sm">
          {data ? (
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 flex items-end justify-around gap-4 px-4 pb-8 border-b border-slate-100 dark:border-slate-800">
                {data.values.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg font-bold">
                       {v}
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-red-600 to-rose-400 rounded-t-xl transition-all duration-700 shadow-lg shadow-red-500/10"
                      style={{ height: `${(v / data.max) * 100}%` }}
                    />
                    <div className="absolute -bottom-6 w-full text-center truncate text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                       {data.labels[i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-slate-300 font-bold">Invalid data format</div>
          )}
        </div>
      </div>
    </div>
  );
}
