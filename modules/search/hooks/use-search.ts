import { useCallback } from "react";
import { SearchFilters } from "../types";
import { useSearchStore } from "../store";
import { usePropertySearch } from "./use-property-search";

/**
 * Main search hook that combines UI state with backend search
 */
export function useSearch() {
  const { filters, isSearching, setIsSearching, updateFilter } =
    useSearchStore();
  const { search: triggerSearch, isLoading } = usePropertySearch();

  const performSearch = useCallback(
    async (searchFilters: SearchFilters) => {
      setIsSearching(true);
      try {
        console.log("Searching with filters:", searchFilters);
        // Trigger the tRPC query refetch
        await triggerSearch();
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [setIsSearching, triggerSearch]
  );

  const resetFilters = useCallback(() => {
    useSearchStore.getState().resetFilters();
  }, []);

  return {
    filters,
    isSearching: isSearching || isLoading,
    updateFilter,
    performSearch,
    resetFilters,
  };
}
