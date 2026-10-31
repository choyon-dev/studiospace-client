'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { fetchStudioById, updateStudio } from '@/lib/api';
import { StudioCategory } from '@/types';
import { toast } from 'sonner';
import {
  Upload,
  Sparkles,
  DollarSign,
  Users,
  MapPin,
  Check,
  PlusCircle,
  FileText,
  ArrowLeft,
} from 'lucide-react';

const CATEGORIES: StudioCategory[] = [
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

export default function EditStudioPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudioCategory>('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState<number>(85);
  const [securityDeposit, setSecurityDeposit] = useState<number>(150);
  const [maxCapacity, setMaxCapacity] = useState<number>(10);
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [overview, setOverview] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');
  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await fetchStudioById(id);
        if (data) {
          setTitle(data.title);
          setCategory(data.category);
          setHourlyRate(data.hourlyRate);
          setSecurityDeposit(data.securityDeposit);
          setMaxCapacity(data.maxCapacity);
          setLocation(data.location);
          setImageUrl(data.imageUrl);
          setOverview(data.overview);
          setSelectedAmenities(data.amenities || []);
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

    if (!title || !location || !imageUrl || !overview) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await updateStudio(id, {
        title,
        category,
        hourlyRate: Number(hourlyRate),
        securityDeposit: Number(securityDeposit),
        maxCapacity: Number(maxCapacity),
        location,
        imageUrl,
        amenities: selectedAmenities,
        overview,
      });

      toast.success('Studio listing updated successfully!');
      router.push('/my-listings');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update studio listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 w-60 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-96 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-amber-500 mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to My Listings</span>
        </Link>

        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
            Edit Studio
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            Update Listing: {title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1 text-sm">
            Modify rates, amenities, facility photos, and booking descriptions.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span>Studio Title & Classification</span>
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
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StudioCategory)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  {CATEGORIES.map((cat) => (
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
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Security Deposit ($ USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    type="number"
                    min="0"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
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
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Location / Facility Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Upload className="size-4 text-amber-500" />
              <span>Studio Visuals</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Image URL *
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-56 relative aspect-video">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
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
                className="flex-1 px-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
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

          <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileText className="size-4 text-amber-500" />
              <span>Studio Description & Host Verification</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Detailed Overview *
              </label>
              <textarea
                rows={5}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
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
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
            >
              {submitting ? 'Saving Changes...' : 'Save Updated Listing'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
