import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ToastState, Toast } from '../../types';

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        duration: action.payload.duration || 5000,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;
export default toastSlice.reducer;

// Selectors
export const selectToasts = (state: { toasts: ToastState }) => state.toasts.toasts;

// Toast helper functions
export const createSuccessToast = (title: string, message?: string): Omit<Toast, 'id'> => ({
  type: 'success',
  title,
  message,
});

export const createErrorToast = (title: string, message?: string): Omit<Toast, 'id'> => ({
  type: 'error',
  title,
  message,
});

export const createWarningToast = (title: string, message?: string): Omit<Toast, 'id'> => ({
  type: 'warning',
  title,
  message,
});

export const createInfoToast = (title: string, message?: string): Omit<Toast, 'id'> => ({
  type: 'info',
  title,
  message,
});