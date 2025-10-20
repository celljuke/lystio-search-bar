import { router, publicProcedure } from "../trpc";
import { locationService } from "@/server/services/location/index.export";
import { boundaryRequestSchema } from "@/server/services/location/schema";

/**
 * Location router for fetching location data
 */
export const locationRouter = router({
  /**
   * Get popular locations (cities and their districts)
   */
  getPopular: publicProcedure.query(async () => {
    return await locationService.getPopularLocations();
  }),

  /**
   * Get boundary (bbox) for specific location IDs
   */
  getBoundary: publicProcedure
    .input(boundaryRequestSchema)
    .mutation(async ({ input }) => {
      return await locationService.getBoundary(input);
    }),

  /**
   * Get recent searches
   */
  getRecentSearches: publicProcedure.query(async () => {
    return await locationService.getRecentSearches();
  }),
});
