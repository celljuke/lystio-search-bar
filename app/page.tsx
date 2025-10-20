"use client";

import { Map } from "@/components/map";
import { config } from "@/lib/config";
import {
  PropertyList,
  MobileActionButtons,
  useHistogram,
  usePropertySearch,
} from "@/modules/search";
import { useSearchStore } from "@/modules/search/store";

export default function Home() {
  const { viewMode, filters } = useSearchStore();

  // Fetch histogram data on filter changes
  useHistogram();

  // Get bbox from location filter
  const bbox = filters.locationData?.bbox;

  // Get properties from search hook
  const { properties } = usePropertySearch();

  // Convert properties to map format
  const mapProperties = properties.map((property: any) => ({
    id: property.id,
    location: property.location as [number, number],
    rent: property.rent || 0,
    rentPer: property.rentPer,
    title: property.title,
    address: property.address,
    city: property.city,
    size: property.size,
    rooms: property.rooms,
    media: property.media,
  }));

  return (
    <>
      {/* Mobile Action Buttons */}
      <MobileActionButtons />

      <div className="flex w-full h-[calc(100vh)] overflow-hidden bg-[#F6F7F9]">
        {/* Left Panel - Map (Desktop always visible, Mobile based on viewMode) */}
        <div
          className={`${
            viewMode === "map" ? "block" : "hidden"
          } md:hidden flex-1 h-full relative`}
        >
          <Map
            accessToken={config.mapbox.accessToken}
            initialCenter={[16.3738, 48.2082]} // Vienna, Austria
            initialZoom={11}
            bbox={bbox}
            properties={mapProperties}
            className="w-full h-full"
          />
        </div>

        {/* Desktop Map - Always visible on large screens */}
        <div className="hidden lg:block flex-1 h-full relative">
          <Map
            accessToken={config.mapbox.accessToken}
            initialCenter={[16.3738, 48.2082]} // Vienna, Austria
            initialZoom={11}
            bbox={bbox}
            properties={mapProperties}
            className="w-full h-full"
          />
        </div>

        {/* Right Panel - Property List (Desktop always visible, Mobile based on viewMode) */}
        <div
          className={`${
            viewMode === "list" ? "block" : "hidden"
          } md:block w-full lg:w-[700px] xl:w-[767px] h-full bg-white overflow-y-auto`}
        >
          <PropertyList
            onPropertyClick={(propertyId) => {
              console.log("Property clicked:", propertyId);
              // TODO: Navigate to property detail page
            }}
          />
        </div>
      </div>
    </>
  );
}
