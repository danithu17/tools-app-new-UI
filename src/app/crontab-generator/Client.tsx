"use client";

import { useState, useMemo } from "react";

type CronState = {
  minute: string;
  hour: string;
  dom: string;
  month: string;
  dow: string;
};

export default function CrontabGeneratorClient() {
  const [state, setState] = useState<CronState>({
    minute: "*",
    hour: "*",
    dom: "*",
    month: "*",
    dow: "*",
  });

  const cronString = useMemo(() => {
    return `${state.minute} ${state.hour} ${state.dom} ${state.month} ${state.dow}`;
  }, [state]);

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateField = (field: keyof CronState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const PRESETS = [
    { name: "Every Minute", val: { minute: "*", hour: "*", dom: "*", month: "*", dow: "*" } },
    { name: "Every Hour", val: { minute: "0", hour: "*", dom: "*", month: "*", dow: "*" } },
    { name: "Every Night at 12 AM", val: { minute: "0", hour: "0", dom: "*", month: "*", dow: "*" } },
    { name: "Every Sunday", val: { minute: "0", hour: "0", dom: "*", month: "*", dow: "0" } },
    { name: "Every 1st of Month", val: { minute: "0", hour: "0", dom: "1", month: "*", dow: "*" } },
  ];

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Result Card */}
      <div className="bg-slate-900 dark:bg-white p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="flex flex-col gap-1 z-10">
          <label className="text-xs font-black uppercase tracking-widest text-white/40 dark:text-slate-400">Your Cron Expression</label>
          <div className="text-4xl md:text-5xl font-black text-white dark:text-slate-900 font-mono tracking-tighter">
            {cronString}
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="w-full md:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20 z-10"
        >
          {copied ? "✓ Copied!" : "📋 Copy Cron"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1">
        {/* Presets */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Common Presets</label>
          <div className="grid gap-2">
            {PRESETS.map(p => (
              <button
                key={p.name}
                onClick={() => setState(p.val)}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all group"
              >
                <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-red-500">{p.name}</span>
                <span className="text-xs font-mono text-slate-400">{Object.values(p.val).join(" ")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Controls */}
        <div className="flex flex-col gap-6">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Custom Settings</label>
          <div className="space-y-4">
            {[
              { id: "minute", label: "Minute", sub: "0-59" },
              { id: "hour", label: "Hour", sub: "0-23" },
              { id: "dom", label: "Day of Month", sub: "1-31" },
              { id: "month", label: "Month", sub: "1-12 or JAN-DEC" },
              { id: "dow", label: "Day of Week", sub: "0-6 or SUN-SAT" },
            ].map(f => (
              <div key={f.id} className="grid grid-cols-2 items-center gap-4">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{f.label}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-black">{f.sub}</span>
                </div>
                <input
                  type="text"
                  value={state[f.id as keyof CronState]}
                  onChange={(e) => updateField(f.id as keyof CronState, e.target.value)}
                  className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg font-mono text-center outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-bold"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
