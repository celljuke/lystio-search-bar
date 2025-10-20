import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSearchStore } from "../store";

type RentBuyMode = "rent" | "buy";

interface RentBuyModeState {
  mode: RentBuyMode;
  setMode: (mode: RentBuyMode) => void;
  toggleMode: () => void;
}

/**
 * Hook for managing rent/buy mode state
 * Persisted to localStorage for better UX
 *
 * Note: "ai" mode is handled at the UI level but stored as "rent"
 * since the API doesn't support AI mode yet
 *
 * When mode changes, price filter is automatically reset since
 * rent and buy have completely different price ranges
 */
export const useRentBuyMode = create<RentBuyModeState>()(
  persist(
    (set, get) => ({
      mode: "rent",
      setMode: (mode) => {
        const currentMode = get().mode;

        // Only reset price if mode actually changed
        if (currentMode !== mode) {
          set({ mode });

          // Reset price filter when switching between rent/buy
          const { updateFilter } = useSearchStore.getState();
          updateFilter("priceRange", null);
        }
      },
      toggleMode: () => {
        const newMode = get().mode === "rent" ? "buy" : "rent";
        get().setMode(newMode);
      },
    }),
    {
      name: "rent-buy-mode-storage",
    }
  )
);
