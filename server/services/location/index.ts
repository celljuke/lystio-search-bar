import { config } from "@/lib/config";
import {
  popularLocationsResponseSchema,
  boundaryRequestSchema,
  boundaryResponseSchema,
  type PopularLocationsResponse,
  type BoundaryRequest,
  type BoundaryResponse,
} from "./schema";

/**
 * Location service for fetching location data from Lystio API
 */
export class LocationService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.lystio.apiUrl;
  }

  /**
   * Fetch popular locations (cities and their districts)
   * @returns Array of popular locations with their children
   */
  async getPopularLocations(): Promise<PopularLocationsResponse> {
    try {
      const url = `${this.baseUrl}/geo/boundary/popular`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch popular locations: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Validate response with Zod schema
      const validatedData = popularLocationsResponseSchema.parse(data);

      return validatedData;
    } catch (error) {
      console.error("Error fetching popular locations:", error);
      throw new Error(
        `Failed to fetch popular locations: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Fetch boundary (bbox) for specific location IDs
   * @param request - Object containing array of location IDs
   * @returns Array of boundary data with bbox coordinates
   */
  async getBoundary(request: BoundaryRequest): Promise<BoundaryResponse> {
    try {
      // Validate input
      const validatedRequest = boundaryRequestSchema.parse(request);

      const url = `${this.baseUrl}/geo/boundary`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch boundary: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response with Zod schema
      const validatedData = boundaryResponseSchema.parse(data);

      return validatedData;
    } catch (error) {
      console.error("Error fetching boundary:", error);
      throw new Error(
        `Failed to fetch boundary: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Export singleton instance
export const locationService = new LocationService();
