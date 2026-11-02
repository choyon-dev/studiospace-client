'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Studio } from '@/types';
import { fetchStudioById, createBooking } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Star,
  MapPin,
  Users,
  Shield,
  Clock,
  Calendar,
  CheckCircle2,
  X,
  FileDown,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import jsPDF from 'jspdf';

export default function StudioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-11-01');
  const [minDate, setMinDate] = useState('2026-11-01');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await fetchStudioById(id);
        setStudio(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const calculateHours = () => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const diff = endH * 60 + endM - (startH * 60 + startM);
    return diff > 0 ? Math.round((diff / 60) * 10) / 10 : 0;
  };

  const totalHours = calculateHours();
  const totalCost = studio ? Math.round(studio.hourlyRate * totalHours) : 0;

  const handleOpenBooking = () => {
    if (!user) {
      toast.info('Please sign in or register to book this creative studio.');
      router.push(`/login?redirect=/studios/${id}`);
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studio || !user) return;

    if (totalHours <= 0) {
      toast.error('End time must be at least 1 hour after start time.');
      return;
    }

    setBookingSubmitting(true);
    try {
      const res = await createBooking({
        studioId: studio._id,
        date: bookingDate,
        startTime,
        endTime,
        totalHours,
        totalCost,
      });

      setConfirmedBooking(res);
      toast.success('Studio booking confirmed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Collision detected. This slot is already reserved.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const downloadPdfInvoice = () => {
    if (!confirmedBooking || !studio) return;
    const doc = new jsPDF();

    doc.setFillColor(15, 15, 18);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(22);
    doc.text('StudioSpace Official Receipt', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Peer-to-Peer Creative Production Marketplace', 20, 33);

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.text('Booking Confirmation Details', 20, 55);

    doc.setFontSize(11);
    doc.text(`Booking Reference ID: ${confirmedBooking._id || 'CONF-8921'}`, 20, 70);
    doc.text(`Studio: ${studio.title}`, 20, 80);
    doc.text(`Category: ${studio.category}`, 20, 90);
    doc.text(`Location: ${studio.location}`, 20, 100);
    doc.text(`Booked By: ${user?.name} (${user?.email})`, 20, 110);
    doc.text(`Shoot Date: ${confirmedBooking.date}`, 20, 120);
    doc.text(`Time Slot: ${confirmedBooking.startTime} - ${confirmedBooking.endTime}`, 20, 130);
    doc.text(`Duration: ${confirmedBooking.totalHours} hours`, 20, 140);
    doc.text(`Hourly Rate: $${studio.hourlyRate} / hr`, 20, 150);

    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.5);
    doc.line(20, 160, 190, 160);

    doc.setFontSize(14);
    doc.setTextColor(217, 119, 6);
    doc.text(`Total Amount Paid: $${confirmedBooking.totalCost}`, 20, 175);

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Thank you for creating with StudioSpace. 24/7 host concierge available.', 20, 200);

    doc.save(`StudioSpace_Receipt_${confirmedBooking._id || 'confirmed'}.pdf`);
    toast.success('PDF invoice downloaded successfully');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="aspect-[21/9] w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-20 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Studio Not Found</h2>
        <p className="text-sm text-zinc-500">The requested creative workspace does not exist or has been removed.</p>
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-semibold text-xs"
        >
          <ArrowLeft className="size-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/studios"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Back to All Studios</span>
      </Link>

      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl overflow-hidden mb-10 shadow-xl">
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        <div className="absolute top-4 left-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-950/80 backdrop-blur-md text-amber-400">
            {studio.category}
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-300 mb-2">
              <MapPin className="size-4 text-amber-500" />
              <span>{studio.location}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {studio.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-zinc-950/80 backdrop-blur-md px-4 py-2 rounded-2xl shrink-0">
            <Star className="size-5 fill-amber-400 text-amber-400" />
            <span className="text-lg font-bold text-white tabular-nums">{studio.rating.toFixed(1)}</span>
            <span className="text-xs text-zinc-400">({studio.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/60 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Workspace Overview
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {studio.overview}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
                <span className="text-[11px] text-zinc-400 font-semibold uppercase">Max Capacity</span>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  <Users className="size-4 text-amber-500" />
                  <span>Up to {studio.maxCapacity} people</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
                <span className="text-[11px] text-zinc-400 font-semibold uppercase">Security Deposit</span>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  <Shield className="size-4 text-amber-500" />
                  <span>{formatCurrency(studio.securityDeposit)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
                <span className="text-[11px] text-zinc-400 font-semibold uppercase">Booking Policy</span>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  <Clock className="size-4 text-amber-500" />
                  <span>Instant Approval</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/60 shadow-sm space-y-5">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Included Production Amenities & Gear
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {studio.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  <CheckCircle2 className="size-4 text-amber-500 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/60 shadow-sm flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative size-14 rounded-2xl overflow-hidden border-2 border-amber-500/40">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                  alt={studio.ownerName}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                  Verified Host
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{studio.ownerName}</h3>
                <p className="text-xs text-zinc-500">{studio.ownerEmail}</p>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-xs text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">100% Response Rate</span>
              <span>Typically replies within 15 min</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/60 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Recent Creator Feedback
              </h2>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-500">
                <Sparkles className="size-4" />
                <span>Verified Bookings</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Jordan Hayes</span>
                  <div className="flex text-amber-400">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i}>{s}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  The daylight in this space is breathtaking. We wrapped our fashion lookbook shoot two hours ahead of schedule thanks to the pre-rigged Profoto strobes. Pristine condition and wonderful host.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Devon Cole</span>
                  <div className="flex text-amber-400">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i}>{s}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Acoustic treatment is grade A. Zero bleed from street traffic. Tracking drums was effortless and the monitored playback through the Genelec system was reference caliber.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-baseline justify-between pb-5">
              <div>
                <span className="text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {formatCurrency(studio.hourlyRate)}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400"> / hour</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400">Security Deposit:</span>
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {formatCurrency(studio.securityDeposit)}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Instant confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Double-booking collision protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Free cancellation up to 24h prior</span>
              </div>
            </div>

            <button
              onClick={handleOpenBooking}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
            >
              Book Workspace Now
            </button>

            <p className="text-center text-[11px] text-zinc-400">
              You won&apos;t be billed until host approves your session time slot
            </p>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setIsBookingModalOpen(false);
                setConfirmedBooking(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="size-5" />
            </button>

            {confirmedBooking ? (
              <div className="text-center space-y-4 py-4">
                <div className="size-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Reservation Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto">
                  Your reservation for <strong className="text-zinc-800 dark:text-zinc-200">{studio.title}</strong> on{' '}
                  <strong className="text-amber-600 dark:text-amber-400">{confirmedBooking.date}</strong> from{' '}
                  <strong className="text-amber-600 dark:text-amber-400">{confirmedBooking.startTime} to {confirmedBooking.endTime}</strong> has been secured.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={downloadPdfInvoice}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <FileDown className="size-4 text-amber-500" />
                    <span>Download PDF Invoice</span>
                  </button>

                  <Link
                    href="/my-bookings"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
                  >
                    <span>View My Bookings</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Reserve {studio.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Select your production shoot date and reserved hours.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Select Shoot Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                      type="date"
                      value={bookingDate}
                      min={minDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Start Time
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(
                        (t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      End Time
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map(
                        (t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-950 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Duration:</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalHours} Hours</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Rate:</span>
                    <span>${studio.hourlyRate} / hr</span>
                  </div>
                  <div className="pt-2 flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    <span>Total Shoot Cost:</span>
                    <span className="text-amber-600 dark:text-amber-400">{formatCurrency(totalCost)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingSubmitting || totalHours <= 0}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {bookingSubmitting ? 'Checking Availability...' : 'Confirm Instant Reservation'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
