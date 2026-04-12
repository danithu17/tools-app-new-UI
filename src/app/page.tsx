"use client";

import Link from "next/link";
import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CATEGORIES, TOOLS, CAT_LABEL, type CategoryId } from "@/lib/tools";

function HeroSection() {
  return (
    <div className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 dark:bg-red-500/5 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-lighten" />
        <div className="absolute top-32 -right-32 w-[500px] h-[500px] bg-sky-500/10 dark:bg-sky-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-105">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">
            Freetools.lk is completely free forever.
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-8">
          The ultimate <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">local tool kit.</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
          Compress videos, merge PDFs, handle archives, and manipulate images right from your browser. <span className="text-slate-900 dark:text-slate-200 font-bold">Zero uploads. 100% Private.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => document.getElementById("toolkit")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-600/20"
          >
            Explore Tools
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <Link
             href="/about"
             className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-lg transition-all hover:scale-105 shadow-sm hover:shadow-md"
          >
             Learn how it works
          </Link>
        </div>
        
        <p className="mt-8 text-sm md:text-base font-semibold text-slate-500 dark:text-slate-400">
          Designed & Developed by <a href="https://kdj.lk" className="text-red-500 hover:underline">KD Jayakodi</a>
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-20 pt-10 border-t border-slate-200 dark:border-slate-800/50 w-full max-w-4xl opacity-80">
          {[
            { value: "30+", label: "Local Tools" },
            { value: "100%", label: "Secure & Private" },
            { value: "0", label: "Server Uploads" },
            { value: "Free", label: "Forever" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeatureSection() {
  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why use Freetools.lk?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">Other sites upload your sensitive files to their servers. We process everything directly inside your browser using WebAssembly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Lightning Fast",
              desc: "No waiting for uploads or downloads. Processing starts instantly using your device's CPU.",
              icon: "⚡"
            },
            {
              title: "Military-Grade Privacy",
              desc: "Your files never leave your device. What happens on your machine, stays on your machine.",
              icon: "🛡️"
            },
            {
              title: "No Limitations",
              desc: "No file size limits. No daily quotas. No premium plans. Use our tools as much as you want.",
              icon: "♾️"
            }
          ].map(f => (
            <div key={f.title} className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-2xl mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ToolDashboard({ defaultCategory = "all" }: { defaultCategory?: CategoryId }) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (urlQuery !== searchQuery) setSearchQuery(urlQuery);
  }, [urlQuery]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("q", val);
    else params.delete("q");
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  const counts = useMemo(() => {
    const out: Partial<Record<CategoryId, number>> = { all: TOOLS.length };
    for (const t of TOOLS) out[t.category] = (out[t.category] ?? 0) + 1;
    return out;
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TOOLS.filter((t) => {
      if (defaultCategory !== "all" && t.category !== defaultCategory) return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [defaultCategory, searchQuery]);

  return (
    <div id="toolkit" className="pt-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6 w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">The Toolkit</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg">Search and easily access all our local tools.</p>
      </div>

      {/* Search Input box */}
      <div className={`w-full max-w-2xl mx-auto transition-all duration-300 transform mb-8 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none transition-all">
          <div className="relative flex items-center p-2">
            <span className="absolute left-6 text-xl opacity-40">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="E.g. Merge PDF, Convert Video..."
              className="w-full bg-transparent border-none outline-none pl-14 pr-4 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-lg font-medium"
            />
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 pt-2 hide-scrollbar justify-center mb-8">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.id === "all" ? "/" : `/category/${cat.id}`}
            className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
              defaultCategory === cat.id
                ? "bg-slate-900 border-slate-900 dark:bg-white dark:border-white text-white dark:text-slate-900 shadow-md scale-105"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02]"
            }`}
          >
            {cat.emoji} {cat.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
              defaultCategory === cat.id ? "bg-white/20 text-white dark:bg-black/10 dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800"
            }`}>
              {counts[cat.id]}
            </span>
          </Link>
        ))}
      </div>

      {/* Tool grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool) => (
            <article
              key={tool.id}
              className={`group relative flex flex-col gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-600 ${
                tool.soon ? "opacity-60" : ""
              }`}
            >
              {/* Header */}
              <div className="relative flex items-center justify-between gap-2 z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-2xl border border-slate-100 dark:border-slate-800 group-hover:scale-110 group-hover:block transition-transform">
                  {tool.icon}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {tool.isNew && !tool.soon && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      NEW
                    </span>
                  )}
                  {tool.popular && !tool.soon && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      POPULAR
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="relative flex-1 z-10 mt-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {tool.name}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Action button */}
              <div className="relative z-10 mt-4">
                {tool.soon ? (
                  <span className="flex items-center justify-center w-full text-xs font-semibold text-slate-500 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    Coming Soon
                  </span>
                ) : (
                  <Link
                    href={`/${tool.id}`}
                    className="flex items-center justify-between w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group-hover:bg-slate-900 group-hover:border-slate-900 dark:group-hover:bg-white dark:group-hover:border-white text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-white dark:group-hover:text-slate-900 transition-all duration-300"
                  >
                    <span>Use Tool</span>
                    <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl mx-auto max-w-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center mb-6 shadow-sm">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No tools match your search</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the filter.
          </p>
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<main className="flex-1 flex items-center justify-center min-h-screen text-slate-400">Loading...</main>}>
      <main className="flex-1 flex flex-col w-full bg-white dark:bg-[#0a0a0c]">
        <HeroSection />
        <FeatureSection />
        <ToolDashboard />
      </main>
    </Suspense>
  );
}
