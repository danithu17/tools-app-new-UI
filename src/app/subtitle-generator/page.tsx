import { Metadata } from "next";
import SubtitleGeneratorClient from "./Client";

export const metadata: Metadata = {
  title: "Subtitle Generator (AI)",
  description: "Auto-generate subtitles from any video or audio file locally.",
};

export default function SubtitleGeneratorPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 w-full max-w-5xl mx-auto min-h-[80vh]">
      <div className="w-full relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-[2.5rem] blur-xl opacity-20 dark:opacity-30"></div>
        
        <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-8 md:p-12 rounded-[2.2rem] shadow-2xl">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner mb-4 border border-red-200 dark:border-red-800/40">
              💬
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">AI Subtitle Generator</h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Generate auto-captions instantly. The AI model runs locally on your device.</p>
          </div>

          <SubtitleGeneratorClient />

        </div>
      </div>
    </div>
  );
}
