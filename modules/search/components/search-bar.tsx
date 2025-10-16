"use client";

import { useEffect, useRef } from "react";
import { SearchBarProps, PropertyTypeFilter, PriceRangeFilter } from "../types";
import { useSearch } from "../hooks/use-search";
import { useSearchStore } from "../store";
import { useLocationSelect } from "../hooks/use-location-select";
import { cn } from "@/lib/utils";
import { SearchButton } from "./search-button";
import { SearchTrigger } from "./search-trigger";
import { LocationPopover } from "./location-popover";
import { CategoryPopover } from "./category-popover";
import { PricePopover } from "./price-popover";
import { LocationSearchInput } from "./location-search-input";

export function SearchBar({
  onSearch,
  className = "",
  rentBuyMode = "rent",
}: SearchBarProps) {
  const { filters, isSearching, updateFilter, performSearch } = useSearch();
  const { isOpen, toggle, closeDropdown, openPopover } = useSearchStore();
  const { selectLocation } = useLocationSelect();

  const searchBarRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (filters.location && filters.propertyType && filters.priceRange) {
      await performSearch(filters);
      onSearch?.(filters);
    }
  };

  // Handle click outside to close dropdown but keep overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if click is on the overlay
      if (target.classList.contains("search-overlay")) {
        return; // Let overlay handle its own click
      }

      // Check if click is outside the search bar
      if (searchBarRef.current && !searchBarRef.current.contains(target)) {
        // Close the dropdown but keep search mode active (overlay stays)
        if (openPopover) {
          closeDropdown();
        }
      }
    };

    if (openPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPopover, closeDropdown]);

  const { isInSearchMode } = useSearchStore();
  const { selectLocationWithBbox } = useLocationSelect();

  const handleLocationSelect = (location: string) => {
    // Use the location select hook to set location with bbox
    selectLocation(location);
    closeDropdown();
  };

  const handleLocationSelectWithBbox = (
    locationName: string,
    bbox: [[number, number], [number, number]],
    center?: { lng: number; lat: number }
  ) => {
    // Use the location select hook with bbox data from Mapbox
    selectLocationWithBbox(locationName, bbox, center);
    closeDropdown();
  };

  const handleCategorySelect = (
    categoryName: string,
    propertyTypeFilter: PropertyTypeFilter,
    shouldClose: boolean = true
  ) => {
    // Store the full PropertyTypeFilter object in the filters
    updateFilter("propertyType", propertyTypeFilter);
    if (shouldClose) {
      closeDropdown();
    }
  };

  const handlePriceSelect = (priceRange: PriceRangeFilter) => {
    updateFilter("priceRange", priceRange);
    closeDropdown();
  };

  // Format price display for the trigger
  const formatPriceDisplay = (priceRange: PriceRangeFilter | null): string => {
    if (!priceRange) return "";
    const formatPrice = (price: number) => {
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
    return `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`;
  };

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto", className)}>
      {/* Desktop Layout */}
      <div className="hidden md:block w-full" ref={searchBarRef}>
        <div
          className={cn(
            "relative bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-200 flex items-center",
            isInSearchMode ? "h-16" : "h-14"
          )}
        >
          {/* Location Trigger */}
          <SearchTrigger
            isSearchMode={isInSearchMode}
            isRounded="left"
            onClick={() => toggle("location")}
            title="Location"
            description="City District, Street, Postcode"
            value={filters.location}
            descriptionColor="gray"
            disableClick={false}
            renderDescription={() => (
              <div
                onClick={(e) => {
                  // Only stop propagation if the popover is open and user is clicking inside the input
                  if (isOpen("location")) {
                    e.stopPropagation();
                  }
                }}
              >
                <LocationSearchInput
                  value={filters.location}
                  onSelect={handleLocationSelect}
                  onSelectWithBbox={handleLocationSelectWithBbox}
                  placeholder="Find a location, street, region or zip"
                  showPopover={isOpen("location")}
                />
              </div>
            )}
          >
            {/* Show location popover when opened and user hasn't started typing */}
            {isOpen("location") && (
              <LocationPopover onSelectLocation={handleLocationSelect} />
            )}
          </SearchTrigger>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-200" />

          {/* Category Trigger */}
          <SearchTrigger
            isSearchMode={isInSearchMode}
            onClick={() => toggle("category")}
            title="Category"
            description="Apartments"
            value={filters.propertyType?.categoryName || ""}
            descriptionColor="black"
          >
            {isOpen("category") && (
              <CategoryPopover onSelectCategory={handleCategorySelect} />
            )}
          </SearchTrigger>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-200" />

          {/* Price Trigger */}
          <SearchTrigger
            isSearchMode={isInSearchMode}
            isRounded="right"
            onClick={() => toggle("price")}
            title="Price"
            description="Any Price"
            value={formatPriceDisplay(filters.priceRange)}
            descriptionColor="gray"
            paddingRight={isInSearchMode ? "pr-24" : "pr-16"}
          >
            {isOpen("price") && (
              <PricePopover
                rentBuyMode={rentBuyMode}
                onSelectPrice={handlePriceSelect}
              />
            )}
          </SearchTrigger>

          {/* Search Button */}
          <SearchButton onClick={handleSearch} isSearchMode={isInSearchMode} />
        </div>
      </div>
    </div>
  );
}
