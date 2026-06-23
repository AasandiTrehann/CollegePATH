import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/40 py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <Logo size={28} />
          </div>

          <div className="flex items-center gap-8 text-xs font-medium text-slate-400">
            <Link href="/colleges" className="hover:text-white transition-colors">Discover</Link>
            <Link href="/compare" className="hover:text-white transition-colors">Compare</Link>
            <Link href="/predictor" className="hover:text-white transition-colors">Predictor</Link>
          </div>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Collegeपथ. Built for placement evaluation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
