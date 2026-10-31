'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Film, Mic, Music, Palette, ArrowRight, ArrowUpRight } from 'lucide-react';

const categories = [
  {
    name: 'Photo Studios',
    slug: 'Photo Studio',
    count: '34 SPACES',
    icon: Camera,
    desc: 'Daylight lofts, seamless cyc walls, grip packages included.',
  },
  {
    name: 'Film Stages',
    slug: 'Film Stage',
    count: '18 STAGES',
    icon: Film,
    desc: 'Black boxes, Camlock 400A power, soundproof acoustic ratings.',
  },
  {
    name: 'Podcast Lounges',
    slug: 'Podcast Lounge',
    count: '26 SUITES',
    icon: Mic,
    desc: '4K multi-cam switchers, broadcast mics, acoustic diffusers.',
  },
  {
    name: 'Music Suites',
    slug: 'Music Suite',
    count: '14 SUITES',
    icon: Music,
    desc: 'Dolby Atmos monitoring, vocal isolation booths, outboard gear.',
  },
  {
    name: 'Artisan Workshops',
    slug: 'Workshop',
    count: '12 SPACES',
    icon: Palette,
    desc: 'Ceramics kilns, woodworking benches, industrial ventilation.',
  },
];

export default function CategoryBrowse() {
  return (
    <section className="w-full bg-white dark:bg-zinc-950 border-y border-slate-200 dark:border-zinc-800 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Browse by Studio Category
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Select an architectural discipline to inspect calibrated sound ratings, lighting packages, and space dimensions.
            </p>
          </div>
          <Link
            href="/studios"
            className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:text-amber-600 flex items-center gap-1.5 group transition-colors shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/studios?category=${encodeURIComponent(cat.slug)}`}
                className="group relative bg-slate-50 hover:bg-white dark:bg-zinc-900/60 dark:hover:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/80 dark:hover:border-amber-500/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-60 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                    <Icon className="size-5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-zinc-400 px-2 py-1 rounded-md bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                    {cat.count}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="flex items-center text-slate-500 dark:text-zinc-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors pt-2 border-t border-slate-200/60 dark:border-zinc-800/80">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">
                    Explore Roster
                  </span>
                  <ArrowUpRight className="size-4 ml-auto group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
