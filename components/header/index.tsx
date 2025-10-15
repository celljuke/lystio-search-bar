"use client";

import { SearchBar, RentBuyToggle } from "../../modules/search";
import { useSearchStore } from "../../modules/search/store";
import { Globe, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Header() {
  const [rentBuyValue, setRentBuyValue] = useState<"rent" | "buy">("rent");
  const { isAnyPopoverOpen } = useSearchStore();

  return (
    <>
      {/* Overlay when dropdown is open */}
      {isAnyPopoverOpen() && <div className="fixed inset-0 bg-black/20 z-40" />}

      <nav
        className={`w-full divide-y bg-white sticky top-0 z-50 shadow-none lg:shadow-sm transition-all duration-200 ${
          isAnyPopoverOpen() ? "h-44" : "h-20"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
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

            {/* Search Bar - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8 flex-col space-y-4">
              {isAnyPopoverOpen() && (
                <RentBuyToggle
                  value={rentBuyValue}
                  onChange={setRentBuyValue}
                />
              )}
              <SearchBar />
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
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

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4 space-y-4">
            {isAnyPopoverOpen() && (
              <RentBuyToggle value={rentBuyValue} onChange={setRentBuyValue} />
            )}
            <SearchBar />
          </div>
        </div>
      </nav>
    </>
  );
}
