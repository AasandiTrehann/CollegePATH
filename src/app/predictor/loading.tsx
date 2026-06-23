import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PredictorLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col items-center animate-pulse">
      {/* Page Header Skeleton */}
      <div className="mb-10 text-center max-w-xl space-y-4">
        <div className="h-6 bg-slate-800 rounded w-24 mx-auto" />
        <div className="h-8 bg-slate-800 rounded w-64 mx-auto" />
        <div className="h-4 bg-slate-800 rounded w-80 mx-auto" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Skeleton */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 lg:col-span-1 space-y-6">
          <div className="h-5 bg-slate-800 rounded w-1/3 mb-4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-slate-800 rounded w-1/4" />
              <div className="h-10 bg-slate-900/60 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Results Sidebar Skeleton */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl border border-white/5 p-12 text-center max-w-md mx-auto h-[250px] flex flex-col justify-center items-center">
            <div className="h-12 w-12 bg-slate-800 rounded-full mb-4" />
            <div className="h-4 bg-slate-800 rounded w-1/2 mb-2" />
            <div className="h-3 bg-slate-800 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
