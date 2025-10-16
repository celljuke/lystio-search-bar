import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";
import type { SearchInput, SearchFilter, SearchSort } from "./schema";
import {
  convertPropertyTypes,
  convertPropertySubTypes,
  convertRentTypes,
} from "./types";

export class SearchService {
  /**
   * Main search method for properties
   */
  async search(input: SearchInput) {
    const { filter, sort, paging } = input;

    // Build the where clause
    const where = this.buildWhereClause(filter);

    // Build the orderBy clause
    const orderBy = this.buildOrderByClause(filter, sort);

    // Calculate pagination
    const skip = (paging.page - 1) * paging.pageSize;
    const take = paging.pageSize;

    // Execute query with pagination
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          media: {
            where: {
              type: "PHOTO",
            },
            orderBy: {
              createdAt: "asc",
            },
            take: 1,
          },
          owner: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              logoColor: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
          amenities: {
            include: {
              amenity: true,
            },
          },
          spaces: true,
          energy: true,
        },
      }),
      prisma.property.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / paging.pageSize);
    const hasNextPage = paging.page < totalPages;
    const hasPreviousPage = paging.page > 1;

    return {
      properties,
      pagination: {
        page: paging.page,
        pageSize: paging.pageSize,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  /**
   * Build Prisma where clause from filters
   */
  private buildWhereClause(filter: SearchFilter): Prisma.PropertyWhereInput {
    const where: Prisma.PropertyWhereInput = {
      AND: [],
    };

    const conditions = where.AND as Prisma.PropertyWhereInput[];

    // Property type filters - convert numeric values to enums
    const propertyTypes = convertPropertyTypes(filter.type);
    if (propertyTypes && propertyTypes.length > 0) {
      conditions.push({
        type: { in: propertyTypes },
      });
    }

    const propertySubTypes = convertPropertySubTypes(filter.subType);
    if (propertySubTypes && propertySubTypes.length > 0) {
      conditions.push({
        subType: { in: propertySubTypes },
      });
    }

    const rentTypes = convertRentTypes(filter.rentType);
    if (rentTypes && rentTypes.length > 0) {
      conditions.push({
        rentType: { in: rentTypes },
      });
    }

    if (filter.status && filter.status.length > 0) {
      conditions.push({
        status: { in: filter.status },
      });
    }

    if (filter.condition && filter.condition.length > 0) {
      conditions.push({
        condition: { in: filter.condition },
      });
    }

    // Price filters (in cents)
    if (filter.rentMin !== undefined || filter.rentMax !== undefined) {
      const rentFilter: Prisma.IntNullableFilter = {};

      if (filter.rentMin !== undefined) {
        rentFilter.gte = filter.rentMin;
      }

      if (filter.rentMax !== undefined) {
        rentFilter.lte = filter.rentMax;
      }

      conditions.push({
        OR: [
          { rent: rentFilter },
          filter.showPriceOnRequest ? { priceOnRequest: true } : {},
        ],
      });
    }

    // Price per m² filters
    if (filter.rentPerMin !== undefined || filter.rentPerMax !== undefined) {
      // Using rentPer array field [min, max]
      const rentPerConditions: Prisma.PropertyWhereInput[] = [];

      if (filter.rentPerMin !== undefined) {
        rentPerConditions.push({
          rentPer: {
            path: "$[0]",
            gte: filter.rentPerMin,
          } as any,
        });
      }

      if (filter.rentPerMax !== undefined) {
        rentPerConditions.push({
          rentPer: {
            path: "$[1]",
            lte: filter.rentPerMax,
          } as any,
        });
      }

      if (rentPerConditions.length > 0) {
        conditions.push({ AND: rentPerConditions });
      }
    }

    // Size filters
    if (filter.sizeMin !== undefined) {
      conditions.push({
        size: { gte: filter.sizeMin },
      });
    }

    if (filter.sizeMax !== undefined) {
      conditions.push({
        size: { lte: filter.sizeMax },
      });
    }

    // Room filters
    if (filter.roomsMin !== undefined) {
      conditions.push({
        rooms: { gte: filter.roomsMin },
      });
    }

    if (filter.roomsMax !== undefined) {
      conditions.push({
        rooms: { lte: filter.roomsMax },
      });
    }

    if (filter.roomsBedMin !== undefined) {
      conditions.push({
        roomsBed: { gte: filter.roomsBedMin },
      });
    }

    if (filter.roomsBedMax !== undefined) {
      conditions.push({
        roomsBed: { lte: filter.roomsBedMax },
      });
    }

    if (filter.roomsBathMin !== undefined) {
      conditions.push({
        roomsBath: { gte: filter.roomsBathMin },
      });
    }

    if (filter.roomsBathMax !== undefined) {
      conditions.push({
        roomsBath: { lte: filter.roomsBathMax },
      });
    }

    // Location filters - bbox (bounding box)
    if (filter.bbox) {
      const [[minLng, minLat], [maxLng, maxLat]] = filter.bbox;

      // PostgreSQL array comparison for location [lng, lat]
      conditions.push({
        AND: [
          {
            location: {
              path: "$[0]",
              gte: minLng,
            } as any,
          },
          {
            location: {
              path: "$[0]",
              lte: maxLng,
            } as any,
          },
          {
            location: {
              path: "$[1]",
              gte: minLat,
            } as any,
          },
          {
            location: {
              path: "$[1]",
              lte: maxLat,
            } as any,
          },
        ],
      });
    }

    if (filter.city) {
      conditions.push({
        city: { contains: filter.city, mode: "insensitive" },
      });
    }

    if (filter.zip) {
      conditions.push({
        zip: { contains: filter.zip },
      });
    }

    if (filter.country) {
      conditions.push({
        country: filter.country,
      });
    }

    // Boolean filters
    if (filter.verified !== undefined) {
      conditions.push({
        verified: filter.verified,
      });
    }

    if (filter.active !== undefined) {
      conditions.push({
        active: filter.active,
      });
    } else {
      // Default to active properties
      conditions.push({
        active: true,
      });
    }

    if (filter.listed !== undefined) {
      conditions.push({
        listed: filter.listed,
      });
    } else {
      // Default to listed properties
      conditions.push({
        listed: true,
      });
    }

    // Additional filters
    if (filter.heatingSource && filter.heatingSource.length > 0) {
      conditions.push({
        heatingSource: { in: filter.heatingSource },
      });
    }

    if (filter.heatingDistribution && filter.heatingDistribution.length > 0) {
      conditions.push({
        heatingDistribution: { in: filter.heatingDistribution },
      });
    }

    if (filter.constructionYearMin !== undefined) {
      conditions.push({
        constructionYear: { gte: filter.constructionYearMin },
      });
    }

    if (filter.constructionYearMax !== undefined) {
      conditions.push({
        constructionYear: { lte: filter.constructionYearMax },
      });
    }

    if (filter.floorMin !== undefined) {
      conditions.push({
        floor: { gte: filter.floorMin },
      });
    }

    if (filter.floorMax !== undefined) {
      conditions.push({
        floor: { lte: filter.floorMax },
      });
    }

    if (filter.availableFrom) {
      conditions.push({
        availableFrom: { lte: new Date(filter.availableFrom) },
      });
    }

    // Tags filter - array contains
    if (filter.tags && filter.tags.length > 0) {
      conditions.push({
        tags: { hasSome: filter.tags },
      });
    }

    // Amenities filter
    if (filter.amenityIds && filter.amenityIds.length > 0) {
      conditions.push({
        amenities: {
          some: {
            amenityId: { in: filter.amenityIds },
          },
        },
      });
    }

    // Search query - search in title, address, and abstract
    if (filter.query) {
      conditions.push({
        OR: [
          { title: { contains: filter.query, mode: "insensitive" } },
          { address: { contains: filter.query, mode: "insensitive" } },
          { abstract: { contains: filter.query, mode: "insensitive" } },
          { city: { contains: filter.query, mode: "insensitive" } },
        ],
      });
    }

    // If no conditions, return all
    if (conditions.length === 0) {
      return {};
    }

    return where;
  }

  /**
   * Build Prisma orderBy clause from filter and sort
   */
  private buildOrderByClause(
    filter: SearchFilter,
    sort?: SearchSort
  ):
    | Prisma.PropertyOrderByWithRelationInput
    | Prisma.PropertyOrderByWithRelationInput[] {
    // If explicit sort object is provided
    if (sort) {
      const orderBy: Prisma.PropertyOrderByWithRelationInput[] = [];

      if (sort.createdAt) {
        orderBy.push({ createdAt: sort.createdAt });
      }

      if (sort.updatedAt) {
        orderBy.push({ updatedAt: sort.updatedAt });
      }

      if (sort.rent) {
        orderBy.push({ rent: sort.rent });
      }

      if (sort.size) {
        orderBy.push({ size: sort.size });
      }

      if (sort.rooms) {
        orderBy.push({ rooms: sort.rooms });
      }

      if (orderBy.length > 0) {
        return orderBy;
      }
    }

    // Use filter.sort if available
    if (filter.sort) {
      switch (filter.sort) {
        case "most_recent":
          return { createdAt: "desc" };
        case "price_asc":
          return { rent: "asc" };
        case "price_desc":
          return { rent: "desc" };
        case "size_asc":
          return { size: "asc" };
        case "size_desc":
          return { size: "desc" };
        case "rooms_asc":
          return { rooms: "asc" };
        case "rooms_desc":
          return { rooms: "desc" };
      }
    }

    // Default sort by most recent
    return { createdAt: "desc" };
  }
}

export const searchService = new SearchService();
