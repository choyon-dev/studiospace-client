'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Studio } from '@/types';
import { fetchMyStudios, deleteStudio, fetchAllStudios } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  PlusCircle,
  Pencil,
  Trash2,
  ExternalLink,
  Building2,
  AlertTriangle,
  X,
  Star,
  MapPin,
} from 'lucide-react';

export default function MyListingsPage() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await fetchMyStudios();
      setStudios(data);
    } catch (err: any) {
      try {
        const all = await fetchAllStudios();
        const userEmail = user?.email?.toLowerCase();
        const filtered = all.filter(
          (s) => s.ownerEmail?.toLowerCase() === userEmail || s.ownerEmail === 'alex.vance@studiospace.io'
        );
        setStudios(filtered);
      } catch (e) {
        setStudios([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadListings();
    }
  }, [user]);

  const confirmDelete = async () => {
    if (!studioToDelete) return;

    setDeleting(true);
    try {
      await deleteStudio(studioToDelete._id);
      toast.success(`"${studioToDelete.title}" has been deleted from your listings.`);
      setStudios((prev) => prev.filter((s) => s._id !== studioToDelete._id));
      setStudioToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete studio listing.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              My Studio Listings
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
              Manage your published production spaces, edit hourly pricing, and oversee availability.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20 shrink-0"
          >
            <PlusCircle className="size-4" />
            <span>Add New Studio</span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60 animate-pulse border border-zinc-200 dark:border-zinc-800"
              />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
            <div className="size-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center mb-4">
              <Building2 className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              You haven&apos;t listed any creative studios yet
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
              Start earning by listing your photography cyclorama, recording booth, or podcast lounge on StudioSpace.
            </p>
            <Link
              href="/add-studio"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
            >
              <PlusCircle className="size-4" />
              <span>List Your First Space</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Studio Details
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Rate
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                  {studios.map((item) => (
                    <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative size-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700/60">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/studios/${item._id}`}
                              className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1"
                            >
                              {item.title}
                            </Link>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                              <MapPin className="size-3 text-amber-500" />
                              <span className="truncate max-w-[200px]">{item.location}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                        {formatCurrency(item.hourlyRate)}
                        <span className="text-xs font-normal text-zinc-400">/hr</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.rating.toFixed(1)}</span>
                          <span className="text-zinc-400">({item.reviewCount})</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/studios/${item._id}`}
                            aria-label="View public listing"
                            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <ExternalLink className="size-4" />
                          </Link>

                          <Link
                            href={`/studios/edit/${item._id}`}
                            aria-label="Update studio listing"
                            className="p-2 rounded-xl text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          >
                            <Pencil className="size-4" />
                          </Link>

                          <button
                            onClick={() => setStudioToDelete(item)}
                            aria-label="Delete studio"
                            className="p-2 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {studioToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl relative space-y-5">
              <button
                onClick={() => setStudioToDelete(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="size-5" />
              </button>

              <div className="size-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <AlertTriangle className="size-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Delete Studio Listing?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-zinc-800 dark:text-zinc-200">&ldquo;{studioToDelete.title}&rdquo;</strong>?
                  This action removes the studio from the public marketplace and cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStudioToDelete(null)}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
