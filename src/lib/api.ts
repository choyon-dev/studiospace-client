import { Studio, Booking, StudioMeta, OsmLocationSuggestion, StudioFilters, BookedSlot, Review } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const FALLBACK_STUDIOS: Studio[] = [
  {
    _id: '672001a1b2c3d4e5f6a7b8c1',
    title: 'The Daylight Loft — 20ft Cyclorama & Soundstage',
    slug: 'the-daylight-loft',
    category: 'Photo Studio',
    hourlyRate: 85,
    securityDeposit: 150,
    maxCapacity: 15,
    location: '55 Washington St, DUMBO, Brooklyn, NY 11201',
    city: 'Brooklyn',
    state: 'NY',
    country: 'United States',
    coordinates: { lat: 40.7028, lon: -73.9897 },
    osmPlaceId: '282910482',
    specs: {
      squareFeet: 2400,
      ceilingHeight: '18 ft clear to grid',
      floorType: 'Seamless Polished Concrete',
      powerService: '3-Phase 200A Camlock + 100A Shore Power',
      soundRating: 'STC 55 Acoustic Treatment',
      hvacType: 'Ultra-Silent Whisper Air (NC-20)',
      freightAccess: 'Freight Elevator (8,000 lbs, 10ft x 14ft)',
      lightingControl: '100% Motorized Blackout Curtains + South Natural Sun',
      internetSpeed: '1 Gbps Dedicated Symmetrical Fiber (Wi-Fi 6E)',
      parkingSpaces: '2 Dedicated Loading Docks + Street Parking',
    },
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      '20ft Infinity Corner Cyclorama Wall',
      'Profoto B10X Plus 500Ws Strobe Kit',
      'South-facing Natural Sunlight Floor-to-Ceiling Windows',
      'Hair & Makeup Dual Vanity Dressing Station',
      'High-Speed Fiber WiFi (1Gbps Symmetrical)',
      'Freight Elevator Direct Floor Loading',
      'Private Production Lounge with Espresso Bar',
      'C-Stands, Sandbags, and Apple Boxes (Full Kit)',
    ],
    overview:
      'A sprawling 2,400 sq.ft industrial daylight studio in prime DUMBO featuring uninterrupted southern exposure, a 20-foot seamless corner cyclorama, and pro-grade strobe lighting. Engineered specifically for editorial lookbooks, high-fashion campaigns, and commercial video portraiture.',
    ownerEmail: 'alex.vance@studiospace.io',
    ownerName: 'Alex Vance',
    rating: 4.95,
    reviewCount: 42,
  },
  {
    _id: '672001a1b2c3d4e5f6a7b8c2',
    title: 'Acoustic Vault — Dolby Atmos 7.1.4 Immersive Music Suite',
    slug: 'acoustic-vault',
    category: 'Music Suite',
    hourlyRate: 120,
    securityDeposit: 200,
    maxCapacity: 8,
    location: '2815 Sunset Blvd, Silver Lake, Los Angeles, CA 90026',
    city: 'Los Angeles',
    state: 'CA',
    country: 'United States',
    coordinates: { lat: 34.0837, lon: -118.2702 },
    osmPlaceId: '392019284',
    specs: {
      squareFeet: 1100,
      ceilingHeight: '14 ft acoustically baffled ceiling',
      floorType: 'Double Floating Hardwood Floor on Sylomer Isolation',
      powerService: 'Equi=Tech Balanced Technical Power 60A',
      soundRating: 'STC 70 Master Acoustic Isolation',
      hvacType: 'Silenced Decoupled Duct HVAC (NC-15)',
      freightAccess: 'Ground Floor Ramp Double-Door Access',
      lightingControl: 'Programmable Warm Lutron Dimmable Ambiance',
      internetSpeed: '1 Gbps Low-Latency Symmetrical Fiber',
      parkingSpaces: '3 Reserved Off-Street Parking Spaces',
    },
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Genelec 7.1.4 Dolby Atmos Smart Active Monitoring',
      'Neve 1073 Dual Preamp & Channel Strips',
      'Universal Audio Apollo x16 with Quad DSP',
      'Neumann U87 Ai & Telefunken ELA M 251 Microphones',
      'Private Vocal Booth with STC 72 Isolation',
      'Vintage Roland Juno-106 & Sequential Prophet-6 Synths',
      'Custom Acoustic Floating Floor & Bass Traps',
      'AVID Pro Tools Ultimate & Logic Pro X Hardware Control',
    ],
    overview:
      'Pristine acoustic isolation engineered by master acousticians. Designed for tracking, mastering, and immersive Dolby Atmos mixing. Includes top-shelf analog outboard preamps, balanced Equi=Tech power, and a private vocal isolation booth.',
    ownerEmail: 'marcus.audio@studiospace.io',
    ownerName: 'Marcus Sterling',
    rating: 5.0,
    reviewCount: 47,
  },
  {
    _id: '672001a1b2c3d4e5f6a7b8c3',
    title: 'The Broadcast Lab — 4K Multicam Live Podcast Lounge',
    slug: 'the-broadcast-lab',
    category: 'Podcast Lounge',
    hourlyRate: 75,
    securityDeposit: 100,
    maxCapacity: 8,
    location: '400 Congress Ave, Downtown, Austin, TX 78701',
    city: 'Austin',
    state: 'TX',
    country: 'United States',
    coordinates: { lat: 30.2672, lon: -97.7431 },
    osmPlaceId: '582910482',
    specs: {
      squareFeet: 850,
      ceilingHeight: '12 ft acoustically treated ceiling',
      floorType: 'Commercial Acoustic Oak Laminate with Area Rugs',
      powerService: 'Dedicated 50A Isolated Technical Audio Circuit',
      soundRating: 'STC 58 Professional Studio Isolation',
      hvacType: 'Whisper Silent Mini-Split AC with Carbon Filter',
      freightAccess: 'Passenger & Freight Elevator Access (Downtown Tower)',
      lightingControl: 'Studio Softbox Lighting with RGB Accent Baclkits',
      internetSpeed: '1 Gbps Low-Latency Fiber with Direct OBS Streaming',
      parkingSpaces: 'Building Underground Garage Validated Parking (2 spots)',
    },
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      '4x Sony FX3 4K Cinema Cameras with Prime G-Master Lenses',
      '4x Shure SM7B Microphones with Cloudlifter Amplifiers',
      'Blackmagic ATEM Mini Extreme ISO Video Switcher',
      'Rodecaster Pro II Audio Production & Mixing Console',
      'Custom Neon LED Backlit Acoustic Slatted Wood Accent Wall',
      'Live Streaming Switchboard with Direct YouTube/Twitch Hooks',
      'Confidence 55-inch Teleprompter and Guest Return Monitor',
      'Beverage Mini-Bar with Cold Brew on Tap',
    ],
    overview:
      'Turnkey multi-camera video podcast studio setup in downtown Austin. Plug in your external SSD and record 4K switched multi-angle episodes or broadcast directly to Spotify, YouTube, and Twitch with broadcast-grade audio and cinematic depth.',
    ownerEmail: 'sarah.pod@studiospace.io',
    ownerName: 'Sarah Jenkins',
    rating: 4.88,
    reviewCount: 36,
  },
  {
    _id: '672001a1b2c3d4e5f6a7b8c4',
    title: 'Grid 4 Soundstage — Heavy Commercial Film Production',
    slug: 'grid-4-soundstage',
    category: 'Film Stage',
    hourlyRate: 160,
    securityDeposit: 300,
    maxCapacity: 35,
    location: '44-02 11th St, Long Island City, NY 11101',
    city: 'Queens',
    state: 'NY',
    country: 'United States',
    coordinates: { lat: 40.7447, lon: -73.9352 },
    osmPlaceId: '194820194',
    specs: {
      squareFeet: 4200,
      ceilingHeight: '22 ft clear to motorized truss',
      floorType: 'Heavy Load Poured Epoxy Concrete',
      powerService: '3-Phase 400A Camlock Distribution Panel',
      soundRating: 'STC 65 Certified Soundproof Room-in-Room',
      hvacType: 'Attenuated Silent Production Air (NC-15)',
      freightAccess: 'Drive-in 14ft Roll-up Garage Bay Door',
      lightingControl: '100% Total Blackout with Motorized Rigging Truss',
      internetSpeed: '2 Gbps Dedicated Dual-WAN Fiber',
      parkingSpaces: '6 Dedicated Gated Vehicle Spaces + 53ft Trailer Staging',
    },
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Full Overhead Motorized Lighting Truss (10,000 lbs capacity)',
      'Certified Soundproof STC 65 Rating',
      '14ft Drive-in Roll-up Garage Door for Vehicle Access',
      '400A Camlock 3-Phase Tie-in with Distro Boxes',
      'Green Screen Chroma Key Infinity Cyclorama (30ft x 20ft)',
      'Dedicated Producer & Client Viewing Mezzanine Suite',
      'Wardrobe, Steamer, and Dual Makeup Stations',
      'Silent Heavy-Duty Production Air Conditioning',
    ],
    overview:
      'Massive 4,200 sq.ft production soundstage engineered for feature films, music videos, and vehicle commercials. Equipped with 22ft ceilings, a heavy-duty motorized overhead truss grid, STC 65 soundproofing, and drive-in garage access for seamless load-in.',
    ownerEmail: 'production@grid4stages.com',
    ownerName: 'Elena Rostova',
    rating: 4.92,
    reviewCount: 54,
  },
  {
    _id: '672001a1b2c3d4e5f6a7b8c5',
    title: 'Ceramica & Maker Space — Artisan Clay & Wood Workshop',
    slug: 'ceramica-maker-space',
    category: 'Workshop',
    hourlyRate: 55,
    securityDeposit: 80,
    maxCapacity: 16,
    location: '1579 N Milwaukee Ave, Wicker Park, Chicago, IL 60622',
    city: 'Chicago',
    state: 'IL',
    country: 'United States',
    coordinates: { lat: 41.9088, lon: -87.6775 },
    osmPlaceId: '294820194',
    specs: {
      squareFeet: 1800,
      ceilingHeight: '14 ft exposed brick and timber ceiling',
      floorType: 'Non-Slip Sealed Heavy Ceramic Work Floor',
      powerService: '3-Phase 100A Power with High-Draw Kiln Circuits',
      soundRating: 'STC 50 Commercial Acoustic Isolation',
      hvacType: 'Dedicated High-CFM Continuous Dust Extraction HVAC',
      freightAccess: 'Ground Floor Direct Alley Loading Double Doors',
      lightingControl: 'High CRI 95+ 5000K Overhead Artisan Work Lighting',
      internetSpeed: '400 Mbps Wi-Fi Network',
      parkingSpaces: 'Loading Zone in Alley + Street Metered Parking',
    },
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      '6x Shimpo Whisper Electronic Pottery Wheels',
      'Skutt Automatic Digital Electric Ceramic Kiln',
      'Heavy Duty Solid Rock Maple Woodworking Benches',
      'Complete Hand Carving, Sculpting & Clay Glazing Tool Library',
      'Triple Deep Basin Industrial Stainless Wash Sinks with Clay Traps',
      'High CFM Dust and Fume Extraction Ventilation System',
      'Open Display Shelving for Curing Clay Ware',
      'High-CRI 95+ True-Color Neutral Work Lighting',
    ],
    overview:
      'Fully equipped craft, ceramics, and artisan studio in vibrant Wicker Park. Equipped with electronic pottery wheels, automatic kilns, heavy maple woodcraft workbenches, and industrial wash sinks. Ideal for artisan video content, workshops, and private studio sessions.',
    ownerEmail: 'maya.artisan@studiospace.io',
    ownerName: 'Maya Lin',
    rating: 4.8,
    reviewCount: 22,
  },
  {
    _id: '672001a1b2c3d4e5f6a7b8c6',
    title: 'Neon Horizon — Retro Wave Video & Synth Production',
    slug: 'neon-horizon',
    category: 'Music Suite',
    hourlyRate: 95,
    securityDeposit: 150,
    maxCapacity: 12,
    location: '600 S Santa Fe Ave, Arts District, Los Angeles, CA 90021',
    city: 'Los Angeles',
    state: 'CA',
    country: 'United States',
    coordinates: { lat: 34.0407, lon: -118.2323 },
    osmPlaceId: '948201948',
    specs: {
      squareFeet: 1600,
      ceilingHeight: '16 ft exposed industrial timber ceiling',
      floorType: 'Polished Black Epoxy Resin',
      powerService: '150A Single-Phase Studio Production Distro',
      soundRating: 'STC 55 Acoustic Treatment',
      hvacType: 'Silent High-Output Dual Split HVAC',
      freightAccess: 'Direct Street-Level Loading Roll-up Shutter',
      lightingControl: 'Full DMX-Controlled RGB Ambient Tube Grid',
      internetSpeed: '1 Gbps Ultra-Fast Fiber Wi-Fi 6E',
      parkingSpaces: '4 Gated Yard Parking Spaces',
    },
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    amenities: [
      'Programmable RGB Atmospheric Grid Lighting (DMX Astera tubes)',
      'Moog Subsequent 37 & Dave Smith Prophet Rev2',
      'Focal Trio6 Be Active Studio Monitors',
      'Smoke & Atmosphere Haze Machine Integration',
      'Vintage VHS Camcorders & 9x CRT Video Wall Display',
      'Blackmagic Pocket 6K Pro Camera Package with Prime Lenses',
      'Private Green Room with Velvet Lounge Seating',
      'Hydraulic DJ Console Booth with Pioneer CDJ-3000s',
    ],
    overview:
      'A visual and acoustic wonderland customized for synth-heavy music production, stylized music videos, and creative album listening parties with custom RGB light programming, CRT video walls, and vintage analog synthesizers.',
    ownerEmail: 'damon.synth@studiospace.io',
    ownerName: 'Damon Cross',
    rating: 4.95,
    reviewCount: 31,
  },
];

