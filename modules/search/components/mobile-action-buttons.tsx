"use client";

import { useSearchStore } from "../store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SlidersHorizontal,
  Sparkles,
  Map as MapIcon,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileActionButtons() {
  const { viewMode, setViewMode } = useSearchStore();

  // Count active filters (example - you can enhance this based on actual filters)
  const activeFiltersCount = 12;

  return (
    <div className="md:hidden px-4 py-3 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        {/* Filter Button */}
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-4 rounded-lg border-gray-200 hover:bg-gray-50 relative"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-sm font-medium text-gray-900">Filter</span>
          {activeFiltersCount > 0 && (
            <Badge
              variant="default"
              className="ml-1 h-5 min-w-5 px-1.5 bg-[#8B5CF6] text-white text-xs rounded-full"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Search Agent Button */}
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-4 rounded-lg border-gray-200 hover:bg-gray-50"
        >
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-sm font-medium text-gray-900">
            Search Agent
          </span>
        </Button>

        {/* View Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
          className="flex items-center gap-2 h-10 px-4 rounded-lg border-gray-200 hover:bg-gray-50 ml-auto"
        >
          {viewMode === "list" ? (
            <>
              <MapIcon className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-sm font-medium text-gray-900">
                Map View
              </span>
            </>
          ) : (
            <>
              <List className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-sm font-medium text-gray-900">
                List View
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
