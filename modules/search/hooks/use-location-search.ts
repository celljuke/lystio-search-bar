import { useEffect, useState, useRef } from "react";
import { config } from "@/lib/config";

// Dynamically import Mapbox to avoid SSR issues
let useSearchBoxCore: any = null;
if (typeof window !== "undefined") {
  const MapboxSearch = require("@mapbox/search-js-react");
  useSearchBoxCore = MapboxSearch.useSearchBoxCore;
}

export interface SearchSuggestion {
  name: string;
  place_formatted: string;
  feature_type: string;
  mapbox_id: string;
}

interface UseLocationSearchProps {
  value: string;
  onSelect: (location: string) => void;
  onSelectWithBbox?: (
    locationName: string,
    bbox: [[number, number], [number, number]],
    center?: { lng: number; lat: number }
  ) => void;
  onInputChange?: (value: string) => void;
  onSuggestionsChange?: (suggestions: SearchSuggestion[]) => void;
  onFocus?: () => void;
}

export function useLocationSearch({
  value,
  onSelect,
  onSelectWithBbox,
  onInputChange,
  onSuggestionsChange,
  onFocus,
}: UseLocationSearchProps) {
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

  // Notify parent when input value changes
  useEffect(() => {
    onInputChange?.(inputValue);
  }, [inputValue, onInputChange]);

  // Notify parent when suggestions change
  useEffect(() => {
    onSuggestionsChange?.(suggestions);
  }, [suggestions, onSuggestionsChange]);

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

  // Generate session token on mount
  useEffect(() => {
    setSessionToken(`session-${Date.now()}`);
  }, []);

  // Auto-focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      onFocus?.();
    }
  }, [onFocus]);

  // Fetch suggestions when input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
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

  // Handle selecting a suggestion
  const handleSelect = async (suggestion: SearchSuggestion) => {
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

    // Retrieve full location data with bbox if onSelectWithBbox is provided
    if (onSelectWithBbox && searchBoxCore) {
      try {
        const retrieveResponse = await searchBoxCore.retrieve(suggestion, {
          sessionToken,
        });

        if (retrieveResponse?.features?.[0]) {
          const feature = retrieveResponse.features[0];
          const geometry = feature.geometry;
          const properties = feature.properties;

          let bbox: [[number, number], [number, number]] | null = null;
          let center: { lng: number; lat: number } | undefined;

          // Get bbox from properties or geometry
          if (properties.bbox) {
            bbox = [
              [properties.bbox[0], properties.bbox[1]],
              [properties.bbox[2], properties.bbox[3]],
            ];
          } else if (geometry.type === "Point") {
            const [lng, lat] = geometry.coordinates;
            const offset = 0.01; // ~1km
            bbox = [
              [lng - offset, lat - offset],
              [lng + offset, lat + offset],
            ];
          }

          // Get center from geometry
          if (geometry.type === "Point") {
            center = {
              lng: geometry.coordinates[0],
              lat: geometry.coordinates[1],
            };
          } else if (properties.coordinates) {
            center = {
              lng: properties.coordinates.longitude,
              lat: properties.coordinates.latitude,
            };
          }

          if (bbox) {
            onSelectWithBbox(locationName, bbox, center);
          } else {
            onSelect(locationName);
          }
        }
      } catch (error) {
        console.error("Error retrieving location data:", error);
        onSelect(locationName);
      }
    } else {
      onSelect(locationName);
    }

    // Add to selected locations
    const newLocations = [...selectedLocations, locationName];
    setSelectedLocations(newLocations);

    // Clear input and close
    setInputValue("");
    setIsOpen(false);
    setSuggestions([]);

    // Refocus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Handle removing a location badge
  const handleRemove = (locationToRemove: string) => {
    const newLocations = selectedLocations.filter(
      (loc) => loc !== locationToRemove
    );
    setSelectedLocations(newLocations);
    onSelect(newLocations.join(", "));
  };

  // Handle keyboard navigation
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

  return {
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
  };
}
