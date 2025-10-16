"use client";

import { useEffect } from "react";
import { Map } from "@/components/map";
import { config } from "@/lib/config";
import { PropertyList, useLocationSelect } from "@/modules/search";

export default function Home() {
  const { selectDefaultVienna } = useLocationSelect();

  // Initialize with default Vienna location on mount
  useEffect(() => {
    selectDefaultVienna();
  }, [selectDefaultVienna]);

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <main className="flex w-full h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Panel - Map */}
        <div className="hidden lg:block flex-1 h-full relative">
          <Map
            accessToken={config.mapbox.accessToken}
            initialCenter={[16.3738, 48.2082]} // Vienna, Austria
            initialZoom={11}
            className="w-full h-full"
          />
        </div>

        {/* Right Panel - Property List */}
        <div className="w-full lg:w-[700px] xl:w-[767px] h-full bg-white overflow-y-auto">
          <PropertyList
            onPropertyClick={(propertyId) => {
              console.log("Property clicked:", propertyId);
              // TODO: Navigate to property detail page
            }}
          />
        </div>
      </main>
    </div>
  );
}
