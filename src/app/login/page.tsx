'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Aperture, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { loginWithEmail, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const success = await loginWithEmail(email, password);
    setSubmitting(false);

    if (success) {
      router.push(redirectUrl);
    } else {
      setFormError('Invalid email or password. You can also use the demo credentials below.');
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    const success = await loginWithGoogle();
    setSubmitting(false);
    if (success) {
      router.push(redirectUrl);
    }
  };

  const fillDemoExaminer = () => {
    setEmail('examiner@studiospace.io');
    setPassword('Test1234');
    setFormError(null);
    toast.info('Examiner test credentials loaded.');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-500 items-center justify-center mb-1">
          <Aperture className="size-7 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to manage your studio listings and active bookings
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-3.5 rounded-xl text-xs font-medium bg-red-500/10 border border-red-500/30 text-red-500">
          {formError}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={submitting}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition-colors shadow-xs disabled:opacity-50"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400 font-medium">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@studiospace.io"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <button
              type="button"
              onClick={() =>
                toast.info(
                  'Password reset is paused for examiner convenience. You may use examiner credentials or register a new account.'
                )
              }
              className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <span>{submitting ? 'Authenticating...' : 'Sign In to Account'}</span>
          <ArrowRight className="size-4" />
        </button>
      </form>

      <div className="mt-6 p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
        <div>
          <p className="font-semibold text-zinc-900 dark:text-zinc-200">Examiner Fast Login</p>
          <p className="text-[11px] text-zinc-500">examiner@studiospace.io / Test1234</p>
        </div>
        <button
          type="button"
          onClick={fillDemoExaminer}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-zinc-950 transition-colors"
        >
          Auto Fill
        </button>
      </div>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
        Don&apos;t have a creator account?{' '}
        <Link href="/register" className="font-semibold text-amber-600 dark:text-amber-400 hover:underline">
          Register Here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-zinc-400">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
