/**
 * Server exports
 * Centralized exports for server-side code
 */

// API exports
export { appRouter } from "./api/root";
export type { AppRouter } from "./api/root";

// Search service exports
export {
  searchService,
  type SearchService,
  type SearchInput,
  type SearchFilter,
  type SearchSort,
  type SearchPaging,
  type LystioApiRequest,
  type LystioApiFilter,
  type LystioApiSort,
  type LystioApiPaging,
} from "./services/search/index.export";

// Location service exports
export {
  locationService,
  type LocationService,
  type PopularLocation,
  type LocationChild,
  type PopularLocationsResponse,
  type BoundaryRequest,
  type BoundaryResponse,
  type BoundaryResponseItem,
} from "./services/location/index.export";

// Schemas
export {
  searchInputSchema,
  searchFilterSchema,
  sortSchema,
  pagingSchema,
  lystioApiRequestSchema,
  lystioApiFilterSchema,
  lystioApiSortSchema,
  lystioApiPagingSchema,
  histogramResponseSchema,
  type HistogramResponse,
} from "./services/search/schema";

export {
  popularLocationSchema,
  locationChildSchema,
  popularLocationsResponseSchema,
  boundaryRequestSchema,
  boundaryResponseSchema,
  boundaryResponseItemSchema,
} from "./services/location/schema";
