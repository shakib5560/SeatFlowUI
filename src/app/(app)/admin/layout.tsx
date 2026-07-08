'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, LogOut, CheckCircle, List, Clock, Eye, EyeOff, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '224466';
const SESSION_KEY = 'seatflow_admin_session';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const session = localStorage.getItem(SESSION_KEY);
    if (session === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, 'true');
      setIsLoggedIn(true);
      toast.success('Welcome back, Administrator');
    } else {
      setError('Invalid username or password. Please try again.');
      toast.error('Login failed');
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    toast.info('Signed out of admin session');
  };

  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-[#A1A1AA]">
          <div className="h-8 w-8 rounded-full border-2 border-white/[0.08] border-t-[#7C3AED] animate-spin" />
          <span className="text-sm">Loading admin portal…</span>
        </div>
      </div>
    );
  }

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4 text-[#FAFAFA]">
        <div className="w-full max-w-sm">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20 animate-pulse">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#FAFAFA]">Admin Sign In</h1>
            <p className="mt-1.5 text-sm text-[#A1A1AA]">
              Enter your credentials to access the administration portal.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-2xl shadow-md p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Error banner */}
              {error && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-400 flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium text-[#A1A1AA]">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/[0.3] pointer-events-none" />
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    required
                    className="pl-9 bg-[#18181B] border-white/[0.08] text-[#FAFAFA] focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-[#A1A1AA]">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/[0.3] pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                    className="pl-9 pr-10 bg-[#18181B] border-white/[0.08] text-[#FAFAFA] focus:border-[#7C3AED]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/[0.3] hover:text-[#FAFAFA] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-semibold h-10 rounded-lg transition-colors disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-xs text-[#A1A1AA]/50">
            SeatFlow Administration · Restricted Access
          </p>
        </div>
      </div>
    );
  }

  // ── ADMIN SUB-LAYOUT (authenticated) ──────────────────────────────────────
  return (
    <div className="space-y-8 py-6 flex-1 flex flex-col text-[#FAFAFA]">
      {/* Admin header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/[0.08] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#7C3AED]" />
            <h1 className="text-3xl font-extrabold tracking-tight text-[#FAFAFA]">SeatFlow Administration</h1>
          </div>
          <p className="mt-2 text-sm text-[#A1A1AA]">
            Secure admin review panel to approve, reject, or filter meeting room bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-[#22C55E] border-emerald-500/20 hover:bg-emerald-500/10 py-1.5 px-3 flex items-center gap-1.5 border">
            <CheckCircle className="h-3.5 w-3.5 text-[#22C55E]" /> Authorized
          </Badge>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-white/[0.08] bg-[#18181B] text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex border-b border-white/[0.08]">
        <Link
          href="/admin"
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors flex items-center gap-1.5 ${
            pathname === '/admin'
              ? 'border-[#7C3AED] text-[#7C3AED]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]'
          }`}
        >
          <List className="h-4 w-4" /> All Bookings
        </Link>
        <Link
          href="/admin/pending"
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors flex items-center gap-1.5 ${
            pathname === '/admin/pending'
              ? 'border-[#7C3AED] text-[#7C3AED]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]'
          }`}
        >
          <Clock className="h-4 w-4" /> Pending Reviews
        </Link>
      </div>

      {/* Page content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
