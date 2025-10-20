"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import { useDistrictSelection } from "../hooks/use-district-selection";
import { motion } from "motion/react";
import { DesktopCityGrid } from "./desktop-city-grid";
import { DesktopDistrictList } from "./desktop-district-list";
import { DesktopRecentSearches } from "./desktop-recent-searches";

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

export function LocationPopover({
  onSelectLocation,
  className,
}: LocationPopoverProps) {
  const { closeDropdown } = useSearchStore();

  // Fetch popular locations from API
  const { data: locations, isLoading } = trpc.location.getPopular.useQuery();

  // Fetch recent searches from API
  const { data: recentSearches, isLoading: isLoadingRecent } =
    trpc.location.getRecentSearches.useQuery();

  // Use district selection hook
  const {
    selectedCity,
    selectedDistrictIds,
    selectedLocationName,
    isLoading: isLoadingBoundary,
    handleCityClick,
    handleBackToCity,
    handleDistrictToggle,
    handleSelectAllDistricts,
  } = useDistrictSelection();

  // Transform API data to match UI format
  const cities: City[] =
    locations
      ?.filter((location) => location.children.length > 0)
      .slice(0, 6) // Show first 6 cities
      .map((location) => ({
        name: location.name,
        districts: location.children.length,
        image: `/images/cities/${location.name.toLowerCase()}.png`,
        id: location.id,
        children: location.children,
      })) || [];

  // Handle recent search click
  const handleRecentSearchClick = (search: any) => {
    const offset = 0.009;
    const [lng, lat] = search.pt;
    const bbox: [[number, number], [number, number]] = [
      [lng - offset, lat - offset],
      [lng + offset, lat + offset],
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        "absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-[100] overflow-hidden",
        selectedCity ? "w-[650px]" : "w-[300px]",
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
          {!selectedCity && !isLoadingRecent && recentSearches && (
            <DesktopRecentSearches
              searches={recentSearches}
              onSearchClick={handleRecentSearchClick}
            />
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
            <DesktopCityGrid
              cities={cities}
              selectedLocationName={selectedLocationName}
              selectedCity={selectedCity}
              isLoading={isLoading || isLoadingBoundary}
              onCityClick={handleCityClick}
            />
          </div>

          {/* Districts List - shown side-by-side when a city is selected */}
          {selectedCity && (
            <DesktopDistrictList
              city={selectedCity}
              selectedDistrictIds={selectedDistrictIds}
              onBack={handleBackToCity}
              onDistrictToggle={handleDistrictToggle}
              onSelectAll={handleSelectAllDistricts}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
