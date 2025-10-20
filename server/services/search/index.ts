import { config } from "@/lib/config";
import type {
  SearchInput,
  SearchFilter,
  SearchSort,
  LystioApiRequest,
  LystioApiFilter,
  LystioApiSort,
  SearchPaging,
  HistogramResponse,
  CountResponse,
} from "./schema";
import { histogramResponseSchema, countResponseSchema } from "./schema";

/**
 * Response structure from Lystio API
 */
interface LystioApiResponse {
  res: any[]; // Array of property results
  paging: {
    pageCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    allTotalCount: number;
  };
}

export class SearchService {
  private readonly apiUrl = config.lystio.apiUrl;

  /**
   * Main search method that calls the Lystio API
   */
  async search(input: SearchInput) {
    const { filter, sort, paging } = input;

    // Convert our filter/sort/paging to Lystio API format
    const apiRequest = this.buildLystioApiRequest(filter, sort, paging);

    try {
      // Call the Lystio API
      const response = await fetch(`${this.apiUrl}/tenement/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequest),
      });

      if (!response.ok) {
        throw new Error(
          `Lystio API error: ${response.status} ${response.statusText}`
        );
      }

      const data: LystioApiResponse = await response.json();

      // Transform the response to our format
      return {
        properties: data.res,
        pagination: {
          page: data.paging.page,
          pageSize: data.paging.pageSize,
          total: data.paging.totalCount,
          totalPages: data.paging.pageCount,
          hasNextPage: data.paging.page < data.paging.pageCount,
          hasPreviousPage: data.paging.page > 1,
          allTotalCount: data.paging.allTotalCount,
        },
      };
    } catch (error) {
      console.error("Error calling Lystio API:", error);
      throw error;
    }
  }

  /**
   * Build Lystio API request from our filter/sort/paging
   */
  private buildLystioApiRequest(
    filter: SearchFilter,
    sort?: SearchSort,
    paging?: SearchPaging
  ): LystioApiRequest {
    // Build filter object
    const apiFilter: LystioApiFilter = {
      status: "active", // Default to active properties
    };

    // Property type filters
    if (filter.type && filter.type.length > 0) {
      apiFilter.type = filter.type;
    }

    if (filter.subType && filter.subType.length > 0) {
      apiFilter.subType = filter.subType;
    }

    if (filter.rentType && filter.rentType.length > 0) {
      apiFilter.rentType = filter.rentType;
    }

    if (filter.condition && filter.condition.length > 0) {
      apiFilter.condition = filter.condition;
    }

    // Price filters - convert to [min, max] tuple
    if (filter.rentMin !== undefined || filter.rentMax !== undefined) {
      apiFilter.rent = [filter.rentMin ?? 0, filter.rentMax ?? 999999999];
    }

    // Size filters - convert to [min, max] tuple
    if (filter.sizeMin !== undefined || filter.sizeMax !== undefined) {
      apiFilter.size = [filter.sizeMin ?? 0, filter.sizeMax ?? 999999];
    }

    // Room filters - convert to [min, max] tuple
    if (filter.roomsMin !== undefined || filter.roomsMax !== undefined) {
      apiFilter.rooms = [filter.roomsMin ?? 0, filter.roomsMax ?? 99];
    }

    if (filter.roomsBedMin !== undefined || filter.roomsBedMax !== undefined) {
      apiFilter.roomsBed = [filter.roomsBedMin ?? 0, filter.roomsBedMax ?? 99];
    }

    if (
      filter.roomsBathMin !== undefined ||
      filter.roomsBathMax !== undefined
    ) {
      apiFilter.roomsBath = [
        filter.roomsBathMin ?? 0,
        filter.roomsBathMax ?? 99,
      ];
    }

    // Location filters
    if (filter.bbox) {
      apiFilter.bbox = filter.bbox;
    }

    if (filter.withinId && filter.withinId.length > 0) {
      apiFilter.withinId = filter.withinId;
    }

    // Boolean filters
    if (filter.showPriceOnRequest !== undefined) {
      apiFilter.showPriceOnRequest = filter.showPriceOnRequest;
    }

    if (filter.availableNow !== undefined) {
      apiFilter.availableNow = filter.availableNow;
    }

    // Additional filters
    if (filter.tags && filter.tags.length > 0) {
      apiFilter.tags = filter.tags;
    }

    if (filter.amenities !== undefined) {
      apiFilter.amenities = filter.amenities;
    }

    if (filter.style) {
      apiFilter.style = filter.style;
    }

    // Parking/Cellar filters
    if (filter.parkingMin !== undefined || filter.parkingMax !== undefined) {
      apiFilter.parking = [filter.parkingMin ?? 0, filter.parkingMax ?? 99];
    }

    if (filter.cellarMin !== undefined || filter.cellarMax !== undefined) {
      apiFilter.cellar = [filter.cellarMin ?? 0, filter.cellarMax ?? 99];
    }

    // Search query
    if (filter.query) {
      apiFilter.search = filter.query;
    }

    // Build sort object
    const apiSort: LystioApiSort = {
      rent: null,
      rentPer: null,
      distance: null,
      size: null,
      rooms: null,
      createdAt: null,
      countLeads: null,
    };

    if (sort) {
      if (sort.rent) apiSort.rent = sort.rent;
      if (sort.size) apiSort.size = sort.size;
      if (sort.rooms) apiSort.rooms = sort.rooms;
      if (sort.createdAt) apiSort.createdAt = sort.createdAt;
      if (sort.distance) apiSort.distance = sort.distance;
    }

    // Build paging object
    const apiPaging = {
      pageSize: paging?.pageSize ?? 10,
      page: paging?.page ?? 1,
    };

    return {
      filter: apiFilter,
      sort: apiSort,
      paging: apiPaging,
    };
  }

  /**
   * Get price histogram based on current filters
   * This excludes the price filter itself to show the full distribution
   */
  async getHistogram(filter: SearchFilter): Promise<HistogramResponse> {
    // Build API request but we only need the filter part
    const apiRequest = this.buildLystioApiRequest(filter, undefined, {
      page: 1,
      pageSize: 1,
    });

    // Remove rent range from filter for histogram
    const apiFilter = { ...apiRequest.filter };
    delete apiFilter.rent;

    try {
      // Call the Lystio API histogram endpoint
      const response = await fetch(`${this.apiUrl}/tenement/search/histogram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFilter),
      });

      if (!response.ok) {
        throw new Error(
          `Lystio API histogram error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Validate response with Zod
      const validatedData = histogramResponseSchema.parse(data);

      return validatedData;
    } catch (error) {
      console.error("Error fetching histogram:", error);
      throw new Error(
        `Failed to fetch histogram: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get count of properties matching the filter
   * Uses the Lystio API /tenement/search/count endpoint
   */
  async getCount(filter: SearchFilter): Promise<CountResponse> {
    try {
      // Build the API request
      const apiRequest = this.buildLystioApiRequest(filter);
      const apiFilter = apiRequest.filter;

      const response = await fetch(`${this.apiUrl}/tenement/search/count`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFilter),
      });

      if (!response.ok) {
        throw new Error(
          `Lystio API count error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Validate response with Zod
      const validatedData = countResponseSchema.parse(data);

      return validatedData;
    } catch (error) {
      console.error("Error fetching count:", error);
      throw new Error(
        `Failed to fetch count: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export const searchService = new SearchService();
