export type StudioCategory =
  | 'Photo Studio'
  | 'Film Stage'
  | 'Podcast Lounge'
  | 'Music Suite'
  | 'Workshop'
  | string;

export interface StudioSpecs {
  squareFeet: number;
  ceilingHeight: string;
  floorType: string;
  powerService: string;
  soundRating: string;
  hvacType: string;
  freightAccess: string;
  lightingControl: string;
  internetSpeed: string;
  parkingSpaces: string;
}

export interface Studio {
  _id: string;
  title: string;
  slug?: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  city?: string;
  state?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  osmPlaceId?: string;
  specs?: StudioSpecs;
  imageUrl: string;
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  rating: number;
  reviewCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudioCategoryMeta {
  name: string;
  count: number;
  slug: string;
}

export interface StudioHubMeta {
  city: string;
  state: string;
  country: string;
  count: number;
  label: string;
}

export interface StudioMeta {
  categories: StudioCategoryMeta[];
  hubs: StudioHubMeta[];
  rateRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  totalStudios: number;
}

export interface OsmLocationSuggestion {
  label: string;
  displayName: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  formatted: string;
  lat: number;
  lon: number;
  osmPlaceId: string;
}

export interface StudioFilters {
  category?: string;
  hub?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage?: string;
  bookerEmail: string;
  bookerName: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalCost: number;
  status: BookingStatus;
  createdAt?: string;
}
