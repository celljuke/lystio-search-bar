import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import { useRentBuyMode } from "./use-rent-buy-mode";
import { convertCategoryToFilters } from "../utils/filter-converter";

/**
 * Hook for property search using tRPC with accumulated results
 * Connects the UI search filters with the backend search API
 */
export function usePropertySearch() {
  const { filters, isInSearchMode } = useSearchStore();
  const { mode: rentBuyMode } = useRentBuyMode();
  const [currentPage, setCurrentPage] = useState(1);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 26;

  // Track previous filters to detect when to reset
  const prevFiltersRef = useRef<string>("");
  const filtersKey = useMemo(
    () => JSON.stringify({ filters, rentBuyMode }),
    [filters, rentBuyMode]
  );

  // Reset when filters change
  useEffect(() => {
    if (prevFiltersRef.current && prevFiltersRef.current !== filtersKey) {
      setCurrentPage(1);
      setAllProperties([]);
      setTotalCount(0);
    }
    prevFiltersRef.current = filtersKey;
  }, [filtersKey]);

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

  const { data, isLoading, error, isFetching } = trpc.search.search.useQuery(
    searchInput,
    {
      enabled: hasLocation, // Only search when location is set
      refetchOnWindowFocus: false,
      staleTime: 30000, // Consider data fresh for 30 seconds
    }
  );

  // Accumulate properties when new data arrives
  useEffect(() => {
    if (data?.properties) {
      setAllProperties((prev) => {
        // If it's page 1, replace everything
        if (currentPage === 1) {
          return data.properties;
        }
        // Otherwise, append new properties (avoid duplicates)
        const existingIds = new Set(prev.map((p) => p.id));
        const newProperties = data.properties.filter(
          (p) => !existingIds.has(p.id)
        );
        return [...prev, ...newProperties];
      });

      if (data.pagination) {
        setTotalCount(data.pagination.total);
      }
    }
  }, [data, currentPage]);

  const hasNextPage = currentPage < Math.ceil(totalCount / pageSize);

  // Load more properties (pagination)
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage, isFetching]);

  // Trigger new search (reset to page 1)
  const search = useCallback(() => {
    setCurrentPage(1);
    setAllProperties([]);
    setTotalCount(0);
  }, []);

  return {
    properties: allProperties,
    pagination: {
      total: totalCount,
      page: currentPage,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      hasNextPage,
      hasPreviousPage: currentPage > 1,
    },
    isLoading: isLoading && allProperties.length === 0,
    isFetching,
    error,
    search,
    loadMore,
    hasNextPage,
    isFetchingNextPage: isFetching && currentPage > 1,
    isSearchActive: isInSearchMode && Boolean(filters.location),
  };
}
