"use client";

import { useState, useRef } from "react";

export default function Base64Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (text: string) => {
    setInput(text);
    if (!text) {
      setOutput("");
      return;
    }
    
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch (e) {
      setOutput("Error: Invalid input for chosen operation.");
    }
  };

  const handleModeToggle = (newMode: "encode" | "decode") => {
    setMode(newMode);
    // Re-run the logic with current input
    if (!input) {
      setOutput("");
      return;
    }
    try {
      if (newMode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (e) {
      setOutput("Error: Invalid input for chosen operation.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mode === "encode") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        // The result is something like data:image/png;base64,....
        // We can either output the full Data URL or just the base64 part. 
        // Just the base64 part is standard:
        const base64Data = result.split(',')[1] || result;
        setInput(`[File: ${file.name}]`);
        setOutput(base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      // Decode file is trickier, usually you'd reconstruct a file
      alert("File decoding not fully supported yet in simple mode.");
    }
  };

  const copyToClipboard = () => {
    if (output && !output.startsWith("Error:")) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center mb-2">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl inline-flex w-full md:w-auto">
          <button 
            onClick={() => handleModeToggle("encode")}
            className={`flex-1 md:w-32 py-2 text-sm font-semibold rounded-lg transition-colors ${mode === "encode" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Encode
          </button>
          <button 
            onClick={() => handleModeToggle("decode")}
            className={`flex-1 md:w-32 py-2 text-sm font-semibold rounded-lg transition-colors ${mode === "decode" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2 px-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Input Text</label>
            {mode === "encode" && (
              <>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full hover:scale-105 active:scale-95 transition-transform"
                >
                  Upload File
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              </>
            )}
          </div>
          <textarea 
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === "encode" ? "Type or paste text here to encode..." : "Paste Base64 here to decode..."}
            className="flex-1 min-h-[250px] p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-[#d2d2d7] dark:border-slate-700/50 rounded-2xl outline-none focus:border-red-500 resize-none text-slate-800 dark:text-slate-200"
          ></textarea>
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2 px-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Output Result</label>
            <button 
              onClick={copyToClipboard}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-transform hover:scale-105 active:scale-95 ${copied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}
            >
              {copied ? "✓ Copied" : "📋 Copy"}
            </button>
          </div>
          <textarea 
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className={`flex-1 min-h-[250px] p-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl border dark:border-slate-700/50 rounded-2xl outline-none resize-none ${output.startsWith("Error:") ? 'text-red-500 border-red-200 dark:border-red-900/50' : 'text-slate-600 dark:text-slate-400 border-white/60'}`}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
