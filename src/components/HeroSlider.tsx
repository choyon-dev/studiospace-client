'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';

import { StudioMeta, DEFAULT_CATEGORIES } from '@/types';
import { fetchStudioMeta } from '@/lib/api';
import {
  Search,
  MapPin,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'cyc-stages',
    title: 'Daylight Cyclorama Stages',
    description: '18ft ceilings, motorized RGB light truss, and 3-phase power.',
    category: 'Photo Studio',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'film-stages',
    title: 'Cinema Soundstages',
    description: 'STC 68 acoustic soundproofing, silent dual HVAC, and freight elevator access.',
    category: 'Film Stage',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'podcast-suites',
    title: '4K Broadcast Suites',
    description: 'Multi-cam live switching, Shure SM7B microphone arrays, and treated vocal booths.',
    category: 'Podcast Lounge',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'audio-suites',
    title: 'Dolby Atmos Music Suites',
    description: 'Genelec tuned acoustics, vintage analog consoles, and live tracking rooms.',
    category: 'Music Suite',
    image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1600&q=85',
  },
];

const PRESET_TAGS = [
  { label: 'Sound Stages Built for Peak Creators', category: 'Film Stage' },
  { label: 'Broadcast Without Boundaries', category: 'Podcast Lounge' },
  { label: 'Acoustic Excellence for Soundmasters', category: 'Music Suite' },
];

export default function HeroSlider() {
  const router = useRouter();
  const [meta, setMeta] = useState<StudioMeta | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHub, setSelectedHub] = useState('All');
  const [selectedRate, setSelectedRate] = useState('All');

  const [isMounted, setIsMounted] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const allCategories = useMemo(() => {
    const metaCats = meta?.categories?.map((c) => c.name) || [];
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...metaCats]));
  }, [meta]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadMeta() {
      try {
        const metaData = await fetchStudioMeta();
        setMeta(metaData);
      } catch (err) {
        console.error('Failed to load hero meta:', err);
      }
    }
    loadMeta();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') {
      params.append('category', selectedCategory);
    }
    if (selectedHub && selectedHub !== 'All') {
      params.append('hub', selectedHub);
    }
    if (selectedRate && selectedRate !== 'All') {
      params.append('rate', selectedRate);
    }
    const query = params.toString();
    router.push(query ? `/studios?${query}` : '/studios');
  };

  const handlePresetClick = (cat: string) => {
    setSelectedCategory(cat);
    router.push(`/studios?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950">
      <div className="absolute -top-32 left-1/4 w-[500px] h-[300px] bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[400px] h-[400px] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 leading-tight">
            Your Vision,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 dark:from-amber-400 dark:to-amber-600">
              Your Space.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mt-4 leading-relaxed">
            Book verified daylight lofts, motorized lighting grids, and seamless infinity cyc stages tailored for commercial shoots and high-fashion campaigns.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/25 cursor-pointer"
            >
              <span>Explore Studios</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:text-amber-500 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <span>Host Your Space</span>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto">
          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-2 shadow-xl shadow-slate-200/50 dark:shadow-black/40 grid grid-cols-1 md:grid-cols-4 gap-2 items-center"
          >
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors rounded-xl cursor-pointer">
              <Layers className="size-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <select
                aria-label="Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full font-semibold text-sm text-slate-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 cursor-pointer"
              >
                <option value="All" className="dark:bg-zinc-900">
                  All Categories
                </option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-zinc-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors rounded-xl cursor-pointer">
              <MapPin className="size-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <select
                aria-label="Location"
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="w-full font-semibold text-sm text-slate-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 cursor-pointer"
              >
                <option value="All" className="dark:bg-zinc-900">All Locations</option>
                {meta?.hubs.map((hub) => (
                  <option key={hub.city} value={hub.city} className="dark:bg-zinc-900">
                    {hub.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors rounded-xl cursor-pointer">
              <Clock className="size-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <select
                aria-label="Hourly Price"
                value={selectedRate}
                onChange={(e) => setSelectedRate(e.target.value)}
                className="w-full font-semibold text-sm text-slate-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 cursor-pointer"
              >
                <option value="All" className="dark:bg-zinc-900">Hourly Price (All)</option>
                <option value="budget" className="dark:bg-zinc-900">Under $75 / hr</option>
                <option value="standard" className="dark:bg-zinc-900">$75 - $125 / hr</option>
                <option value="commercial" className="dark:bg-zinc-900">Over $125 / hr</option>
              </select>
            </div>

            <div className="p-1">
              <button
                type="submit"
                className="w-full h-11 bg-amber-500 hover:bg-amber-400 active:scale-98 text-zinc-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/25 transition-all cursor-pointer"
              >
                <Search className="size-4" />
                <span>Search Spaces</span>
              </button>
            </div>
          </form>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handlePresetClick(tag.category)}
                className="px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-medium transition-all shadow-xs cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Sleek Minimalist Swiper Showcase (Clickable Slides, Clean Title & Description Only) */}
          <div className="relative w-full max-w-5xl mx-auto mt-6 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-zinc-800/80 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 group select-none">
            {isMounted ? (
              <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={true}
                speed={700}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                onSwiper={setSwiperInstance}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="w-full h-[240px] sm:h-[300px] md:h-[340px]"
              >
                {HERO_SLIDES.map((slide, index) => (
                  <SwiperSlide key={slide.id} className="!h-full">
                    <Link
                      href={`/studios?category=${encodeURIComponent(slide.category)}`}
                      className="group/slide block relative w-full h-[240px] sm:h-[300px] md:h-[340px] cursor-pointer"
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        unoptimized
                        priority={index === 0}
                        className="object-cover transition-transform duration-700 ease-out group-hover/slide:scale-105"
                        sizes="(max-width: 1280px) 100vw, 1280px"
                      />

                      {/* Studio scrim gradients for high text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 transition-opacity duration-300 group-hover/slide:from-black/90" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />

                      {/* Clean Title and Short Description Only */}
                      <div className="absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end z-10">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-1 sm:mb-2 group-hover/slide:text-amber-400 transition-colors">
                          {slide.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-zinc-300 font-medium tracking-wide line-clamp-1 max-w-xl">
                          {slide.description}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              /* SSR Static Placeholder to prevent CLS */
              <Link
                href={`/studios?category=${encodeURIComponent(HERO_SLIDES[0].category)}`}
                className="group/slide block relative w-full h-[240px] sm:h-[300px] md:h-[340px] cursor-pointer"
              >
                <Image
                  src={HERO_SLIDES[0].image}
                  alt={HERO_SLIDES[0].title}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
                <div className="absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end z-10">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-1 sm:mb-2">
                    {HERO_SLIDES[0].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 font-medium tracking-wide line-clamp-1 max-w-xl">
                    {HERO_SLIDES[0].description}
                  </p>
                </div>
              </Link>
            )}

            {/* Floating Navigation Chevrons */}
            {isMounted && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    swiperInstance?.slidePrev();
                  }}
                  aria-label="Previous slide"
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-10 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-lg"
                >
                  <ChevronLeft className="size-4 sm:size-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    swiperInstance?.slideNext();
                  }}
                  aria-label="Next slide"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-10 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-lg"
                >
                  <ChevronRight className="size-4 sm:size-5" />
                </button>

                {/* Sleek Pagination Indicators */}
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute right-4 sm:right-6 bottom-4 sm:bottom-6 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15"
                >
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        swiperInstance?.slideToLoop(idx);
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                        activeIndex === idx
                          ? 'w-5 sm:w-6 bg-amber-400'
                          : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
