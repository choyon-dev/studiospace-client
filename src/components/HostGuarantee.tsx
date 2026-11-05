'use client';

import React from 'react';
import {
  ShieldCheck,
  BadgeCheck,
  CheckCircle2,
  Headphones,
} from 'lucide-react';

const guarantees = [
  {
    title: '$1,000,000 Host Liability',
    desc: 'Automatic comprehensive property and equipment damage coverage on every verified reservation booking.',
    icon: ShieldCheck,
  },
  {
    title: '100% Identity Verification',
    desc: 'In-person site inspections and biometric creator identity verification protocols before production clearance.',
    icon: BadgeCheck,
  },
  {
    title: 'Acoustic & Camlock Compliance',
    desc: 'Certified STC soundproofing dampening ratings and commercial 3-phase 200A/400A camlock power inspections.',
    icon: CheckCircle2,
  },
  {
    title: '24/7 Producer Support Hotline',
    desc: 'Dedicated production coordinators on standby for load-in assistance, overtime adjustments, and contingencies.',
    icon: Headphones,
  },
];

export default function HostGuarantee() {
  return (
    <section id="about-us" className="w-full bg-white dark:bg-zinc-950 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Built for Professional Production Demands
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-2.5 max-w-xl mx-auto leading-relaxed">
            Host guarantee and verified creator protections standard on every call sheet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between rounded-2xl bg-slate-50/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-amber-500/40 dark:hover:border-amber-500/40 p-6 shadow-xs hover:shadow-md transition-all duration-200 space-y-4"
              >
                <div className="size-11 rounded-xl bg-amber-500/10 dark:bg-zinc-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                  <Icon className="size-5.5" />
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
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
