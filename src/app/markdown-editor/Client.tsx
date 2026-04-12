"use client";

import { useState } from "react";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true, breaks: true, linkify: true });

export default function MarkdownClient() {
  const [markup, setMarkup] = useState("# Hello Markdown\n\nStart typing to see the **preview** instantly.");
  
  const handleDownloadHTML = () => {
    const htmlBlob = new Blob([`
      <!DOCTYPE html><html><head><meta charset="utf-8">
      <style>body { font-family: -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; } pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; } blockquote { border-left: 4px solid #ccc; margin-left: 0; padding-left: 16px; color: #666; } img { max-width: 100%; }</style>
      </head><body>
      ${md.render(markup)}
      </body></html>
    `], { type: "text/html" });
    const url = URL.createObjectURL(htmlBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-slate-200">Local Markdown Editor</h3>
        <button onClick={handleDownloadHTML} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-md transition-all">Export as HTML</button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 flex-1 min-h-[500px]">
        <textarea
          value={markup}
          onChange={(e) => setMarkup(e.target.value)}
          placeholder="Type markdown here..."
          className="w-full h-full p-6 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 font-mono text-sm outline-none focus:border-red-500 resize-none shadow-inner leading-relaxed"
        />
        <div 
          className="w-full h-full p-6 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 overflow-y-auto prose prose-slate dark:prose-invert prose-red max-w-none shadow-sm"
          dangerouslySetInnerHTML={{ __html: md.render(markup) || "<span class='text-slate-400'>Preview will appear here...</span>" }}
        />
      </div>
    </div>
  );
}
