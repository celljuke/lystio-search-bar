import type { SearchFilters, PropertyTypeFilter } from "../types";
import type { SearchFilter } from "@/server/services/search/schema";
import { $Enums } from "@/lib/generated/prisma";
import { getBboxForLocation, getDefaultViennaBbox } from "./location-utils";

/**
 * Maps frontend category IDs to backend property types and subtypes
 */
const CATEGORY_TYPE_MAP: Record<
  string,
  {
    type: $Enums.PropertyType[];
    subType?: $Enums.PropertySubType[];
  }
> = {
  apartments: {
    type: ["APARTMENT"],
    subType: ["APARTMENT", "PENTHOUSE", "MAISONETTE"],
  },
  houses: {
    type: ["HOUSE"],
    subType: [
      "DETACHED_HOUSE",
      "SEMI_DETACHED_HOUSE",
      "TERRACED_HOUSE",
      "VILLA",
    ],
  },
  office: {
    type: ["COMMERCIAL"],
    subType: ["OFFICE"],
  },
  commercial: {
    type: ["COMMERCIAL"],
    subType: ["RETAIL", "WAREHOUSE", "OFFICE"],
  },
  plots: {
    type: ["LAND"],
    subType: ["BUILDING_LAND", "AGRICULTURAL_LAND", "FOREST_LAND"],
  },
  parking: {
    type: ["OTHER"],
    subType: ["GARAGE", "PARKING_SPACE"],
  },
  // Default for other categories
  default: {
    type: ["APARTMENT", "HOUSE", "COMMERCIAL", "LAND", "OTHER"],
  },
};

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
    // Set rent type based on mode
    rentType: [rentBuyMode === "rent" ? "RENT" : "BUY"],
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

  // Property type filter
  if (uiFilters.propertyType) {
    const categoryId = uiFilters.propertyType.categoryId;
    const typeMapping =
      CATEGORY_TYPE_MAP[categoryId] || CATEGORY_TYPE_MAP.default;

    backendFilter.type = typeMapping.type;

    if (typeMapping.subType) {
      backendFilter.subType = typeMapping.subType;
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
