"use client";

import { useState, useRef } from "react";

export default function MetadataScrubberClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrubMetadata = async () => {
    if (!file) return;
    setStatus("processing");

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Convert to blob - this naturally strips EXIF as we're creating a new image from pixel data
        canvas.toBlob((blob) => {
          if (blob) {
            const scrubbedUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = scrubbedUrl;
            a.download = `scrubbed_${file.name}`;
            a.click();
            URL.revokeObjectURL(scrubbedUrl);
            setStatus("done");
          }
        }, file.type, 1.0); // High quality
      }
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-col items-center justify-center flex-1">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 self-start ml-2">Image to scrub</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer w-full max-w-xl aspect-video rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-6 hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all shadow-sm"
        >
          <input 
            type="file" 
            accept="image/*"
            className="hidden" 
            ref={fileInputRef} 
            onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setStatus("idle");
            }}
          />
          <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-12 group-hover:bg-red-500 group-hover:text-white transition-all shadow-md">
            📸
          </div>
          <div className="text-center px-6">
            <p className="font-black text-xl text-slate-800 dark:text-slate-200">
              {file ? file.name : "Select sensitive photo"}
            </p>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              {file ? `${(file.size / 1024).toFixed(1)} KB` : "Removes GPS, Camera model, Date/Time, etc."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
        <button
          disabled={!file || status === "processing"}
          onClick={scrubMetadata}
          className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl ${
            !file || status === "processing"
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale"
              : "bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02] active:scale-95 shadow-red-600/20"
          }`}
        >
          {status === "processing" ? "🧹 Scrubbing..." : "Scrub & Download"}
        </button>

        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-center text-slate-500 font-medium leading-relaxed">
            By redrawing the image on a per-pixel basis, all non-image data (EXIF, GPS, Camera Tags) is permanently discarded. Original image data remains untouched.
          </p>
        </div>
      </div>
    </div>
  );
}
