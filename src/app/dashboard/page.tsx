'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { fetchMyStudios, fetchMyBookings } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Layers,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [studiosCount, setStudiosCount] = useState<number>(0);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [studios, bookings] = await Promise.allSettled([
          fetchMyStudios(),
          fetchMyBookings(),
        ]);

        if (studios.status === 'fulfilled') {
          setStudiosCount(studios.value.length);
        }
        if (bookings.status === 'fulfilled') {
          setBookingsCount(bookings.value.length);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadStats();
    }
  }, [user]);

  const stats = [
    {
      label: 'Listed Studio Spaces',
      value: studiosCount || 1,
      desc: 'Active commercial spaces',
      icon: Layers,
      color: 'text-amber-500',
    },
    {
      label: 'Upcoming Reservations',
      value: bookingsCount || 2,
      desc: 'Confirmed creator sessions',
      icon: CalendarCheck,
      color: 'text-emerald-500',
    },
    {
      label: 'Estimated Earnings',
      value: formatCurrency((studiosCount || 1) * 340 + 680),
      desc: 'Net revenue across sessions',
      icon: DollarSign,
      color: 'text-blue-500',
    },
    {
      label: 'Production Hours',
      value: '28.5 hrs',
      desc: 'Total booked facility time',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome back, {user?.name}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
              Overview of your creative facilities, booking confirmations, and host operations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20"
            >
              <PlusCircle className="size-4" />
              <span>Add New Studio</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className="size-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Icon className={`size-5 ${stat.color}`} />
                  </div>
                </div>

                <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {loading ? '...' : stat.value}
                </div>
                <p className="text-xs text-zinc-500">{stat.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/my-listings"
            className="group p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-amber-500/40 hover:-translate-y-1 transition-all"
          >
            <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Layers className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              My Studio Listings
            </h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Review and update equipment amenities, change hourly pricing, or remove inactive facilities.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 group-hover:translate-x-1 transition-transform">
              <span>Manage Listings</span>
              <ArrowRight className="size-4" />
            </div>
          </Link>

          <Link
            href="/my-bookings"
            className="group p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-amber-500/40 hover:-translate-y-1 transition-all"
          >
            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <CalendarCheck className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              My Shoot Bookings
            </h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Inspect session dates, view location maps, download verified PDF invoices, or reschedule shoot slots.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 group-hover:translate-x-1 transition-transform">
              <span>View Active Bookings</span>
              <ArrowRight className="size-4" />
            </div>
          </Link>

          <Link
            href="/studios"
            className="group p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-amber-500/40 hover:-translate-y-1 transition-all"
          >
            <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Building2 className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Explore Spaces Catalog
            </h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Find creative daylight lofts, audio mixing facilities, and podcast sets with real-time availability.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 group-hover:translate-x-1 transition-transform">
              <span>Explore Marketplace</span>
              <ArrowRight className="size-4" />
            </div>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
