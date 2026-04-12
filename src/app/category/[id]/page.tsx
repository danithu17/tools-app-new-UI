"use client";

import { use } from "react";
import { Suspense } from "react";
// Since we want to re-use ToolDashboard, we can just import it from page.tsx 
// (though conventionally we should extract it to components, this works in Next.js)
import { ToolDashboard, FeatureSection } from "../../page";
import { CATEGORIES, type CategoryId } from "@/lib/tools";

function CategoryInner({ id }: { id: CategoryId }) {
  const category = CATEGORIES.find((c) => c.id === id);
  
  if (!category) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center mx-auto w-full min-h-[50vh]">
        <h1 className="text-3xl font-bold mb-2">Category Not Found</h1>
        <p className="text-slate-500">The tools you are looking for do not exist.</p>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col w-full bg-white dark:bg-[#0a0a0c]">
      {/* Mini Hero for the specialized category */}
      <div className="relative overflow-hidden pt-16 pb-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-3xl rounded-2xl mb-6">
            {category.emoji}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            {category.label}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore our incredibly fast top-tier {category.label.toLowerCase()} processed completely locally on your device. Zero servers. 100% Private.
          </p>
        </div>
      </div>
      
      {/* The Tool Dashboard, locked to this category */}
      <ToolDashboard defaultCategory={id} />
    </main>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  // `use` unwraps the Promise from Next.js 15+ dynamic routes constraints
  const { id } = use(params);
  
  return (
    <Suspense fallback={<main className="flex-1 flex items-center justify-center min-h-screen text-slate-400">Loading...</main>}>
      <CategoryInner id={id as CategoryId} />
    </Suspense>
  );
}
