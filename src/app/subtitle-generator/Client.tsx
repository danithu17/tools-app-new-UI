"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { ffExtractAudio } from "@/lib/ffmpeg-utils";

export default function SubtitleGeneratorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("Ready");
  const [format, setFormat] = useState<"SRT" | "VTT" | "TXT">("SRT");
  const [language, setLanguage] = useState<string>(""); // empty means auto-detect
  const [progress, setProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Setup Worker
    workerRef.current = new Worker(new URL("./whisper.worker.ts", import.meta.url), {
      type: "module",
    });

    workerRef.current.onmessage = (e) => {
      const { type, progress, output, chunk, error } = e.data;
      if (type === "progress") {
        if (progress.status === "progress") {
          const p = Math.round(progress.progress || 0);
          setStatus(`Downloading AI Model (${progress.file || ''})... ${p}%`);
          setProgress(p);
        } else if (progress.status === "ready") {
          setStatus("Model loaded! Transcribing...");
          setProgress(100);
        }
      } else if (type === "chunk") {
        // can show live transcription chunks here if needed
        setStatus(`Transcribing: [${chunk.timestamp[0].toFixed(1)}s] ${chunk.text}`);
      } else if (type === "done") {
        setResult(output);
        setIsProcessing(false);
        setStatus("Complete!");
      } else if (type === "error") {
        setIsProcessing(false);
        setStatus(`Error: ${error}`);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const runTranscription = async () => {
    if (!file || !workerRef.current) return;
    setIsProcessing(true);
    setStatus("Extracting audio with FFmpeg...");
    setResult(null);
    setProgress(0);
    
    try {
      // 1. Extract audio if it's a video file, or directly decode if already audio
      let wavBytes: Uint8Array;
      if (file.type.startsWith("video/")) {
        wavBytes = await ffExtractAudio(file, "wav", (p) => {
          setStatus(`Extracting Audio Track... ${Math.round(p * 100)}%`);
          setProgress(p * 100);
        });
      } else {
        wavBytes = new Uint8Array(await file.arrayBuffer());
      }
      
      // 2. Decode to 16kHz float32
      setStatus("Processing Audio Context...");
      const audioCtx = new window.AudioContext({ sampleRate: 16000 });
      const audioBuffer = await audioCtx.decodeAudioData(wavBytes.buffer.slice(0) as ArrayBuffer);
      const float32Array = audioBuffer.getChannelData(0); // mono
      
      // 3. Send to AI worker
      setStatus("Initializing AI Engine...");
      workerRef.current.postMessage({ type: "transcribe", audioData: float32Array, language: language === "sinhala" ? "sinhalese" : language });

    } catch (e: any) {
      setIsProcessing(false);
      setStatus(`Failed: ${e.message}`);
    }
  };

  const handleDownload = () => {
    if (!result || !result.chunks) return;
    let content = "";

    const formatTime = (timeInfo: number[] | null, isSrt: boolean) => {
      if (!timeInfo || timeInfo.length < 2) return "00:00:00,000";
      const seconds = timeInfo[0];
      const date = new Date(seconds * 1000);
      const hh = String(date.getUTCHours()).padStart(2, "0");
      const mm = String(date.getUTCMinutes()).padStart(2, "0");
      const ss = String(date.getUTCSeconds()).padStart(2, "0");
      const ms = String(date.getUTCMilliseconds()).padStart(3, "0");
      return isSrt ? `${hh}:${mm}:${ss},${ms}` : `${hh}:${mm}:${ss}.${ms}`;
    };

    if (format === "TXT") {
      content = result.text;
    } else if (format === "SRT") {
      content = result.chunks.map((c: any, i: number) => {
        return `${i + 1}\n${formatTime(c.timestamp, true)} --> ${formatTime([c.timestamp[1] || c.timestamp[0] + 2], true)}\n${c.text.trim()}\n`;
      }).join("\n");
    } else if (format === "VTT") {
      content = "WEBVTT\n\n" + result.chunks.map((c: any, i: number) => {
        return `${i + 1}\n${formatTime(c.timestamp, false)} --> ${formatTime([c.timestamp[1] || c.timestamp[0] + 2], false)}\n${c.text.trim()}\n`;
      }).join("\n");
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.split('.')[0]}_subtitles.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto z-10 relative">
      <div className="flex flex-col gap-6">
        <label 
          className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-red-300 dark:border-red-900/60 bg-white/40 dark:bg-slate-800/40 rounded-3xl p-10 transition-all hover:bg-white/60 dark:hover:bg-slate-800/60 hover:border-red-500 group h-full min-h-[250px]"
        >
          <input type="file" accept="video/*,audio/*" className="hidden" onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
              setResult(null); // Reset when a new file is uploaded
            }
          }} />
          
          {file ? (
            <div className="text-center">
              <span className="text-4xl">✅</span>
              <p className="mt-4 font-bold text-slate-900 dark:text-white truncate max-w-xs">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-4 mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">Upload Video or Audio</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">Your media never leaves this device.</p>
            </>
          )}
        </label>
      </div>
      
      <div className="flex flex-col gap-4 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-3 mb-2">Generation Settings</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">AI Model Setup</label>
            <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex justify-between items-center shadow-sm">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Whisper Tiny (Multilingual)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500 uppercase">Ready</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-3 font-semibold outline-none focus:border-red-500"
            >
              <option value="">Auto-Detect Language</option>
              <option value="english">English</option>
              <option value="sinhala">Sinhala</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">Export Format</label>
            <div className="flex gap-2">
              {(["SRT", "VTT", "TXT"] as const).map((ext) => (
                <button 
                  key={ext}
                  onClick={() => setFormat(ext)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  format === ext 
                    ? "bg-red-600 text-white shadow-md shadow-red-600/20 scale-105" 
                    : "bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}>
                  .{ext}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            {!result ? (
              <button 
                onClick={runTranscription}
                disabled={!file || isProcessing}
                className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-red-600/20 flex flex-col items-center justify-center gap-1"
              >
                <span>{isProcessing ? "Processing..." : "Generate Subtitles"}</span>
                {isProcessing && <span className="text-xs text-red-200 w-full truncate px-4">{status}</span>}
              </button>
            ) : (
              <button 
                onClick={handleDownload}
                className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Download .{format} File</span>
              </button>
            )}
          </div>
          
          {/* Progress bar inside the panel when running */}
          {isProcessing && progress > 0 && progress < 100 && (
             <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
               <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
