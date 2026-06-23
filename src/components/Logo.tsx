'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export function LogoIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Navy/Blue Gradient to match the image, but optimized for Dark Mode visibility */}
        <linearGradient id="logoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" /> {/* Light Blue */}
          <stop offset="50%" stopColor="#3b82f6" /> {/* Electric Blue */}
          <stop offset="100%" stopColor="#1d4ed8" /> {/* Deep Blue */}
        </linearGradient>
        {/* Vibrant Orange Gradient for the Hindi character and accents */}
        <linearGradient id="logoOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffa040" /> {/* Light Orange */}
          <stop offset="100%" stopColor="#ff6200" /> {/* Vibrant Orange */}
        </linearGradient>
        {/* Drop shadow for mortarboard */}
        <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* 1. Graduation Cap (Navy Blue Gradient) */}
      <g filter="url(#logoShadow)">
        {/* Cap Skullcap Base */}
        <path
          d="M 30,27 L 30,31 C 30,39 70,39 70,31 L 70,27 Z"
          fill="url(#logoBlueGrad)"
        />
        {/* Cap Board (Diamond Shape) */}
        <path
          d="M 50,9 L 88,23 L 50,37 L 12,23 Z"
          fill="url(#logoBlueGrad)"
          stroke="#0f172a"
          strokeWidth="1"
        />
        {/* Tassel Button */}
        <circle cx="68" cy="27" r="2.5" fill="#facc15" />
        {/* Tassel String & Brush */}
        <path
          d="M 68,28 L 73,34 L 73,45"
          stroke="url(#logoBlueGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon
          points="71,45 75,45 77,53 69,53"
          fill="url(#logoBlueGrad)"
        />
      </g>

      {/* 2. Location Pin Shape - Outer Borders */}
      {/* Left side of the pin (Blue) */}
      <path
        d="M 50,36 C 31,36 19,51 19,65 C 19,79 50,95 50,95"
        stroke="url(#logoBlueGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right side of the pin (Orange) */}
      <path
        d="M 50,36 C 69,36 81,51 81,65 C 81,79 50,95 50,95"
        stroke="url(#logoOrangeGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* 3. Winding Road (Blue) */}
      <path
        d="M 50,95 C 44,83 43,76 49,67 C 53,60 51,55 47,52"
        stroke="url(#logoBlueGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Road Center Dashed Line */}
      <path
        d="M 50,95 C 44,83 43,76 49,67 C 53,60 51,55 47,52"
        stroke="#f8fafc"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3,3.5"
        fill="none"
      />

      {/* 4. Devanagari Letter "प" (Orange) */}
      {/* Horizontal Bar (Shirorekha) */}
      <path
        d="M 37,45 L 67,45"
        stroke="url(#logoOrangeGrad)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* Loop & Stem */}
      <path
        d="M 43,45 L 43,56 C 43,63 59,63 59,56 L 59,71"
        stroke="url(#logoOrangeGrad)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Logo({ size = 32, showText = true, className = '', variant = 'horizontal' }: LogoProps) {
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        <LogoIcon size={size * 1.8} />
        {showText && (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold tracking-tight text-white font-outfit">
              College<span className="text-orange-500">पथ</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-[1px] w-6 bg-orange-500/50" />
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                Your Path to the Right College
              </span>
              <div className="h-[1px] w-6 bg-orange-500/50" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={size} />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight text-white font-outfit">
            College<span className="text-orange-500">पथ</span>
          </span>
          <span className="text-[8px] tracking-wider text-slate-400 font-medium mt-0.5 uppercase">
            Your Path to the Right College
          </span>
        </div>
      )}
    </div>
  );
}
