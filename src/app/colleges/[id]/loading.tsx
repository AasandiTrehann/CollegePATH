import React from 'react';
import { Loader2 } from 'lucide-react';

export default function CollegeDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow animate-pulse">
      {/* Back button */}
      <div className="h-4 bg-slate-800 rounded w-24 mb-6" />

      {/* Header Profile Box Skeleton */}
      <div className="glass-card rounded-3xl border border-white/5 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full">
          <div className="rounded-2xl bg-slate-800 p-8 h-16 w-16" />
          <div className="space-y-3 flex-grow">
            <div className="h-6 bg-slate-800 rounded w-1/2" />
            <div className="h-4 bg-slate-800 rounded w-1/3" />
          </div>
        </div>
      </div>

      {/* Tab selectors Skeleton */}
      <div className="flex border-b border-white/5 mb-8 gap-4 py-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 bg-slate-800 rounded w-28" />
        ))}
      </div>

      {/* Main Details layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-6 h-[250px]">
            <div className="h-4 bg-slate-800 rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-800 rounded w-3/4" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl border border-white/5 p-6 h-[250px]">
            <div className="h-4 bg-slate-800 rounded w-1/2 mb-4" />
            <div className="space-y-4">
              <div className="h-3 bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-800 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
