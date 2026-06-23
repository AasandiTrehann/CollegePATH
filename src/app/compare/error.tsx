'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function CompareError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Compare page error boundary caught:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl w-full px-4 py-12 flex-grow flex flex-col items-center justify-center text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-rose-500 rounded-full scale-125" />
        <div className="glass-card rounded-2xl p-6 relative border-rose-500/25 bg-slate-950/90">
          <AlertCircle className="h-12 w-12 text-rose-400 mx-auto" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Failed to Load Comparison</h2>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        We encountered a problem comparing the selected institutions. The comparison parameter may be malformed.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={() => reset()}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </button>
        <Link
          href="/colleges"
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
        >
          Explore Colleges
        </Link>
      </div>
    </div>
  );
}
