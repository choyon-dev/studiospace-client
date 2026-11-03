'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { uploadToImgBB } from '@/lib/api';
import {
  Aperture,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Upload,
  Loader2,
} from 'lucide-react';
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

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Avatar file size must be under 10MB.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const hostedUrl = await uploadToImgBB(file);
      setPhotoURL(hostedUrl);
      toast.success('Avatar image uploaded successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload avatar image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid) {
      const err = 'Password must meet all 3 validation rules below.';
      setPasswordError(err);
      toast.error(err);
      return;
    }

    setSubmitting(true);
    const success = await registerWithEmail(name, email, password, photoURL);
    setSubmitting(false);

    if (success) {
      router.push('/login');
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    const success = await loginWithGoogle();
    setSubmitting(false);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-500 items-center justify-center mb-1">
            <Aperture className="size-7 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Join StudioSpace to list and discover verified creative production studios
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition-colors shadow-xs disabled:opacity-50"
        >
          <GoogleIcon />
          <span>Register with Google</span>
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400 font-medium">
              or register with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Sterling"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
              />
            </div>
          </div>

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
                placeholder="marcus@studiospace.io"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Avatar Photo / Photo URL
              </label>
              <span className="text-[11px] text-zinc-400">Optional</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2 leading-relaxed">
              Upload a profile image or paste a direct image URL. This avatar represents you as a creator across studio bookings, host communications, and verified reviews.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="Paste avatar URL or upload from device..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                  />
                </div>

                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors shrink-0">
                  {uploadingAvatar ? (
                    <Loader2 className="size-4 animate-spin text-amber-500" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  <span>{uploadingAvatar ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                </label>
              </div>

              {photoURL && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
                  <div className="relative size-10 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                    <Image
                      src={photoURL}
                      alt="Avatar preview"
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                      Avatar configured
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">{photoURL}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoURL('')}
                    className="text-xs text-red-500 hover:underline px-2 cursor-pointer font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 shadow-xs space-y-1.5">
              <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Password Security Rules:
              </p>
              <div className="flex items-center gap-2 text-xs">
                {hasUpperCase ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="size-3.5 text-zinc-400" />
                )}
                <span className={hasUpperCase ? 'text-emerald-500 font-medium' : 'text-zinc-500'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {hasLowerCase ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="size-3.5 text-zinc-400" />
                )}
                <span className={hasLowerCase ? 'text-emerald-500 font-medium' : 'text-zinc-500'}>
                  At least one lowercase letter (a-z)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {hasMinLength ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="size-3.5 text-zinc-400" />
                )}
                <span className={hasMinLength ? 'text-emerald-500 font-medium' : 'text-zinc-500'}>
                  Minimum length of 6 characters
                </span>
              </div>
            </div>

            {passwordError && (
              <p className="text-xs text-red-500 mt-2 font-medium">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Registering Account...' : 'Complete Registration'}</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-amber-600 dark:text-amber-400 hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
