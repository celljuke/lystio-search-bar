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

  // Price range filter (API expects euros, not cents)
  if (uiFilters.priceRange) {
    backendFilter.rentMin = uiFilters.priceRange.min; // Already in euros
    backendFilter.rentMax = uiFilters.priceRange.max; // Already in euros
  }

  return backendFilter;
}

/**
 * Format price for display
 * Note: API returns price in euros, not cents
 */
export function formatPrice(euros: number | null | undefined): string {
  if (!euros) return "Price on request";

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
  rentPer: (number | null)[] | null | undefined
): string {
  if (!rentPer || rentPer.length === 0) return "";

  const min = rentPer[0];
  const max = rentPer[1];

  // Check if min is null or undefined
  if (min === null || min === undefined) return "";

  // If max is null or same as min, show single value
  if (max === null || max === undefined || min === max) {
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
  address: string | null | undefined,
  city: string | null | undefined,
  zip: string | null | undefined
): string {
  const parts = [];

  if (address) parts.push(address);
  if (zip) parts.push(zip);
  if (city) parts.push(city);

  return parts.join(", ") || "Address not available";
}

/**
 * Property type mapping for display
 */
const PROPERTY_TYPE_MAP: Record<number, string> = {
  0: "Apartment",
  1: "Apartment",
  2: "Apartment",
  3: "House",
  4: "Land",
  5: "Commercial",
  11: "Holiday Home",
  12: "New Development",
  13: "Parking",
  20: "Office",
  21: "Investment",
};

/**
 * Property subtype mapping for display
 */
const PROPERTY_SUBTYPE_MAP: Record<number, string> = {
  // Houses (type 3)
  3: "Townhouse",
  6: "Farmhouse",
  7: "Villa",
  8: "Single Family House",
  9: "Multi-Family House",
  10: "Shell Construction",

  // Apartments (type 2)
  46: "Penthouse",
  47: "Wohnung",
  49: "Penthouse",
  50: "Genossenschaftswohnung",
  51: "Maisonette",
  52: "Loft/Studio",
  53: "Dachgeschoss",
  54: "Erdgeschoß",
  55: "Souterrain",
  103: "Dachgeschoss",

  // Land (type 4)
  72: "Agricultural Land",
  73: "Forest Land",
  201: "Building Land",
  202: "Commercial Plot",
  203: "Industrial Plot",

  // Parking (type 13)
  153: "Single Garage",
  154: "Double Garage",
  155: "Parking Space",
  156: "Carport",
  157: "Underground Garage",
  158: "Underground Parking Space",
  159: "Parking Space with Charging Station",

  // Investment (type 21)
  114: "Investment Property",
  115: "Development Property",
  116: "Project Development",

  // Other
  200: "Other",
};

/**
 * Get property type display name
 */
export function getPropertyTypeDisplay(type: number, subType: number): string {
  // Return subtype name if available, otherwise fall back to type
  return PROPERTY_SUBTYPE_MAP[subType] || PROPERTY_TYPE_MAP[type] || "Property";
}
