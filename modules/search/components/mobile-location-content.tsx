"use client";

import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import { useDistrictSelection } from "../hooks/use-district-selection";
import { MobileCityGrid } from "./mobile-city-grid";
import { MobileDistrictList } from "./mobile-district-list";
import { MobileRecentSearches } from "./mobile-recent-searches";

interface MobileLocationContentProps {
  onSelectLocation: (location: string) => void;
  onClose: () => void;
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

export function MobileLocationContent({
  onSelectLocation,
  onClose,
}: MobileLocationContentProps) {
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
  } = useDistrictSelection(onClose);

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
        center: { lng: lng, lat: lat },
      },
    });
    onClose();
  };

  // If a city is selected, show district view
  if (selectedCity) {
    return (
      <MobileDistrictList
        city={selectedCity}
        selectedDistrictIds={selectedDistrictIds}
        onBack={handleBackToCity}
        onDistrictToggle={handleDistrictToggle}
        onSelectAll={handleSelectAllDistricts}
      />
    );
  }

  // Default view - show cities and recent searches
  return (
    <div className="space-y-6 pb-6">
      {/* Recent Searches */}
      {!isLoadingRecent && recentSearches && (
        <MobileRecentSearches
          searches={recentSearches}
          onSearchClick={handleRecentSearchClick}
        />
      )}

      {/* Search by City */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-3">By City</h4>
        <MobileCityGrid
          cities={cities}
          selectedLocationName={selectedLocationName}
          isLoading={isLoading || isLoadingBoundary}
          onCityClick={handleCityClick}
        />
      </div>
    </div>
  );
}
