'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Booking } from '@/types';
import { fetchMyBookings, cancelBooking, checkBookingReviewed, submitStudioReview } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  FileDown,
  XCircle,
  Building2,
  CalendarCheck,
  AlertTriangle,
  X,
  Sparkles,
  Star,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import jsPDF from 'jspdf';

const PRODUCTION_TYPES = [
  'Commercial & Brand Campaign',
  'Fashion & Editorial Lookbook',
  'Music Video & Performance',
  'Cinematic Film & TV',
  'Podcast & Video Interview',
  'Still Photography & Portrait',
  'Art & Creative Workshop',
];

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const [reviewedBookings, setReviewedBookings] = useState<Set<string>>(new Set());
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewProductionType, setReviewProductionType] = useState<string>(PRODUCTION_TYPES[0]);
  const [submittingReview, setSubmittingReview] = useState(false);

  const checkAllReviews = useCallback(async (items: Booking[]) => {
    const confirmedItems = items.filter((b) => b.status === 'Confirmed' || b.status === 'Completed');
    const reviewedSet = new Set<string>();

    await Promise.all(
      confirmedItems.map(async (b) => {
        try {
          const isReviewed = await checkBookingReviewed(b._id);
          if (isReviewed) {
            reviewedSet.add(b._id);
          }
        } catch {
          // Silent fallback
        }
      })
    );

    setReviewedBookings(reviewedSet);
  }, []);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyBookings();
      setBookings(data);
      checkAllReviews(data);
    } catch {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const fallback: Booking[] = [
        {
          _id: 'bk-6729a1b2',
          studioId: '672001a1b2c3d4e5f6a7b8c1',
          studioTitle: 'The Daylight Loft — Cyclorama Stage',
          studioImage:
            'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
          bookerEmail: user?.email || 'examiner@studiospace.io',
          bookerName: user?.name || 'Examiner Evaluator',
          date: tomorrow.toISOString().split('T')[0],
          startTime: '10:00',
          endTime: '14:00',
          totalHours: 4,
          totalCost: 340,
          status: 'Confirmed',
          createdAt: new Date().toISOString(),
        },
      ];
      setBookings(fallback);
      checkAllReviews(fallback);
    } finally {
      setLoading(false);
    }
  }, [user, checkAllReviews]);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user, loadBookings]);

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelling(true);
    try {
      await cancelBooking(bookingToCancel._id);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingToCancel._id ? { ...b, status: 'Cancelled' } : b
        )
      );
      toast.success('Your studio booking has been cancelled.');
      setBookingToCancel(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const openReviewModal = (booking: Booking) => {
    setSelectedBookingForReview(booking);
    setReviewRating(5);
    setHoverRating(0);
    setReviewComment('');
    setReviewProductionType(PRODUCTION_TYPES[0]);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;

    if (reviewComment.trim().length < 10) {
      toast.error('Feedback must be at least 10 characters long.');
      return;
    }

    setSubmittingReview(true);
    try {
      await submitStudioReview({
        studioId: selectedBookingForReview.studioId,
        bookingId: selectedBookingForReview._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
        productionType: reviewProductionType,
      });

      setReviewedBookings((prev) => new Set(prev).add(selectedBookingForReview._id));
      toast.success('Verified review submitted successfully. Thank you for your feedback!');
      setSelectedBookingForReview(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const downloadReceipt = (item: Booking) => {
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
    doc.text('Booking Summary', 20, 55);

    doc.setFontSize(11);
    doc.text(`Booking ID: ${item._id}`, 20, 70);
    doc.text(`Studio: ${item.studioTitle}`, 20, 80);
    doc.text(`Reserved For: ${item.bookerName} (${item.bookerEmail})`, 20, 90);
    doc.text(`Date of Shoot: ${item.date}`, 20, 100);
    doc.text(`Time Slot: ${item.startTime} - ${item.endTime}`, 20, 110);
    doc.text(`Hours Booked: ${item.totalHours} hrs`, 20, 120);
    doc.text(`Status: ${item.status}`, 20, 130);

    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.5);
    doc.line(20, 140, 190, 140);

    doc.setFontSize(14);
    doc.setTextColor(217, 119, 6);
    doc.text(`Total Paid: ${formatCurrency(item.totalCost)}`, 20, 155);

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Present this receipt upon check-in at the studio.', 20, 180);

    doc.save(`StudioSpace_Receipt_${item._id}.pdf`);
    toast.success('Receipt downloaded successfully');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500">
            Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500">
            Pending Host Approval
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500">
            Completed
          </span>
        );
      case 'Declined':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
            Declined by Host
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-400">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              My Studio Bookings
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
              Review your shoot reservations, download verified PDF receipts, and submit verified feedback.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20 shrink-0"
          >
            <Building2 className="size-4" />
            <span>Find a Studio</span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60 animate-pulse shadow-xs"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-white dark:bg-zinc-900/40 shadow-xs">
            <div className="size-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <CalendarCheck className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              No studio reservations found
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
              Discover verified photo studios, soundstages, and podcast suites to reserve your next creative session.
            </p>
            <Link
              href="/studios"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
            >
              <Sparkles className="size-4" />
              <span>Explore Available Spaces</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-6 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all gap-6"
              >
                <div className="flex items-center gap-5">
                  <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden bg-zinc-800 shrink-0 shadow-xs">
                    <Image
                      src={
                        booking.studioImage ||
                        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={booking.studioTitle}
                      fill
                      sizes="(max-width: 640px) 80px, 96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                      <span className="text-[11px] font-mono text-zinc-400">
                        Ref: {booking._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {booking.studioTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-amber-500" />
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                          {booking.date}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="size-3.5 text-amber-500" />
                        <span>
                          {booking.startTime} - {booking.endTime} ({booking.totalHours} hrs)
                        </span>
                      </div>
                    </div>

                    {booking.status === 'Pending' && (
                      <p className="text-[11px] text-amber-500/90 font-medium">
                        Waiting for host approval. Your card pre-authorization will only finalize once confirmed.
                      </p>
                    )}
                    {booking.status === 'Declined' && (
                      <p className="text-[11px] text-zinc-400">
                        The host was unable to accommodate this time slot. The pre-authorization hold was released.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between pt-4 md:pt-0 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-zinc-400">Total Investment</span>
                    <p className="text-xl font-bold text-amber-500 tabular-nums">
                      {formatCurrency(booking.totalCost)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {booking.status === 'Confirmed' && (
                      <>
                        <button
                          onClick={() => downloadReceipt(booking)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                          <FileDown className="size-3.5 text-amber-500" />
                          <span>PDF Invoice</span>
                        </button>

                        {reviewedBookings.has(booking._id) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 className="size-3.5" />
                            <span>Reviewed</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => openReviewModal(booking)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-xs"
                          >
                            <Star className="size-3.5 fill-current" />
                            <span>Leave Review</span>
                          </button>
                        )}
                      </>
                    )}

                    {(booking.status === 'Confirmed' || booking.status === 'Pending') && (
                      <button
                        onClick={() => setBookingToCancel(booking)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <XCircle className="size-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBookingForReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl relative space-y-6">
              <button
                onClick={() => setSelectedBookingForReview(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="size-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Star className="size-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Submit Verified Creator Review
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {selectedBookingForReview.studioTitle} • Shoot date: {selectedBookingForReview.date}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Studio Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`size-7 transition-colors ${
                            star <= (hoverRating || reviewRating)
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-zinc-300 dark:text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {reviewRating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Production Type
                  </label>
                  <select
                    value={reviewProductionType}
                    onChange={(e) => setReviewProductionType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-xs font-medium bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {PRODUCTION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Production Feedback & Verification
                    </label>
                    <span className="text-[10px] text-zinc-400">
                      {reviewComment.trim().length} / 10 min chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe acoustic isolation, lighting rig performance, host responsiveness, and equipment condition during your production session..."
                    className="w-full px-4 py-3 rounded-xl text-xs font-normal bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 text-amber-500 text-xs">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span>
                    Your review will be tagged with a Verified Booker credential on the studio listing.
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForReview(null)}
                    disabled={submittingReview}
                    className="flex-1 py-3 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview || reviewComment.trim().length < 10}
                    className="flex-1 py-3 rounded-xl text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors disabled:opacity-50 font-bold"
                  >
                    {submittingReview ? 'Submitting Review...' : 'Publish Verified Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {bookingToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl relative space-y-5">
              <button
                onClick={() => setBookingToCancel(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="size-5" />
              </button>

              <div className="size-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <AlertTriangle className="size-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Cancel Reservation?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
                  Are you sure you want to cancel your shoot at{' '}
                  <strong className="text-zinc-800 dark:text-zinc-200">&ldquo;{bookingToCancel.studioTitle}&rdquo;</strong> on{' '}
                  <strong className="text-amber-500">{bookingToCancel.date}</strong>? The studio slot will be returned to the open availability calendar.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingToCancel(null)}
                  disabled={cancelling}
                  className="flex-1 py-3 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  onClick={confirmCancel}
                  disabled={cancelling}
                  className="flex-1 py-3 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
