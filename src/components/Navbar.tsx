'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        router.push('/studios');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

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
  }, [pathname]);

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
        className={`fixed top-3 sm:top-4 inset-x-0 z-40 px-3 sm:px-6 transition-all duration-300 ease-out pointer-events-none ${
          isVisible || isMobileMenuOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-28 opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto relative pointer-events-auto">
          <div
            className={`flex items-center justify-between rounded-2xl transition-all duration-300 ${
              isScrolled
                ? 'h-14 sm:h-15 px-3.5 sm:px-5 bg-white/95 dark:bg-zinc-950/92 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-xl shadow-zinc-950/10 dark:shadow-black/50'
                : 'h-16 sm:h-18 px-4 sm:px-6 bg-white/85 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-md shadow-zinc-950/5'
            }`}
          >
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group transition-transform duration-150 active:scale-95 shrink-0"
            >
              <div className="size-9 sm:size-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                <Aperture className="size-5 sm:size-6 stroke-[2.2]" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
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

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/studios"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/50 hover:border-amber-500/50 hover:bg-amber-500/5 text-xs text-zinc-500 dark:text-zinc-400 transition-all cursor-pointer group"
                title="Search all creative spaces (⌘K)"
              >
                <Search className="size-3.5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                <span className="hidden xl:inline text-xs font-medium">Search stages...</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:border-amber-500/40">
                  ⌘K
                </kbd>
              </Link>

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
                <div className="flex items-center gap-2">
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
                      className="flex items-center gap-2 p-1 sm:p-1.5 sm:pr-3 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/60 hover:border-amber-500/50 transition-all duration-150 shadow-2xs"
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
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/add-studio"
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-xs shadow-amber-500/20 flex items-center gap-1"
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
            <div className="lg:hidden absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = (
                    e.currentTarget.elements.namedItem('mobileSearch') as HTMLInputElement
                  )?.value;
                  setIsMobileMenuOpen(false);
                  router.push(q ? `/studios?search=${encodeURIComponent(q)}` : '/studios');
                }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  name="mobileSearch"
                  placeholder="Search stages, cities, amenities..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-amber-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
                />
              </form>

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
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
    </header>
  );
}
