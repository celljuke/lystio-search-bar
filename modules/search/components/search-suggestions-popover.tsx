"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SearchSuggestion } from "../hooks/use-location-search";

interface SearchSuggestionsPopoverProps {
  isOpen: boolean;
  suggestions: SearchSuggestion[];
  selectedLocations: string[];
  selectedIndex: number;
  onSelect: (suggestion: SearchSuggestion) => void;
  onOpenChange: (open: boolean) => void;
}

export function SearchSuggestionsPopover({
  isOpen,
  suggestions,
  selectedLocations,
  selectedIndex,
  onSelect,
  onOpenChange,
}: SearchSuggestionsPopoverProps) {
  if (!isOpen || suggestions.length === 0) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
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
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
              Places
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.mapbox_id}
                onClick={() => onSelect(suggestion)}
                className={cn(
                  "w-full flex items-start gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left",
                  selectedIndex === index && "bg-gray-100",
                  selectedLocations.includes(suggestion.name) && "opacity-50"
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
