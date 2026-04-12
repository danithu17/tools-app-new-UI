"use client";

import { useState } from "react";
import QRCode from "qrcode.react";

export default function QRCodeClient() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-6">
        <div>
          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">Content (URL or Text)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://freetools.lk"
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-red-500 min-h-[120px] resize-none"
          />
        </div>
        
        <div>
          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">QR Code Size</label>
          <input 
            type="range" min="128" max="512" step="32" value={size} 
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="text-sm text-slate-500 mt-1">{size}x{size} px</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">Foreground</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">Background</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 max-w-full overflow-hidden flex items-center justify-center border border-slate-200" style={{ minHeight: '280px' }}>
          {text ? (
            <QRCode id="qr-code-canvas" value={text} size={size} fgColor={color} bgColor={bgColor} level="H" includeMargin={true} />
          ) : (
            <div className="text-slate-300 text-center">Enter text to generate QR</div>
          )}
        </div>
        <button 
          onClick={handleDownload}
          disabled={!text}
          className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-red-600/20"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
