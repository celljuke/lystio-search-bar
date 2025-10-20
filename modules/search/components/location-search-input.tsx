"use client";

import { cn } from "@/lib/utils";
import { useLocationSearch } from "../hooks/use-location-search";
import { LocationBadges } from "./location-badges";
import { SearchSuggestionsPopover } from "./search-suggestions-popover";
import type { SearchSuggestion } from "../hooks/use-location-search";

interface LocationSearchInputProps {
  value: string;
  onSelect: (location: string) => void;
  onSelectWithBbox?: (
    locationName: string,
    bbox: [[number, number], [number, number]],
    center?: { lng: number; lat: number }
  ) => void;
  onFocus?: () => void;
  onInputChange?: (value: string) => void;
  onSuggestionsChange?: (suggestions: SearchSuggestion[]) => void;
  placeholder?: string;
  className?: string;
  showPopover?: boolean;
  renderSuggestionsInline?: boolean;
}

export function LocationSearchInput({
  value,
  onSelect,
  onSelectWithBbox,
  onFocus,
  onInputChange,
  onSuggestionsChange,
  placeholder = "Find a location, street, region or zip",
  className = "",
  showPopover = false,
  renderSuggestionsInline = false,
}: LocationSearchInputProps) {
  const {
    inputValue,
    setInputValue,
    selectedLocations,
    suggestions,
    isOpen,
    setIsOpen,
    selectedIndex,
    inputRef,
    handleSelect,
    handleRemove,
    handleKeyDown,
  } = useLocationSearch({
    value,
    onSelect,
    onSelectWithBbox,
    onInputChange,
    onSuggestionsChange,
    onFocus,
  });

  // Only show search suggestions popover when user is typing
  const shouldShowSearchPopover = isOpen && inputValue.length > 0;

  return (
    <>
      <div
        className={cn(
          "relative w-full flex items-center gap-1.5 overflow-hidden cursor-text",
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected Location Badges */}
        <LocationBadges locations={selectedLocations} onRemove={handleRemove} />

        {/* Search Input - Only show if less than 3 selections */}
        {selectedLocations.length < 3 && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedLocations.length === 0 ? placeholder : ""}
            className="flex-1 min-w-0 bg-transparent text-sm font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none border-none outline-none"
            autoComplete="off"
          />
        )}
      </div>

      {/* Search Suggestions Popover - Only when user is typing and not rendering inline */}
      {shouldShowSearchPopover && !renderSuggestionsInline && (
        <SearchSuggestionsPopover
          isOpen={shouldShowSearchPopover}
          suggestions={suggestions}
          selectedLocations={selectedLocations}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          onOpenChange={setIsOpen}
        />
      )}
    </>
  );
}

// Export the SearchSuggestion type for use in other components
export type { SearchSuggestion };
