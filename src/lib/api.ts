import { Studio, Booking } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const FALLBACK_STUDIOS: Studio[] = [
  {
    _id: '672001a1b2c3d4e5f6a7b8c1',
    title: 'The Daylight Loft — Cyclorama Stage',
    category: 'Photo Studio',
    hourlyRate: 85,
    securityDeposit: 150,
    maxCapacity: 12,
    location: 'DUMBO, Brooklyn, NY',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      '20ft Infinity Cyclorama Wall',
      'Profoto B10X Plus Lighting Kit',
      'South-facing Natural Sunlight',
      'Hair & Makeup Dressing Station',
      'High-Speed Fiber WiFi (1Gbps)',
      'Freight Elevator Access',
    ],
    overview:
      'A sprawling 2,400 sq.ft industrial daylight studio featuring uninterrupted southern sunlight exposure, a 20-foot seamless corner cyclorama wall, and pro-grade strobe lighting. Engineered specifically for editorial lookbooks, commercial fashion shoots, and high-end video portraiture.',
    ownerEmail: 'alex.vance@studiospace.io',
    ownerName: 'Alex Vance',
    rating: 4.9,
    reviewCount: 38,
  },
  {
    _id: '672001a1b2c3d4e5f6a7b8c2',
    title: 'Acoustic Vault — Dolby Atmos Music Suite',
    category: 'Music Suite',
    hourlyRate: 120,
    securityDeposit: 200,
    maxCapacity: 6,
    location: 'Silver Lake, Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Genelec 7.1.4 Dolby Atmos Monitoring',
      'Neve 1073 Channel Strips',
      'Universal Audio Apollo x16',
      'Neumann U87 Ai Microphone',
      'Vintage Roland Juno-106 Synth',
      'Private Vocal Isolation Booth',
    ],
    overview:
      'Pristine acoustic isolation engineered by master acousticians. Designed for tracking, mastering, and immersive Dolby Atmos mixing. Includes top-shelf analog outboard preamps and custom floating floor isolation.',
    ownerEmail: 'marcus.audio@studiospace.io',
    ownerName: 'Marcus Sterling',
    rating: 5.0,
    reviewCount: 47,
  },
  {
    _id: '672001a1b2c3d4e5f6a7b8c3',
    title: 'The Broadcast Lab — 4K Multicam Podcast Lounge',
    category: 'Podcast Lounge',
    hourlyRate: 75,
    securityDeposit: 100,
    maxCapacity: 8,
    location: 'Austin Downtown, TX',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      '4x Sony FX3 Cinema Cameras with 4K switcher',
      '4x Shure SM7B Broadcast Mics with Cloudlifters',
      'Rodecaster Pro II Audio Production Console',
      'Aputure Nova Soft Lighting Grid',
      'Custom Neon LED Backlit Acoustic Walls',
      'Live Streaming Switchboard with OBS integration',
    ],
    overview:
      'Turnkey multi-camera video podcast studio setup. Just plug in your SD card or drive and record 4K switched multi-angle episodes or broadcast directly to YouTube, Twitch, or Spotify with studio sound.',
    ownerEmail: 'sarah.pod@studiospace.io',
    ownerName: 'Sarah Jenkins',
    rating: 4.85,
    reviewCount: 29,
  },
  {
    _id: '672001a1b2c3d4e5f6a7b8c4',
    title: 'Grid 4 Soundstage — Black Box Film Production',
    category: 'Film Stage',
    hourlyRate: 160,
    securityDeposit: 300,
    maxCapacity: 25,
    location: 'Long Island City, NY',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Full Overhead Motorized Lighting Truss',
      'Soundproof STC 65 Rating',
      'Drive-in Roll-up Garage Door',
      '3-Phase 200A Camlock Power',
      'Dedicated Production Office Suite',
      'Green Screen Backdrop (30ft x 15ft)',
    ],
    overview:
      'Massive 4,000 sq ft production soundstage with 18ft ceilings, motorized overhead grid, sound dampening to STC 65, and heavy 3-phase camlock power for high-draw HMI and Arri lighting fixtures.',
    ownerEmail: 'production@grid4stages.com',
    ownerName: 'Elena Rostova',
    rating: 4.92,
    reviewCount: 54,
  },
  {
    _id: '672001a1b2c3d4e5f6a7b8c5',
    title: 'Ceramica & Maker Space — Creative Artisan Workshop',
    category: 'Workshop',
    hourlyRate: 55,
    securityDeposit: 80,
    maxCapacity: 16,
    location: 'Wicker Park, Chicago, IL',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      '6x Shimpo Whisper Pottery Wheels',
      'Skutt Automatic Digital Electric Kiln',
      'Heavy Duty Maple Woodworking Benches',
      'Extensive Hand Carving & Clay Tool Library',
      'Triple Deep Basin Industrial Wash Sinks',
      'High CFM Dust Collection System',
    ],
    overview:
      'Fully equipped craft, ceramics, and artisan studio equipped with electric pottery wheels, kilns, and spacious woodworking workbenches. Ideal for small group classes, private sculpting sessions, and artisan content shoots.',
    ownerEmail: 'maya.artisan@studiospace.io',
    ownerName: 'Maya Lin',
    rating: 4.8,
    reviewCount: 22,
  },
  {
    _id: '672001a1b2c3d4e5f6a7b8c6',
    title: 'Neon Horizon — Retro Wave Video & Music Production',
    category: 'Music Suite',
    hourlyRate: 95,
    securityDeposit: 150,
    maxCapacity: 10,
    location: 'Arts District, Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Programmable RGB Atmospheric Grid Lighting',
      'Moog Subsequent 37 & Dave Smith Prophet Rev2',
      'Focal Trio6 Be Studio Monitors',
      'Smoke & Atmosphere Haze Machine',
      'Vintage VHS Camcorders & CRT Video Wall',
      '4K Blackmagic Cinema Camera Kit',
    ],
    overview:
      'A visual and acoustic wonderland customized for synth-heavy music production, stylized music videos, and creative album listening parties with custom RGB light programming and vintage analog gear.',
    ownerEmail: 'damon.synth@studiospace.io',
    ownerName: 'Damon Cross',
    rating: 4.95,
    reviewCount: 31,
  },
];

