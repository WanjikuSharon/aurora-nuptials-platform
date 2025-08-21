// User and Authentication Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'COUPLE' | 'VENDOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  profile?: CoupleProfile | VendorProfile;
}

export interface CoupleProfile {
  id: number;
  userId: number;
  weddingDate?: string;
  budget?: number;
  guestCount?: number;
  theme?: string;
  venue?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  weddingRegistry?: WeddingRegistry;
  favorites?: Favorite[];
  bookings?: Booking[];
}

export interface VendorProfile {
  id: number;
  userId: number;
  businessName: string;
  category: VendorCategory;
  description?: string;
  priceRange?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  venues?: Venue[];
  reviews?: Review[];
}

// Venue Types
export interface Venue {
  id: number;
  name: string;
  description?: string;
  venueType: VenueType;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  capacity?: number;
  priceRange?: string;
  amenities: string[];
  images: string[];
  availability?: any;
  vendorId?: number;
  vendor?: VendorProfile;
  createdAt: string;
  updatedAt: string;
}

export type VenueType = 
  | 'OUTDOOR' 
  | 'INTIMATE' 
  | 'BEACH_WATERFRONT' 
  | 'BARN' 
  | 'ESTATE' 
  | 'VINEYARD' 
  | 'ALL_INCLUSIVE' 
  | 'REHEARSAL_DINNER' 
  | 'WEDDING_SHOWER';

export type VendorCategory = 
  | 'VENUE'
  | 'PHOTOGRAPHER'
  | 'VIDEOGRAPHER'
  | 'CATERER'
  | 'FLORIST'
  | 'MAKEUP_BEAUTY'
  | 'WEDDING_PLANNER'
  | 'BAND_DJ'
  | 'CAKE_DESSERT'
  | 'BAR_BEVERAGE'
  | 'OFFICIANT';

// Registry Types
export interface WeddingRegistry {
  id: number;
  coupleProfileId: number;
  registryItems: RegistryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface RegistryItem {
  id: number;
  weddingRegistryId: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  brand?: string;
  url?: string;
  image?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  purchased: boolean;
  purchasedBy?: string;
  purchaseDate?: string;
  purchaseMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  id: number;
  coupleProfileId: number;
  venueId?: number;
  vendorId?: number;
  eventDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  venue?: Venue;
  vendor?: VendorProfile;
  coupleProfile?: CoupleProfile;
}

// Other Types
export interface Favorite {
  id: number;
  coupleProfileId: number;
  venueId?: number;
  vendorId?: number;
  venue?: Venue;
  vendor?: VendorProfile;
  createdAt: string;
}

export interface Review {
  id: number;
  vendorId: number;
  rating: number;
  comment?: string;
  reviewerName?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  role?: 'COUPLE' | 'VENDOR';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Redux State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface VenueState {
  venues: Venue[];
  currentVenue: Venue | null;
  isLoading: boolean;
  error: string | null;
  filters: VenueFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface VenueFilters {
  venueType?: VenueType;
  city?: string;
  state?: string;
  capacity?: number;
  priceRange?: string;
  amenities?: string[];
  search?: string;
}

export interface RegistryState {
  registry: WeddingRegistry | null;
  isLoading: boolean;
  error: string | null;
  stats: {
    totalItems: number;
    totalValue: number;
    purchasedItems: number;
    remainingItems: number;
    completionPercentage: number;
  };
}

export interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  stats: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    upcomingBookings: number;
  };
}

export interface ToastState {
  toasts: Toast[];
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'COUPLE' | 'VENDOR';
}

export interface ProfileUpdateData {
  name?: string;
  weddingDate?: string;
  budget?: number;
  guestCount?: number;
  theme?: string;
  venue?: string;
  notes?: string;
}