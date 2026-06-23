import React from 'react';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function CollegeNotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-indigo-500 rounded-full scale-125" />
        <div className="glass-card rounded-2xl p-6 relative">
          <Search className="h-12 w-12 text-indigo-400 mx-auto" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">College Record Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
        The college ID you entered does not match any institution in our database. It may have been removed or not seeded yet.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link
          href="/colleges"
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700"
        >
          <Search className="h-4 w-4" />
          Search Directory
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
