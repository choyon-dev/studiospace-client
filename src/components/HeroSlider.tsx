'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import {
  ArrowRight,
  PlusCircle,
  Search,
  MapPin,
  Clock,
  Layers,
  Sparkles,
  Camera,
  Film,
  Mic,
  Music,
} from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface SlideItem {
  id: number;
  stageCode: string;
  locationSpec: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  category: string;
}

const slides: SlideItem[] = [
  {
    id: 1,
    stageCode: 'STAGE 04',
    locationSpec: 'Greenpoint Works • 4,200 SQ FT • 400A 3-Phase Camlock',
    title: 'Your Vision,',
    highlight: 'Your Space',
    description:
      'Book verified daylight lofts, motorized lighting grids, and seamless infinity cyc stages tailored for commercial shoots and high-fashion campaigns.',
    image:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85',
    category: 'Photo Studio',
  },
  {
    id: 2,
    stageCode: 'STUDIO A',
    locationSpec: 'Silver Lake • STC 65 Soundproof • Genelec 7.1.4 Atmos',
    title: 'Sound Stages Built for',
    highlight: 'Peak Creators',
    description:
      'Acoustically isolated tracking rooms, vintage Neve preamps, and Dolby Atmos mastering suites calibrated for commercial broadcast audio.',
    image:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85',
    category: 'Music Suite',
  },
  {
    id: 3,
    stageCode: 'PODCAST LAB',
    locationSpec: 'Downtown Austin • 4x Sony FX3 4K • Shure SM7B Setup',
    title: 'Broadcast Without',
    highlight: 'Boundaries',
    description:
      'Turnkey multi-camera video podcast lounges with live 4K switching consoles, customized neon LED acoustic diffusers, and ultra-fast fiber uplinks.',
    image:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1920&q=85',
    category: 'Podcast Lounge',
  },
];

const PRESET_TAGS = [
  { label: 'Sound Stages Built for Peak Creators', category: 'Film Stage' },
  { label: 'Broadcast Without Boundaries', category: 'Podcast Lounge' },
  { label: 'Acoustic Excellence for Soundmasters', category: 'Music Suite' },
];

export default function HeroSlider() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSlot, setSelectedSlot] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') {
      params.append('category', selectedCategory);
    }
    if (selectedLocation && selectedLocation !== 'All') {
      params.append('search', selectedLocation);
    }
    const query = params.toString();
    router.push(query ? `/studios?${query}` : '/studios');
  };

  const handlePresetClick = (cat: string) => {
    setSelectedCategory(cat);
    router.push(`/studios?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 border-b border-slate-200/80 dark:border-zinc-800">
      <div className="absolute -top-32 left-1/4 w-[500px] h-[300px] bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[400px] h-[400px] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 leading-tight">
            Your Vision,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 dark:from-amber-400 dark:to-amber-600">
              Your Space.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mt-3 leading-relaxed">
            Book verified daylight lofts, motorized lighting grids, and seamless infinity cyc stages tailored for commercial shoots and high-fashion campaigns.
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto mb-10">
          <form
            onSubmit={handleSearch}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-2 shadow-xl shadow-slate-200/50 dark:shadow-black/40 grid grid-cols-1 md:grid-cols-4 gap-2 items-center"
          >
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors rounded-xl cursor-pointer">
              <Layers className="size-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <select
                aria-label="Discipline"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full font-semibold text-sm text-slate-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 cursor-pointer"
              >
                <option value="All" className="dark:bg-zinc-900">All Disciplines</option>
                <option value="Photo Studio" className="dark:bg-zinc-900">Photo Studios</option>
                <option value="Film Stage" className="dark:bg-zinc-900">Film Stages</option>
                <option value="Podcast Lounge" className="dark:bg-zinc-900">Podcast Lounges</option>
                <option value="Music Suite" className="dark:bg-zinc-900">Music Suites</option>
                <option value="Workshop" className="dark:bg-zinc-900">Artisan Workshops</option>
              </select>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors rounded-xl cursor-pointer md:border-l md:border-slate-200 dark:md:border-zinc-800">
              <MapPin className="size-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <select
                aria-label="Location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full font-semibold text-sm text-slate-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 cursor-pointer"
              >
                <option value="All" className="dark:bg-zinc-900">All Creative Hubs</option>
                <option value="Brooklyn" className="dark:bg-zinc-900">Brooklyn / NYC</option>
                <option value="Los Angeles" className="dark:bg-zinc-900">Los Angeles, CA</option>
                <option value="Austin" className="dark:bg-zinc-900">Austin, TX</option>
                <option value="Chicago" className="dark:bg-zinc-900">Chicago, IL</option>
              </select>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors rounded-xl cursor-pointer md:border-l md:border-slate-200 dark:md:border-zinc-800">
              <Clock className="size-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <select
                aria-label="Shoot Duration"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full font-semibold text-sm text-slate-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 cursor-pointer"
              >
                <option value="All" className="dark:bg-zinc-900">Flexible Hourly</option>
                <option value="half" className="dark:bg-zinc-900">Half-Day (4 Hours)</option>
                <option value="full" className="dark:bg-zinc-900">Full-Day (8+ Hours)</option>
                <option value="lockout" className="dark:bg-zinc-900">Multi-Day Lockout</option>
              </select>
            </div>

            <div className="p-1">
              <button
                type="submit"
                className="w-full h-11 bg-amber-500 hover:bg-amber-400 active:scale-98 text-zinc-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/25 transition-all"
              >
                <Search className="size-4" />
                <span>Search Spaces</span>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handlePresetClick(tag.category)}
                className="px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400/50 text-xs font-medium transition-all shadow-2xs"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl bg-zinc-950">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            speed={800}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            loop={true}
            className="w-full h-[420px] sm:h-[480px] lg:h-[540px]"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id} className="relative w-full h-full">
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                    priority={slide.id === 1}
                    loading={slide.id === 1 ? 'eager' : 'lazy'}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/30" />

                  <div className="absolute top-4 left-4 backdrop-blur-md bg-white/90 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-700/80 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      {slide.stageCode}
                    </span>
                    <span className="text-xs font-mono text-slate-700 dark:text-zinc-300 hidden sm:inline">
                      • {slide.locationSpec}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="max-w-xl space-y-2">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-amber-500 text-zinc-950">
                        {slide.category}
                      </span>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                        {slide.title} {slide.highlight}
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2">
                        {slide.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/studios?category=${encodeURIComponent(slide.category)}`}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                      >
                        <span>Reserve Stage</span>
                        <ArrowRight className="size-4" />
                      </Link>
                      <Link
                        href="/add-studio"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700/80 backdrop-blur-md transition-all"
                      >
                        <PlusCircle className="size-4 text-amber-400" />
                        <span>Host</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
