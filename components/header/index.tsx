"use client";

import { SearchBar, RentBuyToggle, MobileSearchModal } from "@/modules/search";
import { useSearchStore } from "@/modules/search/store";
import { Globe, User, Search, Menu } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Header() {
  const [rentBuyValue, setRentBuyValue] = useState<"rent" | "buy" | "ai">(
    "rent"
  );
  const { isAnyPopoverOpen, exitSearchMode, isInSearchMode, openMobileSearch } =
    useSearchStore();

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

            {/* Search Bar Trigger */}
            <button
              onClick={openMobileSearch}
              className="flex-1 flex items-center gap-3 h-12 px-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400 text-left truncate">
                City District, Street, Postcode
              </span>
            </button>

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
                isInSearchMode ? "max-w-4xl" : "max-w-2xl"
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
            <div className="flex items-center space-x-4 self-start pt-6">
              {/* Language Selector */}
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline">EN</span>
              </button>

              {/* Sign In */}
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
