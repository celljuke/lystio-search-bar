import { z } from "zod";

/**
 * Schema for a district/child location
 */
export const locationChildSchema = z.object({
  name: z.string(),
  altName: z.string(),
  id: z.string(),
  postal_code: z.string(),
  urlSegment: z.string().nullable(),
});

/**
 * Schema for a popular location (city/region)
 */
export const popularLocationSchema = z.object({
  name: z.string(),
  altName: z.string(),
  id: z.string(),
  children: z.array(locationChildSchema),
  urlSegment: z.string(),
});

/**
 * Schema for the popular locations API response
 */
export const popularLocationsResponseSchema = z.array(popularLocationSchema);

/**
 * Schema for boundary request
 */
export const boundaryRequestSchema = z.object({
  ids: z.array(z.string()),
});

/**
 * Schema for boundary response
 * bbox format: [[minLng, minLat], [maxLng, maxLat]]
 */
export const boundaryResponseItemSchema = z.object({
  geojson: z.any(),
  bbox: z.tuple([
    z.tuple([z.number(), z.number()]), // [minLng, minLat]
    z.tuple([z.number(), z.number()]), // [maxLng, maxLat]
  ]),
});

export const boundaryResponseSchema = z.array(boundaryResponseItemSchema);

/**
 * Type exports
 */
export type LocationChild = z.infer<typeof locationChildSchema>;
export type PopularLocation = z.infer<typeof popularLocationSchema>;
export type PopularLocationsResponse = z.infer<
  typeof popularLocationsResponseSchema
>;
export type BoundaryRequest = z.infer<typeof boundaryRequestSchema>;
export type BoundaryResponseItem = z.infer<typeof boundaryResponseItemSchema>;
export type BoundaryResponse = z.infer<typeof boundaryResponseSchema>;
