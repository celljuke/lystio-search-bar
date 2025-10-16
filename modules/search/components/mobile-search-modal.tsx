"use client";

import { useEffect, useState } from "react";
import { useSearchStore } from "../store";
import { useLocationSelect } from "../hooks/use-location-select";
import { LocationSearchInput } from "./location-search-input";
import { LocationPopover } from "./location-popover";
import { X, Search as SearchIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileSearchModal() {
  const { isMobileSearchOpen, closeMobileSearch, filters, updateFilter } =
    useSearchStore();
  const { selectLocation, selectLocationWithBbox } = useLocationSelect();
  const [showLocationPopover, setShowLocationPopover] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isMobileSearchOpen) {
      setShowLocationPopover(true);
      setIsTyping(false);
    }
  }, [isMobileSearchOpen]);

  const handleLocationSelect = (location: string) => {
    selectLocation(location);
    closeMobileSearch();
  };

  const handleLocationSelectWithBbox = (
    locationName: string,
    bbox: [[number, number], [number, number]],
    center?: { lng: number; lat: number }
  ) => {
    selectLocationWithBbox(locationName, bbox, center);
    closeMobileSearch();
  };

  const handleInputFocus = () => {
    setIsTyping(true);
    setShowLocationPopover(false);
  };

  const handleBackClick = () => {
    if (isTyping) {
      setIsTyping(false);
      setShowLocationPopover(true);
      updateFilter("location", "");
    } else {
      closeMobileSearch();
    }
  };

  if (!isMobileSearchOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-50 md:hidden"
        onClick={closeMobileSearch}
      />

      {/* Modal */}
      <div className="fixed inset-0 bg-white z-50 md:hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <button
            onClick={handleBackClick}
            className="p-2 -ml-2 text-gray-700 hover:text-gray-900"
            aria-label={isTyping ? "Back" : "Close"}
          >
            {isTyping ? (
              <ArrowLeft className="w-6 h-6" />
            ) : (
              <X className="w-6 h-6" />
            )}
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Search</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Search Input */}
        <div className="px-4 py-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="w-5 h-5" />
            </div>
            <LocationSearchInput
              value={filters.location}
              onSelect={handleLocationSelect}
              onSelectWithBbox={handleLocationSelectWithBbox}
              placeholder="City District, Street, Postcode"
              showPopover={false}
              className="w-full h-14 pl-12 pr-4 text-base border-2 border-[#8B5CF6] rounded-full focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              onFocus={handleInputFocus}
            />
          </div>
        </div>

        {/* Search by Drawing CTA */}
        <div className="px-4 mb-6">
          <button className="w-full flex items-center justify-between px-6 py-4 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#8B5CF6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">
                Search by drawing an area on the map
              </span>
            </div>
            <svg
              className="w-5 h-5 text-[#8B5CF6]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4">
          {!isTyping && showLocationPopover && (
            <LocationPopover
              onSelectLocation={handleLocationSelect}
              className="relative top-0 left-0 mt-0 w-full border-0 shadow-none"
            />
          )}
        </div>
      </div>
    </>
  );
}
