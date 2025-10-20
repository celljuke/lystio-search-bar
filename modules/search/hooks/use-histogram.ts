import { useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import { useRentBuyMode } from "./use-rent-buy-mode";
import { convertCategoryToFilters } from "../utils/filter-converter";

/**
 * Hook to fetch and manage price histogram data
 * Automatically refetches when filters change
 */
export function useHistogram() {
  const { filters, setHistogram, setHistogramLoading } = useSearchStore();
  const { mode: rentBuyMode } = useRentBuyMode();

  // Convert UI filters to backend format (excluding price range)
  const backendFilters = useMemo(() => {
    return convertCategoryToFilters(
      filters,
      rentBuyMode === "buy" ? "buy" : "rent"
    );
  }, [filters, rentBuyMode]);

  // Fetch histogram data from API
  const { data: histogramResponse, isLoading } = trpc.search.histogram.useQuery(
    backendFilters,
    {
      enabled: true, // Always fetch histogram
      refetchOnWindowFocus: false,
      staleTime: 30000, // Consider data fresh for 30 seconds
    }
  );

  // Update Zustand store when histogram data changes
  useEffect(() => {
    if (histogramResponse) {
      setHistogram(histogramResponse);
    }
  }, [histogramResponse, setHistogram]);

  // Update loading state
  useEffect(() => {
    setHistogramLoading(isLoading);
  }, [isLoading, setHistogramLoading]);

  return {
    histogram: histogramResponse,
    isLoading,
  };
}
