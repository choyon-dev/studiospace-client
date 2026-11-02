'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import OsmLocationPicker from '@/components/OsmLocationPicker';
import { createStudio, fetchStudioMeta, uploadToImgBB } from '@/lib/api';
import { StudioCategory, OsmLocationSuggestion, StudioSpecs } from '@/types';
import { toast } from 'sonner';
import {
  Upload,
  PlusCircle,
  Sparkles,
  DollarSign,
  Users,
  Check,
  FileText,
  Sliders,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Wind,
  Truck,
  Sun,
  Wifi,
  Car,
} from 'lucide-react';

const DEFAULT_CATEGORIES: StudioCategory[] = [
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Workshop',
];

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

export default function AddStudioPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [categories, setCategories] = useState<StudioCategory[]>(DEFAULT_CATEGORIES);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudioCategory>('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState<number>(85);
  const [securityDeposit, setSecurityDeposit] = useState<number>(150);
  const [maxCapacity, setMaxCapacity] = useState<number>(12);

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

  const [imageUrl, setImageUrl] = useState('');
  const [overview, setOverview] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Profoto Strobe Lighting Kit',
    '3-Phase 200A Camlock Power',
    'High-Speed 1Gbps Fiber Internet',
  ]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const meta = await fetchStudioMeta();
        if (meta.categories && meta.categories.length > 0) {
          const names = meta.categories.map((c) => c.name);
          setCategories(Array.from(new Set([...names, ...DEFAULT_CATEGORIES])));
        }
      } catch (err) {
        setCategories(DEFAULT_CATEGORIES);
      }
    }
    loadMeta();
  }, []);

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
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadToImgBB(file);
      setImageUrl(url);
      toast.success('Studio image hosted and verified successfully');
    } catch (err: any) {
      toast.error('Image upload failed: ' + (err.message || 'Please use direct URL'));
    } finally {
      setUploadingImage(false);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Studio title is required');
      return;
    }
    if (!location.trim()) {
      toast.error('Please choose a verified studio facility address via OpenStreetMap');
      return;
    }
    if (!imageUrl.trim()) {
      toast.error('Direct high-resolution studio photo URL is required');
      return;
    }
    if (!overview.trim() || overview.trim().length < 20) {
      toast.error('Please provide a detailed overview of at least 20 characters');
      return;
    }
    if (!specs.squareFeet || specs.squareFeet <= 0) {
      toast.error('Please specify valid usable floor square footage');
      return;
    }
    if (!specs.ceilingHeight.trim()) {
      toast.error('Ceiling height clearance is required');
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

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token') || '';
      await createStudio(
        {
          title: title.trim(),
          category,
          hourlyRate: Number(hourlyRate),
          securityDeposit: Number(securityDeposit),
          maxCapacity: Number(maxCapacity),
          location: location.trim(),
          city: city || location.split(',')[0].trim(),
          state,
          country,
          coordinates: coordinates || undefined,
          osmPlaceId: osmPlaceId || undefined,
          specs: {
            ...specs,
            squareFeet: Number(specs.squareFeet),
          },
          imageUrl: imageUrl.trim(),
          amenities: selectedAmenities,
          overview: overview.trim(),
        },
        token
      );

      toast.success('Production studio published successfully with complete technical specifications');
      router.push('/my-listings');
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish studio listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
            Host Facility Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            List a Production Studio
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base">
            Publish your creative facility with complete architectural, power, and acoustic engineering specifications.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span>Studio Classification & Pricing</span>
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
                  placeholder="e.g. Apex Daylight Cyclorama Soundstage"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Discipline / Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StudioCategory)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
                    required
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
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Cpu className="size-4 text-amber-500" />
              <span>Verified Facility Location (OpenStreetMap Engine)</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Physical Facility Address (Global Geocoded) *
              </label>
              <OsmLocationPicker
                value={location}
                onChange={handleLocationSelect}
                required
                placeholder="Type street, district, or city (e.g. 55 Washington St, Brooklyn, NY)..."
              />
            </div>

            {coordinates && (
              <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 text-xs text-zinc-500">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Resolved Geocode:
                </span>
                <span>City: {city || 'Direct'}</span>
                <span>•</span>
                <span>Coords: {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}</span>
                <span>•</span>
                <span className="text-emerald-500 font-medium">OSM Verified</span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sliders className="size-4 text-amber-500" />
                <span>Technical Specifications & Engineering Blueprint</span>
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
                  placeholder="2400"
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
                  placeholder="e.g. 18 ft clear to grid"
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
                  placeholder="e.g. Seamless Polished Concrete"
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
                  placeholder="e.g. 3-Phase 200A Camlock"
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
                  placeholder="e.g. STC 65 Certified Soundproof"
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
                  placeholder="e.g. Ultra-Silent Whisper Air (NC-20)"
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
                  placeholder="e.g. 14ft Roll-Up Drive-in Garage Door"
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
                  placeholder="e.g. 100% Motorized Blackout Curtains"
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
                  placeholder="e.g. 1 Gbps Symmetrical Dedicated Fiber (Wi-Fi 6E)"
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
                  placeholder="e.g. 4 Dedicated Gated Spaces + On-site Loading Dock"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Upload className="size-4 text-amber-500" />
              <span>Studio Visuals & Media</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Direct High-Resolution Image URL *
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-500">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Upload via ImgBB Direct Hosting
                  </p>
                  <p>Select a photo from your device to auto-upload and generate a direct URL.</p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-amber-500 hover:text-zinc-950 transition-colors shrink-0">
                  <Upload className="size-3.5" />
                  <span>{uploadingImage ? 'Uploading...' : 'Choose Device File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {imageUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden shadow-xs max-h-56 relative aspect-video">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Check className="size-4 text-amber-500" />
              <span>Included Gear & Production Amenities</span>
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
                        ? 'bg-amber-500 text-zinc-950 shadow-xs'
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
                placeholder="Add specialized gear (e.g. Arri Alexa 35 Package, 20ft Technocrane)"
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
                placeholder="Describe lighting characteristics, acoustic treatment details, set build regulations, and check-in logistics..."
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
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 flex items-center gap-2"
            >
              <span>{submitting ? 'Publishing Facility...' : 'Publish Studio Listing'}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
