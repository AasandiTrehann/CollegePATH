'use client';

import React, { useState } from 'react';
import PredictorResultCard from '@/components/PredictorResultCard';
import { Sparkles, Loader2, ArrowRight, BookOpen, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PredictorPage() {
  // Form input States
  const [exam, setExam] = useState('JEE Main');
  const [category, setCategory] = useState('General');
  const [rankInput, setRankInput] = useState('');
  
  // Query status States
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    
    const rank = parseInt(rankInput, 10);
    if (isNaN(rank) || rank <= 0) {
      setError('Please enter a valid positive rank number.');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam, rank, category }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate recommendations.');
      }

      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col items-center">
      {/* Page Header */}
      <div className="mb-10 text-center max-w-xl">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Predict Eligibility
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Admission Predictor
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Enter your rank, exam type, and category to discover courses where you have high historical chances of securing a seat.
        </p>
      </div>

      {/* Main Column Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* INPUT FORM PANEL (1 Column) */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 lg:col-span-1">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
            Rank Details
          </h3>

          <form onSubmit={handlePredict} className="space-y-5">
            {/* Exam selection */}
            <div>
              <label htmlFor="exam-select" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Exam Type
              </label>
              <select
                id="exam-select"
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="glass-input block w-full px-4 py-3 rounded-xl text-xs appearance-none cursor-pointer"
              >
                <option value="JEE Main">JEE Main (NITs, State & Private Colleges)</option>
                <option value="JEE Advanced">JEE Advanced (IITs)</option>
              </select>
            </div>

            {/* Category selection */}
            <div>
              <label htmlFor="category-select" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Admission Category
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input block w-full px-4 py-3 rounded-xl text-xs appearance-none cursor-pointer"
              >
                <option value="General">General (Open Seat)</option>
                <option value="OBC">OBC-NCL</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="EWS">Economically Weaker Section (EWS)</option>
              </select>
            </div>

            {/* Rank Input */}
            <div>
              <label htmlFor="rank-number" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Your Rank / AIR
              </label>
              <input
                id="rank-number"
                type="number"
                min="1"
                required
                value={rankInput}
                onChange={(e) => setRankInput(e.target.value)}
                placeholder="e.g. 5000"
                className="glass-input block w-full px-4 py-3 rounded-xl text-xs"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 transition-all cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin text-white" />
              ) : (
                <>
                  Predict Eligibility
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* RESULTS GRID (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl border border-white/5 h-[340px] animate-pulse">
                  <div className="p-6 space-y-6">
                    <div className="h-5 bg-slate-800 rounded w-2/3" />
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-800 rounded w-full" />
                      <div className="h-3 bg-slate-800 rounded w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !hasSearched ? (
            <div className="glass-card rounded-2xl border border-white/5 p-12 text-center max-w-md mx-auto">
              <Sparkles className="h-12 w-12 text-indigo-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-md font-bold text-white mb-2">Awaiting your details</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fill in the rank predictor parameters on the left to analyze historical data from counselling rounds.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="glass-card rounded-2xl border border-white/5 p-12 text-center max-w-md mx-auto">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-md font-bold text-white mb-2">No matches found</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Your rank of <span className="font-semibold text-white">{rankInput}</span> exceeds historic closing ranks for the selected exam ({exam}) and category ({category}) in top colleges.
              </p>
              <p className="text-[10px] text-slate-500">
                Tip: Try switching categories or checking eligibility under another exam type.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs border-b border-white/5 pb-3">
                <span className="text-slate-400">
                  Found <span className="font-semibold text-white">{results.length}</span> eligible options
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Historical Cutoffs Analyzed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((res, i) => (
                  <PredictorResultCard key={i} result={res} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
