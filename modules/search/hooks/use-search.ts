import { useState, useCallback } from "react";
import { SearchFilters } from "../types";

export function useSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    propertyType: "",
    priceRange: "",
  });

  const [isSearching, setIsSearching] = useState(false);

  const updateFilter = useCallback(
    (key: keyof SearchFilters, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const performSearch = useCallback(async (searchFilters: SearchFilters) => {
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
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      location: "",
      propertyType: "",
      priceRange: "",
    });
  }, []);

  return {
    filters,
    isSearching,
    updateFilter,
    performSearch,
    resetFilters,
  };
}
