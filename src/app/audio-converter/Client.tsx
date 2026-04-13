"use client";

import { useState, useRef } from "react";
import { ffExtractAudio, makeBlob, triggerDownload } from "@/lib/ffmpeg-utils";

export default function AudioConverterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"mp3" | "wav" | "aac">("mp3");
  const [status, setStatus] = useState<"idle" | "loading" | "converting" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = async () => {
    if (!file) return;
    setStatus("converting");
    setProgress(0);

    try {
      const out = await ffExtractAudio(file, format, (p) => setProgress(p * 100));
      const blob = makeBlob(out, `audio/${format}`);
      triggerDownload(blob, `converted_${file.name.split('.')[0]}.${format}`);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        {!file ? (
          <div onClick={() => fileInputRef.current?.click()} className="w-full max-w-xl aspect-video rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-red-500/50 transition-all shadow-sm">
            <input type="file" accept="audio/*" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-4xl">🔄</div>
            <p className="font-bold text-slate-500">Pick audio file to convert</p>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-8">
            <div className="text-center">
              <h3 className="font-black text-slate-900 dark:text-white mb-1 truncate px-4">{file.name}</h3>
              <p className="text-xs text-slate-500 uppercase font-black">Ready for conversion</p>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-xs font-black uppercase text-slate-400">Target Format</label>
              <div className="grid grid-cols-3 gap-2">
                 {["mp3", "wav", "aac"].map((f) => (
                   <button
                     key={f}
                     onClick={() => setFormat(f as any)}
                     className={`py-3 rounded-xl font-bold text-xs transition-all ${format === f ? "bg-red-600 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
                   >
                     {f.toUpperCase()}
                   </button>
                 ))}
              </div>
            </div>

            <button
               onClick={handleConvert}
               disabled={status === "converting"}
               className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02]"
            >
               {status === "converting" ? `⚙️ ${Math.round(progress)}%` : "Convert Now"}
            </button>
            <button onClick={() => { setFile(null); setStatus("idle"); }} className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">Select different file</button>
          </div>
        )}
      </div>
    </div>
  );
}
