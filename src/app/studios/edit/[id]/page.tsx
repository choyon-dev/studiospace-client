'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import OsmLocationPicker from '@/components/OsmLocationPicker';
import { fetchStudioById, updateStudio, fetchStudioMeta, uploadToImgBB } from '@/lib/api';
import { StudioCategory, OsmLocationSuggestion, StudioSpecs } from '@/types';
import { toast } from 'sonner';
import {
  Upload,
  Sparkles,
  DollarSign,
  Users,
  Check,
  PlusCircle,
  FileText,
  ArrowLeft,
  Sliders,
  Cpu,
  ArrowRight,
  Maximize2,
  Wind,
  Truck,
  Sun,
  Wifi,
  Car,
  X,
} from 'lucide-react';

const DEFAULT_CATEGORIES: StudioCategory[] = [
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Workshop',
];

function formatCategoryTitle(str: string): string {
  return str
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const PRESET_AMENITIES = [
  'Profoto Strobe Lighting Kit',
  '20ft Infinity Cyclorama Wall',
  'Dolby Atmos Monitoring',
  'Genelec Studio Speakers',
  'Shure SM7B Broadcast Microphones',
  '4K Sony Cinema Cameras',
  'Motorized Overhead Light Truss',
  'Soundproof Acoustic Treatment (STC 65)',
  'Hair & Makeup Dressing Suite',
  'Freight Elevator & Loading Dock',
  '3-Phase 200A Camlock Power',
  'High-Speed 1Gbps Fiber Internet',
  'Digital Electric Ceramic Kiln',
  'Pottery Wheels & Artisan Tools',
];

export default function EditStudioPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [categories, setCategories] = useState<StudioCategory[]>(DEFAULT_CATEGORIES);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudioCategory>('Photo Studio');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(85);
  const [securityDeposit, setSecurityDeposit] = useState<number>(150);
  const [maxCapacity, setMaxCapacity] = useState<number>(10);
  const [bookingMode, setBookingMode] = useState<'Instant' | 'Request'>('Instant');

  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('United States');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [osmPlaceId, setOsmPlaceId] = useState<string | null>(null);

  const [specs, setSpecs] = useState<StudioSpecs>({
    squareFeet: 2000,
    ceilingHeight: '16 ft clear to overhead grid',
    floorType: 'Seamless Polished Concrete',
    powerService: '3-Phase 200A Camlock + 100A Shore Power',
    soundRating: 'STC 60 Certified Soundproof',
    hvacType: 'Ultra-Silent Whisper Air (NC-20)',
    freightAccess: 'Drive-in 14ft Roll-up Garage Bay Door',
    lightingControl: '100% Motorized Blackout Curtains + Daylight Skylights',
    internetSpeed: '1 Gbps Symmetrical Dedicated Fiber (Wi-Fi 6E)',
    parkingSpaces: '4 Dedicated Gated Vehicle Spaces + Loading Dock',
  });

  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [overview, setOverview] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const [meta, data] = await Promise.all([
          fetchStudioMeta().catch(() => null),
          fetchStudioById(id),
        ]);

        const metaNames = meta?.categories?.map((c) => c.name) || [];
        const mergedCategories = Array.from(new Set([...metaNames, ...DEFAULT_CATEGORIES]));
        if (data?.category && !mergedCategories.includes(data.category)) {
          mergedCategories.push(data.category);
        }
        setCategories(mergedCategories);

        if (data) {
          setTitle(data.title);
          setCategory(data.category);
          setHourlyRate(data.hourlyRate);
          setSecurityDeposit(data.securityDeposit);
          setMaxCapacity(data.maxCapacity);
          setLocation(data.location);
          setCity(data.city || '');
          setState(data.state || '');
          setCountry(data.country || 'United States');
          if (data.coordinates) setCoordinates(data.coordinates);
          if (data.osmPlaceId) setOsmPlaceId(data.osmPlaceId);
          if (data.specs) {
            setSpecs({
              squareFeet: data.specs.squareFeet || 1500,
              ceilingHeight: data.specs.ceilingHeight || '16 ft clearance',
              floorType: data.specs.floorType || 'Seamless Polished Concrete',
              powerService: data.specs.powerService || '3-Phase 200A Camlock',
              soundRating: data.specs.soundRating || 'STC 60 Soundproof',
              hvacType: data.specs.hvacType || 'Ultra-Silent Whisper Air (NC-20)',
              freightAccess: data.specs.freightAccess || 'Ground-level loading dock',
              lightingControl: data.specs.lightingControl || '100% Blackout Capable',
              internetSpeed: data.specs.internetSpeed || '1 Gbps Dedicated Fiber (Wi-Fi 6E)',
              parkingSpaces: data.specs.parkingSpaces || 'Dedicated on-site parking',
            });
          }
          const loadedImages = data.images && data.images.length > 0 ? data.images : (data.imageUrl ? [data.imageUrl] : []);
          setImages(loadedImages);
          setOverview(data.overview);
          setSelectedAmenities(data.amenities || []);
          if (data.bookingMode) setBookingMode(data.bookingMode);
        } else {
          toast.error('Studio listing not found.');
          router.push('/my-listings');
        }
      } catch (err: any) {
        toast.error('Failed to load studio details: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleLocationSelect = (address: string, details?: OsmLocationSuggestion) => {
    setLocation(address);
    if (details) {
      setCity(details.city);
      setState(details.state);
      setCountry(details.country);
      setCoordinates({ lat: details.lat, lon: details.lon });
      setOsmPlaceId(details.osmPlaceId);
    }
  };

  const handleSpecChange = (key: keyof StudioSpecs, val: string | number) => {
    setSpecs((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map((f) => uploadToImgBB(f));
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((u) => u && typeof u === 'string');
      setImages((prev) => [...prev, ...validUrls]);
      toast.success(`${validUrls.length} image(s) uploaded successfully`);
    } catch (err: any) {
      toast.error('Image upload failed: ' + (err.message || 'Please use direct URL'));
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    try {
      new URL(newImageUrl.trim());
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
      toast.success('Image added to gallery');
    } catch {
      toast.error('Please enter a valid image URL');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities([...selectedAmenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Studio title is required');
      return;
    }
    const finalCategory = isCustomCategory
      ? formatCategoryTitle(customCategoryInput.trim())
      : category;

    if (isCustomCategory && (!finalCategory || finalCategory.length < 3)) {
      toast.error('Please enter a valid category name of at least 3 characters');
      return;
    }
    if (!location.trim()) {
      toast.error('Please choose a verified studio address via OpenStreetMap');
      return;
    }
    const finalCity = city.trim() || location.split(',')[0].trim();
    if (!finalCity) {
      toast.error('City is required');
      return;
    }
    if (!overview.trim()) {
      toast.error('Overview is required');
      return;
    }
    if (images.length < 2) {
      toast.error('A minimum of 2 studio images are required.');
      return;
    }
    if (!specs.squareFeet || Number(specs.squareFeet) <= 0) {
      toast.error('Usable square footage is required');
      return;
    }
    if (!specs.ceilingHeight.trim()) {
      toast.error('Ceiling height clearance is required');
      return;
    }
    if (!specs.floorType.trim()) {
      toast.error('Floor construction type is required');
      return;
    }
    if (!specs.powerService.trim()) {
      toast.error('Power service specification is required');
      return;
    }
    if (!specs.soundRating.trim()) {
      toast.error('Sound isolation rating is required');
      return;
    }
    if (!specs.hvacType.trim()) {
      toast.error('HVAC climate specification is required');
      return;
    }
    if (!specs.freightAccess.trim()) {
      toast.error('Freight and loading access details are required');
      return;
    }
    if (!specs.lightingControl.trim()) {
      toast.error('Lighting control and blackout specification is required');
      return;
    }
    if (!specs.internetSpeed.trim()) {
      toast.error('Internet connectivity specification is required');
      return;
    }
    if (!specs.parkingSpaces.trim()) {
      toast.error('Parking capacity details are required');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token') || '';
      await updateStudio(
        id,
        {
          title: title.trim(),
          category: finalCategory,
          hourlyRate: Number(hourlyRate),
          securityDeposit: Number(securityDeposit),
          maxCapacity: Number(maxCapacity),
          location: location.trim(),
          city: finalCity,
          state: state.trim(),
          country: country.trim() || 'United States',
          coordinates: coordinates || undefined,
          osmPlaceId: osmPlaceId || undefined,
          specs: {
            ...specs,
            squareFeet: Number(specs.squareFeet),
          },
          images,
          imageUrl: images[0],
          amenities: selectedAmenities,
          overview: overview.trim(),
          bookingMode,
        },
        token
      );

      toast.success('Studio updated successfully');
      router.push('/my-listings');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update studio listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-zinc-400">
        Loading studio details...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to My Listings</span>
        </Link>

        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
            Studio Details
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            Edit Studio Listing
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1 text-sm sm:text-base">
            Update space specs, address, equipment, and pricing.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span>Basic Information & Pricing</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Studio Space Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Category *
                  </label>
                  {isCustomCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setCustomCategoryInput('');
                      }}
                      className="text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Use Presets
                    </button>
                  )}
                </div>

                {isCustomCategory ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="e.g. Dance Loft, Ceramics Lab, VFX Stage"
                      required
                      autoFocus
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 border border-amber-500/30 transition-all"
                    />
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      Custom category will appear dynamically across discovery filters.
                    </p>
                  </div>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCategory(true);
                      } else {
                        setCategory(e.target.value as StudioCategory);
                      }
                    }}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option disabled>──────────</option>
                    <option value="__custom__">+ Add Custom Category...</option>
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Hourly Rate ($ USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    type="number"
                    min="1"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Security Deposit ($ USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    type="number"
                    min="0"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Max Capacity (Persons) *
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    type="number"
                    min="1"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(Number(e.target.value))}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Booking Policy *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBookingMode('Instant')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    bookingMode === 'Instant'
                      ? 'border-amber-500 bg-amber-500/10 text-zinc-900 dark:text-zinc-100 ring-1 ring-amber-500/40'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Instant Book</span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Automated</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Reservations are confirmed immediately upon credit pre-authorization.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingMode('Request')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    bookingMode === 'Request'
                      ? 'border-amber-500 bg-amber-500/10 text-zinc-900 dark:text-zinc-100 ring-1 ring-amber-500/40'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Request to Book</span>
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Host Approval</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Host has 24 hours to review production notes, crew size, and insurance before approving.
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Cpu className="size-4 text-amber-500" />
              <span>Studio Location & Address</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Street Address *
              </label>
              <OsmLocationPicker
                value={location}
                onChange={handleLocationSelect}
                required
                placeholder="Type street, district, or city..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Brooklyn, Los Angeles, Berlin"
                  required
                  className="w-full px-4 py-2 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  State / Region
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. NY, CA, England"
                  className="w-full px-4 py-2 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States, United Kingdom"
                  className="w-full px-4 py-2 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>
            </div>

            {coordinates && (
              <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 text-xs text-zinc-500">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Location Coordinates:</span>
                <span>City: {city || 'Direct'}</span>
                <span>•</span>
                <span>Coords: {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}</span>
                <span>•</span>
                <span className="text-emerald-500 font-medium">Verified</span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sliders className="size-4 text-amber-500" />
                <span>Studio Specifications</span>
              </h2>
              <span className="text-xs font-mono text-amber-500 font-semibold uppercase">
                All Fields Required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Maximize2 className="size-3.5 text-amber-500" />
                  <span>Usable Area (sq.ft) *</span>
                </label>
                <input
                  type="number"
                  min="50"
                  value={specs.squareFeet}
                  onChange={(e) => handleSpecChange('squareFeet', Number(e.target.value))}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Ceiling Height Clearance *
                </label>
                <input
                  type="text"
                  value={specs.ceilingHeight}
                  onChange={(e) => handleSpecChange('ceilingHeight', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Floor Construction Type *
                </label>
                <input
                  type="text"
                  value={specs.floorType}
                  onChange={(e) => handleSpecChange('floorType', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Power Capacity & Service *
                </label>
                <input
                  type="text"
                  value={specs.powerService}
                  onChange={(e) => handleSpecChange('powerService', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Acoustic / Sound Isolation *
                </label>
                <input
                  type="text"
                  value={specs.soundRating}
                  onChange={(e) => handleSpecChange('soundRating', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Wind className="size-3.5 text-amber-500" />
                  <span>HVAC Air Handling *</span>
                </label>
                <input
                  type="text"
                  value={specs.hvacType}
                  onChange={(e) => handleSpecChange('hvacType', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Truck className="size-3.5 text-amber-500" />
                  <span>Freight & Load-in Access *</span>
                </label>
                <input
                  type="text"
                  value={specs.freightAccess}
                  onChange={(e) => handleSpecChange('freightAccess', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Sun className="size-3.5 text-amber-500" />
                  <span>Lighting & Blackout Capabilities *</span>
                </label>
                <input
                  type="text"
                  value={specs.lightingControl}
                  onChange={(e) => handleSpecChange('lightingControl', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Wifi className="size-3.5 text-amber-500" />
                  <span>Internet Network Bandwidth *</span>
                </label>
                <input
                  type="text"
                  value={specs.internetSpeed}
                  onChange={(e) => handleSpecChange('internetSpeed', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Car className="size-3.5 text-amber-500" />
                  <span>Parking & Crew Staging *</span>
                </label>
                <input
                  type="text"
                  value={specs.parkingSpaces}
                  onChange={(e) => handleSpecChange('parkingSpaces', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Upload className="size-4 text-amber-500" />
                <span>Studio Visuals & Media Gallery</span>
              </h2>
              <span className={`text-xs font-mono font-semibold ${images.length >= 2 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {images.length} / 2 Minimum Required
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste direct high-resolution photo URL (https://...)"
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  Add URL
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-500">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Upload Multiple Photos from Device
                  </p>
                  <p>Aspect ratios are maintained. Minimum 2 images required for listing showcase.</p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-amber-500 hover:text-zinc-950 transition-colors shrink-0">
                  <Upload className="size-3.5" />
                  <span>{uploadingImage ? 'Uploading Photos...' : 'Choose Device Photos'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFileUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {images.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs text-zinc-400 block">
                    Gallery Showcase ({images.length} photos) — First photo is primary cover:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={imgUrl + idx}
                        className="relative aspect-video rounded-xl overflow-hidden shadow-xs border border-zinc-200/60 dark:border-zinc-800 group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Studio photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-950/80 text-white backdrop-blur-xs">
                          {idx === 0 ? 'Cover' : `#${idx + 1}`}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          aria-label={`Remove photo ${idx + 1}`}
                          className="absolute top-1.5 right-1.5 size-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-105 transition-all cursor-pointer shadow-xs"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Check className="size-4 text-amber-500" />
              <span>Amenities & Equipment Packages</span>
            </h2>

            <div className="flex flex-wrap gap-2.5">
              {PRESET_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {isSelected ? <Check className="size-3.5" /> : <PlusCircle className="size-3.5" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                placeholder="Add another equipment tag"
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
              />
              <button
                type="button"
                onClick={addCustomAmenity}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-amber-500 hover:text-zinc-950 transition-colors"
              >
                Add Tag
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileText className="size-4 text-amber-500" />
              <span>Studio Description & Host Verification</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Detailed Overview Narrative *
              </label>
              <textarea
                rows={5}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 shadow-xs">
              <div>
                <span className="text-[11px] text-zinc-400 font-semibold uppercase">Verified Host Name</span>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{user?.name}</p>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 font-semibold uppercase">Host Contact Email</span>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/my-listings')}
              className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 flex items-center gap-2"
            >
              <span>{submitting ? 'Saving Changes...' : 'Save Updated Specifications'}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
