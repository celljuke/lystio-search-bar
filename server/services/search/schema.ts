import { z } from "zod";

// Lystio API Filter schema - matching the API structure
export const lystioApiFilterSchema = z.object({
  ids: z.array(z.number()).optional(),
  size: z.tuple([z.number().nullable(), z.number().nullable()]).optional(),
  rent: z.tuple([z.number().nullable(), z.number().nullable()]).optional(),
  rentScope: z.enum(["rent", "buy"]).optional(),
  rentUtilities: z
    .tuple([z.number().nullable(), z.number().nullable()])
    .optional(),
  rooms: z.tuple([z.number().nullable(), z.number().nullable()]).optional(),
  roomsBed: z.tuple([z.number().nullable(), z.number().nullable()]).optional(),
  roomsBath: z.tuple([z.number().nullable(), z.number().nullable()]).optional(),
  type: z.array(z.number()).optional(),
  subType: z.array(z.number()).optional(),
  condition: z.array(z.number()).optional(),
  accessibility: z.array(z.number()).optional(),
  rentType: z.array(z.enum(["rent", "buy"])).optional(),
  floorType: z.array(z.number()).optional(),
  heatingType: z.array(z.number()).optional(),
  pets: z.array(z.string()).optional(),
  readiness: z.array(z.number()).optional(),
  tier: z.array(z.number()).optional(),
  furnish: z.array(z.number()).optional(),
  status: z.string().optional(),
  locationAccuracy: z.string().optional(),
  search: z.string().optional(),
  rentDurationMax: z.number().optional(),
  hasRequests: z.boolean().optional(),
  hasRequestsUserId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  availableNow: z.boolean().optional(),
  within: z.any().nullable().optional(),
  withinId: z.array(z.string()).optional(),
  bbox: z.any().nullable().optional(),
  near: z.any().nullable().optional(),
  amenities: z.any().nullable().optional(),
  moveIn: z.string().optional(),
  maxAge: z.number().optional(),
  efficiencyIncludeNull: z.boolean().optional(),
  minGarages: z.boolean().optional(),
  efficiency: z.number().optional(),
  listId: z.number().optional(),
  searchAgentId: z.number().optional(),
  withLeads: z.boolean().optional(),
  listingDuration: z.number().optional(),
  parking: z.tuple([z.number().nullable(), z.number().nullable()]).optional(),
  cellar: z.tuple([z.number().nullable(), z.number().nullable()]).optional(),
  style: z.enum(["old", "new"]).optional(),
  showPriceOnRequest: z.boolean().optional(),
});

// Lystio API Sort schema
export const lystioApiSortSchema = z.object({
  rent: z.enum(["asc", "desc"]).nullable().optional(),
  rentPer: z.enum(["asc", "desc"]).nullable().optional(),
  distance: z.enum(["asc", "desc"]).nullable().optional(),
  size: z.enum(["asc", "desc"]).nullable().optional(),
  rooms: z.enum(["asc", "desc"]).nullable().optional(),
  createdAt: z.enum(["asc", "desc"]).nullable().optional(),
  countLeads: z.enum(["asc", "desc"]).nullable().optional(),
});

// Lystio API Paging schema
export const lystioApiPagingSchema = z.object({
  pageSize: z.number().min(1).max(100).default(10),
  page: z.number().min(1).default(1),
});

// Main Lystio API request schema
export const lystioApiRequestSchema = z.object({
  filter: lystioApiFilterSchema,
  sort: lystioApiSortSchema,
  paging: lystioApiPagingSchema,
});

// Simplified client-facing filter schema
export const searchFilterSchema = z.object({
  // Property type filters
  type: z.array(z.number()).optional(),
  subType: z.array(z.number()).optional(),
  rentType: z.array(z.enum(["rent", "buy"])).optional(),
  condition: z.array(z.number()).optional(),

  // Price filters
  rentMin: z.number().optional(),
  rentMax: z.number().optional(),

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
  bbox: z.any().optional(),
  withinId: z.array(z.string()).optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),

  // Boolean filters
  showPriceOnRequest: z.boolean().optional(),
  verified: z.boolean().optional(),
  availableNow: z.boolean().optional(),

  // Additional filters
  tags: z.array(z.string()).optional(),
  amenities: z.array(z.number()).optional(),
  style: z.enum(["old", "new"]).optional(),
  parkingMin: z.number().optional(),
  parkingMax: z.number().optional(),
  cellarMin: z.number().optional(),
  cellarMax: z.number().optional(),

  // Search query
  query: z.string().optional(),
});

// Pagination schema
export const pagingSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

// Sort schema - client facing
export const sortSchema = z.object({
  createdAt: z.enum(["asc", "desc"]).optional(),
  rent: z.enum(["asc", "desc"]).optional(),
  size: z.enum(["asc", "desc"]).optional(),
  rooms: z.enum(["asc", "desc"]).optional(),
  distance: z.enum(["asc", "desc"]).optional(),
});

// Main search input schema
export const searchInputSchema = z.object({
  filter: searchFilterSchema,
  sort: sortSchema.optional(),
  paging: pagingSchema,
});

// Histogram response schema
export const histogramResponseSchema = z.object({
  range: z.tuple([z.number().nullable(), z.number().nullable()]), // [min, max] - can be null if no data
  histogram: z.array(z.number()), // Array of counts for each bin
});

// Count response schema
export const countResponseSchema = z.object({
  count: z.number(), // Total count of properties matching the filter
});

// AI search request schema
export const aiSearchRequestSchema = z.object({
  prompt: z.string(), // Natural language search query
});

// AI search response schema - returns filter object
export const aiSearchResponseSchema = lystioApiFilterSchema;

// Export types
export type LystioApiFilter = z.infer<typeof lystioApiFilterSchema>;
export type LystioApiSort = z.infer<typeof lystioApiSortSchema>;
export type LystioApiPaging = z.infer<typeof lystioApiPagingSchema>;
export type LystioApiRequest = z.infer<typeof lystioApiRequestSchema>;
export type SearchFilter = z.infer<typeof searchFilterSchema>;
export type SearchPaging = z.infer<typeof pagingSchema>;
export type SearchSort = z.infer<typeof sortSchema>;
export type SearchInput = z.infer<typeof searchInputSchema>;
export type HistogramResponse = z.infer<typeof histogramResponseSchema>;
export type CountResponse = z.infer<typeof countResponseSchema>;
export type AiSearchRequest = z.infer<typeof aiSearchRequestSchema>;
export type AiSearchResponse = z.infer<typeof aiSearchResponseSchema>;
