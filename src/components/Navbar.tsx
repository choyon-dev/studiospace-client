'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { Studio } from '@/types';
import { fetchAllStudios } from '@/lib/api';
import {
  Aperture,
  Menu,
  X,
  Sun,
  Moon,
  PlusCircle,
  LayoutDashboard,
  Layers,
  CalendarCheck,
  LogOut,
  ChevronDown,
  Search,
  Loader2,
  MapPin,
  Star,
  ArrowRight,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Studio[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      if (e.key === '/' && !isSearchOpen) {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea' && activeTag !== 'select') {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen, isMobileMenuOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSelectedIndex(-1);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await fetchAllStudios(undefined, searchQuery.trim());
        setSearchResults(results.slice(0, 8));
        setSelectedIndex(results.length > 0 ? 0 : -1);
      } catch (err) {
        setSearchResults([]);
        setSelectedIndex(-1);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (searchResults.length === 0) return;
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (searchResults.length === 0) return;
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleSelectStudio(searchResults[selectedIndex]);
      } else if (searchQuery.trim()) {
        setIsSearchOpen(false);
        router.push(`/studios?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchOpen(false);
    }
  };

  const handleSelectStudio = (studio: Studio) => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/studios/${studio._id}`);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore Studios', href: '/studios' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'About Us', href: '/#about-us' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href) && href !== '/';
  };

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="relative w-full z-40">
      <div className="h-20 sm:h-22 pointer-events-none" />

      <div
        className={`fixed top-3 sm:top-4 inset-x-0 z-40 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-out pointer-events-none ${
          isVisible || isMobileMenuOpen || isSearchOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-28 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto relative pointer-events-auto w-full">
          <div
            className={`flex items-center justify-between rounded-2xl transition-all duration-300 ${
              isScrolled
                ? 'h-14 sm:h-15 px-3.5 sm:px-5 bg-white/95 dark:bg-zinc-950/92 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-xl shadow-zinc-950/10 dark:shadow-black/50'
                : 'h-16 sm:h-18 px-3.5 sm:px-6 bg-white/85 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-md shadow-zinc-950/5'
            }`}
          >
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 group transition-transform duration-150 active:scale-95 shrink-0"
            >
              <div className="size-8 sm:size-9 lg:size-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                <Aperture className="size-4.5 sm:size-5 lg:size-6 stroke-[2.2]" />
              </div>
              <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
                Studio<span className="text-amber-500">Space</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center p-1 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/60 gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
                      active
                        ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/50 hover:border-amber-500/50 hover:bg-amber-500/5 text-xs text-zinc-500 dark:text-zinc-400 transition-all cursor-pointer group"
                title="Search all creative spaces (⌘K)"
              >
                <Search className="size-3.5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                <span className="hidden xl:inline text-xs font-medium">Search stages...</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:border-amber-500/40">
                  ⌘K
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search creative spaces"
                className="md:hidden p-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 hover:border-amber-500/50 transition-colors bg-zinc-50/80 dark:bg-zinc-900/50 shadow-2xs"
              >
                <Search className="size-4" />
              </button>

              {mounted && (
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle color theme"
                  className="p-2 sm:p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 hover:border-amber-500/50 transition-colors bg-zinc-50/80 dark:bg-zinc-900/50 shadow-2xs"
                >
                  {currentTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>
              )}

              {user ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/add-studio"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-xs active:scale-95"
                  >
                    <PlusCircle className="size-3.5" />
                    <span>Add Studio</span>
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center gap-1.5 p-1 sm:p-1.5 sm:pr-3 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/60 hover:border-amber-500/50 transition-all duration-150 shadow-2xs"
                    >
                      <div className="relative size-7 sm:size-8 rounded-full overflow-hidden border border-amber-500/40">
                        <Image
                          src={
                            user.photoURL ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
                          }
                          alt={user.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <span className="hidden sm:inline text-xs font-semibold text-zinc-800 dark:text-zinc-200 max-w-[100px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown className="size-3 text-zinc-400 hidden sm:block" />
                    </button>

                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-amber-500 transition-colors"
                        >
                          <LayoutDashboard className="size-4" />
                          Dashboard
                        </Link>

                        <Link
                          href="/add-studio"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-amber-500 transition-colors"
                        >
                          <PlusCircle className="size-4" />
                          Add New Studio
                        </Link>

                        <Link
                          href="/my-listings"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-amber-500 transition-colors"
                        >
                          <Layers className="size-4" />
                          My Studio Listings
                        </Link>

                        <Link
                          href="/my-bookings"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-amber-500 transition-colors"
                        >
                          <CalendarCheck className="size-4" />
                          My Bookings
                        </Link>

                        <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />

                        <button
                          onClick={() => logout()}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="size-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/login"
                    className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/add-studio"
                    className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-xs shadow-amber-500/20 items-center gap-1"
                  >
                    <PlusCircle className="size-3.5" />
                    <span>List Space</span>
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-colors"
                aria-label="Toggle navigation drawer"
              >
                {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
              <div
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="relative cursor-pointer"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <div className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                  <span>Search stages, cities, gear...</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    Live
                  </span>
                </div>
              </div>

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                      isActive(link.href)
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-2 py-1">
                      <div className="relative size-8 rounded-full overflow-hidden border border-amber-500">
                        <Image
                          src={
                            user.photoURL ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
                          }
                          alt={user.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Link
                        href="/dashboard"
                        className="px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-center"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/add-studio"
                        className="px-3 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-zinc-950 text-center"
                      >
                        + Add Studio
                      </Link>
                      <Link
                        href="/my-listings"
                        className="px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-center"
                      >
                        My Listings
                      </Link>
                      <Link
                        href="/my-bookings"
                        className="px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-center"
                      >
                        My Bookings
                      </Link>
                    </div>

                    <button
                      onClick={() => logout()}
                      className="w-full mt-2 py-2 text-xs font-semibold rounded-xl text-red-500 bg-red-500/10 text-center"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="py-2.5 text-center text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/add-studio"
                      className="py-2.5 text-center text-xs font-bold rounded-xl bg-amber-500 text-zinc-950 shadow-xs"
                    >
                      + List Space
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            ref={searchModalRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl mt-12 sm:mt-20 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
          >
            <div className="relative flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              {isSearching ? (
                <Loader2 className="size-5 text-amber-500 animate-spin shrink-0 mr-3" />
              ) : (
                <Search className="size-5 text-zinc-400 shrink-0 mr-3" />
              )}
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search studios by title, location, gear, or category..."
                className="w-full bg-transparent text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
                autoComplete="off"
                spellCheck="false"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors mr-2"
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {isSearching && searchResults.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
                  <Loader2 className="size-6 text-amber-500 animate-spin" />
                  <p className="text-xs font-medium text-zinc-500">Searching active stages...</p>
                </div>
              ) : searchQuery.trim() && searchResults.length === 0 && !isSearching ? (
                <div className="py-10 text-center space-y-2">
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    No studios found for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Try searching for different terms like photo, video, podcast, Brooklyn, or daylight.
                  </p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((studio, idx) => (
                    <div
                      key={studio._id}
                      onClick={() => handleSelectStudio(studio)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                        selectedIndex === idx
                          ? 'bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-transparent'
                      }`}
                    >
                      <div className="relative size-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-200/50 dark:border-zinc-700/50">
                        <Image
                          src={studio.imageUrl}
                          alt={studio.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {studio.title}
                          </span>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                            {studio.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                          <MapPin className="size-3 shrink-0 text-amber-500" />
                          <span className="truncate">{studio.location}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                          ${studio.hourlyRate}/hr
                        </div>
                        <div className="flex items-center justify-end gap-1 text-[11px] text-zinc-400 mt-0.5">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <span>{studio.rating || '5.0'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2 font-semibold">
                      Popular Disciplines
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Photo Studio', 'Film Stage', 'Podcast Lounge', 'Music Suite', 'Workshop'].map(
                        (cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSearchQuery(cat)}
                            className="px-2.5 py-1 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800/70 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 text-zinc-700 dark:text-zinc-300 transition-colors"
                          >
                            {cat}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2 font-semibold">
                      Popular Creative Hubs
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Brooklyn', 'Silver Lake', 'Austin', 'Arts District', 'Chicago'].map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setSearchQuery(loc)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800/70 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 text-[11px] text-zinc-500 dark:text-zinc-400">
              {searchQuery.trim() ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    router.push(`/studios?search=${encodeURIComponent(searchQuery.trim())}`);
                  }}
                  className="font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                  <ArrowRight className="size-3" />
                </button>
              ) : (
                <span>Type to search active studios</span>
              )}
              <div className="hidden sm:flex items-center gap-3 font-mono text-[10px]">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
