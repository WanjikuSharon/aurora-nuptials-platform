import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BookingState, Booking } from '../../types';

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  stats: {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    upcomingBookings: 0,
  },
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
      state.isLoading = false;
      state.error = null;
      // Calculate stats
      state.stats = {
        totalBookings: action.payload.length,
        pendingBookings: action.payload.filter(b => b.status === 'pending').length,
        confirmedBookings: action.payload.filter(b => b.status === 'confirmed').length,
        cancelledBookings: action.payload.filter(b => b.status === 'cancelled').length,
        upcomingBookings: action.payload.filter(b => 
          new Date(b.eventDate) >= new Date() && b.status !== 'cancelled'
        ).length,
      };
    },
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.unshift(action.payload);
      // Recalculate stats
      state.stats = {
        totalBookings: state.bookings.length,
        pendingBookings: state.bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: state.bookings.filter(b => b.status === 'confirmed').length,
        cancelledBookings: state.bookings.filter(b => b.status === 'cancelled').length,
        upcomingBookings: state.bookings.filter(b => 
          new Date(b.eventDate) >= new Date() && b.status !== 'cancelled'
        ).length,
      };
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
        // Recalculate stats
        state.stats = {
          totalBookings: state.bookings.length,
          pendingBookings: state.bookings.filter(b => b.status === 'pending').length,
          confirmedBookings: state.bookings.filter(b => b.status === 'confirmed').length,
          cancelledBookings: state.bookings.filter(b => b.status === 'cancelled').length,
          upcomingBookings: state.bookings.filter(b => 
            new Date(b.eventDate) >= new Date() && b.status !== 'cancelled'
          ).length,
        };
      }
      if (state.currentBooking?.id === action.payload.id) {
        state.currentBooking = action.payload;
      }
    },
    removeBooking: (state, action: PayloadAction<number>) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
      if (state.currentBooking?.id === action.payload) {
        state.currentBooking = null;
      }
      // Recalculate stats
      state.stats = {
        totalBookings: state.bookings.length,
        pendingBookings: state.bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: state.bookings.filter(b => b.status === 'confirmed').length,
        cancelledBookings: state.bookings.filter(b => b.status === 'cancelled').length,
        upcomingBookings: state.bookings.filter(b => 
          new Date(b.eventDate) >= new Date() && b.status !== 'cancelled'
        ).length,
      };
    },
    setStats: (state, action: PayloadAction<BookingState['stats']>) => {
      state.stats = action.payload;
    },
  },
});

export const {
  setBookings,
  setCurrentBooking,
  setLoading,
  setError,
  addBooking,
  updateBooking,
  removeBooking,
  setStats,
} = bookingSlice.actions;

export default bookingSlice.reducer;

// Selectors
export const selectBookings = (state: { bookings: BookingState }) => state.bookings.bookings;
export const selectCurrentBooking = (state: { bookings: BookingState }) => state.bookings.currentBooking;
export const selectBookingsLoading = (state: { bookings: BookingState }) => state.bookings.isLoading;
export const selectBookingsError = (state: { bookings: BookingState }) => state.bookings.error;
export const selectBookingStats = (state: { bookings: BookingState }) => state.bookings.stats;