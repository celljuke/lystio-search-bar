"use client";

import { SearchBar, RentBuyToggle } from "@/modules/search";
import { useSearchStore } from "@/modules/search/store";
import { Globe, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Header() {
  const [rentBuyValue, setRentBuyValue] = useState<"rent" | "buy" | "ai">(
    "rent"
  );
  const { isAnyPopoverOpen, exitSearchMode, isInSearchMode } = useSearchStore();

  return (
    <>
      {/* Overlay when dropdown is open */}
      {isAnyPopoverOpen() && (
        <div
          className="search-overlay fixed inset-0 bg-black/20 z-40"
          onClick={() => exitSearchMode()}
        />
      )}

      <nav
        className={cn(
          "w-full divide-y bg-white sticky top-0 z-50 shadow-none lg:shadow-sm transition-all duration-200",
          isAnyPopoverOpen() ? "h-44" : "h-20"
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8 h-full">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-200",
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
                <SearchBar />
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
