export interface SearchFilters {
  location: string;
  propertyType: string;
  priceRange: string;
}

export interface SearchState {
  filters: SearchFilters;
  isSearching: boolean;
  results: any[];
}

export interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}