export async function fetchStudioMeta(): Promise<StudioMeta> {
  try {
    const res = await fetch(`${API_BASE}/studios/meta`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch studio metadata');
    const json = await res.json();
    if (json.data) return json.data;
    throw new Error('Invalid metadata format');
  } catch {
    const categoriesMap = new Map<string, number>();
    const hubsMap = new Map<string, { city: string; state: string; country: string; count: number }>();
    let minRate = Infinity;
    let maxRate = -Infinity;

    FALLBACK_STUDIOS.forEach((s) => {
      categoriesMap.set(s.category, (categoriesMap.get(s.category) || 0) + 1);
      const city = s.city || 'Various';
      const hubData = hubsMap.get(city) || {
        city,
        state: s.state || '',
        country: s.country || 'United States',
        count: 0,
      };
      hubData.count += 1;
      hubsMap.set(city, hubData);
      if (s.hourlyRate < minRate) minRate = s.hourlyRate;
      if (s.hourlyRate > maxRate) maxRate = s.hourlyRate;
    });

    const categories = Array.from(categoriesMap.entries()).map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }));

    const hubs = Array.from(hubsMap.values()).map((h) => ({
      ...h,
      label: h.state ? `${h.city}, ${h.state}` : h.city,
    }));

    return {
      categories,
      hubs,
      rateRange: {
        min: minRate === Infinity ? 40 : minRate,
        max: maxRate === -Infinity ? 300 : maxRate,
      },
      amenities: ['Cyclorama Wall', 'Profoto Strobes', 'Dolby Atmos', 'STC 65 Soundproof', 'Freight Elevator', '4K Multicam'],
      totalStudios: FALLBACK_STUDIOS.length,
    };
  }
}

