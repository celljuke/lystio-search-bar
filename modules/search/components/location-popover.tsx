"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import type { LocationFilter } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Checkbox } from "@/components/ui/checkbox";

interface LocationPopoverProps {
  onSelectLocation: (location: string) => void;
  className?: string;
}

interface City {
  name: string;
  districts: number;
  image: string;
  id: string;
  children: Array<{
    name: string;
    id: string;
    postal_code: string;
  }>;
}

interface District {
  name: string;
  id: string;
  postal_code: string;
}

export function LocationPopover({
  onSelectLocation,
  className,
}: LocationPopoverProps) {
  const { updateFilter, closeDropdown, filters } = useSearchStore();

  // State for viewing districts of a selected city
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistrictIds, setSelectedDistrictIds] = useState<string[]>([]);

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
        children: location.children,
      })) || [];

  // Handle city click - show districts and auto-select "All Districts"
  const handleCityClick = async (city: City) => {
    setSelectedCity(city);
    // Auto-select all districts (this will show "All Districts" as checked)
    const allDistrictIds = city.children.map((d) => d.id);
    setSelectedDistrictIds(allDistrictIds);

    // Apply filter with only the city ID (not all child districts)
    try {
      const boundaryData = await getBoundaryMutation.mutateAsync({
        ids: [city.id],
      });

      if (boundaryData && boundaryData.length > 0) {
        const { bbox } = boundaryData[0];

        const locationData: LocationFilter = {
          name: city.name,
          withinId: [city.id], // Only city ID
          bbox: bbox,
          center: {
            lng: (bbox[0][0] + bbox[1][0]) / 2,
            lat: (bbox[0][1] + bbox[1][1]) / 2,
          },
        };

        const store = useSearchStore.getState();
        store.setFilters({
          ...store.filters,
          location: locationData.name,
          locationData: locationData,
        });
      }
    } catch (error) {
      console.error("Failed to fetch city boundary:", error);
    }
  };

  // Go back to city list
  const handleBackToCity = () => {
    setSelectedCity(null);
    setSelectedDistrictIds([]);
  };

  // Toggle district selection and apply immediately
  const handleDistrictToggle = async (districtId: string) => {
    if (!selectedCity) return;

    const newSelectedIds = selectedDistrictIds.includes(districtId)
      ? selectedDistrictIds.filter((id) => id !== districtId)
      : [...selectedDistrictIds, districtId];

    setSelectedDistrictIds(newSelectedIds);

    // Apply immediately if there are selected districts
    if (newSelectedIds.length > 0) {
      // Check if all districts are now selected
      const isAllSelected =
        newSelectedIds.length === selectedCity.children.length;

      if (isAllSelected) {
        // Use city ID only
        try {
          const boundaryData = await getBoundaryMutation.mutateAsync({
            ids: [selectedCity.id],
          });

          if (boundaryData && boundaryData.length > 0) {
            const { bbox } = boundaryData[0];

            const locationData: LocationFilter = {
              name: selectedCity.name,
              withinId: [selectedCity.id], // Only city ID
              bbox: bbox,
              center: {
                lng: (bbox[0][0] + bbox[1][0]) / 2,
                lat: (bbox[0][1] + bbox[1][1]) / 2,
              },
            };

            const store = useSearchStore.getState();
            store.setFilters({
              ...store.filters,
              location: locationData.name,
              locationData: locationData,
            });
          }
        } catch (error) {
          console.error("Failed to fetch city boundary:", error);
        }
      } else {
        // Use selected district IDs
        await applyDistrictsFilter(newSelectedIds);
      }
    } else {
      // No districts selected - clear filter
      const store = useSearchStore.getState();
      store.setFilters({
        ...store.filters,
        location: "",
        locationData: null,
      });
    }
  };

  // Apply district filter - extracted as a separate function
  const applyDistrictsFilter = async (districtIds: string[]) => {
    if (!selectedCity || districtIds.length === 0) return;

    try {
      // Fetch bbox for the selected districts
      const boundaryData = await getBoundaryMutation.mutateAsync({
        ids: districtIds,
      });

      if (boundaryData && boundaryData.length > 0) {
        // Calculate combined bbox from all districts
        let minLng = Infinity,
          minLat = Infinity;
        let maxLng = -Infinity,
          maxLat = -Infinity;

        boundaryData.forEach(({ bbox }) => {
          minLng = Math.min(minLng, bbox[0][0]);
          minLat = Math.min(minLat, bbox[0][1]);
          maxLng = Math.max(maxLng, bbox[1][0]);
          maxLat = Math.max(maxLat, bbox[1][1]);
        });

        const combinedBbox: [[number, number], [number, number]] = [
          [minLng, minLat],
          [maxLng, maxLat],
        ];

        // Create location filter data with withinId for API filtering
        // Note: This function is only called for partial district selections
        const locationData: LocationFilter = {
          name: `${selectedCity.name} (${districtIds.length} district${
            districtIds.length !== 1 ? "s" : ""
          })`,
          withinId: districtIds, // Use selected district IDs for API filtering
          bbox: combinedBbox, // Combined bbox for map display
          center: {
            lng: (minLng + maxLng) / 2,
            lat: (minLat + maxLat) / 2,
          },
        };

        // Update both filters at once
        const store = useSearchStore.getState();
        store.setFilters({
          ...store.filters,
          location: locationData.name,
          locationData: locationData,
        });

        // Don't close dropdown - keep it open for multiple selections
      }
    } catch (error) {
      console.error("Failed to fetch district boundaries:", error);
    }
  };

  // Select all districts and apply immediately
  const handleSelectAllDistricts = async () => {
    if (!selectedCity) return;

    const isAllSelected =
      selectedDistrictIds.length === selectedCity.children.length;

    if (isAllSelected) {
      // Deselect all - clear filter
      setSelectedDistrictIds([]);
      // Clear location filter
      const store = useSearchStore.getState();
      store.setFilters({
        ...store.filters,
        location: "",
        locationData: null,
      });
    } else {
      // Select all - use only city ID
      const allDistrictIds = selectedCity.children.map((d) => d.id);
      setSelectedDistrictIds(allDistrictIds);

      // Apply filter with only the city ID (not all child districts)
      try {
        const boundaryData = await getBoundaryMutation.mutateAsync({
          ids: [selectedCity.id],
        });

        if (boundaryData && boundaryData.length > 0) {
          const { bbox } = boundaryData[0];

          const locationData: LocationFilter = {
            name: selectedCity.name,
            withinId: [selectedCity.id], // Only city ID
            bbox: bbox,
            center: {
              lng: (bbox[0][0] + bbox[1][0]) / 2,
              lat: (bbox[0][1] + bbox[1][1]) / 2,
            },
          };

          const store = useSearchStore.getState();
          store.setFilters({
            ...store.filters,
            location: locationData.name,
            locationData: locationData,
          });
        }
      } catch (error) {
        console.error("Failed to fetch city boundary:", error);
      }
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
        "absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-[100] overflow-hidden",
        selectedCity ? "w-[650px]" : "w-[300px]", // Wider when showing districts
        className
      )}
    >
      <div className="max-h-[500px] overflow-y-auto p-3">
        <div
          className={cn("flex gap-4", !selectedCity && "flex-col space-y-6")}
        >
          {/* Draw an area on the map - only show when no city selected */}
          {!selectedCity && (
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
          )}

          {/* Recent Searches - only show when no city selected */}
          {!selectedCity &&
            !isLoadingRecent &&
            recentSearches &&
            recentSearches.length > 0 && (
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
          <div
            className={cn(
              "flex-shrink-0",
              selectedCity ? "w-[280px]" : "w-full"
            )}
          >
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              By City
            </h4>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">Loading cities...</div>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-3",
                  selectedCity ? "grid-cols-2" : "grid-cols-3"
                )}
              >
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

          {/* Districts List - shown side-by-side when a city is selected */}
          {selectedCity && (
            <div className="flex-1 border-l border-gray-200 pl-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900">
                    {selectedCity.name}
                  </h4>
                  <p className="text-xs text-gray-500">Select districts</p>
                </div>
                <button
                  onClick={handleBackToCity}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* All Districts checkbox */}
              <div className="mb-3 pb-3 border-b border-gray-200">
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Checkbox
                    checked={
                      selectedDistrictIds.length ===
                      selectedCity.children.length
                    }
                    onCheckedChange={handleSelectAllDistricts}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      All Districts
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedCity.districts} Districts
                    </p>
                  </div>
                </label>
              </div>

              {/* District checkboxes */}
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {selectedCity.children.map((district) => (
                  <label
                    key={district.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedDistrictIds.includes(district.id)}
                      onCheckedChange={() => handleDistrictToggle(district.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{district.name}</p>
                      {district.postal_code && (
                        <p className="text-xs text-gray-500">
                          {district.postal_code}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
