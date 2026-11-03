'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Studio } from '@/types';
import { Star, MapPin, ArrowUpRight, Zap, Heart } from 'lucide-react';
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

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md text-[10px] font-mono font-bold uppercase text-slate-800 dark:text-zinc-200 shadow-xs">
            {studio.category}
          </span>
          <span className="px-2 py-1 rounded-md bg-amber-500 text-zinc-950 text-[10px] font-mono font-bold uppercase flex items-center gap-1 shadow-xs">
            <Zap className="size-3 fill-zinc-950" />
            <span>Instant</span>
          </span>
        </div>

        <button
          type="button"
          aria-label={isFavorited ? 'Remove from saved studios' : 'Save studio to wishlist'}
          onClick={handleFavoriteClick}
          disabled={isToggling}
          className="absolute top-3 right-3 size-8 rounded-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-red-500 active:scale-90 transition-all shadow-xs z-10 cursor-pointer"
        >
          <Heart className={`size-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm font-semibold">
          {studio.specs?.squareFeet ? `${studio.specs.squareFeet.toLocaleString()} SQ FT` : `${studio.maxCapacity * 350} SQ FT`}
        </div>

        <div className="absolute bottom-3 right-3">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-900/80 backdrop-blur-sm text-zinc-100 tabular-nums">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {studio.reviewCount > 0 ? (
              <>
                <span>{studio.rating.toFixed(1)}</span>
                <span className="text-zinc-400">({studio.reviewCount})</span>
              </>
            ) : (
              <span className="text-zinc-300">New</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mb-1.5">
            <MapPin className="size-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{studio.location}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {studio.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
            {studio.overview}
          </p>

          {studio.amenities && studio.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {studio.amenities.slice(0, 2).map((amenity) => (
                <span
                  key={amenity}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 truncate max-w-[170px]"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
                {formatCurrency(studio.hourlyRate)}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">/hr</span>
            </div>
            {studio.securityDeposit > 0 && (
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">
                {formatCurrency(studio.securityDeposit)} deposit
              </span>
            )}
          </div>

          <Link
            href={getStudioUrl(studio)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-zinc-950 active:scale-95 transition-all"
          >
            <span>View Details</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
