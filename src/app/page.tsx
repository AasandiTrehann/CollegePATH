import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { 
  Search, 
  Sparkles, 
  GitCompare, 
  GraduationCap, 
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Star
} from 'lucide-react';

// Server-side fetch for Featured Colleges
async function getFeaturedColleges() {
  try {
    const colleges = await prisma.college.findMany({
      take: 3,
      include: {
        courses: true,
        placements: { where: { year: 2023 } },
        reviews: { select: { rating: true } }
      }
    });

    return colleges.map((col: any) => {
      const ratings = col.reviews.map((r: { rating: number }) => r.rating);
      const averageRating = ratings.length > 0
        ? Math.round((ratings.reduce((sum: number, val: number) => sum + val, 0) / ratings.length) * 10) / 10
        : 0;

      return {
        id: col.id,
        name: col.name,
        location: col.location,
        fees: col.fees,
        establishedYear: col.establishedYear,
        rating: averageRating,
        averagePackage: col.placements[0]?.averagePackage || 0,
      };
    });
  } catch (error) {
    console.warn('⚠️ Seeding database required to render featured colleges:', error);
    return null; // Fallback to mockup data if DB not connected/seeded
  }
}

// Fallback data for layout if database is not seeded
const fallbackFeatured = [
  {
    id: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay (IIT Bombay)',
    location: 'Mumbai, Maharashtra',
    fees: 220000,
    establishedYear: 1958,
    rating: 4.8,
    averagePackage: 23.5,
  },
  {
    id: 'nit-trichy',
    name: 'National Institute of Technology Tiruchirappalli (NIT Trichy)',
    location: 'Tiruchirappalli, Tamil Nadu',
    fees: 145000,
    establishedYear: 1964,
    rating: 4.5,
    averagePackage: 15.6,
  },
  {
    id: 'bits-pilani',
    name: 'Birla Institute of Technology and Science (BITS Pilani)',
    location: 'Pilani, Rajasthan',
    fees: 540000,
    establishedYear: 1964,
    rating: 4.6,
    averagePackage: 18.2,
  }
];

export default async function HomePage() {
  const dbFeatured = await getFeaturedColleges();
  const isDemoFallback = dbFeatured === null || dbFeatured.length === 0;
  const featuredColleges = isDemoFallback ? fallbackFeatured : dbFeatured;

  return (
    <div className="relative overflow-hidden flex flex-col justify-center items-center">
      {/* 1. Hero Block */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 text-xs font-semibold text-indigo-400 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          The Ultimate College Finder
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white mb-6">
          Your Path to the{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Right College
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Discover top-tier Indian universities, compare fees and placement statistics side-by-side, 
          and predict your admission eligibility based on cutoff ranks.
        </p>

        {/* Integrated Quick Search Block */}
        <form action="/colleges" method="GET" className="w-full max-w-2xl mx-auto mb-16">
          <div className="relative flex items-center p-2 rounded-2xl glass-card border border-white/10 shadow-2xl focus-within:border-indigo-500/50 transition-all duration-300">
            <Search className="absolute left-4.5 h-5 w-5 text-slate-500" />
            <input
              type="text"
              name="search"
              placeholder="Search colleges by name, location, or course..."
              className="w-full pl-12 pr-28 py-3 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-0 border-none"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-sm font-semibold text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1 */}
          <Link href="/colleges" className="glass-card glass-card-hover rounded-2xl p-6 text-left border border-white/5 flex flex-col justify-between group">
            <div>
              <div className="rounded-xl bg-indigo-500/10 p-3 w-fit text-indigo-400 border border-indigo-500/25 mb-4 group-hover:scale-105 transition-transform duration-300">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">College Discovery</h3>
              <p className="text-sm text-slate-400">
                Browse detailed profiles, compare courses, and analyze verified placement rates.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 mt-6">
              Start Searching
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/compare" className="glass-card glass-card-hover rounded-2xl p-6 text-left border border-white/5 flex flex-col justify-between group">
            <div>
              <div className="rounded-xl bg-purple-500/10 p-3 w-fit text-purple-400 border border-purple-500/25 mb-4 group-hover:scale-105 transition-transform duration-300">
                <GitCompare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Compare Colleges</h3>
              <p className="text-sm text-slate-400">
                Side-by-side matrices comparing fees, rating metrics, packages, and cutoffs.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-400 mt-6">
              Compare Now
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/predictor" className="glass-card glass-card-hover rounded-2xl p-6 text-left border border-white/5 flex flex-col justify-between group">
            <div>
              <div className="rounded-xl bg-pink-500/10 p-3 w-fit text-pink-400 border border-pink-500/25 mb-4 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Admission Predictor</h3>
              <p className="text-sm text-slate-400">
                Input your exam ranks to forecast your chances in top engineering departments.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-pink-400 mt-6">
              Predict Admission
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 2. Featured Colleges Block */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-indigo-400" />
              Featured Institutions
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top universities ranked by verified average placements and curriculum strength
            </p>
          </div>
          <Link
            href="/colleges"
            className="flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
          >
            Browse All Colleges
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Database configuration notice */}
        {isDemoFallback && (
          <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-400">
            <strong>Developer Note:</strong> Currently displaying demonstration data because the database is not initialized. Setup your <code>DATABASE_URL</code> in <code>.env</code> and run <code>npx prisma db push</code> then <code>npx prisma db seed</code> to view live database records.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredColleges.map((college: any) => (
            <div
              key={college.id}
              className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col group"
            >
              {/* Cover visual representation block */}
              <div className="h-40 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-xs font-semibold text-slate-400">
                    Est. {college.establishedYear}
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-amber-400 font-medium backdrop-blur-sm border border-white/10">
                    <Star className="h-3 w-3 fill-current" />
                    {college.rating || 'N/A'}
                  </div>
                </div>
                <div className="relative z-10">
                  <h4 className="text-lg font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {college.name.split(' (')[0]}
                  </h4>
                  <span className="flex items-center gap-1 text-xs text-slate-300 mt-1">
                    <MapPin className="h-3 w-3 text-indigo-400" />
                    {college.location}
                  </span>
                </div>
              </div>

              {/* Data specs */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Average Package
                    </span>
                    <p className="text-lg font-extrabold text-indigo-300 mt-0.5">
                      {college.averagePackage} LPA
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Annual Tuition
                    </span>
                    <p className="text-lg font-extrabold text-slate-200 mt-0.5">
                      ₹{(college.fees / 100000).toFixed(2)} Lakh
                    </p>
                  </div>
                </div>

                <Link
                  href={`/colleges/${college.id}`}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/60 py-2.5 text-center text-xs font-semibold text-slate-200 hover:bg-white/5 hover:border-white/20 transition-all"
                >
                  View Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
