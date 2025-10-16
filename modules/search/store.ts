import { create } from "zustand";
import { SearchFilters } from "./types";

type PopoverId = "location" | "category" | "price";
type ViewMode = "list" | "map";

interface SearchState {
  filters: SearchFilters;
  isSearching: boolean;
  results: any[];

  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  setIsSearching: (isSearching: boolean) => void;
  setResults: (results: any[]) => void;
  resetFilters: () => void;

  isOpen: (id: PopoverId) => boolean;
  toggle: (id: PopoverId) => void;
  setOpenPopover: (id: PopoverId | null) => void;
  closeDropdown: () => void; // Close dropdown but keep search mode active
  exitSearchMode: () => void; // Close everything including overlay
  openPopover: PopoverId | null;
  isInSearchMode: boolean;
  isAnyPopoverOpen: () => boolean;

  // Category selection state
  selectedCategoryId: string | null;
  selectedSubcategories: string[];
  setSelectedCategory: (categoryId: string, subcategories: string[]) => void;

  // View mode state (mobile)
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Mobile search state
  isMobileSearchOpen: boolean;
  openMobileSearch: () => void;
  closeMobileSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  filters: {
    location: "",
    locationData: null,
    propertyType: null,
    priceRange: null,
  },
  isSearching: false,
  results: [],

  setFilters: (filters) => set({ filters }),

  updateFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  setIsSearching: (isSearching) => set({ isSearching }),

  setResults: (results) => set({ results }),

  resetFilters: () =>
    set({
      filters: {
        location: "",
        locationData: null,
        propertyType: null,
        priceRange: null,
      },
    }),

  openPopover: null,
  isInSearchMode: false,

  setOpenPopover: (id: PopoverId | null) =>
    set({ openPopover: id, isInSearchMode: id !== null }),

  isOpen: (id: PopoverId) => get().openPopover === id,

  toggle: (id: PopoverId) => {
    const currentOpen = get().openPopover;
    // If clicking the same button, close it but stay in search mode. Otherwise, switch to the new one
    if (currentOpen === id) {
      set({ openPopover: null, isInSearchMode: true });
    } else {
      set({ openPopover: id, isInSearchMode: true });
    }
  },

  closeDropdown: () => {
    // Close dropdown but keep search mode active (overlay stays)
    set({ openPopover: null, isInSearchMode: true });
  },

  exitSearchMode: () => {
    // Close everything - dropdown and search mode (overlay disappears)
    set({ openPopover: null, isInSearchMode: false });
  },

  isAnyPopoverOpen: () => {
    return get().isInSearchMode;
  },

  // Category selection state
  selectedCategoryId: "apartments",
  selectedSubcategories: ["all"],

  setSelectedCategory: (categoryId: string, subcategories: string[]) =>
    set({
      selectedCategoryId: categoryId,
      selectedSubcategories: subcategories,
    }),

  // View mode state (mobile)
  viewMode: "list",
  setViewMode: (mode: ViewMode) => set({ viewMode: mode }),

  // Mobile search state
  isMobileSearchOpen: false,
  openMobileSearch: () => set({ isMobileSearchOpen: true }),
  closeMobileSearch: () => set({ isMobileSearchOpen: false }),
}));
