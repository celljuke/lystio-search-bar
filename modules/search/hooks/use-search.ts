import { useCallback } from "react";
import { SearchFilters } from "../types";
import { useSearchStore } from "../store";

export function useSearch() {
  const { filters, isSearching, setIsSearching, updateFilter } =
    useSearchStore();

  const performSearch = useCallback(
    async (searchFilters: SearchFilters) => {
      setIsSearching(true);
      try {
        // TODO: Implement actual search logic with tRPC
        console.log("Searching with filters:", searchFilters);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [setIsSearching]
  );

  const resetFilters = useCallback(() => {
    useSearchStore.getState().resetFilters();
  }, []);

  return {
    filters,
    isSearching,
    updateFilter,
    performSearch,
    resetFilters,
  };
}
