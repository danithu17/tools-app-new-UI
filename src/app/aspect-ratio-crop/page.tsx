import { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Social Crop - Local Social Tools",
  description: "One-tap crop your images for Instagram Stories, TikTok, YouTube Shorts, and LinkedIn. 100% private and runs in your browser.",
};

export default function AspectRatioCropPage() {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 w-full max-w-6xl mx-auto min-h-[80vh]">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Social Crop</h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium tracking-tight">
          Perfect aspect ratios for every platform.
          <span className="block mt-1 font-bold text-red-500">Fast. High Quality. 100% Secure.</span>
        </p>
      </div>

      <div className="w-full relative flex-1 flex flex-col min-h-[500px]">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-[2.5rem] blur opacity-10 dark:opacity-20 pointer-events-none" />
        <div className="relative flex-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-[#d2d2d7]/30 dark:border-slate-800/80 p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col">
          <Client />
        </div>
      </div>
    </div>
  );
}
