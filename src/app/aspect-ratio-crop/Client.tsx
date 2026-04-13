"use client";

import { useState, useRef } from "react";

const PRESETS = [
  { name: "Square (1:1)", w: 1, h: 1, label: "Instagram Post" },
  { name: "Portrait (4:5)", w: 4, h: 5, label: "Instagram Portrait" },
  { name: "Story (9:16)", w: 9, h: 16, label: "TikTok / IG Story" },
  { name: "Landscape (16:9)", w: 16, h: 9, label: "YouTube / X" },
  { name: "LinkedIn (1.91:1)", w: 1.91, h: 1, label: "LinkedIn Post" },
];

export default function AspectRatioCropClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [processing, setProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleCrop = async () => {
    if (!file) return;
    setProcessing(true);

    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        const targetRatio = activePreset.w / activePreset.h;
        const currentRatio = img.width / img.height;
        
        let cropW, cropH, cropX, cropY;
        
        if (currentRatio > targetRatio) {
          // Image is wider than target
          cropH = img.height;
          cropW = img.height * targetRatio;
          cropX = (img.width - cropW) / 2;
          cropY = 0;
        } else {
          // Image is taller than target
          cropW = img.width;
          cropH = img.width / targetRatio;
          cropX = 0;
          cropY = (img.height - cropH) / 2;
        }

        canvas.width = cropW;
        canvas.height = cropH;
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `cropped_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
          }
          setProcessing(false);
        }, file.type, 1.0);
      }
    };
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex flex-col items-center justify-center aspect-video rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 cursor-pointer hover:border-red-500/50 transition-all shadow-sm"
        >
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-4xl mb-4 shadow-sm">🤳</div>
          <p className="font-bold text-slate-500">Pick an image to crop</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-0">
          {/* Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Select Format</label>
              <div className="grid gap-2">
                {PRESETS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => setActivePreset(p)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      activePreset.name === p.name
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg shadow-slate-900/10 scale-[1.02]"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-red-500/50"
                    }`}
                  >
                    <div className="flex flex-col items-start">
                       <span className="font-bold text-sm">{p.name}</span>
                       <span className="text-[10px] opacity-60 font-medium">{p.label}</span>
                    </div>
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                       <div className="border-2 border-slate-400 rounded-sm" style={{ width: p.w > p.h ? '20px' : (p.w/p.h)*20 + 'px', height: p.h > p.w ? '20px' : (p.h/p.w)*20 + 'px' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
               onClick={handleCrop}
               disabled={processing}
               className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-95"
            >
               {processing ? "📐 Cropping..." : "Save Cropped Image"}
            </button>
            <button onClick={() => setFile(null)} className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">Select different image</button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Live Preview (Auto-Centered)</label>
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-8 relative">
                <div 
                   className="relative shadow-2xl transition-all duration-500 overflow-hidden" 
                   style={{ 
                     aspectRatio: `${activePreset.w} / ${activePreset.h}`,
                     maxHeight: '100%',
                     maxWidth: '100%'
                   }}
                >
                   <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                {/* Guide Lines */}
                <div className="absolute inset-0 pointer-events-none border-4 border-slate-200/10 dark:border-white/5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
