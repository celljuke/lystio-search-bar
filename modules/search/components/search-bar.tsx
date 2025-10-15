"use client";

import { useEffect, useRef } from "react";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { SearchBarProps } from "../types";
import { useSearch } from "../hooks/use-search";
import { useSearchStore } from "../store";
import { cn } from "../../../lib/utils";

export function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const { filters, isSearching, updateFilter, performSearch } = useSearch();
  const { isOpen, toggle, closeDropdown, openPopover } = useSearchStore();

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

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto", className)}>
      {/* Desktop Layout */}
      <div className="hidden md:block" ref={searchBarRef}>
        <div className="relative bg-white rounded-full shadow-lg border border-gray-200 transition-shadow duration-200 flex items-center h-14">
          {/* Location Button */}
          <div className="relative flex-1 h-full">
            <button
              className="flex h-full w-full items-center rounded-l-full hover:bg-gray-50 px-6 cursor-pointer bg-transparent border-none transition-colors"
              type="button"
              onClick={() => toggle("location")}
            >
              {!isInSearchMode ? (
                // Normal state - only title
                <span className="text-sm font-medium text-black">Location</span>
              ) : (
                // Search mode - title + description
                <div className="flex flex-col items-start gap-0.5 w-full">
                  <span className="text-xs font-medium text-black">
                    Location
                  </span>
                  <span className="text-sm font-normal text-gray-400 truncate">
                    {filters.location ||
                      "Find a location, street, region or zip"}
                  </span>
                </div>
              )}
            </button>

            {isOpen("location") && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] p-4">
                <div className="space-y-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Draw an area on the map
                  </Button>

                  <div>
                    <h4 className="font-medium mb-2">By City</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Vienna",
                        "Graz",
                        "Linz",
                        "Salzburg",
                        "Innsbruck",
                        "Klagenfurt",
                      ].map((city) => (
                        <Button
                          key={city}
                          variant="ghost"
                          className="h-auto p-3 justify-start"
                          onClick={() => {
                            updateFilter("location", city);
                            closeDropdown();
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">{city}</span>
                            <span className="text-xs text-gray-500">
                              23 Districts
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">By State</h4>
                    <div className="space-y-2">
                      {["Lower Austria", "Upper Austria"].map((state) => (
                        <Button
                          key={state}
                          variant="ghost"
                          className="w-full justify-between"
                          onClick={() => {
                            updateFilter("location", state);
                            closeDropdown();
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">{state}</span>
                            <span className="text-xs text-gray-500">
                              24 Districts
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-200" />

          {/* Category Button */}
          <div className="relative flex-1 h-full">
            <button
              className="flex h-full w-full items-center hover:bg-gray-50 px-6 cursor-pointer bg-transparent border-none transition-colors"
              type="button"
              onClick={() => toggle("category")}
            >
              {!isInSearchMode ? (
                // Normal state - only title
                <span className="text-sm font-medium text-black">Category</span>
              ) : (
                // Search mode - title + description
                <div className="flex flex-col items-start gap-0.5 w-full">
                  <span className="text-xs font-medium text-black">
                    Category
                  </span>
                  <span className="text-sm font-normal text-black">
                    {filters.propertyType || "Apartments"}
                  </span>
                </div>
              )}
            </button>

            {isOpen("category") && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] p-4">
                <div className="space-y-2">
                  {["Apartments", "Houses", "Commercial", "Land"].map(
                    (type) => (
                      <Button
                        key={type}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          updateFilter("propertyType", type);
                          closeDropdown();
                        }}
                      >
                        <Home className="w-4 h-4 mr-2" />
                        {type}
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-200" />

          {/* Price Button */}
          <div className="relative flex-1 h-full">
            <button
              className="flex h-full w-full items-center hover:bg-gray-50 px-6 pr-16 cursor-pointer bg-transparent border-none transition-colors rounded-r-full"
              type="button"
              onClick={() => toggle("price")}
            >
              {!isInSearchMode ? (
                // Normal state - only title
                <span className="text-sm font-medium text-black">Price</span>
              ) : (
                // Search mode - title + description
                <div className="flex flex-col items-start gap-0.5 w-full">
                  <span className="text-xs font-medium text-black">Price</span>
                  <span className="text-sm font-normal text-gray-400">
                    {filters.priceRange || "Any Price"}
                  </span>
                </div>
              )}
            </button>

            {isOpen("price") && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Under €500",
                        "€500 - €1000",
                        "€1000 - €1500",
                        "€1500 - €2000",
                        "€2000 - €3000",
                        "Over €3000",
                      ].map((range) => (
                        <Button
                          key={range}
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            updateFilter("priceRange", range);
                            closeDropdown();
                          }}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          {range}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Button - Positioned absolutely on the right */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button
              onClick={handleSearch}
              className="h-12 w-12 rounded-full bg-[#A540F3] hover:bg-[#9338D1] shadow-md"
            >
              <Search className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
