"use client";

import { useState, useRef } from "react";

export default function VolumeBoosterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [gain, setGain] = useState(1);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoost = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const boostedBuffer = audioCtx.createBuffer(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        const data = audioBuffer.getChannelData(i);
        const boostedData = boostedBuffer.getChannelData(i);
        for (let j = 0; j < data.length; j++) {
          boostedData[j] = data[j] * gain;
        }
      }

      downloadWav(boostedBuffer);
      setProcessing(false);
    } catch (e) {
      console.error(e);
      setProcessing(false);
    }
  };

  const downloadWav = (buffer: AudioBuffer) => {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const view = new DataView(new ArrayBuffer(length));
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + buffer.length * buffer.numberOfChannels * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
    view.setUint16(32, buffer.numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, buffer.length * buffer.numberOfChannels * 2, true);
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = buffer.getChannelData(channel)[i];
        const s = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
      }
    }
    const blob = new Blob([view], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boosted_${file?.name.split('.')[0]}.wav`;
    a.click();
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        {!file ? (
          <div onClick={() => fileInputRef.current?.click()} className="w-full max-w-xl aspect-video rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-red-500/50 transition-all shadow-sm">
            <input type="file" accept="audio/*" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-4xl">🔊</div>
            <p className="font-bold text-slate-500">Pick audio file to boost</p>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-8">
            <div className="text-center">
              <h3 className="font-black text-slate-900 dark:text-white mb-1 truncate px-4">{file.name}</h3>
              <p className="text-xs text-slate-500 uppercase font-black">Ready for boosting</p>
            </div>

            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-end">
                  <label className="text-xs font-black uppercase text-slate-400">Boost Level</label>
                  <span className="text-2xl font-black text-red-600">{Math.round(gain * 100)}%</span>
               </div>
               <input 
                 type="range" min={0.5} max={3} step={0.1} value={gain} 
                 onChange={(e) => setGain(parseFloat(e.target.value))}
                 className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
               />
               <div className="flex justify-between text-[10px] font-black text-slate-400">
                  <span>Quiet (50%)</span>
                  <span>Normal (100%)</span>
                  <span>Extra Loud (300%)</span>
               </div>
            </div>

            <button
               onClick={handleBoost}
               disabled={processing}
               className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02]"
            >
               {processing ? "🔊 Boosting..." : "Apply & Download"}
            </button>
            <button onClick={() => setFile(null)} className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">Select different file</button>
          </div>
        )}
      </div>
    </div>
  );
}
