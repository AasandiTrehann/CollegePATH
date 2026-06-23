'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Bookmark, 
  Loader2, 
  Trash2, 
  ArrowRight, 
  Coins, 
  Briefcase, 
  Star,
  MapPin,
  Building,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Shortlist data fetching States
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  // Fetch saved list
  const fetchSaved = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/saved');
      if (!res.ok) {
        throw new Error('Failed to load your shortlisted colleges.');
      }
      const data = await res.json();
      setSavedColleges(data.saved || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSaved();
    }
  }, [user, fetchSaved]);

  // Remove college from shortlist
  const handleDelete = async (collegeId: string) => {
    try {
      setDeleteLoadingId(collegeId);
      const res = await fetch(`/api/saved/${collegeId}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to remove college.');
      }
      // Instantly update local list state
      setSavedColleges(prev => prev.filter(sc => sc.college.id !== collegeId));
    } catch (err: any) {
      alert(err.message || 'Could not remove college. Please try again.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // Dashboard calculations: averages across shortlisted colleges
  const getStats = () => {
    if (savedColleges.length === 0) {
      return { avgFees: 0, avgPackage: 0, avgRating: 0 };
    }

    const totalFees = savedColleges.reduce((sum, sc) => sum + sc.college.fees, 0);
    const totalPkg = savedColleges.reduce((sum, sc) => sum + sc.college.averagePackage, 0);
    
    // Filters rating values > 0
    const ratingColleges = savedColleges.filter(sc => sc.college.rating > 0);
    const totalRating = ratingColleges.reduce((sum, sc) => sum + sc.college.rating, 0);

    return {
      avgFees: Math.round(totalFees / savedColleges.length),
      avgPackage: Math.round((totalPkg / savedColleges.length) * 10) / 10,
      avgRating: ratingColleges.length > 0 ? Math.round((totalRating / ratingColleges.length) * 10) / 10 : 0
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col">
      {/* Dashboard Welcome header */}
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 sm:text-4xl">
          <Bookmark className="h-8 w-8 text-indigo-400" />
          Welcome, {user?.name || 'Student'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your saved institutions and analyze aggregated metrics for your admission checklist
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4 text-center text-rose-400 mb-8 max-w-xl">
          {error}
        </div>
      )}

      {savedColleges.length === 0 ? (
        /* Empty Dashboard Page state */
        <div className="glass-card rounded-3xl p-16 border border-white/5 max-w-xl mx-auto text-center my-10">
          <Bookmark className="h-16 w-16 text-indigo-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-xl font-bold text-white mb-2">Your shortlist is empty</h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            Browse through Indian colleges and departments and save them to build your custom admissions comparison dashboard.
          </p>
          <Link
            href="/colleges"
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-xs font-bold text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
          >
            Find Colleges
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* STATS AGGREGATES CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4 text-left">
              <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400 shrink-0">
                <Coins className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Average Fees (p.a.)</span>
                <p className="text-xl font-extrabold text-white mt-1">₹{stats.avgFees.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4 text-left">
              <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400 shrink-0">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Avg Placements (2023)</span>
                <p className="text-xl font-extrabold text-purple-300 mt-1">{stats.avgPackage} LPA</p>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4 text-left">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400 shrink-0">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Average Rating</span>
                <p className="text-xl font-extrabold text-amber-400 mt-1">{stats.avgRating} Stars</p>
              </div>
            </div>
          </div>

          {/* LIST OF SHORTLISTED COLLEGES */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white text-left">Shortlisted Institutions ({savedColleges.length})</h3>
            
            <div className="space-y-4">
              {savedColleges.map((sc) => {
                const col = sc.college;
                return (
                  <div 
                    key={sc.savedId} 
                    className="glass-card rounded-2xl border border-white/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    {/* College details summary */}
                    <div className="flex items-start gap-4 text-left">
                      <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400 shrink-0 hidden sm:block">
                        <Building className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-md hover:text-indigo-300 transition-colors">
                          <Link href={`/colleges/${col.id}`}>
                            {col.name}
                          </Link>
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                            {col.location}
                          </span>
                          <span className="text-slate-600">|</span>
                          <span className="flex items-center gap-1 font-semibold text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {col.rating > 0 ? col.rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                      
                      {/* Metric specs */}
                      <div className="grid grid-cols-2 gap-4 text-left sm:text-right shrink-0">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Fees</span>
                          <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                            ₹{(col.fees / 100000).toFixed(2)}L / Year
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Avg Package</span>
                          <span className="text-xs font-bold text-indigo-300 mt-0.5 block">
                            {col.averagePackage > 0 ? `${col.averagePackage} LPA` : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/colleges/${col.id}`}
                          className="flex items-center gap-1 rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
                        >
                          Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(col.id)}
                          disabled={deleteLoadingId === col.id}
                          title="Remove from shortlist"
                          className="rounded-xl border border-rose-500/10 bg-rose-500/10 p-2.5 text-rose-400 hover:bg-rose-500/20 disabled:opacity-30 cursor-pointer"
                        >
                          {deleteLoadingId === col.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
