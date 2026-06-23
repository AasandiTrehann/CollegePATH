'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Logo from './Logo';
import { 
  Search, 
  GitCompare, 
  Sparkles, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Discover', href: '/colleges', icon: Search },
    { name: 'Compare', href: '/compare', icon: GitCompare },
    { name: 'Predictor', href: '/predictor', icon: Sparkles },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Logo size={36} className="group-hover:scale-[1.02] transition-transform duration-200" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-indigo-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User & Session CTA Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                    isActive('/dashboard')
                      ? 'text-indigo-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-300 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/30 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-950/95 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          
          <div className="border-t border-white/5 my-2 pt-2" />

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-base font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
                <span className="text-sm text-slate-400">Signed in as:</span>
                <span className="text-sm font-semibold text-indigo-400 truncate max-w-[150px]">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/10 bg-rose-500/10 py-2.5 text-base font-medium text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl border border-white/10 bg-slate-900 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
