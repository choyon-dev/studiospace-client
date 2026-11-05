'use client';

import React from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  CalendarDays,
  ShieldCheck,
  Clapperboard,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  KeyRound,
  Truck,
  Clock,
  Tag,
} from 'lucide-react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-slate-50/60 dark:bg-zinc-950 py-20 sm:py-28 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 dark:bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold tracking-wider uppercase border border-amber-500/20">
            <Sparkles className="size-3.5" />
            <span>Call Sheet to Wrap</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            Production Pipeline
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            From scouting to wrap in four frictionless steps designed for fast-paced call sheets.
          </p>
        </div>

        {/* 4-Step Pipeline Grid with Connected Rail */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 relative">
          {/* Connecting Line for Large Screens */}
          <div className="hidden lg:block absolute top-28 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-amber-500/20 via-amber-500/40 to-amber-500/20 z-0 pointer-events-none" />

          {/* Step 01: Discover Spaces */}
          <div className="relative flex flex-col justify-between rounded-3xl bg-white dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800/80 hover:border-amber-500/40 dark:hover:border-amber-500/40 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 group z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 px-3 py-1 rounded-xl">
                  01 · SCOUT
                </span>
                <div className="size-11 rounded-2xl bg-amber-500/10 dark:bg-zinc-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="size-5" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Discover Spaces
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Filter by category, equipment, location, and hourly price.
                </p>
              </div>
            </div>

            {/* Micro-UI: Interactive Category Tags & Filter Mockup */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800/80 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <Tag className="size-3 text-amber-500" />
                <span>Smart Scopes</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  Photo Cyc
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  Cinema Stage
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/30">
                  STC 65 Sound
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-zinc-400 pt-1">
                <span>Hourly Rate Range</span>
                <span className="font-bold text-slate-900 dark:text-zinc-200 tabular-nums">$65 – $250/hr</span>
              </div>
            </div>
          </div>

          {/* Step 02: Select Shoot Hours */}
          <div className="relative flex flex-col justify-between rounded-3xl bg-white dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800/80 hover:border-amber-500/40 dark:hover:border-amber-500/40 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 group z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 px-3 py-1 rounded-xl">
                  02 · SCHEDULE
                </span>
                <div className="size-11 rounded-2xl bg-amber-500/10 dark:bg-zinc-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                  <CalendarDays className="size-5" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Select Shoot Hours
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Inspect live calendar availability blocks with zero double-booking overlap and transparent deposit rates.
                </p>
              </div>
            </div>

            {/* Micro-UI: Live Calendar Collision Guard Block */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3 text-emerald-500" />
                  <span>Call Slot</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/70 border border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-zinc-200">10:00 AM – 02:00 PM</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  4 Hours
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                <span>Zero Double-Booking Overlap Verified</span>
              </div>
            </div>
          </div>

          {/* Step 03: Book Instantly */}
          <div className="relative flex flex-col justify-between rounded-3xl bg-white dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800/80 hover:border-amber-500/40 dark:hover:border-amber-500/40 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 group z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 px-3 py-1 rounded-xl">
                  03 · LOCK IN
                </span>
                <div className="size-11 rounded-2xl bg-amber-500/10 dark:bg-zinc-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="size-5" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Book Instantly
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Secure checkout protected by HTTPOnly JWT session and automatic $1,000,000 comprehensive liability coverage.
                </p>
              </div>
            </div>

            {/* Micro-UI: Security Lock & $1M Insurance Policy Stamp */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Lock className="size-3 text-amber-500" />
                  <span>Encrypted Token</span>
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  256-Bit SSL
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/25 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 font-bold">
                    Host Liability Active
                  </p>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-zinc-100 tabular-nums">
                    $1,000,000 Policy
                  </p>
                </div>
                <ShieldCheck className="size-5 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Step 04: Create & Produce */}
          <div className="relative flex flex-col justify-between rounded-3xl bg-white dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800/80 hover:border-amber-500/40 dark:hover:border-amber-500/40 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 group z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 px-3 py-1 rounded-xl">
                  04 · WRAP
                </span>
                <div className="size-11 rounded-2xl bg-amber-500/10 dark:bg-zinc-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                  <Clapperboard className="size-5" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Create &amp; Produce
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Receive digital host arrival PIN codes, loading dock clearance, and dedicated on-site crew coordination.
                </p>
              </div>
            </div>

            {/* Micro-UI: Digital Studio Access Pass Mockup */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="size-3 text-amber-500" />
                  <span>Call Pass</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Verified PIN
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 text-white dark:bg-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Stage Entry</p>
                  <p className="text-sm font-mono font-bold tracking-widest text-amber-400">PIN: 8492</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 justify-end">
                    <Truck className="size-3 text-amber-400" />
                    <span>Bay 3</span>
                  </p>
                  <p className="text-[10px] text-emerald-400 font-semibold">Cleared</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-14 sm:mt-16 flex items-center justify-center">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-98 transition-all shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 cursor-pointer"
          >
            <span>Explore All Production Spaces</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
