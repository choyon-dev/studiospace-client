'use client';

import React from 'react';
import { Search, Calendar, ShieldCheck, Video } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Discover Spaces',
    desc: 'Filter by specialized discipline, equipment list, capacity, and verified host reviews across major creative hubs.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Select Shoot Hours',
    desc: 'Inspect real-time calendar availability slots. Reserve hourly or full-day shoot blocks with instant overlap validation.',
    icon: Calendar,
  },
  {
    number: '03',
    title: 'Book Instantly',
    desc: 'Lock in your production booking with transparent pricing, zero hidden facility fees, and secure JWT verification.',
    icon: ShieldCheck,
  },
  {
    number: '04',
    title: 'Create & Produce',
    desc: 'Check in seamlessly, access professional gear packages, and execute commercial productions with peace of mind.',
    icon: Video,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500">
            Frictionless Booking
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
            How StudioSpace Works
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-sm sm:text-base leading-relaxed">
            From discovering acoustically tuned rooms to wrapping multi-camera commercial shoots,
            our four-step booking pipeline is built for professional workflow speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-amber-500/40 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-500/80">
                    {step.number}
                  </span>
                  <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center">
                    <Icon className="size-5" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
