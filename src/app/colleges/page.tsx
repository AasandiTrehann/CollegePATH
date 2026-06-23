'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import { 
  Search, 
  MapPin, 
  BookOpen, 
  SlidersHorizontal, 
  Star, 
  Coins,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  X,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Loader2
} from 'lucide-react';

function CollegesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State Synchronizer
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [course, setCourse] = useState(searchParams.get('course') || '');
  const [feesMax, setFeesMax] = useState(searchParams.get('feesMax') || '600000');
  const [ratingMin, setRatingMin] = useState(searchParams.get('ratingMin') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Data fetching States
  const [colleges, setColleges] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Compare List state
  const [comparedColleges, setComparedColleges] = useState<any[]>([]);

  // Fetch list of colleges based on filters
  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (course) params.append('course', course);
      if (feesMax) params.append('feesMax', feesMax);
      if (ratingMin) params.append('ratingMin', ratingMin);
      params.append('page', page.toString());
      params.append('limit', '6'); // 6 colleges per page

      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch colleges.');
      }
      const data = await res.json();
      setColleges(data.colleges || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [search, location, course, feesMax, ratingMin, page]);

  // Fetch saved colleges for checkmark states
  const fetchSavedColleges = useCallback(async () => {
    try {
      const res = await fetch('/api/saved');
      if (res.ok) {
        const data = await res.json();
        const ids = data.saved?.map((s: any) => s.college.id) || [];
        setSavedIds(ids);
      }
    } catch (e) {
      console.warn('Could not fetch saved list (user may be logged out)');
    }
  }, []);

  // Run fetch queries
  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  useEffect(() => {
    fetchSavedColleges();
  }, [fetchSavedColleges]);

  // Sync to URL
  const applyFilters = () => {
    setPage(1); // Reset to page 1 on filter submit
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    if (course) params.append('course', course);
    if (feesMax) params.append('feesMax', feesMax);
    if (ratingMin) params.append('ratingMin', ratingMin);
    params.append('page', '1');
    router.push(`/colleges?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setCourse('');
    setFeesMax('600000');
    setRatingMin('');
    setPage(1);
    router.push('/colleges');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/colleges?${params.toString()}`);
  };

  // Compare toggler logic
  const handleCompareToggle = (college: any) => {
    setComparedColleges(prev => {
      const exists = prev.find(c => c.id === college.id);
      if (exists) {
        return prev.filter(c => c.id !== college.id);
      }
      if (prev.length >= 3) return prev; // Limit comparison cap
      return [...prev, college];
    });
  };

  // Location and Course select listings options
  const locations = ['Delhi', 'Mumbai', 'Chennai', 'Kharagpur', 'Kanpur', 'Roorkee', 'Patiala', 'Vellore', 'Manipal', 'Surathkal', 'Warangal'];
  const courses = ['Computer Science', 'Electronics', 'Mechanical'];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col">
      {/* 1. Header description */}
      <div className="mb-10 text-left">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 sm:text-4xl">
          <BookOpen className="h-8 w-8 text-indigo-400" />
          Discover Colleges
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore and filter top universities based on your preferences and budget
        </p>
      </div>

      {/* 2. Main Search & Layout structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        
        {/* FILTERS COLUMN */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 h-fit lg:col-span-1">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
              Filters
            </h3>
            <button 
              onClick={handleReset} 
              className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="IIT, Mumbai, etc..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none"
                >
                  <option value="">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Popular Course
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none"
                >
                  <option value="">All Courses</option>
                  {courses.map(crs => (
                    <option key={crs} value={crs}>{crs}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Max Fees Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Max Annual Fees
                </label>
                <span className="text-xs font-extrabold text-indigo-400">
                  ₹{(parseInt(feesMax, 10) / 100000).toFixed(1)}L
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Coins className="h-4 w-4 text-slate-500 shrink-0" />
                <input
                  type="range"
                  min="50000"
                  max="600000"
                  step="25000"
                  value={feesMax}
                  onChange={(e) => setFeesMax(e.target.value)}
                  className="w-full accent-indigo-500 bg-slate-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>
            </div>

            {/* Min Rating Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Min Student Rating
              </label>
              <div className="relative">
                <Star className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <select
                  value={ratingMin}
                  onChange={(e) => setRatingMin(e.target.value)}
                  className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyFilters}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          {/* List display grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl border border-white/5 h-[340px] animate-pulse">
                  <div className="h-36 bg-slate-900/60 w-full" />
                  <div className="p-5 space-y-4">
                    <div className="h-4 bg-slate-800 rounded w-2/3" />
                    <div className="h-3 bg-slate-800 rounded w-1/3" />
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-b border-white/5 py-4">
                      <div className="h-6 bg-slate-800 rounded" />
                      <div className="h-6 bg-slate-800 rounded" />
                      <div className="h-6 bg-slate-800 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-8 text-center text-rose-400">
              {error}
            </div>
          ) : colleges.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-white/5 max-w-lg mx-auto mt-10">
              <Search className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No colleges found</h3>
              <p className="text-sm text-slate-400 mb-6">
                We couldn&apos;t find any colleges matching your search criteria. Try modifying your filter constraints.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-indigo-500 text-xs font-semibold text-white hover:bg-indigo-600"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              {/* Colleges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {colleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    isSavedInitial={savedIds.includes(college.id)}
                    isCompared={comparedColleges.some(c => c.id === college.id)}
                    onCompareToggle={() => handleCompareToggle(college)}
                    compareCount={comparedColleges.length}
                  />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-6">
                  <p className="text-xs text-slate-400">
                    Showing <span className="font-semibold text-white">{(page - 1) * 6 + 1}</span> to{' '}
                    <span className="font-semibold text-white">
                      {Math.min(page * 6, totalCount)}
                    </span>{' '}
                    of <span className="font-semibold text-white">{totalCount}</span> colleges
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="rounded-lg border border-white/10 bg-slate-900/60 p-2 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          page === i + 1
                            ? 'bg-indigo-500 text-white'
                            : 'border border-white/5 bg-slate-950 text-slate-400 hover:text-white hover:border-white/15'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="rounded-lg border border-white/10 bg-slate-900/60 p-2 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* FLOATING COMPARE BAR DRAWER */}
      {comparedColleges.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 animate-bounce-in">
          <div className="glass-card rounded-2xl border border-indigo-500/25 bg-slate-950/90 shadow-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
                <GitCompare className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Compare Colleges</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {comparedColleges.length} of 3 selected
                </p>
              </div>
            </div>

            {/* Selected Pills */}
            <div className="flex items-center gap-2 flex-grow justify-center overflow-x-auto max-w-[220px]">
              {comparedColleges.map(c => (
                <div 
                  key={c.id} 
                  className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-full pl-2.5 pr-1 py-1 text-[10px] text-slate-200 shrink-0"
                >
                  <span className="truncate max-w-[65px]">{c.name.split(' (')[0]}</span>
                  <button 
                    onClick={() => handleCompareToggle(c)} 
                    className="p-0.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const ids = comparedColleges.map(c => c.id).join(',');
                router.push(`/compare?ids=${ids}`);
              }}
              className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 cursor-pointer"
            >
              Compare
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
      </div>
    }>
      <CollegesPageContent />
    </Suspense>
  );
}
