import { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "SVG Optimizer - Local Dev Tools",
  description: "Clean up and minify SVG code for faster web performance. Removes comments, metadata, and unnecessary attributes locally.",
};

export default function SvgOptimizerPage() {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">SVG Optimizer</h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium tracking-tight">
          Minify and clean your SVG files without losing quality.
          <span className="block mt-1 font-bold text-red-500">Fast. Efficient. 100% Private.</span>
        </p>
      </div>

      <div className="w-full relative flex-1 flex flex-col min-h-[600px]">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-[2.5rem] blur opacity-10 dark:opacity-20 pointer-events-none" />
        <div className="relative flex-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-[#d2d2d7]/30 dark:border-slate-800/80 p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col">
          <Client />
        </div>
      </div>
    </div>
  );
}
