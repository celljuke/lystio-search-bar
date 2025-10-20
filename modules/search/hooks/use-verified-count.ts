import { useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import { useRentBuyMode } from "./use-rent-buy-mode";
import { convertCategoryToFilters } from "../utils/filter-converter";

/**
 * Hook for fetching verified listings count
 * Matches current search filters
 */
export function useVerifiedCount() {
  const { filters } = useSearchStore();
  const { mode: rentBuyMode } = useRentBuyMode();

  // Convert UI filters to backend search input
  const countFilter = useMemo(() => {
    return convertCategoryToFilters(filters, rentBuyMode);
  }, [filters, rentBuyMode]);

  // Fetch count from API
  const { data, isLoading, error } = trpc.search.count.useQuery(countFilter, {
    enabled: true, // Always fetch count
    refetchOnWindowFocus: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  return {
    count: data?.count ?? 0,
    isLoading,
    error,
  };
}
