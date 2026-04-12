import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extract ZIP Archive",
  description: "Extract files from a ZIP archive directly in your browser without uploading anything.",
};

export default function ExtractZipPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 w-full max-w-4xl mx-auto min-h-[80vh]">
      <div className="w-full relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-[2.5rem] blur-lg opacity-25 dark:opacity-40 animate-pulse"></div>
        
        <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-8 md:p-16 rounded-[2.2rem] shadow-2xl flex flex-col items-center text-center">
          
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
            📂
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Extract ZIP Archive
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-md mx-auto">
            Select a .zip file from your computer to view and extract its contents immediately.
          </p>

          <div className="w-full max-w-2xl border-2 border-dashed border-orange-300 dark:border-orange-900/60 bg-white/40 dark:bg-slate-800/40 rounded-3xl p-12 transition-all hover:bg-white/60 dark:hover:bg-slate-800/60 hover:border-orange-400 cursor-pointer group">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-orange-500 mb-4 group-hover:-translate-y-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-200">Select a ZIP file</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">100% processed in your browser</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
