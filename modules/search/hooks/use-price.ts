import { useState, useEffect, useMemo } from "react";
import { PriceRangeFilter } from "../types";
import { useSearchStore } from "../store";

interface UsePriceProps {
  rentBuyMode: "rent" | "buy" | "ai";
  onSelectPrice: (priceRange: PriceRangeFilter) => void;
}

export function usePrice({ rentBuyMode, onSelectPrice }: UsePriceProps) {
  const { filters } = useSearchStore();

  // Price bounds based on rent/buy mode
  const priceBounds = useMemo(() => {
    if (rentBuyMode === "rent" || rentBuyMode === "ai") {
      return { min: 400, max: 20000, step: 100 };
    }
    return { min: 10000, max: 2000000, step: 10000 };
  }, [rentBuyMode]);

  // Initialize with current filter value or default to full range
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    if (filters.priceRange) {
      return [filters.priceRange.min, filters.priceRange.max];
    }
    return [priceBounds.min, priceBounds.max];
  });

  // Update local state when filter changes externally or mode changes
  useEffect(() => {
    if (filters.priceRange) {
      setPriceRange([filters.priceRange.min, filters.priceRange.max]);
    } else {
      setPriceRange([priceBounds.min, priceBounds.max]);
    }
  }, [filters.priceRange, priceBounds.min, priceBounds.max]);

  // Generate histogram data (mock data for now)
  const histogramData = useMemo(() => {
    const buckets = 20;
    const bucketSize = (priceBounds.max - priceBounds.min) / buckets;
    return Array.from({ length: buckets }, (_, i) => {
      const price = priceBounds.min + i * bucketSize;
      // Mock distribution - more properties in middle price range
      const normalizedPosition = (i - buckets / 2) / (buckets / 2);
      const height = Math.exp(-(normalizedPosition * normalizedPosition) * 2);
      return {
        price,
        count: Math.round(height * 100),
      };
    });
  }, [priceBounds]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleApply = () => {
    const priceRangeFilter: PriceRangeFilter = {
      min: priceRange[0],
      max: priceRange[1],
      currency: "EUR",
    };
    onSelectPrice(priceRangeFilter);
  };

  const formatPrice = (price: number): string => {
    if (rentBuyMode === "rent" || rentBuyMode === "ai") {
      return `€${price.toLocaleString()}`;
    }
    if (price >= 1000000) {
      return `€${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `€${(price / 1000).toFixed(0)}K`;
    }
    return `€${price.toLocaleString()}`;
  };

  return {
    priceRange,
    priceBounds,
    histogramData,
    handlePriceChange,
    handleApply,
    formatPrice,
  };
}
