"use client";

import type { SearchSuggestion } from "./location-search-input";
import { MapPin } from "lucide-react";

interface MobileSearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelectSuggestion: (suggestion: SearchSuggestion) => void;
}

export function MobileSearchSuggestions({
  suggestions,
  onSelectSuggestion,
}: MobileSearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  // Group suggestions by type
  const states = suggestions.filter((s) => s.feature_type === "region");
  const cities = suggestions.filter((s) => s.feature_type === "place");
  const districts = suggestions.filter((s) => s.feature_type === "district");
  const others = suggestions.filter(
    (s) =>
      s.feature_type !== "region" &&
      s.feature_type !== "place" &&
      s.feature_type !== "district"
  );

  return (
    <div className="space-y-4">
      {/* States */}
      {states.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">States</h3>
          <div className="space-y-1">
            {states.map((suggestion) => (
              <button
                key={suggestion.mapbox_id}
                onClick={() => onSelectSuggestion(suggestion)}
                className="w-full flex items-center gap-3 px-0 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <MapPin className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-gray-900">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-500">State</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cities */}
      {cities.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Cities</h3>
          <div className="space-y-1">
            {cities.map((suggestion) => (
              <button
                key={suggestion.mapbox_id}
                onClick={() => onSelectSuggestion(suggestion)}
                className="w-full flex items-center gap-3 px-0 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <MapPin className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-gray-900">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-500">City</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Districts */}
      {districts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">District</h3>
          <div className="space-y-1">
            {districts.map((suggestion) => (
              <button
                key={suggestion.mapbox_id}
                onClick={() => onSelectSuggestion(suggestion)}
                className="w-full flex items-center gap-3 px-0 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <MapPin className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-gray-900">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {suggestion.place_formatted}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Others */}
      {others.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Places</h3>
          <div className="space-y-1">
            {others.map((suggestion) => (
              <button
                key={suggestion.mapbox_id}
                onClick={() => onSelectSuggestion(suggestion)}
                className="w-full flex items-center gap-3 px-0 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <MapPin className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-gray-900">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {suggestion.place_formatted}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
