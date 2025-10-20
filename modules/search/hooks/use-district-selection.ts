import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import type { LocationFilter } from "../types";

interface District {
  name: string;
  id: string;
  postal_code: string;
}

interface City {
  name: string;
  districts: number;
  image: string;
  id: string;
  children: District[];
}

export function useDistrictSelection(onClose?: () => void) {
  const { filters } = useSearchStore();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistrictIds, setSelectedDistrictIds] = useState<string[]>([]);

  const getBoundaryMutation = trpc.location.getBoundary.useMutation();

  // Handle city click - show districts and auto-select "All Districts"
  const handleCityClick = async (city: City) => {
    setSelectedCity(city);
    const allDistrictIds = city.children.map((d) => d.id);
    setSelectedDistrictIds(allDistrictIds);

    // Apply filter with only the city ID
    try {
      const boundaryData = await getBoundaryMutation.mutateAsync({
        ids: [city.id],
      });

      if (boundaryData && boundaryData.length > 0) {
        const { bbox } = boundaryData[0];

        const locationData: LocationFilter = {
          name: city.name,
          withinId: [city.id],
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

  // Toggle district selection
  const handleDistrictToggle = async (districtId: string) => {
    if (!selectedCity) return;

    const newSelectedIds = selectedDistrictIds.includes(districtId)
      ? selectedDistrictIds.filter((id) => id !== districtId)
      : [...selectedDistrictIds, districtId];

    setSelectedDistrictIds(newSelectedIds);

    if (newSelectedIds.length > 0) {
      const isAllSelected =
        newSelectedIds.length === selectedCity.children.length;

      if (isAllSelected) {
        // Use city ID only
        await applyCityFilter(selectedCity);
      } else {
        // Use selected district IDs
        await applyDistrictsFilter(selectedCity, newSelectedIds);
      }
    } else {
      // No districts selected - clear filter
      clearLocationFilter();
    }
  };

  // Apply city filter (all districts)
  const applyCityFilter = async (city: City) => {
    try {
      const boundaryData = await getBoundaryMutation.mutateAsync({
        ids: [city.id],
      });

      if (boundaryData && boundaryData.length > 0) {
        const { bbox } = boundaryData[0];

        const locationData: LocationFilter = {
          name: city.name,
          withinId: [city.id],
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

  // Apply district filter (partial selection)
  const applyDistrictsFilter = async (city: City, districtIds: string[]) => {
    if (districtIds.length === 0) return;

    try {
      const boundaryData = await getBoundaryMutation.mutateAsync({
        ids: districtIds,
      });

      if (boundaryData && boundaryData.length > 0) {
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

        const locationData: LocationFilter = {
          name: `${city.name} (${districtIds.length} district${
            districtIds.length !== 1 ? "s" : ""
          })`,
          withinId: districtIds,
          bbox: combinedBbox,
          center: {
            lng: (minLng + maxLng) / 2,
            lat: (minLat + maxLat) / 2,
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
      console.error("Failed to fetch district boundaries:", error);
    }
  };

  // Select all districts
  const handleSelectAllDistricts = async () => {
    if (!selectedCity) return;

    const isAllSelected =
      selectedDistrictIds.length === selectedCity.children.length;

    if (isAllSelected) {
      // Deselect all
      setSelectedDistrictIds([]);
      clearLocationFilter();
    } else {
      // Select all - use city ID
      const allDistrictIds = selectedCity.children.map((d) => d.id);
      setSelectedDistrictIds(allDistrictIds);
      await applyCityFilter(selectedCity);
    }
  };

  // Clear location filter
  const clearLocationFilter = () => {
    const store = useSearchStore.getState();
    store.setFilters({
      ...store.filters,
      location: "",
      locationData: null,
    });
  };

  return {
    selectedCity,
    selectedDistrictIds,
    selectedLocationName: filters.location,
    isLoading: getBoundaryMutation.isPending,
    handleCityClick,
    handleBackToCity,
    handleDistrictToggle,
    handleSelectAllDistricts,
  };
}
