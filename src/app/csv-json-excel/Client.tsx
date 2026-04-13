"use client";

import { useState } from "react";

export default function DataConverterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"csv2json" | "json2csv">("csv2json");
  const [copied, setCopied] = useState(false);

  const convertData = () => {
    if (!input.trim()) return;

    try {
      if (mode === "csv2json") {
        const lines = input.split("\n").filter(l => l.trim().length > 0);
        const headers = lines[0].split(",");
        const result = lines.slice(1).map(line => {
          const values = line.split(",");
          return headers.reduce((obj: any, header, i) => {
            obj[header.trim()] = values[i]?.trim();
            return obj;
          }, {});
        });
        setOutput(JSON.stringify(result, null, 2));
      } else {
        const json = JSON.parse(input);
        if (!Array.isArray(json)) throw new Error("JSON must be an array of objects");
        
        const headers = Object.keys(json[0]);
        const csv = [
          headers.join(","),
          ...json.map((row: any) => headers.map(h => row[h]).join(","))
        ].join("\n");
        setOutput(csv);
      }
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    }
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
          onClick={() => setMode("csv2json")} 
          className={`shrink-0 px-5 py-2 rounded-xl font-bold text-sm transition-all ${mode === "csv2json" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
        >
          CSV → JSON
        </button>
        <button 
          onClick={() => setMode("json2csv")} 
          className={`shrink-0 px-5 py-2 rounded-xl font-bold text-sm transition-all ${mode === "json2csv" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
        >
          JSON → CSV
        </button>
        <div className="flex-1" />
        <button 
          onClick={convertData}
          className="shrink-0 px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-red-600/20"
        >
          Convert
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Input ({mode === "csv2json" ? "CSV" : "JSON"})</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "csv2json" ? "name,age,city\nJohn,25,New York" : '[{"name":"John","age":"25"}]'}
            className="w-full h-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-xs outline-none focus:border-red-500 resize-none transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between ml-1">
             <label className="text-[10px] font-black uppercase text-slate-400">Output ({mode === "csv2json" ? "JSON" : "CSV"})</label>
             <button onClick={copyToClipboard} className="text-[10px] font-bold text-red-500 hover:underline">
               {copied ? "✓ Copied" : "Copy Output"}
             </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-xs outline-none resize-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
