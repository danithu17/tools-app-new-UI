"use client";

import { useState, useRef, useEffect } from "react";

type BlurBox = { x: number; y: number; w: number; h: number };

export default function PrivacyBlurClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [blurs, setBlurs] = useState<BlurBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<BlurBox | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
      setBlurs([]);
    }
  }, [file]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!file) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentBox({
      x: Math.min(x, startPos.x),
      y: Math.min(y, startPos.y),
      w: Math.abs(x - startPos.x),
      h: Math.abs(y - startPos.y),
    });
  };

  const handleMouseUp = () => {
    if (currentBox && currentBox.w > 5 && currentBox.h > 5) {
      setBlurs([...blurs, currentBox]);
    }
    setIsDrawing(false);
    setCurrentBox(null);
  };

  const clearBlurs = () => setBlurs([]);

  const downloadImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = preview;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      
      const scaleX = img.width / canvasRef.current!.clientWidth;
      const scaleY = img.height / canvasRef.current!.clientHeight;
      
      ctx.filter = "blur(20px)";
      blurs.forEach(box => {
        ctx.drawImage(
          img, 
          box.x * scaleX, box.y * scaleY, box.w * scaleX, box.h * scaleY,
          box.x * scaleX, box.y * scaleY, box.w * scaleX, box.h * scaleY
        );
      });
      
      const link = document.createElement("a");
      link.download = `privacy_${file?.name}`;
      link.href = canvas.toDataURL(file?.type || "image/jpeg");
      link.click();
    };
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex flex-col items-center justify-center aspect-video rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 cursor-pointer hover:border-red-500/50 transition-all shadow-sm"
        >
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-4xl mb-4 shadow-sm">🌫️</div>
          <p className="font-bold text-slate-500">Select image to censor</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-0">
          {/* Controls */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black uppercase text-slate-400 mb-4 tracking-widest">How to use</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                   Click and drag on the image to select areas you want to blur. You can add as many as you need.
                </p>
            </div>

            <div className="flex flex-col gap-4">
               <button onClick={clearBlurs} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-200 transition-all">Clear All Blurs</button>
               <button 
                  onClick={downloadImage} 
                  className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xl shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02]"
               >
                  Download
               </button>
               <button onClick={() => setFile(null)} className="text-xs font-bold text-center text-slate-400 hover:text-red-500">Pick different file</button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="lg:col-span-9 flex flex-col gap-2 min-h-0">
            <div 
              className="relative flex-1 bg-black rounded-[2.5rem] overflow-hidden cursor-crosshair select-none flex items-center justify-center"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                 src={preview} 
                 className="max-w-full max-h-full pointer-events-none" 
                 ref={(el) => { if(el && canvasRef.current) { canvasRef.current.style.width = el.clientWidth + 'px'; canvasRef.current.style.height = el.clientHeight + 'px'; } }}
              />
              {/* Overlay Canvas for current boxes */}
              <div ref={canvasRef as any} className="absolute inset-x-0 inset-y-0 mx-auto pointer-events-none">
                 {blurs.map((box, i) => (
                   <div key={i} className="absolute border-2 border-red-500 bg-red-500/20 backdrop-blur-2xl rounded-sm" style={{ left: box.x, top: box.y, width: box.w, height: box.h }} />
                 ))}
                 {currentBox && (
                   <div className="absolute border-2 border-white bg-white/20 rounded-sm" style={{ left: currentBox.x, top: currentBox.y, width: currentBox.w, height: currentBox.h }} />
                 )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
