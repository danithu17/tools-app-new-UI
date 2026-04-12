import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder",
  description: "Quickly convert text or files to Base64 format entirely within your browser.",
};

export default function Base64ConverterPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 w-full max-w-5xl mx-auto min-h-[80vh]">
      <div className="w-full relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-[2.5rem] blur-xl opacity-20 dark:opacity-30"></div>
        
        <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-8 md:p-12 rounded-[2.2rem] shadow-2xl">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900/30 dark:to-amber-900/30 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner mb-4">
              🔤
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Base64 Encoder / Decoder</h1>
            <p className="text-slate-600 dark:text-slate-400">Instantly convert strings or files to Base64 and back.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Input</label>
                <button className="text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full">Upload File</button>
              </div>
              <textarea 
                placeholder="Type or paste text here to encode..."
                className="flex-1 min-h-[250px] p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 rounded-2xl outline-none focus:border-red-500 resize-none text-slate-800 dark:text-slate-200"
              ></textarea>
            </div>
            
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Base64 Output</label>
                <button className="text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1 rounded-full hover:bg-slate-300 transition-colors">Copy</button>
              </div>
              <textarea 
                readOnly
                placeholder="Result will appear here..."
                className="flex-1 min-h-[250px] p-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 rounded-2xl outline-none resize-none text-slate-500"
              ></textarea>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
