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
} from "./services/search/index.export";

// Type conversion utilities
export {
  convertPropertyTypes,
  convertPropertySubTypes,
  convertRentTypes,
  PropertyTypeMap,
  PropertySubTypeMap,
  RentTypeMap,
} from "./services/search/types";

// Schemas
export {
  searchInputSchema,
  searchFilterSchema,
  sortSchema,
  pagingSchema,
  bboxSchema,
} from "./services/search/schema";
