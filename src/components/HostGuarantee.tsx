'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  BadgeCheck,
  CheckCircle2,
  Headphones,
  Zap,
  Volume2,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

export default function HostGuarantee() {
  return (
    <section id="about-us" className="w-full bg-white dark:bg-zinc-950 py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-1/3 -right-32 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-32 w-[500px] h-[400px] bg-sky-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold tracking-wider uppercase border border-amber-500/20">
            <Shield className="size-3.5" />
            <span>Industrial Trust Standards</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            Built for Professional Production Demands
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Host guarantee and verified creator protections standard on every call sheet.
          </p>
        </div>

        {/* Asymmetric Bento Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 (HERO ANCHOR): $1,000,000 Host Liability (Col Span 2 on Desktop) */}
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-zinc-900/90 dark:to-zinc-900/50 border border-amber-500/25 dark:border-amber-500/20 p-7 sm:p-9 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
            <div className="absolute -right-12 -top-12 size-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-xl">
                  GUARANTEE POLICY #SS-100M
                </span>
                <div className="size-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="size-6 stroke-[2.2]" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                  $1,000,000 Host Liability
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 max-w-xl leading-relaxed">
                  Automatic comprehensive property and equipment damage coverage on every verified reservation booking.
                </p>
              </div>
            </div>

            {/* Insurance Coverage Breakdown Tiers */}
            <div className="mt-8 pt-6 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800/80 space-y-1">
                <p className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Property & Set</p>
                <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100">$1,000,000</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Automatic Policy</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800/80 space-y-1">
                <p className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Gear & Lighting</p>
                <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100">Full Replacement</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Verified Equipment</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800/80 space-y-1">
                <p className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Host Deductible</p>
                <p className="text-base font-extrabold text-slate-900 dark:text-zinc-100">$0 Deductible</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Zero Out-of-Pocket</p>
              </div>
            </div>
          </div>

          {/* Card 2: 100% Identity Verification */}
          <div className="rounded-3xl bg-slate-50/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800/80 p-7 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-xl">
                  IDENTITY SECURE
                </span>
                <div className="size-11 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BadgeCheck className="size-6 stroke-[2]" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                  100% Identity Verification
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  In-person site inspections and biometric creator identity verification protocols before production clearance.
                </p>
              </div>
            </div>

            {/* Micro-UI: Verification Checklist */}
            <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white dark:bg-zinc-800/70">
                <span className="font-medium text-slate-800 dark:text-zinc-200">Biometric Identity Check</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Cleared
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white dark:bg-zinc-800/70">
                <span className="font-medium text-slate-800 dark:text-zinc-200">Facility On-Site Audit</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Certified
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Acoustic & Camlock Compliance */}
          <div className="rounded-3xl bg-slate-50/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800/80 p-7 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
                  ENGINEERING COMPLIANT
                </span>
                <div className="size-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="size-6 stroke-[2]" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                  Acoustic &amp; Camlock Compliance
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Certified STC soundproofing dampening ratings and commercial 3-phase 200A/400A camlock power inspections.
                </p>
              </div>
            </div>

            {/* Micro-UI: Technical Metric Meters */}
            <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white dark:bg-zinc-800/70">
                <div className="flex items-center gap-2">
                  <Volume2 className="size-4 text-emerald-500 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-zinc-200">Acoustic Isolation</span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  STC 65 Certified
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white dark:bg-zinc-800/70">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-amber-500 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-zinc-200">Power Distribution</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  3-Phase 200A Camlock
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: 24/7 Producer Support Hotline (Col Span 2 on Desktop) */}
          <div className="lg:col-span-2 rounded-3xl bg-slate-50/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800/80 p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-xl">
                  LIVE DISPATCH AVAILABLE
                </span>
                <div className="size-11 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Headphones className="size-6 stroke-[2]" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="max-w-md">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100">
                    24/7 Producer Support Hotline
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    Dedicated production coordinators on standby for load-in assistance, overtime adjustments, and contingencies.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-slate-200/60 dark:border-zinc-700/60 shrink-0 space-y-1 sm:text-right">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Average SLA</span>
                  <p className="text-lg font-mono font-extrabold text-indigo-600 dark:text-indigo-400">&lt; 180s Response</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center sm:justify-end gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Dispatchers Active
                  </p>
                </div>
              </div>
            </div>

            {/* Support Capabilities Strip */}
            <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-zinc-800/80 flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/50">
                Load-In Clearance
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/50">
                Overtime Hour Extension
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/50">
                Emergency Gear Couriers
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/50">
                Direct Host Escalation
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Production Trust Strip */}
        <div className="mt-14 sm:mt-16 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60 flex flex-wrap items-center justify-around gap-4 text-xs font-medium text-slate-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-amber-500 shrink-0" />
            <span>Zero Hidden Cleaning Surcharges</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-amber-500 shrink-0" />
            <span>Verified Stage Floorplans</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-amber-500 shrink-0" />
            <span>Automated Digital Call Sheet PDF</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-amber-500 shrink-0" />
            <span>24-Hour Reschedule Protection</span>
          </div>
        </div>
      </div>
    </section>
  );
}
