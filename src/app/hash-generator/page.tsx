import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator (MD5 / SHA-256)",
  description: "Generate secure hashes for your files or text locally.",
};

export default function HashGeneratorPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 w-full max-w-4xl mx-auto min-h-[80vh]">
      <div className="w-full relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-red-600 rounded-[2.5rem] blur-xl opacity-20 dark:opacity-30"></div>
        
        <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-8 md:p-16 rounded-[2.2rem] shadow-2xl flex flex-col items-center text-center">
          
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
            🔐
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Secure Hash Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md mx-auto">
            Calculate MD5, SHA-1, SHA-256, and SHA-512 hashes. 100% Client-side.
          </p>

          <div className="w-full max-w-xl mx-auto bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/60 dark:border-slate-700/50 p-2 flex mb-8">
            <button className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl shadow-md">Text Input</button>
            <button className="flex-1 py-2 text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors">File Hash</button>
          </div>

          <textarea 
            placeholder="Type your text here to hash..."
            className="w-full min-h-[150px] max-w-2xl p-6 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 rounded-3xl outline-none focus:border-red-500 resize-none text-slate-800 dark:text-slate-200 text-lg shadow-inner mb-8"
          ></textarea>

          <div className="w-full max-w-2xl flex flex-col gap-3 text-left">
            {["MD5", "SHA-256", "SHA-512"].map(algo => (
              <div key={algo} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/80">
                <span className="font-bold text-slate-800 dark:text-slate-200 w-24 mb-2 sm:mb-0">{algo}</span>
                <code className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-mono flex-1 overflow-x-hidden text-ellipsis">d41d8cd98f00b204e9800998ecf8427e...</code>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
