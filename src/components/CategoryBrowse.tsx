'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import { StudioCategoryMeta } from '@/types';
import { fetchCategories } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryBrowse() {
  const [categories, setCategories] = useState<StudioCategoryMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    setIsMounted(true);
    let isCancelled = false;

    async function loadCategories() {
      try {
        const data = await fetchCategories();
        if (!isCancelled && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load dynamic categories:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section className="w-full bg-slate-50/50 dark:bg-zinc-950 py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Browse by Studio Category
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-2.5 max-w-xl mx-auto leading-relaxed">
            Explore verified studios by category to find the perfect space for your production.
          </p>
        </div>

        <div className="relative w-full">
          {loading || !isMounted ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl bg-slate-200/80 dark:bg-zinc-900/80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="relative group">
              <Swiper
                modules={[Navigation]}
                slidesPerView={1.3}
                spaceBetween={14}
                breakpoints={{
                  480: { slidesPerView: 1.8, spaceBetween: 14 },
                  640: { slidesPerView: 2.5, spaceBetween: 16 },
                  768: { slidesPerView: 3.2, spaceBetween: 18 },
                  1024: { slidesPerView: 4.2, spaceBetween: 20 },
                  1280: { slidesPerView: 5, spaceBetween: 20 },
                }}
                onSwiper={setSwiperInstance}
                className="w-full !py-2"
              >
                {categories.map((cat) => (
                  <SwiperSlide key={cat.slug || cat.name} className="!h-auto">
                    <Link
                      href={`/studios?category=${encodeURIComponent(cat.name)}`}
                      prefetch={true}
                      className="group/card block relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
                    >
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                          sizes="(max-width: 640px) 75vw, (max-width: 1024px) 35vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover/card:from-black/95" />

                      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end z-10">
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover/card:text-amber-400 transition-colors">
                          {cat.name}
                        </h3>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>

              {categories.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => swiperInstance?.slidePrev()}
                    aria-label="Previous category"
                    className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 size-9 sm:size-10 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-lg border border-slate-200/80 dark:border-zinc-800 flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                  >
                    <ChevronLeft className="size-4 sm:size-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => swiperInstance?.slideNext()}
                    aria-label="Next category"
                    className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 size-9 sm:size-10 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-lg border border-slate-200/80 dark:border-zinc-800 flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                  >
                    <ChevronRight className="size-4 sm:size-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
