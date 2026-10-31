'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Wrench, Headphones } from 'lucide-react';

const guarantees = [
  {
    title: '$1,000,000 Host Liability Protection',
    desc: 'Every verified booking includes comprehensive third-party property damage coverage and equipment protection against accidental operational harm.',
    icon: ShieldCheck,
  },
  {
    title: '100% Identity & Studio Verification',
    desc: 'Every studio host and booking creator completes biometric verification and soundcheck review prior to their first session approval.',
    icon: UserCheck,
  },
  {
    title: 'Certified Production Gear Quality',
    desc: 'Studio lighting rigs, audio consoles, and camera packages are routinely audited to guarantee full working calibration on shoot days.',
    icon: Wrench,
  },
  {
    title: '24/7 Real-Time Creator Concierge',
    desc: 'Our dedicated production operations team assists with load-in logistics, electrical requests, overtime adjustments, and emergency rescheduling.',
    icon: Headphones,
  },
];

export default function HostGuarantee() {
  return (
    <section id="about-us" className="py-24 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Host Guarantee & Creator Protection
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-sm sm:text-base leading-relaxed">
            We hold both creators and studio hosts to rigorous industry production benchmarks.
            Your session is backed by ironclad platform safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-5 p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow"
              >
                <div className="size-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center shrink-0">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
