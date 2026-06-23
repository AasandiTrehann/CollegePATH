'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Star, 
  MapPin, 
  Bookmark, 
  GitCompare, 
  ArrowLeft, 
  Loader2, 
  Building,
  GraduationCap, 
  Briefcase, 
  MessageSquare,
  PlusCircle,
  Calendar,
  Send
} from 'lucide-react';
import Link from 'next/link';

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  
  // Resolve params using React.use() wrapper
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews'>('overview');

  // Fetch data states
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Review Form States
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fetch college details
  const fetchCollegeDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/colleges/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('College not found.');
        }
        throw new Error('Failed to load college details.');
      }
      const data = await res.json();
      setCollege(data.college);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Check if college is shortlisted
  const fetchShortlistState = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/saved');
      if (res.ok) {
        const data = await res.json();
        const saved = data.saved?.some((s: any) => s.college.id === id) || false;
        setIsSaved(saved);
      }
    } catch (e) {
      console.warn('Could not read shortlist status.');
    }
  }, [id, user]);

  useEffect(() => {
    fetchCollegeDetails();
  }, [fetchCollegeDetails]);

  useEffect(() => {
    fetchShortlistState();
  }, [fetchShortlistState]);

  // Toggle Shortlist action
  const handleSaveToggle = async () => {
    if (!user) {
      router.push(`/login?redirect=/colleges/${id}`);
      return;
    }

    try {
      setSaveLoading(true);
      if (isSaved) {
        const res = await fetch(`/api/saved/${id}`, { method: 'DELETE' });
        if (res.ok) setIsSaved(false);
      } else {
        const res = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId: id }),
        });
        if (res.ok) setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed toggling shortlist state:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  // Review submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(false);

    if (!commentInput.trim()) {
      setReviewError('Comment is required.');
      return;
    }

    try {
      setReviewLoading(true);
      const res = await fetch(`/api/colleges/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingInput, comment: commentInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      setReviewSuccess(true);
      setCommentInput('');
      setRatingInput(5);
      
      // Refresh details to show new review
      fetchCollegeDetails();
    } catch (err: any) {
      setReviewError(err.message || 'Something went wrong.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="text-2xl font-bold text-rose-400 mb-2">Error Loading Page</h2>
        <p className="text-slate-400 mb-6">{error || 'College not found'}</p>
        <Link
          href="/colleges"
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow">
      {/* Back button */}
      <Link
        href="/colleges"
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 w-fit transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Directory
      </Link>

      {/* 1. Header Profile Box */}
      <div className="glass-card rounded-3xl border border-white/5 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-4 shadow-lg shadow-indigo-500/20">
            <Building className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {college.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-indigo-400" />
                {college.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-indigo-400" />
                Established {college.establishedYear}
              </span>
            </div>
          </div>
        </div>

        {/* Action Sidebar controls */}
        <div className="relative z-10 flex items-center gap-3 self-end md:self-center shrink-0">
          <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-amber-400 font-semibold backdrop-blur-sm">
            <Star className="h-4 w-4 fill-current" />
            {college.rating > 0 ? `${college.rating.toFixed(1)} Stars` : 'N/A'}
          </div>

          <button
            onClick={handleSaveToggle}
            disabled={saveLoading}
            className={`flex items-center gap-1.5 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
              isSaved
                ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30'
                : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-white/5'
            }`}
          >
            {saveLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
            )}
            {isSaved ? 'Shortlisted' : 'Shortlist'}
          </button>
        </div>
      </div>

      {/* 2. Content Tabs */}
      <div className="flex border-b border-white/5 mb-8 overflow-x-auto gap-2 py-1">
        {[
          { id: 'overview', name: 'Overview', icon: Building },
          { id: 'courses', name: 'Courses & Fees', icon: GraduationCap },
          { id: 'placements', name: 'Placements (2023)', icon: Briefcase },
          { id: 'reviews', name: 'Student Reviews', icon: MessageSquare },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main area (2 columns wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">About the University</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {college.overview}
                </p>
              </div>
              <div className="border-t border-white/5 pt-6 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Established</span>
                  <p className="text-sm font-semibold text-slate-300 mt-1">{college.establishedYear}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Location</span>
                  <p className="text-sm font-semibold text-slate-300 mt-1">{college.location}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              {college.courses.map((course: any) => (
                <div key={course.id} className="glass-card rounded-2xl border border-white/5 p-5 flex items-center justify-between gap-4">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white">{course.name}</h4>
                    <span className="text-xs text-slate-400 mt-1 block">Duration: {course.duration}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Annual Tuition</span>
                    <p className="text-md font-extrabold text-indigo-300 mt-0.5">₹{course.fees.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PLACEMENTS */}
          {activeTab === 'placements' && (
            <div className="space-y-6">
              {college.placements.map((placement: any) => (
                <div key={placement.id} className="glass-card rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <h4 className="font-bold text-white text-sm">Placement Statistics ({placement.year})</h4>
                    <span className="rounded-lg bg-green-500/10 border border-green-500/20 px-2.5 py-1 text-xs font-semibold text-green-400">
                      {placement.placementRate}% Placed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card rounded-xl p-5 border border-white/5 text-center">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Average Package</span>
                      <p className="text-2xl font-extrabold text-indigo-300 mt-1">{placement.averagePackage} LPA</p>
                      <span className="text-[9px] text-slate-500 mt-1 block">Verified median CTC</span>
                    </div>
                    
                    <div className="glass-card rounded-xl p-5 border border-white/5 text-center">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Highest Package</span>
                      <p className="text-2xl font-extrabold text-slate-200 mt-1">{placement.highestPackage} LPA</p>
                      <span className="text-[9px] text-slate-500 mt-1 block">International/National CTC</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: REVIEWS & REVIEWS SUBMISSION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* REVIEW POSTING FORM */}
              <div className="glass-card rounded-2xl border border-white/5 p-6">
                <h3 className="text-md font-bold text-white flex items-center gap-2 mb-4">
                  <PlusCircle className="h-5 w-5 text-indigo-400" />
                  Write a Review
                </h3>

                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {reviewError && (
                      <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                        {reviewError}
                      </div>
                    )}
                    {reviewSuccess && (
                      <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-xs text-green-400">
                        Review submitted successfully! Thank you.
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-400">Rating:</span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingInput(star)}
                            className="text-slate-500 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star 
                              className={`h-5 w-5 ${
                                star <= ratingInput 
                                  ? 'text-amber-400 fill-current' 
                                  : 'text-slate-600 hover:text-amber-400'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        required
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Share your experience at this college..."
                        className="glass-input block w-full p-4 rounded-xl text-xs resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 cursor-pointer disabled:opacity-50"
                    >
                      {reviewLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Submit Review
                          <Send className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="rounded-xl border border-white/5 bg-slate-900/60 p-5 text-center text-xs text-slate-400">
                    You must be logged in to post a review.{' '}
                    <Link href={`/login?redirect=/colleges/${id}`} className="font-semibold text-indigo-400 hover:underline">
                      Log In here
                    </Link>
                  </div>
                )}
              </div>

              {/* LIST OF REVIEWS */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-white text-left">Student Reviews ({college.reviews.length})</h3>
                {college.reviews.length === 0 ? (
                  <div className="glass-card rounded-2xl p-6 text-center text-xs text-slate-500 border border-white/5">
                    No student reviews yet. Be the first to leave a review!
                  </div>
                ) : (
                  college.reviews.map((review: any) => (
                    <div key={review.id} className="glass-card rounded-2xl border border-white/5 p-5 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-200 block">{review.studentName}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 rounded-lg bg-amber-500/5 border border-amber-500/15 px-2 py-0.5 text-xs text-amber-400 font-semibold">
                          <Star className="h-3 w-3 fill-current" />
                          {review.rating}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed text-left">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar details (1 column wide) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl border border-white/5 p-6 text-left">
            <h3 className="font-bold text-white border-b border-white/5 pb-3 mb-4 text-sm uppercase tracking-wider">
              Quick Highlights
            </h3>

            <div className="space-y-5">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Tuition Fees (Representative)</span>
                <span className="text-md font-bold text-slate-200 mt-1 block">
                  ₹{college.fees.toLocaleString('en-IN')} / Year
                </span>
              </div>
              
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Average Placements (2023)</span>
                <span className="text-md font-bold text-indigo-300 mt-1 block">
                  {college.placements[0]?.averagePackage ? `${college.placements[0].averagePackage} LPA` : 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Counselling Cutoff Exam</span>
                <span className="text-md font-bold text-slate-200 mt-1 block">
                  {college.cutoffs[0]?.exam || 'JEE Main / BITSAT'}
                </span>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Total Departments</span>
                <span className="text-md font-bold text-slate-200 mt-1 block">
                  {college.courses.length} Departments
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
