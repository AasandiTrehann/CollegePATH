import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, ShieldQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-indigo-500 rounded-full scale-125" />
        <div className="glass-card rounded-2xl p-6 relative">
          <ShieldQuestion className="h-16 w-16 text-indigo-400 mx-auto" />
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
        404 - Page Not Found
      </h1>
      
      <p className="text-base text-slate-400 max-w-md mb-8">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/30 transition-all duration-200"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/colleges"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Explore Colleges
        </Link>
      </div>
    </div>
  );
}
