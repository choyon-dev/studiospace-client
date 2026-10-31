export type StudioCategory =
  | 'Photo Studio'
  | 'Film Stage'
  | 'Podcast Lounge'
  | 'Music Suite'
  | 'Workshop';

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
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
