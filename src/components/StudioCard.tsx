'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Studio } from '@/types';
import { Star, MapPin, Users, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function StudioCard({ studio }: { studio: Studio }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-200">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
            {studio.category}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-950/80 backdrop-blur-md text-zinc-100 border border-zinc-700/60 tabular-nums">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span>{studio.rating.toFixed(1)}</span>
            <span className="text-zinc-400">({studio.reviewCount})</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
          <MapPin className="size-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{studio.location}</span>
        </div>

        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
          {studio.title}
        </h3>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
          {studio.overview}
        </p>

        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 py-3 border-t border-zinc-100 dark:border-zinc-800/80 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5 text-zinc-400" />
            <span>Cap: {studio.maxCapacity} creators</span>
          </div>
          <span className="text-[11px] font-medium text-zinc-400">Instant Booking</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {formatCurrency(studio.hourlyRate)}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal"> / hour</span>
          </div>

          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-amber-500 hover:text-zinc-950 active:scale-95 transition-all"
          >
            <span>View Details</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
