"use client";

import { useEffect, useState, useRef } from "react";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import { MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Dynamically import Mapbox to avoid SSR issues
let useSearchBoxCore: any = null;
if (typeof window !== "undefined") {
  const MapboxSearch = require("@mapbox/search-js-react");
  useSearchBoxCore = MapboxSearch.useSearchBoxCore;
}

interface LocationSearchInputProps {
  value: string; // Comma-separated string of locations
  onSelect: (location: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  className?: string;
  showPopover?: boolean; // Control from parent whether location popover is visible
}

interface SearchSuggestion {
  name: string;
  place_formatted: string;
  feature_type: string;
  mapbox_id: string;
}

export function LocationSearchInput({
  value,
  onSelect,
  onFocus,
  placeholder = "Find a location, street, region or zip",
  className = "",
  showPopover = false,
}: LocationSearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [sessionToken, setSessionToken] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxCore = useSearchBoxCore
    ? useSearchBoxCore({
        accessToken: config.mapbox.accessToken,
      })
    : null;

  // Initialize selected locations from value
  useEffect(() => {
    if (value) {
      const locations = value
        .split(",")
        .map((loc) => loc.trim())
        .filter(Boolean);
      setSelectedLocations(locations);
    } else {
      setSelectedLocations([]);
    }
  }, [value]);

  useEffect(() => {
    // Generate a session token when component mounts
    setSessionToken(`session-${Date.now()}`);
  }, []);

  useEffect(() => {
    // Auto-focus
    if (inputRef.current) {
      inputRef.current.focus();
      onFocus?.();
    }
  }, [onFocus]);

  useEffect(() => {
    // Fetch suggestions when input changes
    const fetchSuggestions = async () => {
      // Only show search suggestions if user is typing (inputValue is not empty)
      if (!inputValue || inputValue.length < 2 || !searchBoxCore) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      try {
        const response = await searchBoxCore.suggest(inputValue, {
          sessionToken,
          language: "de",
          country: "AT",
          proximity: [16.3738, 48.2082],
        });

        setSuggestions(response.suggestions as SearchSuggestion[]);
        // Only open search popover if we have suggestions AND user is typing
        setIsOpen(response.suggestions.length > 0 && inputValue.length > 0);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue, searchBoxCore, sessionToken]);

  const handleSelect = (suggestion: SearchSuggestion) => {
    const locationName = suggestion.name;

    // Check if already selected
    if (selectedLocations.includes(locationName)) {
      setInputValue("");
      setIsOpen(false);
      setSuggestions([]);
      return;
    }

    // Limit to 3 selections
    if (selectedLocations.length >= 3) {
      setInputValue("");
      setIsOpen(false);
      setSuggestions([]);
      return;
    }

    // Add to selected locations
    const newLocations = [...selectedLocations, locationName];
    setSelectedLocations(newLocations);

    // Update parent with comma-separated string
    onSelect(newLocations.join(", "));

    // Clear input
    setInputValue("");
    setIsOpen(false);
    setSuggestions([]);

    // Refocus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleRemove = (locationToRemove: string) => {
    const newLocations = selectedLocations.filter(
      (loc) => loc !== locationToRemove
    );
    setSelectedLocations(newLocations);
    onSelect(newLocations.join(", "));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to remove last badge
    if (e.key === "Backspace" && !inputValue && selectedLocations.length > 0) {
      e.preventDefault();
      const newLocations = selectedLocations.slice(0, -1);
      setSelectedLocations(newLocations);
      onSelect(newLocations.join(", "));
      return;
    }

    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Only show search suggestions popover when user is typing (not the location popover)
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
        {selectedLocations.map((location) => (
          <Badge
            key={location}
            variant="secondary"
            className="inline-flex items-center flex-shrink-0 bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200 p-1 py-0.5 gap-1.5 text-sm font-medium max-w-[100px]"
          >
            <span className="truncate text-xs">{location}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(location);
              }}
              className="flex-shrink-0 rounded-full hover:bg-purple-200 p-0.5 transition-colors"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

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

      {/* Search Suggestions Popover - Only when user is typing */}
      {shouldShowSearchPopover && (
        <Popover open={shouldShowSearchPopover} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </PopoverTrigger>
          <PopoverContent
            className="w-[400px] p-0 bg-white border border-gray-200 rounded-xl shadow-xl"
            align="start"
            sideOffset={8}
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <div className="max-h-[300px] overflow-y-auto">
              {suggestions.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Places
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.mapbox_id}
                      onClick={() => handleSelect(suggestion)}
                      className={cn(
                        "w-full flex items-start gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left",
                        selectedIndex === index && "bg-gray-100",
                        selectedLocations.includes(suggestion.name) &&
                          "opacity-50"
                      )}
                      disabled={selectedLocations.includes(suggestion.name)}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        <MapPin className="w-5 h-5 text-[#A540F3]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {suggestion.place_formatted}
                        </div>
                        <div className="text-xs text-gray-400 capitalize mt-0.5">
                          {suggestion.feature_type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
