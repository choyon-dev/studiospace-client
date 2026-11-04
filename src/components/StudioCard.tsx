'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Studio } from '@/types';
import { Star, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getStudioUrl } from '@/lib/slug';
import { useAuth } from '@/context/AuthContext';
import { toggleWishlist } from '@/lib/api';
import { toast } from 'sonner';

interface StudioCardProps {
  studio: Studio;
  initialFavorited?: boolean;
  onToggleFavorite?: (studioId: string, isFavorited: boolean) => void;
}

export default function StudioCard({
  studio,
  initialFavorited = false,
  onToggleFavorite,
}: StudioCardProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState<boolean>(initialFavorited);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to save studios to your wishlist');
      return;
    }

    if (isToggling) return;

    const previousState = isFavorited;
    const nextState = !previousState;
    setIsFavorited(nextState);
    setIsToggling(true);

    try {
      const res = await toggleWishlist(studio._id);
      setIsFavorited(res.isFavorited);
      if (res.isFavorited) {
        toast.success('Studio saved to your wishlist');
      } else {
        toast.info('Studio removed from your wishlist');
      }
      if (onToggleFavorite) {
        onToggleFavorite(studio._id, res.isFavorited);
      }
    } catch (err: any) {
      setIsFavorited(previousState);
      toast.error(err.message || 'Failed to update wishlist');
    } finally {
      setIsToggling(false);
    }
  };

  const studioUrl = getStudioUrl(studio);

  const locationDisplay = studio.city
    ? studio.state
      ? `${studio.city}, ${studio.state}`
      : studio.city
    : (studio.location || 'Studio Location').split(',')[0].trim();

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-amber-500/40 dark:hover:border-amber-500/40 overflow-hidden shadow-xs hover:shadow-md transition-colors duration-200">
      {/* Studio Photo Container */}
      <Link
        href={studioUrl}
        className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 block"
      >
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent pointer-events-none" />

        {/* Minimal Floating Heart Button */}
        <button
          type="button"
          aria-label={isFavorited ? 'Remove from saved studios' : 'Save studio to wishlist'}
          onClick={handleFavoriteClick}
          disabled={isToggling}
          className="absolute top-3 right-3 size-9 rounded-full bg-white/85 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-red-500 active:scale-90 transition-all shadow-sm z-10 cursor-pointer"
        >
          <Heart
            className={`size-4 transition-colors ${
              isFavorited
                ? 'fill-red-500 text-red-500'
                : 'text-zinc-700 dark:text-zinc-200 hover:text-red-500'
            }`}
          />
        </button>
      </Link>

      {/* Editorial Content Block */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between gap-3">
        {/* Row 1: Location & Star Rating */}
        <div className="flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-medium truncate">
            <MapPin className="size-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{locationDisplay}</span>
          </div>

          <div className="inline-flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums shrink-0">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {studio.reviewCount > 0 ? (
              <>
                <span>{studio.rating.toFixed(1)}</span>
                <span className="text-zinc-400 font-normal">({studio.reviewCount})</span>
              </>
            ) : (
              <span className="text-zinc-400 font-normal">New</span>
            )}
          </div>
        </div>

        {/* Row 2: Studio Title with Full 2-Line Visibility */}
        <Link
          href={studioUrl}
          className="block"
        >
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {studio.title}
          </h3>
        </Link>

        {/* Row 4: Pricing & Action */}
        <div className="flex items-baseline justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
              {formatCurrency(studio.hourlyRate)}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">/hr</span>
            {studio.securityDeposit > 0 && (
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 ml-1.5 hidden sm:inline">
                · {formatCurrency(studio.securityDeposit)} deposit
              </span>
            )}
          </div>

          <Link
            href={studioUrl}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
          >
            <span>Explore</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
