import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create ZIP Archive",
  description: "Securely bundle multiple local files into a single ZIP archive instantly in your browser.",
};

export default function CreateZipPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 w-full max-w-4xl mx-auto min-h-[80vh]">
      <div className="w-full relative">
        {/* Glowing backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-[2.5rem] blur-lg opacity-25 dark:opacity-40 animate-pulse"></div>
        
        {/* Glass Container */}
        <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-8 md:p-16 rounded-[2.2rem] shadow-2xl flex flex-col items-center text-center">
          
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
            🤐
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Create ZIP Archive
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-md mx-auto">
            Drag and drop multiple files here to compress them into a single, secure .zip file instantly.
          </p>

          {/* Upload Area styled as Glass */}
          <div className="w-full max-w-2xl border-2 border-dashed border-red-300 dark:border-red-900/60 bg-white/40 dark:bg-slate-800/40 rounded-3xl p-12 transition-all hover:bg-white/60 dark:hover:bg-slate-800/60 hover:border-red-400 cursor-pointer group">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-red-500 mb-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-200">Click or Drag Files locally</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Maximum privacy. No uploads required.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
