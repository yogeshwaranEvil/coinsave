// src/store/useAppStore.js
import { create } from 'zustand';

export const useAppStore = create((set) => ({
  isAED: true,
  fxRate: 22.85, // We will fetch this live later
  toggleCurrency: () => set((state) => ({ isAED: !state.isAED })),
  setFxRate: (rate) => set({ fxRate: rate }),
}));