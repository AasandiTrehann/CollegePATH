'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Star, MapPin, Bookmark, GitCompare, ArrowRight, Loader2 } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  fees: number;
}

interface Placement {
  id: string;
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
}

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  establishedYear: number;
  rating: number;
  courses: Course[];
  placements: Placement[];
}

interface CollegeCardProps {
  college: College;
  isSavedInitial: boolean;
  onSaveToggle?: (saved: boolean) => void;
  isCompared: boolean;
  onCompareToggle: () => void;
  compareCount: number;
}

export default function CollegeCard({
  college,
  isSavedInitial,
  onSaveToggle,
  isCompared,
  onCompareToggle,
  compareCount,
}: CollegeCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    setIsSaved(isSavedInitial);
  }, [isSavedInitial]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = `/login?redirect=/colleges`;
      return;
    }

    try {
      setSaveLoading(true);
      if (isSaved) {
        // Delete shortlist relationship
        const res = await fetch(`/api/saved/${college.id}`, { method: 'DELETE' });
        if (res.ok) {
          setIsSaved(false);
          if (onSaveToggle) onSaveToggle(false);
        }
      } else {
        // Save college
        const res = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId: college.id }),
        });
        if (res.ok) {
          setIsSaved(true);
          if (onSaveToggle) onSaveToggle(true);
        }
      }
    } catch (error) {
      console.error('Error toggling saved college:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const avgPackage = college.placements[0]?.averagePackage || 0;
  const placementRate = college.placements[0]?.placementRate || 0;

  // Check if comparison cap is hit (max 3) to render disable states
  const isCompareDisabled = !isCompared && compareCount >= 3;

  return (
    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col group relative">
      {/* Decorative layout cover */}
      <div className="h-36 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* Floating actions */}
        <div className="flex items-center justify-between relative z-10 w-full">
          <span className="text-[10px] font-bold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            Est. {college.establishedYear}
          </span>
          
          <div className="flex items-center gap-2">
            {/* Compare Toggle */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onCompareToggle();
              }}
              disabled={isCompareDisabled}
              title={isCompareDisabled ? 'Max 3 colleges selected' : 'Toggle compare'}
              className={`rounded-lg p-1.5 border transition-all duration-200 cursor-pointer ${
                isCompared
                  ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                  : isCompareDisabled
                  ? 'bg-slate-900/40 border-white/5 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <GitCompare className="h-4 w-4" />
            </button>

            {/* Bookmark Toggle */}
            <button
              onClick={handleSave}
              disabled={saveLoading}
              title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
              className={`rounded-lg p-1.5 border transition-all duration-200 cursor-pointer ${
                isSaved
                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                  : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {saveLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="relative z-10">
          <h3 className="text-md font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
            <Link href={`/colleges/${college.id}`}>
              {college.name}
            </Link>
          </h3>
          <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
            <MapPin className="h-3 w-3 text-indigo-400 shrink-0" />
            {college.location}
          </span>
        </div>
      </div>

      {/* Main card info body */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        {/* Core Stats */}
        <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-4 mb-4 text-center">
          <div>
            <span className="text-[9px] uppercase font-semibold text-slate-500 block">Rating</span>
            <span className="text-sm font-bold text-slate-200 mt-1 inline-flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
              {college.rating > 0 ? college.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-semibold text-slate-500 block">Tuition (p.a.)</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">
              ₹{(college.fees / 100000).toFixed(2)}L
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-semibold text-slate-500 block">Avg Package</span>
            <span className="text-sm font-bold text-indigo-300 mt-1 block">
              {avgPackage > 0 ? `${avgPackage.toFixed(1)} LPA` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Available Departments list */}
        <div className="mb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 text-left">
            Popular Courses
          </span>
          <div className="flex flex-wrap gap-1.5">
            {college.courses.slice(0, 2).map(c => (
              <span key={c.id} className="text-[10px] bg-white/5 border border-white/5 text-slate-300 px-2 py-0.5 rounded-lg">
                {c.name.split(' and ')[0].split(' in ')[0].replace('Engineering', 'Engg.')}
              </span>
            ))}
            {college.courses.length > 2 && (
              <span className="text-[10px] bg-indigo-500/5 text-indigo-300 px-2 py-0.5 rounded-lg font-medium">
                +{college.courses.length - 2} more
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/colleges/${college.id}`}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/60 py-2.5 text-center text-xs font-semibold text-slate-200 hover:bg-white/5 hover:border-white/20 transition-all"
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
