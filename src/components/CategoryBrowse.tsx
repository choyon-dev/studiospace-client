'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Film, Mic, Music, Palette, ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Photo Studios',
    slug: 'Photo Studio',
    count: '34 Spaces',
    icon: Camera,
    desc: 'Daylight lofts, seamless cyc walls & flash lighting grids',
  },
  {
    name: 'Film Stages',
    slug: 'Film Stage',
    count: '18 Stages',
    icon: Film,
    desc: 'Sound-dampened black boxes, green screens & Camlock power',
  },
  {
    name: 'Podcast Lounges',
    slug: 'Podcast Lounge',
    count: '26 Lounges',
    icon: Mic,
    desc: '4K multi-cam switchers, broadcast mics & acoustic foam',
  },
  {
    name: 'Music Suites',
    slug: 'Music Suite',
    count: '29 Suites',
    icon: Music,
    desc: 'Dolby Atmos monitoring, analog preamps & vocal isolation',
  },
  {
    name: 'Art Workshops',
    slug: 'Workshop',
    count: '15 Studios',
    icon: Palette,
    desc: 'Pottery wheels, digital kilns & heavy craft workbenches',
  },
];

export default function CategoryBrowse() {
  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-950 border-t border-b border-zinc-200/80 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500">
              Curated Production Environments
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
              Browse by Studio Category
            </h2>
          </div>
          <Link
            href="/studios"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-500 hover:text-amber-500 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/studios?category=${encodeURIComponent(cat.slug)}`}
                className="group relative flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-200 shadow-xs"
              >
                <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500 mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all duration-200">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-1 mb-2">
                  {cat.count}
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {cat.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
