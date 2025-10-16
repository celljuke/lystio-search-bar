import { useCallback } from "react";
import { useSearchStore } from "../store";
import type { LocationFilter } from "../types";
import {
  getBboxForLocation,
  getCenterForLocation,
  getDefaultViennaBbox,
} from "../utils/location-utils";

/**
 * Hook for handling location selection with bbox support
 */
export function useLocationSelect() {
  const updateFilter = useSearchStore((state) => state.updateFilter);

  /**
   * Handle location selection from UI
   * Converts location string to LocationFilter with bbox
   */
  const selectLocation = useCallback(
    (locationName: string) => {
      // Get bbox for the location
      const bbox = getBboxForLocation(locationName);
      const center = getCenterForLocation(locationName);

      if (bbox) {
        // Create LocationFilter with bbox
        const locationData: LocationFilter = {
          name: locationName,
          bbox,
          center: center || undefined,
        };

        // Update both location string and locationData
        updateFilter("location", locationName);
        updateFilter("locationData", locationData);
      } else {
        // Fallback: just update location string (will use city search in backend)
        updateFilter("location", locationName);
        updateFilter("locationData", null);
      }
    },
    [updateFilter]
  );

  /**
   * Set location with custom bbox (for map-based selection)
   */
  const selectLocationWithBbox = useCallback(
    (
      locationName: string,
      bbox: [[number, number], [number, number]],
      center?: { lng: number; lat: number }
    ) => {
      const locationData: LocationFilter = {
        name: locationName,
        bbox,
        center,
      };

      updateFilter("location", locationName);
      updateFilter("locationData", locationData);
    },
    [updateFilter]
  );

  /**
   * Set default Vienna location
   */
  const selectDefaultVienna = useCallback(() => {
    const bbox = getDefaultViennaBbox();
    const locationData: LocationFilter = {
      name: "Vienna",
      bbox,
      center: { lng: 16.3738, lat: 48.2082 },
    };

    updateFilter("location", "Vienna");
    updateFilter("locationData", locationData);
  }, [updateFilter]);

  return {
    selectLocation,
    selectLocationWithBbox,
    selectDefaultVienna,
  };
}
