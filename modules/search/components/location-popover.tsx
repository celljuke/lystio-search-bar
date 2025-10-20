"use client";

import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import type { LocationFilter } from "../types";

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
  const { updateFilter, closeDropdown } = useSearchStore();

  // Fetch popular locations from API
  const { data: locations, isLoading } = trpc.location.getPopular.useQuery();

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

        // Create location filter data
        const locationData: LocationFilter = {
          name: city.name,
          bbox: bbox,
          center: {
            lng: (bbox[0][0] + bbox[1][0]) / 2,
            lat: (bbox[0][1] + bbox[1][1]) / 2,
          },
        };

        // Update filters in store
        updateFilter("location", city.name);
        updateFilter("locationData", locationData);

        // Call the callback
        onSelectLocation(city.name);

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
    <div
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
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCityClick(city)}
                    disabled={getBoundaryMutation.isPending}
                    className="group flex flex-col items-start hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {/* City Image */}
                    <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-2">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* City Info */}
                    <div className="text-left w-full">
                      <h5 className="text-sm font-semibold text-gray-900">
                        {city.name}
                      </h5>
                      <p className="text-xs text-gray-500">
                        {city.districts} Districts
                      </p>
                    </div>
                  </button>
                ))}
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
    </div>
  );
}
