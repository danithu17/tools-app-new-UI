"use client";

import { useState, useRef, useEffect } from "react";

export default function AudioTrimmerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        setEnd(audio.duration);
      };
    }
  }, [file]);

  const handleTrim = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const startOffset = start * audioBuffer.sampleRate;
      const endOffset = end * audioBuffer.sampleRate;
      const frameCount = endOffset - startOffset;

      const trimmedBuffer = audioCtx.createBuffer(
        audioBuffer.numberOfChannels,
        frameCount,
        audioBuffer.sampleRate
      );

      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        trimmedBuffer.copyToChannel(
          audioBuffer.getChannelData(i).slice(startOffset, endOffset),
          i
        );
      }

      // Normally we'd use a library to encode to MP3/WAV here.
      // For now, we'll provide a very simple WAV download approach.
      downloadWav(trimmedBuffer);
      setProcessing(false);
    } catch (e) {
      console.error(e);
      setProcessing(false);
    }
  };

  const downloadWav = (buffer: AudioBuffer) => {
    // Simple WAV encoder (PCM)
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const view = new DataView(new ArrayBuffer(length));

    // RIFF identifier
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
    a.download = `trimmed_${file?.name.split('.')[0]}.wav`;
    a.click();
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-xl aspect-video rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-red-500/50 hover:bg-red-50/50 transition-all shadow-sm"
          >
            <input type="file" accept="audio/*" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-4xl">🎵</div>
            <p className="font-bold text-slate-500">Select audio file (MP3, WAV, AAC)</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-slate-50 dark:bg-slate-950/20 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 dark:text-slate-200">{file.name}</h3>
              <button onClick={() => setFile(null)} className="text-xs font-bold text-red-500 hover:underline">Change File</button>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-black uppercase text-slate-400">
                  <span>Start: {start.toFixed(2)}s</span>
                  <span>End: {end.toFixed(2)}s</span>
                </div>
                <div className="relative h-12 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner">
                  {/* Waveform placeholder */}
                  <div className="absolute inset-0 flex items-center justify-around px-2 opacity-20">
                    {Array.from({length: 40}).map((_, i) => <div key={i} className="w-1 bg-red-500 rounded-full" style={{height: `${Math.random() * 80 + 10}%`}} />)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-slate-400">Start Time</span>
                  <input 
                    type="range" min={0} max={duration} step={0.01} 
                    value={start} onChange={(e) => setStart(Math.min(parseFloat(e.target.value), end))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-slate-400">End Time</span>
                  <input 
                    type="range" min={0} max={duration} step={0.01} 
                    value={end} onChange={(e) => setEnd(Math.max(parseFloat(e.target.value), start))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>
              </div>
            </div>

            <button
               onClick={handleTrim}
               disabled={processing}
               className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02]"
            >
               {processing ? "✂️ Trimming..." : "Cut & Download (.wav)"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
