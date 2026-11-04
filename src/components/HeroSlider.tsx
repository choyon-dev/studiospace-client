'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';

import { StudioMeta } from '@/types';
import { fetchStudioMeta } from '@/lib/api';
import {
  Search,
  MapPin,
  Clock,
  Layers,
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  specs: string;
  category: string;
  image: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'cyc-stages',
    tag: 'CYC WALLS & PHOTO',
    title: 'Daylight Cyclorama Stages',
    specs: '18ft ceilings · Motorized RGB light truss · 3-Phase power',
    category: 'Photo Studio',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'film-stages',
    tag: 'FILM & BROADCAST',
    title: 'Cinema Soundstages',
    specs: 'STC 68 soundproofing · Silent dual HVAC · Freight access',
    category: 'Film Stage',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'podcast-suites',
    tag: 'PODCAST & MEDIA',
    title: '4K Broadcast Suites',
    specs: 'Multi-cam live switching · Shure SM7B arrays · Treated booth',
    category: 'Podcast Lounge',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'audio-suites',
    tag: 'AUDIO & RECORDING',
    title: 'Dolby Atmos Music Suites',
    specs: 'Genelec acoustics · Vintage analog consoles · Live tracking',
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
                aria-label="Discipline"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full font-semibold text-sm text-slate-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 cursor-pointer"
              >
                <option value="All" className="dark:bg-zinc-900">
                  All Disciplines {meta ? `(${meta.totalStudios})` : ''}
                </option>
                {meta?.categories.map((cat) => (
                  <option key={cat.name} value={cat.name} className="dark:bg-zinc-900">
                    {cat.name} ({cat.count})
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
                <option value="All" className="dark:bg-zinc-900">All Creative Hubs</option>
                {meta?.hubs.map((hub) => (
                  <option key={hub.city} value={hub.city} className="dark:bg-zinc-900">
                    {hub.label} ({hub.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors rounded-xl cursor-pointer">
              <Clock className="size-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <select
                aria-label="Hourly Rate"
                value={selectedRate}
                onChange={(e) => setSelectedRate(e.target.value)}
                className="w-full font-semibold text-sm text-slate-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 cursor-pointer"
              >
                <option value="All" className="dark:bg-zinc-900">Flexible Hourly (All Rates)</option>
                <option value="budget" className="dark:bg-zinc-900">Under $75 / hr (Accessible)</option>
                <option value="standard" className="dark:bg-zinc-900">$75 - $125 / hr (Standard Pro)</option>
                <option value="commercial" className="dark:bg-zinc-900">Over $125 / hr (Commercial)</option>
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

          {/* Sleek Minimalist Swiper Showcase */}
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
                className="w-full h-[260px] sm:h-[320px] md:h-[360px]"
              >
                {HERO_SLIDES.map((slide, index) => (
                  <SwiperSlide key={slide.id}>
                    <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px]">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        unoptimized
                        priority={index === 0}
                        className="object-cover"
                        sizes="(max-width: 1280px) 100vw, 1280px"
                      />

                      {/* Studio scrim gradients for high text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

                      {/* Minimal Slide Content */}
                      <div className="absolute inset-0 p-5 sm:p-7 md:p-9 flex flex-col justify-end z-10">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-2 w-fit">
                          <Sparkles className="size-3 text-amber-400" />
                          <span>{slide.tag}</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-1 sm:mb-1.5">
                          {slide.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-zinc-300 font-medium tracking-wide mb-4 line-clamp-1 max-w-xl">
                          {slide.specs}
                        </p>

                        <div className="flex items-center gap-2.5">
                          <Link
                            href={`/studios?category=${encodeURIComponent(slide.category)}`}
                            className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                          >
                            <span>Explore Studios</span>
                            <ArrowUpRight className="size-3.5 sm:size-4" />
                          </Link>
                          <Link
                            href="/add-studio"
                            className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-medium text-xs sm:text-sm backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span>Host Your Space</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              /* SSR Static Placeholder to prevent CLS */
              <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px]">
                <Image
                  src={HERO_SLIDES[0].image}
                  alt={HERO_SLIDES[0].title}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-5 sm:p-7 md:p-9 flex flex-col justify-end z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-2 w-fit">
                    <Sparkles className="size-3 text-amber-400" />
                    <span>{HERO_SLIDES[0].tag}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-1 sm:mb-1.5">
                    {HERO_SLIDES[0].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 font-medium tracking-wide mb-4 line-clamp-1 max-w-xl">
                    {HERO_SLIDES[0].specs}
                  </p>
                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`/studios?category=${encodeURIComponent(HERO_SLIDES[0].category)}`}
                      className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-1.5"
                    >
                      <span>Explore Studios</span>
                      <ArrowUpRight className="size-3.5 sm:size-4" />
                    </Link>
                    <Link
                      href="/add-studio"
                      className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-white/10 text-white font-medium text-xs sm:text-sm backdrop-blur-md border border-white/20 flex items-center gap-1.5"
                    >
                      <span>Host Your Space</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Floating Navigation Chevrons */}
            {isMounted && (
              <>
                <button
                  type="button"
                  onClick={() => swiperInstance?.slidePrev()}
                  aria-label="Previous slide"
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-10 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-lg"
                >
                  <ChevronLeft className="size-4 sm:size-5" />
                </button>

                <button
                  type="button"
                  onClick={() => swiperInstance?.slideNext()}
                  aria-label="Next slide"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-10 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-lg"
                >
                  <ChevronRight className="size-4 sm:size-5" />
                </button>

                {/* Sleek Pagination Indicators */}
                <div className="absolute right-4 sm:right-6 bottom-4 sm:bottom-6 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => swiperInstance?.slideToLoop(idx)}
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
