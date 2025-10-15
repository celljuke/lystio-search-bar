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

export interface SearchFilters {
  location: string;
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
}

export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  hasSubcategories?: boolean;
  subcategories?: Subcategory[];
}
