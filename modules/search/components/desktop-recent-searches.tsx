"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface RecentSearch {
  mapboxId: string;
  type: string;
  name: string;
  pt: [number, number];
}

interface DesktopRecentSearchesProps {
  searches: RecentSearch[];
  onSearchClick: (search: RecentSearch) => void;
}

export function DesktopRecentSearches({
  searches,
  onSearchClick,
}: DesktopRecentSearchesProps) {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-base font-semibold text-gray-900 mb-3">
        Recent Searches
      </h4>
      <div className="space-y-2">
        {searches.slice(0, 3).map((search, index) => (
          <motion.button
            key={search.mapboxId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.05,
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            onClick={() => onSearchClick(search)}
          >
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-gray-600"
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
              <p className="text-sm font-medium text-gray-900">{search.name}</p>
              <p className="text-xs text-gray-500 capitalize">{search.type}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
