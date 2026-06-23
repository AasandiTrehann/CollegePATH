import React from 'react';
import { Bookmark } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col animate-pulse">
      {/* Welcome header skeleton */}
      <div className="mb-8 space-y-3 text-left">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 sm:text-4xl">
          <Bookmark className="h-8 w-8 text-indigo-400" />
          Welcome, Student
        </h1>
        <div className="h-4 bg-slate-800 rounded w-1/2" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-white/5 h-20 bg-slate-900/60" />
        ))}
      </div>

      {/* List items skeleton */}
      <div className="space-y-4">
        <div className="h-5 bg-slate-800 rounded w-1/4 mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl border border-white/5 p-5 h-20 bg-slate-900/60" />
        ))}
      </div>
    </div>
  );
}
