"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LocationBadgesProps {
  locations: string[];
  onRemove: (location: string) => void;
}

export function LocationBadges({ locations, onRemove }: LocationBadgesProps) {
  if (locations.length === 0) {
    return null;
  }

  return (
    <>
      {locations.map((location) => (
        <Badge
          key={location}
          variant="secondary"
          className="inline-flex items-center flex-shrink-0 bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200 p-1 py-0.5 gap-1.5 text-sm font-medium max-w-[100px]"
        >
          <span className="truncate text-xs">{location}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(location);
            }}
            className="flex-shrink-0 rounded-full hover:bg-purple-200 p-0.5 transition-colors"
            type="button"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
    </>
  );
}
