import { Metadata } from "next";

import Base64Client from "./Client";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder | FreeTools.lk",
  description: "Quickly convert text or files to Base64 format entirely within your browser.",
};

export default function Base64ConverterPage() {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-12 w-full max-w-5xl mx-auto min-h-[80vh]">
      <div className="w-full relative flex-1 flex flex-col justify-center">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-[2.5rem] blur opacity-10 dark:opacity-20 pointer-events-none"></div>
        
        <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-6 md:p-12 rounded-[2.2rem] shadow-2xl">
          
          <div className="text-center mb-10 mt-4 md:mt-0">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900/30 dark:to-amber-900/30 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner mb-4">
              🔤
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Base64 Encoder / Decoder</h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Instantly convert strings or files to Base64 and back locally.</p>
          </div>

          <Base64Client />

        </div>
      </div>
    </div>
  );
}
