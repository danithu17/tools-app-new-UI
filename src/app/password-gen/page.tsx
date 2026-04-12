import { Metadata } from "next";
import PasswordClient from "./Client";

export const metadata: Metadata = {
  title: "Password Generator | FreeTools.lk",
  description: "Generate military-grade secure passwords locally on your device.",
};

export default function PasswordGeneratorPage() {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 w-full max-w-5xl mx-auto min-h-[80vh]">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Password Generator</h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Generate military-grade secure passwords instantly.</p>
      </div>

      <div className="w-full relative flex-1">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-[2.5rem] blur opacity-10 dark:opacity-20 pointer-events-none" />
        <div className="relative h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-[#d2d2d7]/30 dark:border-slate-800/80 p-6 md:p-8 rounded-[2rem] shadow-xl">
          <PasswordClient />
        </div>
      </div>
    </div>
  );
}
