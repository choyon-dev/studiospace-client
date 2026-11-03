'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Studio } from '@/types';
import StudioCard from './StudioCard';
import { fetchFeaturedStudios, fetchMyWishlist } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function FeaturedStudios() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    let isMounted = true;
    if (user) {
      fetchMyWishlist()
        .then((res) => {
          if (isMounted && res.ids) {
            setWishlistIds(new Set(res.ids));
          }
        })
        .catch(() => {});
    } else {
      setWishlistIds(new Set());
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleToggleFavorite = (studioId: string, isFavorited: boolean) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (isFavorited) next.add(studioId);
      else next.delete(studioId);
      return next;
    });
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Featured Spaces
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-xl">
            Curated, vetted, and production-ready environments with certified electrical & acoustic ratings.
          </p>
        </div>

        <Link
          href="/studios"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl text-slate-800 dark:text-zinc-200 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm hover:shadow shrink-0"
        >
          <span>View All 120+ Studios</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-zinc-900/60 p-4 space-y-4 animate-pulse shadow-sm"
            >
              <div className="aspect-[16/10] w-full rounded-xl bg-slate-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-zinc-800" />
              </div>
              <div className="pt-4 flex items-center justify-between">
                <div className="h-6 w-20 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {studios.map((studio) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              initialFavorited={wishlistIds.has(studio._id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}
