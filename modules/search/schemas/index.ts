import { z } from "zod";

export const searchFiltersSchema = z.object({
  location: z.string().min(1, "Location is required"),
  propertyType: z.string().min(1, "Property type is required"),
  priceRange: z.string().min(1, "Price range is required"),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;
