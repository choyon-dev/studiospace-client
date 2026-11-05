'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, ArrowRight } from 'lucide-react';

export default function HostMonetizationBanner() {
  return (
    <section className="w-full bg-slate-50/50 dark:bg-zinc-950 py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-700 to-zinc-900 p-8 sm:p-12 lg:p-14 text-white shadow-2xl">
          <div className="absolute -right-20 -top-20 size-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-20 size-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Monetize idle studio hours with certified productions.
              </h2>
              <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed max-w-xl">
                Connect directly with verified commercial crews and agency producers. Retain total calendar control backed by automatic liability coverage.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="/add-studio"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-zinc-950 hover:bg-amber-100 active:scale-95 transition-all shadow-lg shadow-black/20"
                >
                  <PlusCircle className="size-4 text-amber-600" />
                  <span>List Your Studio</span>
                </Link>
                <Link
                  href="/studios"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-black/20 hover:bg-black/30 border border-white/20 text-white backdrop-blur-md active:scale-95 transition-all"
                >
                  <span>Browse Inventory</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-[3/2] lg:scale-110 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                <Image
                  src="/Isometric%20Photography%20Studio%20Diorama.png"
                  alt="Isometric 3D Photography Studio Diorama"
                  fill
                  priority
                  unoptimized
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
