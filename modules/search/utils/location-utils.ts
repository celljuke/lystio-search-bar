/**
 * Location utilities for handling coordinates and bounding boxes
 */

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface BoundingBox {
  bbox: [[number, number], [number, number]]; // [[minLng, minLat], [maxLng, maxLat]]
}

/**
 * City coordinates for major Austrian cities
 */
export const CITY_COORDINATES: Record<
  string,
  { center: Coordinates; bbox: [[number, number], [number, number]] }
> = {
  Vienna: {
    center: { lng: 16.3738, lat: 48.2082 },
    bbox: [
      [16.1825, 48.1182], // Southwest corner
      [16.5776, 48.3226], // Northeast corner
    ],
  },
  Wien: {
    center: { lng: 16.3738, lat: 48.2082 },
    bbox: [
      [16.1825, 48.1182],
      [16.5776, 48.3226],
    ],
  },
  Graz: {
    center: { lng: 15.4395, lat: 47.0707 },
    bbox: [
      [15.3495, 46.9907],
      [15.5295, 47.1507],
    ],
  },
  Linz: {
    center: { lng: 14.2858, lat: 48.3069 },
    bbox: [
      [14.1958, 48.2269],
      [14.3758, 48.3869],
    ],
  },
  Salzburg: {
    center: { lng: 13.055, lat: 47.8095 },
    bbox: [
      [12.965, 47.7295],
      [13.145, 47.8895],
    ],
  },
  Innsbruck: {
    center: { lng: 11.3926, lat: 47.2692 },
    bbox: [
      [11.3026, 47.1892],
      [11.4826, 47.3492],
    ],
  },
  Klagenfurt: {
    center: { lng: 14.3055, lat: 46.6244 },
    bbox: [
      [14.2155, 46.5444],
      [14.3955, 46.7044],
    ],
  },
};

/**
 * Get bounding box for a location string
 * @param location - City name or location string
 * @returns Bounding box coordinates or null if not found
 */
export function getBboxForLocation(
  location: string
): [[number, number], [number, number]] | null {
  const normalizedLocation = location.trim();

  // Direct city match
  const cityData = CITY_COORDINATES[normalizedLocation];
  if (cityData) {
    return cityData.bbox;
  }

  // Case-insensitive search
  const lowerLocation = normalizedLocation.toLowerCase();
  for (const [city, data] of Object.entries(CITY_COORDINATES)) {
    if (city.toLowerCase() === lowerLocation) {
      return data.bbox;
    }
  }

  // Partial match (e.g., "Vien" matches "Vienna")
  for (const [city, data] of Object.entries(CITY_COORDINATES)) {
    if (city.toLowerCase().startsWith(lowerLocation)) {
      return data.bbox;
    }
  }

  return null;
}

/**
 * Get center coordinates for a location string
 * @param location - City name or location string
 * @returns Center coordinates or null if not found
 */
export function getCenterForLocation(location: string): Coordinates | null {
  const normalizedLocation = location.trim();

  const cityData = CITY_COORDINATES[normalizedLocation];
  if (cityData) {
    return cityData.center;
  }

  // Case-insensitive search
  const lowerLocation = normalizedLocation.toLowerCase();
  for (const [city, data] of Object.entries(CITY_COORDINATES)) {
    if (city.toLowerCase() === lowerLocation) {
      return data.center;
    }
  }

  return null;
}

/**
 * Calculate bounding box from center point and radius (in km)
 * @param center - Center coordinates
 * @param radiusKm - Radius in kilometers
 * @returns Bounding box
 */
export function getBboxFromRadius(
  center: Coordinates,
  radiusKm: number = 10
): [[number, number], [number, number]] {
  // Rough approximation: 1 degree latitude ≈ 111 km, 1 degree longitude ≈ 111 km * cos(latitude)
  const latDegrees = radiusKm / 111;
  const lngDegrees = radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180));

  return [
    [center.lng - lngDegrees, center.lat - latDegrees], // Southwest
    [center.lng + lngDegrees, center.lat + latDegrees], // Northeast
  ];
}

/**
 * Check if coordinates are within a bounding box
 * @param coords - Coordinates to check
 * @param bbox - Bounding box
 * @returns True if coordinates are within bbox
 */
export function isInBoundingBox(
  coords: Coordinates,
  bbox: [[number, number], [number, number]]
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bbox;
  return (
    coords.lng >= minLng &&
    coords.lng <= maxLng &&
    coords.lat >= minLat &&
    coords.lat <= maxLat
  );
}

/**
 * Format bounding box for display
 * @param bbox - Bounding box
 * @returns Formatted string
 */
export function formatBbox(bbox: [[number, number], [number, number]]): string {
  const [[minLng, minLat], [maxLng, maxLat]] = bbox;
  return `SW: ${minLat.toFixed(4)}, ${minLng.toFixed(4)} - NE: ${maxLat.toFixed(
    4
  )}, ${maxLng.toFixed(4)}`;
}

/**
 * Get default Vienna bounding box
 * This is the bbox from the live site for Vienna
 */
export function getDefaultViennaBbox(): [[number, number], [number, number]] {
  return [
    [15.97407557372918, 47.875726161656644], // Southwest
    [16.768524426270902, 48.538330669849046], // Northeast
  ];
}
