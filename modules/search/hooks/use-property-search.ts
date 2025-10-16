import { useCallback, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import { useRentBuyMode } from "./use-rent-buy-mode";
import { convertCategoryToFilters } from "../utils/filter-converter";

/**
 * Hook for property search using tRPC
 * Connects the UI search filters with the backend search API
 */
export function usePropertySearch() {
  const { filters, isInSearchMode } = useSearchStore();
  const { mode: rentBuyMode } = useRentBuyMode();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 26;

  // Convert UI filters to backend search input
  const searchInput = useMemo(() => {
    const backendFilters = convertCategoryToFilters(filters, rentBuyMode);

    return {
      filter: backendFilters,
      sort: {
        createdAt: "desc" as const,
      },
      paging: {
        page: currentPage,
        pageSize,
      },
    };
  }, [filters, rentBuyMode, currentPage]);

  // Execute search query with tRPC
  // Enable search if location is set OR if we have locationData with bbox
  const hasLocation = Boolean(filters.location || filters.locationData?.bbox);

  const { data, isLoading, error, refetch } = trpc.search.search.useQuery(
    searchInput,
    {
      enabled: hasLocation, // Only search when location is set
      refetchOnWindowFocus: false,
      staleTime: 30000, // Consider data fresh for 30 seconds
    }
  );

  const properties = data?.properties || [];
  const pagination = data?.pagination;
  const hasNextPage = pagination?.hasNextPage ?? false;

  // Load more properties (pagination)
  const loadMore = useCallback(async () => {
    if (hasNextPage && !isLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage, isLoading]);

  // Trigger new search (reset to page 1)
  const search = useCallback(() => {
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  return {
    properties,
    pagination,
    isLoading,
    error,
    search,
    loadMore,
    hasNextPage,
    isFetchingNextPage: false, // We're not using infinite query, so always false
    isSearchActive: isInSearchMode && Boolean(filters.location),
  };
}
