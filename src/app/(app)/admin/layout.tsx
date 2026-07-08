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
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
          <span className="text-sm">Loading admin portal…</span>
        </div>
      </div>
    );
  }

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-sm">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Admin Sign In</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter your credentials to access the administration portal.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Error banner */}
              {error && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    required
                    className="pl-9 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                    className="pl-9 pr-10 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 rounded-lg transition-colors disabled:opacity-60"
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

          <p className="mt-5 text-center text-xs text-slate-400">
            SeatFlow Administration · Restricted Access
          </p>
        </div>
      </div>
    );
  }

  // ── ADMIN SUB-LAYOUT (authenticated) ──────────────────────────────────────
  return (
    <div className="space-y-8 py-4 flex-1 flex flex-col">
      {/* Admin header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600" />
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">SeatFlow Administration</h1>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Secure admin review panel to approve, reject, or filter meeting room bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50 py-1.5 px-3 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Authorized
          </Badge>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-slate-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex border-b border-slate-200">
        <Link
          href="/admin"
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors flex items-center gap-1.5 ${
            pathname === '/admin'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <List className="h-4 w-4" /> All Bookings
        </Link>
        <Link
          href="/admin/pending"
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors flex items-center gap-1.5 ${
            pathname === '/admin/pending'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
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
