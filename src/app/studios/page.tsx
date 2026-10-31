'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Studio, StudioCategory } from '@/types';
import StudioCard from '@/components/StudioCard';
import { fetchAllStudios } from '@/lib/api';
import { Search, SlidersHorizontal, RotateCcw, Building2 } from 'lucide-react';

const CATEGORIES: ('All' | StudioCategory)[] = [
  'All',
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Workshop',
];

function StudiosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchAllStudios(selectedCategory, searchQuery, sortBy);
        if (active) {
          setStudios(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      load();
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.replace(`/studios?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('newest');
    router.replace('/studios');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Explore Production Workspaces
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-2xl">
          Browse vetted daylight stages, acoustically treated live rooms, 4K podcast lounges, and artisan fabrication workshops available by the hour.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 mb-8 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by studio name, location, or equipment..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 shrink-0">
            <SlidersHorizontal className="size-3.5" />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            <option value="newest">Newest Listed</option>
            <option value="ratingDesc">Highest Rated</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              selectedCategory === cat
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6 text-xs text-zinc-500">
        <p>
          Showing <span className="font-semibold text-zinc-900 dark:text-zinc-200">{studios.length}</span> workspaces
        </p>
        {(selectedCategory !== 'All' || searchQuery) && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-medium"
          >
            <RotateCcw className="size-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[16/10] w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="h-6 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-8 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="size-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center mb-4">
            <Building2 className="size-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            No production spaces match your criteria
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
            Try adjusting your search terms, clearing specific category filters, or browsing all available spaces.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
          >
            <RotateCcw className="size-3.5" />
            <span>Clear All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-zinc-400">Loading catalog...</div>}>
      <StudiosContent />
    </Suspense>
  );
}
