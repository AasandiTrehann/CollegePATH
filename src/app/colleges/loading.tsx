import React from 'react';
import { BookOpen, SlidersHorizontal } from 'lucide-react';

export default function CollegesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col">
      <div className="mb-10 text-left">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 sm:text-4xl">
          <BookOpen className="h-8 w-8 text-indigo-400" />
          Discover Colleges
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore and filter top universities based on your preferences and budget
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        {/* Filters Sidebar Skeleton */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 h-fit lg:col-span-1 animate-pulse space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="h-4 bg-slate-800 rounded w-1/3" />
            <div className="h-3 bg-slate-800 rounded w-1/4" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-slate-800 rounded w-1/4" />
              <div className="h-9 bg-slate-900/60 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Results Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl border border-white/5 h-[340px] animate-pulse">
                <div className="h-36 bg-slate-900/60 w-full" />
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-slate-800 rounded w-2/3" />
                  <div className="h-3 bg-slate-800 rounded w-1/3" />
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-b border-white/5 py-4">
                    <div className="h-6 bg-slate-800 rounded" />
                    <div className="h-6 bg-slate-800 rounded" />
                    <div className="h-6 bg-slate-800 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
