"use client";

import { Search, Menu, X } from "lucide-react";
import Image from "next/image";

interface MobileHeaderProps {
  location: string | null;
  onSearchClick: () => void;
  onLocationReset: () => void;
}

export function MobileHeader({
  location,
  onSearchClick,
  onLocationReset,
}: MobileHeaderProps) {
  return (
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
      {location ? (
        <div
          onClick={onSearchClick}
          className="flex-1 flex items-center gap-2 h-12 px-3 bg-gray-50 border border-purple-100 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="flex items-center flex-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full flex-shrink-0">
              <span className="text-sm font-medium text-gray-900">
                {location}
              </span>
              {location.toLowerCase() !== "vienna" && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocationReset();
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
          onClick={onSearchClick}
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
  );
}
