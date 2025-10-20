import { create } from "zustand";
import { persist } from "zustand/middleware";

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
 */
export const useRentBuyMode = create<RentBuyModeState>()(
  persist(
    (set, get) => ({
      mode: "rent",
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === "rent" ? "buy" : "rent" }),
    }),
    {
      name: "rent-buy-mode-storage",
    }
  )
);
