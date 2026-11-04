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
  ChevronDown,
} from 'lucide-react';

const RATE_OPTIONS = [
  { value: 'All', label: 'All Rates', sub: 'Any Price' },
  { value: 'budget', label: 'Under $75 / hr', sub: 'Budget Friendly' },
  { value: 'standard', label: '$75 - $125 / hr', sub: 'Mid-Tier' },
  { value: 'commercial', label: 'Over $125 / hr', sub: 'Premium' },
];

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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedHub, setSelectedHub] = useState<string>(initialHub);
  const [selectedRate, setSelectedRate] = useState<string>(initialRate);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  const [openSections, setOpenSections] = useState({
    category: true,
    location: true,
    rate: true,
  });

  const toggleSection = (section: 'category' | 'location' | 'rate') => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedHub !== 'All' ||
    selectedRate !== 'All' ||
    searchQuery.trim().length > 0;

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedHub !== 'All' ? 1 : 0) +
    (selectedRate !== 'All' ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  // Common filter panel controls (rendered in desktop sidebar & mobile drawer)
  const renderFilterControls = () => (
    <div className="space-y-5">
      {/* Search Input */}
      <div>
        <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
          Search Spaces
        </label>
        <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl px-3 py-2.5 focus-within:border-amber-500 transition-colors">
          <Search className="size-4 text-amber-500 shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Title, gear, city..."
            className="w-full text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none p-0 placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category (Collapsible & Scrollable Radio List) */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
        <button
          type="button"
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5 cursor-pointer group"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="size-3.5 text-amber-500" />
            <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
              Category
            </span>
            {selectedCategory !== 'All' && (
              <span className="size-1.5 rounded-full bg-amber-500" />
            )}
          </div>
          <ChevronDown
            className={`size-3.5 text-zinc-400 transition-transform duration-200 ${
              openSections.category ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.category && (
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => handleCategoryChange('All')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`size-2 rounded-full shrink-0 ${
                    selectedCategory === 'All' ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                />
                <span className="truncate">All Categories</span>
              </div>
              {meta && (
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  {meta.totalStudios}
                </span>
              )}
            </button>

            {meta?.categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryChange(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`size-2 rounded-full shrink-0 ${
                      selectedCategory === cat.name ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Locations (Collapsible & Scrollable Radio List, NO DROPDOWN) */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
        <button
          type="button"
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5 cursor-pointer group"
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-amber-500" />
            <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
              Locations
            </span>
            {selectedHub !== 'All' && (
              <span className="size-1.5 rounded-full bg-amber-500" />
            )}
          </div>
          <ChevronDown
            className={`size-3.5 text-zinc-400 transition-transform duration-200 ${
              openSections.location ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.location && (
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => handleHubChange('All')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedHub === 'All'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`size-2 rounded-full shrink-0 ${
                    selectedHub === 'All' ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                />
                <span className="truncate">All Locations</span>
              </div>
              {meta && (
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  {meta.totalStudios}
                </span>
              )}
            </button>

            {meta?.hubs.map((hub) => (
              <button
                key={hub.city}
                type="button"
                onClick={() => handleHubChange(hub.city)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedHub === hub.city
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`size-2 rounded-full shrink-0 ${
                      selectedHub === hub.city ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  />
                  <span className="truncate">{hub.label}</span>
                </div>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  {hub.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hourly Rate (Collapsible) */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
        <button
          type="button"
          onClick={() => toggleSection('rate')}
          className="w-full flex items-center justify-between text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5 cursor-pointer group"
        >
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-amber-500" />
            <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
              Hourly Rate
            </span>
            {selectedRate !== 'All' && (
              <span className="size-1.5 rounded-full bg-amber-500" />
            )}
          </div>
          <ChevronDown
            className={`size-3.5 text-zinc-400 transition-transform duration-200 ${
              openSections.rate ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.rate && (
          <div className="space-y-1">
            {RATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleRateChange(opt.value)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between ${
                  selectedRate === opt.value
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/30'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium'
                }`}
              >
                <span>{opt.label}</span>
                <span className="text-[10px] text-zinc-400">{opt.sub}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Explore Production Workspaces
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-3xl leading-relaxed">
          Browse verified daylight stages, soundproof suites, and 4K podcast lounges across global locations.
        </p>
      </div>

      {/* Mobile Sticky Filter Trigger Bar */}
      <div className="lg:hidden flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
        >
          <SlidersHorizontal className="size-4 text-amber-500" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="size-5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              syncUrl({ sortBy: e.target.value });
            }}
            className="h-11 px-3 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="newest">Newest Listed</option>
            <option value="ratingDesc">Highest Rated</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar Filter Panel (Desktop Sticky) */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                <SlidersHorizontal className="size-4 text-amber-500" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {renderFilterControls()}
          </div>
        </aside>

        {/* Mobile Slide-Over Filter Drawer */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-zinc-900 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 font-bold text-base text-zinc-900 dark:text-zinc-100">
                    <SlidersHorizontal className="size-4 text-amber-500" />
                    <span>Filter Studios</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {renderFilterControls()}
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex-1 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  Show Results ({studios.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Top Utility Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Showing{' '}
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {studios.length}
                </span>{' '}
                verified {studios.length === 1 ? 'workspace' : 'workspaces'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user && wishlistIds.size > 0 && (
                <Link
                  href="/saved-studios"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
                >
                  <Heart className="size-3.5 text-red-500 fill-red-500" />
                  <span>Saved ({wishlistIds.size})</span>
                </Link>
              )}

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">Sort by:</span>
                <div className="relative flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      syncUrl({ sortBy: e.target.value });
                    }}
                    className="h-9 pl-3 pr-7 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer appearance-none"
                  >
                    <option value="newest">Newest Listed</option>
                    <option value="ratingDesc">Highest Rated</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="size-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filter Chips (Dismissible) */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-zinc-400 font-medium">Active:</span>
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange('All')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <span>Category: {selectedCategory}</span>
                  <X className="size-3" />
                </button>
              )}
              {selectedHub !== 'All' && (
                <button
                  type="button"
                  onClick={() => handleHubChange('All')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <span>Location: {selectedHub}</span>
                  <X className="size-3" />
                </button>
              )}
              {selectedRate !== 'All' && (
                <button
                  type="button"
                  onClick={() => handleRateChange('All')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <span>
                    Rate:{' '}
                    {RATE_OPTIONS.find((r) => r.value === selectedRate)?.label || selectedRate}
                  </span>
                  <X className="size-3" />
                </button>
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <span>Query: &ldquo;{searchQuery}&rdquo;</span>
                  <X className="size-3" />
                </button>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 ml-2 font-medium cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Reset All</span>
              </button>
            </div>
          )}

          {/* Studio Grid / Skeletons / Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    <div className="space-y-1.5">
                      <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                      <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <div className="h-5 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                      <div className="h-4 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : studios.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60">
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
                type="button"
                onClick={handleResetFilters}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Clear All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {studios.map((studio) => (
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
      </div>
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
