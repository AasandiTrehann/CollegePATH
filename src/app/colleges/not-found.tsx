import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function CollegesNotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <ShieldAlert className="h-16 w-16 text-indigo-400 mb-4 animate-pulse" />
      <h2 className="text-2xl font-bold text-white mb-2">College Directory Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        The college directory resource you are trying to access does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-white/10 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}
