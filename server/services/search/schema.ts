import { z } from "zod";
import { $Enums } from "@/lib/generated/prisma";

// Bbox schema: [[minLng, minLat], [maxLng, maxLat]]
export const bboxSchema = z.tuple([
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number()]),
]);

// Filter schema
export const searchFilterSchema = z.object({
  // Property type filters - accept both numbers and enum strings
  type: z
    .array(z.union([z.number(), z.nativeEnum($Enums.PropertyType)]))
    .optional(),
  subType: z
    .array(z.union([z.number(), z.nativeEnum($Enums.PropertySubType)]))
    .optional(),
  rentType: z
    .array(z.union([z.string(), z.nativeEnum($Enums.RentType)]))
    .optional(),
  status: z.array(z.nativeEnum($Enums.PropertyStatus)).optional(),
  condition: z.array(z.nativeEnum($Enums.PropertyCondition)).optional(),

  // Price filters (in cents)
  rentMin: z.number().optional(),
  rentMax: z.number().optional(),
  rentPerMin: z.number().optional(),
  rentPerMax: z.number().optional(),

  // Size filters
  sizeMin: z.number().optional(),
  sizeMax: z.number().optional(),

  // Room filters
  roomsMin: z.number().optional(),
  roomsMax: z.number().optional(),
  roomsBedMin: z.number().optional(),
  roomsBedMax: z.number().optional(),
  roomsBathMin: z.number().optional(),
  roomsBathMax: z.number().optional(),

  // Location filters
  bbox: bboxSchema.optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),

  // Boolean filters
  showPriceOnRequest: z.boolean().optional(),
  verified: z.boolean().optional(),
  active: z.boolean().optional(),
  listed: z.boolean().optional(),

  // Additional filters
  heatingSource: z.array(z.nativeEnum($Enums.HeatingSource)).optional(),
  heatingDistribution: z
    .array(z.nativeEnum($Enums.HeatingDistribution))
    .optional(),
  constructionYearMin: z.number().optional(),
  constructionYearMax: z.number().optional(),
  floorMin: z.number().optional(),
  floorMax: z.number().optional(),
  availableFrom: z.string().datetime().optional(),

  // Tags filter
  tags: z.array(z.string()).optional(),

  // Amenities filter
  amenityIds: z.array(z.string()).optional(),

  // Search query
  query: z.string().optional(),

  // Sort
  sort: z
    .enum([
      "most_recent",
      "price_asc",
      "price_desc",
      "size_asc",
      "size_desc",
      "rooms_asc",
      "rooms_desc",
    ])
    .optional(),
});

// Pagination schema
export const pagingSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(26),
});

// Sort schema
export const sortSchema = z
  .object({
    createdAt: z.enum(["asc", "desc"]).optional(),
    updatedAt: z.enum(["asc", "desc"]).optional(),
    rent: z.enum(["asc", "desc"]).optional(),
    size: z.enum(["asc", "desc"]).optional(),
    rooms: z.enum(["asc", "desc"]).optional(),
  })
  .optional();

// Main search input schema
export const searchInputSchema = z.object({
  filter: searchFilterSchema,
  sort: sortSchema,
  paging: pagingSchema,
});

// Export types
export type SearchFilter = z.infer<typeof searchFilterSchema>;
export type SearchPaging = z.infer<typeof pagingSchema>;
export type SearchSort = z.infer<typeof sortSchema>;
export type SearchInput = z.infer<typeof searchInputSchema>;
