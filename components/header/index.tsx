"use client";

import { SearchBar, RentBuyToggle, MobileSearchModal } from "@/modules/search";
import { useSearchStore } from "@/modules/search/store";
import { useLocationSelect } from "@/modules/search";
import {
  Globe,
  User,
  Search,
  Menu,
  X,
  Home,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Header() {
  const [rentBuyValue, setRentBuyValue] = useState<"rent" | "buy" | "ai">(
    "rent"
  );
  const {
    isAnyPopoverOpen,
    exitSearchMode,
    isInSearchMode,
    openMobileSearch,
    filters,
  } = useSearchStore();
  const { selectDefaultVienna } = useLocationSelect();

  return (
    <>
      {/* Overlay when dropdown is open (Desktop only) */}
      {isAnyPopoverOpen() && (
        <div
          className="search-overlay fixed inset-0 bg-black/20 z-40 hidden md:block"
          onClick={() => exitSearchMode()}
        />
      )}

      {/* Mobile Search Modal */}
      <MobileSearchModal />

      <nav
        className={cn(
          "w-full divide-y bg-white sticky top-0 z-50 shadow-none lg:shadow-sm transition-all duration-200",
          isAnyPopoverOpen() ? "md:h-44 h-auto" : "md:h-20 h-auto"
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8 h-full">
          {/* Mobile Layout */}
          <div className="md:hidden flex items-center gap-3 h-16 px-0">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <a href="/">
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  width={80}
                  height={38}
                  priority={true}
                />
              </a>
            </div>

            {/* Search Bar Trigger / Selected Location */}
            {filters.location ? (
              <div
                onClick={openMobileSearch}
                className="flex-1 flex items-center gap-2 h-12 px-3 bg-gray-50 border border-purple-100 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center flex-1">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full flex-shrink-0">
                    <span className="text-sm font-medium text-gray-900">
                      {filters.location}
                    </span>
                    {filters.location.toLowerCase() !== "vienna" && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          selectDefaultVienna();
                        }}
                        className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center hover:bg-[#7C3AED] transition-colors cursor-pointer"
                        aria-label="Reset to Vienna"
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            ) : (
              <button
                onClick={openMobileSearch}
                className="flex-1 flex items-center gap-3 h-12 px-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400 text-left truncate">
                  City District, Street, Postcode
                </span>
              </button>
            )}

            {/* Menu Button */}
            <button
              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          {/* Desktop Layout */}
          <div
            className={cn(
              "hidden md:flex items-center justify-between transition-all duration-200",
              isAnyPopoverOpen() ? "h-full" : "h-20"
            )}
          >
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center self-start pt-6">
              <a href="/">
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  width={80}
                  height={38}
                  priority={true}
                />
              </a>
            </div>

            {/* Search Area - Rent/Buy toggle above, Search Bar below */}
            <div
              className={cn(
                "flex flex-1 mx-8 flex-col items-center transition-all duration-200",
                isAnyPopoverOpen() ? "gap-3 justify-center" : "justify-center",
                isInSearchMode ? "max-w-4xl" : "max-w-lg"
              )}
            >
              {/* Rent/Buy Toggle - Only visible in search mode */}
              {isAnyPopoverOpen() && (
                <div className="w-full flex justify-center">
                  <RentBuyToggle
                    value={rentBuyValue}
                    onChange={setRentBuyValue}
                  />
                </div>
              )}

              {/* Search Bar */}
              <div className="w-full">
                <SearchBar rentBuyMode={rentBuyValue} />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4 self-start pt-6">
              {/* Create Listing Button */}
              <Button
                variant="ghost"
                className="relative px-4 py-2 h-auto text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-purple-50 font-medium text-base"
              >
                <Home className="w-5 h-5 mr-2" />
                Create Listing
                <Badge
                  variant="default"
                  className="absolute -top-2 -right-2 bg-[#8B5CF6] text-white text-xs px-2 py-0.5 rounded-full rotate-[10deg]"
                >
                  It's FREE
                </Badge>
              </Button>

              {/* Favorites / Heart Icon */}
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-6 h-6 text-gray-700" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full"
                >
                  21
                </Badge>
              </button>

              {/* Language Selector with Flag */}
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-200">
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 bg-black"></div>
                    <div className="flex-1 bg-red-600"></div>
                    <div className="flex-1 bg-yellow-400"></div>
                  </div>
                  <Globe className="absolute inset-0 m-auto w-4 h-4 text-white mix-blend-difference" />
                </div>
              </button>

              {/* User Profile Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full transition-colors">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                      <Image
                        src="/images/selcuk_photo.jpeg"
                        alt="Selcuk"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-56 p-0 bg-white border border-gray-200 rounded-xl shadow-lg"
                >
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        Selcuk
                      </p>
                      <p className="text-xs text-gray-500">
                        selcuk@example.com
                      </p>
                    </div>
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        My Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        My Listings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Favorites
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Settings
                      </button>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
