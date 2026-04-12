import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screen Recorder",
  description: "Record your screen, browser window, or webcam securely without downloading extensions.",
};

export default function ScreenRecorderPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 w-full max-w-5xl mx-auto min-h-[80vh]">
      <div className="w-full relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-[2.5rem] blur-2xl opacity-20 dark:opacity-30"></div>
        
        <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-8 md:p-10 rounded-[2.2rem] shadow-2xl flex flex-col">
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                ⏺️
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Screen Recorder</h1>
                <p className="text-slate-500 dark:text-slate-400">Capture your screen directly from the browser</p>
              </div>
            </div>
            
            <button className="flex items-center gap-3 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all hover:scale-105 shadow-lg shadow-red-600/20">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
              Start Recording
            </button>
          </div>

          {/* Video Preview Glass Box */}
          <div className="w-full aspect-video bg-black/5 dark:bg-black/40 rounded-2xl border border-white/40 dark:border-slate-700/50 relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="text-center">
              <svg className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="font-medium text-slate-500 dark:text-slate-400">Preview will appear here</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {["Microphone", "System Audio", "HD Quality", "No Watermark"].map(setting => (
              <div key={setting} className="px-4 py-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/50 dark:border-slate-700/50 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{setting}</span>
                <div className="w-8 h-4 bg-red-500 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
