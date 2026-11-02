'use client';

import React from 'react';
import { ShieldCheck, BadgeCheck, CheckCircle2, Headphones } from 'lucide-react';

const guarantees = [
  {
    title: '$1,000,000 Host Liability',
    desc: 'Automatic comprehensive property and equipment damage coverage on every verified reservation booking.',
    icon: ShieldCheck,
    color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  {
    title: '100% Identity Verification',
    desc: 'In-person site inspections and biometric creator identity verification protocols before production clearance.',
    icon: BadgeCheck,
    color: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  },
  {
    title: 'Acoustic & Camlock Compliance',
    desc: 'Certified STC soundproofing dampening ratings and commercial 3-phase 200A/400A camlock power inspections.',
    icon: CheckCircle2,
    color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  },
  {
    title: '24/7 Producer Support Hotline',
    desc: 'Dedicated production coordinators on standby for load-in assistance, overtime adjustments, and contingencies.',
    icon: Headphones,
    color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  },
];

export default function HostGuarantee() {
  return (
    <section id="about-us" className="w-full bg-white dark:bg-zinc-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Built for Professional Production Demands
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Host guarantee and verified creator protections standard on every call sheet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-slate-50/70 hover:bg-white dark:bg-zinc-900/60 dark:hover:bg-zinc-900 rounded-2xl p-6 space-y-4 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <div className={`size-12 rounded-xl flex items-center justify-center ${item.color}`}>
                  <Icon className="size-6 stroke-[2]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
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