export async function searchOsmLocations(query: string): Promise<OsmLocationSuggestion[]> {
  try {
    const res = await fetch(`${API_BASE}/locations/autocomplete?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) throw new Error('Failed to query locations');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('OSM location query failed:', err);
    return [];
  }
}

export async function fetchFeaturedStudios(): Promise<Studio[]> {
  try {
    const res = await fetch(`${API_BASE}/studios/featured`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch featured studios');
    const json = await res.json();
    if (json.data && json.data.length > 0) return json.data;
    return FALLBACK_STUDIOS;
  } catch {
    return FALLBACK_STUDIOS;
  }
}

export async function fetchAllStudios(
  optionsOrCategory?: StudioFilters | string,
  searchQueryParam?: string,
  sortByParam?: string
): Promise<Studio[]> {
  try {
    const params = new URLSearchParams();
    let category: string | undefined;
    let hub: string | undefined;
    let search: string | undefined;
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    let sortBy: string | undefined;

    if (typeof optionsOrCategory === 'object' && optionsOrCategory !== null) {
      category = optionsOrCategory.category;
      hub = optionsOrCategory.hub;
      search = optionsOrCategory.search;
      minPrice = optionsOrCategory.minPrice;
      maxPrice = optionsOrCategory.maxPrice;
      sortBy = optionsOrCategory.sortBy;
    } else {
      category = optionsOrCategory;
      search = searchQueryParam;
      sortBy = sortByParam;
    }

    if (category && category !== 'All') params.append('category', category);
    if (hub && hub !== 'All') params.append('hub', hub);
    if (search) params.append('search', search);
    if (minPrice !== undefined) params.append('minPrice', String(minPrice));
    if (maxPrice !== undefined) params.append('maxPrice', String(maxPrice));
    if (sortBy) params.append('sortBy', sortBy);

    const res = await fetch(`${API_BASE}/studios?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch studios');
    const json = await res.json();
    if (json.data && json.data.length > 0) return json.data;

    let list = [...FALLBACK_STUDIOS];
    if (category && category !== 'All') {
      list = list.filter((s) => s.category.toLowerCase() === category!.toLowerCase());
    }
    if (hub && hub !== 'All') {
      const h = hub.toLowerCase();
      list = list.filter(
        (s) =>
          (s.city && s.city.toLowerCase().includes(h)) ||
          s.location.toLowerCase().includes(h) ||
          (s.state && s.state.toLowerCase().includes(h))
      );
    }
    if (minPrice !== undefined) {
      list = list.filter((s) => s.hourlyRate >= minPrice!);
    }
    if (maxPrice !== undefined) {
      list = list.filter((s) => s.hourlyRate <= maxPrice!);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          (s.city && s.city.toLowerCase().includes(q)) ||
          s.overview.toLowerCase().includes(q) ||
          s.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'priceAsc') {
      list.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sortBy === 'priceDesc') {
      list.sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else if (sortBy === 'ratingDesc') {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  } catch {
    return FALLBACK_STUDIOS;
  }
}

export async function fetchStudioById(idOrSlug: string): Promise<Studio | null> {
  try {
    const res = await fetch(`${API_BASE}/studios/${encodeURIComponent(idOrSlug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Studio not found');
    const json = await res.json();
    if (json.data) return json.data;
    const match = FALLBACK_STUDIOS.find(
      (s) =>
        s._id === idOrSlug ||
        s.slug === idOrSlug ||
        (s.slug && s.slug.toLowerCase() === idOrSlug.toLowerCase()) ||
        s.title.toLowerCase().includes(idOrSlug.toLowerCase().replace(/-/g, ' '))
    );
    return match || null;
  } catch {
    const match = FALLBACK_STUDIOS.find(
      (s) =>
        s._id === idOrSlug ||
        s.slug === idOrSlug ||
        (s.slug && s.slug.toLowerCase() === idOrSlug.toLowerCase()) ||
        s.title.toLowerCase().includes(idOrSlug.toLowerCase().replace(/-/g, ' '))
    );
    return match || null;
  }
}

export async function createStudio(data: Partial<Studio>, token?: string): Promise<Studio> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/studios`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to create studio');
  }

  const json = await res.json();
  return json.data;
}

export async function updateStudio(id: string, data: Partial<Studio>, token?: string): Promise<Studio> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/studios/${id}`, {
    method: 'PATCH',
    headers,
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to update studio');
  }

  const json = await res.json();
  return json.data;
}

export async function deleteStudio(id: string, token?: string): Promise<boolean> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/studios/${id}`, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to delete studio');
  }

  return true;
}

export async function fetchMyStudios(token?: string): Promise<Studio[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/studios/my`, {
      headers,
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch your studios');
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function createBooking(data: Partial<Booking>, token?: string): Promise<Booking> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to book studio');
  }

  const json = await res.json();
  return json.data;
}

export async function fetchMyBookings(token?: string): Promise<Booking[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/bookings/my`, {
      headers,
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch your bookings');
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function cancelBooking(id: string, token?: string): Promise<Booking> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
    method: 'PATCH',
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to cancel booking');
  }

  const json = await res.json();
  return json.data;
}

export async function fileToDataUrl(file: File, maxWidth = 1200, maxHeight = 1200): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        resolve('');
        return;
      }

      const img = document.createElement('img');
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(file.type || 'image/jpeg', 0.85));
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '38adcb433157fb674b01e23115bb9ec1';
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.url) {
        return json.data.url;
      }
    }
  } catch {
    // Seamless fallback to client-side data URL on network or service error
  }

  // Resilient fallback: Compress and encode to data URL so uploads never fail
  const fallbackUrl = await fileToDataUrl(file);
  if (fallbackUrl) {
    return fallbackUrl;
  }

  throw new Error('Could not process image file. Please check file format.');
}

