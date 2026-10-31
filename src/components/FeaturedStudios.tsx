'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Studio } from '@/types';
import StudioCard from './StudioCard';
import { fetchFeaturedStudios } from '@/lib/api';
import { ArrowRight } from 'lucide-react';

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await fetchFeaturedStudios();
        if (isMounted) {
          setStudios(data.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching featured studios', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Featured Spaces
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
            Handpicked production stages, daylight lofts, and sound suites with verified high reviews and pro equipment.
          </p>
        </div>

        <Link
          href="/studios"
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 group"
        >
          <span>View All 120+ Studios</span>
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[16/10] w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="h-6 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-8 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </section>
  );
}
