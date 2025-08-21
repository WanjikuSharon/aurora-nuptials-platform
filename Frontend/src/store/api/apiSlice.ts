import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import type { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  Venue,
  VenueFilters,
  Booking,
  WeddingRegistry,
  RegistryItem
} from '../../types';

// Base query with auth token
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Venue', 'Booking', 'Registry', 'Vendor'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    getUserProfile: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Venue endpoints
    getVenues: builder.query<{ venues: Venue[]; pagination: any }, VenueFilters>({
      query: (filters) => ({
        url: '/venues',
        params: filters,
      }),
      providesTags: ['Venue'],
    }),
    
    getVenueById: builder.query<Venue, number>({
      query: (id) => `/venues/${id}`,
      providesTags: (result, error, id) => [{ type: 'Venue', id }],
    }),
    
    createVenue: builder.mutation<Venue, Partial<Venue>>({
      query: (venueData) => ({
        url: '/venues',
        method: 'POST',
        body: venueData,
      }),
      invalidatesTags: ['Venue'],
    }),
    
    // Booking endpoints
    getBookings: builder.query<{ bookings: Booking[]; summary: any }, void>({
      query: () => '/bookings',
      providesTags: ['Booking'],
    }),
    
    createBooking: builder.mutation<Booking, Partial<Booking>>({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),
    
    updateBookingStatus: builder.mutation<Booking, { id: number; status: string; notes?: string }>({
      query: ({ id, ...patch }) => ({
        url: `/bookings/${id}/status`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Booking'],
    }),
    
    // Registry endpoints
    getRegistry: builder.query<{ registry: WeddingRegistry; stats: any }, void>({
      query: () => '/registry',
      providesTags: ['Registry'],
    }),
    
    addRegistryItem: builder.mutation<RegistryItem, Partial<RegistryItem>>({
      query: (itemData) => ({
        url: '/registry/items',
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: ['Registry'],
    }),
    
    updateRegistryItem: builder.mutation<RegistryItem, { id: number; data: Partial<RegistryItem> }>({
      query: ({ id, data }) => ({
        url: `/registry/items/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Registry'],
    }),
    
    deleteRegistryItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `/registry/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Registry'],
    }),
    
    // Dashboard endpoints
    getCouplesDashboard: builder.query<any, void>({
      query: () => '/couples/dashboard',
      providesTags: ['User', 'Booking', 'Registry'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useGetVenuesQuery,
  useGetVenueByIdQuery,
  useCreateVenueMutation,
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useGetRegistryQuery,
  useAddRegistryItemMutation,
  useUpdateRegistryItemMutation,
  useDeleteRegistryItemMutation,
  useGetCouplesDashboardQuery,
} = apiSlice;