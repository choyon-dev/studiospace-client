'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StudioCarouselProps {
  images: string[];
  title: string;
}

export default function StudioCarousel({ images, title }: StudioCarouselProps) {
  const safeImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  useEffect(() => {
    if (isPaused || safeImages.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, safeImages.length, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-zinc-950 shadow-md group select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {safeImages.map((imgUrl, index) => (
          <div
            key={imgUrl + index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={imgUrl}
              alt={`${title} - View ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1200px"
              className="object-cover"
            />
          </div>
        ))}

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous image"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-zinc-950/60 hover:bg-zinc-950/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm"
            >
              <ChevronLeft className="size-4 sm:size-5" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next image"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-zinc-950/60 hover:bg-zinc-950/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm"
            >
              <ChevronRight className="size-4 sm:size-5" />
            </button>

            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-20 px-2.5 py-1 rounded-lg bg-zinc-950/75 backdrop-blur-md text-[11px] font-mono font-medium text-white shadow-sm tabular-nums">
              {currentIndex + 1} / {safeImages.length}
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:hidden">
              {safeImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Jump to slide ${i + 1}`}
                  onClick={() => setCurrentIndex(i)}
                  className={`size-1.5 rounded-full transition-all ${
                    i === currentIndex ? 'w-4 bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="hidden sm:flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {safeImages.map((imgUrl, idx) => (
            <button
              key={imgUrl + idx}
              type="button"
              aria-label={`Select photo ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[16/10] w-20 sm:w-24 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'ring-2 ring-amber-500 scale-102 opacity-100 shadow-sm'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <Image
                src={imgUrl}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
