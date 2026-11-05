'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Studio } from '@/types';
import StudioCard from './StudioCard';
import StudioCardSkeleton from './StudioCardSkeleton';
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
            <StudioCardSkeleton key={idx} />
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

      <div className="mt-12 sm:mt-16 flex items-center justify-center">
        <Link
          href="/studios"
          prefetch={true}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-zinc-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer"
        >
          <span>View Full Studio Archive</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
