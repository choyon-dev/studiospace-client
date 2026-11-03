'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import StudioCard from '@/components/StudioCard';
import { Studio } from '@/types';
import { fetchMyWishlist } from '@/lib/api';
import { Heart, Building2, Sparkles, ArrowRight } from 'lucide-react';

export default function SavedStudiosPage() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadSavedSpaces() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetchMyWishlist();
        if (isMounted) {
          setStudios(res.data || []);
          setWishlistIds(new Set(res.ids || []));
        }
      } catch (err) {
        console.error('Failed to load saved studios:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSavedSpaces();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleToggleFavorite = (studioId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      setStudios((prev) => prev.filter((s) => s._id !== studioId));
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(studioId);
        return next;
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-200/70 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Saved Studios
              </h1>
              {!loading && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 tabular-nums">
                  {studios.length} {studios.length === 1 ? 'Space' : 'Spaces'}
                </span>
              )}
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1 max-w-2xl">
              Curated collection of your bookmarked daylight stages, soundproof studios, and creative facilities.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20 shrink-0 self-start sm:self-auto"
          >
            <Building2 className="size-4" />
            <span>Explore More Studios</span>
          </Link>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
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
        ) : studios.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="size-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
              <Heart className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              You haven&apos;t saved any spaces yet
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm leading-relaxed">
              Click the heart icon on any creative studio to bookmark your preferred stages, podcast lounges, and production spaces.
            </p>
            <Link
              href="/studios"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-xs"
            >
              <Sparkles className="size-4" />
              <span>Browse Studio Catalog</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </ProtectedRoute>
  );
}

