import type { SearchFilters, PropertyTypeFilter } from "../types";
import type { SearchFilter } from "@/server/services/search/schema";
import { getBboxForLocation } from "./location-utils";
import { CATEGORIES } from "../constants/categories";

/**
 * Convert frontend search filters to backend search filter format
 */
export function convertCategoryToFilters(
  uiFilters: SearchFilters,
  rentBuyMode: "rent" | "buy" = "rent"
): SearchFilter {
  const backendFilter: SearchFilter = {
    active: true,
    listed: true,
    // Set rent type based on mode - use lowercase strings
    rentType: [rentBuyMode === "rent" ? "rent" : "buy"],
    showPriceOnRequest: true, // Always show price on request properties
  };

  // Location filter - use bbox from locationData or fallback to city name
  if (uiFilters.locationData?.bbox) {
    // Use the bbox from locationData
    backendFilter.bbox = uiFilters.locationData.bbox;
  } else if (uiFilters.location) {
    // Try to get bbox from location string
    const bbox = getBboxForLocation(uiFilters.location);
    if (bbox) {
      backendFilter.bbox = bbox;
    } else {
      // Fallback to city search if bbox not found
      backendFilter.city = uiFilters.location;
    }
  }

  // Property type filter - use numeric IDs
  if (uiFilters.propertyType) {
    const categoryId = uiFilters.propertyType.categoryId;
    const category = CATEGORIES.find((cat) => cat.id === categoryId);

    if (category && category.typeId !== undefined) {
      // Set the type ID
      backendFilter.type = [category.typeId];

      // Set subType IDs based on selected subcategories
      const selectedSubcategories = uiFilters.propertyType.subcategories;

      if (
        category.hasSubcategories &&
        category.subcategories &&
        selectedSubcategories.length > 0
      ) {
        // If "all" is selected or no specific subcategories, include all subtype IDs
        if (selectedSubcategories.includes("all")) {
          // Get all subtype IDs from the category
          const allSubTypeIds = category.subcategories
            .filter((sub) => sub.id !== "all" && sub.subTypeId !== undefined)
            .map((sub) => sub.subTypeId as number);

          if (allSubTypeIds.length > 0) {
            backendFilter.subType = allSubTypeIds;
          }
        } else {
          // Get specific subtype IDs for selected subcategories
          const subTypeIds = selectedSubcategories
            .map((subId) => {
              const sub = category.subcategories?.find((s) => s.id === subId);
              return sub?.subTypeId;
            })
            .filter((id): id is number => id !== undefined);

          if (subTypeIds.length > 0) {
            backendFilter.subType = subTypeIds;
          }
        }
      } else if (!category.hasSubcategories && category.subcategories) {
        // For categories without subcategories UI but with subtype IDs defined
        const subTypeIds = category.subcategories
          .filter((sub) => sub.subTypeId !== undefined)
          .map((sub) => sub.subTypeId as number);

        if (subTypeIds.length > 0) {
          backendFilter.subType = subTypeIds;
        }
      }
    }
  }

  // Price range filter (convert from € to cents)
  if (uiFilters.priceRange) {
    backendFilter.rentMin = uiFilters.priceRange.min * 100; // Convert € to cents
    backendFilter.rentMax = uiFilters.priceRange.max * 100; // Convert € to cents
  }

  return backendFilter;
}

/**
 * Format price for display
 */
export function formatPrice(cents: number | null | undefined): string {
  if (!cents) return "Price on request";

  const euros = cents / 100;

  if (euros >= 1000000) {
    return `€${(euros / 1000000).toFixed(2)}M`;
  }

  if (euros >= 1000) {
    return `€${(euros / 1000).toFixed(0)}K`;
  }

  return `€${euros.toLocaleString("de-AT")}`;
}

/**
 * Format price per m² for display
 */
export function formatPricePerSqm(
  rentPer: number[] | null | undefined
): string {
  if (!rentPer || rentPer.length === 0) return "";

  const min = rentPer[0];
  const max = rentPer[1] || min;

  if (min === max) {
    return `€${min.toFixed(0)}/m²`;
  }

  return `€${min.toFixed(0)}-${max.toFixed(0)}/m²`;
}

/**
 * Format size for display
 */
export function formatSize(size: number | null | undefined): string {
  if (!size) return "";
  return `${size.toFixed(0)} m²`;
}

/**
 * Format room count for display
 */
export function formatRooms(rooms: number | null | undefined): string {
  if (!rooms) return "";
  return rooms === 1 ? "1 Room" : `${rooms} Rooms`;
}

/**
 * Format floor for display
 */
export function formatFloor(floor: number | null | undefined): string {
  if (floor === null || floor === undefined) return "";
  if (floor === 0) return "Ground Floor";
  return `Floor ${floor}`;
}

/**
 * Format address for display
 */
export function formatAddress(
  address: string,
  city: string,
  zip: string
): string {
  return `${address}, ${zip} ${city}`;
}

/**
 * Get property type display name
 */
export function getPropertyTypeDisplay(
  type: $Enums.PropertyType,
  subType: $Enums.PropertySubType
): string {
  // Return subtype as it's more specific
  return subType
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
