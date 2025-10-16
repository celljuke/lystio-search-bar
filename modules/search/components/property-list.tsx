"use client";

import { useEffect, useRef } from "react";
import { PropertyCard } from "./property-card";
import { usePropertySearch } from "../hooks/use-property-search";
import { Loader2 } from "lucide-react";

interface PropertyListProps {
  onPropertyClick?: (propertyId: string) => void;
}

export function PropertyList({ onPropertyClick }: PropertyListProps) {
  const {
    properties,
    pagination,
    isLoading,
    error,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
  } = usePropertySearch();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  // Loading state
  if (isLoading && properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-sm text-gray-600">Searching properties…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Search Error
          </h3>
          <p className="text-sm text-gray-600">
            {error.message || "Failed to load properties. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (properties.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No properties found
          </h3>
          <p className="text-sm text-gray-600">
            Try adjusting your search filters to see more results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {pagination?.total || 0} Listing
            {pagination?.total !== 1 ? "s" : ""} in Vienna
          </h2>
          {pagination && (
            <p className="text-sm text-gray-600 mt-1">
              Showing {properties.length} of {pagination.total} properties
            </p>
          )}
        </div>

        {/* Sort Dropdown - TODO: Implement */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          Price (Low to high)
        </button>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => onPropertyClick?.(property.id)}
          />
        ))}
      </div>

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
        </div>
      )}

      {/* Infinite Scroll Observer Target */}
      <div ref={observerTarget} className="h-4" />

      {/* Load More Button (fallback) */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMore}
            className="px-6 py-3 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Load More Properties
          </button>
        </div>
      )}
    </div>
  );
}