export async function fetchFeaturedStudios(): Promise<Studio[]> {
  try {
    const res = await fetch(`${API_BASE}/studios/featured`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch featured studios');
    const json = await res.json();
    if (json.data && json.data.length > 0) return json.data;
    return FALLBACK_STUDIOS;
  } catch (err) {
    return FALLBACK_STUDIOS;
  }
}

export async function fetchAllStudios(category?: string, search?: string, sortBy?: string): Promise<Studio[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);

    const res = await fetch(`${API_BASE}/studios?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch studios');
    const json = await res.json();
    if (json.data && json.data.length > 0) return json.data;
    
    let list = [...FALLBACK_STUDIOS];
    if (category && category !== 'All') {
      list = list.filter((s) => s.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.overview.toLowerCase().includes(q)
      );
    }
    return list;
  } catch (err) {
    let list = [...FALLBACK_STUDIOS];
    if (category && category !== 'All') {
      list = list.filter((s) => s.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.overview.toLowerCase().includes(q)
      );
    }
    return list;
  }
}

export async function fetchStudioById(id: string): Promise<Studio | null> {
  try {
    const res = await fetch(`${API_BASE}/studios/${id}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {
  }
  const fallback = FALLBACK_STUDIOS.find((s) => s._id === id);
  return fallback || null;
}

export async function fetchMyStudios(): Promise<Studio[]> {
  const res = await fetch(`${API_BASE}/studios/my`, {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch user listings');
  }
  const json = await res.json();
  return json.data || [];
}

export async function createStudio(studioData: Partial<Studio>): Promise<Studio> {
  const res = await fetch(`${API_BASE}/studios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(studioData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create studio');
  }
  const json = await res.json();
  return json.data;
}

export async function updateStudio(id: string, studioData: Partial<Studio>): Promise<Studio> {
  const res = await fetch(`${API_BASE}/studios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(studioData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update studio');
  }
  const json = await res.json();
  return json.data;
}

export async function deleteStudio(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/studios/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete studio');
  }
}

export async function createBooking(bookingData: {
  studioId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalCost: number;
}): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to complete booking');
  }
  const json = await res.json();
  return json.data;
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/bookings/my`, {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch bookings');
  }
  const json = await res.json();
  return json.data || [];
}

export async function cancelBooking(id: string): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to cancel booking');
  }
  const json = await res.json();
  return json.data;
}