export async function fetchStudioBookedSlots(studioId: string, date: string): Promise<BookedSlot[]> {
  try {
    const res = await fetch(`${API_BASE}/bookings/studio/${studioId}?date=${encodeURIComponent(date)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function fetchIncomingBookings(token?: string): Promise<Booking[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/bookings/incoming`, {
      headers,
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch incoming booking requests');
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function approveBooking(id: string, token?: string): Promise<Booking> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/bookings/${id}/approve`, {
    method: 'PATCH',
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to approve booking request');
  }

  const json = await res.json();
  return json.data;
}

export async function declineBooking(id: string, token?: string): Promise<Booking> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/bookings/${id}/decline`, {
    method: 'PATCH',
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to decline booking request');
  }

  const json = await res.json();
  return json.data;
}

export async function fetchStudioReviews(studioId: string): Promise<Review[]> {
  try {
    const res = await fetch(`${API_BASE}/reviews/studio/${studioId}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function checkBookingReviewed(bookingId: string, token?: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/reviews/check/${bookingId}`, {
      headers,
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.reviewed;
  } catch {
    return false;
  }
}

export async function submitStudioReview(data: Partial<Review>, token?: string): Promise<Review> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to submit review');
  }

  const json = await res.json();
  return json.data;
}

export async function fetchMyWishlist(token?: string): Promise<{ count: number; ids: string[]; data: Studio[] }> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/wishlist/my`, {
      headers,
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) {
      return { count: 0, ids: [], data: [] };
    }

    const json = await res.json();
    return {
      count: json.count || 0,
      ids: json.ids || [],
      data: json.data || [],
    };
  } catch {
    return { count: 0, ids: [], data: [] };
  }
}

export async function toggleWishlist(
  studioId: string,
  token?: string
): Promise<{ success: boolean; isFavorited: boolean; studioId: string; message: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/wishlist/toggle`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ studioId }),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to update saved studio');
  }

  return await res.json();
}

export async function checkStudioWishlist(studioId: string, token?: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/wishlist/check/${studioId}`, {
      headers,
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) return false;
    const json = await res.json();
    return !!json.isFavorited;
  } catch {
    return false;
  }
}
