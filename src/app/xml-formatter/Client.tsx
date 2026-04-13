"use client";

import { useState } from "react";

export default function XmlFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const formatXml = (minify = false) => {
    if (!input.trim()) return;

    try {
      let formatted = "";
      let indent = "";
      const tab = "  ";

      // Basic XML parsing/formatting
      const xml = input.replace(/>\s+</g, "><").trim();
      
      if (minify) {
        formatted = xml;
      } else {
        xml.split(/>\s*</).forEach(node => {
          if (node.match(/^\/\w/)) indent = indent.substring(tab.length); // decrease indent
          formatted += indent + "<" + node + ">\r\n";
          if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("?")) indent += tab; // increase indent
        });
        formatted = formatted.substring(1, formatted.length - 3); // cleanup
      }

      setOutput(formatted);
    } catch (e) {
      setOutput("Error: Invalid XML format");
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
          onClick={() => formatXml(false)} 
          className="shrink-0 px-5 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
        >
          Format XML
        </button>
        <button 
          onClick={() => formatXml(true)} 
          className="shrink-0 px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
        >
          Minify
        </button>
        <div className="flex-1" />
        <button 
          onClick={copyToClipboard} 
          className="shrink-0 px-4 py-2 text-red-600 font-bold text-sm hover:underline"
        >
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste XML here..."
          className="w-full h-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-xs outline-none focus:border-red-500 resize-none"
        />
        <textarea
          value={output}
          readOnly
          placeholder="Formatted XML will appear here..."
          className="w-full h-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-mono text-xs outline-none resize-none"
        />
      </div>
    </div>
  );
}
