"use client";

import { ChevronRight } from "lucide-react";

interface RecentSearch {
  mapboxId: string;
  type: string;
  name: string;
  pt: [number, number];
}

interface MobileRecentSearchesProps {
  searches: RecentSearch[];
  onSearchClick: (search: RecentSearch) => void;
}

export function MobileRecentSearches({
  searches,
  onSearchClick,
}: MobileRecentSearchesProps) {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-3">
        Recent Searches
      </h4>
      <div className="space-y-2">
        {searches.slice(0, 3).map((search) => (
          <button
            key={search.mapboxId}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            onClick={() => onSearchClick(search)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-base font-medium text-gray-900">
                {search.name}
              </p>
              <p className="text-sm text-gray-500 capitalize">{search.type}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
