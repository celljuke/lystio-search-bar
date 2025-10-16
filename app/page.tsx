"use client";

import { useEffect } from "react";
import { Map } from "@/components/map";
import { config } from "@/lib/config";
import {
  PropertyList,
  useLocationSelect,
  MobileActionButtons,
} from "@/modules/search";
import { useSearchStore } from "@/modules/search/store";

export default function Home() {
  const { selectDefaultVienna } = useLocationSelect();
  const { viewMode } = useSearchStore();

  // Initialize with default Vienna location on mount
  useEffect(() => {
    selectDefaultVienna();
  }, [selectDefaultVienna]);

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
            className="w-full h-full"
          />
        </div>

        {/* Desktop Map - Always visible on large screens */}
        <div className="hidden lg:block flex-1 h-full relative">
          <Map
            accessToken={config.mapbox.accessToken}
            initialCenter={[16.3738, 48.2082]} // Vienna, Austria
            initialZoom={11}
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
