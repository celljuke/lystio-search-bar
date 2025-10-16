import { $Enums } from "@/lib/generated/prisma";

/**
 * Enum mappings for converting numeric values to enum strings
 * Based on the actual enum order in Prisma schema
 */

// PropertyType enum mapping
export const PropertyTypeMap: Record<number, $Enums.PropertyType> = {
  0: "APARTMENT",
  1: "HOUSE",
  2: "COMMERCIAL",
  3: "LAND",
  4: "OTHER",
};

// PropertySubType enum mapping
export const PropertySubTypeMap: Record<number, $Enums.PropertySubType> = {
  0: "PENTHOUSE",
  1: "APARTMENT",
  2: "MAISONETTE",
  3: "TERRACED_HOUSE",
  4: "DETACHED_HOUSE",
  5: "SEMI_DETACHED_HOUSE",
  6: "VILLA",
  7: "OFFICE",
  8: "RETAIL",
  9: "WAREHOUSE",
  10: "GARAGE",
  11: "PARKING_SPACE",
  12: "BUILDING_LAND",
  13: "AGRICULTURAL_LAND",
  14: "FOREST_LAND",
  15: "OTHER",
  // Extended mappings for higher numbers
  46: "PENTHOUSE",
  47: "APARTMENT",
  48: "MAISONETTE",
  49: "TERRACED_HOUSE",
  50: "DETACHED_HOUSE",
  51: "SEMI_DETACHED_HOUSE",
  52: "VILLA",
  53: "OFFICE",
  55: "RETAIL",
  103: "WAREHOUSE",
  200: "OTHER",
};

// RentType enum mapping
export const RentTypeMap: Record<string, $Enums.RentType> = {
  rent: "RENT",
  buy: "BUY",
  RENT: "RENT",
  BUY: "BUY",
};

/**
 * Convert numeric type values to PropertyType enum
 */
export function convertPropertyTypes(
  types?: (number | $Enums.PropertyType)[]
): $Enums.PropertyType[] | undefined {
  if (!types || types.length === 0) return undefined;

  return types
    .map((t) => {
      if (typeof t === "number") {
        return PropertyTypeMap[t];
      }
      return t;
    })
    .filter((t): t is $Enums.PropertyType => t !== undefined);
}

/**
 * Convert numeric subType values to PropertySubType enum
 */
export function convertPropertySubTypes(
  subTypes?: (number | $Enums.PropertySubType)[]
): $Enums.PropertySubType[] | undefined {
  if (!subTypes || subTypes.length === 0) return undefined;

  return subTypes
    .map((st) => {
      if (typeof st === "number") {
        return PropertySubTypeMap[st];
      }
      return st;
    })
    .filter((st): st is $Enums.PropertySubType => st !== undefined);
}

/**
 * Convert string rentType values to RentType enum
 */
export function convertRentTypes(
  rentTypes?: (string | $Enums.RentType)[]
): $Enums.RentType[] | undefined {
  if (!rentTypes || rentTypes.length === 0) return undefined;

  return rentTypes
    .map((rt) => {
      if (typeof rt === "string") {
        return RentTypeMap[rt.toLowerCase()] || RentTypeMap[rt.toUpperCase()];
      }
      return rt;
    })
    .filter((rt): rt is $Enums.RentType => rt !== undefined);
}
