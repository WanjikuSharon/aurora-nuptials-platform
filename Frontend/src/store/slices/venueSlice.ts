import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { VenueState, Venue, VenueFilters } from '../../types';

const initialState: VenueState = {
  venues: [],
  currentVenue: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  },
};

const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    setVenues: (state, action: PayloadAction<Venue[]>) => {
      state.venues = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentVenue: (state, action: PayloadAction<Venue | null>) => {
      state.currentVenue = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setFilters: (state, action: PayloadAction<VenueFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (state, action: PayloadAction<VenueState['pagination']>) => {
      state.pagination = action.payload;
    },
    addVenue: (state, action: PayloadAction<Venue>) => {
      state.venues.unshift(action.payload);
    },
    updateVenue: (state, action: PayloadAction<Venue>) => {
      const index = state.venues.findIndex(venue => venue.id === action.payload.id);
      if (index !== -1) {
        state.venues[index] = action.payload;
      }
      if (state.currentVenue?.id === action.payload.id) {
        state.currentVenue = action.payload;
      }
    },
    removeVenue: (state, action: PayloadAction<number>) => {
      state.venues = state.venues.filter(venue => venue.id !== action.payload);
      if (state.currentVenue?.id === action.payload) {
        state.currentVenue = null;
      }
    },
  },
});

export const {
  setVenues,
  setCurrentVenue,
  setLoading,
  setError,
  setFilters,
  clearFilters,
  setPagination,
  addVenue,
  updateVenue,
  removeVenue,
} = venueSlice.actions;

export default venueSlice.reducer;

// Selectors
export const selectVenues = (state: { venues: VenueState }) => state.venues.venues;
export const selectCurrentVenue = (state: { venues: VenueState }) => state.venues.currentVenue;
export const selectVenuesLoading = (state: { venues: VenueState }) => state.venues.isLoading;
export const selectVenuesError = (state: { venues: VenueState }) => state.venues.error;
export const selectVenueFilters = (state: { venues: VenueState }) => state.venues.filters;
export const selectVenuePagination = (state: { venues: VenueState }) => state.venues.pagination;