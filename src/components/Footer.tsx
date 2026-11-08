'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Aperture, Send, Check } from 'lucide-react';
import { toast } from 'sonner';

function XLogo({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubLogo({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function InstagramLogo({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeLogo({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to StudioSpace dispatch!');
    setEmail('');
  };

  const categories = [
    { name: 'Photo Studios', href: '/studios?category=Photo%20Studio' },
    { name: 'Film Stages', href: '/studios?category=Film%20Stage' },
    { name: 'Podcast Lounges', href: '/studios?category=Podcast%20Lounge' },
    { name: 'Music Suites', href: '/studios?category=Music%20Suite' },
    { name: 'Art Workshops', href: '/studios?category=Workshop' },
  ];

  const quickLinks = [
    { name: 'Browse All Studios', href: '/studios' },
    { name: 'How Booking Works', href: '/#how-it-works' },
    { name: 'Host Guarantee', href: '/#about-us' },
    { name: 'Add Your Space', href: '/add-studio' },
    { name: 'System Status', href: '/health' },
    { name: 'Creator Guidelines', href: '/#about-us' },
  ];

  return (
    <footer className="bg-zinc-100/60 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="size-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20">
                <Aperture className="size-6 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Studio<span className="text-amber-500">Space</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-zinc-600 dark:text-zinc-400">
              The premier peer-to-peer workspace marketplace empowering filmmakers, photographers,
              audio engineers, and digital creators to access world-class production facilities on demand.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="size-9 rounded-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-colors bg-white dark:bg-zinc-900 shadow-xs"
              >
                <XLogo className="size-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="size-9 rounded-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-colors bg-white dark:bg-zinc-900 shadow-xs"
              >
                <GithubLogo className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="size-9 rounded-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-colors bg-white dark:bg-zinc-900 shadow-xs"
              >
                <InstagramLogo className="size-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="size-9 rounded-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-colors bg-white dark:bg-zinc-900 shadow-xs"
              >
                <YoutubeLogo className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="hover:text-amber-500 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-amber-500 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">
              Stay Inspired
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              Subscribe for exclusive studio openings, spotlight creator discounts, and gear updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@studiospace.io"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-xs shadow-amber-500/20"
              >
                {subscribed ? (
                  <>
                    <Check className="size-3.5" /> Subscribed
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" /> Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 StudioSpace Inc. All rights reserved. Built for creators worldwide.</p>
          <div className="flex items-center gap-6">
            <Link href="/health" className="inline-flex items-center gap-1.5 hover:text-amber-500 transition-colors">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Status</span>
            </Link>
            <Link href="/#about-us" className="hover:text-amber-500 transition-colors">Privacy Policy</Link>
            <Link href="/#about-us" className="hover:text-amber-500 transition-colors">Terms of Service</Link>
            <Link href="/#about-us" className="hover:text-amber-500 transition-colors">Safety Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
