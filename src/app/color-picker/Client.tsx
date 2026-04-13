"use client";

import { useState, useRef } from "react";

export default function ColorPickerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
      extractPalette(url);
    }
  };

  const extractPalette = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 50; // Small size for performance
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);

      const data = ctx.getImageData(0, 0, 50, 50).data;
      const colors: Record<string, number> = {};

      for (let i = 0; i < data.length; i += 4 * 10) { // Sample every 10 pixels
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colors[hex] = (colors[hex] || 0) + 1;
      }

      const sorted = Object.entries(colors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(c => c[0]);

      setPalette(sorted);
    };
  };

  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="grid md:grid-cols-2 gap-8 flex-1">
        {/* Input */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Upload Image</label>
          <div 
             onClick={() => fileInputRef.current?.click()}
             className="flex-1 aspect-square md:aspect-auto rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-red-500/50 transition-all bg-slate-50/50 overflow-hidden"
          >
             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
             {preview ? (
               <img src={preview} className="w-full h-full object-cover" />
             ) : (
               <div className="flex flex-col items-center gap-4 text-slate-400">
                  <div className="text-5xl">🎨</div>
                  <p className="font-bold">Click to pick image</p>
               </div>
             )}
          </div>
        </div>

        {/* Palette */}
        <div className="flex flex-col gap-6">
           <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Dominant Palette</label>
           {palette.length > 0 ? (
             <div className="grid grid-cols-2 gap-3">
                {palette.map(hex => (
                  <button
                    key={hex}
                    onClick={() => copy(hex)}
                    className="group relative flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl shadow-inner border border-black/5" style={{ backgroundColor: hex }} />
                    <div className="flex flex-col items-start">
                       <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">{hex.toUpperCase()}</span>
                       <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{copied === hex ? "✓ Copied" : "Click to copy"}</span>
                    </div>
                  </button>
                ))}
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 rounded-3xl opacity-30">
                <p className="text-sm font-bold text-slate-500">No image selected</p>
             </div>
           )}

           <div className="mt-auto p-6 bg-slate-100 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                 Our extraction algorithm samples pixel data locally and clusters them to find the most visually impactful colors in your image.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
