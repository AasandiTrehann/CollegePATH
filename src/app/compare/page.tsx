'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  GitCompare, 
  Loader2, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Coins, 
  Star, 
  Briefcase,
  X,
  Plus
} from 'lucide-react';
import Link from 'next/link';

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids') || '';

  // Data fetching States
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search dropdown selectors (to add new colleges from compare page)
  const [allCollegesPool, setAllCollegesPool] = useState<any[]>([]);
  const [showAddSelector, setShowAddSelector] = useState(false);

  // Parse list of compared IDs
  const comparedIds = idsParam
    .split(',')
    .map(id => id.trim())
    .filter(id => id !== '');

  // Fetch comparison details
  const fetchCompareDetails = useCallback(async () => {
    if (comparedIds.length === 0) {
      setColleges([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/compare?ids=${comparedIds.join(',')}`);
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch comparison details.');
      }
      
      setColleges(data.colleges || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [idsParam]); // depends on idsParam to refetch when route updates

  // Fetch all colleges pool to allow dropdown additions
  const fetchCollegesPool = async () => {
    try {
      const res = await fetch('/api/colleges?limit=30'); // Fetch a large batch
      if (res.ok) {
        const data = await res.json();
        setAllCollegesPool(data.colleges || []);
      }
    } catch (e) {
      console.warn('Failed loading colleges pool list');
    }
  };

  useEffect(() => {
    fetchCompareDetails();
    fetchCollegesPool();
  }, [fetchCompareDetails]);

  // Remove a college from compare parameter list
  const handleRemove = (collegeId: string) => {
    const updatedIds = comparedIds.filter(id => id !== collegeId);
    if (updatedIds.length === 0) {
      router.push('/compare');
    } else {
      router.push(`/compare?ids=${updatedIds.join(',')}`);
    }
  };

  // Add a college to comparison list
  const handleAddCollege = (collegeId: string) => {
    if (comparedIds.includes(collegeId)) {
      setShowAddSelector(false);
      return; // Already added
    }
    if (comparedIds.length >= 3) {
      alert('You can compare a maximum of 3 colleges simultaneously.');
      setShowAddSelector(false);
      return;
    }
    const updatedIds = [...comparedIds, collegeId];
    router.push(`/compare?ids=${updatedIds.join(',')}`);
    setShowAddSelector(false);
  };

  // Highlight the best statistic in comparison list helper
  const getBestMetric = (metric: 'fees' | 'averagePackage' | 'highestPackage' | 'placementRate', findLowest = false) => {
    if (colleges.length < 2) return null;
    
    const values = colleges.map(c => {
      if (metric === 'fees') return c.fees;
      const placement = c.placements?.[0];
      return placement ? placement[metric] : 0;
    });

    const targetVal = findLowest ? Math.min(...values) : Math.max(...values);
    return targetVal;
  };

  const bestFees = getBestMetric('fees', true); // Lowest tuition fee is best
  const bestAvgPkg = getBestMetric('averagePackage');
  const bestMaxPkg = getBestMetric('highestPackage');
  const bestPlacedRate = getBestMetric('placementRate');

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col">
      {/* Page Header */}
      <div className="mb-10 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 sm:text-4xl">
            <GitCompare className="h-8 w-8 text-indigo-400" />
            Compare Colleges
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Analyze tuition structures and placement CTCs side-by-side
          </p>
        </div>
        <Link
          href="/colleges"
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Add More Colleges
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-6 text-center text-rose-400 mb-8 max-w-xl mx-auto">
          {error}
        </div>
      )}

      {/* 3. Empty comparison state */}
      {colleges.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 border border-white/5 max-w-xl mx-auto text-center my-10">
          <GitCompare className="h-16 w-16 text-indigo-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-xl font-bold text-white mb-2">No colleges selected</h2>
          <p className="text-sm text-slate-400 mb-8">
            Select up to 3 colleges from our discovery directory to compare their performance parameters.
          </p>
          <Link
            href="/colleges"
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-xs font-bold text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
          >
            Explore Directory
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Comparison Matrix Table Card */}
          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-950/40">
                    <th className="p-6 text-left text-xs font-bold uppercase tracking-wider text-slate-500 min-w-[200px] w-[20%]">
                      Comparison Metric
                    </th>
                    {colleges.map((col) => (
                      <th key={col.id} className="p-6 text-left relative min-w-[240px] w-[26%]">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-extrabold text-white text-sm line-clamp-2">
                              {col.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Est. {col.establishedYear}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleRemove(col.id)}
                            title="Remove college"
                            className="rounded-lg p-1 bg-white/5 border border-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                    
                    {/* Add college slot if under the limit */}
                    {colleges.length < 3 && (
                      <th className="p-6 text-center min-w-[240px] w-[26%] border-l border-white/5 border-dashed">
                        {showAddSelector ? (
                          <div className="relative text-left max-w-[200px] mx-auto">
                            <select
                              onChange={(e) => handleAddCollege(e.target.value)}
                              defaultValue=""
                              className="glass-input block w-full px-3 py-2 rounded-xl text-xs"
                            >
                              <option value="" disabled>Select College</option>
                              {allCollegesPool
                                .filter(poolCol => !comparedIds.includes(poolCol.id))
                                .map(poolCol => (
                                  <option key={poolCol.id} value={poolCol.id}>
                                    {poolCol.name.split(' (')[0]}
                                  </option>
                                ))}
                            </select>
                            <button
                              onClick={() => setShowAddSelector(false)}
                              className="text-[10px] text-slate-500 hover:text-white mt-2 block underline cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowAddSelector(true)}
                            className="mx-auto flex flex-col items-center gap-1.5 justify-center rounded-2xl border border-white/10 border-dashed bg-white/5 hover:bg-white/10 p-6 text-center text-slate-400 hover:text-white transition-all cursor-pointer"
                          >
                            <Plus className="h-6 w-6 text-indigo-400" />
                            <span className="text-xs font-bold">Add to Compare</span>
                          </button>
                        )}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {/* Location Row */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 uppercase tracking-wider">Location</td>
                    {colleges.map((col) => (
                      <td key={col.id} className="p-6 text-slate-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                          {col.location}
                        </span>
                      </td>
                    ))}
                    {colleges.length < 3 && <td className="p-6 border-l border-white/5 border-dashed" />}
                  </tr>

                  {/* Representative Fees Row */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 uppercase tracking-wider">Tuition Fees (p.a.)</td>
                    {colleges.map((col) => {
                      const isBest = col.fees === bestFees;
                      return (
                        <td key={col.id} className={`p-6 ${isBest ? 'bg-indigo-500/5' : ''}`}>
                          <span className={`font-extrabold flex items-center gap-1.5 ${isBest ? 'text-indigo-400' : 'text-slate-200'}`}>
                            <Coins className="h-4 w-4 shrink-0 text-slate-500" />
                            ₹{col.fees.toLocaleString('en-IN')}
                            {isBest && <span className="text-[9px] uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md font-semibold shrink-0">Lowest</span>}
                          </span>
                        </td>
                      );
                    })}
                    {colleges.length < 3 && <td className="p-6 border-l border-white/5 border-dashed" />}
                  </tr>

                  {/* Rating Row */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 uppercase tracking-wider">Student Rating</td>
                    {colleges.map((col) => (
                      <td key={col.id} className="p-6 text-slate-300">
                        <span className="font-extrabold text-slate-200 flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-400 fill-current shrink-0" />
                          {col.rating > 0 ? `${col.rating.toFixed(1)} / 5.0` : 'N/A'}
                        </span>
                      </td>
                    ))}
                    {colleges.length < 3 && <td className="p-6 border-l border-white/5 border-dashed" />}
                  </tr>

                  {/* Average CTC Row */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 uppercase tracking-wider">Average Placement</td>
                    {colleges.map((col) => {
                      const placement = col.placements?.[0];
                      const averagePackage = placement?.averagePackage || 0;
                      const isBest = averagePackage > 0 && averagePackage === bestAvgPkg;
                      return (
                        <td key={col.id} className={`p-6 ${isBest ? 'bg-indigo-500/5' : ''}`}>
                          <span className={`font-extrabold flex items-center gap-1.5 ${isBest ? 'text-indigo-400' : 'text-slate-200'}`}>
                            <Briefcase className="h-4 w-4 shrink-0 text-slate-500" />
                            {averagePackage > 0 ? `${averagePackage.toFixed(1)} LPA` : 'N/A'}
                            {isBest && <span className="text-[9px] uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md font-semibold shrink-0">Highest</span>}
                          </span>
                        </td>
                      );
                    })}
                    {colleges.length < 3 && <td className="p-6 border-l border-white/5 border-dashed" />}
                  </tr>

                  {/* Highest package Row */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 uppercase tracking-wider">Highest Placement</td>
                    {colleges.map((col) => {
                      const placement = col.placements?.[0];
                      const highestPackage = placement?.highestPackage || 0;
                      const isBest = highestPackage > 0 && highestPackage === bestMaxPkg;
                      return (
                        <td key={col.id} className={`p-6 ${isBest ? 'bg-indigo-500/5' : ''}`}>
                          <span className={`font-extrabold flex items-center gap-1.5 ${isBest ? 'text-indigo-400' : 'text-slate-200'}`}>
                            {highestPackage > 0 ? `${highestPackage.toFixed(1)} LPA` : 'N/A'}
                            {isBest && <span className="text-[9px] uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md font-semibold shrink-0">Highest</span>}
                          </span>
                        </td>
                      );
                    })}
                    {colleges.length < 3 && <td className="p-6 border-l border-white/5 border-dashed" />}
                  </tr>

                  {/* Placement Rate Row */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 uppercase tracking-wider">Placement Rate</td>
                    {colleges.map((col) => {
                      const placement = col.placements?.[0];
                      const placementRate = placement?.placementRate || 0;
                      const isBest = placementRate > 0 && placementRate === bestPlacedRate;
                      return (
                        <td key={col.id} className={`p-6 ${isBest ? 'bg-indigo-500/5' : ''}`}>
                          <span className={`font-extrabold flex items-center gap-1.5 ${isBest ? 'text-indigo-400' : 'text-slate-200'}`}>
                            {placementRate > 0 ? `${placementRate.toFixed(1)}%` : 'N/A'}
                            {isBest && <span className="text-[9px] uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md font-semibold shrink-0">Highest</span>}
                          </span>
                        </td>
                      );
                    })}
                    {colleges.length < 3 && <td className="p-6 border-l border-white/5 border-dashed" />}
                  </tr>

                  {/* Link Row */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 uppercase tracking-wider">Profiles</td>
                    {colleges.map((col) => (
                      <td key={col.id} className="p-6">
                        <Link
                          href={`/colleges/${col.id}`}
                          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
                        >
                          View Full Details &rarr;
                        </Link>
                      </td>
                    ))}
                    {colleges.length < 3 && <td className="p-6 border-l border-white/5 border-dashed" />}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
