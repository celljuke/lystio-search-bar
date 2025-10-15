"use client";

import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { SearchBarProps } from "../types";
import { useSearch } from "../hooks/use-search";
import { useSearchStore } from "../store";
import { cn } from "../../../lib/utils";

export function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const { filters, isSearching, updateFilter, performSearch } = useSearch();
  const { isOpen, toggle } = useSearchStore();

  const handleSearch = async () => {
    if (filters.location && filters.propertyType && filters.priceRange) {
      await performSearch(filters);
      onSearch?.(filters);
    }
  };

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto", className)}>
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="relative bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 flex items-center h-14">
          {/* Location Button */}
          <Popover
            open={isOpen("location")}
            onOpenChange={() => toggle("location")}
          >
            <PopoverTrigger asChild>
              <Button
                className="flex h-full w-40 items-center justify-start rounded-l-full hover:bg-gray-50 px-4 py-2 cursor-pointer bg-transparent border-none"
                type="button"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-normal text-black">
                    Location
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 font-sans" align="start">
              <div className="space-y-4">
                <Button variant="ghost" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Draw an area on the map
                </Button>

                <div>
                  <h4 className="font-medium mb-2">By City</h4>
                  <div className="grid grid-cols-2 gap-2"></div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">By State</h4>
                  <div className="space-y-2"></div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-200" />

          {/* Category Button */}
          <Popover
            open={isOpen("category")}
            onOpenChange={(open) => toggle("category")}
          >
            <PopoverTrigger asChild>
              <button
                className="flex h-full w-40 items-center justify-start hover:bg-gray-50 px-4 py-2 cursor-pointer bg-transparent border-none"
                type="button"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-normal text-black">
                    Apartments
                  </span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="start">
              <div className="space-y-2">
                {["Apartments", "Houses", "Commercial", "Land"].map((type) => (
                  <Button
                    key={type}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      updateFilter("propertyType", type);
                      toggle("category");
                    }}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    {type}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-200" />

          {/* Price Button */}
          <Popover open={isOpen("price")} onOpenChange={() => toggle("price")}>
            <PopoverTrigger asChild>
              <button
                className="flex h-full flex-1 items-center justify-start rounded-r-full hover:bg-gray-50 px-4 py-2 cursor-pointer bg-transparent border-none"
                type="button"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-normal text-black">Price</span>
                  {filters.priceRange && (
                    <p className="text-base text-gray-500">
                      {filters.priceRange}
                    </p>
                  )}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4"
              align="start"
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Under €500",
                      "€500 - €1000",
                      "€1000 - €1500",
                      "€1500 - €2000",
                      "€2000 - €3000",
                      "Over €3000",
                    ].map((range) => (
                      <Button
                        key={range}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          updateFilter("priceRange", range);
                          toggle("price");
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Button */}
          <div className="flex h-full items-center justify-center py-2 px-2">
            <Button
              onClick={handleSearch}
              className="h-12 w-12 rounded-full bg-[#A540F3] hover:bg-[#9338D1] disabled:bg-gray-300"
            >
              <Search className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
