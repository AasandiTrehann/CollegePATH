'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an analytics service or logger
    console.error('Unhandled Root Error boundary caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-rose-500 rounded-full scale-125" />
        <div className="glass-card rounded-2xl p-6 relative border-rose-500/20">
          <AlertCircle className="h-16 w-16 text-rose-400 mx-auto" />
        </div>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
        Something went wrong!
      </h1>

      <p className="text-base text-slate-400 max-w-md mb-8">
        An unexpected error occurred while loading this page. Please try reloading or head back to home.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/30 transition-all duration-200 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
