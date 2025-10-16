/**
 * Example test file for search service
 * This is not a runnable test but shows how to test the search service
 */

import { searchService } from "../index";
import type { SearchInput } from "../schema";

// Example test cases

describe("SearchService", () => {
  describe("search", () => {
    it("should search properties with basic filters", async () => {
      const input: SearchInput = {
        filter: {
          type: [0], // APARTMENT
          rentType: ["rent"],
          city: "Vienna",
        },
        paging: {
          page: 1,
          pageSize: 20,
        },
      };

      const result = await searchService.search(input);

      expect(result.properties).toBeDefined();
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(20);
    });

    it("should search with price filters", async () => {
      const input: SearchInput = {
        filter: {
          rentMin: 50000, // €500
          rentMax: 150000, // €1500
        },
        paging: {
          page: 1,
          pageSize: 10,
        },
      };

      const result = await searchService.search(input);

      expect(result.properties).toBeDefined();
      result.properties.forEach((property) => {
        if (property.rent) {
          expect(property.rent).toBeGreaterThanOrEqual(50000);
          expect(property.rent).toBeLessThanOrEqual(150000);
        }
      });
    });

    it("should search with bounding box", async () => {
      const input: SearchInput = {
        filter: {
          bbox: [
            [15.97407557372918, 47.875726161656644],
            [16.768524426267902, 48.538330669849046],
          ],
        },
        paging: {
          page: 1,
          pageSize: 20,
        },
      };

      const result = await searchService.search(input);

      expect(result.properties).toBeDefined();
    });

    it("should support numeric property type values", async () => {
      const input: SearchInput = {
        filter: {
          type: [2], // COMMERCIAL (numeric)
          rentType: ["buy"],
        },
        paging: {
          page: 1,
          pageSize: 20,
        },
      };

      const result = await searchService.search(input);

      expect(result.properties).toBeDefined();
      result.properties.forEach((property) => {
        expect(property.type).toBe("COMMERCIAL");
      });
    });

    it("should handle complex filters from the example payload", async () => {
      const input: SearchInput = {
        filter: {
          type: [2],
          rentType: ["buy"],
          subType: [46, 47, 49, 50, 51, 52, 53, 55, 103, 200],
          showPriceOnRequest: true,
          sort: "most_recent",
          bbox: [
            [15.97407557372918, 47.875726161656644],
            [16.768524426267902, 48.538330669849046],
          ],
        },
        sort: {
          createdAt: "desc",
        },
        paging: {
          page: 1,
          pageSize: 26,
        },
      };

      const result = await searchService.search(input);

      expect(result.properties).toBeDefined();
      expect(result.pagination.pageSize).toBe(26);
      expect(result.properties.length).toBeLessThanOrEqual(26);
    });

    it("should handle text search", async () => {
      const input: SearchInput = {
        filter: {
          query: "luxury",
        },
        paging: {
          page: 1,
          pageSize: 10,
        },
      };

      const result = await searchService.search(input);

      expect(result.properties).toBeDefined();
    });

    it("should return verified properties only", async () => {
      const input: SearchInput = {
        filter: {
          verified: true,
        },
        paging: {
          page: 1,
          pageSize: 10,
        },
      };

      const result = await searchService.search(input);

      result.properties.forEach((property) => {
        expect(property.verified).toBe(true);
      });
    });

    it("should sort by price ascending", async () => {
      const input: SearchInput = {
        filter: {},
        sort: {
          rent: "asc",
        },
        paging: {
          page: 1,
          pageSize: 10,
        },
      };

      const result = await searchService.search(input);

      expect(result.properties).toBeDefined();

      // Verify sorting
      for (let i = 1; i < result.properties.length; i++) {
        const prevRent = result.properties[i - 1].rent || 0;
        const currRent = result.properties[i].rent || 0;
        expect(currRent).toBeGreaterThanOrEqual(prevRent);
      }
    });

    it("should return correct pagination metadata", async () => {
      const input: SearchInput = {
        filter: {},
        paging: {
          page: 2,
          pageSize: 10,
        },
      };

      const result = await searchService.search(input);

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.pageSize).toBe(10);
      expect(result.pagination.total).toBeGreaterThanOrEqual(0);
      expect(result.pagination.hasPreviousPage).toBe(true);
    });
  });
});
