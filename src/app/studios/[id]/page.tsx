'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Studio, Review } from '@/types';
import { fetchStudioById, createBooking, fetchStudioBookedSlots, fetchStudioReviews, checkStudioWishlist, toggleWishlist } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { slugify, getStudioUrl } from '@/lib/slug';
import StudioCarousel from '@/components/StudioCarousel';
import { toast } from 'sonner';
import {
  Star,
  MapPin,
  Calendar,
  Check,
  X,
  FileDown,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  CreditCard,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Loader2,
  Heart,
} from 'lucide-react';
import jsPDF from 'jspdf';

export default function StudioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const rawId = (params?.id as string) || '';

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFloatingDock, setShowFloatingDock] = useState(false);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [bookingDate, setBookingDate] = useState('2026-11-01');
  const [minDate, setMinDate] = useState('2026-11-01');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  const [bookedSlots, setBookedSlots] = useState<Array<{ startTime: string; endTime: string; status: string }>>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [cardholderName, setCardholderName] = useState(user?.name || 'Production Lead');
  const [cardZip, setCardZip] = useState('10001');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'generic'>('visa');
  const [paymentStage, setPaymentStage] = useState<0 | 1 | 2 | 3>(0);
  const [authCode, setAuthCode] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setCardholderName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (studio?._id && user) {
      checkStudioWishlist(studio._id).then(setIsFavorited).catch(() => {});
    }
  }, [studio?._id, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please log in to save studios to your wishlist');
      return;
    }
    if (!studio?._id || isTogglingWishlist) return;

    const prev = isFavorited;
    setIsFavorited(!prev);
    setIsTogglingWishlist(true);

    try {
      const res = await toggleWishlist(studio._id);
      setIsFavorited(res.isFavorited);
      if (res.isFavorited) {
        toast.success('Studio saved to your wishlist');
      } else {
        toast.info('Studio removed from your wishlist');
      }
    } catch (err: any) {
      setIsFavorited(prev);
      toast.error(err.message || 'Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingDock(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    async function load() {
      if (!rawId) return;
      try {
        const data = await fetchStudioById(rawId);
        if (data) {
          setStudio(data);
          const cleanSlug = data.slug || slugify(data.title.split('-')[0].trim());
          if (cleanSlug && typeof window !== 'undefined' && rawId !== cleanSlug) {
            window.history.replaceState(null, '', `/studios/${cleanSlug}`);
          }
        }
      } catch (err) {
        console.error('Failed to load studio:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [rawId]);

  useEffect(() => {
    async function loadSlots() {
      if (!studio?._id || !bookingDate) return;
      setSlotsLoading(true);
      try {
        const slots = await fetchStudioBookedSlots(studio._id, bookingDate);
        setBookedSlots(slots);
      } catch {
        setBookedSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }
    loadSlots();
  }, [studio?._id, bookingDate]);

  useEffect(() => {
    async function loadReviews() {
      if (!studio?._id) return;
      try {
        const data = await fetchStudioReviews(studio._id);
        setReviews(data);
      } catch {
        setReviews([]);
      }
    }
    loadReviews();
  }, [studio?._id]);

  const bookedHours = React.useMemo(() => {
    const set = new Set<number>();
    bookedSlots.forEach((slot) => {
      if (slot.status === 'Cancelled') return;
      const startH = parseInt(slot.startTime.split(':')[0], 10);
      const endH = parseInt(slot.endTime.split(':')[0], 10);
      for (let h = startH; h < endH; h++) {
        set.add(h);
      }
    });
    return set;
  }, [bookedSlots]);

  const hasTimeCollision = React.useMemo(() => {
    const [startH] = startTime.split(':').map(Number);
    const [endH] = endTime.split(':').map(Number);
    if (endH <= startH) return true;
    for (let h = startH; h < endH; h++) {
      if (bookedHours.has(h)) return true;
    }
    return false;
  }, [startTime, endTime, bookedHours]);

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
      toast.info('Please sign in to reserve this creative workspace.');
      router.push(`/login?redirect=${encodeURIComponent(getStudioUrl(studio || { _id: rawId }))}`);
      return;
    }
    setBookingStep(1);
    setConfirmedBooking(null);
    setPaymentStage(0);
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setBookingStep(1);
    setConfirmedBooking(null);
    setPaymentStage(0);
  };

  const handleSlotClick = (h: number) => {
    if (bookedHours.has(h)) return;

    const currentStartH = parseInt(startTime.split(':')[0], 10);
    const currentEndH = parseInt(endTime.split(':')[0], 10);

    if (h < currentStartH || (currentEndH - currentStartH > 1 && h === currentStartH)) {
      setStartTime(`${String(h).padStart(2, '0')}:00`);
      setEndTime(`${String(h + 1).padStart(2, '0')}:00`);
      return;
    }

    if (h >= currentStartH) {
      const candidateEnd = h + 1;
      let collision = false;
      for (let checkH = currentStartH; checkH < candidateEnd; checkH++) {
        if (bookedHours.has(checkH)) {
          collision = true;
          break;
        }
      }
      if (collision) {
        toast.error('Selected interval conflicts with an existing reservation.');
        setStartTime(`${String(h).padStart(2, '0')}:00`);
        setEndTime(`${String(h + 1).padStart(2, '0')}:00`);
      } else {
        setEndTime(`${String(candidateEnd).padStart(2, '0')}:00`);
      }
    }
  };

  const handleCardNumberChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    let brand: 'visa' | 'mastercard' | 'amex' | 'generic' = 'generic';

    if (digitsOnly.startsWith('4')) {
      brand = 'visa';
    } else if (/^(5[1-5]|2[2-7])/.test(digitsOnly)) {
      brand = 'mastercard';
    } else if (/^3[47]/.test(digitsOnly)) {
      brand = 'amex';
    }
    setCardBrand(brand);

    let formatted = '';
    if (brand === 'amex') {
      const trimmed = digitsOnly.slice(0, 15);
      const part1 = trimmed.slice(0, 4);
      const part2 = trimmed.slice(4, 10);
      const part3 = trimmed.slice(10, 15);
      formatted = [part1, part2, part3].filter(Boolean).join(' ');
    } else {
      const trimmed = digitsOnly.slice(0, 16);
      const parts = trimmed.match(/.{1,4}/g);
      formatted = parts ? parts.join(' ') : trimmed;
    }
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 4);
    if (digitsOnly.length >= 3) {
      setCardExpiry(`${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`);
    } else {
      setCardExpiry(digitsOnly);
    }
  };

  const handleCvcChange = (val: string) => {
    const maxLen = cardBrand === 'amex' ? 4 : 3;
    const digitsOnly = val.replace(/\D/g, '').slice(0, maxLen);
    setCardCvc(digitsOnly);
  };

  const handleProceedToPayment = () => {
    if (totalHours <= 0) {
      toast.error('End time must be after start time.');
      return;
    }
    if (hasTimeCollision) {
      toast.error('Selected hours overlap with an existing booking. Please pick available hours.');
      return;
    }
    setBookingStep(2);
  };

  const handleAuthorizePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studio || !user) return;

    const rawDigits = cardNumber.replace(/\D/g, '');
    if (rawDigits.length < 15) {
      toast.error('Please enter a valid card number.');
      return;
    }
    if (cardExpiry.length < 5) {
      toast.error('Please enter a valid expiration date (MM/YY).');
      return;
    }
    if (cardCvc.length < 3) {
      toast.error('Please enter a valid CVC code.');
      return;
    }
    if (!cardholderName.trim()) {
      toast.error('Cardholder name is required.');
      return;
    }

    setBookingSubmitting(true);
    setPaymentStage(1);

    await new Promise((r) => setTimeout(r, 700));
    setPaymentStage(2);

    await new Promise((r) => setTimeout(r, 700));
    setPaymentStage(3);

    const generatedAuth = `AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
    setAuthCode(generatedAuth);

    try {
      const res = await createBooking({
        studioId: studio._id,
        date: bookingDate,
        startTime,
        endTime,
        totalHours,
        totalCost,
      });

      await new Promise((r) => setTimeout(r, 600));
      setConfirmedBooking(res);
      setBookingStep(3);
      toast.success('Production workspace reservation and pre-authorization secured!');
    } catch (err: any) {
      toast.error(err.message || 'Payment pre-authorization or slot reservation failed.');
      setBookingStep(1);
    } finally {
      setBookingSubmitting(false);
      setPaymentStage(0);
    }
  };

  const downloadPdfInvoice = () => {
    if (!confirmedBooking || !studio) return;
    const doc = new jsPDF();

    doc.setFillColor(15, 15, 18);
    doc.rect(0, 0, 210, 42, 'F');

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(20);
    doc.text('StudioSpace Official Tax Receipt & Permit', 20, 22);

    doc.setFontSize(9);
    doc.setTextColor(220, 220, 220);
    doc.text('Peer-to-Peer Production Marketplace • Enterprise Security Guarantee', 20, 32);

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(13);
    doc.text('Reservation & Billing Summary', 20, 56);

    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text(`Booking Reference ID: ${confirmedBooking._id || 'CONF-8921'}`, 20, 68);
    doc.text(`Studio: ${studio.title}`, 20, 76);
    doc.text(`Category: ${studio.category}`, 20, 84);
    doc.text(`Location: ${studio.location}`, 20, 92);
    doc.text(`Host Contact: ${studio.ownerName} (${studio.ownerEmail})`, 20, 100);
    doc.text(`Booking Status: ${confirmedBooking.status || 'Confirmed'}`, 20, 108);

    doc.text(`Booked By: ${user?.name || cardholderName} (${user?.email})`, 20, 118);
    doc.text(`Shoot Date: ${confirmedBooking.date}`, 20, 126);
    doc.text(`Reserved Hours: ${confirmedBooking.startTime} - ${confirmedBooking.endTime} (${confirmedBooking.totalHours} hrs)`, 20, 134);
    doc.text(`Hourly Rate: $${studio.hourlyRate}.00 / hr`, 20, 142);

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(20, 148, 190, 148);

    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text('Facility Rental Subtotal:', 20, 154);
    doc.text(`$${confirmedBooking.totalCost}.00`, 190, 154, { align: 'right' });

    doc.text('Pre-Rigging & Load-In Prep:', 20, 162);
    doc.text('$0.00 (Included)', 190, 162, { align: 'right' });

    doc.text('Refundable Security Deposit Authorization Hold:', 20, 170);
    doc.text(`$${studio.securityDeposit || 0}.00`, 190, 170, { align: 'right' });

    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.8);
    doc.line(20, 176, 190, 176);

    doc.setFontSize(13);
    doc.setTextColor(217, 119, 6);
    doc.text('Total Pre-Authorized Guarantee:', 20, 186);
    doc.text(`$${confirmedBooking.totalCost + (studio.securityDeposit || 0)}.00`, 190, 186, { align: 'right' });

    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    const maskedCard = `•••• •••• •••• ${cardNumber.replace(/\D/g, '').slice(-4) || '4242'}`;
    doc.text(`Payment Instrument: ${cardBrand.toUpperCase()} (${maskedCard})`, 20, 198);
    doc.text(`Bank Authorization Code: ${authCode || 'AUTH-849201'}`, 20, 206);
    doc.text('Deposit Status: Active Authorization Hold (releases 24h post-wrap inspection)', 20, 214);

    doc.setDrawColor(240, 240, 240);
    doc.line(20, 222, 190, 222);

    doc.setFontSize(8.5);
    doc.setTextColor(130, 130, 130);
    doc.text('StudioSpace Inc. • 24/7 Verified Host Concierge & Incident Mediation Support', 20, 234);
    doc.text('For location access codes or staging logistics, contact your verified host via the platform.', 20, 242);

    doc.save(`StudioSpace_Receipt_${confirmedBooking._id || 'confirmed'}.pdf`);
    toast.success('Official PDF receipt downloaded successfully.');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-6">
        <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="aspect-[21/9] w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          </div>
          <div className="h-72 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Studio Not Found</h2>
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

  const specs = studio.specs || {
    squareFeet: 2000,
    ceilingHeight: '16 ft',
    floorType: 'Polished Concrete',
    powerService: '200A 3-Phase',
    soundRating: 'STC 55 Acoustic Treatment',
    hvacType: 'Silent Whisper Air',
    freightAccess: 'Ground Floor Direct Loading',
    lightingControl: 'Motorized Blackout',
    internetSpeed: '1 Gbps Fiber',
    parkingSpaces: '2 Dedicated Spaces',
  };

  const osmUrl = studio.coordinates
    ? `https://www.openstreetmap.org/?mlat=${studio.coordinates.lat}&mlon=${studio.coordinates.lon}#map=16/${studio.coordinates.lat}/${studio.coordinates.lon}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(studio.location)}`;

  const studioImages = studio.images && studio.images.length > 0 ? studio.images : [studio.imageUrl];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-2 truncate">
          <Link href="/studios" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Studios
          </Link>
          <span>/</span>
          {studio.city && (
            <>
              <Link
                href={`/studios?hub=${encodeURIComponent(studio.city)}`}
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                {studio.city}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate">{studio.title}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleFavoriteToggle}
            disabled={isTogglingWishlist}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isFavorited
                ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Heart className={`size-3.5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{isFavorited ? 'Saved Space' : 'Save Space'}</span>
          </button>
        </div>
      </div>

      <StudioCarousel images={studioImages} title={studio.title} />

      <div className="space-y-6 pt-2">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] px-2.5 py-1 rounded-md bg-amber-500/10">
              {studio.category}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <MapPin className="size-3.5 text-amber-500 shrink-0" />
              <span>{studio.location}</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <div className="flex items-center gap-1 text-zinc-900 dark:text-zinc-100 font-semibold tabular-nums">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span>{studio.rating.toFixed(1)}</span>
              <span className="text-zinc-400 font-normal">({studio.reviewCount} reviews)</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {studio.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span>Curated creative space hosted by <strong className="text-zinc-800 dark:text-zinc-200 font-medium">{studio.ownerName}</strong></span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="size-3.5" />
              <span>Verified Workspace</span>
            </span>
            <span>•</span>
            <span className="text-zinc-600 dark:text-zinc-400">
              {studio.bookingMode === 'Request' ? 'Request to Book (Host Approval)' : 'Instant Booking Available'}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-baseline gap-4 sm:gap-8">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-mono text-zinc-400">Session Rate</div>
              <div className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums mt-0.5">
                {formatCurrency(studio.hourlyRate)}
                <span className="text-xs sm:text-sm font-normal text-zinc-400"> / hour</span>
              </div>
            </div>
            {studio.securityDeposit > 0 && (
              <div className="border-l border-zinc-200/80 dark:border-zinc-800 pl-4 sm:pl-8">
                <div className="text-[11px] uppercase tracking-wider font-mono text-zinc-400">Refundable Deposit</div>
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 tabular-nums mt-1">
                  {formatCurrency(studio.securityDeposit)}
                </div>
              </div>
            )}
            <div className="hidden sm:block border-l border-zinc-200/80 dark:border-zinc-800 pl-8">
              <div className="text-[11px] uppercase tracking-wider font-mono text-zinc-400">Scale & Headcount</div>
              <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 tabular-nums mt-1">
                {specs.squareFeet.toLocaleString()} sq.ft • Up to {studio.maxCapacity} crew
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Map View</span>
              <ExternalLink className="size-3.5" />
            </a>
            <button
              onClick={handleOpenBooking}
              className="px-8 py-3.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-98 transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2"
            >
              <Calendar className="size-3.5" />
              <span>Book Workspace Now</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Usable Area</div>
          <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {specs.squareFeet.toLocaleString()} <span className="text-xs font-normal text-zinc-400">sq.ft</span>
          </div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Clear Height</div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
            {specs.ceilingHeight}
          </div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Power Service</div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
            {specs.powerService}
          </div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Sound Rating</div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
            {specs.soundRating}
          </div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Max Headcount</div>
          <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {studio.maxCapacity} <span className="text-xs font-normal text-zinc-400">crew members</span>
          </div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Loading Access</div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
            {specs.freightAccess}
          </div>
        </div>
      </div>

      <div className="space-y-14 sm:space-y-16 pt-2">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Space Narrative & Architectural Overview
          </h2>
          <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line max-w-5xl">
            {studio.overview}
          </p>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Studio Specifications
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Verified space specifications and amenities on-site
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-4">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono text-[11px] text-amber-600 dark:text-amber-400">
                Spatial & Structural
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Floor Construction</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">{specs.floorType}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Ceiling Clearance</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">{specs.ceilingHeight}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Usable Footprint</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">{specs.squareFeet.toLocaleString()} sq.ft</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Max Headcount</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">Up to {studio.maxCapacity} crew</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-4">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono text-[11px] text-amber-600 dark:text-amber-400">
                Electrical & Rigging
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Power Service</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">{specs.powerService}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Lighting Controls</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">{specs.lightingControl}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Blackout System</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400 sm:text-right">
                    {specs.lightingControl.toLowerCase().includes('blackout') ? 'Blackout Certified' : 'Ambient Control'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Camlock Feeder</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">
                    {specs.powerService.toLowerCase().includes('camlock') ? 'Camlock Equipped' : '3-Phase Standard'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-4">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono text-[11px] text-amber-600 dark:text-amber-400">
                Acoustic & Environmental
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Soundproof Isolation</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">{specs.soundRating}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">HVAC Climate Unit</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">{specs.hvacType}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Noise Criteria</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">
                    {specs.hvacType.includes('NC') ? 'NC-20 Broadcast Standard' : 'Silent Air Handling'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Acoustic Isolation</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400 sm:text-right">
                    {specs.soundRating.toLowerCase().includes('soundproof') || specs.soundRating.includes('STC') ? 'Tested STC Envelope' : 'Acoustically Treated'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-4">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono text-[11px] text-amber-600 dark:text-amber-400">
                Access & Connectivity
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Loading Access</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">{specs.freightAccess}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Parking Service</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">{specs.parkingSpaces}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">Data Network</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">{specs.internetSpeed}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                  <span className="text-zinc-500 shrink-0">City / Location</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:text-right">
                    {studio.city || studio.location.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Included Production Amenities & Gear Packages
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Standard hardware and amenities included at no additional rental charge
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {studio.amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-200"
              >
                <div className="size-6 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Check className="size-3.5" />
                </div>
                <span className="font-medium">{amenity}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Verified Host & Production Guidelines
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              On-site operations, insurance standards, and reservation policies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="size-12 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-base shrink-0 ring-1 ring-amber-500/30">
                  {studio.ownerName ? studio.ownerName.charAt(0).toUpperCase() : 'H'}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{studio.ownerName}</div>
                  <div className="text-xs text-zinc-500 truncate">{studio.ownerEmail}</div>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Verified Host
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-3 border-t border-zinc-200/40 dark:border-zinc-800/40">
                <div className="flex items-center justify-between">
                  <span>Response Time:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Within 15 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Rate:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Guaranteed</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                <Clock className="size-4 text-amber-500" />
                <span>Production Logistics</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Freight access available for pre-call load-in. Certificate of Insurance (COI) required for crew sizes exceeding 15 members.
              </p>
              <div className="pt-2 text-[11px] text-zinc-500 space-y-1">
                <div>• Clean wrap standard enforced</div>
                <div>• Digital access code sent upon verification</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span>Protection & Guarantees</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Full 100% refund available for cancellations requested up to 24 hours prior to session start time.
              </p>
              <div className="pt-2 text-[11px] text-zinc-500 space-y-1">
                <div>• Collision-free automated slot locking</div>
                <div>• Zero upfront charges until confirmation</div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Verified Creator Feedback
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Feedback from verified production shoots and commercial recordings
              </p>
            </div>
            {studio.reviewCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{studio.rating.toFixed(1)}</span>
                <span>({studio.reviewCount} {studio.reviewCount === 1 ? 'verified review' : 'verified reviews'})</span>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 text-center space-y-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No Verified Reviews Yet</p>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Be the first verified creator to book and produce a creative session at {studio.title}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-xs">
                        {rev.bookerName ? rev.bookerName.slice(0, 2).toUpperCase() : 'CR'}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          <span>{rev.bookerName || 'Verified Creator'}</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                            <ShieldCheck className="size-3" />
                            <span>Verified Booker</span>
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {rev.productionType} • {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Booking'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="size-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div
        className={`fixed bottom-6 inset-x-0 z-40 px-4 sm:px-6 transition-all duration-300 pointer-events-none ${
          showFloatingDock && !isBookingModalOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto pointer-events-auto rounded-2xl bg-white/95 dark:bg-zinc-950/92 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl p-3.5 sm:px-6 sm:py-3.5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {studio.title}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {formatCurrency(studio.hourlyRate)}
              </span>
              <span>/ hr</span>
              <span>•</span>
              <span className={studio.bookingMode === 'Request' ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-emerald-600 dark:text-emerald-400'}>
                {studio.bookingMode === 'Request' ? 'Request to Book' : 'Instant Booking'}
              </span>
            </div>
          </div>

          <button
            onClick={handleOpenBooking}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-98 transition-all shadow-md shadow-amber-500/20 shrink-0 cursor-pointer"
          >
            Book Workspace Now
          </button>
        </div>
      </div>

      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl relative my-8 border border-zinc-200/80 dark:border-zinc-800">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center justify-between pb-5 mb-5 border-b border-zinc-100 dark:border-zinc-800/80 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  bookingStep === 1
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {bookingStep > 1 ? '✓' : '1'}
                </span>
                <span className={bookingStep === 1 ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-400'}>
                  Schedule & Slots
                </span>
              </div>

              <ChevronRight className="size-3.5 text-zinc-300 dark:text-zinc-700" />

              <div className="flex items-center gap-2">
                <span className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  bookingStep === 2
                    ? 'bg-amber-500 text-zinc-950'
                    : bookingStep === 3
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}>
                  {bookingStep > 2 ? '✓' : '2'}
                </span>
                <span className={bookingStep === 2 ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-400'}>
                  Payment Guarantee
                </span>
              </div>

              <ChevronRight className="size-3.5 text-zinc-300 dark:text-zinc-700" />

              <div className="flex items-center gap-2">
                <span className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  bookingStep === 3
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}>
                  3
                </span>
                <span className={bookingStep === 3 ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-400'}>
                  Confirmation
                </span>
              </div>
            </div>

            {bookingStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Schedule Production Session
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Select your production shoot date and click available hourly blocks to reserve.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Shoot Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                      type="date"
                      value={bookingDate}
                      min={minDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent dark:border-zinc-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Live Hourly Availability Matrix (08:00 - 22:00)
                    </span>
                    {slotsLoading ? (
                      <span className="text-[11px] text-amber-500 flex items-center gap-1">
                        <Loader2 className="size-3 animate-spin" /> Checking slots...
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {bookedHours.size} booked / {14 - bookedHours.size} available
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60">
                    {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((h) => {
                      const isBooked = bookedHours.has(h);
                      const currentStartH = parseInt(startTime.split(':')[0], 10);
                      const currentEndH = parseInt(endTime.split(':')[0], 10);
                      const isSelected = !isBooked && h >= currentStartH && h < currentEndH;
                      const isStart = !isBooked && h === currentStartH;
                      const isEnd = !isBooked && h === currentEndH - 1;

                      return (
                        <button
                          key={h}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSlotClick(h)}
                          className={`group relative flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                            isBooked
                              ? 'bg-zinc-100 dark:bg-zinc-900/60 text-zinc-400 dark:text-zinc-600 line-through cursor-not-allowed border border-transparent'
                              : isSelected
                              ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs scale-[1.02] border border-amber-400'
                              : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-amber-400 dark:hover:border-amber-500 border border-zinc-200 dark:border-zinc-800 cursor-pointer'
                          }`}
                        >
                          <span className="text-[11px] font-mono leading-none">
                            {String(h).padStart(2, '0')}:00
                          </span>
                          <span className="text-[9px] mt-1 font-sans opacity-80 leading-none">
                            {isBooked ? 'Booked' : isSelected ? (isStart ? 'Start' : isEnd ? 'Wrap' : 'Active') : 'Open'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Call Time (Start)
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent dark:border-zinc-800"
                    >
                      {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(
                        (t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Wrap Time (End)
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent dark:border-zinc-800"
                    >
                      {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(
                        (t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {hasTimeCollision && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>Selected time interval overlaps with an existing reservation. Choose an available slot.</span>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Reserved Session:</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{startTime} to {endTime} ({totalHours} Hours)</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Facility Rate:</span>
                    <span>${studio.hourlyRate}.00 / hr</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    <span>Rental Subtotal:</span>
                    <span className="text-amber-600 dark:text-amber-400">{formatCurrency(totalCost)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={totalHours <= 0 || hasTimeCollision}
                  className="w-full py-3.5 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-98 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment Guarantee</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}

            {bookingStep === 2 && (
              <form onSubmit={handleAuthorizePayment} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Payment Method & Security Hold
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Provide billing guarantee for studio session and refundable security deposit hold.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white shadow-xl border border-zinc-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-md bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-[10px]">
                        SS
                      </div>
                      <span className="text-xs font-bold tracking-wider font-mono text-zinc-200">
                        STUDIOSPACE GUARANTEE
                      </span>
                    </div>
                    <div className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                      {cardBrand}
                    </div>
                  </div>

                  <div className="font-mono text-base sm:text-lg tracking-widest text-zinc-100 py-2">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex items-end justify-between pt-2 text-[10px] uppercase font-mono text-zinc-400">
                    <div>
                      <div className="text-[8px] text-zinc-500">Cardholder</div>
                      <div className="text-zinc-200 font-semibold truncate max-w-[180px]">
                        {cardholderName || 'PRODUCTION LEAD'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[8px] text-zinc-500">Expires</div>
                      <div className="text-zinc-200 font-semibold">{cardExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent dark:border-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="MM/YY"
                        required
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent dark:border-zinc-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Security Code (CVC)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => handleCvcChange(e.target.value)}
                          placeholder="892"
                          required
                          className="w-full pl-8 pr-3 py-2 text-xs font-mono rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent dark:border-zinc-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="Production Lead"
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent dark:border-zinc-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value)}
                        placeholder="10001"
                        required
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-transparent dark:border-zinc-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Studio Production Rental ({totalHours} hrs @ ${studio.hourlyRate}/hr):</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">${totalCost}.00</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Facility Prep & Load-In Access:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Included ($0.00)</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Refundable Security Deposit Authorization Hold:</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">${studio.securityDeposit || 0}.00</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    <span>Total Pre-Authorization Amount:</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {formatCurrency(totalCost + (studio.securityDeposit || 0))}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-[11px] text-zinc-600 dark:text-zinc-400">
                  <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    Simulated Security Guarantee: The ${studio.securityDeposit || 0} deposit is an authorization hold and will automatically release 24 hours after shoot wrap inspection.
                  </span>
                </div>

                {bookingSubmitting ? (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2 text-center">
                    <Loader2 className="size-5 text-amber-500 animate-spin mx-auto" />
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-300">
                      {paymentStage === 1 && 'Verifying venue calendar lock...'}
                      {paymentStage === 2 && 'Authorizing card guarantee via banking network...'}
                      {paymentStage === 3 && 'Issuing production permit and booking reference...'}
                    </div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                      Step {paymentStage} of 3 completed
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className="px-4 py-3 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-98 transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Lock className="size-3.5" />
                      <span>
                        {studio.bookingMode === 'Request' ? 'Submit Booking Request' : 'Authorize & Secure Studio'} ({formatCurrency(totalCost + (studio.securityDeposit || 0))})
                      </span>
                    </button>
                  </div>
                )}
              </form>
            )}

            {bookingStep === 3 && confirmedBooking && (
              <div className="text-center space-y-5 py-3">
                <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                  <Check className="size-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {confirmedBooking.status === 'Pending'
                      ? 'Booking Request Submitted'
                      : 'Reservation & Pre-Authorization Confirmed'}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    {confirmedBooking.status === 'Pending' ? (
                      <>
                        Your shoot request for <strong className="text-zinc-800 dark:text-zinc-200">{studio.title}</strong> on{' '}
                        <strong className="text-amber-600 dark:text-amber-400">{confirmedBooking.date}</strong> from{' '}
                        <strong className="text-amber-600 dark:text-amber-400">{confirmedBooking.startTime} to {confirmedBooking.endTime}</strong> has been sent to the host. The pre-authorization hold is active and will finalize upon host confirmation.
                      </>
                    ) : (
                      <>
                        Your production session for <strong className="text-zinc-800 dark:text-zinc-200">{studio.title}</strong> on{' '}
                        <strong className="text-amber-600 dark:text-amber-400">{confirmedBooking.date}</strong> from{' '}
                        <strong className="text-amber-600 dark:text-amber-400">{confirmedBooking.startTime} to {confirmedBooking.endTime}</strong> has been secured.
                      </>
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2 text-xs text-left">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Booking Reference:</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{confirmedBooking._id || 'CONF-8921'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Bank Pre-Authorization:</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{authCode || 'AUTH-849201'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Payment Instrument:</span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-200">
                      {cardBrand.toUpperCase()} •••• {cardNumber.replace(/\D/g, '').slice(-4) || '4242'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Refundable Deposit Hold:</span>
                    <span className="text-zinc-800 dark:text-zinc-200">${studio.securityDeposit || 0}.00 (Hold active)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={downloadPdfInvoice}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    <FileDown className="size-4 text-amber-500" />
                    <span>Download Official PDF Receipt</span>
                  </button>

                  <Link
                    href="/my-bookings"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                  >
                    <span>View in My Bookings</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
