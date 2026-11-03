'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Studio, StudioMeta } from '@/types';
import StudioCard from '@/components/StudioCard';
import { fetchAllStudios, fetchStudioMeta, fetchMyWishlist } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Building2,
  MapPin,
  Clock,
  Layers,
  X,
  Heart,
} from 'lucide-react';

function StudiosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const initialCategory = searchParams.get('category') || 'All';
  const initialHub = searchParams.get('hub') || 'All';
  const initialRate = searchParams.get('rate') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sortBy') || 'newest';

  const [meta, setMeta] = useState<StudioMeta | null>(null);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedHub, setSelectedHub] = useState<string>(initialHub);
  const [selectedRate, setSelectedRate] = useState<string>(initialRate);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  useEffect(() => {
    async function loadMeta() {
      try {
        const metaData = await fetchStudioMeta();
        setMeta(metaData);
      } catch (err) {
        console.error('Failed to load studio meta:', err);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      fetchMyWishlist()
        .then((res) => {
          if (isMounted && res.ids) {
            setWishlistIds(new Set(res.ids));
          }
        })
        .catch(() => {});
    } else {
      setWishlistIds(new Set());
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const rateRange = useMemo(() => {
    if (selectedRate === 'budget') return { minPrice: undefined, maxPrice: 75 };
    if (selectedRate === 'standard') return { minPrice: 75, maxPrice: 125 };
    if (selectedRate === 'commercial') return { minPrice: 125, maxPrice: undefined };
    return { minPrice: undefined, maxPrice: undefined };
  }, [selectedRate]);

  useEffect(() => {
    let active = true;
    async function loadStudios() {
      setLoading(true);
      try {
        const data = await fetchAllStudios({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          hub: selectedHub !== 'All' ? selectedHub : undefined,
          search: searchQuery.trim() || undefined,
          minPrice: rateRange.minPrice,
          maxPrice: rateRange.maxPrice,
          sortBy,
        });
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
      loadStudios();
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, selectedHub, selectedRate, searchQuery, sortBy, rateRange]);

  const syncUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === 'All') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.replace(`/studios?${params.toString()}`);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    syncUrl({ category: cat });
  };

  const handleHubChange = (hub: string) => {
    setSelectedHub(hub);
    syncUrl({ hub });
  };

  const handleRateChange = (rate: string) => {
    setSelectedRate(rate);
    syncUrl({ rate });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    syncUrl({ search: val });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedHub('All');
    setSelectedRate('All');
    setSearchQuery('');
    setSortBy('newest');
    router.replace('/studios');
  };

  const handleToggleFavorite = (studioId: string, isFavorited: boolean) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (isFavorited) next.add(studioId);
      else next.delete(studioId);
      return next;
    });
  };

  const displayedStudios = studios;

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedHub !== 'All' ||
    selectedRate !== 'All' ||
    searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Explore Production Workspaces
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-3xl leading-relaxed">
          Browse verified daylight stages, soundproof suites, and 4K podcast lounges across global creative hubs. Filter by discipline, location, rate tiers, or saved spaces.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-5 shadow-sm mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
            <Layers className="size-4 text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Discipline
              </label>
              <select
                aria-label="Discipline filter"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none p-0 cursor-pointer"
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
          </div>

          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
            <MapPin className="size-4 text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Creative Hub
              </label>
              <select
                aria-label="Location hub filter"
                value={selectedHub}
                onChange={(e) => handleHubChange(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none p-0 cursor-pointer"
              >
                <option value="All" className="dark:bg-zinc-900">
                  All Creative Hubs
                </option>
                {meta?.hubs.map((hub) => (
                  <option key={hub.city} value={hub.city} className="dark:bg-zinc-900">
                    {hub.label} ({hub.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
            <Clock className="size-4 text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Hourly Rate
              </label>
              <select
                aria-label="Hourly rate filter"
                value={selectedRate}
                onChange={(e) => handleRateChange(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none p-0 cursor-pointer"
              >
                <option value="All" className="dark:bg-zinc-900">
                  Flexible Hourly (All Rates)
                </option>
                <option value="budget" className="dark:bg-zinc-900">
                  Under $75 / hr (Accessible)
                </option>
                <option value="standard" className="dark:bg-zinc-900">
                  $75 - $125 / hr (Standard Pro)
                </option>
                <option value="commercial" className="dark:bg-zinc-900">
                  Over $125 / hr (Commercial)
                </option>
              </select>
            </div>
          </div>

          <div className="relative flex items-center px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
            <Search className="size-4 text-amber-500 shrink-0 mr-2.5" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Live Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Title, gear, or neighborhood..."
                className="w-full text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none p-0 placeholder:font-normal placeholder:text-zinc-400"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              All Spaces {meta ? `(${meta.totalStudios})` : ''}
            </button>
            {meta?.categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryChange(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/20'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            {user && wishlistIds.size > 0 && (
              <Link
                href="/saved-studios"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
              >
                <Heart className="size-3.5 text-red-500 fill-red-500" />
                <span>Saved ({wishlistIds.size})</span>
              </Link>
            )}

            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <SlidersHorizontal className="size-3.5" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                syncUrl({ sortBy: e.target.value });
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="newest">Newest Listed</option>
              <option value="ratingDesc">Highest Rated</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-zinc-400">Active Filters:</span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => handleCategoryChange('All')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <span>Discipline: {selectedCategory}</span>
              <X className="size-3" />
            </button>
          )}
          {selectedHub !== 'All' && (
            <button
              onClick={() => handleHubChange('All')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <span>Hub: {selectedHub}</span>
              <X className="size-3" />
            </button>
          )}
          {selectedRate !== 'All' && (
            <button
              onClick={() => handleRateChange('All')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <span>Rate: {selectedRate}</span>
              <X className="size-3" />
            </button>
          )}
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <span>Query: &ldquo;{searchQuery}&rdquo;</span>
              <X className="size-3" />
            </button>
          )}
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 ml-2"
          >
            <RotateCcw className="size-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6 text-xs text-zinc-500">
        <p>
          Showing <span className="font-semibold text-zinc-900 dark:text-zinc-200">{displayedStudios.length}</span> workspaces
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/80 overflow-hidden animate-pulse shadow-xs"
            >
              <div className="aspect-[16/10] w-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="h-5 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayedStudios.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/30">
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
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Clear All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedStudios.map((studio) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              initialFavorited={wishlistIds.has(studio._id)}
              onToggleFavorite={handleToggleFavorite}
            />
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
