"use client";

import Image from "next/image";
import { ArrowRight, Check, CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import type { LocationFilter } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface LocationPopoverProps {
  onSelectLocation: (location: string) => void;
  className?: string;
}

interface City {
  name: string;
  districts: number;
  image: string;
  id: string;
}

interface State {
  name: string;
  districts: number;
  image: string;
  id: string;
}

export function LocationPopover({
  onSelectLocation,
  className,
}: LocationPopoverProps) {
  const { updateFilter, closeDropdown, filters } = useSearchStore();

  // Get currently selected location
  const selectedLocationName = filters.location;

  // Fetch popular locations from API
  const { data: locations, isLoading } = trpc.location.getPopular.useQuery();

  // Fetch recent searches from API
  const { data: recentSearches, isLoading: isLoadingRecent } =
    trpc.location.getRecentSearches.useQuery();

  // Mutation for fetching boundary
  const getBoundaryMutation = trpc.location.getBoundary.useMutation();

  // Transform API data to match UI format
  const cities: City[] =
    locations
      ?.filter((location) => location.children.length > 0)
      .slice(0, 6) // Show first 6 cities
      .map((location) => ({
        name: location.name,
        districts: location.children.length,
        // Map name to lowercase for image path (Wien -> wien)
        image: `/images/cities/${location.name.toLowerCase()}.png`,
        id: location.id,
      })) || [];

  // Handle city selection
  const handleCityClick = async (city: City) => {
    try {
      // Fetch bbox for the selected city
      const boundaryData = await getBoundaryMutation.mutateAsync({
        ids: [city.id],
      });

      if (boundaryData && boundaryData.length > 0) {
        const { bbox } = boundaryData[0];

        // Create location filter data with withinId for API filtering
        const locationData: LocationFilter = {
          name: city.name,
          withinId: [city.id], // Use city ID for API filtering
          bbox: bbox, // Keep bbox for map display
          center: {
            lng: (bbox[0][0] + bbox[1][0]) / 2,
            lat: (bbox[0][1] + bbox[1][1]) / 2,
          },
        };

        // Update both filters at once to avoid race conditions
        const store = useSearchStore.getState();
        const currentFilters = store.filters;

        const newFilters = {
          ...currentFilters,
          location: city.name,
          locationData: locationData,
        };

        store.setFilters(newFilters);

        // NOTE: Don't call onSelectLocation here because it will overwrite locationData without withinId
        // The filters are already set above with the correct withinId

        // Close the popover
        closeDropdown();
      }
    } catch (error) {
      console.error("Failed to fetch city boundary:", error);
      // Fallback: just update the location name
      updateFilter("location", city.name);
      onSelectLocation(city.name);
      closeDropdown();
    }
  };

  // Note: States section is removed as the API doesn't provide state-level data
  // Only showing cities from the API

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1], // Custom easing for smooth feel
      }}
      className={cn(
        "absolute top-full left-0 mt-2 w-[300px] bg-white border border-gray-200 rounded-2xl shadow-xl z-[100] overflow-hidden",
        className
      )}
    >
      <div className="max-h-[500px] overflow-y-auto p-3">
        <div className="space-y-6">
          {/* Draw an area on the map */}
          <button
            className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-gray-50 transition-colors group border border-[#EEE7FF] shadow-lg"
            onClick={() => {}}
          >
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Image
                src="/icons/draw.svg"
                alt="Map"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <span className="text-sm font-medium text-gray-900 flex-1 text-left">
              Draw an area on the map
            </span>
            <ArrowRight className="w-5 h-5 text-[#A540F3]" />
          </button>

          {/* Recent Searches */}
          {!isLoadingRecent && recentSearches && recentSearches.length > 0 && (
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-3">
                Recent Searches
              </h4>
              <div className="space-y-2">
                {recentSearches.slice(0, 3).map((search, index) => (
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
                    onClick={() => {
                      // Create a bbox around the point (approximately 1km radius)
                      // 1km ≈ 0.009 degrees at the equator
                      const offset = 0.009;
                      const [lng, lat] = search.pt;
                      const bbox: [[number, number], [number, number]] = [
                        [lng - offset, lat - offset], // SW corner
                        [lng + offset, lat + offset], // NE corner
                      ];

                      const store = useSearchStore.getState();
                      store.setFilters({
                        ...store.filters,
                        location: search.name,
                        locationData: {
                          name: search.name,
                          bbox: bbox,
                          center: {
                            lng: lng,
                            lat: lat,
                          },
                        },
                      });
                      closeDropdown();
                    }}
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
                      <p className="text-sm font-medium text-gray-900">
                        {search.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {search.type}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* By City */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              By City
            </h4>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">Loading cities...</div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {cities.map((city, index) => {
                  const isSelected = selectedLocationName === city.name;
                  return (
                    <motion.button
                      key={city.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      onClick={() => handleCityClick(city)}
                      disabled={getBoundaryMutation.isPending}
                      className={cn(
                        "group flex flex-col items-start transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-md",
                        isSelected
                          ? "ring-1 ring-[#A540F3] p-0.5"
                          : "hover:opacity-80"
                      )}
                    >
                      {/* City Image */}
                      <div
                        className={cn(
                          "relative w-full aspect-square overflow-hidden mb-2 rounded-md"
                        )}
                      >
                        <Image
                          src={city.image}
                          alt={city.name}
                          fill
                          className="object-cover"
                        />

                        {/* Checkmark for selected city */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg border-1 border-white"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </div>

                      {/* City Info */}
                      <div
                        className={cn(
                          "text-left w-full",
                          isSelected && "px-2 pb-2"
                        )}
                      >
                        <h5
                          className={cn(
                            "text-sm font-semibold",
                            isSelected ? "text-[#A540F3]" : "text-gray-900"
                          )}
                        >
                          {city.name}
                        </h5>
                        <p
                          className={cn(
                            "text-xs",
                            isSelected ? "text-[#A540F3]" : "text-gray-500"
                          )}
                        >
                          {city.districts === 0
                            ? "All Districts"
                            : `${city.districts} Districts`}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* By State */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              By State
            </h4>
            <div className="space-y-2">
              <div className="text-sm text-gray-500 text-center py-4">
                No states available
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
