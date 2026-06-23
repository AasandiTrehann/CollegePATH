import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Sparkles, AlertCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface PredictorResultCardProps {
  result: {
    college: {
      id: string;
      name: string;
      location: string;
      rating: number;
      averagePackage: number;
    };
    course: {
      id: string;
      name: string;
      duration: string;
      fees: number;
    };
    cutoff: {
      round: number;
      category: string;
      minRank: number;
      maxRank: number;
    };
    matchConfidence: 'High' | 'Medium' | 'Unlikely';
  };
}

export default function PredictorResultCard({ result }: PredictorResultCardProps) {
  const { college, course, cutoff, matchConfidence } = result;

  const confidenceConfig = {
    High: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      text: 'High Chance',
      desc: 'Your rank is comfortably within last year\'s closing cutoff.',
      icon: ShieldCheck,
    },
    Medium: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      text: 'Medium Chance',
      desc: 'Your rank is close to the cutoff margin. Highly competitive.',
      icon: HelpCircle,
    },
    Unlikely: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      text: 'Borderline Chance',
      desc: 'Your rank slightly exceeds the cutoff. Spot round admission only.',
      icon: AlertCircle,
    },
  };

  const config = confidenceConfig[matchConfidence];
  const Icon = config.icon;

  return (
    <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between hover:border-white/10 transition-all duration-200">
      
      {/* 1. College Header */}
      <div className="border-b border-white/5 pb-4 mb-4 text-left">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-md line-clamp-1 hover:text-indigo-300 transition-colors">
              <Link href={`/colleges/${college.id}`}>
                {college.name}
              </Link>
            </h3>
            <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
              <MapPin className="h-3 w-3 text-indigo-400 shrink-0" />
              {college.location}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-amber-400 shrink-0">
            <Star className="h-3.5 w-3.5 fill-current" />
            {college.rating > 0 ? college.rating.toFixed(1) : 'N/A'}
          </div>
        </div>
      </div>

      {/* 2. Course Details & Cutoff */}
      <div className="space-y-4 text-left">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Predicted Admission Course</span>
          <h4 className="text-sm font-extrabold text-white mt-0.5">{course.name}</h4>
          <span className="text-[10px] text-slate-400 block mt-0.5">Duration: {course.duration}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-white/5 border border-white/5 p-3 rounded-xl">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Historic Cutoff</span>
            <p className="text-xs font-bold text-slate-200 mt-0.5">
              {cutoff.minRank.toLocaleString()} - {cutoff.maxRank.toLocaleString()}
            </p>
            <span className="text-[8px] text-slate-500 block">Opening - Closing</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Tuition / Year</span>
            <p className="text-xs font-bold text-slate-200 mt-0.5">
              ₹{(course.fees / 100000).toFixed(2)}L
            </p>
            <span className="text-[8px] text-slate-500 block">Annual Fee</span>
          </div>
        </div>

        {/* Dynamic Placement highlight */}
        {college.averagePackage > 0 && (
          <div className="flex items-center justify-between text-xs border-t border-white/5 pt-3">
            <span className="text-slate-500">Average Placement (2023)</span>
            <span className="font-bold text-indigo-300">{college.averagePackage} LPA</span>
          </div>
        )}
      </div>

      {/* 3. Match Confidence Badge and Description */}
      <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
        <div className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 w-full text-xs font-bold ${config.bg}`}>
          <Icon className="h-4 w-4 shrink-0" />
          {config.text}
        </div>
        <p className="text-[10px] text-slate-400 text-left leading-relaxed">
          {config.desc}
        </p>

        <Link
          href={`/colleges/${college.id}`}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/60 py-2.5 text-center text-xs font-semibold text-slate-200 hover:bg-white/5 hover:border-white/20 transition-all mt-2"
        >
          Explore Department
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
