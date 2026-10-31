'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createStudio } from '@/lib/api';
import { StudioCategory } from '@/types';
import { toast } from 'sonner';
import {
  Upload,
  PlusCircle,
  Sparkles,
  DollarSign,
  Users,
  MapPin,
  Check,
  FileText,
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

export default function AddStudioPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudioCategory>('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState<number>(85);
  const [securityDeposit, setSecurityDeposit] = useState<number>(150);
  const [maxCapacity, setMaxCapacity] = useState<number>(10);
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [overview, setOverview] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Profoto Strobe Lighting Kit',
    'High-Speed 1Gbps Fiber Internet',
  ]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '38adcb433157fb674b01e23115bb9ec1';
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
        toast.success('Studio image uploaded successfully!');
      } else {
        toast.error('ImgBB upload error. Please paste direct image URL instead.');
      }
    } catch (err: any) {
      toast.error('Image upload failed: ' + (err.message || 'Network error'));
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

    if (!title || !location || !imageUrl || !overview) {
      toast.error('Please complete all required listing fields.');
      return;
    }

    setSubmitting(true);
    try {
      await createStudio({
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

      toast.success('Your studio space has been listed successfully!');
      router.push('/my-listings');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create studio listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500">
            Host Space Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
            List a New Production Studio
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base">
            Publish your creative facility to hundreds of verified filmmakers, photographers, and audio engineers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
                  placeholder="e.g. Apex Daylight Cyclorama Loft"
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
                  placeholder="e.g. 142 Greenpoint Ave, Studio 4B, Brooklyn, NY"
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

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Direct Image URL *
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-500">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Upload via ImgBB Integration
                  </p>
                  <p>Choose an image file from your device to auto-host and get direct URL.</p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-amber-500 hover:text-zinc-950 transition-colors shrink-0">
                  <Upload className="size-3.5" />
                  <span>{uploadingImage ? 'Uploading...' : 'Choose File'}</span>
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
                <div className="mt-4 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-56 relative aspect-video">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
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
                placeholder="Add custom gear (e.g. Red Komodo 6K Camera)"
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
                placeholder="Describe the studio dimensions, natural lighting characteristics, sound isolation STC ratings, and shooting policies..."
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
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
            >
              {submitting ? 'Publishing Studio...' : 'Publish Studio Listing'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
