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
      {/* Centered Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          Featured Spaces
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-2.5 max-w-xl mx-auto leading-relaxed">
          Curated, vetted, and production-ready environments with certified electrical & acoustic ratings.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/80 overflow-hidden animate-pulse shadow-xs"
            >
              <div className="aspect-[16/10] w-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="h-5 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
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

      {/* Prominent Full Archive CTA Button */}
      <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center text-center">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-bold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
        >
          <span>View Full Studio Archive</span>
          <ArrowRight className="size-4" />
        </Link>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 font-mono">
          Browse verified daylight stages, soundproof suites, and production lofts
        </p>
      </div>
    </section>
  );
}
