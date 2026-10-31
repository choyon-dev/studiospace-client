'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ArrowRight, PlusCircle } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface SlideItem {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  primaryLink: string;
  secondaryLink: string;
}

const slides: SlideItem[] = [
  {
    id: 1,
    tag: 'Photography & Commercial Production',
    title: 'Your Vision,',
    highlight: 'Your Space',
    description:
      'Book verified daylight lofts, motorized lighting grids, and seamless infinity cyc stages tailored for high-fashion lookbooks and visual campaigns.',
    image:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85',
    primaryLink: '/studios?category=Photo%20Studio',
    secondaryLink: '/add-studio',
  },
  {
    id: 2,
    tag: 'Audio Engineering & Music Scoring',
    title: 'Sound Stages Built for',
    highlight: 'Peak Creators',
    description:
      'Acoustically isolated tracking rooms, Neve consoles, and Dolby Atmos mastering suites equipped with pristine monitoring chains.',
    image:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85',
    primaryLink: '/studios?category=Music%20Suite',
    secondaryLink: '/add-studio',
  },
  {
    id: 3,
    tag: 'Broadcast & Video Podcasting',
    title: 'Broadcast Without',
    highlight: 'Boundaries',
    description:
      'Turnkey multi-camera video podcast lounges with Shure SM7B microphones, live 4K streaming switchboards, and atmospheric lighting.',
    image:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1920&q=85',
    primaryLink: '/studios?category=Podcast%20Lounge',
    secondaryLink: '/add-studio',
  },
];

export default function HeroSlider() {
  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={800}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        className="w-full h-[650px] lg:h-[720px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={slide.id === 1}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
              <div className="absolute inset-0 bg-zinc-950/40" />
            </div>

            <div className="absolute inset-0 z-10 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl space-y-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                    {slide.title}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <Link
                      href={slide.primaryLink}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/25"
                    >
                      <span>Explore Studios</span>
                      <ArrowRight className="size-4" />
                    </Link>

                    <Link
                      href={slide.secondaryLink}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/80 backdrop-blur-md active:scale-95 transition-all"
                    >
                      <PlusCircle className="size-4 text-amber-400" />
                      <span>Host Your Space</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
