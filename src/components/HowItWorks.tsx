'use client';

import React from 'react';
import { SlidersHorizontal, CalendarDays, ShieldCheck, Clapperboard } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Discover Spaces',
    desc: 'Filter by creative discipline, camera package compatibility, power requirements, and certified acoustic STC ratings.',
    icon: SlidersHorizontal,
  },
  {
    number: '02',
    title: 'Select Shoot Hours',
    desc: 'Inspect live calendar availability blocks with zero double-booking overlap and transparent deposit rates.',
    icon: CalendarDays,
  },
  {
    number: '03',
    title: 'Instant Booking Approval',
    desc: 'Secure checkout protected by HTTPOnly JWT session and automatic $1,000,000 comprehensive liability coverage.',
    icon: ShieldCheck,
  },
  {
    number: '04',
    title: 'Create & Produce',
    desc: 'Receive digital host arrival PIN codes, loading dock clearance, and dedicated on-site crew coordination.',
    icon: Clapperboard,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Production Pipeline
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            From scouting to wrap in four frictionless steps designed for fast-paced call sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-slate-200 via-amber-400/50 to-slate-200 dark:from-zinc-800 dark:via-amber-500/50 dark:to-zinc-800 z-0" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-slate-50 hover:bg-white dark:bg-zinc-900/60 dark:hover:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-amber-400/80 hover:shadow-lg transition-all duration-300 z-10 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                    {step.number}
                  </span>
                  <div className="size-10 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400">
                    <Icon className="size-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
