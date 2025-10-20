export interface PropertyTypeFilter {
  categoryId: string;
  categoryName: string;
  subcategories: string[]; // Array of subcategory IDs
}

export interface PriceRangeFilter {
  min: number;
  max: number;
  currency: string;
}

export interface LocationFilter {
  name: string; // Display name (e.g., "Vienna")
  withinId?: string[]; // Array of district IDs for API filtering (e.g., ["osm:b4:-109166:b9:-1990592"])
  bbox?: [[number, number], [number, number]]; // [[minLng, minLat], [maxLng, maxLat]] - for map display
  center?: { lng: number; lat: number }; // Optional center coordinates
}

export interface SearchFilters {
  location: string; // For backward compatibility and display
  locationData: LocationFilter | null; // Actual location data with bbox
  propertyType: PropertyTypeFilter | null;
  priceRange: PriceRangeFilter | null;
}

export interface SearchState {
  filters: SearchFilters;
  isSearching: boolean;
  results: any[];
}

export interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
  rentBuyMode?: "rent" | "buy" | "ai";
}

export interface Subcategory {
  id: string;
  name: string;
  count: number;
  subTypeId?: number; // Numeric ID for backend filtering
}

export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  typeId?: number; // Numeric ID for backend filtering
  hasSubcategories?: boolean;
  subcategories?: Subcategory[];
}
