import { create } from "zustand";
import { SearchFilters } from "./types";

type PopoverId = "location" | "category" | "price";
interface SearchState {
  filters: SearchFilters;
  isSearching: boolean;
  results: any[];

  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setResults: (results: any[]) => void;
  resetFilters: () => void;

  isOpen: (id: PopoverId) => boolean;
  toggle: (id: PopoverId) => void;
  openPopover: PopoverId | null;
  isAnyPopoverOpen: () => boolean;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  filters: {
    location: "",
    propertyType: "",
    priceRange: "",
  },
  isSearching: false,
  results: [],

  setFilters: (filters) => set({ filters }),

  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  setIsSearching: (isSearching) => set({ isSearching }),

  setResults: (results) => set({ results }),

  resetFilters: () =>
    set({
      filters: {
        location: "",
        propertyType: "",
        priceRange: "",
      },
    }),

  openPopover: null,
  setOpenPopover: (id: PopoverId) => set({ openPopover: id }),
  isOpen: (id: PopoverId) => get().openPopover === id,
  toggle: (id: PopoverId) => {
    const currentOpen = get().openPopover;
    set({ openPopover: currentOpen === id ? null : id });
  },
  isAnyPopoverOpen: () => {
    return (
      get().isOpen("location") ||
      get().isOpen("category") ||
      get().isOpen("price")
    );
  },
}));
