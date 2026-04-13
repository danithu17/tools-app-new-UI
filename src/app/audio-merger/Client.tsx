"use client";

import { useState, useRef } from "react";

export default function AudioMergerClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffers: AudioBuffer[] = [];

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const decoded = await audioCtx.decodeAudioData(arrayBuffer);
        decodedBuffers.push(decoded);
      }

      const totalLength = decodedBuffers.reduce((acc, buf) => acc + buf.length, 0);
      const mergedBuffer = audioCtx.createBuffer(
        decodedBuffers[0].numberOfChannels,
        totalLength,
        decodedBuffers[0].sampleRate
      );

      let offset = 0;
      for (const buffer of decodedBuffers) {
        for (let i = 0; i < buffer.numberOfChannels; i++) {
          mergedBuffer.getChannelData(i).set(buffer.getChannelData(i), offset);
        }
        offset += buffer.length;
      }

      downloadWav(mergedBuffer);
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
    a.download = `merged_${Date.now()}.wav`;
    a.click();
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-col gap-4">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Playlist to Merge</label>
        <div className="grid gap-2">
           {files.map((f, i) => (
             <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl group animate-in slide-in-from-left-2 transition-all">
                <div className="flex items-center gap-4">
                   <span className="text-xs font-black text-slate-300">0{i+1}</span>
                   <span className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate max-w-md">{f.name}</span>
                </div>
                <button onClick={() => removeFile(i)} className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 rounded-lg transition-all">✕</button>
             </div>
           ))}
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="flex items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:border-red-500 hover:text-red-500 transition-all font-bold"
           >
             + Add More Tracks
           </button>
           <input type="file" multiple accept="audio/*" className="hidden" ref={fileInputRef} onChange={addFiles} />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <button
           disabled={files.length < 2 || processing}
           onClick={handleMerge}
           className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl ${
             files.length < 2 || processing
               ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale"
               : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 hover:scale-[1.02]"
           }`}
        >
           {processing ? "🔗 Merging..." : "Merge Into One Track"}
        </button>
        <p className="text-center text-[10px] uppercase font-black tracking-widest text-slate-400">
           Files are concatenated in the order they appear above.
        </p>
      </div>
    </div>
  );
}
