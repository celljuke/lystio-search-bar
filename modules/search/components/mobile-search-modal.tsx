"use client";

import { useEffect, useState } from "react";
import { useSearchStore } from "../store";
import { useLocationSelect } from "../hooks/use-location-select";
import {
  LocationSearchInput,
  type SearchSuggestion,
} from "./location-search-input";
import { MobileLocationContent } from "./mobile-location-content";
import { MobileSearchSuggestions } from "./mobile-search-suggestions";
import { X, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileSearchModal() {
  const { isMobileSearchOpen, closeMobileSearch } = useSearchStore();
  const { selectLocation, selectLocationWithBbox } = useLocationSelect();
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isMobileSearchOpen) {
      setIsTyping(false);
      setSuggestions([]);
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

  const handleInputChange = (value: string) => {
    // Show/hide content based on whether user is typing
    setIsTyping(value.length > 0);
  };

  const handleSuggestionsChange = (newSuggestions: SearchSuggestion[]) => {
    setSuggestions(newSuggestions);
  };

  const handleSuggestionSelect = async (suggestion: SearchSuggestion) => {
    // Use selectLocationWithBbox if we have the data, otherwise fallback
    const locationName = suggestion.name;

    // For now, just use the simple select which will handle bbox lookup
    handleLocationSelect(locationName);
  };

  if (!isMobileSearchOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-[60] md:hidden"
        onClick={closeMobileSearch}
      />

      {/* Modal */}
      <div className="fixed inset-0 bg-white z-[61] md:hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200 relative">
          <h2 className="text-lg font-semibold text-gray-900">Search</h2>
          <button
            onClick={closeMobileSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-4 py-4">
          <div className="relative bg-gray-50 rounded-full border border-gray-200 focus-within:border-[#8B5CF6] focus-within:ring-2 focus-within:ring-[#8B5CF6]/20 transition-all">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <SearchIcon className="w-5 h-5" />
            </div>
            <LocationSearchInput
              value=""
              onSelect={handleLocationSelect}
              onSelectWithBbox={handleLocationSelectWithBbox}
              onInputChange={handleInputChange}
              onSuggestionsChange={handleSuggestionsChange}
              placeholder="City District, Street, Postcode"
              showPopover={false}
              renderSuggestionsInline={true}
              className="w-full h-14 pl-4 pr-12 text-base bg-transparent border-0 focus:outline-none"
            />
          </div>
        </div>

        {/* Content Area */}
        {!isTyping ? (
          <>
            {/* Search by Drawing CTA */}
            <div className="px-4 mb-4">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 rounded-2xl transition-colors border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
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
                  <span className="text-sm font-normal text-gray-900">
                    Search by drawing an area on the map
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-[#8B5CF6] flex-shrink-0"
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

            {/* City Grid and State List */}
            <div className="flex-1 overflow-y-auto px-4">
              <MobileLocationContent onSelectLocation={handleLocationSelect} />
            </div>
          </>
        ) : (
          /* Search Suggestions */
          <div className="flex-1 overflow-y-auto px-4">
            <MobileSearchSuggestions
              suggestions={suggestions}
              onSelectSuggestion={handleSuggestionSelect}
            />
          </div>
        )}
      </div>
    </>
  );
}
