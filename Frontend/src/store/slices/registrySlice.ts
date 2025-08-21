import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RegistryState, WeddingRegistry, RegistryItem } from '../../types';

const initialState: RegistryState = {
  registry: null,
  isLoading: false,
  error: null,
  stats: {
    totalItems: 0,
    totalValue: 0,
    purchasedItems: 0,
    remainingItems: 0,
    completionPercentage: 0,
  },
};

const registrySlice = createSlice({
  name: 'registry',
  initialState,
  reducers: {
    setRegistry: (state, action: PayloadAction<WeddingRegistry>) => {
      state.registry = action.payload;
      state.isLoading = false;
      state.error = null;
      // Calculate stats
      const items = action.payload.registryItems || [];
      state.stats = {
        totalItems: items.length,
        totalValue: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        purchasedItems: items.filter(item => item.purchased).length,
        remainingItems: items.filter(item => !item.purchased).length,
        completionPercentage: items.length > 0 
          ? Math.round((items.filter(item => item.purchased).length / items.length) * 100)
          : 0,
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addRegistryItem: (state, action: PayloadAction<RegistryItem>) => {
      if (state.registry) {
        state.registry.registryItems.unshift(action.payload);
        // Recalculate stats
        const items = state.registry.registryItems;
        state.stats = {
          totalItems: items.length,
          totalValue: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          purchasedItems: items.filter(item => item.purchased).length,
          remainingItems: items.filter(item => !item.purchased).length,
          completionPercentage: items.length > 0 
            ? Math.round((items.filter(item => item.purchased).length / items.length) * 100)
            : 0,
        };
      }
    },
    updateRegistryItem: (state, action: PayloadAction<RegistryItem>) => {
      if (state.registry) {
        const index = state.registry.registryItems.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.registry.registryItems[index] = action.payload;
          // Recalculate stats
          const items = state.registry.registryItems;
          state.stats = {
            totalItems: items.length,
            totalValue: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            purchasedItems: items.filter(item => item.purchased).length,
            remainingItems: items.filter(item => !item.purchased).length,
            completionPercentage: items.length > 0 
              ? Math.round((items.filter(item => item.purchased).length / items.length) * 100)
              : 0,
          };
        }
      }
    },
    removeRegistryItem: (state, action: PayloadAction<number>) => {
      if (state.registry) {
        state.registry.registryItems = state.registry.registryItems.filter(
          item => item.id !== action.payload
        );
        // Recalculate stats
        const items = state.registry.registryItems;
        state.stats = {
          totalItems: items.length,
          totalValue: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          purchasedItems: items.filter(item => item.purchased).length,
          remainingItems: items.filter(item => !item.purchased).length,
          completionPercentage: items.length > 0 
            ? Math.round((items.filter(item => item.purchased).length / items.length) * 100)
            : 0,
        };
      }
    },
    setStats: (state, action: PayloadAction<RegistryState['stats']>) => {
      state.stats = action.payload;
    },
  },
});

export const {
  setRegistry,
  setLoading,
  setError,
  addRegistryItem,
  updateRegistryItem,
  removeRegistryItem,
  setStats,
} = registrySlice.actions;

export default registrySlice.reducer;

// Selectors
export const selectRegistry = (state: { registry: RegistryState }) => state.registry.registry;
export const selectRegistryLoading = (state: { registry: RegistryState }) => state.registry.isLoading;
export const selectRegistryError = (state: { registry: RegistryState }) => state.registry.error;
export const selectRegistryStats = (state: { registry: RegistryState }) => state.registry.stats;