'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudioMeta } from '@/types';
import { fetchStudioMeta } from '@/lib/api';
import {
  Search,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';

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
        </div>
      </div>
    </div>
  );
}
