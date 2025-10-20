"use client";

import { MobileSearchModal, useRentBuyMode } from "@/modules/search";
import { useSearchStore } from "@/modules/search/store";
import { useLocationSelect } from "@/modules/search";
import { cn } from "@/lib/utils";
import { HeaderActions } from "./header-actions";
import { HeaderLogo } from "./header-logo";
import { MobileHeader } from "./mobile-header";
import { DesktopSearchArea } from "./desktop-search-area";

export function Header() {
  const { mode: rentBuyMode, setMode: setRentBuyMode } = useRentBuyMode();

  // Map "ai" mode to "rent" for now (since API doesn't support AI mode yet)
  const rentBuyValue = rentBuyMode as "rent" | "buy" | "ai";

  const handleRentBuyChange = (value: "rent" | "buy" | "ai") => {
    // Only set mode if it's "rent" or "buy" (ignore "ai" for now)
    if (value === "rent" || value === "buy") {
      setRentBuyMode(value);
    }
  };

  const {
    isAnyPopoverOpen,
    exitSearchMode,
    isInSearchMode,
    openMobileSearch,
    filters,
  } = useSearchStore();
  const { selectDefaultVienna } = useLocationSelect();

  const handleCreateListing = () => {
    console.log("Create listing clicked");
    // Add your create listing logic here
  };

  const handleSignOut = () => {
    console.log("Sign out clicked");
    // Add your sign out logic here
  };

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
          <MobileHeader
            location={filters.location}
            onSearchClick={openMobileSearch}
            onLocationReset={selectDefaultVienna}
          />

          {/* Desktop Layout */}
          <div
            className={cn(
              "hidden md:flex items-center justify-between transition-all duration-200",
              isAnyPopoverOpen() ? "h-full" : "h-20"
            )}
          >
            {/* Logo */}
            <HeaderLogo />

            {/* Search Area */}
            <DesktopSearchArea
              rentBuyValue={rentBuyValue}
              onRentBuyChange={handleRentBuyChange}
              isPopoverOpen={isAnyPopoverOpen()}
              isInSearchMode={isInSearchMode}
            />

            {/* Right side actions */}
            <HeaderActions
              onCreateListing={handleCreateListing}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      </nav>
    </>
  );
}
