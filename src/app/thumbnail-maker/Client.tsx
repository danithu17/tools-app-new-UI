"use client";

import { useState, useRef, useEffect } from "react";

export default function ThumbnailMakerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("YOUR TITLE HERE");
  const [color, setColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(80);
  const [vPos, setVPos] = useState(50);
  const [hPos, setHPos] = useState(50);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }, [file]);

  const drawCanvas = () => {
    if (!preview) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = new Image();
    img.src = preview;
    
    img.onload = () => {
      if (!canvas || !ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw background
      ctx.drawImage(img, 0, 0);
      
      // Draw Text Overlay
      ctx.fillStyle = color;
      ctx.font = `black ${fontSize * (img.width / 1280)}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Shadow for readability
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      
      ctx.fillText(text, (hPos/100) * img.width, (vPos/100) * img.height);
    };
  };

  useEffect(() => {
    drawCanvas();
  }, [preview, text, color, fontSize, vPos, hPos]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `thumbnail_${file?.name || "design.png"}`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Editor Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
           <div className="flex flex-col gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-sm border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 transition-all"
              >
                {file ? "Change Background" : "Select Background Image"}
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
           </div>

           <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Heading Text</label>
                <input 
                   type="text" value={text} onChange={(e) => setText(e.target.value)}
                   className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Color</label>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-11 rounded-xl cursor-pointer" />
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Size</label>
                    <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-11 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold" />
                 </div>
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vertical Position ({vPos}%)</label>
                 <input type="range" min={0} max={100} value={vPos} onChange={(e) => setVPos(parseInt(e.target.value))} className="w-full accent-red-500" />
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Horizontal Position ({hPos}%)</label>
                 <input type="range" min={0} max={100} value={hPos} onChange={(e) => setHPos(parseInt(e.target.value))} className="w-full accent-red-500" />
              </div>
           </div>

           <button 
             disabled={!file}
             onClick={download}
             className="w-full py-5 mt-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-xl shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02]"
           >
             Download Thumbnail
           </button>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-8 flex flex-col gap-2 min-h-0">
           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Live Studio Preview</label>
           <div className="flex-1 bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden flex items-center justify-center p-4 relative group">
              <canvas ref={canvasRef} className="max-w-full max-h-full shadow-2xl rounded-lg" />
              {!file && <p className="text-slate-500 font-bold">Background required for preview</p>}
           </div>
        </div>
      </div>
    </div>
  );
}
